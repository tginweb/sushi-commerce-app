import {ElementModel} from "@core/main/model/Element";
import {MenuItem, PromoElement} from "~gql/api";
import {makeObservable} from "mobx";

export class PromoElementModel extends ElementModel {

    MOBILE_APP_ACTION?: MenuItem

    constructor(data?: PromoElement, observer: boolean = true) {
        super(null, false)
        if (data) {
            Object.assign(this as any, data)
            this.indexProps(this.PROPS)
        }
        if (observer)
            makeObservable(this)
    }
}

