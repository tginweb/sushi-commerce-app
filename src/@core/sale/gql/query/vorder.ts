import {gql} from "@apollo/client"
import {TGraphqlRequestQuery} from "@core/main/types"
import {QuerySalePubVorderArgs as TArgs, Vorder as TResult} from "~gql/api"
import {graphql} from "~services"
import {Task} from "@core/main/lib/decorator/task";
import Vorder from "../fragment/Vorder"

export const query = gql`
    query(
        $withVorderBasket: Boolean = true,
        $withVorderForm: Boolean = true,
        $withVorderOrder: Boolean = true
    ) {
        res: sale_pub_vorder {
            ...Vorder
        }
    }
    ${Vorder}
`
export const request: TGraphqlRequestQuery<TResult, TArgs> = (queryOptions, params = {}) => {
    return graphql.queryWrapped<TResult, TArgs>({...queryOptions, query: query}, params)
}

export type TQueryVorderTask = Task<[TArgs], TResult>

export default {
    query,
    request
}
