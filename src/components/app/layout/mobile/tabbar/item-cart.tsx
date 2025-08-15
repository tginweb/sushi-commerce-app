import React, {useCallback, useEffect, useState} from "react"
import {StyleSheet, TouchableOpacity} from "react-native"
import {useStores} from "~stores"
import {observer} from "mobx-react"
import CartIcon from "~assets/icons/Basket"
import {BottomTabNavigationOptions} from "@react-navigation/bottom-tabs/lib/typescript/src/types"
import {useServices} from "~services";
import {View} from "react-native-ui-lib";
import {FONT_FAMILY} from "~assets/design";
import Reanimated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from "react-native-reanimated";

interface TProps {
    color?: string,
    size?: any,
    options?: BottomTabNavigationOptions
}

export const AppNavTabbarItemCart: React.FC<TProps> = observer((
    props: TProps
) => {
    const {
        size,
        options
    } = props

    const {catalogUtil} = useServices()
    const {vorder} = useStores()

    const [isActiveCart, setIsActiveCart] = useState(false)
    const [price, setPrice] = useState(vorder.priceBasket)

    useEffect(() => {
        
        if (vorder.priceBasket) {
            setPrice(vorder.priceBasket)
        } else {
            setTimeout(() => {
                setPrice(0)
            }, 300)
        }

        if (vorder.basketNotEmpty) {
            setIsActiveCart(true)
            activeValue.value = withSpring(1, {duration: 300})
        } else {
            setIsActiveCart(false)
            activeValue.value = withSpring(0, {duration: 300})
        }

    }, [vorder.priceBasket, vorder.basketNotEmpty]);

    const onPress = useCallback(() => {
        vorder.navBasket()
    }, [])


    const activeValue = useSharedValue(0)

    const itemStyle = useAnimatedStyle(() => {
        return {
            height: interpolate(
                activeValue.value,
                [0, 1],
                [ITEM_SIZE, ITEM_SIZE_ACTIVE],
            ),
            width: interpolate(
                activeValue.value,
                [0, 1],
                [ITEM_SIZE, ITEM_SIZE_ACTIVE],
            ),
            borderRadius: interpolate(
                activeValue.value,
                [0, 1],
                [ITEM_SIZE / 2, ITEM_SIZE_ACTIVE / 2],
            ),
            opacity: interpolate(
                activeValue.value,
                [0, 1],
                [1, 1],
            ),
            left: interpolate(
                activeValue.value,
                [0, 1],
                [-ITEM_SIZE / 2, -ITEM_SIZE_ACTIVE / 2],
            ),
            backgroundColor: interpolateColor(
                activeValue.value,
                [0, 1],
                ['#D1683722', '#D16837'],
            ),
        }
    }, [])

    const innerStyle = useAnimatedStyle(() => {
        return {
            marginTop: interpolate(
                activeValue.value,
                [0, 1],
                [0, -6],
            ),
        }
    }, [])

    const priceStyle = useAnimatedStyle(() => {
        const fontSize = interpolate(
            activeValue.value,
            [0, 1],
            [0, 11],
        )
        return {
            fontSize: fontSize > 0 ? fontSize : 1,
            lineHeight: fontSize > 0 ? fontSize : 1,
            paddingTop: interpolate(
                activeValue.value,
                [0, 1],
                [0, 6],
            ),
        }
    }, [])


    return <TouchableOpacity
        onPress={onPress}
        style={styles.container}
    >
        <View
            reanimated
            style={[
                styles.item,
                itemStyle
            ]}
        >
            <View
                reanimated
                style={[
                    innerStyle
                ]}
                flex
                centerV
                centerH
            >
                <CartIcon
                    stroke={isActiveCart ? '#FFFFFF' : '#D16837'}
                    width={18}
                    height={18}
                    style={{}}
                />
                <Reanimated.Text
                    style={[
                        styles.price,
                        priceStyle
                    ]}
                >
                    {price ? price + ' ₽' : ' '}
                </Reanimated.Text>
            </View>
        </View>
    </TouchableOpacity>
})

export default AppNavTabbarItemCart

const ITEM_SIZE = 40
const ITEM_SIZE_ACTIVE = ITEM_SIZE + 15

const styles = StyleSheet.create({
    price: {
        fontFamily: FONT_FAMILY.medium,
        color: '#ffffff',
    },
    container: {
        marginHorizontal: ITEM_SIZE,
        maxWidth: 0,
        position: 'relative'
    },
    item: {
        position: "absolute",
        bottom: 7,
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        borderRadius: ITEM_SIZE / 2,
        //...THEME_STYLE.shadow2
    },
});
