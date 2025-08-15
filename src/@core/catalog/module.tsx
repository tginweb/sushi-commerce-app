import {TComponentRenderers} from "@core/main/types"
import React from "react"
import App from "@core/main/lib/app";

export function scopeQuery(query: any, name: string) {

    switch (name) {
        case 'app':
            query = query.add(require('./gql/scope/app').default, {})
            break
    }

    return query
}

export function modals(list: TComponentRenderers) {

    const ProductPrimaryDialog = require('~com/catalog/dialog/product/primary').default
    const ProductSecondaryDialog = require('~com/catalog/dialog/product/secondary').default

    const SectionsDialog = require('~com/catalog/dialog/sections-dialog').default
    const ConstructorDialog = require('~com/catalog/dialog/constructor-dialog').default

    list.push({
        component: ({index}) => <ProductPrimaryDialog key={index}/>,
        condition: ({stores}) => stores.productPrimaryDialog.visible
    })

    list.push({
        component: ({index}) => <ProductSecondaryDialog key={index}/>,
        condition: ({stores}) => stores.productSecondaryDialog.visible
    })

    list.push({
        component: ({index}) => <ConstructorDialog key={index}/>,
        condition: ({stores}) => stores.catalogConstructor.dialog.visible
    })

    list.push({
        name: 'catalog.menu',
        open: ({stores}) => stores.sectionsDialog.show(),
        component: ({index}) => <SectionsDialog key={index}/>,
        condition: ({stores}) => stores.sectionsDialog.visible
    })
}

export function componentsRegister(app: App) {
    require('~com/catalog/_register').default(app)
}
