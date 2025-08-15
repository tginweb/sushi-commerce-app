import React, {useCallback, useMemo, useState} from "react";
import {useSafeState} from "@core/main/lib/hooks/useSafeState";
import {TMessage, TValidateError} from "@core/main/types";
import {useStores} from "~stores";
import {COLORS} from "~assets/design";
import {UiBtn} from "~ui/btn";
import icons from "~assets/icons-map";
import {QuantityInput, TQuantityInputProps} from "~com/sale/quantity-input";
import {TUseProductProps, TUseProductSaleProps} from "~com/catalog/product/card/card.types";
import {useServices} from "~services";
import {UiMessage} from "~ui/message";
import {UiTransitionView} from "~ui/transition/view";
import {useWatch} from "@core/main/lib/hooks/useWatch";
import {ProductGift} from "~gql/api";
import {moderateScale} from "@core/main/lib/scale";
import {BasketAddButton} from "~com/sale/basket-add-button";
import {UiDialog, useDialog} from "~ui/dialog";
import {ProductGifts} from "~com/catalog/product/blocks/gifts";

export function useProduct(props: TUseProductProps) {

    const {vorder, fav, catalog, debug} = useStores()
    const {imager, bus, catalogUtil} = useServices()

    const giftsDialog = useDialog({visible: false})


    setTimeout(() => {
        debug.renderCount('ProductCard')
    })

    const {
        entity,
        giftsVisible = false,
        validateAdd,
        onOpenProduct,
        onPressBehavior = 'product',
        onPress,
        excludeFlags,
        imageSize = 200,
        productOpenAllowSecondary
    } = props

    const entityId = entity.ID

    const basketItem = vorder.basketItemByProductId ? vorder.basketItemByProductId[entityId] : null
    const basketItemQuantity = basketItem?.QUANTITY || 0

    const [basketInputProps, setBasketInputProps] = useState<any>({
        GIFT: null,
    })

    const [basketProps, setBasketProps] = useState<any>({
        GIFT: null,
    })

    const [
        error,
        errorSafe,
        setError
    ] = useSafeState<TValidateError | boolean>()

    const onGiftSelect = useCallback((gift: ProductGift) => {

        const basketItem = vorder.basketItemByProductId ? vorder.basketItemByProductId[entityId] : null

        if (basketItem) {
            basketItem.setInputProps({GIFT: gift.GIFT_ID})
            basketItem.setProps({
                GIFT: {
                    NAME: 'Подарок',
                    CODE: 'GIFT',
                    VALUE: gift
                }
            })
            basketItem.indexProps()
            return;
        }

        setError(false)
        setBasketInputProps({
            ...basketInputProps,
            GIFT: gift.GIFT_ID,
        })
        setBasketProps({
            ...basketProps,
            GIFT: {
                NAME: 'Подарок',
                CODE: 'GIFT',
                VALUE: gift
            },
        })
    }, [entityId, basketInputProps, basketProps])

    const onValidateAdd = useCallback(() => {
        if (entity.REQUIRED_MIN_PRICE && vorder.priceBasketWithoutSpecial < entity.REQUIRED_MIN_PRICE) {
            bus.showAlert({
                type: 'warning',
                message: 'Сумма заказа меньше ' + catalogUtil.formatPriceCurrency(entity.REQUIRED_MIN_PRICE)
            })
            return false
        }
        if (entity.haveGifts && !basketInputProps.GIFT) {
            setError({title: 'Необоходимо выбрать подарок', type: 'warning'})
            return false
        }
        if (validateAdd) {
            const res = validateAdd()
            if (res !== true) {
                setError(res)
                return false
            }
        }
        setError(false)
        return true
    }, [entityId, validateAdd, basketInputProps])

    const onBasketAdd = useCallback(async () => {
        if (!basketInputProps.GIFT && (!giftsVisible && entity.haveGifts)) {
            giftsDialog.show()
            //catalog.showProduct(entity)
            return false
        }
        if (!onValidateAdd || onValidateAdd()) {
            vorder.basketOp({
                action: 'add',
                productId: entityId,
                quantity: 1,
                product: entity,
                inputProps: basketInputProps,
                props: basketProps
            })
        }
    }, [entityId, giftsVisible, onValidateAdd, basketInputProps, basketProps])

    const onBasketQuantity = useCallback((value: number) => {
        if (value >= 0) {
            vorder.basketOp({
                action: 'quantity',
                productId: entityId,
                quantity: value,
            })
        }
    }, [entityId])

    const openProduct = useCallback(() => {
        if (onPress) {
            onPress(entity)
        } else if (onPressBehavior === 'basket') {
            onBasketAdd()
        } else if (onPressBehavior === 'product') {
            catalog.showProduct(entity, productOpenAllowSecondary)
            onOpenProduct && onOpenProduct()
        }
    }, [entityId, onPress, onPressBehavior, onBasketAdd])


    const favItem = fav.itemsByProductId ? fav.itemsByProductId[entityId] : null

    const imageSrc = entity.LIST_IMAGE ? entity.LIST_IMAGE.SRC : null

    const renderErrors = useCallback(() =>
            <UiTransitionView
                preset={'message'}
                visible={!!error}
            >
                <UiMessage
                    message={errorSafe as TMessage}
                    preset={['outline', 'dense']}
                />
            </UiTransitionView>,
        [error, errorSafe])

    const giftsDialogRendered = useMemo(() =>
            !!entity.GIFTS.length &&
            giftsDialog.visible &&
            <UiDialog
                title={'Выбрать подарок'}
                visible={giftsDialog.visible}
                onClose={giftsDialog.hide}
                actions={{
                    items: [
                        {
                            label: 'Добавить в корзину',
                            icon: icons.buy,
                            disabled: !basketInputProps.GIFT,
                            onPress: () => {
                                onBasketAdd()
                                giftsDialog.hide()
                            }
                        }
                    ],
                    containerStyle: {
                        justifyContent: 'flex-start',
                        flexDirection: 'column',
                    }
                }}
            >
                <ProductGifts
                    basketInputProps={basketInputProps}
                    entity={entity}
                    onSelect={(id, gift) => onGiftSelect(gift)}
                    label={false}
                />
            </UiDialog>,
        [
            entity.GIFTS.length,
            giftsDialog.visible,
            onBasketAdd,
            basketInputProps
        ])

    const flags = useMemo(() => {
        return entity.getFlags(excludeFlags)
    }, [excludeFlags])

    return {
        imageSrc,
        basketProps,
        basketInputProps,
        setBasketProps,
        onGiftSelect,
        onBasketAdd,
        onBasketQuantity,
        onValidateAdd,
        openProduct,
        favItem,
        error,
        errorSafe,
        setError,
        renderErrors,
        giftsDialog,
        giftsDialogRendered,
        flags
    }
}

export function useProductSale(props: TUseProductSaleProps) {

    const {vorder, debug} = useStores()

    const {
        onBasketAdd,
        onBasketQuantity,
        entity,
    } = props

    const entityId = entity.ID

    const basketItem = vorder.basketItemByProductId ? vorder.basketItemByProductId[entityId] : null
    const basketItemQuantity = basketItem?.QUANTITY || 0

    const [calc, setCalc] = useState(() => {
        return vorder.calculateProduct(entity)
    })

    setTimeout(() => {
        debug.renderCount('ProductCardSale')
    })

    useWatch(() => {
        setTimeout(() => {
            setCalc(vorder.calculateProduct(entity))
        }, 1000)
    }, [vorder.discountBestHash])

    useWatch(() => {
        setCalc(vorder.calculateProduct(entity))
    }, [entityId])

    const renderBasketAdd = useCallback(({size = 41, outline = false}: { size?: number, outline?: boolean } = {}) => {
        const sizeScaled = moderateScale(size, 1.5)
        return <BasketAddButton
            size={sizeScaled}
            outline={outline}
            onPress={onBasketAdd}
        />
    }, [onBasketAdd])


    const renderBasketQuantity = useCallback(({size = 41}: Partial<TQuantityInputProps> = {}) => {
        const sizeScaled = moderateScale(size || 0, 1.5)
        return <QuantityInput
            value={basketItemQuantity || 0}
            onChange={onBasketQuantity}
            size={sizeScaled}
        />
    }, [onBasketQuantity, basketItemQuantity])

    const renderBasketAddButton = useCallback(({size = 35, outline = false}: {
        size?: number,
        outline?: boolean
    } = {}) =>
        <UiBtn
            iconSize={size * 0.65}
            outline={outline || undefined}
            buttonStyle={{
                paddingVertical: 8
            }}
            text-xl
            color={outline ? COLORS.primary : undefined}
            onPress={onBasketAdd}
            icon={icons.buy}
            label={'в корзину'}
            avoidMinWidth={true}
        />, [onBasketAdd])

    const showQuantity = true

    const showAdd = !basketItem || !showQuantity

    return {
        renderBasketAdd,
        renderBasketAddButton,
        renderBasketQuantity,
        calc,
        basketItem,
        showAdd
    }
}
