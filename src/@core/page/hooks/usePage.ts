import {useMemo} from "react";
import {useStores} from "~stores";
import merge from "lodash/merge";

type TPageDefaultOptions = {}

export default function usePage<T extends TPageDefaultOptions>(
    {
        path,
        defaults
    }: {
        path?: string,
        defaults?: Partial<T>
    } = {
        defaults: {}
    }
) {
    const {page} = useStores()

    return useMemo(() => {

        console.log('usePage', 'page')
        let model
        let chunks = {
            ...defaults,
        } as T
        if (path) {
            model = page.getPageByPath(path)
            if (model) {
                chunks = merge(chunks, model.chunk)
            }
        }
        return {
            model,
            pageModel: model,
            chunks
        }
    }, [path, page.version])
}
