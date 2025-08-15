import {gql} from "@apollo/client"
import UserFragment from "~gql/fragments/User"

import {TGraphqlRequestQuery} from "@core/main/types";
import {QueryUserFetchArgs as TArgs, User as TResult} from "~gql/api";
import {graphql} from "~services";
import {Task} from "@core/main/lib/decorator/task";

export const query = gql`
    query
    {
        res: user_fetch {
            ...User
        }
    }
    ${UserFragment}
`

export type TUserFetchTask = Task<[TArgs], TResult>

export const request: TGraphqlRequestQuery<TResult, TArgs> = (queryOptions, params) => {
    return graphql.queryWrapped<TResult, TArgs>({
        ...queryOptions,
        fetchPolicy: 'no-cache',
        query
    }, params)
}

export default {
    query,
    request
}
