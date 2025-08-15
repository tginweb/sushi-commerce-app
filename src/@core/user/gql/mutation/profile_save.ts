import {gql} from "@apollo/client"
import ResponseState from "~gql/fragments/ResponseState"
import {TGraphqlRequestMutation} from "@core/main/types";
import {MutationUserProfileSaveArgs as TArgs, UserProfileSave as TResult} from "~gql/api";
import {graphql} from "~services";
import {Task} from "@core/main/lib/decorator/task";
import User from "~gql/fragments/User"

const query = gql`
    mutation (
        $form: Json
    ) {
        res: user_profile_save(
            form: $form
        ) {
            payload {
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
        name: 'user_profile_save',
        ...params
    })
}

export type TUserProfileSaveTask = Task<[TArgs], TResult>

export default {
    query,
    request
}
