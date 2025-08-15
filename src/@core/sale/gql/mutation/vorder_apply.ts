import {gql} from "@apollo/client"

import Vorder, {VOrderLocalArgs} from "../fragment/Vorder"
import ResponseState from "~gql/fragments/ResponseState"
import {TGraphqlRequestMutation} from "@core/main/types";
import {MutationSalePubVorderApplyArgs as TArgs, VOrderApply as TResult} from "~gql/api";
import {graphql} from "~services";
import {Task} from "@core/main/lib/decorator/task";

export const query = gql`
    mutation(
        $order: VorderInput,
        $withVorderBasket: Boolean = true,
        $withVorderForm: Boolean = true,
        $withVorderOrder: Boolean = true
    ) {
        res: sale_pub_vorder_apply(
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
export const request: TGraphqlRequestMutation<TResult, TArgs & VOrderLocalArgs> = (mutationOptions, params) => {
    return graphql.mutateWrapped<TResult, TArgs & VOrderLocalArgs>({
        ...mutationOptions,
        mutation: query,
    }, {
        name: 'sale_pub_vorder_apply',
        ...params
    })
}

export type TVorderApplyTask = Task<[TArgs], TResult>

export default {
    query,
    request
}
