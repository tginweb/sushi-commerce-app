import React from "react"
import {UiTextField, UiTextFieldProps} from "~ui/text-field";
import {INPUT_MASK_PHONE} from "~assets/config";

export type UiInputPhoneProps = UiTextFieldProps & {}

export const UiInputPhoneComponent: React.FC<UiInputPhoneProps> = (props, ref) => {
    return <UiTextField
        ref={ref}
        placeholder={'Ваш телефон'}
        presets={['outline', 'sm']}
        keyboardType="phone-pad"
        mask={INPUT_MASK_PHONE}
        multiline={false}
        rules={[{type: 'phone'}]}
        {...props}
    />
}

// @ts-ignore
export const UiInputPhone = React.forwardRef(UiInputPhoneComponent)
