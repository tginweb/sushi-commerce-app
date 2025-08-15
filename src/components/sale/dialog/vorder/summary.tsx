import React, {useMemo} from "react"
import {Text, TextProps, View, ViewProps} from "react-native-ui-lib"
import {useStores} from "~stores"
import {StyleSheet} from "react-native"
import {useServices} from "~services";
import plural from "plural-ru";
import {UiPressable} from "~ui/pressable";

type TLineItem = {
    label?: string
    labelProps?: any
    labelSuffix?: string
    labelSuffixProps?: any
    props?: ViewProps
    valueText?: string | number
    value?: string | number
    valueOld?: string | number
    append?: any
    showValueOld?: boolean
    discountPercent?: number
    valueProps?: TextProps
    onPress?: () => void
}

type TProps = ViewProps & {
    showBenefit?: boolean
    showDelivery?: boolean
    showTotal?: boolean
    showBasket?: boolean
    showAddress?: boolean
}

export const VorderSummary: React.FC<TProps> = (props, ref) => {

    const {vorder} = useStores()
    const {catalogUtil} = useServices()

    const {
        showBenefit = false,
        showDelivery = false,
        showTotal = false,
        showBasket = false,
        showAddress = false,
        ...rest
    } = props

    const lines = useMemo(() => {

        const res: TLineItem[] = []

        if (showBenefit) {

            (() => {
                switch (vorder.benefitType) {
                    case 'discount':
                        if (vorder.discountBestBenefited)
                            res.push({
                                label: 'Скидка',
                                valueText: vorder.discountBestBenefited?.nameTemplatedShort,
                                valueProps: {
                                    'text-sm-m-lh0': true,
                                    'green20': true
                                },
                                onPress: () => vorder.vorderDialogOpen('benefit')
                            })
                        break;
                    case 'bonus':
                        if (vorder.bonuses)
                            res.push({
                                label: 'Использовать бонусы',
                                value: vorder.bonuses + ' ' + plural(vorder.bonuses, 'бонус', 'бонуса', 'бонусов'),
                                valueProps: {
                                    'green20': true
                                },
                                onPress: () => vorder.vorderDialogOpen('benefit')
                            })
                        break;
                    case 'coupon':
                        if (vorder.coupon?.COUPON)
                            res.push({
                                label: 'Использовать помокод',
                                valueText: vorder.coupon?.COUPON,
                                valueProps: {
                                    'text-sm-bo-lh0': true,
                                    'green20': true
                                },
                                onPress: () => vorder.vorderDialogOpen('benefit')
                            })
                        break;
                }
            })()
        }

        if (vorder.basketIsEmpty)
            return []

        if (showBasket) {
            res.push({
                label: 'Товары',
                labelSuffix: vorder.basketWeight ? '/ ' + vorder.basketWeight + ' гр' : undefined,
                value: catalogUtil.price(vorder.priceBasket),
                valueOld: catalogUtil.price(vorder.priceBasketBase),
            })
        }


        if (showDelivery && vorder.priceDelivery) {
            const deliveryFreePrice = vorder.deliveryFreeFromPrice
            const basketPrice = vorder.priceBasket
            const deliveryUntilFreePrice = deliveryFreePrice - basketPrice
            //const progress = deliveryUntilFreePrice > 0 ? 100 * basketPrice / deliveryFreePrice : 100

            res.push({
                label: 'Стоимость доставки',
                //labelSuffix: '(бесплатно от ' + catalogUtil.formatPriceCurrency(vorder.deliveryFreeFromPrice) + ')',
                labelSuffixProps: {'text-sm-m-lh0': true, 'red20': true},
                value: catalogUtil.formatPriceCurrency(vorder.priceDelivery),
                valueOld: catalogUtil.formatPriceCurrency(vorder.priceDeliveryBase),
                append: <View
                    gap-7
                    paddingB-5
                    paddingT-8
                >
                    <View row centerV gap-6>
                        <Text text-xxs-m-lh0 yellow10>
                            Бесплатно от суммы заказа более
                        </Text>
                        <Text text-xs-m-lh0 yellow10>
                            {catalogUtil.price(deliveryFreePrice)}
                        </Text>
                    </View>

                </View>
            })
        }

        if (showAddress) {
            res.push({
                label: 'Доставка: ' + vorder.profile.getAddressForView(true, false),
                labelProps: {
                    'text-xs': true
                }
            })
        }

        return res
    }, [
        showBenefit,
        vorder.benefitType,
        vorder.discountBestHash,
        vorder.bonuses,
        vorder.coupon?.COUPON,

        showBasket,
        vorder.basketIsEmpty,
        vorder.basketWeight,
        vorder.priceBasket,

        showDelivery,
        vorder.priceDelivery,
    ])


    return !!lines.length && <View
        style={styles.box}
        gap-0
        {...rest}
    >
        {
            lines.map(line =>
                <UiPressable
                    key={line.label}
                    onPress={line.onPress}
                    style={styles.line}
                >
                    <View
                        centerV
                        gap-5
                        row
                        {...line.props}
                    >
                        <View flexG>
                            <View row gap-6 centerV>
                                <Text
                                    style={styles.label}
                                    text-sm-m
                                    colorAspid={true}
                                    {...line.labelProps}
                                >
                                    {line.label}
                                </Text>
                                {line.labelSuffix &&
                                    <Text
                                        colorAspid={true}
                                        text-xxs
                                        style={styles.labelSuffix}
                                        {...line.labelSuffixProps}
                                    >
                                        {line.labelSuffix}
                                    </Text>
                                }
                            </View>
                        </View>
                        <View>
                            <View row gap-4 style={{ flexWrap: 'wrap'}}>
                                {
                                    line.valueText ?
                                        <Text
                                            {...line.valueProps}
                                        >{line.valueText}</Text>
                                        :
                                        (
                                            line.valueOld && (line.showValueOld || line.value !== line.valueOld) ?
                                                <>
                                                    <Text
                                                        style={styles.valueOld}
                                                        text-xs
                                                        {...line.valueProps}
                                                    >{line.valueOld}</Text>
                                                    <Text
                                                        style={styles.value}
                                                        text-sm-bo
                                                        {...line.valueProps}
                                                    >{line.value}</Text>
                                                </>
                                                :
                                                <Text
                                                    style={styles.value}
                                                    text-sm-bo
                                                    {...line.valueProps}
                                                >{line.value}</Text>
                                        )
                                }
                            </View>
                        </View>
                    </View>
                    <View>{line.append}</View>
                </UiPressable>
            )
        }
    </View>
}

export default VorderSummary

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between'
    },
    box: {},
    line: {
        flexWrap: 'nowrap',
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderColor: '#DDDDDD',
        //borderRadius: 10,
        paddingVertical: 12,
        //paddingHorizontal: 16
    },
    label: {},
    labelSuffix: {},
    value: {
        flexWrap: 'wrap'
    },
    valueOld: {
        textDecorationLine: 'line-through',
        color: '#d33b3b',
    },
    delivery: {
        borderRadius: 9,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        paddingHorizontal: 20,
        paddingVertical: 6
    }
})
