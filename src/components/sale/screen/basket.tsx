import React, {useCallback, useState} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useServices} from "~services"
import {useStores} from "~stores"
import {TScreenProps} from "@core/main/types"
import {useFocusEffect} from "expo-router"
import {View} from "react-native-ui-lib";
import icons from "~assets/icons-map";
import {COLORS} from "~assets/design";
import * as Progress from 'react-native-progress';
import {SafeAreaView} from 'react-native-safe-area-context'

export const BasketScreen: React.FC<TScreenProps> = observer(() => {
    const {vorder, router: routerStore} = useStores()
    const {} = useServices()

    const [loading, setLoading] = useState<boolean>()

    useFocusEffect(useCallback(() => {
        if (!vorder.basketModal.visible) {
            vorder.showBasketModal()
        }
        return () => {
            routerStore.setAdditionalParam('form', 'basket')
            vorder.hideBasketModal()
        }
    }, []))

    return <SafeAreaView style={{flex: 1}}>

        <View flex centerH centerV gap-20>
            <View>
                {icons.buy({size: 60, color: COLORS.primary})}
            </View>
            {loading && <Progress.CircleSnail
                style={{}}
                thickness={3}
                size={30}
                duration={700}
                color={'#e1865f'}
                indeterminate={true}
            />}
        </View>

    </SafeAreaView>
})

const styles = StyleSheet.create({});

export default BasketScreen
