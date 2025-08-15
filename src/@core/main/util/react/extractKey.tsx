export function extractKey(item: any, index?: number, field?: string) {
    if (typeof item === 'string')
        return item
    if (typeof item === 'object') {
        if (field && item[field])
            return item[field]
        else if (item.ID)
            return item.ID
        else if (item.id)
            return item.id
        else if (item.NAME)
            return item.NAME
        else if (item.name)
            return item.name
        else if (index)
            return index
    } else {
        return index
    }
}
export default extractKey
