import {StyleSheet} from "react-native";
import {CATALOG_TABBAR_SIZES, COLORS, TYPOGRAPHY} from "~assets/design";

export const CATALOG_TABBAR_BG_COLOR = '#eeeeee'

const {
    CATALOG_TABBAR_ITEM_PADDING_VERTICAL,
    CATALOG_TABBAR_ITEM_PADDING_HORIZONTAL,
    CATALOG_TABBAR_ITEM_MARGIN_HORIZONTAL,
    CATALOG_TABBAR_LABEL_PADDING_TOP,
    CATALOG_TABBAR_LABEL_PADDING_BOTTOM,
    CATALOG_TABBAR_LABEL_MARGIN_VERTICAL,
    CATALOG_TABBAR_LABEL_MARGIN_HORIZONTAL,
    CATALOG_TABBAR_INDICATOR_CONTAINER_MARGIN_VERTICAL
} = CATALOG_TABBAR_SIZES

export const styles = StyleSheet.create({
    header: {
        backgroundColor: CATALOG_TABBAR_BG_COLOR,
    },
    headerInner: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grey50,
    },
    tabbar: {
        backgroundColor: CATALOG_TABBAR_BG_COLOR,
        elevation: 0,
    },
    tabbarTab: {
        width: 'auto',
        paddingVertical: CATALOG_TABBAR_ITEM_PADDING_VERTICAL,
        paddingHorizontal: CATALOG_TABBAR_ITEM_PADDING_HORIZONTAL,
        marginVertical: 0,
        marginHorizontal: CATALOG_TABBAR_ITEM_MARGIN_HORIZONTAL,
        minHeight: 'auto',
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        gap: 1,
    },
    indicatorContainerStyle: {
        marginVertical: CATALOG_TABBAR_INDICATOR_CONTAINER_MARGIN_VERTICAL,
        flex: 1,
    },
    tabbarIndicator: {
        borderColor: "white",
        height: '100%',
    },
    tabbarIndicatorLight: {
        backgroundColor: undefined,
    },
    tabbarLabel: {
        marginVertical: CATALOG_TABBAR_LABEL_MARGIN_VERTICAL,
        marginHorizontal: CATALOG_TABBAR_LABEL_MARGIN_HORIZONTAL,
        paddingTop: CATALOG_TABBAR_LABEL_PADDING_TOP,
        paddingBottom: CATALOG_TABBAR_LABEL_PADDING_BOTTOM,
        color: COLORS.grey20,
        ...TYPOGRAPHY['text-sm-bo-lh0'],
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fffffff',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
});


