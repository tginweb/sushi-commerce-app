import {makeObservable} from "mobx"
import CommonStore from "@core/main/lib/store/common";
import API_SEARCH_SUGGESTIONS, {TSearchSuggestionTask} from "../gql/query/search_suggestions";
import {task} from "../../main/lib/decorator/task";
import {classComputedPropsCache} from "@core/main/lib/mobx/class-computed-props-cache";

export class SearchStore extends CommonStore {

    constructor() {
        super()
        makeObservable(this)
    }

    init() {
        this.disposers = classComputedPropsCache(this, [])
    }

    @task
    apiSearchSuggestions = (async (variables) => {
        try {
            return await API_SEARCH_SUGGESTIONS.request({
                variables
            }, {
                throwError: true
            })
        } catch (e) {
            console.log(e)
            return []
        }
    }) as TSearchSuggestionTask
}

export default SearchStore
