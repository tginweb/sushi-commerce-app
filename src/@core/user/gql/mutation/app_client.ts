import {gql} from "@apollo/client"
import AppClientFragment from "~gql/fragments/AppClient"
import {TGraphqlRequestMutation} from "@core/main/types";
import {AppClient as TResult, MutationUserPubAppClientArgs as TArgs} from "~gql/api";
import {graphql} from "~services";

const query = gql`
    mutation(
        $debugParams: Json,
        $mobilePushToken: String
    ) {
        res: user_pub_app_client(
            debugParams: $debugParams,
            mobilePushToken: $mobilePushToken
        ) {
            ...AppClient
        }
    }
    ${AppClientFragment}
`

export const request: TGraphqlRequestMutation<TResult, TArgs> = (mutationOptions = {}, params = {}) => {
    return graphql.mutateWrapped<TResult, TArgs>({
        ...mutationOptions,
        mutation: query,
    }, {
        name: 'app_client',
        ...params
    })
}

export default {
    query,
    request
}
