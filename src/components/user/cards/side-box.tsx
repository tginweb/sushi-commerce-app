import {StyleSheet} from "react-native";
import React, {useMemo} from "react";
import {useStores} from "~stores";
import {observer} from "mobx-react";
import {UiCard, UiCardProps} from "~ui/card";
import {Text, View} from "react-native-ui-lib";

type TProps = UiCardProps & {}

export const UserSideBoxCard: React.FC<TProps> = observer((props) => {

    const {
        sale,
        vorder,
        offer,
        deliveryEditDialog
    } = useStores()

    const {
        ...rest
    } = props

    const suggestions = ['faq', 'delivery', 'hottestOffer']

    const box = useMemo<UiCardProps | null>(() => {

            let res: UiCardProps | null = null

            for (const suggestion of suggestions) {

                switch (suggestion) {
                    case 'faq':
                        res = {
                            title: 'Вопросы и ответы',
                            containerProps: {
                                style: {

                                }
                            },
                            onPressAction: 'dialog://faq',
                            children: <Text center text-xxs-m>
                               Узнать условия бонусов и акций
                            </Text>
                        }

                        break;
                    case 'delivery':
                        res = {
                            title: vorder.attrValue['DELIVERY_ID'] === 1 ? 'Адрес доставки' : 'Адрес самовывоза',
                            contentProps: {
                                flex: 1,
                                style: {flex: 1}
                            },
                            children: <View flex centerV>
                                {vorder.attrValue['DELIVERY_ID'] === 1 ?
                                    (vorder.profile ?
                                            <Text text-xs-m-lh0 colorAspid center numberOfLines={3}>
                                                {vorder.profile.getAddressForView('city', false)}
                                            </Text>
                                            :
                                            <Text text-xs-m-lh0 center>
                                                выберите адрес
                                            </Text>
                                    )
                                    :
                                    (vorder.pickupDepartmentElement ?
                                            <Text text-xxs-m-lh0 center colorAspid>
                                                {vorder.pickupDepartmentElement.NAME}
                                            </Text>
                                            :
                                            <Text text-xs-m-lh0 center>
                                                выберите подразделение
                                            </Text>
                                    )
                                }
                            </View>,
                            onPress: () => deliveryEditDialog.open({profile: vorder.profile})
                        }
                        break;
                    case 'hottestOffer':
                        if (offer.hottestOffer) {
                            res = {
                                containerProps: {
                                    style: {
                                        justifyContent: 'center',
                                        backgroundColor: '#37A0D1'
                                    }
                                },
                                children: <Text center white>
                                    {offer.hottestOffer?.getTemplatedReact('NAME',
                                        (v) => <Text bold-8 key={1} white>{v}</Text>
                                    )}
                                </Text>
                            }
                        }
                        break;
                }

                if (res)
                    break;
            }

            return res
        },
        [
            sale.userOrdersActiveHash,
            vorder.attrValue['DELIVERY_ID'],
            vorder.attrValue['PICKUP_DEPARTMENT'],
            vorder.addressFull,
            vorder.profile,
        ]
    )

    return box ? <UiCard
        key={'sideBox'}
        preset={'frontUser'}
        titleProps={{
            center: true
        }}
        {...box}
        {...rest}
    /> : <></>
})

const styles = StyleSheet.create({});



