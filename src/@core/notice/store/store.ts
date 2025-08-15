import {action, computed, makeObservable, observable} from "mobx"
import CommonStore from "@core/main/lib/store/common";
import {NoticeModel} from "@core/notice/model/Notice";
import {task} from "@core/main/lib/decorator/task";
import QUERY_NOTICE_LIST, {TQueryNoticeListTask} from "@core/notice/gql/query/list";
import MUTATE_SYNC_READED, {TNoticeSyncReadedTask} from "@core/notice/gql/mutation/sync_readed";
import {ClientNotice} from "~gql/api";
import {makePersistable} from "mobx-persist-store";
import {TGqlScopeNoticeUser} from "@core/notice/types";
import debounce from "@core/main/util/base/debounce";
import {MenuItemMobileExtended} from "@core/main/types";
import excludeEmptyFields from "@core/main/util/base/excludeEmptyFields";

export class NoticeStore extends CommonStore {

    @observable
    notices: NoticeModel[] = []

    @observable
    maxShownId: number = 0

    @observable
    readedIds: Record<any, boolean> = {}

    receivedNoticesIds: Record<any, number> = {}

    showNewNoticesDebounced: () => void = () => {
    }

    syncReadedDebounced: () => void = () => {
    }

    constructor() {
        super()
        makeObservable(this)
        makePersistable(this, {
            name: NoticeStore.name,
            properties: ['readedIds', 'maxShownId'],
        })
    }

    init() {
        this.bus().on('websocket:notice', this.onEventNewNotice.bind(this))
        this.showNewNoticesDebounced = debounce(() => this.showNewNotices(true), 2000)
        this.syncReadedDebounced = debounce(this.syncReaded.bind(this), 5000)
    }

    @action
    onEventNewNotice(noticeData: ClientNotice, onStartup = false) {

        console.log('onEventNewNotice', noticeData)
        console.log('onEventNewNotice is recieved', !!this.receivedNoticesIds[noticeData.id])

        if (this.receivedNoticesIds[noticeData.id])
            return;

        this.receivedNoticesIds[noticeData.id] = noticeData.id;

        const notice = this.prepareNotice(noticeData)

        const isNew = this.mergeNotice(notice)

        if (!onStartup) {
            if (isNew) {
                this.bus().emit('notice:event:' + notice.eventName, notice)
                this.showNewNoticesDebounced()
                this.stores().menu.runActionItems(notice.actionsEmitMobile)
            }
        }

        return notice
    }


    @computed
    get noticesLoading() {
        return this.fetchNotices.pending
    }

    getUnshownNotices() {
        return this.notices.filter((notice) => {
            return (this.maxShownId < notice.id) && !notice.isShown && !!notice.showAs
        })
    }

    @computed
    get unreadedNotices() {
        return this.notices.filter((notice) => !this.readedIds[notice.id] && !notice.getIsReaded())
    }


    @computed
    get unreadedNoticesExists() {
        return !!this.unreadedNotices.length
    }

    @computed
    get unreadedNoticesCount() {
        return this.unreadedNotices.length
    }

    @action
    setNoticeShown(notice: NoticeModel | number, setReadedIfNoBody = false) {
        const _notice = typeof notice === 'number' ? this.notices.find(item => item.id = notice) : notice
        if (_notice) {
            _notice.setIsShown(true)
            this.maxShownId = Math.max(this.maxShownId, _notice.id)
            if (setReadedIfNoBody && !_notice.haveBody) {
                this.setNoticeReaded(_notice)
            }
        }
    }

    @action
    setNoticesShown(notices: NoticeModel[], setReadedIfNoBody = false) {
        notices.forEach(notice => this.setNoticeShown(notice, setReadedIfNoBody))
    }

    @action
    setNoticeShownAll() {
        console.log('setNoticeShownAll')
        this.notices.forEach((notice) => {
            notice.setIsShown(true)
            this.maxShownId = Math.max(this.maxShownId, notice.id)
        })
    }

    @action
    setNoticeReaded(notice: NoticeModel | number) {
        const _notice = typeof notice === 'number' ? this.notices.find(item => item.id = notice) : notice
        if (_notice) {
            _notice.setIsReaded(true)
            _notice.setIsReadedLocal(true)
            _notice.setIsShown(true)

            this.maxShownId = Math.max(this.maxShownId, _notice.id)

            if (!this.readedIds[_notice.id]) {
                this.readedIds[_notice.id] = true
            }
        }
    }

    @action
    setNoticeReadedAll() {
        this.notices.forEach((notice) => {
            notice.setIsReadedLocal(true)
            this.readedIds[notice.id] = true
        })
    }

    @action
    setNoticeUnreadedAll() {
        this.readedIds = {}
        this.maxShownId = 0
    }

    @action
    prepareNotice(noticeData: Partial<ClientNotice>) {
        const notice = new NoticeModel(noticeData as ClientNotice)
        notice.setIsShown(notice.isReaded || this.maxShownId >= notice.id)
        notice.setIsReadedLocal(notice.isReaded || this.readedIds[notice.id])
        return notice
    }

    @action
    mergeNotices(noticesData: ClientNotice[]) {
        noticesData.forEach(noticeData => {
            this.mergeNotice(this.prepareNotice(noticeData))
        })
    }

    @action
    setNotices(noticesData: ClientNotice[]) {
        this.notices = noticesData.map(item => this.prepareNotice(item))
    }

    @action
    mergeNotice(notice: NoticeModel) {
        const foundNotice = this.notices.find(item => item.id === notice.id)
        if (foundNotice) {
            notice.setIsShown(foundNotice.isShown)
            notice.setIsReadedLocal(foundNotice.getIsReaded())
            return false
        } else {
            if (notice.eventGroup) {
                const foundNewestGroupNotice = this.notices.find(item => (item.eventGroup === notice.eventGroup) && (item.id > notice.id))
                if (foundNewestGroupNotice) {
                    notice.setIsShown(true)
                    notice.setIsReadedLocal(true)
                    return false
                }
                this.notices = this.notices.filter(item => item.eventGroup !== notice.eventGroup)
            }
            if (!notice.showAs) {
                notice.setIsShown(true)
            }
            this.notices.unshift(notice)
            return true
        }
    }

    @task
    syncReaded = (async () => {
        try {
            const readedIds = Object.keys(this.readedIds)

            this.stores().debug.info('Sync readed notices', {
                readedIds,
            }, {scope: 'store'})

            if (!readedIds.length)
                return;

            const res = await MUTATE_SYNC_READED.request({
                variables: {
                    ids: readedIds,
                }
            })

            if (res.state.success) {
                if (res.payload?.notices && !!res.payload?.notices.length) {
                    this.mergeNotices(res.payload.notices)
                }
                return res
            }
        } catch (e) {
            console.log(e)
        }
    }) as TNoticeSyncReadedTask

    @task
    fetchNotices = (async () => {
        try {
            const res = await QUERY_NOTICE_LIST.request({})
            this.setNotices(res)
            return res
        } catch (e) {
            console.log(e)
        }
    }) as TQueryNoticeListTask

    showNewNotices(run = false, priorityNotice?: number | NoticeModel) {

        let notices = this.getUnshownNotices() || []

        if (priorityNotice) {
            const priorityNoticeModel = typeof priorityNotice === 'number' ? this.notices.find(notice => notice.id === priorityNotice) : priorityNotice
            if (priorityNoticeModel && !priorityNoticeModel.isShown) {
                const foundIndex = notices.findIndex(notice => notice.id === priorityNoticeModel.id)
                if (foundIndex === -1) {
                    notices.unshift(priorityNoticeModel)
                } else if (foundIndex > 0) {
                    notices = notices.filter(notice => notice.id !== priorityNoticeModel.id)
                    notices.unshift(priorityNoticeModel)
                }
            }
        }

        this.stores().debug.info('showNewNotices', {
            IDS: notices.map(notice => notice.id),
            run
        }, {scope: 'boot'})

        const callback = notices.length ? () => {
            this.showNotices(notices)
        } : null

        return run ? callback && callback() : callback
    }

    @action
    showNotices(notices: NoticeModel[]) {

        const noticesAlert = notices.filter(notice => notice.showAs === 'alert')
        const noticesDialog = notices.filter(notice => notice.showAs === 'dialog')

        if (noticesDialog.length) {
            const firstNotice = noticesDialog[0]
            this.stores().noticeDialog.show({
                notice: firstNotice
            })
            this.setNoticeShown(firstNotice, true)
        }

        if (noticesAlert.length) {
            this.bus().showNotices(notices.map(notice => notice.getToastMessage()))
            this.setNoticesShown(noticesAlert, true)
        }
    }

    @action
    SCOPE_USER(data: TGqlScopeNoticeUser) {
        if (data.notices) {
            this.setNotices(data.notices)
        }
    }

    noticeActionsFilter(actions?: MenuItemMobileExtended[]) {
        console.log('noticeActionsFilter')
        const router = this.stores().router
        return excludeEmptyFields((actions || []).filter(action => {
            const url = action.action?.url
            if (url) {
                console.log({
                    'actionUrl': url,
                    'currentUrl': router.currentRoute
                })
                if (router.inCurrentRoute(url))
                    return false
            }
            return true
        }))
    }
}

export default NoticeStore
