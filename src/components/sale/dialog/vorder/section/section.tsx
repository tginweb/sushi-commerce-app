import React, {useCallback, useImperativeHandle, useMemo} from "react"
import {ActivityIndicator, StyleProp, StyleSheet, TextStyle} from "react-native"
import {Text, TouchableOpacity, View, ViewProps} from "react-native-ui-lib"
import {Href, TValidateError, TValidateErrors, TValidateResult} from "@core/main/types"
import {observer} from "mobx-react"
import {VorderDialogId} from "@core/sale/types";
import {COLORS, TYPOGRAPHY} from "~assets/design";
import {useStores} from "~stores";
import render from "@core/main/util/react/render";

export type TSectionProps = ViewProps & {
    dialogId?: VorderDialogId

    raw?: boolean
    wrap?: boolean

    fieldHidden?: boolean

    title?: string
    value?: any
    rules?: any
    validate?: () => TValidateResult | undefined
    validateResult?: TValidateResult

    contentSlot?: (props: ISectionContext, style: StyleProp<TextStyle>, renderedValidate?: any) => any
    sideSlot?: any

    loading?: boolean
    icon?: any
    form?: any
    ref?: any

    onOpen?: any
    openCallback?: any
    openUrl?: Href
    filled?: boolean
    outline?: boolean
    primary?: boolean
    fullHeight?: boolean
}

export type ISectionContext = {
    props?: TSectionProps,
    haveError?: boolean,
    errorMessages?: TValidateErrors | null,
    errorMessage?: TValidateError | null,
    emitValueChanged: () => void
    onValueInput: (value: any, cb?: (value: any) => void) => void,
    onValueBlur?: () => void,
    validate: () => void,
    onOpen?: () => void,
}

export const SectionInner: React.FC<TSectionProps> = (
    {
        dialogId,
        children,
        raw,
        wrap = false,

        fieldHidden = false,

        title,
        value,
        rules = [],
        validate,
        validateResult,

        contentSlot,
        sideSlot,

        loading = false,
        /*
        dialog,
        dialogSlot,
        dialogTitle = '',
        dialogActions = [],
        dialogActionsClose = true,
        dialogActionsCloseValidRequired = false,
        dialogCloseValidate,
        dialogProps = {},

         */

        icon,
        onOpen,
        openCallback,
        openUrl,
        style,
        outline,
        primary,
        fullHeight = true,
        ...rest
    },
    ref
) => {
    const {vorder, router} = useStores()

    const open = useCallback(() => {
        if (onOpen && onOpen() === false)
            return;
        if (openCallback) {
            openCallback()
        } else if (openUrl) {
            router.push(openUrl)
        } else if (dialogId) {
            vorder.vorderDialogOpen(dialogId)
        }
    }, [onOpen, openCallback, openUrl, dialogId])

    useImperativeHandle<any, any>(ref, () => ({
        open,
    }))

    const ctx: any = {}

    const contentStyle: StyleProp<TextStyle> = [styles.content]

    if (value) {
        contentStyle.push(styles.contentFilled)
    }

    const renderedLoading = loading && <ActivityIndicator style={{marginLeft: -10}}/>

    const renderedValidate = useMemo(() => {
        return validateResult && validateResult !== true &&
            <View paddingT-6 gap-2>
                {validateResult.map((message, index) => (
                    <View key={index} style={styles.errorItem}>
                        <Text
                            text-xs-lh1
                            red30
                            style={styles.errorItemText}
                        >{(message as any).message}</Text>
                    </View>
                ))}
            </View>
    }, [validateResult])

    let content: any

    if (contentSlot) {
        content = contentSlot(ctx, contentStyle, renderedValidate)
    } else if (children) {
        content = children
    }

    if (raw) {
        return content
    }

    return !fieldHidden &&
        <TouchableOpacity flex onPress={open}>
            <View
                row
                style={[
                    styles.view,
                    style,
                    outline && styles.viewOutline,
                    primary && styles.viewPrimary,
                    validateResult && validateResult !== true ? styles.viewError : {},
                    fullHeight && {
                        flex: 1
                    }
                ]}
                //centerV
                {...rest}
            >
                {
                    (!!icon || !!renderedLoading) &&
                    <View paddingT-2 style={styles.icon}>
                        {!!renderedLoading ? renderedLoading : !!icon && icon({color: COLORS.primary, size: 19})}
                    </View>
                }
                <View
                    flexG
                    row
                    //centerV
                    style={styles.main}
                >
                    <View gap-3 flex>

                        {!!title && <View style={{
                            //borderWidth1: 1
                        }}>
                            <Text text-xxs-lh0 style={styles.label}>{title}</Text>
                        </View>}

                        <View paddingR-4>
                            {content}
                        </View>

                    </View>

                    {sideSlot && (
                        <View style={styles.side} flexS right>
                            {render(sideSlot, ctx)}
                        </View>
                    )}
                </View>
            </View>
            {renderedValidate}
        </TouchableOpacity>
}

// @ts-ignore
export const Section: typeof SectionInner = observer(React.forwardRef(SectionInner))

export const styles = StyleSheet.create({
    viewError: {
        borderColor: '#e02626',
        borderWidth: 1,
    },
    view: {
        borderRadius: 9,
        borderWidth: 0,
        borderColor: '#BBBBBB',
        paddingLeft: 10,
        paddingRight: 0,
        paddingVertical: 10,
        backgroundColor: '#F7F7F7'
    },
    viewInline: {
        paddingRight: 10,
    },
    viewOutline: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDDDDD',
    },
    viewPrimary: {
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    icon: {
        width: 29
    },
    label: {
        color: '#2c525d',
    },
    content: {
        ...TYPOGRAPHY['text-sm-lh1'],
    },
    contentFilled: {
        color: '#111111',
    },
    main: {},
    side: {},
    errorItem: {},
    errorItemText: {}
});
