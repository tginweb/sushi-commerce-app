import {gql} from "@apollo/client"
import ResponseState from "~gql/fragments/ResponseState"
import {MutationSalePubVorderReserveArgs as TArgs, VOrderReserve as TData} from "~gql/api"
import {graphql} from "~services"
import {TGraphqlRequestMutation} from "@core/main/types";
import Vorder from "../fragment/Vorder"

export const query = gql`
    mutation(
        $timeMode: String = "nearest",
        $time: Int = null,
        $timeSave: Boolean = false,
        $order: VorderInput,
        $profileId: Int = null,
        $withVorderBasket: Boolean = true,
        $withVorderForm: Boolean = true,
        $withVorderOrder: Boolean = true
    ) {
        res: sale_pub_vorder_reserve(
            timeMode: $timeMode,
            time: $time,
            timeSave: $timeSave,
            order: $order,
            profileId: $profileId
        ) {
            payload {
                vorder {
                    ...Vorder
                }
                timeAvailable
                timeAvailableFormatted
                departmentId
                departmentName
                departmentServiceId
                departmentServiceName
                deliveryPrice
                deliveryFreeFromPrice
                profileId
            }
            state {
                ...ResponseState
            }
        }
    }
    ${Vorder}
    ${ResponseState}
`
export const request: TGraphqlRequestMutation<TData, TArgs> = (mutationOptions, params) => {
    return graphql.mutateWrapped<TData, TArgs>({
        ...mutationOptions,
        mutation: query,
    }, {
        name: 'sale_pub_vorder_reserve',
        ...params
    })
}
export default {
    query,
    request
}
