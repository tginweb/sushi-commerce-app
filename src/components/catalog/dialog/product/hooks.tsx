import React, {useCallback, useMemo, useState} from "react"
import {StyleSheet} from "react-native"
import {Text, View} from "react-native-ui-lib"
import {useServices} from "~services"
import {ProductModel} from "@core/catalog/model/Product"
import {ProductSostavDetail} from "../../product/blocks/sostav-detail"
import {ProductGifts} from "../../product/blocks/gifts"
import {ProductActions} from "../../product/blocks/actions"
import {ProductElement} from "~gql/api";
import {UiBottomSheet, UiBottomSheetMethods} from "~com/ui/bottom-sheet";
import {UiBtn} from "~ui/btn";
import {useProduct, useProductSale} from "~com/catalog/product/card/card.hooks";
import {ProductFlags} from "~com/catalog/product/blocks/flags";
import {ProductPrice} from "~com/catalog/product/blocks/price";
import {ProductErrors} from "~com/catalog/product/blocks/errors";
import {Image} from "expo-image";
import {TYPOGRAPHY, wWidth} from "~assets/design";
import {ProductUpSale} from "~com/catalog/product/blocks/upsale";
import ProductDialogStore from "@core/catalog/store/product-dialog";
import {useStores} from "~stores";

export function useProductDialog(type: string, productDialog: ProductDialogStore) {

    const {} = useServices()
    const {catalog} = useStores()

    const product = productDialog.props.product || new ProductModel({} as ProductElement)

    const [sostavExpanded, setSostavExpanded] = useState<boolean>(false)

    const refs = {
        gift: React.useRef(),
        sheet: React.useRef<UiBottomSheetMethods>(null as any),
    }

    const {
        error,
        basketInputProps,
        onBasketQuantity,
        onBasketAdd,
        setBasketProps,
        onGiftSelect,
        errorSafe
    } = useProduct({
        entity: product,
        giftsVisible: true
    })

    const {
        renderBasketAddButton,
        renderBasketQuantity,
        calc,
        showAdd,
        basketItem
    } = useProductSale({
        onBasketAdd,
        onBasketQuantity,
        entity: product,
    })

    const onClose = useCallback(() => {
        productDialog.hide(true)
        setBasketProps({})
    }, [])

    const buildItems = product.BUILD?.SOSTAV || []

    const haveChemistry = !!product.weight

    const chemistry = useMemo(() => {

        const chemistryData = (() => {
            if (!product.propValue.KKAL)
                return null
            const koef = product.weight / 100
            return {
                WEIGHT: product.weight,
                KKAL: Math.round(parseFloat(product.propValue.KKAL || 0) * koef),
                BELKI: Math.round(parseFloat(product.propValue.BELKI || 0) * koef),
                ZHIRY: Math.round(parseFloat(product.propValue.ZHIRY || 0) * koef),
                UGLEVODY: Math.round(parseFloat(product.propValue.UGLEVODY || 0) * koef),
            }
        })()

        return <View row centerV centerH bg-greyCommon paddingH-20 paddingV-8 style={styles.chemistry}>

            {!chemistryData ?
                <View row gap-6 centerV centerH>
                    <Text style={styles.chemistryVal}>{product.weight}</Text>
                    <Text style={styles.chemistryLabel}>грамм</Text>
                </View>
                :
                <>
                    <View flex-3>
                        <Text style={styles.chemistryVal}>{product.weight}</Text>
                        <Text style={styles.chemistryLabel}>грамм</Text>
                    </View>
                    {!!chemistryData.KKAL && <View flex-3>
                        <Text style={styles.chemistryVal}>{chemistryData.KKAL}</Text>
                        <Text style={styles.chemistryLabel}>ккал</Text>
                    </View>}
                    {!!chemistryData.BELKI && <View flex-3>
                        <Text style={styles.chemistryVal}>{chemistryData.BELKI}</Text>
                        <Text style={styles.chemistryLabel}>белки</Text>
                    </View>}
                    {!!chemistryData.ZHIRY && <View flex-3>
                        <Text style={styles.chemistryVal}>{chemistryData.ZHIRY}</Text>
                        <Text style={styles.chemistryLabel}>жиры</Text>
                    </View>}
                    {!!chemistryData.UGLEVODY && <View flex-3>
                        <Text style={styles.chemistryVal}>{chemistryData.UGLEVODY}</Text>
                        <Text style={styles.chemistryLabel}>угл</Text>
                    </View>}
                </>
            }
        </View>
    }, [product.ID])

    const footerSlot = () => {

        if (!product.saleAllow)
            return <></>

        return <View marginT-7 gap-13>

            {product.haveGifts && <ProductGifts
                basketInputProps={basketInputProps}
                ref={refs.gift}
                entity={product}
                onSelect={(id, gift) => onGiftSelect(gift)}
            />}

            <ProductErrors
                entity={product}
                error={error}
                errorSafe={errorSafe}
            />

            <View row centerH centerV>
                <ProductPrice
                    calc={calc}
                    entity={product}
                    showWeight={false}
                    withSpace={true}
                    priceModifiers={{
                        'text-xxl-m-lh0': true
                    }}
                    oldPriceModifiers={{
                        'text-md-m-lh0': true
                    }}
                    flex-5
                    flexG
                    row
                />
                <View flex-6 right>
                    {showAdd ? renderBasketAddButton() : renderBasketQuantity()}
                </View>
            </View>
        </View>
    }

    const onItemDetailPress = (entity: ProductModel) => {
        if (entity.showable)
            catalog.showProduct(entity.ID, true)
    }

    const onExpand = () => {
        setSostavExpanded(true)
    }

    const bodySlot = <>

        <View paddingH-modalH>
            <View style={{backgroundColor: '#FFFFFF'}}>
                <View style={{position: 'relative'}}>
                    <View absT absL marginT-10 style={{zIndex: 1000}}>
                        <ProductActions entity={product}/>
                    </View>
                    <View absB absL marginB-10>
                        <ProductFlags centerV gap-8 row detail={true} entity={product}/>
                    </View>
                    {product.imageFullwidthSrcRequired && (
                        <View centerH>
                            <Image
                                style={[
                                    styles.image,
                                ]}
                                source={[{uri: product.imageFullwidthSrcRequired}]}
                                placeholder={require('~assets/img/placeholder.png')}
                                placeholderContentFit={'contain'}
                                contentFit={'contain'}
                            />
                        </View>
                    )}
                </View>
            </View>

            <View row paddingB-10 bg-white paddingT-5>
                <View flexG>
                    <Text text-xxl-bo-lh2>{product.nameCleaned}</Text>
                </View>
                {
                    !!product.SOSTAV_ROLLS_IDS.length &&
                    <View flexS right>
                        <UiBtn
                            label={!sostavExpanded ? 'Показать состав' : 'Скрыть состав'}
                            link={true}
                            onPress={() => {
                                setSostavExpanded((val) => !val)
                            }}
                            text-sm
                        />
                    </View>
                }
            </View>

            <View gap-15>

                {product.previewTextFormatted && <Text text-md-r>{product.previewTextFormatted}</Text>}

                {haveChemistry && <View marginV-4>
                    {chemistry}
                </View>}

                <ProductSostavDetail
                    entity={product}
                    expandable={true}
                    expanded={sostavExpanded}
                    onPressDetail={onItemDetailPress}
                    onExpand={onExpand}
                />

                {!!buildItems.length && <View gap-12>
                    <Text text-md-bo>Состав:</Text>
                    <View gap-12>
                        {buildItems.slice(1, buildItems.length).map(item =>
                            <View row gap-10 key={item.ELEMENT?.ID}>
                                <Text text-md-lh1>
                                    {item.ELEMENT?.NAME}
                                </Text>
                                <Text text-md-bo-lh1 marginL-auto>
                                    x{item.QUANTITY}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>}

            </View>
        </View>

        {productDialog.getType() === 'primary' && basketItem && <ProductUpSale marginT-15 entity={product}/>}

        <View marginB-modalV/>
    </>

    const topbarInnerSlot = ({closerSlot}: any) => {
        return <View row flex gap-13>
            <View style={{marginLeft: 'auto'}}>
                {closerSlot()}
            </View>
        </View>
    }

    return <UiBottomSheet
        topInsetAdd={7}
        id={type}
        ref={refs.sheet}
        isVisible={productDialog.visible}
        autoHeight={true}
        bodyScrollable={true}
        footerInnerSlot={footerSlot()}
        bodySlot={bodySlot}
        preset={'default'}
        topbarInnerSlot={topbarInnerSlot}
        topbarHide={true}
        closerPosition={'outsideRight'}
        targetModifiers={{
            //scrollContent: ['marginT-150']
            scroll: []
        }}
        //headerInnerSlot={headerSlot}
        scrollProps={{
            stickyHeaderIndices: [1]
        }}
        onClose={onClose}
        stackBehavior={'push'}
    >
    </UiBottomSheet>
}

const styles = StyleSheet.create({
    imageWrapper: {
        backgroundColor: '#888888',
    },
    image: {
        aspectRatio: 1.3,
        width: wWidth - 16,
        //height: verticalScale(170),
        //position: 'relative'
    },
    chemistry: {
        borderRadius: 10
    },
    chemistryVal: {
        ...TYPOGRAPHY['text-md'],
        textAlign: 'center'
    },
    chemistryLabel: {
        ...TYPOGRAPHY['text-xs'],
        color: '#888888',
        textAlign: 'center',
        marginTop: 0
    },
    topBar: {
        zIndex: 10
    },
});
