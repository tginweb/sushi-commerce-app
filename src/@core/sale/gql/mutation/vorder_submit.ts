import {gql} from "@apollo/client"

import Vorder, {VOrderLocalArgs} from "../fragment/Vorder"
import Order from "../fragment/Order"
import ResponseState from "~gql/fragments/ResponseState"
import {TGraphqlRequestMutation} from "@core/main/types";
import {MutationSalePubVorderSubmitArgs as TArgs, VOrderSubmit as TResult} from "~gql/api";
import {graphql} from "~services";
import {Task} from "@core/main/lib/decorator/task";

export const query = gql`
    mutation(
        $order: VorderInput,
        $withVorderBasket: Boolean = true,
        $withVorderForm: Boolean = true,
        $withVorderOrder: Boolean = true
    ) {
        res: sale_pub_vorder_submit(
            order: $order
        ) {
            payload {
                vorder {
                    ...Vorder
                }
                order {
                    ...Order
                }
            }
            state {
                ...ResponseState
            }
        }
    }
    ${Vorder}
    ${Order}
    ${ResponseState}
`
export const request: TGraphqlRequestMutation<TResult, TArgs & VOrderLocalArgs> = (mutationOptions, params) => {
    return graphql.mutateWrapped<TResult, TArgs & VOrderLocalArgs>({
        ...mutationOptions,
        mutation: query,
    }, {
        name: 'sale_pub_vorder_submit',
        ...params
    })
}

export type TVorderSubmitTask = Task<[TArgs], TResult>

export default {
    query,
    request
}
