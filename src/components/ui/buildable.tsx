import React from "react"
import {StyleSheet} from "react-native"
import {TBuildableComponentProps} from "@core/main/types";
import {useStores} from "~stores";
import {conditionResolve} from "@core/main/util/react/conditionResolve";
import getScopeData from "@core/main/util/react/getScopeData";
import {observer} from "mobx-react";
import toString from "@core/main/util/base/toString";
import deepGet from "lodash/get";
import deepSet from "lodash/set";

export type UiBuildable<T> = T & TBuildableComponentProps & {
    vars?: any
    Component?: any
}

export function UiBuildableComponent<TProps>(props: UiBuildable<TProps>) {

    const {
        vars,
        condition,
        templatableProps,
        Component,
        ...rest
    } = props

    const stores = useStores()

    if (condition && !conditionResolve(condition, vars, stores))
        return;

    const restProps = rest as TProps

    if (templatableProps) {

        let _templatableProps: string[] = []

        if (typeof templatableProps === 'string') {
            _templatableProps = templatableProps.split(',')
        } else {
            _templatableProps = templatableProps
        }

        for (const propName of _templatableProps) {
            let propVal: any = deepGet(restProps, propName)
            if (!propVal)
                continue;
            if (typeof propVal === 'string') {
                if (propVal[0] === '{' && propVal[propVal.length - 1] === '}') {
                    propVal = toString(getScopeData(propVal.substring(1, propVal.length - 1), vars, stores))
                } else {
                    propVal = propVal.replace(/\{(.+)\}/ig, function (str, find, offset, s) {
                        return getScopeData(find, vars, stores) as string
                    })
                }
            }
            deepSet(restProps as any, propName, propVal)
        }
    }

    return <Component
        {...restProps}
    />
}

export const UiBuildable = observer(UiBuildableComponent)

const styles = StyleSheet.create({})
