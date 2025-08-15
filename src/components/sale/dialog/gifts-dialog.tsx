import React, {useEffect, useMemo} from "react"
import {StyleSheet} from "react-native"

import {observer} from "mobx-react"
import {useStores} from "~stores"
import {Carousel, Text, View} from "react-native-ui-lib";
import {COLORS, wWidth} from "~assets/design";
import icons from "~assets/icons-map";
import UiDialog from "~ui/dialog";
import {ProductCardGrid} from "~com/catalog/product/card/card-grid";
import {ProductModel} from "@core/catalog/model/Product";

export type TWebViewProps = {}

export const GiftsDialogModal: React.FC<TWebViewProps> = observer((props) => {

    const {giftsDialog, catalog, sale} = useStores()

    const productIds = giftsDialog.props.products || sale.userClientCard?.GIFTS || []

    const products = useMemo(() => {
        return productIds.map(productId => catalog.productById[productId]).filter(product => !!product)
    }, [productIds])

    useEffect(() => {
        
        setTimeout(() => {
            sale.setViewedGiftIds(products.map(products => products.ID))
        }, 1000)
    }, [products])

    const onClose = () => giftsDialog.hide(false)

    const onPress = (product: ProductModel) => {
        giftsDialog.hide()
        catalog.showProduct(product)
    }

    return <UiDialog
        visible={giftsDialog.visible}
        closerPosition={'outer'}
        onClose={onClose}
        actions={{
            containerStyle: {
                flexDirection: 'row',
                justifyContent: 'center',
            },
            items: [
                {
                    label: 'Хорошо',
                    onPress: onClose,
                }
            ]
        }}
    >
        <View row centerV centerH marginT-16 marginH-20 marginB-6 gap-15>
            <View flexS>
                {icons.gift({size: 36, color: COLORS.primary})}
            </View>
            <View flex row>
                <Text text-lg-lh2 style={{flex: 1, flexWrap: 'wrap'}}>
                    {products.length === 1 ? 'Вам доступен подарок!' : 'Вам доступен один из подарков!'}
                </Text>
            </View>
        </View>
        <View centerH row>
            <Carousel
                pagingEnabled={true}
                showCounter={true}
                containerMarginHorizontal={6}
                autoplay={true}
                pageWidth={250}
                autoplayInterval={2500}
            >
                {products.slice(0,2).map(product =>
                    <View padding-5 key={product.ID}>
                        <ProductCardGrid
                            entity={product}
                            style={{
                                //width: wWidth / 2,
                                flexGrow: 0,
                                flex: 0,
                            }}
                            containerStyle={{
                                flex: 0
                            }}
                            hideSale={true}
                            onPress={() => onPress(product)}
                        />
                    </View>
                )}
            </Carousel>
        </View>
    </UiDialog>
})

export default GiftsDialogModal

const styles = StyleSheet.create({
    webviewContainer: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    dialogHeader: {
        borderBottomWidth: 1,
        borderColor: '#CCCCCC'
    },
    dialogContainer: {
        backgroundColor: '#FFFFFF',
    },
    dialogContainerNormal: {
        borderRadius: 12,
    },
    dialogContainerFullscreen: {},
})
