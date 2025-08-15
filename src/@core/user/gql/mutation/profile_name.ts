import {gql} from "@apollo/client"
import ResponseState from "~gql/fragments/ResponseState"
import {TGraphqlRequestMutation} from "@core/main/types";
import {MutationUserName as TResult, MutationUserPubProfileNameArgs as TArgs} from "~gql/api";
import {graphql} from "~services";
import User from "~gql/fragments/User"
import {Task} from "@core/main/lib/decorator/task";

const query = gql`
    mutation (
        $name: String
    ) {
        res: user_pub_profile_name(
            name: $name
        ) {
            user {
                ...User
            }
            state {
                ...ResponseState
            }
        }
    }
    ${User}
    ${ResponseState}
`

export const request: TGraphqlRequestMutation<TResult, TArgs> = (mutationOptions, params = {}) => {
    return graphql.mutateWrapped<TResult, TArgs>({
        ...mutationOptions,
        mutation: query,
    }, {
        name: 'user_pub_profile_name',
        ...params
    })
}

export type TMutationUserProfileNameTask = Task<[TArgs], TResult>


export default {
    query,
    request
}
