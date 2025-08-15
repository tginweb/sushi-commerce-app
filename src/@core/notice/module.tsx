import {TAppStores, TComponentRenderers, TDeferredFetchTask} from "@core/main/types"

export function modals(list: TComponentRenderers) {

    const NoticesModal = require('~com/notify/dialog/notices').default
    const NoticeModal = require('~com/notify/dialog/notice').default

    list.push({
        component: ({index}) => <NoticeModal key={index}/>,
        condition: ({stores}) => stores.noticeDialog.visible
    })

    list.push({
        name: 'notices',
        open: ({stores}) => stores.noticesDialog.show(),
        component: ({index}) => <NoticesModal key={index}/>,
        condition: ({stores}) => stores.noticesDialog.visible
    })
}

export function deferredFetchTasks(tasks: TDeferredFetchTask[], stores: TAppStores) {
    /*
    tasks.push({
        name: 'notices',
        task: stores.notice.fetchNotices,
        onResolve: stores.notice.showNewNotices,
        args: [{limit: 100}]
    })
     */
    return tasks
}

export function scopeQuery(query: any, name: string) {

    switch (name) {
        case 'user':
            query = query.add(require('./gql/scope/user').default, {})
            break
    }

    return query
}
