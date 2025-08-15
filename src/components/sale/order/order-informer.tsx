import React from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {OrderModel} from "@core/sale/model/Order"

type TProps = {
    order: OrderModel
}

export const OrderInformer: React.FC<TProps> = observer(({order}) => {

    return <></>
})

const styles = StyleSheet.create({});
