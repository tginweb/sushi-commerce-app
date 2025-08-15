import React, {useMemo, useState} from "react"
import {useStores} from "~stores"
import {observer} from "mobx-react"
import {View} from "react-native-ui-lib";
import {TYPOGRAPHY, wHeight, wWidth} from "~assets/design";
import Drag from '~ui/drag';
import {StyleSheet} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {DevConsolePanel} from "~com/main/debug/console-overlay";

type TProps = {}

export const ConsoleOverlay: React.FC<TProps> = observer(({}) => {

    const {debug} = useStores()
    const insets = useSafeAreaInsets()
    const [focused, setFocused] = useState(false)

    const insetTop = insets.top || 20
    const insetBottom = insets.bottom || 20

    const maxHeight = wHeight - insetTop - insetBottom

    const [position, setPosition] = useState({
        x: 20,
        y: insets.top,
        width: wWidth * 0.9,
        height: 300
    })

    const positionComputed = useMemo(() => {
        if (!debug.consolePanelFullscreen) {
            return position
        } else {
            return {
                width: wWidth,
                height: maxHeight,
                x: 0,
                y: insetTop
            }
        }
    }, [position, insetTop, insetBottom, maxHeight, debug.consolePanelFullscreen])

    return (
        <View
            style={[
                {
                    position: 'absolute',
                    zIndex: 100000,
                },
            ]}
        >
            <Drag
                height={positionComputed.height}
                width={positionComputed.width}
                x={positionComputed.x}
                y={positionComputed.y}
                limitationHeight={maxHeight}
                limitationWidth={wWidth}
                onDragStart={() => {
                    //setFocused(true)
                }}
                onDragEnd={(boxPosition) => {
                    /*
                    setPosition({
                        ...position,
                        ...boxPosition
                    })
                    setFocused(false)

                     */
                }}
                onResizeEnd={(boxPosition) => {
                    setPosition({
                        ...position,
                        ...boxPosition
                    })
                }}
                draggable={!debug.consolePanelFullscreen}
                resizable={!debug.consolePanelFullscreen}
            >
                <View
                    style={styles.box}
                >
                    <DevConsolePanel
                        height={positionComputed.height}
                        focused={focused}
                        backgroundColor={'#111111'}
                    />
                </View>

            </Drag>

        </View>
    )
})

const styles = StyleSheet.create({
    shadow: {
        width: '100%',
        height: '100%',
        borderRadius: 12
    },
    box: {
        width: '100%',
        height: '100%',
        backgroundColor: '#00000099',
        borderWidth: 1,
        borderColor: '#AAAAAA',
        borderRadius: 12,
        overflow: "hidden"
    },
    itemChannel: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 4
    },
    itemChannelText: {
        color: '#222222',
        ...TYPOGRAPHY['text-xs-m-lh1'],
    },
    itemMessage: {
        ...TYPOGRAPHY['text-xs-m-lh1']
    },
    itemData: {
        ...TYPOGRAPHY['text-xs-r-lh1'],
        color: '#CCCCCC'
    },
    item: {
        borderBottomWidth: 1,
        borderColor: '#FFFFFF44',
        paddingVertical: 7,
        paddingHorizontal: 10,
        marginBottom: 0
    },
    itemSelected: {
        borderWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#FFFFFF',
    },
});


const itemsStyle: Record<string, {
    rgb: string
}> = {
    info: {
        rgb: '44,82,93'
    },
    warning: {
        rgb: '190,149,82'
    },
    error: {
        rgb: '143,38,38'
    }
}
