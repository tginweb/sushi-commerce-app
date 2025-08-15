import {View} from "react-native-ui-lib";
import {COLORS} from "~assets/design";
import {StyleSheet} from "react-native";
import React from "react";
import {useStores} from "~stores";
import {observer} from "mobx-react";
import {UiCard, UiCardProps} from "~ui/card";
import {UiBadge} from "~ui/badge";
import icons from "~assets/icons-map";

type TProps = UiCardProps & {}

export const UserNoticesCard: React.FC<TProps> = observer((props) => {

    const {
        noticesDialog,
        notice
    } = useStores()

    return <UiCard
        preset={'frontUser'}
        onPress={() => noticesDialog.show()}
        centerV
        centerH
    >
        <View paddingH-4>
            {!!notice.unreadedNoticesCount &&
                <UiBadge
                    backgroundColor={COLORS.primary}
                    label={notice.unreadedNoticesCount.toString()}
                    size={16}
                    containerStyle={{
                        position: 'absolute',
                        right: 0,
                        top: -15,
                        zIndex: 10
                    }}
                />
            }
            {icons.bell({size: 25, color: COLORS.primary})}
        </View>
    </UiCard>

})

const styles = StyleSheet.create({});



