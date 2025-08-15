
export default function maybeJsonDecode(str: string) {
    if (!str)
        return str
    if (str[0] === '{' || str[0] === '[') {
        try {
            return JSON.parse(str)
        } catch (e) {
            return str
        }
    } else {
        return str
    }
}
