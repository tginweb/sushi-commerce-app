import React, {useCallback, useMemo} from "react"
import {StyleSheet, ViewStyle, ImageStyle} from "react-native"
import {Shadows, Text, TouchableOpacity, View} from "react-native-ui-lib"
import {useServices} from "~services"
import {UiImage} from "~ui/image";
import {TCatalogMenuItem} from "@core/catalog/types";
import {useStores} from "~stores";
import {COLORS, TYPOGRAPHY} from "~assets/design";

const themesDefault: Record<string, TTheme> = {
    1: {
        style: {
            width: '100%'
        },
        imageStyle: {
            height: 120,
            aspectRatio: 3,
        }
    },
    '1-2': {
        style: {
            width: '50%'
        },
        imageStyle: {
            height: 100,
            aspectRatio: 2.4,
        }
    },
    '2-3': {
        style: {
            width: '66.666%'
        },
        imageStyle: {
            height: 110,
            aspectRatio: 2,
        }
    },
    '1-3': {
        style: {
            width: '33.333%'
        },
        imageStyle: {
            height: 70,
            aspectRatio: 2,
        }
    },
}

type TThemeId = keyof typeof themesDefault

export type TCatalogMenuProps = {
    items: TCatalogMenuItem[],
    navItem?: (item: TCatalogMenuItem) => void
    onNavItem?: (item: TCatalogMenuItem) => void
    overrideThemeId?: TThemeId
    themes?: Record<string, TTheme>
}

type TTheme = {
    style: ViewStyle,
    imageStyle?: ImageStyle
}

export const CatalogMenu: React.FC<TCatalogMenuProps> = (props) => {

    const {imager} = useServices()

    const {catalog} = useStores()

    const {
        items,
        navItem,
        onNavItem,
        overrideThemeId,
        themes = themesDefault,
        ...rest
    } = props

    const onPress = (item: TCatalogMenuItem) => {
        onNavItem && onNavItem(item)
        if (navItem) {
            navItem(item)
        } else {
            catalog.runAction({
                type: 'tab',
                payload: item.code
            })
        }
    }

    const renderImage = useCallback((item: TCatalogMenuItem, theme: TTheme) => {
        if (item.imageSrc) {
            return <UiImage
                style={[
                    styles.itemImage,
                    theme.imageStyle
                ]}
                source={{
                    uri: item.imageSrc
                }}
                vendor={'expo'}
            />
        } else if (item.icon) {
            return item.icon({size: 36, color: COLORS.primary})
        }
    }, [])

    const renderItem = useCallback((item: TCatalogMenuItem) => {

        let themeId: TThemeId | undefined = overrideThemeId

        if (!themeId) {
            let entity: any

            if (item.cardTheme) {
                themeId = item.cardTheme
            } else if (item.type === 'section') {
                if (item.entity) {
                    entity = item.entity
                } else if (item.entityId) {
                    entity = catalog.sectionsById[item.entityId]
                }
                themeId = entity.propValue.M_CARD
            }
        }

        themeId = themeId || '1-3'

        const theme = themes[themeId]

        return <View
            key={item.code}
            style={{
                padding: 5,
                ...theme.style
            }}
        >
            <TouchableOpacity
                onPress={() => onPress(item)}
                style={[styles.itemContainer, Shadows.sh30.bottom]}
            >
                {renderImage(item, theme)}
                <Text style={styles.itemName}>{item.title}</Text>
            </TouchableOpacity>
        </View>
    }, [renderImage, overrideThemeId, themes])

    const content = useMemo(() => {
        return items.map((item: any, index) => renderItem(item))
    }, [items, renderItem, overrideThemeId])

    return <View
        row
        style={{flex: 1, flexWrap: 'wrap'}}
        {...rest}
    >
        {content}
    </View>
}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemImage: {
        resizeMode: 'contain',
    },
    itemName: {
        ...TYPOGRAPHY['text-sm-bo-lh0'],
        textAlign: 'center',
        paddingTop: 8,
    },
})

export default CatalogMenu

