import {gql} from "@apollo/client"

import ProductElementFragment from "../fragments/ProductElement"
import {TGraphqlRequestQuery} from "@core/main/types";
import {ProductElement, QueryCatalogSearchNewArgs as TArgs} from "~gql/api";
import {graphql} from "~services";
import {Task} from "@core/main/lib/decorator/task";

type TResult = ProductElement[]

const query = gql`
    query(
        $query: String,
        $filterSuggestion: Json = null
    )
    {
        res: catalog_search_new(query: $query, filterSuggestion: $filterSuggestion) {
            ...ProductElement
        }
    }
    ${ProductElementFragment}
`

export const request: TGraphqlRequestQuery<TResult, TArgs> = (queryOptions, params = {}) => {
    return graphql.queryWrapped<TResult, TArgs>({...queryOptions, query: query}, params)
}

export type TCatalogSearchTask = Task<[TArgs], TResult>

export default {
    query,
    request
}
