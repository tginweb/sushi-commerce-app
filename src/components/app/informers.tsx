import React, {useMemo} from "react"
import {useStores} from "~stores"
import {observer} from "mobx-react"
import componentRender from "@core/main/util/react/componentRender"
import {View} from "react-native-ui-lib";
import {StyleSheet, ViewStyle} from "react-native";

type TProps = {}

export const Informers: React.FC<TProps> = observer(({}) => {

    const stores = useStores()
    const {ui, geo} = useStores()

    const barHeight = ui.appLayoutTabbarHeight

    const containerStyle = useMemo<ViewStyle>(() => {
        return {
            bottom: barHeight
        }
    }, [barHeight])

    if (!ui.informers.length)
        return <></>

    return (
        <View style={[styles.container, containerStyle]}>
            {ui.informers.map((com: any, index: number) =>
                <View key={index}>
                    {componentRender(com, {index}, {stores})}
                </View>
            )}
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        gap: 20
    },
});
