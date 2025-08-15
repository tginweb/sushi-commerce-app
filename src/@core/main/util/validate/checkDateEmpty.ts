export default function checkDateEmpty(val: string) {
    return !val || !val.match(/\d/)
}
