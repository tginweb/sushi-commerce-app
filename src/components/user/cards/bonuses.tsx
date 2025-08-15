import {Text, View} from "react-native-ui-lib";
import {COLORS} from "~assets/design";
import {StyleSheet} from "react-native";
import React from "react";
import {useStores} from "~stores";
import {observer} from "mobx-react";
import {UiCard, UiCardProps} from "~ui/card";
import {UiBtn} from "~ui/btn";

type TProps = UiCardProps & {}

export const UserBonusesCard: React.FC<TProps> = observer((props) => {

    const {
        ...rest
    } = props

    const {
        sale,
        router,
    } = useStores()

    return <UiCard
        title={'Ваши бонусы'}
        titleProps={{
            center: true
        }}
        preset={'frontUser'}
        onPress={() => router.push('/user/bonuses')}
        loading={sale.fetchClientCard.pending}
        {...rest}
    >
        <View gap-5>
            {!!sale.userClientCard && !sale.userClientCard.EXPIRED ?
                <>
                    <Text text-xxl-bo-lh0 center>{sale.userClientCard.BONUSES || 0}</Text>
                    {sale.userClientCard.LEVEL &&
                        <Text
                            text-xs-m-lh0
                            style={{color: sale.userClientCard.LEVEL.COLOR}}
                            center
                        >
                            {sale.userClientCard.LEVEL.NAME}
                        </Text>
                    }
                </>
                :
                <View gap-4>
                    <Text text-xxs-lh1>Данные не загружены</Text>
                    <UiBtn
                        outline={true}
                        text-xxs
                        color={COLORS.primary}
                        size={'small'}
                        label={'повторить загрузку'}
                        onPress={() => sale.fetchClientCard()}
                    />
                </View>
            }
        </View>
    </UiCard>
})

const styles = StyleSheet.create({});



