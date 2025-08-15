import {graphql} from "~services";
import {gql} from "@apollo/client"
import {TGraphqlRequestMutation} from "@core/main/types";
import {MutationSalePubProfileDefaultArgs as TArgs, OrderProfileDefault as TResult} from "~gql/api";
import ResponseState from "~gql/fragments/ResponseState"

export const query = gql`
    mutation(
        $id: Int
    ) {
        res: sale_pub_profile_default(
            id: $id
        ) {
            state {
                ...ResponseState
            }
        }
    }
    ${ResponseState}
`
export const request: TGraphqlRequestMutation<TResult, TArgs> = (mutationOptions, params) => {
    return graphql.mutateWrapped<TResult, TArgs>({
        ...mutationOptions,
        mutation: query,
    }, {
        name: 'sale_pub_profile_default',
        ...params
    })
}

export default {
    query,
    request
}
