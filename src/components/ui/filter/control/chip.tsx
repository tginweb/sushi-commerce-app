import React, {useCallback} from "react"
import {StyleSheet, View} from "react-native"
import {Chip} from "react-native-ui-lib"
import {COLORS, TYPOGRAPHY} from "~assets/design";
import {TFilterControlProps} from "@core/main/types";
import {ChipProps} from "react-native-ui-lib/src/components/chip";

export type FilterControlChipProps = TFilterControlProps & ChipProps & {
    dismissable?: boolean
}

export const FilterControlChip: React.FC<FilterControlChipProps> = (props) => {

    const {
        id,
        scrollRefs,
        scrollTo = true,
        parentId,
        value,
        label,
        onChange,
        dismissable= true,
        containerStyle,
        backgroundColor = COLORS.colorAspid,
        labelStyle,
        ...rest
    } = props

    const _id = id

    const wrap = (content: any) => {
        return scrollTo && !!scrollRefs && !!_id ?
            <View
                ref={(v) => {
                    scrollRefs.current[_id] = v
                }}
                collapsable={false}
            >
                {content}
            </View> : content
    }

    const onPress = useCallback(() => {
        if (!value || typeof dismissable === 'undefined' || dismissable) {
            onChange && onChange(!value)
        }
    }, [onChange, value])

    return wrap(value ? <Chip
        containerStyle={[
            styles.container,
            styles.containerActive,
            containerStyle,
            {
                borderColor: backgroundColor
            }
        ]}
        labelStyle={[styles.label, styles.labelActive, labelStyle]}
        backgroundColor={backgroundColor}
        label={label}
        onDismiss={dismissable ? onPress : undefined}
        dismissColor={COLORS.white}
        dismissIconStyle={{
            width: 10,
        }}
        borderRadius={7}
        onPress={onPress}
        {...rest}
    /> : <Chip
        containerStyle={[styles.container, styles.containerInactive, containerStyle]}
        labelStyle={[styles.label, labelStyle]}
        borderRadius={7}
        label={label}
        onPress={onPress}
        {...rest}
    />)
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5
    },
    containerInactive: {
        backgroundColor: COLORS.grey70,
        borderColor: COLORS.grey70,
    },
    containerActive: {
    },
    label: {
        ...TYPOGRAPHY['text-sm-lh2'],
    },
    labelActive: {
        color: COLORS.white
    },
})
