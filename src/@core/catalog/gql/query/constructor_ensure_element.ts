import {gql} from "@apollo/client"
import {TGraphqlRequestQuery} from "@core/main/types";
import {ProductElement, QueryCatalogConstructorEnsureElementArgs as TArgs} from "~gql/api";
import ProductElementFragment from "../fragments/ProductElement"
import {graphql} from "~services";

type TResult = ProductElement

const query = gql`
    query(
        $constructor: Json,
        $sectionId: Int,
        $sectionCode: String
    )
    {
        res: catalog_constructor_ensure_element(
            constructor: $constructor,
            sectionId: $sectionId,
            sectionCode: $sectionCode
        ) {
            ...ProductElement
        }
    }
    ${ProductElementFragment}
`

export const request: TGraphqlRequestQuery<TResult, TArgs> = (queryOptions, params = {}) => {
    return graphql.queryWrapped<TResult, TArgs>({...queryOptions, query: query}, params)
}

export default {
    query,
    request
}
