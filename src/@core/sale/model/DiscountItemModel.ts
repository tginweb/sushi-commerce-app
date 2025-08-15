import {Discount, DiscountCondition, DiscountItem} from "~gql/api";
import {TTemplateValueWrapper} from "@core/main/types";
import reactTemplater from "@core/main/util/react/reactTemplater";
import {computed} from "mobx";
import templater from "@core/main/util/base/templater";

export class DiscountItemModel {

    ID: number | null = null
    CODE: string = ''
    NAME: string = ''
    NAME_TEMPLATE: string = ''
    PERCENT: number = 0
    HOTEST: boolean = false
    DISCOUNT?: Discount
    CONDITIONS?: DiscountCondition[]

    constructor(data: DiscountItem, observer = false) {
        Object.assign(this as any, data)
    }

    getTemplateVars() {
        return {
            PERCENT: this.PERCENT,
            PERCENT_FULL: this.PERCENT + '%',
        }
    }

    getTemplatedReact(key: 'NAME_TEMPLATE', valueWrapper?: TTemplateValueWrapper) {
        return reactTemplater(this.NAME_TEMPLATE, this.getTemplateVars(), valueWrapper)
    }

    @computed
    get nameTemplated() {
        return templater(this.NAME_TEMPLATE, this.getTemplateVars())
    }

    @computed
    get nameTemplatedShort() {
        return this.nameTemplated.replace(/Скидка\s*/i, '')
    }
}
