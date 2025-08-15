import {StyleSheet} from "react-native";
import {COLORS, TYPOGRAPHY} from "~assets/design";
import {Colors} from "react-native-ui-lib";

export const front = () => ({
    styles: StyleSheet.create({
        container: {
            backgroundColor: '#FFFFFF'
        },
        header: {
            marginBottom: 10,
            paddingHorizontal: 16,
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center'
        },
        title: {
            ...TYPOGRAPHY['text-lg-bo'],
        },
        headerSide: {
            marginLeft: 'auto'
        },
    })
})

export const frontUser = () => ({
    styles: StyleSheet.create({

        container: {
            gap: 8,
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderRadius: 12,
            borderColor: Colors.grey60,
            paddingVertical: 12,
            shadowColor: "#988484",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.17,
            shadowRadius: 2.54,
            elevation: 3,
        },
        content: {
            paddingHorizontal: 9,
        },
        header: {
            paddingHorizontal: 12,
            justifyContent: 'center'
        },
        title: {
            ...TYPOGRAPHY['text-xxs-bo-lh0'],
            color: COLORS.primary,
        },
        headerSide: {},
    })
})

export const formGroup = () => ({
    styles: StyleSheet.create({
        container: {
            gap: 10,
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderRadius: 12,
            borderColor: Colors.grey60,
            padding: 12,
            shadowColor: "#988484",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.17,
            shadowRadius: 2.54,
            elevation: 3
        },
        header: {
            paddingBottom: 8
        },
        title: {
            ...TYPOGRAPHY['text-sm-bo-lh0'],
            color: COLORS.primary,
        },
        headerSide: {},
    })
})

