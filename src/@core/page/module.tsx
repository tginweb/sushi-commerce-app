import {TComponentRenderers} from "@core/main/types";

export function scopeQuery(query: any, name: string) {

    switch (name) {
        case 'app':
            query = query.add(require('./gql/scope/app').default, {})
            break
    }

    return query
}

export function modals(list: TComponentRenderers) {
    const PageModal = require('~com/page/dialog/page').default
    list.push({
        component: ({index}) => <PageModal key={index}/>,
        condition: ({stores}) => stores.pageDialog.visible
    })
}

