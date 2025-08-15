import React, {useCallback, useMemo, useRef, useState} from "react"
import {ScrollView, StyleSheet} from "react-native"
import {UiTextField, UiTextFieldApi, UiTextFieldProps} from "~ui/text-field";
import {UiListItemProps} from "~ui/list-item";
import {TBottomSheetApi, TBottomSheetScope, UiBottomSheetProps, useBottomSheetScope} from "~ui/bottom-sheet";
import {UiBtnProps} from "~ui/btn";
import {UiOptions, UiOptionsOnChangeValue, UiOptionsProps} from "~ui/options";
import {TMaybe} from "@core/main/types";
import {useWatch} from "@core/main/lib/hooks/useWatch";
import {WheelPicker} from "react-native-ui-lib";
import {TDialogScope, UiDialogProps, useDialog} from "~ui/dialog";
import {useStateRef} from "@core/main/lib/hooks/useStateRef";

type TItemDataExtractor<T> = string | ((item: UiListItemProps) => T)

type TDialogProps = UiBottomSheetProps | UiDialogProps

export type UiSelectProps = Omit<UiTextFieldProps, 'value'> & {
    selectView?: 'dialog' | 'sheet'
    itemsView?: 'wheel' | 'options'
    itemsProps?: Partial<UiOptionsProps>
    items: UiListItemProps[]
    dialogProps?: TDialogProps
    value?: any
    itemLabel?: TItemDataExtractor<string>
    onSelect?: UiOptionsOnChangeValue
    needDone?: boolean
    doneShow?: true | 'value'
    doneEnable?: true | 'value'
    emitOnChange?: boolean
    closeOnChange?: boolean
}

export type UiSelectApi = UiTextFieldApi & {}

const itemDataExtract = (item: TMaybe<UiListItemProps>, extractor: TItemDataExtractor<any>) => {
    if (!item || !extractor)
        return
    if (typeof extractor === 'string') {
        // @ts-ignore
        return item[extractor]
    } else {
        return extractor(item)
    }
}

const UiSelectComponent: React.FC<UiSelectProps> = (props, ref) => {

    const {
        needDone = false,
        emitOnChange = false,
        selectView = 'sheet',
        itemsView = 'options',
        itemsProps = {
            'paddingV-10': true
        },
        dialogProps = {
            title: 'Выберите'
        },
        items,
        value,
        itemLabel = 'label',
        onSelect,
        closeOnChange,
        doneShow,
        doneEnable,
        ...rest
    } = props

    const apiRef = useRef<TBottomSheetApi>()

    const [selectedValue,  , selectedValueRef, updateSelectedValue] = useStateRef<any>(null)

    const [text, setText] = useState(() => {
        return itemDataExtract(items.find(item => item.value === value), itemLabel)
    })

    useWatch(() => {
        const item = items.find(item => item.value === value)
        if (item) {
            setText(itemDataExtract(item, itemLabel))
            updateSelectedValue(value)
        }
    }, [value])

    const emitSelect = (value: any, force: boolean = false) => {
        if (value) {
            const item = items.find(item => item.value === value)
            if (item) {
                setText(itemDataExtract(item, itemLabel))
                onSelect && onSelect(selectedValue, item.data, item)
            }
        }
    }

    const footerActions = useMemo(() => {
        const res: UiBtnProps[] = []
        if (doneShow === true || doneShow === 'value' && selectedValue) {
            res.push({
                label: 'Готово',
                onPress: () => {
                    _onApply()
                },
                disabled: !(doneEnable === true || doneEnable === 'value' && selectedValue)
            })
        }
        return res
    }, [doneShow, selectedValue])

    let dialog: TBottomSheetScope | TDialogScope


    let _dialogProps: TDialogProps = {...dialogProps}

    const onPress = () => {
        dialog.show()
    }

    const onChangeValue: UiOptionsOnChangeValue = (optionValue) => {
        emitOnChange && emitSelect(optionValue)
        updateSelectedValue(optionValue)
        if (closeOnChange) {
            setTimeout(() => {
                dialog.close()
            }, 100)
        }
    }

    const _onApply = () => {
        needDone && emitSelect(selectedValue)
        dialog.hide()
    }

    const _onClose = () => {
        !needDone && emitSelect(selectedValueRef.current)
        dialog.hide()
    }

    const itemsRendered = useMemo(() => {
        let content: any
        switch (itemsView) {
            case 'options':
                content =  <UiOptions
                    value={value}
                    preset={['formOptions']}
                    itemPreset={['formOptions']}
                    onChangeValue={onChangeValue}
                    items={items}
                    {...itemsProps}
                />
                break
            case 'wheel':
                content = <WheelPicker
                    items={items as any}
                    initialValue={value}
                    onChange={onChangeValue as any}
                />
                break
        }

        if (selectView === 'dialog') {
            content = <ScrollView style={{flex: 1}}>
                {content}
            </ScrollView>
        }

        return content
    }, [items, value, onChangeValue, selectedValue])

    switch (selectView) {
        case 'sheet':
            _dialogProps = _dialogProps as UiBottomSheetProps

            if (itemsView === 'wheel')
                _dialogProps.bodyScrollable = false

            dialog = useBottomSheetScope({
                initialVisible: false,
                autoHeight: true,
                preset: 'default',
                stackBehavior: 'push',
                onClose: _onClose,
                ..._dialogProps,
                footerActions,
                apiRef
            })
            break

        case 'dialog':
            _dialogProps = _dialogProps as UiDialogProps

            dialog = useDialog({
                onClose: _onClose,
                ..._dialogProps,
                actions: {
                    //items: footerActions
                },
                apiRef,
            })

            break
    }


    return <>
        <UiTextField
            editable={false}
            readonlyColorPreserve={true}
            showCaret={true}
            onPress={onPress}
            value={text}
            ref={ref}
            {...rest}
        />
        {dialog.render(itemsRendered)}
    </>
}

//@ts-ignore
export const UiSelect = React.forwardRef<UiSelectApi, UiSelectProps>(UiSelectComponent)

const styles = StyleSheet.create({})
