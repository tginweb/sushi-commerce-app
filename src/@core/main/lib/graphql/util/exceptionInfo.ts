import {TMessage} from "@core/main/types";


export default function exceptionToMessages(e: any) {

    let messages: TMessage[] = []

    if (e.graphQLErrors) {

        Array.prototype.push.apply(messages, e.graphQLErrors.map((error: any) => {

            let message = error.message

            if (error.debugMessage) {
                message = message + '<br>' + error.debugMessage
            }

            return {
                type: 'error',
                message: message,
                ...(error.extensions || {})
            }
        }))
    }

    if (e.networkError && e.networkError.result && e.networkError.result.errors) {

        const errors = e.networkError.result.errors

        Array.prototype.push.apply(messages, errors.map((error: any) => {

            let message = error.message

            if (error.debugMessage) {
                message = message + '<br>' + error.debugMessage
            }

            return {
                type: 'error',
                message: message,
                ...(error.extensions || {})
            }
        }))
    } else if (e.message === "Network error: Failed to fetch") {
        messages.push({
            type: 'error',
            temporary: true,
            message: 'Ошибка подключения, проверьте интернет-соединение',
        })
    } else if (e.networkError) {
        console.log(e.networkError)
        messages.push({
            type: 'error',
            temporary: true,
            message: 'Ошибка выполнения запроса',
        })
    }

    return {
        messages,
        error: messages[0]
    }
}
