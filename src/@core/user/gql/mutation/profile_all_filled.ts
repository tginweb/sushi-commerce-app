import {gql} from "@apollo/client"
import ResponseStateFragment from "~gql/fragments/ResponseState"
import ClientNoticeFragment from "~gql/fragments/ClientNotice"
import {TGraphqlRequestMutation} from "@core/main/types";
import {UserProfileAllFilled as TResult} from "~gql/api";
import {graphql} from "~services";
import {Task} from "@core/main/lib/decorator/task";

type TArgs = any
export type TProfileAllFilledTask = Task<[TArgs], TResult>

const query = gql`
    mutation {
        res: user_pub_profile_all_filled {
            payload {
                notice {
                    ...ClientNotice   
                }
            }
            state {
                ...ResponseState
            }
        }
    }
    ${ClientNoticeFragment}
    ${ResponseStateFragment}
`

export const request: TGraphqlRequestMutation<TResult, TArgs> = (mutationOptions = {}, params = {}) => {
    return graphql.mutateWrapped<TResult, TArgs>({
        ...mutationOptions,
        mutation: query,
    }, {
        name: 'user_pub_profile_all_filled',
        ...params
    })
}




export default {
    query,
    request
}
