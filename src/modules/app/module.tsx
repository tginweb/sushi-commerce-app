import {TComponentRender, TComponentRenderers} from "@core/main/types";
import React from "react";
import App from "@core/main/lib/app";

export function scopeQuery(query: any, name: string) {

    return query
}

export function modals(list: TComponentRenderers) {
    const ContactsModal = require('~com/app/dialog/contacts').default

    list.push({
        name: 'contacts',
        component: ({index}) => <ContactsModal key={index}/>,
        condition: ({stores}: any) => stores.contactsDialog.visible,
        open: ({stores}) => stores.contactsDialog.show(),
    })
}

export function busComponents(list: TComponentRender[]) {
    const AppBus = require('~com/app/bus-components').AppBus
    list.push((index) => <AppBus key={'app'}/>)
}


export function componentsRegister(app: App) {
    require('~com/app/_register').default(app)
}
