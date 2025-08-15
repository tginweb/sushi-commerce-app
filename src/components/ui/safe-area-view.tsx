import {Platform, SafeAreaView, StatusBar, StyleSheet, ViewProps} from "react-native";
import {PropsWithChildren} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export type UiSafeAreaViewProps = PropsWithChildren<ViewProps>

export const UiSafeAreaView: React.FC<UiSafeAreaViewProps> = (
    {
        children,
        style,
        ...rest
    }
) => {

    const insets = useSafeAreaInsets()

    let offset = insets.top

    if (Platform.OS === "android" && StatusBar.currentHeight) {
        offset += StatusBar.currentHeight
    }

    return <SafeAreaView
        style={[
            styles.container,
            style,
            {
                paddingTop: offset
            }
        ]}
    >
        {children}
    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
