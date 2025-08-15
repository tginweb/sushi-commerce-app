import {TCleanLocalAddressBehavior, TMaybe} from "@core/main/types";

export function cleanLocalAddress(address: TMaybe<string>, behavior: TCleanLocalAddressBehavior = true) {

    const _address = address ? address.trim() : ''

    if (behavior === false)
        return [_address, '']

    const parts = _address.split(/\s*\,\s*/)

    const resultParts: string[] = []
    const cleanedParts: string[] = []

    let startResult = false

    for (const part of parts) {
        if (!startResult) {
            if (
                part.match(/(Иркутская\s|Иркутская$)/i) && (behavior === 'region' || behavior === 'city' || behavior === true) ||
                part.match(/(Иркутский (район|рн|р-н)$)/i) && (behavior === true) ||
                part.match(/(Иркутск$)/i) && (behavior === 'city' || behavior === true)
            ) {
                cleanedParts.push(part)
                continue;
            } else {
                startResult = true
            }
        }
        resultParts.push(part)
    }

    return [resultParts.join(', '), cleanedParts.join(', ')]
}
