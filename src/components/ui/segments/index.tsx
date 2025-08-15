import {Text, View} from "react-native-ui-lib"
import React, {FC, useMemo, useState} from "react"
import {StyleSheet, TextStyle} from "react-native"
import SegmentedControl, {SegmentedControlItemProps, SegmentedControlProps} from "./vendor";
import {useWatch} from "@core/main/lib/hooks/useWatch";
import {COLORS, TYPOGRAPHY} from "~assets/design";
import * as Progress from 'react-native-progress';


export type UiSegmentProps = SegmentedControlItemProps & {
    label: any
    caption?: any
    value: any
    icon?: any
    badge?: any
    loading?: boolean
}

export type UiSegmentsProps = Exclude<SegmentedControlProps, 'segments'> & {
    segments: UiSegmentProps[]
    initialValue?: any
    value?: any
    onChangeValue?: (newValue: any, newIndex: number, newItem: any) => void
    badgeStyle?: TextStyle
    showIcon?: boolean
}

export const UiSegmentsComponent: React.FC<UiSegmentsProps> = (props, ref) => {

    const {
        segments,
        value,
        initialValue,
        initialIndex,
        onChangeIndex,
        onChangeValue,
        showIcon = true,
        badgeStyle = {
            ...TYPOGRAPHY['text-4xs-m-lh0']
        },
        segmentLabelStyle = {
            ...TYPOGRAPHY['text-sm-lh0']
        },
        ...rest
    } = props


    const [valueState, setValueState] = useState(() => {
        if (typeof value !== 'undefined') {
            return value
        } else if (typeof initialValue !== 'undefined') {
            return initialValue
        } else if (typeof initialIndex !== 'undefined' && segments[initialIndex]) {
            return segments[initialIndex].value
        }
    })

    const [indexState, setIndexState] = useState(() => {
        let index
        if (typeof initialIndex !== 'undefined') {
            index = initialIndex
        } else if (typeof value !== 'undefined') {
            index = segments.findIndex((item: UiSegmentProps) => item.value === value)
        } else if (typeof initialValue !== 'undefined') {
            index = segments.findIndex((item: UiSegmentProps) => item.value === initialValue)
        }
        return index && index >= 0 ? index : undefined
    })

    const _segments = useMemo(() => {
        return segments
            //.filter((segment: TSegment) => segment.value !== null)
            .map((segment: UiSegmentProps) => {

                let label = segment.label

                if (segment.icon || segment.badge || segment.loading || segment.caption) {
                    label = <View gap-6>
                        <View row centerV gap-5>

                            {showIcon && !!segment.icon && segment.icon({size: 15})}

                            <Text style={segmentLabelStyle}>{segment.label}</Text>

                            {segment.badge &&
                                <Text style={[badgeStyle]}>{segment.badge}</Text>}

                            {segment.loading &&
                                <Progress.CircleSnail thickness={2} size={16} color={COLORS.primary}
                                                      indeterminate={true}/>}
                        </View>
                        {segment.caption && <Text text-3xs-lh0>{segment.caption}</Text>}
                    </View>
                }

                return {
                    hidden: segment.value === null,
                    ...segment,
                    label: label,
                }
            })
    }, [segments, showIcon])

    useWatch(() => {

        if (typeof value !== 'undefined' && valueState !== value) {
            const newIndex = _segments.findIndex((item) => item.value === value)
            setIndexState(newIndex)
            setValueState(value)
        }
    }, [value])

    const onChangeIndexInternal = (newIndex: number) => {
        const item = _segments[newIndex]
        if (item) {
            const newValue = item.value
            onChangeIndex && onChangeIndex(newIndex)
            onChangeValue && onChangeValue(newValue, newIndex, item)
            setValueState(newValue)
        }
    }

    return <SegmentedControl
        //ref={ref}
        initialIndex={indexState}
        segments={_segments}
        onChangeIndex={onChangeIndexInternal}
        segmentLabelStyle={segmentLabelStyle}
        {...rest}
    />
}

// @ts-ignore
export const UiSegments: FC<UiSegmentsProps> = React.forwardRef(UiSegmentsComponent)

const styles = StyleSheet.create({
    container: {
        gap: 10
    }
})
