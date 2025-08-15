import {useEffect, useRef} from 'react';
import type {TextInput} from 'react-native';
import {Keyboard} from 'react-native';

import {useSelectContext} from '../../context';

export const useSelectInput = () => {
    const searchInputRef = useRef<TextInput>(null);

    const {
        isOpened,
        disabled,
        multiple,
        placeholderText,
        placeholderTextColor,
        searchPattern,
        optionsResolver,
        searchValue,
        onPressSelectControl,
        inputProps,
        dispatch,
        setOptionsListPosition,
        onSelectChangeText,
        styles,
        selectedOption,
        openOptions
    } = useSelectContext();


    const {select: selectStyles} = styles ?? {};
    const {text: textCustomStyles} = selectStyles ?? {};

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', async () => {
            await setOptionsListPosition();
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', async () => {
            await setOptionsListPosition();
        });
        dispatch({
            type: 'setSearchInputRef',
            payload: searchInputRef,
        });
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
            dispatch({
                type: 'setSearchInputRef',
                payload: null,
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChangeText = async (payload: string) => {

        if (disabled) {
            return;
        }

        if (optionsResolver) {

            dispatch({
                type: 'setSearchValue',
                payload,
            });

            if (payload && payload.length > 2) {
                const options = await optionsResolver(payload)
                dispatch({
                    type: 'resolveOptions',
                    payload: options
                });
                openOptions()
            } else if (!payload.trim()) {
                dispatch({
                    type: 'setOptions',
                    payload: []
                });
                dispatch({type: 'close'})
            }
        } else if (searchPattern) {
            if (!isOpened) {
                dispatch({type: 'open'});
            }
            dispatch({
                type: 'setSearchValue',
                payload,
            });
            dispatch({
                type: 'searchOptions',
                searchPattern,
                payload,
            });
        }
        // callback

        onSelectChangeText?.(payload);
    };

    const resolvePlaceholder = () => {
        if (multiple && Array.isArray(selectedOption) && selectedOption.length > 0) {
            return '  ';
        }
        return placeholderText;
    };

    const resolvedPlaceholder = resolvePlaceholder();

    return {
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
    };
};
