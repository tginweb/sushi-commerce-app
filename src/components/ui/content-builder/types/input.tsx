import {UiTextField, UiTextFieldProps} from "~ui/text-field";
import React from "react";
import {TBuilderItemField, TContentBuilderRendererProps} from "~ui/content-builder/types";

export type TBuilderItemFieldInput = TBuilderItemField & {
    type: 'input'
    props?: UiTextFieldProps
}

export function render({
                           fieldKey,
                           item,
                           fieldPath,
                           value,
                           handleChange,
                           handleBlur,
                           fieldsRef
                       }: TContentBuilderRendererProps<TBuilderItemFieldInput>) {
    return <UiTextField
        key={fieldKey}
        presets={['outline', 'sm']}
        placeholder={item.label}
        floatingPlaceholder={true}
        onChangeText={handleChange}
        onBlur={handleBlur}
        fieldStyle={{backgroundColor: '#FFFFFF'}}
        value={value}
        ref={(r) => {
            if (r)
                fieldsRef.current[fieldPath] = r
        }}
        containerStyle={{
            marginTop: -10
        }}
        {...item.props}
    />
}
