import debounce from "lodash/debounce";

const debounces: any = {}

export default function debounceOperation(op: string, delay: number, cb: any, args?: any) {

    op = args ? op + JSON.stringify(args) : op

    if (!debounces[op]) {
        debounces[op] = {}
    }
    if (!debounces[op][delay]) {
        debounces[op][delay] = debounce(cb, delay)
    }
    for (const d in debounces[op]) {
        if (d !== delay.toString()) {
            debounces[op][d].cancel()
            delete debounces[op][d]
        }
    }
    return debounces[op][delay](args)
}
