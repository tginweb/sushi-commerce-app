import {gql} from "@apollo/client"
import PageElementFragment from "../fragment/PageElement"
import {TGraphqlRequestQuery} from "@core/main/types";
import {PageElement as TResult, QueryPageElementArgs as TArgs} from "~gql/api";
import {graphql} from "~services";

export const query = gql`
    query(
        $filter: ElementFilter,
        $nav: QueryNavInput
    )
    {
        res: page_element(filter: $filter, nav: $nav) {
            ...PageElement
        }
    }
    ${PageElementFragment}
`

export const request: TGraphqlRequestQuery<TResult, TArgs> = (queryOptions, params) => {
    return graphql.queryWrapped<TResult, TArgs>({
        ...queryOptions,
        fetchPolicy: 'no-cache',
        query
    }, params)
}

export default {
    query,
    request
}
