import {action, computed, makeObservable, observable, runInAction} from "mobx"
import CommonStore from "@core/main/lib/store/common";
import {TGqlScopeVorderSession} from "@core/sale/types";
import {
    FavItem,
    MutationSalePubFavAddArgs,
    MutationSalePubFavRemoveArgs,
    SalePubFavAdd,
    SalePubFavRemove
} from "~gql/api";
import api_fav_add from "../gql/mutation/fav_add"
import api_fav_remove from "../gql/mutation/fav_remove"
import {Task, task} from "../../main/lib/decorator/task";
import {ProductModel} from "@core/catalog/model/Product";
import {classComputedPropsCache} from "@core/main/lib/mobx/class-computed-props-cache";
import {logComputed} from "@core/main/lib/mobx/log-computed";

export class FavStore extends CommonStore {

    @observable
    items: FavItem[] = []

    @observable
    itemsByProductId: Record<string, FavItem> = {}

    constructor() {
        super()
        makeObservable(this)
    }

    init() {
        this.disposers = classComputedPropsCache(this, [], [
            'products'
        ])
    }

    @action
    SCOPE_SESSION(data: TGqlScopeVorderSession) {
        if (data.favs) {
            this.setItems(data.favs)
        }
    }

    @action
    setItems(items: FavItem[]) {
        this.items = items
        this.indexItems()
    }

    @action
    addItem(item: FavItem) {
        this.items.push(item)
        this.indexItems([item])
    }

    @action
    removeItem(data: MutationSalePubFavRemoveArgs) {

        let foundItem: FavItem | undefined

        if (data.itemId) {
            foundItem = this.items.find(item => item.ID === data.itemId)
        } else if (data.productId) {
            foundItem = this.items.find(item => item.PRODUCT_ID === data.productId)
        }

        if (foundItem) {
            if (foundItem.PRODUCT_ID)
                delete this.itemsByProductId[foundItem.PRODUCT_ID]
            this.items = this.items.filter(item => item !== foundItem)
        }
    }

    indexItems(items?: FavItem[]) {
        if (!items) {
            this.itemsByProductId = {}
            items = this.items
        }
        items.forEach(item => {
            if (item.PRODUCT_ID)
                this.itemsByProductId[item.PRODUCT_ID] = item
        })
    }

    @task
    apiMutateAdd = (async (variables) => {

        try {
            const result = await api_fav_add.request({
                variables
            }, {
                throwError: true
            })

            runInAction(() => {
                if (result.payload)
                    this.addItem(result.payload)
            })

            return result
        } catch (e) {
            console.log(e)
        }
    }) as Task<[MutationSalePubFavAddArgs], SalePubFavAdd>

    @task
    apiMutateRemove = (async (variables) => {
        try {
            const result = await api_fav_remove.request({
                variables
            }, {
                throwError: true
            })
            runInAction(() => {
                this.removeItem(variables)
            })
            return result
        } catch (e) {
            console.log(e)
        }
    }) as Task<[MutationSalePubFavRemoveArgs], SalePubFavRemove>

    @computed
    get products(): ProductModel[] {
        logComputed(this, 'products')
        const allProducts = this.stores().catalog.productById
        return this.items.map(item => item.PRODUCT_ID ? allProducts[item.PRODUCT_ID] : null).filter(product => !!product)
    }

    @computed
    get hash(): string {
        logComputed(this, 'hash')
        return this.items.map(item => item.PRODUCT_ID).join('-')
    }

    @computed
    get haveItems() {
        logComputed(this, 'haveItems')
        return !!this.items.length
    }
}

export default FavStore
