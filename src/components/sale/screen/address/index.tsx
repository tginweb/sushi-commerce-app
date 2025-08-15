import React, {useCallback} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {View} from "react-native-ui-lib"
import {useStores} from "~stores"
import {TScreenProps} from "@core/main/types"
import {useFocusEffect} from "expo-router";
import * as Progress from 'react-native-progress';
import {SafeAreaView} from "react-native-safe-area-context"

export const AddressScreen: React.FC<TScreenProps> = observer(() => {

    const {deliveryEditDialog} = useStores()

    useFocusEffect(useCallback(() => {
        setTimeout(() => {
            deliveryEditDialog.open({isStartup: true})
        }, 200)
        return () => {
            deliveryEditDialog.hide()
        }
    }, []))

    return <SafeAreaView style={{flex: 1}}>

        <View flex centerH centerV gap-20>
            <Progress.CircleSnail
                style={{}}
                thickness={3}
                size={30}
                duration={700}
                color={'#e1865f'}
                indeterminate={true}
            />
        </View>

    </SafeAreaView>
})

export default AddressScreen

const styles = StyleSheet.create({})
