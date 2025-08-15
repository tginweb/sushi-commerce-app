
export function propsFilter(props: any = {}) {
    const res: any = {}
    for (const [name, value] of Object.entries(props)) {
        if (typeof value !== 'undefined' && value !== null) {
            res[name] = value
        }
    }
    return res
}

export default propsFilter
