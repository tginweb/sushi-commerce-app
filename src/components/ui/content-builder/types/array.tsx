import React from "react";
import {TBuilderItem, TBuilderItemField, TContentBuilderRendererProps} from "~ui/content-builder/types";
import {View, ViewProps} from "react-native-ui-lib";
import {UiBtn, UiBtnProps} from "~ui/btn";
import toObject from "@core/main/util/base/toObject";
import icons from "~assets/icons-map";
import {COLORS} from "~assets/design";

export type TBuilderItemFieldArray = TBuilderItemField & {
    type: 'array'
    props?: ViewProps
    modifiers?: any
    children?: TBuilderItem[]

    min?: number
    max?: number

    addShow?: 'prepend' | 'append' | boolean
    addProps?: UiBtnProps | boolean
    addViewModifiers?: any

    delProps?: UiBtnProps | boolean
    delViewModifiers?: UiBtnProps

    rowsProps?: ViewProps
    rowsModifiers?: any
    addButtonPosition?: 'prepend' | 'append'
}

export function render({fieldKey, item, fieldPath, value, fieldParents, handleChange, builder, handleBlur, fieldsRef}: TContentBuilderRendererProps<TBuilderItemFieldArray>) {

    const addButton = <UiBtn
        label={'Добавить'}
        onPress={() => builder.fieldAddRow(fieldPath)}
        viewProps={{
            ...item.addViewModifiers,
            //'bg-black': true
        }}
        {...toObject(item.addProps)}
    />

    const rows = <View
        testID={'rows'}
        {...(item.rowsModifiers || {
            'gap-5': true,
            //'bg-black': true
        })}
        {...(item.rowsProps)}
    >
        {
            (value || []).map((row: any, rowIndex: number) => {
                const content = item.children && item.children.map((col, colIndex) => {
                    const p = [...fieldParents, item.field, rowIndex]
                    return builder.renderItem(col, p, colIndex)
                })
                return <View key={rowIndex} testID={'row'} row gap-10>
                    <View flexG testID={'columns'}>
                        {content}
                    </View>
                    <View testID={'actions'}>
                        <UiBtn
                            icon={icons.del}
                            row={true}
                            iconSize={20}
                            outline={true}
                            round={true}
                            color={COLORS.primary}
                            onPress={() => {
                                builder.fieldDeleteRow(fieldPath, rowIndex)
                            }}
                            viewProps={{
                                'marginT-6': true,
                                ...item.delViewModifiers
                            }}
                            {...toObject(item.delProps)}
                        />
                    </View>
                </View>
            })
        }
    </View>

    return <View
        key={fieldKey}
        {...item.modifiers}
        {...item.props}
    >
        {item.addShow === 'prepend' && addButton}
            {rows}
            {(item.addShow === true || item.addShow === 'append') && addButton}
    </View>
}
