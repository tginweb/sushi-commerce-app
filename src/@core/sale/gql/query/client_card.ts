import {gql} from "@apollo/client"
import SaleClientCard from "~gql/fragments/SaleClientCard"
import {TGraphqlRequestQuery} from "@core/main/types";
import {QuerySalePubClientCardFetchArgs as TArgs, SaleClientCard as TResult} from "~gql/api";
import {graphql} from "~services";
import {Task} from "@core/main/lib/decorator/task";

export const query = gql`
    query(
        $refetch: Boolean = false
    )
    {
        res: sale_pub_client_card_fetch(refetch: $refetch){
            ...SaleClientCard
        }
    }
    ${SaleClientCard}
`

export const request: TGraphqlRequestQuery<TResult, TArgs> = (queryOptions, params) => {
    return graphql.queryWrapped<TResult, TArgs>({
        ...queryOptions,
        fetchPolicy: 'no-cache',
        query
    }, params)
}

export type TQueryClientCardTask = Task<[TArgs?], TResult>

export default {
    query,
    request
}
