export function splitWithTail(str: string, delim: string, count?: number) {
    var parts = str.split(delim);
    var tail = parts.slice(count).join(delim);
    var result = parts.slice(0, count);
    result.push(tail);
    return result;
}
export default splitWithTail
