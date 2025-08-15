import {StyleSheet} from "react-native"
import {UiListProps} from "~ui/list/index.types";

type TProps = UiListProps

export const styles = StyleSheet.create({
    container: {},
    item: {},
})

export const presets = {
    rounded: () => ({
        styles: StyleSheet.create({
            container: {
                borderRadius: 10,
                overflow: 'hidden',
                //...Shadows.dark20.bottom,
            },
        }),
    }),
    menu: () => ({
        styles: StyleSheet.create({
            container: {
                gap: 12,
            },
        }),
    }),
    screenOptions: () => ({
        styles: StyleSheet.create({
            container: {
                gap: 10,
            },
        }),
    }),
    switchOptions: () => ({
        styles: StyleSheet.create({
            container: {
                gap: 10,
                flexDirection: 'row',

                //borderWidth: 1
            },
        }),
    }),
    formOptions: () => ({
        styles: StyleSheet.create({
            container: {
                gap: 10,
            },
        }),
    }),
    chips: () => ({
        styles: StyleSheet.create({
            container: {
                flex: 1,
                flexWrap: 'wrap',
                flexDirection: 'row',
                gap: 7,
            },
        }),
    }),
}
