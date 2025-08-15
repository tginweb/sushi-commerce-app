import React from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {Text, View} from "react-native-ui-lib"
import {UiImage} from "~ui/image";
import {UiBtn} from "~ui/btn";
import {CatalogProducts} from "~com/catalog/list/products";

export type CatalogConstructorSectionProps = {
    showBuilds: boolean
}

export const CatalogConstructorSection: React.FC<CatalogConstructorSectionProps> = observer((props) => {

    const {showBuilds} = props

    const {catalogConstructor} = useStores()

    const renderHero = () => <View paddingH-16 paddingV-15>
        <View row style={{}} centerH>
            <UiImage
                vendor={'expo'}
                source={{
                    uri: 'https://irkutsk.sushi-studio.ru/statics/wok-main.png'
                }}
                aspectRatio={1}
                style={{
                    width: '80%'
                }}
            />
        </View>
        <View testID={'blockWok'} center>
            <Text text-xxl-lh2 marginB-20>Собери свой WOK</Text>
            <Text text-lg-lh2>от 210 руб.</Text>
            <UiBtn
                label={'Перейти в конструктор'}
                marginT-20
                onPress={() => catalogConstructor.dialog.show()}
            />
        </View>

    </View>

    return <View flex style={{}}>

        {showBuilds && catalogConstructor.constructorBuildBestsellers.length ?
            <CatalogProducts
                tab={{
                    type: 'page',
                    title: 'Wok',
                    code: 'wok',
                    listOptions: {},
                    tabbar: {}
                }}
                elements={catalogConstructor.constructorBuildBestsellers}
                viewMode={'grid'}
                gridProps={{
                    ListHeaderComponent: <View>
                        {renderHero()}
                    </View>
                }}
            />
            :
            renderHero()
        }

    </View>

})

const styles = StyleSheet.create({

    product: {},
    productSelected: {
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 20
    },
})

export default CatalogConstructorSection
