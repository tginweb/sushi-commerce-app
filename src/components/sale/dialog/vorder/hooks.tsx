import {useStores} from "~stores";
import {UiListItemProps} from "~ui/list-item";
import filterFields from "@core/main/util/base/filterFields";
import {Text, View} from "react-native-ui-lib";
import {formatTime} from "@core/main/util/date/formatTime";

export function useAttrsView() {

    const { vorder} = useStores()

    const payment = (() => {
        const res: UiListItemProps[] = []

        res.push({
            label: 'Способ оплаты',
            content: () => <View right>
                <Text>{vorder.currentPaymentType?.NAME}</Text>
                {vorder.attrValue['CASH_SUM'] &&
                    <Text text-sm-m-lh0 right>сдача с {vorder.attrValue['CASH_SUM']}</Text>}
            </View>
        })

        switch (vorder.benefitType) {
            case 'discount':
                if (vorder.discountBestBenefited)
                    res.push({
                        label: 'Скидка',
                        content: vorder.discountBestBenefited?.nameTemplatedShort,
                        contentTextPreset: ['text-md-bo', 'green10'],
                    })
                break
            case 'bonus':
                if (vorder.bonuses)
                    res.push({
                        label: 'Использовать бонусы',
                        contentTextPreset: ['text-md-bo', 'green10'],
                        content: vorder.bonusesWithText
                    })
                break
            case 'coupon':
                if (vorder.coupon)
                    res.push({
                        label: 'Использовать промокод',
                        contentTextPreset: ['text-md-bo', 'green10'],
                        content: vorder.coupon?.COUPON
                    })
                break
        }

        res.push({
            label: 'К оплате',
            content: vorder.pricePay,
            contentSuffix: ' ₽',
            contentTextPreset: ['text-md-bo'],
        })

        return filterFields(res)
    })()

    const delivery = (() => {
        const res: UiListItemProps[] = []
        if (vorder.isTransportCourier) {
            res.push({
                label: 'Адрес',
                content: vorder.getAddress(true),
                //contentWrap: true
            })
            res.push({
                label: 'Время доставки',
                content: formatTime({value: vorder.deliveryTimeDayjs}).datetimeFormatted
            })
        } else {
            res.push({
                label: 'Адрес',
                content: vorder.pickupDepartmentElement?.NAME,
            })
            res.push({
                label: 'Время самовывоза',
                content: formatTime({value: vorder.deliveryTimeDayjs}).datetimeFormatted
            })
        }
        return filterFields(res)
    })()

    const other = (() => {

        const res: UiListItemProps[] = []

        res.push({label: 'Номер телефона', content: vorder.attrValue.PHONE})

        res.push({label: 'Перезвонить для подтверждения', content: vorder.attrValue.WITH_OPERATOR === 'Y' ? 'Да' : 'Нет'})

        res.push({label: 'Количество приборов', content: vorder.personsNumber})

        if (vorder.attrValue.USER_DESCRIPTION)
            res.push({
                label: 'Комментарий к заказу', content: () => <Text
                    text-md-lh2>{vorder.attrValue.USER_DESCRIPTION}</Text>, contentWrap: true
            })

        return filterFields(res)
    })()

    return {
        delivery,
        payment,
        other
    }
}
