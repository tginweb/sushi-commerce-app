export default function anchor2url(url: string) {
    return '/' + url.replace(/\#/g, '').replace(/\-\-/g, '/').replace(/^\//g, '')
}

