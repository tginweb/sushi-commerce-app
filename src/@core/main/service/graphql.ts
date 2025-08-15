import {client} from "../lib/graphql/client"
import {ApolloClient, WatchQueryFetchPolicy} from "@apollo/client"
import {ApolloQueryResult, DefaultContext, OperationVariables} from "@apollo/client/core/types";
import {FetchPolicy, MutationOptions, QueryOptions} from "@apollo/client/core/watchQueryOptions";
import {ApolloCache} from "@apollo/client/cache";
import {FetchResult} from "@apollo/client/link/core";
import {RequestError} from "@core/main/lib/error";
import exceptionInfo from "../lib/graphql/util/exceptionInfo";
import {
    TGraphqlRequestMutationParamsState,
    TGraphqlRequestParams,
    TGraphqlRequestQueryParamsState
} from "@core/main/types";
import CommonService from "@core/main/lib/service/common";
import {print} from 'graphql';

const deepGet = require('lodash/get');

type TQueryParams = {
    state?: any
    throwInternalError?: boolean
    throwUserError?: boolean
}

export class GraphqlService extends CommonService {

    // @ts-ignore
    client: ApolloClient<any>;

    keys: Record<string, number> = {}

    constructor() {
        super()
    }

    boot() {
        this.client = client
    }

    query<T = any, TVariables extends OperationVariables = OperationVariables>(options: QueryOptions<TVariables, T>): Promise<ApolloQueryResult<T>> {
        return this.client.query(options)
    }

    mutate<TData = any, TVariables extends OperationVariables = OperationVariables, TContext extends Record<string, any> = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>>(options: MutationOptions<TData, TVariables, TContext>): Promise<FetchResult<TData>> {
        return this.client.mutate<TData, TVariables, TContext, TCache>(options)
    }

    async mutateWrapped<
        TData = any,
        TVariables extends OperationVariables = OperationVariables,
        TContext extends Record<string, any> = DefaultContext,
        TCache extends ApolloCache<any> = ApolloCache<any>
    >(
        options: MutationOptions<TData, TVariables, TContext>,
        params: TGraphqlRequestParams = {}
    ): Promise<TData> {

        const debug = require('~stores').stores.debug
        const busService = require('~services').services.bus

        const queryState: TGraphqlRequestMutationParamsState = params.state || {
            process: false,
            mutating: false,
            mutated: false
        }

        const {
            throwInternalError = true,
            throwUserError = true,
            throwError = true,
            name,
            log
        } = params

        let err, response: FetchResult<TData>

        const queryText = print(options.mutation)
        const queryName = this.extractQueryName(queryText)

        const event = debug.createEvent({
            message: 'gql query',
            data: {
                queryName,
                variables: options.variables,
            },
            scope: 'request'
        })

        queryState.process = true
        queryState.mutating = true

        try {
            response = await this.client.mutate<TData, TVariables, TContext, TCache>(options)
            event.finish({
                type: 'info',
                'data.response': response.data
            })
        } catch (e) {

            const extractedException = exceptionInfo(e)

            const {messages, error} = extractedException

            busService.showAlerts(messages)

            err = error && typeof error === 'object' ? new RequestError(error.message || '', error) : e

            response = {
                data: <TData>{
                    res: {
                        state: {
                            success: false
                        }
                    }
                }
            }

            event.finish({
                type: 'error',
                'data.message': error ? error.message : 'error'
            })
        }

        queryState.process = false
        queryState.mutating = false
        queryState.mutated = false

        const responseData: any = response.data

        let responseDataResult

        if (responseData['res']) {
            responseDataResult = responseData['res'] as TData
        } else {
            const resKey = Object.keys(responseData)[0]
            responseDataResult = responseData[resKey] as TData
        }

        if (!err && responseDataResult) {

            const result: any = responseDataResult

            if (result.state) {

                const errors = result.state.messages.filter((item: any) => item.type === 'error')
                const errorMessage = errors[0]
                busService.emitter.emit('processResponse', result.state);

                if (errorMessage) {
                    // err = new RequestError(errorMessage.message, errorMessage, ctx)
                } else if (result.state.success === false) {
                    // err = new RequestError('Ошибка выполнения запроса', {category: 'user'}, ctx)
                }
            }
        }

        if (err) {
            if (throwError) throw err
        }

        return responseDataResult
    }

    async queryWrapped<
        TData = any,
        TVariables extends OperationVariables = OperationVariables,
        TContext extends Record<string, any> = DefaultContext,
        TCache extends ApolloCache<any> = ApolloCache<any>
    >(
        options: QueryOptions<TVariables, TData>,
        params: TGraphqlRequestParams = {}
    ): Promise<TData> {

        const debug = require('~stores').stores.debug
        const busService = require('~services').services.bus

        const queryState: TGraphqlRequestQueryParamsState = params.state || {
            process: false,
            querying: false,
            queried: false
        }

        queryState.process = true
        queryState.querying = true

        const {
            throwInternalError = true,
            throwUserError = true,
            throwError = true,
        } = params

        let err,
            response: FetchResult<TData>

        const queryText = print(options.query)
        const queryName = this.extractQueryName(queryText)

        const event = debug.createEvent({
            message: 'gql query',
            data: {
                queryName,
                variables: options.variables,
            },
            scope: 'request'
        })

        try {
            response = await this.client.query<TData, TVariables>(options)
            event.finish({
                type: 'info',
                'data.response': response.data
            })
        } catch (e) {
            const {messages, error} = exceptionInfo(e)
            busService.showAlerts(messages)
            err = error && typeof error === 'object' ? new RequestError(error.message || '', error) : e
            response = {
                data: <TData>{
                    res: {
                        state: {
                            success: false
                        }
                    }
                }
            }
            event.finish({
                type: 'error',
                'data.message': error ? error.message : 'error'
            })
        }

        debug.pushEvent(event)

        queryState.process = false
        queryState.querying = false
        queryState.queried = true

        const responseData: any = response.data

        let responseDataResult

        if (responseData['res']) {
            responseDataResult = responseData['res'] as TData
        } else {
            const resKey = Object.keys(responseData)[0]
            responseDataResult = responseData[resKey] as TData
        }

        if (!err && responseDataResult) {

            const result: any = responseDataResult

            if (result.state) {

                const errors = result.state.messages.filter((item: any) => item.type === 'error')

                const errorMessage = errors[0]

                busService.emitter.emit('processResponse', result.state);

                if (errorMessage) {
                    // err = new RequestError(errorMessage.message, errorMessage, ctx)
                } else if (result.state.success === false) {
                    // err = new RequestError('Ошибка выполнения запроса', {category: 'user'}, ctx)
                }
            }
        }

        if (err) {
            if (throwError) throw err
        }

        return responseDataResult
    }

    getFetchPolicyForKey(key: string, cache: number | boolean | string | null = false, vars?: any): FetchPolicy {

        const _key = key + JSON.stringify(vars)

        let fetchPolicy: WatchQueryFetchPolicy = 'cache-first'
        if (cache === true) {
            fetchPolicy = 'cache-first'
        } else if (!cache) {
            fetchPolicy = 'no-cache'
        } else if (typeof cache === 'number') {
            const lastFetchTimestamp = this.keys[_key]
            const diffFromNow = lastFetchTimestamp ? Date.now() - lastFetchTimestamp : Number.MAX_SAFE_INTEGER;
            // Is Expired?
            if (diffFromNow > cache) {
                this.keys[_key] = Date.now();
                fetchPolicy = "network-only";
            }
        }
        return fetchPolicy;
    }

    extractQueryName(query: string) {
        const match = query.match(/\{?[\s\n]*(res\:)?([^\{]+?)[\s\n]*\{/i)
        if (match) {
            return match[2].trim()
        }
    }
}

const service = new GraphqlService()
export const graphqlService = service
export default service
