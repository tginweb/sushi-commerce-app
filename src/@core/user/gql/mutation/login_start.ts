import {gql} from "@apollo/client"
import ResponseState from "~gql/fragments/ResponseState"
import UserAuthConfirmFragment from "~gql/fragments/UserAuthConfirm"
import {TGraphqlRequestMutation} from "@core/main/types";
import {MutationLoginStart as TResult, MutationUserPubLoginStartArgs as TArgs} from "~gql/api";
import {graphql} from "~services";

const query = gql`
    mutation (
        $phone: String
    ) {
        res: user_pub_login_start(
            phone: $phone
        ) {
            confirmModes {
                ...UserAuthConfirm
            }
            state {
                ...ResponseState
            }
        }
    }
    ${ResponseState}
    ${UserAuthConfirmFragment}
`

export const request: TGraphqlRequestMutation<TResult, TArgs> = (mutationOptions, params = {}) => {
    return graphql.mutateWrapped<TResult, TArgs>({
        ...mutationOptions,
        mutation: query,
    }, {
        name: 'user_pub_login_request',
        ...params
    })
}
export default {
    query,
    request
}
