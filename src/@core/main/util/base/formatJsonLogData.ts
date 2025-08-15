export default function formatJsonLogData(data: any, charLimit = 100) {
    return JSON.stringify(data, null, 1).replace(/\n/g, '').substring(0, charLimit)
}
