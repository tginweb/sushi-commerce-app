import React, {forwardRef, useEffect, useState} from "react"
import {StyleSheet} from "react-native"
import {UiTextField, UiTextFieldApi, UiTextFieldProps} from "~ui/text-field";

export type UiTextareaProps = UiTextFieldProps & {}

export const UiTextarea = forwardRef<UiTextFieldApi, UiTextareaProps>((props, ref) => {

    const {
        value,
        onChangeText,
        style,
        ...rest
    } = props

    const [text, setText] = useState(value)

    useEffect(() => {
        
        setText(value)
    }, [value])

    return <UiTextField
        ref={ref}
        value={text}
        onChangeText={(text) => {
            setText(text)
            props.onChangeText && props.onChangeText(text, text, text)
        }}
        multiline
        style={[
            {
                textAlignVertical: 'top'
            },
            style
        ]}
        {...rest}
    />
})

const styles = StyleSheet.create({})
