export default function (dataset: any, idField = 'ID', parentField = 'PARENT', childrenField = 'CHILDREN') {

    const hashTable = Object.create(null)

    dataset.forEach((node: any) => {
        node[childrenField] = []
        hashTable[node[idField]] = node
    })

    const dataTree: any = [];
    dataset.forEach((aData: any) => {

        const child = hashTable[aData[idField]]
        const parentId = child[parentField]

        if (parentId) {
            if (Array.isArray(parentId)) {
                parentId.forEach((id: any) => {
                    if (hashTable[id])
                        hashTable[id][childrenField].push(child)
                })
            } else {
                if (hashTable[parentId])
                    hashTable[parentId][childrenField].push(child)
            }
        } else dataTree.push(child)
    });
    return dataTree;
}
