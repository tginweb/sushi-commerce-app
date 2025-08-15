import {TYPOGRAPHY} from "~assets/design";
import {StyleSheet} from "react-native";
import React from "react";
import {useStores} from "~stores";
import {observer} from "mobx-react";
import {UiCardProps} from "~ui/card";
import {View} from "react-native-ui-lib";
import {UiBtn} from "~ui/btn";

type TProps = UiCardProps & {}

export const UserLoginButtonCard: React.FC<TProps> = observer((props) => {

    const {
        user,
    } = useStores()

    return !user.isAuthorized && <View
        paddingV-30 row centerV centerH
    >
        <UiBtn
            label={'Войти в аккаунт'}
            size={'large'}
            buttonStyle={{width: '100%'}}
            onPress={() => {
                user.navLogin({})
            }}
            labelStyle={{
                ...TYPOGRAPHY['text-xl']
            }}
            paddingV-16
        />
    </View>
})

const styles = StyleSheet.create({});



