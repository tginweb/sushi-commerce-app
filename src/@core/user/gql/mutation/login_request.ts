import {gql} from "@apollo/client"
import ResponseState from "~gql/fragments/ResponseState"
import CaptchaModel from "~gql/fragments/CaptchaModel"
import {TGraphqlRequestMutation} from "@core/main/types";
import {MutationLoginRequest as TResult, MutationUserPubLoginRequestArgs as TArgs} from "~gql/api";
import {graphql} from "~services";

const query = gql`
    mutation (
        $confirmMode: String,
        $phone: String
    ) {
        res: user_pub_login_request(
            confirmMode: $confirmMode,
            phone: $phone
        ) {
            captcha {
                ...CaptchaModel
            }
            state {
                ...ResponseState
            }
        }
    }
    ${ResponseState}
    ${CaptchaModel}
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
