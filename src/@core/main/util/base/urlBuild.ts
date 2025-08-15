import parseUrl from "parse-url";

export default function urlBuild(urlObj: parseUrl.ParsedUrl, query: Record<string, any> = {}) {

    let url = urlObj.protocol + '://' + urlObj.resource + urlObj.pathname

    if (urlObj.query) {
        const params = new URLSearchParams({
            ...urlObj.query,
            ...query
        })
        url = url + '?' + params.toString()
    }

    return url
}

