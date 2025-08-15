import {TComponentRenderers} from "@core/main/types";
import React from "react";


export function modals(list: TComponentRenderers) {
    const DevModal = require('~com/app/dialog/dev').DevModal
    const DevAccessModal = require('~com/app/dialog/dev-access').DevAccessModal

    list.push(
        {
            component: ({index}) => <DevModal key={index}/>,
            condition: ({stores}: any) => stores.debug.devModal.visible
        },
        {
            component: ({index}) => <DevAccessModal key={index}/>,
            condition: ({stores}: any) => stores.debug.devAccessModal.visible
        },
    )
}

export function scopeQuery(query: any, name: string) {

    switch (name) {
        case 'boot':
            query = query.add(require('./gql/scope/boot').default, {})
            break
        case 'app':
            query = query.add(require('./gql/scope/app').default, {})
            break
    }

    return query
}
