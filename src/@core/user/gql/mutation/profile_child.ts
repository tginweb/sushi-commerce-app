import {gql} from "@apollo/client"
import ResponseState from "~gql/fragments/ResponseState"
import {TGraphqlRequestMutation} from "@core/main/types";
import {MutationUserChild as TResult, MutationUserPubProfileChildArgs as TArgs} from "~gql/api";
import {graphql} from "~services";
import User from "~gql/fragments/User"
import {Task} from "@core/main/lib/decorator/task";

const query = gql`
    mutation (
        $action: String,
        $child: UserFamilyInput
    ) {
        res: user_pub_profile_child(
            action: $action,
            child: $child
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
        name: 'user_pub_profile_child',
        ...params
    })
}

export type TMutationUserProfileChildTask = Task<[TArgs], TResult>

export default {
    query,
    request
}
