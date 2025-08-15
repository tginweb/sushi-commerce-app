import {ApolloClient, ApolloLink, InMemoryCache} from "@apollo/client"
import {setContext} from "apollo-link-context"
import {HttpLink} from "apollo-link-http"
import {RetryLink} from "@apollo/client/link/retry";
import {onError} from "@apollo/client/link/error";
import AppConfig from "@core/main/config";
import {busService} from "@core/main/service/bus";

const {parse} = require('graphql')

export type TFetchQueryInfo = {
    type: string
    queries: string[]
    name: string | null
    hash: string
}

export type TFetchParams = {
    networkErrorTimeout?: number
    networkErrorTimeoutDisable?: boolean

    timeout?: number
    timeoutDisable?: boolean

    attempts?: number
    attemptsDisable?: boolean
}

type TFetchState = {
    createdAt: number
    timer?: any
    networkTimer?: any
    currentAttempt: number
    attempts?: number
    stoped?: boolean
    reject: any
}

const fetchQueriesState: Record<string, TFetchState> = {}

const commonLink = setContext(async (_, ctx) => {

    const stores = require('~stores').default

    const newCtx = {
        ...ctx,
        headers: {
            ...ctx.headers,
        }
    }

    if (stores.user.sessionId) {
        newCtx.headers.Cookie = `PHPSESSID=${stores.user.sessionId}`
    } else {
        delete newCtx.headers.Cookie
    }

    if (stores.user.token)
        newCtx.headers['Authorization'] = 'Bearer ' + stores.user.token

    newCtx.headers['Client-Id'] = stores.user.clientId
    newCtx.headers['Client-Context'] = JSON.stringify(stores.main.httpClientContext)
    newCtx.headers['App-Id'] = 'mobile-app'

    return newCtx
})


const refreshToken = async () => {
    try {

        /*
        const refreshResolverResponse = await client.mutate<{
            refreshToken: string;
        }>({
            mutation: REFRESH_TOKEN,
        });

        const accessToken = refreshResolverResponse.data?.refreshToken.accessToken;

    localStorage.setItem('accessToken', accessToken || '');
    return accessToken;
         */

        return 'sss'
    } catch (err) {
        //localStorage.clear();
        throw err;
    }
};


export const createApolloClient = (
    {
        linkConfig
    }: {
        linkConfig: HttpLink.Options
    }
) => {

    const fetchStop = (fetchState: TFetchState) => {
        fetchState.stoped = true
        clearTimeout(fetchState.timer)
        clearTimeout(fetchState.networkTimer)
        busService.statusBarHide()
    }

    const fetchReject = (fetchState: TFetchState, error: any) => {
        if (fetchState.reject)
            fetchState.reject(error)
        delete fetchState.reject
        fetchStop(fetchState)
    }

    function fetchWithTimeout(
        uri: RequestInfo,
        options: any,
        query: TFetchQueryInfo,
        fetchParams: TFetchParams,
    ): Promise<Response> {

        return new Promise((resolve, reject) => {
            const {
                networkErrorTimeout = 0,
                timeout = 0,
                attempts = 0,
            } = fetchParams

            const runFetch = () => {
                const controller = new AbortController()
                const signal = controller.signal

                //let _uri = fetchState.currentAttempt < 3 ? 'https://sww.sdawwmdawdm.ru' : uri
                let _uri = uri

                fetch(_uri, {
                    ...options,
                    signal: signal
                }).then(
                    response => {

                        const headerSessionWrite = response.headers.get('session-write')

                        if (!attempts) {
                            resolve(response);
                            return
                        }

                        console.log('GQL.FETCH', 'resolved', query.name, {headerSessionWrite})

                        fetchStop(fetchState)
                        resolve(response)
                    },
                    err => {

                        if (
                            err.message === 'Network request failed' &&
                            networkErrorTimeout
                        ) {
                            console.log('GQL.FETCH', 'network error', query)
                            if (fetchState.currentAttempt < attempts) {
                                clearTimeout(fetchState.timer)
                                fetchState.currentAttempt++
                                statusBarShow('Ошибка подключения')
                                fetchState.networkTimer = setTimeout(() => {
                                    runAttempt()
                                }, networkErrorTimeout)
                            } else {
                                console.log('GQL.RETRY_END:', {currentAttempt: fetchState.currentAttempt})
                                fetchStop(fetchState)
                                reject(err);
                            }
                        } else {
                            console.log('GQL.FETCH', 'rejected', query)
                            fetchStop(fetchState)
                            reject(err);
                        }
                    }
                )
                return controller
            }

            const lastQueryState = fetchQueriesState[query.hash]

            if (lastQueryState && !lastQueryState.stoped) {
                fetchReject(lastQueryState, new Error('Предыдущий запрос отменен'))
            }

            fetchQueriesState[query.hash] = {
                createdAt: Date.now(),
                timer: null,
                networkTimer: null,
                attempts,
                currentAttempt: 0,
                stoped: false,
                reject
            }

            const fetchState = fetchQueriesState[query.hash]

            console.log('GQL_QUERY:', query.name, {
                hash: query.hash,
                attempts,
                timeout,
                networkErrorTimeout
            })

            const runAttempt = () => {
                if (fetchState.stoped)
                    return;

                if (fetchState.currentAttempt > 0)
                    console.log('GQL.ATTEMPT:', {attempt: fetchState.currentAttempt})

                clearTimeout(fetchState.timer)

                if (timeout) {
                    fetchState.timer = setTimeout(() => onTimeout(), timeout)
                }

                runFetch()
            }

            const statusBarShow = (msg = '') => {
                busService.statusBarShow({
                    type: 'info',
                    message: (msg ? msg + '. ' : '') + 'Попытка №' + fetchState.currentAttempt,
                    loading: true
                })
            }

            const onTimeout = () => {
                if (fetchState.currentAttempt < attempts) {
                    fetchState.currentAttempt++
                    runAttempt()
                    statusBarShow('Превышено время ожидания запроса')
                } else {
                    console.log('GQL.RETRY_END:', {currentAttempt: fetchState.currentAttempt})
                    fetchStop(fetchState)
                    reject(new Error('Время ожидания запроса истекло'));
                }
            }

            runAttempt()
        })
    }

    function fetchNormal(
        uri: RequestInfo,
        options: any,
    ): Promise<Response> {
        return new Promise((resolve, reject) => {
            fetch(uri, {
                ...options,
            }).then(
                response => {
                    resolve(response)
                },
                err => {
                    reject(err);
                }
            )
        })
    }

    const httpLink = new HttpLink({
        ...linkConfig,
        credentials: 'omit',
        fetch: (uri, options) => {

            return fetchNormal(uri as any, options)

            /*
            const configQueries = AppConfig.GQL_QUERY_INFO

            let fetchParams: TFetchParams = {}

            let query: TFetchQueryInfo = {
                type: '',
                queries: [],
                name: '',
                hash: ''
            }

            if (options?.body) {
                const bodyData: any = JSON.parse(options.body as string)
                if (bodyData.query) {
                    query.hash = md5(bodyData.query)
                    const map = parse(bodyData.query);
                    map.definitions.forEach((def: DefinitionNode) => {
                        if (def.kind === 'OperationDefinition') {
                            query.type = def.operation
                            def.selectionSet.selections.forEach((sel) => {

                                // @ts-ignore
                                const queryName: string = sel.name.value

                                configQueries.patterns.forEach(pattern => {
                                    if (!pattern.fetchParams)
                                        return;
                                    if (pattern.type && query.type !== pattern.type)
                                        return;
                                    if (pattern.nameMatch && !queryName.match(new RegExp(pattern.nameMatch)))
                                        return;
                                    fetchParams = {
                                        ...fetchParams,
                                        ...pattern.fetchParams
                                    }
                                })

                                // @ts-ignore
                                const configFetchParams = configQueries[query.type][queryName]

                                if (configFetchParams) {
                                    fetchParams = {
                                        ...fetchParams,
                                        ...configFetchParams
                                    }
                                }

                                query.queries.push(queryName)
                            })
                        }
                    })
                }
            }

            query.name = query.type + ':' + query.queries.join(',')

            if (!query.hash)
                query.hash = Math.random().toString()


            // @ts-ignore
            const timeoutFromHeader = options?.headers['x-gql-timeout'];
            // @ts-ignore
            const attemptsFromHeader = options?.headers['x-gql-attempts'];
            // @ts-ignore
            const networkErrorTimeoutFromHeader = options?.headers['x-gql-network-error-timeout'];

            //if (timeout === 10000) uri = 'https://sww.sdawwmdawdm.ru'

            if (fetchParams.timeout !== 0)
                fetchParams.timeout = timeoutFromHeader || fetchParams.timeout || Number(process.env.DEFAULT_GQL_TIMEOUT) || 10000

            if (fetchParams.attempts !== 0)
                fetchParams.attempts = attemptsFromHeader || fetchParams.attempts || Number(process.env.DEFAULT_GQL_ATTEMPTS)

            if (fetchParams.networkErrorTimeout !== 0)
                fetchParams.networkErrorTimeout = networkErrorTimeoutFromHeader || fetchParams.networkErrorTimeout || Number(process.env.DEFAULT_GQL_NETWORK_ERROR_TIMEOUT)


            if (fetchParams.timeoutDisable)
                fetchParams.timeout = 0

            if (fetchParams.attemptsDisable)
                fetchParams.attempts = 0

            if (fetchParams.networkErrorTimeoutDisable)
                fetchParams.networkErrorTimeout = 0

            return fetchWithTimeout(uri, options, query, fetchParams)

             */
        }
    })

    const errorLink = onError((
        {
            graphQLErrors,
            networkError,
            response,
            operation,
            forward
        }
    ) => {

        if (graphQLErrors) {

            /*
            for (let err of graphQLErrors) {
                switch (err.extensions.code) {
                    case 'UNAUTHENTICATED':

                        // ignore 401 error for a refresh request
                        if (operation.operationName === 'refreshToken') return;

                        const observable = new Observable<FetchResult<Record<string, any>>>(
                            (observer) => {
                                // used an annonymous function for using an async function
                                (async () => {
                                    try {
                                        const accessToken = await refreshToken();

                                        if (!accessToken) {
                                            throw new GraphQLError('Empty AccessToken');
                                        }

                                        // Retry the failed request
                                        const subscriber = {
                                            next: observer.next.bind(observer),
                                            error: observer.error.bind(observer),
                                            complete: observer.complete.bind(observer),
                                        };

                                        forward(operation).subscribe(subscriber);
                                    } catch (err) {
                                        observer.error(err);
                                    }
                                })();
                            }
                        );

                        return observable;
                }
            }
             */

            graphQLErrors.forEach(({message, locations, path}) => {
                console.log('[GraphQL error]', message, {
                    locations: locations,
                    path: path
                })
            })
        }

        if (networkError) {
            console.log(`[Network error]: ${networkError}`);
            const networkErrorReady = networkError as any
            if (networkErrorReady.result?.errors) {
                for (const err of networkErrorReady.result?.errors) {
                    console.log(err)
                }
            }
        }
    })

    const retryLink = new RetryLink({
        delay: {
            initial: 300,
            max: Infinity,
            jitter: true
        },
        attempts: {
            max: 3,
            retryIf: (error, _operation) => !!error
        }
    });

    const links = ApolloLink.from([
        //retryLink,
        errorLink,
        commonLink,
        httpLink
    ] as any)

    return new ApolloClient({
        cache: new InMemoryCache(),
        link: links
    })
}


export const client = createApolloClient({
    linkConfig: {
        uri: () => {
            return AppConfig.API_GRAPHQL_URL
        }
    }
})
