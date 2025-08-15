import {action, computed, makeObservable} from "mobx"
import {FaqElement, Section} from "~gql/api";
import CommonStore from "@core/main/lib/store/common";
import {classComputedPropsCache} from "@core/main/lib/mobx/class-computed-props-cache";
import excludeEmptyFields from "@core/main/util/base/excludeEmptyFields";

export class FaqStore extends CommonStore {

    elements: FaqElement[] = []
    sections: Section[] = []

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
            this.elements = excludeEmptyFields(data.elements)
        if (data.sections)
            this.sections = data.sections
    }

    @computed
    get elementsBySection() {
        return this.elements.reduce<Record<any, FaqElement[]>>((map, item) => {
            if (item.IBLOCK_SECTION_ID) {
                if (!map[item.IBLOCK_SECTION_ID])
                    map[item.IBLOCK_SECTION_ID] = []
                map[item.IBLOCK_SECTION_ID].push(item)
            }
            return map
        }, {})
    }
}

export default FaqStore
