import {Text, View} from "react-native-ui-lib";
import {COLORS} from "~assets/design";
import {StyleSheet} from "react-native";
import React from "react";
import {useStores} from "~stores";
import {observer} from "mobx-react";
import {UiCard, UiCardProps} from "~ui/card";
import {UiBtn} from "~ui/btn";
import icons from "~assets/icons-map";

type TProps = UiCardProps & {}

export const UserProfileCard: React.FC<TProps> = observer((props) => {

    const {
        ...rest
    } = props
    const {router, user} = useStores()

    const phoneOrMail = user.user?.PHONE_FORMATTED || user.user?.EMAIL

    return <UiCard
        contentProps={{
            'gap-4': true
        }}
        preset={'frontUser'}
        onPress={() => router.push('/user/profile-edit')}
        {...rest}
    >
        <View
            row
            gap-13
            centerV
        >
            <View style={{width: 35}}>
                {icons.profile({
                    size: 35,
                    color: COLORS.primaryLighter
                })}
            </View>
            <View gap-4 flexG>
                <View gap-8>
                    <Text text-sm-m-lh0 numberOfLines={1}>{user.userNameOrGuest}</Text>
                    {phoneOrMail && <Text text-xs-lh0>{phoneOrMail}</Text>}
                    <View left pointerEvents={'none'}>
                        <UiBtn
                            link={true}
                            avoidMinWidth={true}
                            size={'small'}
                            label={'редактировать профиль'}
                            text-xs-lh0
                        />
                    </View>
                </View>
            </View>
        </View>
    </UiCard>
})

const styles = StyleSheet.create({});



