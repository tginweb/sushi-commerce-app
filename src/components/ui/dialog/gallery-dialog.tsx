import React, {useEffect} from "react"
import {SafeAreaView, StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {useServices} from "~services"
import Gallery from 'react-native-awesome-gallery';
import * as ScreenOrientation from "expo-screen-orientation";

type TProps = {}

export const GalleryDialog: React.FC<TProps> = observer(({}) => {

    const {catalog, galleryDialog} = useStores()
    const {imager} = useServices()

    useEffect(() => {
        
        if (galleryDialog.visible) {
            onShow()
        }
    }, [galleryDialog.visible])

    const onShow = async () => {
        await ScreenOrientation.unlockAsync()
    }

    const onClose = async () => {
        galleryDialog.hide()
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
    }

    const items = galleryDialog.props.items

    // @ts-ignore
    const itemsForGallery = items.map(item => item.uri)

    return galleryDialog.visible && (
        <SafeAreaView
            style={{
                flex: 1,
                position: 'absolute', left: 0, top: 0, width: '100%', height: '100%',
                backgroundColor: '#000000',
                zIndex: 20000
            }}
        >
            <Gallery
                onSwipeToClose={onClose}
                data={itemsForGallery}
                numToRender={1}
                onIndexChange={(newIndex) => {

                }}
            />
        </SafeAreaView>
    )

})

export default GalleryDialog

const styles = StyleSheet.create({});
