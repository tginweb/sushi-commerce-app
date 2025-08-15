export default function url2anchor(url: string) {
    return url.replace(/^\/|\/$/g, '').replace(/\//g, '--')
}

