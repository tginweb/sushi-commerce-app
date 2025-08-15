import React from "react"
import {Text, View, ViewProps} from "react-native-ui-lib"
import {ViewStyle} from "react-native"
import {TMessage, TPresetName} from "@core/main/types"
import {UiActions} from "../actions"
import {UiBtnProps} from "~ui/btn";
import {presets, styles} from "./styles"
import {TYPOGRAPHY} from "~assets/design";
import {usePresets} from "@core/main/lib/hooks/usePresets";

export type UiMessageProps = ViewProps & {
    message: TMessage
    preset?: TPresetName
    color?: string
}

export const UiMessage: React.FC<UiMessageProps> = (props) => {

    let {
        message,
        preset = 'outline',
        ...rest
    } = props

    const _message: TMessage = {
        type: 'info',
        ...message,
    }

    const typePreset = presets['type-' + _message.type as keyof typeof presets](props) as any

    const color = message.actionsProps?.themeColor || typePreset['color']

    const presetRes = usePresets({...props, color}, preset, presets, [_message.type])

    const ComActions = (p: {
        style?: ViewStyle
    } = {}) => {

        const actions: UiBtnProps[] = (message.actions || []).map((action) => {
            const _res = {
                ...action
            }
            return _res
        })

        let actionProps: UiBtnProps = {
            outline: true,
            size: 'xSmall',
            labelStyle: {
                ...TYPOGRAPHY["text-md-lh0"]
            },
            ...message.actionsProps,
        }

        if (actionProps.outline) {
            actionProps.color = color
            actionProps.outlineColor = color
        } else {
            actionProps.color = '#FFFFFF'
            actionProps.backgroundColor = color
            actionProps.outlineColor = color
        }

        return !!actions.length && <View flex right><UiActions
            items={actions}
            itemProps={actionProps}
            containerStyle={{
                ...p.style
            }}
        /></View>
    }

    return <View style={[styles.container, ...(presetRes.styles.container || [])]} {...rest}>
        {
            !!message.actionsInline ?
                <View row style={[styles.row, ...(presetRes.styles.row || [])]}>
                    <View>
                        {typePreset.icon(presetRes.icon)}
                    </View>
                    <View>
                        <Text style={[styles.message, ...(presetRes.styles.message || [])]}>
                            {message.message || message.title}
                        </Text>
                    </View>
                    <ComActions style={styles.actionsInline}/>
                </View>
                :
                <View row style={[styles.row, ...(presetRes.styles.row || [])]}>
                    <View>
                        {typePreset.icon(presetRes.icon)}
                    </View>
                    <View>
                        <Text style={[styles.message, ...(presetRes.styles.message || [])]}>
                            {message.message || message.title}
                        </Text>
                        <ComActions style={styles.actionsBlock}/>
                    </View>
                </View>

        }
    </View>
}


