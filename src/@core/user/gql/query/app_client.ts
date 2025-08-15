import {gql} from "@apollo/client"
import AppClientFragment from "~gql/fragments/AppClient"

import {TGraphqlRequestQuery} from "@core/main/types";
import {QueryUserFetchArgs as TArgs, AppClient as TResult} from "~gql/api";
import {graphql} from "~services";

export const query = gql`
    query
    {
        res: user_pub_app_client {
            ...AppClient
        }
    }
    ${AppClientFragment}
`

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
