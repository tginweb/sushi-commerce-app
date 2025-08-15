import {autorun} from "mobx";

export function classComputedPropsCache(instance: any, props: string[] = [], exclude: string[] = []) {

    const _props = !!props.length ? props : Object.entries(Object.getOwnPropertyDescriptors(instance))
        .filter(([key, descriptor]) => {
            if (exclude.includes(key))
                return false;
            return typeof descriptor.get === 'function' && !descriptor.enumerable
        })
        .map(([key, descriptor]) => key)

    //console.log(instance.constructor.name, _props)
    return _props.map(prop => autorun(reaction => {
        // @ts-ignore
        return instance[prop];
    }, {delay: 100}))
}

