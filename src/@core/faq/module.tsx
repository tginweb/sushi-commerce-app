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

    const FaqDialog = require('~com/faq/dialog/faq').FaqDialog

    list.push({
        name: 'faq',
        open: ({stores}) => stores.faqDialog.show(),
        component: ({index}) => <FaqDialog key={index}/>,
        condition: ({stores}) => stores.faqDialog.visible
    })

}

