import React from 'react';
import type { TextStyle } from 'react-native';
import { I18nManager, StyleSheet, TextInput } from 'react-native';

import { COLORS, FONT_SIZE } from '../../constants';

import { useSelectInput } from './select-input.hooks';
import {UiTextField} from "~ui/text-field";

export const SelectInput = () => {
    const {
        disabled,
        multiple,
        placeholderTextColor,
        searchValue,
        onPressSelectControl,
        inputProps,
        textCustomStyles,
        searchInputRef,
        resolvedPlaceholder,
        onChangeText,
    } = useSelectInput();

    return (
        <UiTextField
            accessibilityLabel="Place text"
            {...inputProps}
            ref={searchInputRef as any}
            editable={!disabled}
            clearable={!!searchValue}
            placeholder={resolvedPlaceholder}
            placeholderTextColor={placeholderTextColor}
            style={
                disabled
                    ? [styles.disabled, styles.text, multiple && styles.marginMultiple]
                    : []
            }
            textAlign={I18nManager.getConstants().isRTL ? 'right' : 'left'}
            value={searchValue ?? ''}
            onChangeText={onChangeText}
            onPressIn={disabled ? undefined : onPressSelectControl}
        />
    );
};

type Styles = {
    text: TextStyle;
    disabled: TextStyle;
    marginMultiple: TextStyle;
};

const styles = StyleSheet.create<Styles>({
    text: {
        fontSize: FONT_SIZE,
    },
    disabled: {
        backgroundColor: COLORS.DISABLED,
    },
    marginMultiple: {
        marginRight: 6,
    },
});
