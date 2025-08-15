import {StyleSheet} from "react-native"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        //height1: '100%',
        //backgroundColor: '#00AA00',
        //borderWidth: 5,
        //borderColor: '#000000',
    },
    containerInner: {
        flex: 1,
        position: 'relative',
        //backgroundColor1: '#FFFFFF',
        //borderWidth: 2,
        //borderColor: '#000000',
    },

    'body-valign-top': {
        justifyContent: 'flex-start'
    },

    'body-valign-middle': {
       justifyContent: 'center'
    },

    'body-valign-bottom': {
        justifyContent: 'flex-end'
    },

    bodyEmpty: {},

    body: {
        flexGrow: 1,
        //backgroundColor: '#EEEEEE',
        //borderWidth: 1,
        //borderColor: '#000000',
    },

    bodyWithFooterAbsolute: {
        flex: 1,
        flexGrow: undefined,
    },

    header: {},
    footer: {

    },

    footerStatic: {
        paddingTop: 16
    },

    footerAbsolute: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },

    headerAbsolute: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100
    },
})

export const presets = {
    default: {
        targets: {
            header: ['paddingT-10', 'paddingH-modalH'],
            body: ['paddingV-modalV', 'paddingH-modalH'],
            footer: ['marginH-modalH', 'paddingB-modalV'],
        }
    },
    profile: {
        targets: {
            header: ['paddingT-10', 'paddingH-modalH'],
            body: ['paddingV-modalV', 'paddingH-modalH'],
            footer: ['marginH-modalH', 'paddingB-modalV'],
        }
    }
}
