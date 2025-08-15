import {StyleSheet} from "react-native"
import {TYPOGRAPHY} from "~assets/design";

export const styles = StyleSheet.create({
    container: {},

    backdrop: {
        flex: 1,
        opacity: 0.5,
        backgroundColor: '#000000',
    },

    backgroundShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.6,
        shadowRadius: 22.30,
        elevation: 13,
    },

    closer_topbar: {

    },
    closer_outsideLeft: {
        top: -40,
        left: 10,
        position: 'absolute',
        zIndex: 100000,
    },
    closer_outsideRight: {
        top: -40,
        right: 10,
        position: 'absolute',
        zIndex: 100000
    },
    closer: {
        zIndex: 10,
        shadowColor: '#000000',
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        borderRadius: 20,
        padding: 3,
        backgroundColor: '#FFFFFF',
    },

    topbarBorderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
    },

    topbar: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 46,
        paddingHorizontal: 16,
    },

    topbarAbsolute: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        zIndex: 10
    },

    topbarLeft: {},

    topbarRight: {
        marginLeft: 'auto'
    },

    title: {
        ...TYPOGRAPHY['text-xl-m-lh2'],
        marginTop: 5,
        marginBottom: 3
    },

    header: {
        //borderColor: '#0000wFF',
        //borderWidth: 1,
        //padding:40
    },

    footer: {

    },

    footerFixed: {
        backgroundColor: '#FFFFFF',
    },

    modal: {

    },

    view: {
        //borderColor: '#FF0000',
        //borderWidth: 1,
    },

    scroll: {
        //borderColor1: '#00FF00',
        //borderWidth1: 1,

    },

    body: {},

    headerBack: {},

    headerTitle: {},
})

export const presets = {
    default: {
        targets: {
            // topbar: ['paddingV-30'],
            scroll: ['paddingH-modalH'],
            scrollContent: [],
            //body: ['paddingH-modalH', 'paddingT-modalV'],
            footer: ['paddingH-modalH', 'paddingB-modalH', 'paddingT-5'],
            footerStatic: ['paddingB-30'],
            header: ['paddingH-modalH', 'paddingT-10'],
        }
    }
}
