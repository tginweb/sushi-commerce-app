import {TComponentRenderers} from "@core/main/types";
import React from "react";


export function scopeQuery(query: any, name: string) {

    switch (name) {
        case 'app':
            query = query.add(require('./gql/scope/app').default, {})
            break
    }

    return query
}

export function modals(list: TComponentRenderers) {
    const OfficeModal = require('~com/company/dialog/office-modal').default
    list.push({
        component: ({index}) => <OfficeModal key={index}/>,
        condition: ({stores}: any) => stores.company.officeModal.visible
    })
}

