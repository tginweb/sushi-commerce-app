const cloneDeep = require('./cloneDeep').default

export function _filterTree<T = any>(data: T[], fn: (node: T) => boolean, childrenKey: string = 'children') {
    return data.filter(function (o: any) {
        if (o[childrenKey]) o[childrenKey] = _filterTree<T>(o[childrenKey], fn);
        return fn(o)
    })
}

export default function filterTree<T>(data: T[], fn: (node: T) => boolean) {
    return _filterTree<T>(cloneDeep(data), fn);
}

