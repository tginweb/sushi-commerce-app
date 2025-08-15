import {graphql} from "~services";
import {gql} from "@apollo/client"
import {TGraphqlRequestMutation} from "@core/main/types";
import Order from "../fragment/Order"
import {MutationSalePubOrderCancelArgs as TArgs, OrderCancel as TResult} from "~gql/api";
import ResponseState from "~gql/fragments/ResponseState"
import {Task} from "@core/main/lib/decorator/task";

export const query = gql`
    mutation(
        $id: Int,
        $reason: String,
        $comment: String
    ) {
        res: sale_pub_order_cancel(
            id: $id,
            reason: $reason,
            comment: $comment
        ) {
            payload {
                entity {
                    ...Order
                }
            }
            state {
                ...ResponseState
            }
        }
    }
    ${Order}
    ${ResponseState}
`
export const request: TGraphqlRequestMutation<TResult, TArgs> = (mutationOptions, params) => {
    return graphql.mutateWrapped<TResult, TArgs>({
        ...mutationOptions,
        mutation: query,
    }, {
        name: 'sale_pub_order_cancel',
        ...params
    })
}

export type TOrderCancelTask = Task<[TArgs], TResult>

export default {
    query,
    request
}
