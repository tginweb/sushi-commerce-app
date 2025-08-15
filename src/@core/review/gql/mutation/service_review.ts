import {gql} from "@apollo/client"

import ReviewElement from "../fragment/ReviewElement"
import ResponseState from "~gql/fragments/ResponseState"
import {TGraphqlRequestMutation} from "@core/main/types";
import {MutationReviewPubServiceReviewArgs as TArgs, ServiceReviewAdd as TResult} from "~gql/api";
import {graphql} from "~services";

export const query = gql`
    mutation(
        $model: Json
    ) {
        res: review_pub_service_review(
            model: $model
        ) {
            payload {
                ...ReviewElement
            }
            state {
                ...ResponseState
            }
        }
    }
    ${ReviewElement}
    ${ResponseState}
`

export const request: TGraphqlRequestMutation<TResult, TArgs> = (mutationOptions, params) => {
    return graphql.mutateWrapped<TResult, TArgs>({
        ...mutationOptions,
        mutation: query,
    }, params)
}

export default {
    query,
    request
}
