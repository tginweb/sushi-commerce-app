import React from "react";
import {PartialRecord, TComponentTargetProps} from "@core/main/types";
import {ViewStyle} from "react-native";


export function useTargetProps<K extends string>(
    targetKeys: K[],
    targetModifiers: PartialRecord<K, string[]>,
    targetStyles: PartialRecord<K, ViewStyle>,
    options: {
        layoutInspector?: boolean
    } = {}
): TComponentTargetProps<K> {

    return React.useMemo<TComponentTargetProps<K>>(() => {
        const result: TComponentTargetProps<K> = {} as TComponentTargetProps<K>
        for (const target of targetKeys) {

            const targetStyle = targetStyles[target as keyof typeof targetStyles] || {}

            if (options.layoutInspector) {
                targetStyle.borderWidth = 1
                targetStyle.borderColor = '#333333'
            }

            result[target as keyof typeof result] = {
                style: targetStyle,
                props: {}
            }

            if (targetModifiers && targetModifiers[target as keyof typeof targetModifiers]) {
                for (const mod of targetModifiers[target as keyof typeof targetModifiers] as []) {
                    result[target as keyof typeof result].props[mod] = true
                }
            }
        }
        return result
    }, [targetModifiers])

}
