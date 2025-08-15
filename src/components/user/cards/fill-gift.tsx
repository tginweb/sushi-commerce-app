import {Text} from "react-native-ui-lib";
import {StyleSheet} from "react-native";
import React from "react";
import {useStores} from "~stores";
import {observer} from "mobx-react";
import {UiCard, UiCardProps} from "~ui/card";
import {COLORS} from "~assets/design";

type TProps = UiCardProps & {}

export const UserProfileFillGiftCard: React.FC<TProps> = observer((props) => {

    const {
        router,
    } = useStores()

    return <UiCard
        contentProps={{
            'gap-4': true
        }}
        preset={'frontUser'}
        onPress={() => router.push('/user/profile-edit')}
        containerProps={{
            style: {
                backgroundColor: COLORS.secondary
            }
        }}
    >
        <Text text-xs-lh2 center white>
            Заполните личный кабинет и получите
        </Text>
        <Text text-xs-bo white center>300 бонусов!</Text>
    </UiCard>
})

const styles = StyleSheet.create({});



