import {gql} from "@apollo/client"
import {TGraphqlRequestMutation} from "@core/main/types";
import {MutationNoticePubSyncReadedArgs as TArgs, NoticeSyncReaded as TResult} from "~gql/api";
import {graphql} from "~services";
import {Task} from "@core/main/lib/decorator/task";
import ClientNoticeFramgent from "~gql/fragments/ClientNotice"
import ResponseState from "~gql/fragments/ResponseState"

const query = gql`
    mutation($ids: Json) {
        res: notice_pub_sync_readed(ids: $ids) {
            state {
                ...ResponseState
            }
            payload {
                notices {
                    ...ClientNotice
                }
            }
        }
    }
    ${ClientNoticeFramgent}
    ${ResponseState}
`

export type TNoticeSyncReadedTask = Task<[TArgs?], TResult>

export const request: TGraphqlRequestMutation<TResult, TArgs> = (mutationOptions, params) => {
    return graphql.mutateWrapped<TResult, TArgs>(
        {
            ...mutationOptions,
            mutation: query,
        }, {
            name: 'notice_sync_readed',
            ...params
        }
    )
}

export default {
    query,
    request
}
