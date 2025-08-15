import {TComponentRenderers} from "@core/main/types";

export function scopeQuery(query: any, name: string) {
    switch (name) {
        case 'app':
            query = query.add(require('./gql/scope/app').default, {})
            break
        case 'user':
            query = query.add(require('./gql/scope/user').default, {})
            break
    }
    return query
}

export function modals(list: TComponentRenderers) {
    const OfferModal = require('~com/offer/dialog/offer').default
    list.push({
        component: ({index}) => <OfferModal key={index}/>,
        condition: ({stores}) => stores.offer.dialog.visible
    })
}


