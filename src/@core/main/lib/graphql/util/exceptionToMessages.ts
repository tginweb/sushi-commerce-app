import exceptionInfo from "./exceptionInfo"

export default function exceptionToMessages(e: any) {
    const {messages} = exceptionInfo(e)
    return messages
}
