import React, {PropsWithChildren} from "react";
import {Text, View} from "react-native-ui-lib";
import {useStores} from "~stores";
import {BonusLevelElement} from "~gql/api";
import {TYPOGRAPHY} from "~assets/design";
import {StyleSheet} from "react-native";
import {UiView} from "~ui/view";


type TProps = PropsWithChildren<{}>

export const AppBonusInfoChunk: React.FC<TProps> = (
    {},
    ref
) => {

    const {sale} = useStores()

    const renderItem = (item: BonusLevelElement) => {
        return <UiView
            fullWidth={true}
            borderRadius={'md'}
            shadow={true}
            bg-white
            paddingH-11
            paddingV-14
            key={item.ID}
            gap-16
            style={{

            }}
        >
            <Text text-lg-bo-lh0 primary>{item.NAME}</Text>

            <View row centerV gap-15>
                <Text style={styles.fieldLabel}>Сумма заказов 6 мес.</Text>
                <Text style={styles.fieldValue}>{item.ORDERS_SUMM}</Text>
            </View>

            <View row centerV gap-15>
                <Text style={styles.fieldLabel}>Накопления</Text>
                <Text style={styles.fieldValue}>{item.ACCUMULATION_PERCENT}%</Text>
            </View>

            <View row centerV gap-15>
                <Text numberOfLines={2} style={styles.fieldLabel}>Можно оплатить от суммы заказа</Text>
                <View>
                    <Text style={styles.fieldValue}>до {item.MAX_USE_PERCENT}%</Text>
                </View>
            </View>
        </UiView>
    }

    return <View gap-20>
        {sale.bonusLevels.map(item => renderItem(item))}
    </View>
}

export default AppBonusInfoChunk

const styles = StyleSheet.create({
    fieldLabel: {
        ...TYPOGRAPHY['text-sm-lh1'],
        flex: 1,
        flexWrap: 'wrap'
    },
    fieldValue: {
        marginLeft: "auto",
        ...TYPOGRAPHY['text-md-m-lh1'],
    },
});
