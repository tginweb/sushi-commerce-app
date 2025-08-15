import parseUrl from "parse-url";

export default function urlParse(str: string) {

    let _str = str

    if (!str.match(/^http/)) {
        if (str[0] !== '/') {
            _str = '/' + str
        } else {
            _str = str
        }
        _str = 'http://www.test.ru' + _str
    }

    return parseUrl(_str)
}

