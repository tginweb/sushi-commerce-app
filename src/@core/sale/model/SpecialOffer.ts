import {computed} from "mobx"
import {ProductModel} from "@core/catalog/model/Product";
import {SpecialOffer} from "~gql/api";
import {logComputed} from "@core/main/lib/mobx/log-computed";

export class SpecialOfferModel {

    MIN_PRICE?: number
    ELEMENT_ID?: number
    MODE?: string
    TYPE?: string
    TYPE_INFO?: {
        NAME: string
        CODE: string
        COLOR: string
    }
    ELEMENT?: ProductModel

    constructor(data: SpecialOffer, observer: boolean = true) {

        Object.assign(this as any, data)

        //if (observer) makeObservable(this)
    }

    @computed get product(): ProductModel | undefined {
        logComputed(this, 'product')
        if (this.ELEMENT_ID)
            return this.getProductFromCatalog(this.ELEMENT_ID)
    }

    getProductFromCatalog(productId: number) {
        const stores = require('~stores').stores
        return stores.catalog.productById[productId]
    }
}



