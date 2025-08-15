import {gql} from "@apollo/client"
import NoticeFramgent from "~gql/fragments/Notice"
import {TGraphqlRequestQuery} from "@core/main/types";
import {ClientNotice, QuerySalePubClientCardFetchArgs as TArgs} from "~gql/api";
import {graphql} from "~services";
import {Task} from "@core/main/lib/decorator/task";

type TResult = ClientNotice[]

export const query = gql`
    query
    {
        res: notice_pub_list {
            ...ClientNotice
        }
    }
    ${NoticeFramgent}
`

export const request: TGraphqlRequestQuery<TResult, TArgs> = (queryOptions, params) => {
    return graphql.queryWrapped<TResult, TArgs>({
        ...queryOptions,
        fetchPolicy: 'no-cache',
        query
    }, params)
}

export type TQueryNoticeListTask = Task<[TArgs?], TResult>

export default {
    query,
    request
}
