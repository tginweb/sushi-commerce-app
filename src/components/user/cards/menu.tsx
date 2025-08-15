import {COLORS} from "~assets/design";
import {StyleSheet} from "react-native";
import React, {useMemo} from "react";
import {useStores} from "~stores";
import {observer} from "mobx-react";
import {UiCardProps} from "~ui/card";
import {UiList} from "~ui/list";
import {UiListItemProps} from "~ui/list-item";

type TProps = UiCardProps & {}

export const UserMenuCard: React.FC<TProps> = observer((props) => {

    const {
        sale,
        user,
        menu
    } = useStores()

    const itemsGuest = useMemo(() => {

        const res: UiListItemProps[] = []

        if (sale.userOrdersActive.length) {
            res.push({
                label: sale.userOrdersActive.length > 1 ? 'Активные заказы' : 'Активный заказ',
                action: {
                    url: 'router://user/orders-active'
                },
                badge: {
                    label: sale.userOrdersActive.length.toString()
                }
            })
        }

        res.push({
            label: 'Адреса доставки',
            action: {
                url: 'dialog://address-profiles'
            },
            badge: sale.userOrderProfiles.length > 0 ? {
                label: sale.userOrderProfiles.length.toString(),
                backgroundColor: COLORS.colorAspid
            } : undefined
        })
        return res
    }, [
        sale.userOrdersActive.length,
        sale.userOrderProfiles.length
    ])

    let items: UiListItemProps[] = menu.menuItems.personal as UiListItemProps[]

    return <UiList
        itemPreset={'menu'}
        preset={'menu'}
        itemProps={{
            showMore: false,
            iconProps: {
                color: COLORS.primary
            }
        }}
        items={user.isAuthorized ? items : itemsGuest}
    />
})

const styles = StyleSheet.create({});



