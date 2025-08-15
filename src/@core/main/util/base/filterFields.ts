export default function filterFields(res: any[]) {
    return res.filter(item => {
        if (Array.isArray(item.content)) {
            item.content = item.content.filter((val: any) => !!val)
            return !!item.content.length
        } else {
            return !!item.content
        }
    })
}
