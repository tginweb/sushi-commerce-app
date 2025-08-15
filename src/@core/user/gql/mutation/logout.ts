import {gql} from "@apollo/client"
import ResponseState from "~gql/fragments/ResponseState"
import {TGraphqlRequestMutation} from "@core/main/types";
import {MutationLogout as TResult} from "~gql/api";
import {graphql} from "~services";

type TArgs = {}

const query = gql`
    mutation {
        res: user_pub_logout {
            state {
                ...ResponseState
            }
        }
    }
    ${ResponseState}
`

export const request: TGraphqlRequestMutation<TResult, TArgs> = (mutationOptions, params = {}) => {
    return graphql.mutateWrapped<TResult, TArgs>({
        ...mutationOptions,
        mutation: query,
    }, {
        name: 'user_pub_logout',
        ...params
    })
}
export default {
    query,
    request
}
