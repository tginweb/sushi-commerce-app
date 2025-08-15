import React, {useCallback} from 'react';
import Reanimated from 'react-native-reanimated';

import {UiGridListProps} from "./types";
import {View} from "react-native-ui-lib";
import useGridLayout from './useGridLayout';
import {useKeyExtractor} from "@core/main/lib/hooks/useKeyExtractor";

export const UiGridListComponent: React.FC<UiGridListProps> = (props, ref) => {
    const {
        renderItem,
        numColumns,
        itemSpacing,
        maxItemWidth,
        listPadding = 0,
        listContentPadding,
        keepItemSize,
        containerWidth,
        style,
        contentContainerStyle,
        keyExtractor,
        ...others
    } = props;
    const {
        itemContainerStyle,
        numberOfColumns,
        listStyle,
        listContentStyle,
        listColumnWrapperStyle
    } = useGridLayout({
        numColumns,
        itemSpacing,
        maxItemWidth,
        listPadding,
        listContentPadding,
        keepItemSize,
        containerWidth,
        style,
        contentContainerStyle
    });

    const _renderItem = useCallback((...args: any) => {
        // @ts-expect-error
        return <View style={itemContainerStyle}>{renderItem?.(...args)}</View>;
    }, [renderItem, itemContainerStyle])

    const defaultKeyExtractor = useKeyExtractor()

    const _keyExtractor = keyExtractor === true ? defaultKeyExtractor : keyExtractor

    return <Reanimated.FlatList
        key={numberOfColumns}
        keyExtractor={_keyExtractor}
        {...others}
        style={listStyle}
        ref={ref}
        columnWrapperStyle={numColumns && numColumns > 1 ? listColumnWrapperStyle : undefined}
        contentContainerStyle={listContentStyle}
        renderItem={_renderItem}
        numColumns={numberOfColumns}
    />
}

// @ts-ignore
export const UiGridList = React.forwardRef<FlatList, UiGridListProps>(UiGridListComponent)

