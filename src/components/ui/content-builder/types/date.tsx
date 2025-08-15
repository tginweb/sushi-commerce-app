import React from "react";
import {TBuilderItemField, TContentBuilderRendererProps} from "~ui/content-builder/types";
import {UiTextField, UiTextFieldProps} from "~ui/text-field";
import {UiDate, UiDateProps} from "~ui/date";

export type TBuilderItemFieldDate = TBuilderItemField & {
    type: 'date'
    props?: UiDateProps
    modifiers?: any
    inputProps?: UiTextFieldProps
}

export function render({item, fieldKey, value, fieldsRef, fieldPath, handleChange}: TContentBuilderRendererProps<TBuilderItemFieldDate>) {
    return <UiDate
        key={fieldKey}
        value={value}
        useDialog={true}
        onChangeText={handleChange}
        ref={(r) => fieldsRef.current[fieldPath] = r}
        renderInput={(p) => {
            return <UiTextField
                presets={['outline', 'sm']}
                placeholder={item.label}
                floatingPlaceholder={true}
                value={value}
                readonly={true}
                containerStyle={{
                    marginTop: -10
                }}
                {...(p as any)}
                {...item.inputProps}
            />
        }}
        {...item.modifiers}
        {...item.props}
    />
}
