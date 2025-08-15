import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import {TabControllerBarProps, TabControllerImperativeMethods, TabControllerItemProps} from "~ui/tabs/vendor";
import {TabControllerProps} from "./vendor/index.types"
import * as VendorTabController from "./vendor";
import {TPresetName} from "@core/main/types";
import {presets} from "./index.styles";
import {usePresets} from "@core/main/lib/hooks/usePresets";

export type TTabControllerItemProps = TabControllerItemProps & {
    value: any
    hidden?: boolean
    badge?: any
    data?: any
}

export type TTabControllerOnChangeValue = (newValue: any, newIndex: number, newItem: any, fromExternal?: boolean) => void

export type UiTabControllerProps = Omit<TabControllerProps, 'items'> & {
    items: any, // TTabControllerItemProps[]
    value?: any
    initialValue?: any
    onChangeValue?: TTabControllerOnChangeValue
    onChangeTabExternal?: TTabControllerOnChangeValue
    changeValueTimeout?: number
    changeOnBefore?: boolean
}

export type TTabControllerImperativeMethods = {
    setTab: (index: number) => void;
    verticalScrollTo: (y: number) => void;
}

type TState = {
    index?: number
    value?: any
}

export const UiTabControllerComponent: React.FC<UiTabControllerProps> = (props, ref) => {

    const {
        value,
        initialValue,
        initialIndex,
        items,
        onChangeIndex,
        onChangeValue,
        changeOnBefore = false,
        children,
        ...rest
    } = props

    const tabsRef = useRef<TabControllerImperativeMethods>()
    const changeFromExternal = useRef<boolean>(false)


    const [state, setState] = useState<TState>(() => {

        let _value, _index

        if (typeof value !== 'undefined') {
            _value = value
        } else if (typeof initialValue !== 'undefined') {
            _value = initialValue
        } else if (typeof initialIndex !== 'undefined' && items[initialIndex]) {
            _value = items[initialIndex].value
        }

        if (typeof initialIndex !== 'undefined') {
            _index = initialIndex
        } else if (typeof value !== 'undefined') {
            _index = items.findIndex((item: TTabControllerItemProps) => item.value === value)
        } else if (typeof initialValue !== 'undefined') {
            _index = items.findIndex((item: TTabControllerItemProps) => item.value === initialValue)
        }

        return {
            value: _value,
            index: _index
        }
    })

    const [initialIndexState, setInitialIndexState] = useState(state.index)

    useImperativeHandle<any, TTabControllerImperativeMethods>(ref, () => ({
        setTab: (i: number) => {
            if (i !== state.index)
                changeFromExternal.current = true
            tabsRef.current?.setTab(i)
        },
        verticalScrollTo: (y: number) => tabsRef.current?.verticalScrollTo(y)
    }))


    useEffect(() => {

        if (typeof value !== 'undefined' && state.value !== value) {
            const index = items.findIndex((item: TTabControllerItemProps) => item.value === value)
            setInitialIndexState(index)
            setState({
                index,
                value
            })
        }
    }, [value])

    const onChangeIndexInternal = (newIndex: number, prevIndex: number | null) => {

        const changeFromExternalCurrent = changeFromExternal.current
        const item = items[newIndex]
        if (item) {
            const newValue = item.value
            onChangeIndex && onChangeIndex(newIndex, prevIndex, changeFromExternalCurrent)
            onChangeValue && onChangeValue(newValue, newIndex, item, changeFromExternalCurrent)
            changeFromExternal.current = false
            setState({
                value: newValue,
                index: newIndex
            })
        } else {
            changeFromExternal.current = false
        }
    }

    const _props: Partial<UiTabControllerProps> = {}

    if (changeOnBefore) {
        _props.onChangeIndex = onChangeIndexInternal
    } else {
        _props.onChangeIndex = onChangeIndexInternal
    }

    return <VendorTabController.TabController
        {...rest}
        {..._props}
        initialIndex={initialIndexState}
        items={items}
        ref={tabsRef}
    >
        {children}
    </VendorTabController.TabController>
}


// @ts-ignore
export const UiTabController = forwardRef<typeof UiTabControllerComponent, UiTabControllerProps>(UiTabControllerComponent)

export type UiTabBarProps = TabControllerBarProps & {
    preset?: TPresetName
}

export const UiTabBar: React.FC<UiTabBarProps> = (props) => {

    const {
        preset,
        ...rest
    } = props

    const presetRes = usePresets(props, preset, presets, [])

    return <VendorTabController.TabBar
        {...presetRes.props}
        {...rest}
    />
}


export function useTabs<TValue>(props: UiTabControllerProps) {

    const {
        value,
        initialValue,
        initialIndex,
        onChangeValue,
        onChangeTabExternal,
        items,
        changeValueTimeout,
        ...rest
    } = props

    const ref = useRef<TTabControllerImperativeMethods>()

    const [state, setState] = useState<{
        value: any,
        index: any,
    }>(() => {
        return {
            index: (() => {
                let res
                if (typeof initialIndex !== 'undefined') {
                    res = initialIndex
                } else if (typeof value !== 'undefined') {
                    res = items.findIndex((item: TTabControllerItemProps) => item.value === value)
                } else if (typeof initialValue !== 'undefined') {
                    res = items.findIndex((item: TTabControllerItemProps) => item.value === initialValue)
                }
                if (res === -1 || typeof res === 'undefined') {
                    return 0
                } else {
                    return res
                }
            })(),
            value: (() => {
                if (typeof value !== 'undefined') {
                    return value
                } else if (typeof initialValue !== 'undefined') {
                    return initialValue
                } else if (typeof initialIndex !== 'undefined' && items[initialIndex]) {
                    return items[initialIndex].value
                } else if (!!items.length) {
                    return items[0].value
                }
            })()
        }
    })

    const item = useMemo(() => {
        return items[state.index]
    }, [state.index])

    // @ts-ignore
    const indexByValue = items.reduce<Record<string | number, number>>((map, item: TTabControllerItemProps, currentIndex) => {
        if (typeof item.value === "string" || typeof item.value === "number")
            map[item.value] = currentIndex
        return map
    }, {})

    // @ts-ignore
    const values: any = items.reduce<string[]>((map, item: TTabControllerItemProps, currentIndex) => {
        map.push(item.value)
        return map
    }, [])

    const onChangeValueInternal: TTabControllerOnChangeValue = (newValue: any, newIndex: any, item: any, fromExternal) => {
        if (changeValueTimeout) {
            setTimeout(() => {
                setState({
                    value: newValue,
                    index: newIndex
                })
                onChangeValue && onChangeValue(newValue, newIndex, item, fromExternal)
            }, changeValueTimeout)
        } else {
            setState({
                value: newValue,
                index: newIndex
            })
            onChangeValue && onChangeValue(newValue, newIndex, item, fromExternal)
        }
    }

    const changeTabWithState = (newValue: any) => {
        const newIndex = items.findIndex((item: TTabControllerItemProps) => item.value === newValue)
        //if (newIndex >= 0 && newIndex !== state.index) {
        if (newIndex > -1) {
            setState({
                value: newValue,
                index: newIndex
            })
            ref.current?.setTab(newIndex)
            onChangeTabExternal && onChangeTabExternal(newValue, newIndex, items[newIndex])
        }
    }

    const changeTab = (newValue: any) => {
        const newIndex = items.findIndex((item: TTabControllerItemProps) => item.value === newValue)
        //if (newIndex >= 0 && newIndex !== state.index) {
        if (newIndex > -1) {
            ref.current?.setTab(newIndex)
            onChangeTabExternal && onChangeTabExternal(newValue, newIndex, items[newIndex])
        }
    }

    const changeValue = (newValue: any) => {
        const newIndex = items.findIndex((item: TTabControllerItemProps) => item.value === newValue)
        if (newIndex > -1) {
            setState({
                value: newValue,
                index: newIndex
            })
        }
    }

    const changeIndex = (newIndex: number) => {
        const item = items[newIndex]
        if (item) {
            setState({
                value: item.value,
                index: newIndex
            })
        }
    }

    return {
        ref,
        changeTab,
        changeTabWithState,
        changeValue,
        changeIndex,
        activeValue: state.value as TValue,
        activeIndex: state.index,
        activeItem: item,
        indexByValue,
        setState,
        values,
        items: items,
        onChangeValue: onChangeValueInternal
    }
}

export const UiTabPage = VendorTabController.TabPage
export const UiTabPageCarousel = VendorTabController.PageCarousel
export const UiTabPageCarouselGesture = VendorTabController.PageCarouselGesture
