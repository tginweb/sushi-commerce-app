import {gql} from "@apollo/client"
import Vorder from "../fragment/Vorder"
import ResponseState from "~gql/fragments/ResponseState"
import {MutationSalePubVorderCouponArgs as TArgs, VOrderCoupon as TData} from "~gql/api"
import {graphql} from "~services"
import {TGraphqlRequestMutation} from "@core/main/types";

export const query = gql`
    mutation(
        $action: String,
        $couponCode: String,
        $order: VorderInput,
        $withVorderBasket: Boolean = true,
        $withVorderForm: Boolean = true,
        $withVorderOrder: Boolean = true
    ) {
        res: sale_pub_vorder_coupon(
            action: $action,
            couponCode: $couponCode,
            order: $order
        ) {
            payload {
                vorder {
                    ...Vorder
                }
                coupon {
                    ID
                    NAME
                    COUPON
                    PRODUCT_ID
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
export const request: TGraphqlRequestMutation<TData, TArgs> = (mutationOptions, params) => {
    return graphql.mutateWrapped<TData, TArgs>({
        ...mutationOptions,
        mutation: query,
    }, {
        name: 'sale_pub_vorder_coupon',
        ...params
    })
}
export default {
    query,
    request
}
