import {ScrollView} from "react-native";
import React, {PropsWithChildren, RefObject, useImperativeHandle, useRef} from "react";
import {TCatalogFiltersValue} from "@core/catalog/types";
import {useServices} from "~services";

type TCatalogInlineFilters = PropsWithChildren<{
    filtersRef: RefObject<any>
    filtersValue: TCatalogFiltersValue
    offset?: number
}>

export const CatalogInlineFiltersComponent: React.FC<TCatalogInlineFilters> = (
    {
        filtersRef,
        filtersValue,
        children,
        offset = 0
    },
    ref
) => {

    const {catalogUtil} = useServices()

    const scrollRef = useRef<ScrollView | null>(null)
    const scrollPos = useRef<number>(0)

    const scrollToSelectedFilter = () => {

        const filledPath: any = []

        if (filtersRef && filtersRef.current && catalogUtil.isFilterFilled(filtersValue, filledPath)) {
            const pathStr = filledPath.join('-')
            if (filtersRef.current[pathStr]) {
                // @ts-ignore
                filtersRef.current[pathStr].measureInWindow((x, y, width, height, pageX, pageY) => {

                    const currX = scrollPos.current + x

                    scrollRef.current?.scrollTo({x: currX - offset})
                    //console.log({x, y, width, height, pageX, pageY},'x')
                })
            }
        }
    }

    useImperativeHandle<any, any>(ref, () => ({
        scrollToSelectedFilter: () => {
            scrollToSelectedFilter()
        },
    }))

    return <ScrollView
        ref={scrollRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{}}
        onScroll={event => {
            scrollPos.current = event.nativeEvent.contentOffset.x
        }}
        scrollEventThrottle={60}
    >
        {children}
    </ScrollView>
}

// @ts-ignore
export const CatalogInlineFilters = React.forwardRef(CatalogInlineFiltersComponent)

