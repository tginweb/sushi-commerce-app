import {StyleSheet} from "react-native";
import {COLORS, TYPOGRAPHY} from "~assets/design";

export const presets = {
    default: () => ({
        props: {},
        styles: StyleSheet.create({})
    }),
    normal: () => ({
        props: {
            selectedLabelColor: COLORS.primary,
            itemStyle: {
                paddingHorizontal: 0
            },
            labelStyle: {
                ...TYPOGRAPHY['text-lg-lh0'],
            },
            selectedLabelStyle: {
                ...TYPOGRAPHY['text-lg-lh0'],
            },
            indicatorStyle: {backgroundColor: COLORS.primary}
        },
        styles: StyleSheet.create({})
    }),
}


export const styles = StyleSheet.create({})
