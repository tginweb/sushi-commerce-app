import React, {PropsWithChildren, useEffect} from "react"
import {StyleSheet} from "react-native"
import {Dialog as VendorDialog, Text, ConnectionStatusBar} from "react-native-ui-lib"
import * as ScreenOrientation from "expo-screen-orientation";

export type TGalleryItem = {
    image: {
        uri: string
    }
}

export type UiGalleryProps = {
    items?: TGalleryItem[]
    visible?: boolean
    onClose?: () => void
}

export const UiGallery: React.FC<PropsWithChildren<UiGalleryProps>> = (props) => {

    const {
        items,
        visible,
        onClose
    } = props

    const onCloseInternal = () => {
        onClose && onClose()
    }

    const setScreen = async () => {
        if (visible) {
            await ScreenOrientation.unlockAsync()
        } else {
            //await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
        }
    }

    useEffect(() => {
        setScreen()
    }, [visible])

    return (
        <VendorDialog
            containerStyle={styles.container}
            {...props}
            visible={visible}
            onDismiss={onCloseInternal}
            //  width={'100%'}
            //  height={'100%'}
            supportedOrientations={['portrait', 'landscape']}
            modalProps={{}}
        >
            <Text>dddd</Text>
        </VendorDialog>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        height: 200
    },
});

