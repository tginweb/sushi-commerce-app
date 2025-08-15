import {TMessage, TValidateResult} from "@core/main/types";

export function messageByRel(messages: TValidateResult) {
    if (messages && messages !== true && Array.isArray(messages)) {
        return messages.reduce<Record<string, TMessage>>((map, message) => {
            // @ts-ignore
            map[message.ref || ''] = message
            return map
        }, {})
    }
    return {}
}

export default messageByRel
