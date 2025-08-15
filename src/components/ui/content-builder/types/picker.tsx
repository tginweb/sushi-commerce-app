import React from "react";
import {TBuilderItemField, TContentBuilderRendererProps} from "~ui/content-builder/types";
import {UiPicker, UiPickerProps} from "~ui/picker";
import {UiTextField, UiTextFieldProps} from "~ui/text-field";

export type TBuilderItemFieldPicker = TBuilderItemField & {
    type: 'picker'
    props?: UiPickerProps
    modifiers?: any
    inputProps?: UiTextFieldProps
}

export function render({
                           item,
                           fieldKey,
                           value,
                           fieldsRef,
                           fieldPath,
                           handleChange
                       }: TContentBuilderRendererProps<TBuilderItemFieldPicker>) {
    return <UiPicker
        key={fieldKey}
        value={value}
        useDialog={true}
        onChange={handleChange}
        ref={(r) => {
            if (r) fieldsRef.current[fieldPath] = r
        }}
        renderPicker={(selectedValue: any, selectedLabel: string) => {
            return <UiTextField
                presets={['outline', 'sm']}
                placeholder={item.label}
                floatingPlaceholder={true}
                value={selectedLabel}
                readonly={true}
                containerStyle={{
                    marginTop: -10
                }}
                {...item.inputProps}
            />
        }}
        {...item.modifiers}
        {...item.props}
    />
}
