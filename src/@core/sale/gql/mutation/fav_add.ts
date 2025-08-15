import {gql} from "@apollo/client"
import {MutationSalePubFavAddArgs as TArgs, SalePubFavAdd as TData} from "~gql/api"
import {graphql} from "~services"
import {TGraphqlRequestMutation} from "@core/main/types";
import FavItemFragment from "../fragment/FavItem";
import ResponseState from "~gql/fragments/ResponseState"

export const query = gql`
    mutation(
        $basketId: Int,
        $productId: Int
    ) {
        res: sale_pub_fav_add(
            basketId: $basketId,
            productId: $productId
        ) {
            state {
                ...ResponseState
            }
            payload {
                ...FavItem
            }
        }
    }
    ${FavItemFragment}
    ${ResponseState}
`
export const request: TGraphqlRequestMutation<TData, TArgs> = (mutationOptions, params) => {
    return graphql.mutateWrapped<TData, TArgs>({
        ...mutationOptions,
        mutation: query,
    }, {
        name: 'sale_pub_fav_add',
        ...params
    })
}
export default {
    query,
    request
}
