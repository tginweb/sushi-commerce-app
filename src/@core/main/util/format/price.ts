export default function price(val: any, round: boolean | number = false, showZero = true) {

    let cval = val

    if (round) {
        if (round === true) {
            cval = Math.round(val)
        } else {
            cval = val.toFixed(round)
            if ((Math.round(val) - cval) === 0) {
                cval = Math.round(val)
            }
        }
    }

    return !showZero ? (cval ? cval + ' ₽' : '') : cval + ' ₽'
}

