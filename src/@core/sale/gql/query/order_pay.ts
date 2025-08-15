import {gql} from "@apollo/client"
import {TGraphqlRequestQuery} from "@core/main/types"
import {OrderPayOnline as TResult, QuerySalePubOrderPayOnlineArgs as TArgs} from "~gql/api"
import {graphql} from "~services"
import ResponseState from "~gql/fragments/ResponseState"
import ActionMobile from "~gql/fragments/ActionMobile"
import {Task} from "@core/main/lib/decorator/task";
import Order from "../fragment/Order"

export const query = gql`
    query (
        $id: Int,
        $hash: String = "",
        $type: String = ""
    ) {
        res: sale_pub_order_pay_online(
            id: $id,
            hash: $hash,
            type: $type
        ) {
            payload {
                actionMobile {
                    ...ActionMobile   
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
    ${Order}
    ${ActionMobile}
    ${ResponseState}
`
export const request: TGraphqlRequestQuery<TResult, TArgs> = (queryOptions, params) => {
    return graphql.queryWrapped<TResult, TArgs>({...queryOptions, query: query}, params)
}

export type TQueryOrderPayOnlineTask = Task<[TArgs], TResult>

export default {
    query,
    request
}
