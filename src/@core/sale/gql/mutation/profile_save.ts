import {gql} from "@apollo/client"

import OrderProfile from "../fragment/OrderProfile"
import {TGraphqlRequestMutation} from "@core/main/types";
import {MutationSalePubProfileSaveMobileArgs as TArgs, OrderProfile as TResult} from "~gql/api";
import {graphql} from "~services";

export const query = gql`
    mutation(
        $id: Int,
        $attrs: Json,
    ) {
        res: sale_pub_profile_save_mobile(
            id: $id,
            attrs: $attrs
        ) {
            ...OrderProfile
        }
    }
    ${OrderProfile}
`

export const request: TGraphqlRequestMutation<TResult, TArgs> = (mutationOptions, params) => {
    return graphql.mutateWrapped<TResult, TArgs>({
        ...mutationOptions,
        mutation: query,
    }, {
        name: 'sale_pub_profile_save_mobile',
        ...params
    })
}

export default {
    query,
    request
}
