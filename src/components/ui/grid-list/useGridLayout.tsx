import {useMemo} from 'react';
import {Constants, Hooks, Spacings} from 'react-native-ui-lib'
import {UiGridListProps} from "~ui/grid-list/types";

export const DEFAULT_NUM_COLUMNS = 3;
export const DEFAULT_ITEM_SPACINGS = Spacings.s4;

const useOrientation = Hooks.useOrientation

const useGridLayout = (props: Partial<UiGridListProps>) => {
    const {
        numColumns = DEFAULT_NUM_COLUMNS,
        itemSpacing = DEFAULT_ITEM_SPACINGS,
        maxItemWidth,
        listPadding = 0,
        listContentPadding = 0,
        keepItemSize,
        containerWidth,
        style,
        contentContainerStyle,
        columnWrapperStyle
    } = props;
    const {
        orientation
    } = useOrientation();

    const _containerWidth = useMemo(() => {
        return (containerWidth ?? Constants.windowWidth - Constants.getPageMargins()) - listPadding * 2 - listContentPadding * 2;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listPadding, orientation, containerWidth]);
    const numberOfColumns = useMemo(() => {
        if (maxItemWidth) {
            return Math.ceil((_containerWidth + itemSpacing) / (maxItemWidth + itemSpacing));
        } else {
            return numColumns;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numColumns, maxItemWidth, itemSpacing, keepItemSize ? _containerWidth : undefined]);
    const itemWidth = useMemo(() => {
        return (_containerWidth - itemSpacing * (numberOfColumns - 1)) / numberOfColumns;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numberOfColumns, itemSpacing, keepItemSize ? undefined : _containerWidth]);
    const itemContainerStyle = useMemo(() => {
        return {
            width: itemWidth /* , marginRight: itemSpacing, marginBottom: itemSpacing */
        };
    }, [itemWidth]);
    const listContentStyle = useMemo(() => {
        return [{
            paddingHorizontal: listContentPadding,
            rowGap: itemSpacing
        }, contentContainerStyle];
    }, [itemSpacing, listContentPadding, contentContainerStyle]);
    const listStyle = useMemo(() => {
        return [{
            paddingHorizontal: listPadding,
            rowGap: itemSpacing
        }, style];
    }, [listPadding, itemSpacing, style]);
    const listColumnWrapperStyle = useMemo(() => {
        return [{
            columnGap: itemSpacing
        }, columnWrapperStyle];
    }, [itemSpacing, columnWrapperStyle]);
    return {
        itemContainerStyle,
        numberOfColumns,
        listStyle,
        listContentStyle,
        listColumnWrapperStyle
    };
};
export default useGridLayout;
