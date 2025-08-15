import {gql} from "@apollo/client"

import Vorder, {VOrderLocalArgs} from "../fragment/Vorder"
import ResponseState from "~gql/fragments/ResponseState"
import {TGraphqlRequestMutation} from "@core/main/types";
import {MutationSalePubVorderBasketArgs as TArgs, VOrderBasket as TData} from "~gql/api";
import {graphql} from "~services";

export const query = gql`
    mutation(
        $action: String,
        $params: Json,
        $order: VorderInput,
        $withVorderBasket: Boolean = true,
        $withVorderForm: Boolean = true,
        $withVorderOrder: Boolean = true
    ) {
        res: sale_pub_vorder_basket(
            order: $order
        ) {
            payload {
                vorder {
                    ...Vorder
                }
            }
            state {
                ...ResponseState
            }
        }
    }
    ${Vorder}
    ${ResponseState}
`

export const request: TGraphqlRequestMutation<TData, TArgs & VOrderLocalArgs> = (mutationOptions, params) => {
    return graphql.mutateWrapped<TData, TArgs & VOrderLocalArgs>({
        ...mutationOptions,
        mutation: query,
    }, {
        name: 'sale_pub_vorder_basket',
        ...params
    })
}

export default {
    query,
    request
}
