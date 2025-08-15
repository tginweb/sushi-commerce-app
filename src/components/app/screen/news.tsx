import React, {useCallback} from "react"
import {ListRenderItem, StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useServices} from "~services"
import {useStores} from "~stores"
import {TouchableOpacity} from "react-native-ui-lib"
import {TScreenProps} from "@core/main/types"
import {UiScreen} from "~ui/screen"
import {COLORS} from "~assets/design";
import extractKey from "@core/main/util/react/extractKey";
import {UiImage} from "~ui/image";
import {OfferModel} from "@core/offer/model/Offer";
import {UiGridList} from "~ui/grid-list/grid-list";

export const NewsScreen: React.FC<TScreenProps> = observer(() => {

    const {faq, promo, offer} = useStores();
    const {imager} = useServices()

    const renderItem: ListRenderItem<OfferModel> = useCallback(({item}) => {
        const imageSrc = item.BANNER_HOR_MOBILE?.SRC
        if (!imageSrc)
            return <></>
        return <TouchableOpacity
            style={styles.slide}
            onPress={() => offer.openOffer(item, 'sheet')}
        >
            <UiImage
                source={{uri: imager.resolve(imageSrc)}}
                vendor={'expo'}
                resizeMode={'contain'}
                style={styles.image}
                autoHeight={true}
                aspectRatio={2.2}
            />
        </TouchableOpacity>
    }, [])

    return (
        <UiScreen
            preset={'default'}
            modifiers={{
                'body': ['paddingV-screenV']
            }}
            backgroundColor={COLORS.white}
        >
            <UiGridList
                //containerWidth={wWidth}
                scrollEnabled={false}
                data={offer.commonOffers}
                keyExtractor={extractKey}
                renderItem={renderItem}
                itemSpacing={14}
                listPadding={10}
                numColumns={1}
            />
        </UiScreen>
    )
})

const styles = StyleSheet.create({
    slide: {
        overflow: 'hidden',
        borderRadius: 20,
        flex: 1,
    },
    image: {
        width: '100%',
        height: undefined,
    }
})

export default NewsScreen
