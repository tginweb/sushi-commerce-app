import type { Dispatch, ForwardedRef, Reducer } from 'react';
import React, {forwardRef, useEffect, useReducer, useRef, useState} from 'react';
import type { SectionListData, ViewStyle } from 'react-native';
import { StyleSheet, UIManager, View } from 'react-native';
import { Portal } from '@gorhom/portal';

import { COLORS, Portals } from '../../constants';
import { OptionsListContextProvider, SelectContextProvider } from '../../context';
import { isAndroid, mergeObjects } from '../../helpers';
import type { ActionType, CreateInitialStateType, State } from '../../state';
import { createInitialState, reducer } from '../../state';
import { themes } from '../../themes';
import type {
    OnPressOptionType,
    OptionsType,
    OptionType,
    SelectProps,
    SelectRef,
    SelectStyles,
} from '../../types';
import { Backdrop } from '../backdrop';
import { OptionsList } from '../options-list';
import { SelectControl } from '../select-control';

import { useSelect } from './select.hooks';
import {useWatch} from "@core/main/lib/hooks/useWatch";

if (isAndroid && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SelectComponent = <T,>(props: SelectProps<T>, ref: ForwardedRef<SelectRef<T>>) => {
    const {
        // Required
        options,

        // Basic
        animation = true,
        clearable = true,
        closeOptionsListOnSelect = true,
        defaultOption,
        disabled = false,
        hasBackdrop = true,
        hideArrow = false,
        multiple = false,
        noOptionsText = 'нет результатов',
        placeholderText = 'выбрать...',
        placeholderTextColor = COLORS.GRAY,
        pressableSelectedOption = true,
        scrollToSelectedOption = true,
        searchable = false,
        searchPattern = (payload: string) => `(${payload})`,
        styles: customStyles,
        theme = 'none',
        // Callbacks
        onSelectChangeText,
        onSectionSelect,
        onSectionRemove,
        onSelect,
        onSelectOpened,
        onSelectClosed,
        onRemove,
        // Customized
        arrowContainerProps,
        arrowImageProps,
        backdropChildProps,
        backdropProps,
        clearOptionButtonProps,
        clearOptionImageProps,
        flatListProps,
        noOptionsProps,
        noOptionsTextProps,
        optionButtonProps,
        optionTextProps,
        selectContainerProps,
        inputProps,
        selectLeftIconImageProps,
        selectLeftIconsProps,
        selectRightIconsProps,
        selectTextProps,
        sectionHeaderButtonProps,
        sectionHeaderImageProps,
        sectionHeaderTextProps,
        sectionListProps,
        optionsResolver,
        optionInnerSlot,
        searchText= ''
    } = props;


    const [state, dispatch] = useReducer<
        Reducer<State<T>, ActionType<T>>,
        CreateInitialStateType<T>
    >(reducer, { options, searchable, searchValue: searchText, animation, defaultOption }, createInitialState);

    const d = dispatch as Dispatch<ActionType<unknown>>

    useEffect(() => {
        //d({type: 'setOptions', payload: options})
    }, [options])

    const [mounted, setMounted] = useState(false)

    const resolveRun = async (payload: string) => {
        const options = await optionsResolver(payload)

        if (options) {
            d({
                type: 'resolveOptions',
                payload: options
            });
            openOptions()
        }
    }
    useWatch(() => {

        d({
            type: 'setSearchValue',
            payload: searchText
        })
        if (optionsResolver) {
            resolveRun(searchText)
        }
    }, [searchText])

    const {
        isOpened,
        selectedOption,
        optionsData,
        openedPosition,
        searchValue,
        searchedOptions,
        selectedOptionIndex,
    } = state;

    const { aboveSelectControl } = openedPosition;
    const mainStyles: SelectStyles = mergeObjects(themes[theme], customStyles);

    const selectControlRef = useRef<View>(null);
    const optionsListRef = useRef<View>(null);

    const {
        setOptionsListPosition,
        onPressOption,
        onOutsidePress,
        onPressSelectControl,
        onPressSection,
        openOptions
    } = useSelect<T>({
        selectControlRef,
        optionsListRef,
        dispatch,
        onRemove,
        disabled,
        closeOptionsListOnSelect,
        searchable,
        multiple,
        onSelectOpened,
        onSelectClosed,
        ref,
        state,
        onSectionSelect,
        onSectionRemove,
        onSelect,
        optionsResolver
    });

    const _optionsData = optionsData as OptionsType<unknown>

    return (
        <View style={styles.relative}>
            <SelectContextProvider
                value={{
                    isOpened,
                    animation,
                    aboveSelectControl,
                    clearable,
                    disabled,
                    hideArrow,
                    multiple,
                    optionsData: optionsData as OptionsType<unknown>,
                    placeholderText,
                    placeholderTextColor,
                    searchPattern,
                    optionsResolver,
                    searchValue,
                    onPressSelectControl,
                    inputProps,
                    onRemove: onRemove as
                        | ((option: OptionType, optionIndex: number) => void)
                        | undefined,
                    dispatch: dispatch as Dispatch<ActionType<unknown>>,
                    setOptionsListPosition,
                    selectedOption,
                    selectedOptionIndex,
                    styles: mainStyles,
                    clearOptionButtonProps,
                    clearOptionImageProps,
                    arrowContainerProps,
                    arrowImageProps,
                    selectRightIconsProps,
                    selectLeftIconsProps,
                    selectLeftIconImageProps,
                    selectTextProps,
                    selectContainerProps,
                    onSelectChangeText,
                    openOptions,
                    optionInnerSlot
                }}
            >
                <SelectControl ref={selectControlRef} />
            </SelectContextProvider>
            {isOpened && !!_optionsData.length && (
                <>
                    {hasBackdrop && (
                        <Portal hostName={Portals.Backdrop}>
                            <Backdrop
                                backdropCustomStyles={mainStyles?.backdrop}
                                backdropProps={backdropProps}
                                backdropChildProps={backdropChildProps}
                                onOutsidePress={onOutsidePress}
                            />
                        </Portal>
                    )}
                    <Portal hostName={Portals.OptionsList}>
                        <OptionsListContextProvider
                            value={{
                                animation,
                                aboveSelectControl,
                                flatListProps,
                                isOpened,
                                noOptionsText,
                                openedPosition,
                                optionsData: optionsData as OptionsType<unknown>,
                                optionsResolver: optionsResolver,
                                scrollToSelectedOption,
                                searchValue,
                                onPressOption: onPressOption as OnPressOptionType<unknown>,
                                onPressSection,
                                selectedOption,
                                searchedOptions: searchedOptions as OptionsType<unknown>,
                                selectedOptionIndex,
                                sectionListProps: sectionListProps as SectionListData<
                                    OptionsType<OptionType>
                                >,
                                styles: mainStyles,
                                optionButtonProps,
                                optionTextProps,
                                noOptionsProps,
                                noOptionsTextProps,
                                sectionHeaderButtonProps,
                                sectionHeaderImageProps,
                                sectionHeaderTextProps,
                                pressableSelectedOption,
                                multiple,
                                disabled,
                                optionInnerSlot
                            }}
                        >
                            <OptionsList ref={optionsListRef} />
                        </OptionsListContextProvider>
                    </Portal>
                </>
            )}
        </View>
    );
};

type Styles = {
    relative: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
    relative: {
        position: 'relative',
    },
});

export const Select = forwardRef(SelectComponent) as <T>(
    props: SelectProps<T> & { ref?: ForwardedRef<SelectRef<T>> },
) => ReturnType<typeof SelectComponent>;
