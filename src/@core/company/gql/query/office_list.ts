import {gql} from "@apollo/client"
import {TGraphqlRequestQuery} from "@core/main/types"
import {CompanyOffice, QueryCompanyPubOfficeListArgs as TArgs} from "~gql/api"
import {graphql} from "~services"
import CompanyOfficeFragment from "../fragments/Office"
import {Task} from "@core/main/lib/decorator/task";

type TResult = CompanyOffice[]

export const query = gql`
    query (
        $filter: CompanyOfficeFilter,
        $nav: QueryNavInput,
        $position: Json,
        $time: Int = null
    )
    {
        res: company_pub_office_list(
            filter: $filter,
            nav: $nav,
            position: $position,
            time: $time
        ) {
            ...CompanyOffice
        }
    }
    ${CompanyOfficeFragment}
`
export const request: TGraphqlRequestQuery<TResult, TArgs> = (queryOptions, params) => {
    return graphql.queryWrapped<TResult, TArgs>({...queryOptions, query: query}, params)
}

export type TCompanyOfficeListTask = Task<[TArgs], TResult>

export default {
    query,
    request
}
