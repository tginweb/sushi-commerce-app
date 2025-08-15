import {action, computed, makeObservable, observable} from "mobx"
import {ProductModel} from "@core/catalog/model/Product";
import {isPlainObject} from "is-plain-object"
import randID from "@core/main/util/base/randID";
import getBasketPropsHash from "@core/sale/util/getBasketPropsHash";
import {BasketItem, BasketItemProp, ProductElement} from "~gql/api";
import {TBasketInputProps} from "@core/sale/types";
import {logComputed} from "@core/main/lib/mobx/log-computed";

let newId = -1

export class BasketItemModel {

    @observable
    CLIENT_ID?: string

    @observable
    ID: number = 0

    @observable
    SYNCED: boolean = false

    @observable
    FETCHED: boolean = false

    NAME?: string = ''
    HASH?: string = ''

    PRODUCT_ID: number = 0
    PRODUCT?: ProductModel | null = null
    PROPS: BasketItemProp[] = []

    @observable
    PRICE: number = 0

    @observable
    PRICE_BASE: number = 0

    @observable
    QUANTITY: number = 1

    @observable
    INPUT_PROPS: TBasketInputProps = {}

    @observable
    INPUT_PROPS_HASH?: string = ''

    @observable
    propValue: Record<string, any> = {}

    @observable
    prop: Record<string, BasketItemProp> = {}

    constructor(data: BasketItem & Partial<BasketItemConstruct>, observer: boolean = true) {

        Object.assign(this as any, data)

        if (!data.ID) {
            this.ID = newId--
            this.FETCHED = false
        } else {
            this.FETCHED = true
        }

        if (!data.CLIENT_ID) {
            this.CLIENT_ID = randID()
        }

        if (!data.INPUT_PROPS_HASH && 'INPUT_PROPS' in data) {
            this.INPUT_PROPS_HASH = getBasketPropsHash(data.INPUT_PROPS || {})
        }

        let product = data.ELEMENT

        if (product) {
            this.setProduct(product)
            this.setFieldsFromProduct()
        }

        this.indexProps()

        if (observer)
            makeObservable(this);
    }

    setInputProps(inputProps: TBasketInputProps) {
        for (const [code, value] of Object.entries(inputProps)) {
            this.INPUT_PROPS[code] = value
        }
    }

    setProps(props: Record<string, BasketItemProp>) {
        for (const [code, value] of Object.entries(props)) {
            let prop: BasketItemProp | undefined = this.PROPS.find(prop => prop.CODE === code)
            if (!prop) {
                this.PROPS.push(value)
            } else {
                Object.assign(prop, value)
            }
        }
    }

    setProduct(product: ProductModel | Partial<ProductElement>) {
        if (isPlainObject(product)) {
            product = new ProductModel(product as ProductElement, true)
        }
        this.PRODUCT = product as ProductModel
        this.setFieldsFromProduct()
    }

    @action
    indexProps() {
        for (let prop of this.PROPS) {
            if (prop.CODE) {
                this.prop[prop.CODE] = prop
                this.propValue[prop.CODE] = prop.VALUE
            }
        }
    }

    @action
    setFieldsFromProduct() {
        const product = this.product
        if (product) {
            if (!this.PRICE_BASE && product.PRICE && product.PRICE.PRICE) {
                this.PRICE_BASE = product.PRICE.PRICE
            }
            if (!this.NAME) {
                this.NAME = product.NAME
            }
        }
    }

    @computed
    get priceBase(): number {
        logComputed(this, 'priceBase')
        return this.PRICE_BASE || 0
    }


    @computed
    get finalPriceBase(): number {
        logComputed(this, 'finalPriceBase')
        return this.priceBase * this.QUANTITY
    }

    @computed
    get name(): string | undefined {
        logComputed(this, 'name')
        return this.product ? this.product.nameCleaned : this.NAME
    }

    @computed
    get imageSrc() {
        logComputed(this, 'imageSrc')
        const product = this.product
        if (product) {
            return product.imageSrcRequired
        }
        return undefined
    }

    @computed get product(): ProductModel {
        logComputed(this, 'product')
        return this.PRODUCT || this.getProductFromCatalog(this.PRODUCT_ID)
    }

    @computed({keepAlive: true})
    get filling() {
        if (this.propValue.FILLING_NAME) {
            return this.propValue.FILLING_NAME
        } else if (this.product) {
            const sostavItems = this.product.BUILD?.SOSTAV || []
            if (sostavItems.length) {
                return sostavItems.slice(1, sostavItems.length).map(item => item.ELEMENT?.NAME + (item.QUANTITY && item.QUANTITY > 1 ? ' x' + item.QUANTITY : '')).join(', ')
            }
        }
    }

    @computed
    get canBy(): boolean {
        return this.product && this.product.ACTIVE
    }

    getProductFromCatalog(productId: number) {
        const stores = require('~stores').stores
        return stores.catalog.productById[productId]
    }

    getSaveData() {
        return {
            isNew: this.ID < 0,
            id: this.ID,
            clientId: this.CLIENT_ID,
            productId: this.PRODUCT_ID,
            quantity: this.QUANTITY,
            props: this.INPUT_PROPS
        }
    }
}

export type BasketItemConstruct = BasketItem & {
    ELEMENT?: ProductModel | ProductElement
    INPUT_PROPS?: Record<string, any>
    CONSTRUCTOR: any
    CONSTRUCTOR_SECTION_ID: number
    CONSTRUCTOR_SECTION_CODE: string
}

