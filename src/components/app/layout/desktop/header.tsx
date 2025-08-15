import React from "react"
import {StyleSheet} from "react-native"
import {View} from "react-native-ui-lib"
import {TYPOGRAPHY} from "~assets/design"
import {Link} from "expo-router"

type TProps = {}

export const AppLayoutDesktopHeader: React.FC<TProps> = (props) => {

    return <View>
        <Link href={'/info'}>HEADER</Link>
        <Link href={'/catalog/catalog'}>CATALOG</Link>
        <Link href={'/info'}>INFO</Link>

    </View>
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee'
    },
    headerBack: {
        paddingHorizontal: 10
    },
    headerLeft: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    headerCenter: {
        alignSelf: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingVertical: 5,
        gap: 6,
        //borderWidth: 1
    },
    headerRight: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        //borderWidth: 1
    },
    headerTitle: {
        ...TYPOGRAPHY['text-md-lh0'],
        marginTop: 2
    },
    statusBar: {
        position: 'absolute',
        width: '100%',
        top: '100%',
        left: 0
    },
})

const presets = {
    titleLeft: () => ({
        styles: StyleSheet.create({
            header: {},
            left: {},
            center: {},
            right: {
                flex: 1
            },
        }),
    }),
    titleCenter: () => ({
        styles: StyleSheet.create({
            header: {
                justifyContent: 'space-between',
            },
            left: {
                flex: 1
            },
            center: {},
            right: {
                flex: 1
            },
        }),
    }),
}
