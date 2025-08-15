import {Text, TextField as VendorTextField, TextFieldProps, TouchableOpacity, View} from "react-native-ui-lib"
import React, {useEffect, useImperativeHandle, useLayoutEffect, useMemo, useState} from "react"
import {
    ActivityIndicator,
    LayoutChangeEvent,
    LayoutRectangle,
    NativeSyntheticEvent,
    ScrollView,
    StyleProp,
    TextInputFocusEventData,
    TextStyle,
    View as NativeView,
    ViewStyle
} from "react-native"
import {
    TPresetName,
    TValidatableComponentHandle,
    TValidateErrors,
    TValidateMode,
    TValidateResult,
    TValidateRules
} from "@core/main/types"
import {useServices} from "~services"
import {observer} from "mobx-react"
import testRules from "@core/main/util/validate/testRules"
import {presets, styles} from "./index.styles"
import {UiBtnProps} from "~ui/btn";
import icons from "~assets/icons-map";
import {UiActions} from "~ui/actions";
import {useBottomSheetInternal} from '~ui/bottom-sheet-vendor'
import useMaskedInputProps from "react-native-mask-input/src/useMaskedInputProps";
import {MaskInputProps} from "react-native-mask-input/src/MaskInput.types";
import {useScreenLayout} from "@core/main/lib/hooks/useScreenLayout";
import {useLayout} from "@core/main/lib/hooks/useLayout";
import {useWatch} from "@core/main/lib/hooks/useWatch";
import render from "@core/main/util/react/render";
import {COLORS} from "~assets/design";
import {usePresets} from "@core/main/lib/hooks/usePresets";

export type UiTextFieldProps = TextFieldProps & MaskInputProps & {
    locked?: boolean
    contextBackgroundColor?: string

    showCaret?: boolean
    loading?: boolean
    styleColor?: string
    presets?: TPresetName
    errorsStyle?: ViewStyle
    errorsLabelStyle?: TextStyle
    errorHide?: boolean

    options?: object[]
    optionsScroll?: boolean
    optionsOffsetBottom?: number
    optionsHeight?: number
    onOptionsOpen?: any
    onOptionsClose?: any

    optionLabel?: string
    optionText?: string
    optionValue?: string

    optionsShow?: boolean
    optionsHideOnBlur?: boolean
    optionsMode?: 'autocomplete' | 'select' | 'external'
    optionsLimit?: number
    onOptionSelect?: any

    onPress?: () => void
    onPressReadonly?: () => void

    onFieldLayout?: ((event: LayoutChangeEvent) => void) | undefined
    fieldRef?: any

    onChangeValue?: ((v: any) => void) | undefined
    onBlur?: ((v: any) => void) | undefined
    onFocus?: ((v: any) => void) | undefined
    onSubmitEditing?: ((v: any) => void) | undefined

    rules?: TValidateRules
    required?: boolean | string | null

    prependSlot?: (() => React.ReactNode) | React.ReactNode
    appendSlot?: (() => React.ReactNode) | React.ReactNode
    sideSlotsCentered?: boolean

    inputRef?: any
    done?: boolean
    doneIcon?: boolean
    clearable?: boolean
    onClear?: () => void

    actions?: UiBtnProps[]
    actionsPlace?: 'outer' | 'inner'

    bottomSheetHandleScroll?: boolean
    resetErrorsOnChange?: boolean
    validateOnChangeExternal?: boolean

    readonlyColorPreserve?: boolean
}

export type UiTextFieldApi = TValidatableComponentHandle & {
    optionsClose: () => void
    clear: () => void
    focus: () => void
}

const UiTextFieldComponent: React.FC<UiTextFieldProps> = (props, ref) => {

    const {bus} = useServices();

    const {
        testID,
        locked = false,
        showCaret,
        contextBackgroundColor = '#FFFFFF',
        value,

        onPress,
        onPressReadonly,
        onChangeText,
        onChangeValue,

        required,
        rules = [],

        validateOnChangeExternal = true,
        validateOnChange,
        validateOnBlur = true,
        validateOnStart,
        resetErrorsOnChange,

        options,
        optionsHeight,
        optionsOffsetBottom = 0,
        optionsScroll,

        onOptionsOpen,
        onOptionsClose,

        optionLabel = 'label',
        optionText = 'value',
        optionValue = null,

        optionsMode = 'autocomplete',
        optionsLimit,
        optionsHideOnBlur = true,
        onOptionSelect,

        prependSlot,
        appendSlot,
        sideSlotsCentered = true,

        inputRef,
        actions = [],
        actionsPlace = 'inner',
        clearable = false,
        done = false,
        doneIcon = false,
        onClear,
        loading,
        bottomSheetHandleScroll = true,
        errorsStyle,
        errorsLabelStyle,
        errorHide = false,

        onFieldLayout,
        fieldRef,

        mask,
        placeholderFillCharacter = '_',
        obfuscationCharacter,
        showObfuscatedValue,
        selection,
        maskAutoComplete,
        readonly,
        editable,
        readonlyColorPreserve,
        style
    } = props

    const rightRef = React.useRef<NativeView>()
    const textRef = React.useRef<any>()
    const viewRef = React.useRef<any>()
    const _fieldRef = fieldRef || React.useRef<NativeView>(null)

    const [layoutRect, setLayoutRect] = useState<LayoutRectangle>({width: 0, height: 0, y: 0, x: 0})

    const [selectedOption, setSelectedOption] = useState(null)
    const [optionsVisible, setOptionsVisible] = useState(false)
    const [text, setText] = useState(value)
    const [textChanged, setTextChanged] = useState(false)

    const [needValidate, setNeedValidate] = useState(false)
    const [validateCalled, setValidateCalled] = useState(false)
    const [haveError, setHaveError] = useState(false)
    const [errorMessages, setErrorMessages] = useState<TValidateErrors | null>(null)

    const bottomSheetInternal = useBottomSheetInternal(true)

    const {shouldHandleKeyboardEvents} = bottomSheetInternal || {shouldHandleKeyboardEvents: null}

    const {
        contentVisibleHeightWithHeader
    } = useScreenLayout({
        enable: !!optionsScroll
    })


    const fieldLayout = useLayout(_fieldRef, {testId: 'text-field.field'})

    const _onFieldLayout = (e: LayoutChangeEvent) => {
        onFieldLayout && onFieldLayout(e)
        fieldLayout.onLayout(e)
    }

    const _optionsHeight = useMemo(() => {
        return optionsHeight || contentVisibleHeightWithHeader - (
            fieldLayout.measure.pageY +
            fieldLayout.measure.height +
            optionsOffsetBottom
        )
    }, [
        contentVisibleHeightWithHeader,
        optionsHeight,
        fieldLayout.measure,
        optionsOffsetBottom
    ])

    useImperativeHandle<any, UiTextFieldApi>(ref, () => ({
        ...textRef.current,
        validate: () => methods.validate(),
        validateReset: methods.validateReset,
        optionsClose: () => {
            setOptionsVisible(false)
        },
        clear: () => {
            textRef.current?.clear();
        },
        focus: () => {
            textRef.current?.focus();
        },
    }))

    useLayoutEffect(() => {
        if (inputRef)
            inputRef.current = textRef.current
    }, [inputRef, textRef])

    useEffect(() => {

        if (validateOnStart) {
            setNeedValidate(true)
        }
    }, [])

    useEffect(() => {

        return () => {
            if (shouldHandleKeyboardEvents) {
                shouldHandleKeyboardEvents.value = false;
            }
        };
    }, [shouldHandleKeyboardEvents])

    useEffect(() => {

        if (text === value) return;
        setText(value)
        if (validateOnChangeExternal && validateCalled) {
            setNeedValidate(true)
        }
    }, [value, text, validateOnChangeExternal])

    useEffect(() => {

        if (needValidate) {
            methods.validate()
            setNeedValidate(false)
        }
    }, [needValidate])


    const onClickOutside = () => {
        setOptionsVisible(false)
    }

    useWatch(() => {
        if (optionsVisible) {
            onOptionsOpen && onOptionsOpen()
        } else {
            onOptionsClose && onOptionsClose()
        }

    }, [optionsVisible])


    useEffect(() => {

        bus.emitter.on('clickOutside', onClickOutside)
        return () => {
            bus.emitter.off('clickOutside', onClickOutside)
        }
    }, [])

    const _style: StyleProp<TextStyle> = {}

    if ((editable === false || readonly) && readonlyColorPreserve)
        _style.color = COLORS.black

    const computed = {
        rules: useMemo(() => {
            let res: TValidateRules = []
            if (required) {
                res.push((v) => !!v || (typeof required === 'boolean' ? 'Обязательное поле' : required))
            }
            res = [...res, ...rules]
            return res
        }, [rules, required])
    }

    const methods = {
        validate: (mode?: TValidateMode): TValidateResult => {


            let res: TValidateResult = true


            if (computed.rules && computed.rules.length) {

                res = testRules('first', computed.rules, text)

                if (res === true) {
                    setHaveError(false)
                    setErrorMessages(null)
                } else {
                    setHaveError(true)
                    setErrorMessages(res)
                }
            }

            setValidateCalled(true)

            return res
        },

        validateReset: () => {
            setNeedValidate(false)
            setValidateCalled(false)
            setHaveError(false)
            setErrorMessages(null)
        },

        getOptionValue: (option: any) => {
            return (!optionValue || optionValue === 'option') ? option : option[optionValue]
        },
        getOptionText: (option: any) => {
            return option[optionText]
        },
        onChangeTextMasked: (masked: string, unmasked: string, obfuscated: string) => {
            methods.onChangeText(unmasked)
        },
        onChangeText: (v: string) => {
            if (locked)
                return;

            if (text === v)
                return;

            if (resetErrorsOnChange) {
                setErrorMessages(null)
                setHaveError(false)
            }
            if (validateOnChange) {
                setNeedValidate(true)
            }
            setText(v)
            setOptionsVisible(true)
            onChangeText && onChangeText(v, v, v)
            setTextChanged(true)
        },
        onFocus: (e: NativeSyntheticEvent<TextInputFocusEventData>) => {

            if (onPress) {
                onPress()
                return
            }

            if (shouldHandleKeyboardEvents && bottomSheetHandleScroll) {
                shouldHandleKeyboardEvents.value = true
            }

            bus.emitter.emit('input:focus', {
                viewRef,
                textRef,
                layout: layoutRect
            })

            // @ts-ignore
            props.onFocus && props.onFocus(e)
        },
        onBlurDelayed: (e: any) => {
            setTimeout(() => methods.onBlur(e), 5000)
        },
        onBlur: (e: any) => {
            if (shouldHandleKeyboardEvents && bottomSheetHandleScroll) {
                shouldHandleKeyboardEvents.value = false
            }
            if (validateOnBlur && rules.length) {
                setNeedValidate(true)
            }

            if (options && optionsHideOnBlur && textChanged) {

                let foundOption

                if (selectedOption) {
                    if (text === methods.getOptionText(selectedOption)) {
                        foundOption = selectedOption
                    }
                }

                if (!foundOption)
                    foundOption = options.find(option => methods.getOptionText(option) === text)

                if (!foundOption && selectedOption)
                    foundOption = selectedOption

                if (foundOption)
                    methods.optionSelect(foundOption)

                setOptionsVisible(false)
            }

            // @ts-ignore
            props.onBlur && props.onBlur(e)
        },
        optionSelect: (option: any) => {

            setSelectedOption(option)
            const optionText = methods.getOptionText(option)
            setText(optionText)
            onChangeText && onChangeText(optionText, optionText, optionText)
            onChangeValue && onChangeValue(methods.getOptionValue(option))
            onOptionSelect && onOptionSelect(option)
            setOptionsVisible(false)
            setTextChanged(false)
        }
    }

    const maskedInputProps = useMaskedInputProps({
        value: text,
        mask,
        maskAutoComplete,
        obfuscationCharacter,
        onChangeText: methods.onChangeTextMasked,
        placeholderFillCharacter,
        showObfuscatedValue,
    });

    const valuePrepared = mask ? maskedInputProps.value : text
    const valueEmpty = !valuePrepared

    const _options = useMemo(() => {
        return options || []
    }, [options])


    const renderOptions = () => {

        if (!props.optionsShow && (!_options.length || !optionsVisible))
            return <></>

        if (optionsScroll) {
            return <ScrollView
                keyboardShouldPersistTaps={'handled'}
                style={[
                    styles.optionsCommon,
                    styles.optionsScrollable,
                    {
                        maxHeight: _optionsHeight
                    }
                ]}
            >
                {renderOptionsItems(_options)}
            </ScrollView>
        } else {
            return <View
                style={[
                    styles.optionsCommon,
                    styles.optionsNonScrollable,
                ]}
            >
                {renderOptionsItems(_options)}
            </View>
        }
    }

    const renderOptionsItems = (options: any[]) => {
        const _options = optionsLimit ? options.slice(0, optionsLimit) : options
        return _options.map((option, index) => (
            <TouchableOpacity
                key={option[optionLabel]}
                style={styles.option}
                onPress={() => methods.optionSelect(option)}
            >
                <Text style={styles.optionText}>{option[optionLabel]}</Text>
            </TouchableOpacity>
        ))
    }

    const _props = {
        ...props,
        styleColor: '#CCCCCC'
    }

    const presetResult = usePresets(_props, props.presets || [], presets, [_props.styleColor])

    const styleMainColSecondary: ViewStyle = {}

    if (props.floatingPlaceholder) {
        //styleMainColSecondary.marginTop = 15
    }

    const [rightWidth, setRightWidth] = useState(0)

    const rightRendered = useMemo(() => {

        const _actions: UiBtnProps[] = [...actions] || []

        if (done && doneIcon) {
            _actions.push({
                icon: icons.check,
                color: COLORS.green20,
                backgroundColor: COLORS.white,
                diameter: 25,
                iconSize: 20,
                outline: false,
                enableShadow: false,
            })
        } else if (clearable && !valueEmpty) {
            _actions.push({
                icon: icons.xmark,
                color: '#999999',
                backgroundColor: '#EEEEEE',
                diameter: 25,
                iconSize: 20,
                outline: false,
                onPress: () => {
                    onClear ? onClear() : methods.onChangeText('')
                }
            })
        }

        let content = []

        if (loading) {
            content.push(<ActivityIndicator key={'loading'} color={'#000000'}/>)
        } else {
            if (showCaret)
                content.push(icons.angleRight({key: 'caret', size: 18, color: COLORS.grey20}))
            if (!!_actions.length)
                content.push(<UiActions
                    key={'actions'}
                    items={_actions}
                    itemProps={presetResult.action}
                />)
        }

        return !!content.length &&
            <View
                style={[
                    styleMainColSecondary,
                    actionsPlace === 'inner' ? styles.actionsInner : styles.actionsOuter,
                    actionsPlace === 'inner' ? presetResult.styles.actionsInner : presetResult.styles.actionsOuter,
                ]}
                centerV
                onLayout={(event) => {
                    setRightWidth(event.nativeEvent.layout.width)
                }}
            >
                {content.map(item => item)}
            </View>
    }, [actions, clearable, done, doneIcon, loading, valueEmpty])

    const [
        Container,
        containerProps
    ] = onPress ? [TouchableOpacity, {onPress}] : [View, {}]

    return (
        <Container
            style={styles.container}
            ref={viewRef}
            collapsable={false}
            {...containerProps}
        >
            <View
                onLayout={_onFieldLayout}
                ref={_fieldRef}
            >
                <View
                    row
                    centerV={sideSlotsCentered}
                    style={styles.main}
                >
                    {prependSlot && (
                        <View flexS style={styleMainColSecondary}>
                            {render(prependSlot)}
                        </View>
                    )}

                    <View flexG style={{flexShrink: 1}}>

                        <VendorTextField
                            pointerEvents={onPress ? 'none' : 'auto'}
                            {...props}
                            ref={textRef}
                            value={valuePrepared}
                            fieldStyle={[
                                styles.fieldStyle,
                                props.fieldStyle,
                                presetResult.styles.field,
                                haveError && styles.fieldStyleError
                            ]}
                            containerStyle={[
                                props.containerStyle,
                                props.floatingPlaceholder && {
                                    marginTop: -20,
                                    //borderWidth: 1
                                }
                            ]}
                            floatingPlaceholderStyle={[presetResult.styles.floatingPlaceholder, {backgroundColor: contextBackgroundColor}] as any}
                            onChangeText={mask ? maskedInputProps.onChangeText : methods.onChangeText}
                            onBlur={methods.onBlur}
                            onFocus={methods.onFocus}
                            selection={mask && maskedInputProps.selection ? maskedInputProps.selection : selection}
                            style={[
                                presetResult.styles.input,
                                style,
                                _style,
                                {
                                    paddingRight: rightWidth
                                }
                            ]}
                        />

                    </View>

                    {appendSlot && (
                        <View flexS style={styleMainColSecondary}>
                            {render(appendSlot)}
                        </View>
                    )}

                    {rightRendered}

                </View>

                {!errorHide && haveError && Array.isArray(errorMessages) && (
                    <View style={[
                        styles.errorView,
                        errorsStyle
                    ]}>
                        {errorMessages.map((message, index) => (
                            <View key={index} style={styles.errorItem}>
                                <Text
                                    text-sm-lh1
                                    style={[
                                        styles.errorItemText,
                                        errorsLabelStyle
                                    ]}
                                >{message.message}</Text>
                            </View>
                        ))}
                    </View>
                )}

            </View>
            {renderOptions()}
        </Container>
    )
}

// @ts-ignore
export const UiTextField = observer(React.forwardRef<UiTextFieldApi, UiTextFieldProps>(UiTextFieldComponent))

