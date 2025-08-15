import React from "react"
import {StyleSheet} from "react-native"
import {useServices} from "~services"
import {Text, View} from "react-native-ui-lib"
import {TProductCardProps, TProductCardSaleProps} from "./card.types"
import {useProduct, useProductSale} from "./card.hooks"
import {observer} from "mobx-react";
import {ProductImage} from "~com/catalog/product/blocks/image";
import {ProductBuild} from "~com/catalog/product/blocks/build";
import {CardPressable} from "../card-pressable";

const SaleAction: React.FC<TProductCardSaleProps> = observer((props) => {

    const {catalogUtil} = useServices()

    const {
        entity,
        onBasketAdd,
        onBasketQuantity,

    } = props

    const {
        renderBasketAdd,
        renderBasketQuantity,
        calc,
        showAdd
    } = useProductSale({
        entity,
        onBasketAdd,
        onBasketQuantity,
    })

    return showAdd ?
        <View row centerV paddingH-16>
            <View>
                <Text text-md-bo>
                    {catalogUtil.formatPriceCurrency(calc.priceDiscounted, false)}
                </Text>
            </View>
            <View style={{marginLeft: 'auto'}}>
                {renderBasketAdd({})}
            </View>
        </View>
        :
        <View row centerV centerH paddingH-30>
            {renderBasketQuantity()}
        </View>
})

const ProductCardBuildComponent: React.FC<TProductCardProps> = (props) => {

    const {} = useServices()

    const {
        entity,
        style,
        containerStyle,
        containerShadow = true,
        hideSale = false,
    } = props

    const {
        onBasketAdd,
        onBasketQuantity,
        openProduct
    } = useProduct(props)

    return (
        <CardPressable
            onPress={openProduct}
            style={[
                styles.wrapper,
                style
            ]}
            shouldCancelWhenOutside={true}
            rippleColor={'#FFFFFF'}
        >
            <View
                paddingV-10
                style={[
                    styles.container,
                    containerShadow && styles.containerShadow,
                    containerStyle
                ]}
            >
                <View flexG>

                    <View row centerV>

                        <View>
                            <ProductImage
                                entity={entity}
                                imageSize={200}
                                style={styles.img}
                            />
                        </View>

                        <View flexS>
                            <Text style={styles.productName} text-sm-m-lh1>
                                {entity.NAME}
                            </Text>
                        </View>
                    </View>

                    <ProductBuild
                        entity={entity}
                        marginH-16
                    />

                </View>
                <View gap-8>
                    {!hideSale && <SaleAction
                        entity={entity}
                        onBasketAdd={onBasketAdd}
                        onBasketQuantity={onBasketQuantity}
                        paddingH-6
                    />}
                </View>
            </View>
        </CardPressable>
    )
}

const styles = StyleSheet.create({
    containerShadow: {
        borderRadius: 20,
        shadowColor: "#777777",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4
    },
    wrapper: {
        flexGrow: 1
    },
    container: {
        gap: 5,
        flex: 1,
        flexDirection: 'column',
        // flexGrow1: 1,
        backgroundColor: '#FFFFFF',
    },
    productName: {},
    productDescription: {
        flex: 1,
        flexWrap: 'wrap',
    },
    media: {
        position: 'relative'
    },
    info: {},
    img: {
        resizeMode: 'contain',
        width: 70,
        height: 70,
        marginRight: -8,
        marginLeft: -2,
    },
    topBar: {
        zIndex: 10
    },
})

export const ProductCardBuild = React.memo(ProductCardBuildComponent, (prevProps, newProps) => {
    return prevProps.entity.ID === newProps.entity.ID
})

