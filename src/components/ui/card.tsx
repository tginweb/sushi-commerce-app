import React, {useCallback, useMemo} from "react"
import {StyleSheet} from "react-native"
import {Colors, LoaderScreen, Text, TouchableOpacity, View, ViewProps} from "react-native-ui-lib"
import {UiBtnProps} from "~ui/btn";
import {UiActions} from "~ui/actions";
import {TBuildableComponentProps, TMenuAction, TPresetName} from "@core/main/types";
import {useApp} from "@core/main/lib/hooks/useApp";
import {UiBuildable} from "~ui/buildable";
import {usePresets} from "@core/main/lib/hooks/usePresets";
import {useStores} from "~stores";

export type UiCardBaseProps = ViewProps & {
    onPress?: () => void
    containerProps?: any
    contentProps?: any
    title?: string
    titleProps?: any
    titleAlign?: string
    headerMore?: string | boolean
    headerMoreUrl?: string
    headerSide?: any
    headerActions?: UiBtnProps[]
    headerProps?: any
    headerMainProps?: any
    headerSideProps?: any
    footerActions?: UiBtnProps[]
    preset?: TPresetName
    loading?: boolean
    loadingOnPressEnable?: boolean
    loadingHeight?: number
    loadingSpinnerSize?: number | 'small' | 'large' | undefined
    hideNoContent?: boolean
    onPressAction?: TMenuAction
}

export const UiCardComponent = React.forwardRef<any, UiCardBaseProps>((props, ref) => {

    const app = useApp()

    const {menu} = useStores()

    const presets = app.getPresets('UiCard')

    const presetRes = usePresets(props, props.preset, presets, [])

    const {
        hideNoContent = true,
        children,
        containerProps,
        contentProps,
        title,
        titleProps,
        headerSide,
        headerMore,
        headerMoreUrl,
        headerActions,
        headerProps,
        footerActions,
        headerMainProps,
        headerSideProps,
        loading,
        loadingOnPressEnable = false,
        loadingHeight = null,
        loadingSpinnerSize = 'small',
        onPress,
        onPressAction,
        ...rest
    } = props


    const _containerProps = {
        style: {},
        ...containerProps
    }

    const _contentProps = {
        style: {},
        ...contentProps
    }

    const _headerProps = {
        style: {},
        ...headerProps
    }

    const _headerMainProps = {
        style: {},
        ...headerMainProps
    }

    const _headerSideProps = {
        style: {},
        ...headerSideProps
    }

    const _titleProps = {
        style: {},
        ...titleProps
    }

    let Wrapper

    if (onPress || onPressAction) {
        const _onPress = useCallback(() => {
            if (!loading || loadingOnPressEnable) {
                onPress && onPress()
                onPressAction && menu.runActionItem(onPressAction)
            }
        }, [loading, loadingOnPressEnable])
        Wrapper = TouchableOpacity
        _containerProps.onPress = _onPress
    } else {
        Wrapper = View
    }

    const _headerActions = useMemo(() => {
        const res: UiBtnProps[] = headerActions || []
        if (headerMore) {
            res.push(
                {
                    "label": typeof headerMore === 'string' ? headerMore : 'еще',
                    "size": 'xSmall',
                    "link": true,
                    "color": "#D16837",
                    "action": {"url": headerMoreUrl}
                }
            )
        }
        return res
    }, [headerActions, headerMore, headerMoreUrl])

    if (hideNoContent && !children)
        return <></>

    return (
        <Wrapper
            {..._containerProps}
            style={[
                presetRes.styles.container,
                _containerProps.style,
            ]}
            ref={ref}
            {...rest}
        >
            {(title || headerActions && headerActions.length) &&
                <View
                    {..._headerProps}
                    row
                    centerV
                    style={[
                        presetRes.styles.header,
                        _headerProps.style,
                    ]}
                >
                    <View
                        {..._headerMainProps}
                        flexG
                        style={[
                            presetRes.styles.headerMain,
                            _headerMainProps.style
                        ]}
                    >
                        <Text
                            {..._titleProps}
                            style={[
                                presetRes.styles.title,
                                _titleProps.style
                            ]}
                        >{title}</Text>
                    </View>

                    {(!!headerSide || _headerActions && !!_headerActions.length) &&
                        <View
                            {..._headerSideProps}
                            style={[
                                presetRes.styles.headerSide,
                                _headerSideProps.style
                            ]}
                        >
                            {headerSide}
                            {_headerActions && !!_headerActions.length && <UiActions
                                items={_headerActions}
                            />}
                        </View>
                    }
                </View>
            }

            <View
                {..._contentProps}
                style={[
                    presetRes.styles.content,
                    _contentProps.style
                ]}
            >
                {loading ?
                    <View style={{height: loadingHeight ? loadingHeight : undefined, flex: 1}} paddingV-5>
                        <LoaderScreen
                            overlay={false}
                            color={Colors.grey40}
                            size={loadingSpinnerSize as any}
                        />
                    </View> : children}
            </View>
        </Wrapper>
    )
})

export type UiCardProps = UiCardBaseProps & TBuildableComponentProps

export const UiCard = React.forwardRef<any, UiCardProps>((props, ref) => {
    return props.templatableProps || props.condition ?
        <UiBuildable
            Component={UiCardComponent}
            ref={ref}
            {...props}
        />
        :
        <UiCardComponent
            ref={ref}
            {...props}
        />
})

const styles = StyleSheet.create({})

