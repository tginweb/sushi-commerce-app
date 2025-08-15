import {makeObservable} from "mobx"
import {ElementModel} from "@core/main/model/Element"
import {ConstructorBuild, ProductElement, ProductFlag, ProductGift, ProductPrice, ProductTag} from "~gql/api"

export class ProductModel extends ElementModel {

    PRICE?: ProductPrice
    SOSTAV_ROLLS_COUNT: any = {}
    SOSTAV_ROLLS_IDS: number[] = []
    GIFTS: ProductGift[] = []
    FLAGS: ProductFlag[] = []
    TAGS: ProductTag[] = []
    SALES_COUNT: number = 0
    REQUIRED_MIN_PRICE: number = 0
    BUILD?: ConstructorBuild
    UPSALE_ELEMENTS: number[] = []

    constructor(data: ProductElement, observer: boolean = false) {
        super()
        Object.assign(this as any, data)
        this.indexProps(this.PROPS)
        if (observer)
            makeObservable(this)
        //this.disposers = classComputedPropsCache(this, [], [])
    }

    get price() {
        return this.PRICE?.PRICE
    }

    get priceFormatted() {
        return this.PRICE?.PRICE ? this.PRICE?.PRICE + ' ₽' : null
    }

    get haveGifts() {
        return this.GIFTS && !!this.GIFTS.length
    }

    get weight() {
        if (this.propValue.WEIGHT) {
            const w = parseInt(this.propValue.WEIGHT)
            return !isNaN(w) ? w : 0
        }
        return 0
    }

    getFlags(exclude?: string[]) {
        return this.FLAGS.filter(item => !exclude || !item.CODE || exclude.indexOf(item.CODE) === -1)
    }

    getImagePrefetchUrl() {
        return this.imageFullwidthSrcRequired as string
    }

    sotavRolls: ProductModel[] = []

    setSostavRolls(elements: ProductModel[]) {
        this.sotavRolls = elements
    }

    get sostavRollsWithCount() {
        return this.sotavRolls.map(item => {
            return {
                count: this.SOSTAV_ROLLS_COUNT[item.ID] || 1,
                product: item
            }
        })
    }

    get showable() {
        return true
        const price = this.PRICE?.PRICE || 0
        return price > 100 && !!this.imageSrc
    }

    get saleAllow() {
        const price = this.PRICE?.PRICE || 0
        return this.ACTIVE && price > 0 && (this.IBLOCK_SECTION_ID !== 94)
    }
}


