import {action, computed, makeObservable, observable} from "mobx"
import {TGqlScopeCatalogApp} from "@core/catalog/types"
import {ProductModel} from "@core/catalog/model/Product"
import {SectionModel} from "@core/main/model/Section"
import treeBuild from "@core/main/util/base/treeBuild"
import {ProductElement} from "~gql/api";
import CommonStore from "@core/main/lib/store/common";
import DialogStore from "@core/main/lib/store/dialog";
import {logComputed} from "@core/main/lib/mobx/log-computed";

export class CatalogConstructorStore extends CommonStore {

    constructorSections: SectionModel[] = []
    constructorProducts: ProductModel[] = []
    constructorBuildBestsellers: ProductModel[] = []

    @observable
    dialog: DialogStore<any> = new DialogStore()

    constructor() {
        super()
        makeObservable(this)
    }

    init() {
        /*
        this.disposers = classComputedPropsCache(this, [], [
            'constructorSections',
            'constructorSectionsTree'
        ])

         */

    }

    @computed
    get constructorSectionsTree(): SectionModel[] {
        logComputed(this, 'constructorSectionsTree')
        return treeBuild(this.constructorSections, 'ID', 'IBLOCK_SECTION_ID', 'CHILDREN')
    }

    @computed
    get constructorSectionsTreeByCode(): Record<string, SectionModel> {
        logComputed(this, 'constructorSectionsTreeByCode')
        return this.constructorSectionsTree.reduce((map: any, item: any) => {
            map[item.CODE] = item
            return map
        }, {})
    }

    @action
    SCOPE_APP(data: TGqlScopeCatalogApp) {


        if (data.constructorProducts)
            this.constructorProducts = this.productsToModels(data.constructorProducts)

        if (data.constructorSections)
            this.constructorSections = data.constructorSections.map((item) => new SectionModel(item, false))

        if (data.buildsBestseller)
            this.constructorBuildBestsellers = this.productsToModels(data.buildsBestseller)

    }

    productsToModels(items: ProductElement[]) {
        return items.map((item) => new ProductModel(item, false))
    }

    @computed get constructorProductsBySection(): Record<number, ProductModel[]> {
        logComputed(this, 'constructorProductsBySection')
        return this.constructorProducts.reduce((map: any, item) => {
            if (!map[item.IBLOCK_SECTION_ID]) {
                map[item.IBLOCK_SECTION_ID] = []
            }
            map[item.IBLOCK_SECTION_ID].push(item)
            return map
        }, {})
    }

    @computed get constructorProductById(): Record<number, ProductModel> {
        logComputed(this, 'constructorProductById')
        return this.constructorProducts.reduce((map: any, item: any) => {
            map[item.ID] = item
            return map
        }, {})
    }

}

export default CatalogConstructorStore
