import {TComponentRenderers} from "@core/main/types";
import React from "react";

export function scopeQuery(query: any, name: string) {

    switch (name) {
        case 'boot':
            query = query.add(require('./gql/scope/boot').default, {})
            break
        case 'session':
           // query = query.add(require('./gql/scope/session').default, {})
            break
        case 'user':
            query = query.add(require('./gql/scope/user').default, {})
            break
    }

    return query
}


export function modals(list: TComponentRenderers) {
    const LogoutDialog = require('~com/user/dialog/logout').default

    list.push(
        {
            name: 'logout',
            component: ({index}) => <LogoutDialog key={index}/>,
            condition: ({stores}: any) => stores.logoutDialog.visible,
            open: ({stores}) => stores.logoutDialog.show(),
        },
    )
}


