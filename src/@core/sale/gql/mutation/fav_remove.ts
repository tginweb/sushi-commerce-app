import {gql} from "@apollo/client"
import ResponseState from "~gql/fragments/ResponseState"
import {MutationSalePubFavRemoveArgs as TArgs, SalePubFavRemove as TData} from "~gql/api"
import {graphql} from "~services"
import {TGraphqlRequestMutation} from "@core/main/types";

export const query = gql`
    mutation(
        $itemId: Int,
        $productId: Int
    ) {
        res: sale_pub_fav_remove(
            itemId: $itemId,
            productId: $productId
        ) {
            state {
                ...ResponseState
            }
        }
    }
    ${ResponseState}
`
export const request: TGraphqlRequestMutation<TData, TArgs> = (mutationOptions, params) => {
    return graphql.mutateWrapped<TData, TArgs>({
        ...mutationOptions,
        mutation: query,
    }, {
        name: 'sale_pub_fav_remove',
        ...params
    })
}
export default {
    query,
    request
}
