import React from "react"
import {Colors, TouchableOpacity, View, ViewProps} from "react-native-ui-lib"
import {StyleSheet} from "react-native"
import {IconBackRender} from "~assets/icons-map"
import render from "@core/main/util/react/render";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useStores} from "~stores";

export type UiTopbarProps = ViewProps & {
    backEnable?: boolean
    topContent?: any
    mainContent?: any
    useSafeArea?: boolean
}

export const UiTopbar: React.FC<UiTopbarProps> = (props) => {

    let {
        backEnable = true,
        topContent,
        mainContent,
        useSafeArea = false,
        ...rest
    } = props
    const {router: routerStore} = useStores()

    let top = 8

    if (useSafeArea) {
        const insets = useSafeAreaInsets()
        top += insets.top
    }

    return <View
        {...rest}
        style={[
            styles.container,
            {
                paddingTop: top,
            }
        ]}
    >
        <View row gap-0 paddingH-screenH centerV>
            <TouchableOpacity
                onPress={() => {
                    routerStore.back()
                }}
                paddingV-6
                paddingH-7
            >
                {IconBackRender(Colors.grey20, 22)}
            </TouchableOpacity>
            <View flexG>
                {render(topContent)}
            </View>
        </View>

        {mainContent && <View>
            {render(mainContent)}
        </View>}

    </View>
}

const styles = StyleSheet.create({
    container: {},
})
