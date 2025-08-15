import {action, makeObservable, observable} from "mobx"
import {hydrateStore} from "mobx-persist-store"
import {TVoid} from "@core/main/types"
import {PromoElement} from "~gql/api";
import CommonStore from "@core/main/lib/store/common";
import {classComputedPropsCache} from "@core/main/lib/mobx/class-computed-props-cache";
import {PromoElementModel} from "@core/promo/model/PromoElement";

export class PromoStore extends CommonStore {

    @observable
    elements: PromoElementModel[] = []

    constructor() {
        super()
        makeObservable(this)
    }

    init() {
        this.disposers = classComputedPropsCache(this, [])
    }

    @action
    SCOPE_APP(data: any) {
        if (data.elements)
            this.elements = data.elements.map((element: PromoElement) => new PromoElementModel(element))
    }

    hydrate = async (): TVoid => {
        await hydrateStore(this);
    }
}

export default PromoStore
