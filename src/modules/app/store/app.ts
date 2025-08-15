import {action, makeObservable} from "mobx"
import CommonStore from "@core/main/lib/store/common";
import * as Notifications from "expo-notifications";
import {NoticeModel} from "@core/notice/model/Notice";
import {Platform} from "react-native";

export class AppStore extends CommonStore {


    constructor() {
        super()
        makeObservable(this)
    }

    boot() {
        this.bus().on('scope:fetched', this.onScopeFetched)
    }

    @action
    onScopeFetched(scope: string) {

    }

    @action
    async alertsQueueFill(isStartup = false) {

        const router = this.stores().router

        router.alertsQueueClear()

        let startupNotice: NoticeModel | null = null

        if (isStartup) {
            let notification
            if (Platform.OS !== "web") {
                notification = await Notifications.getLastNotificationResponseAsync()
            }
            if (notification) {
                this.stores().debug.info('Startup push notification', {
                    identifier: notification.notification.request.identifier
                })
                const push = this.stores().push.notificationPrepare(notification)
                if (push.notice) {
                    startupNotice = this.stores().notice.onEventNewNotice(push.notice, isStartup)
                    this.stores().debug.info('Startup push notice', {
                        startupNotice
                    })
                }
            }
        }

        if (startupNotice) {
            if (startupNotice.offerId) {
                router.alertsQueueAdd(this.stores().offer.showNewOffers(false, startupNotice.offerId))
            } else {
                router.alertsQueueAdd(() => {
                    this.stores().notice.showNewNotices(true, startupNotice)
                    if (startupNotice && startupNotice.getStartupRunAction())
                        this.stores().menu.runAction(startupNotice.getStartupRunAction())
                })
                router.alertsQueueAdd(this.stores().offer.showNewOffers(false))
            }
        } else {
            router.alertsQueueAdd(this.stores().offer.showNewOffers(false))
            router.alertsQueueAdd(this.stores().notice.showNewNotices(false))
        }

        router.alertsQueueAdd(this.stores().sale.showUserGifts())
    }

    getApp() {
        return require('~modules/info').app
    }
}

export default AppStore



