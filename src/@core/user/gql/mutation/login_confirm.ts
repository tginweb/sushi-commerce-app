import {gql} from "@apollo/client"
import ResponseState from "~gql/fragments/ResponseState"
import {TGraphqlRequestMutation} from "@core/main/types";
import {MutationLoginConfirm as TResult, MutationUserPubLoginConfirmArgs as TArgs} from "~gql/api";
import {graphql} from "~services";
import AppClient from "~gql/fragments/AppClient"

const query = gql`
    mutation(
        $phone: String,
        $code: String,
        $sid: String = "",
        $disableBasketTransfer: Boolean = false
    ) {
        res: user_pub_login_confirm(
            phone: $phone,
            code: $code,
            sid: $sid,
            disableBasketTransfer: $disableBasketTransfer
        ) {
            appClient {
                ...AppClient
            }
            userId
            sessionId
            redirect
            status
            state {
                ...ResponseState
            }
        }
    }
    ${ResponseState}
    ${AppClient}
`

export const request: TGraphqlRequestMutation<TResult, TArgs> = (mutationOptions, params) => {
    return graphql.mutateWrapped<TResult, TArgs>(
        {
            ...mutationOptions,
            mutation: query,
        }, {
            name: 'user_pub_login_confirm',
            ...params
        }
    )
}
export default {
    query,
    request
}
