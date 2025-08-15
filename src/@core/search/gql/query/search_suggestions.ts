import {gql} from "@apollo/client"
import {TGraphqlRequestQuery} from "@core/main/types";
import {QuerySearchSuggestionsArgs as TArgs, SearchSuggestion} from "~gql/api";
import {graphql} from "~services";
import SearchSuggestionFragment from "~gql/fragments/SearchSuggestion"
import {Task} from "@core/main/lib/decorator/task";

type TResult = SearchSuggestion[]

const query = gql`
    query($query: String)
    {
        res: search_suggestions(query: $query) {
            ...SearchSuggestion
        }
    }
    ${SearchSuggestionFragment}
`

export const request: TGraphqlRequestQuery<TResult, TArgs> = (queryOptions, params = {}) => {
    return graphql.queryWrapped<TResult, TArgs>({...queryOptions, query: query}, params)
}

export type TSearchSuggestionTask = Task<[TArgs], TResult>

export const SEARCH_SUGGESTIONS_QUERY = query

export default {
    query,
    request
}
