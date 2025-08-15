import React from "react"
import {View} from "react-native-ui-lib"
import {UiListItem} from "~ui/list-item"
import toArray from "@core/main/util/base/toArray"
import {UiListProps} from "~ui/list/index.types";
import {presets, styles} from "./index.styles";
import render from "@core/main/util/react/render";
import {UiMessage} from "~ui/message";
import {usePresets} from "@core/main/lib/hooks/usePresets";

export const UiList: React.FC<UiListProps> = (props) => {

    const {
        containerStyle = {},
        itemProps = {},
        items,
        itemsRef,
        itemPreset,
        preset,
        separated,
        backgroundColor,
        delimiter,
        error,
        datasources,
        ...rest
    } = props

    const presetRes = usePresets(props, preset, presets, [])

    const _containerStyle: any = {
        ...containerStyle
    }

    if (backgroundColor) {
        _containerStyle.backgroundColor = backgroundColor
    }

    if (!items.length)
        return;

    return <View
        style={[styles.container, ...(presetRes.styles.container || []), _containerStyle]}
        {...rest}
    >
        {
            error && <UiMessage
                message={error}
                preset={preset}
            />
        }

        {items
            .filter(item => !item.hidden)
            .map((item, index) => {

                const isLast = index === items.length - 1
                const isFirst = index === 0

                const _itemPreset = toArray(itemPreset, true)

                if (!isLast && separated) {
                    _itemPreset.push(separated === true ? 'separated' : separated)
                }

                return <React.Fragment key={index}>
                    <UiListItem
                        preset={_itemPreset}
                        isLast={isLast}
                        isFirst={isFirst}
                        itemsRef={itemsRef}
                        datasources={datasources}
                        {...itemProps}
                        {...item}
                    />
                    {!isLast && render(delimiter)}
                </React.Fragment>
            })
        }
    </View>
}
