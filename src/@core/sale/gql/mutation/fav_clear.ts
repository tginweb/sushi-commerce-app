import {gql} from "@apollo/client"
import ResponseState from "~gql/fragments/ResponseState"
import {SalePubFavClear as TArgs} from "~gql/api"
import {graphql} from "~services"
import {TGraphqlRequestMutation} from "@core/main/types";

type TData = number[]

export const query = gql`
    mutation{
        res: sale_pub_fav_clear {
            ...ResponseState
        }
    }
    ${ResponseState}
`
export const request: TGraphqlRequestMutation<TData, TArgs> = (mutationOptions, params) => {
    return graphql.mutateWrapped<TData, TArgs>({
        ...mutationOptions,
        mutation: query,
    }, {
        name: 'sale_pub_fav_clear',
        ...params
    })
}

export default {
    query,
    request
}
