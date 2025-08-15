export default function treeReduce<T = any, TMap = any>(
    data: T[],
    fn: (acc: any, node: T, path: T[]) => TMap,
    acc: TMap,
    childrenKey: string = 'children',
    path: T[] = []
) {
    data.forEach(function (node: any) {
        acc = fn(acc, node, path)
        if (node[childrenKey]) {
            acc = treeReduce<T, TMap>(node[childrenKey], fn, acc, childrenKey, [...path, ...[node]]);
        }
    })
    return acc
}

