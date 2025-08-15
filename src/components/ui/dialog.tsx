import React, {MutableRefObject, PropsWithChildren, useEffect, useState} from "react"
import {StyleSheet, ViewStyle} from "react-native"
import {Dialog as VendorDialog, Text, View} from "react-native-ui-lib"
import {DialogProps} from "react-native-ui-lib/src/components/dialog";
import {UiActions, UiActionsProps} from "~ui/actions";
import {UiBtnProps} from "~ui/btn";
import {COLORS} from "~assets/design";
import {CLOSER_CLOSE} from "~assets/icons-map";
import {TBottomSheetApi} from "~ui/bottom-sheet";

export type UiDialogProps = DialogProps & {
    title?: string
    closerShow?: boolean
    closerPosition?: 'header' | 'outer'
    content?: any
    actions?: Partial<UiActionsProps>
    actionSuccess?: UiBtnProps | boolean
    actionCancel?: UiBtnProps | boolean
    onSuccess?: () => void
    onCancel?: () => boolean | void
    onClose?: () => boolean | void
    headerSlot?: any
    headerHide?: boolean
    childrenRender?: (props: UiDialogProps) => any
}

export const UiDialog: React.FC<PropsWithChildren<UiDialogProps>> = (props) => {

    const {
        title,
        headerSlot,
        closerShow = true,
        closerPosition = 'header',
        children,
        onSuccess,
        onCancel,
        actionSuccess,
        actionCancel,
        visible,
        onDismiss,
        onClose,
        actions,
        containerStyle,
        headerHide,
        childrenRender,
        ...rest
    } = props


    const [visibleState, setVisibleState] = useState<boolean>(!!visible)

    useEffect(() => {
        
        setVisibleState(!!visible)
    }, [visible])


    let _actions: UiActionsProps = {
        items: [],
        containerStyle: {},
        itemProps: {
            //color: COLORS.primary
        },
        ...(actions || {})
    }

    _actions.containerStyle = {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-end',
        ...(_actions.containerStyle as ViewStyle || {})
    }

    const onSuccessProxy = () => {
        onSuccess && onSuccess()
        setVisibleState(false)
        onClose && onClose()
    }

    const onCancelProxy = (fromDismiss = false) => {
        if (!onCancel || onCancel() !== false || fromDismiss) {
            setVisibleState(false)
            fromDismiss && onDismiss && onDismiss(props)
            onClose && onClose()
        }
    }

    if (actionSuccess) {
        _actions.items?.push({
            label: 'OK',
            color: COLORS._white,
            onPress: onSuccessProxy,
            ...(typeof actionSuccess === 'object' ? actionSuccess : {})
        })
    }

    if (actionCancel) {
        _actions.items?.push({
            label: 'Отменить',
            outline: true,
            color: COLORS.primary,
            onPress: onCancelProxy,
            ...(typeof actionCancel === 'object' ? actionCancel : {})
        })
    }

    const closer = (p?: any) => CLOSER_CLOSE({
        size: 21,
        onPress: onClose,
        ...(p || {})
    })

    return (
        <VendorDialog
            containerStyle={[styles.container, containerStyle]}
            visible={visibleState}
            onDismiss={() => onCancelProxy(true)}
            {...rest}
        >
            {
                closerPosition === 'outer' && closer({
                    style: [
                        styles.closerView,
                        styles.closerPosOuter,
                    ]
                })
            }

            {
                headerSlot ?
                    headerSlot({
                        closer: closer
                    })
                    :
                    (
                        !headerHide && (title || closerPosition === 'header') &&
                        <View row centerV paddingV-0 paddingH-0 style={styles.header}>

                            {title && <Text text-lg-lh0 bold>{title}</Text>}

                            {closerShow && closerPosition === 'header' && closer({
                                style: [
                                    styles.closerView,
                                    styles.closerPosHeader,
                                ]
                            })}
                        </View>
                    )
            }

            {childrenRender ?
                (visible ? childrenRender(props) : null)
                :
                children
            }

            {!!_actions.items?.length && <UiActions {..._actions}/>}

        </VendorDialog>
    )
}

export default UiDialog

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        gap: 18,
        overflow: 'visible'
    },
    header: {},
    closerView: {},
    closerPosHeader: {
        marginLeft: 'auto'
    },
    closerPosOuter: {
        top: -35,
        right: 0,
        position: "absolute",
        zIndex: 100,
    },
})

export function useDialog(props: Partial<UiDialogProps> & {
    apiRef?: MutableRefObject<TBottomSheetApi | undefined>
} = {}): TDialogScope {

    const {
        onClose,
        apiRef
    } = props

    const [visible, setVisible] = useState<boolean>(() => props.visible ?? false)
    const hide = () => setVisible(false)
    const show = () => {
        setVisible(true)
    }

    const _onClose = () => {
        if (onClose) {
            onClose()
        } else {
            hide()
        }
    }

    const render = (children: any) => <UiDialog
        {...props}
        onClose={_onClose}
        visible={visible}
        children={children}
    />

    const methods = {
        setVisible,
        show,
        hide,
        render,
        close: _onClose
    }

    if (apiRef)
        apiRef.current = methods

    return {
        visible,
        actions: props.actions,
        ...methods
    }
}

export type TDialogScope = {
    visible: boolean
    setVisible: (v: boolean) => void
    show: () => void
    hide: () => void
    actions?: Partial<UiActionsProps>
    render: (children: any) => any
    close: () => any
}
