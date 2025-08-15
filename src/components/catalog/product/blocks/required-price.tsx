import React from "react"
import {StyleSheet} from "react-native"
import {Text, ViewProps} from "react-native-ui-lib";
import {ProductModel} from "@core/catalog/model/Product";
import {useServices} from "~services";
import {SPACE} from "~assets/design";

type TProps = ViewProps & {
    entity: ProductModel,
}

export const ProductRequiredPrice: React.FC<TProps> = (props) => {

    const {
        entity,
        ...rest
    } = props

    const {catalogUtil} = useServices()

    return !!entity.REQUIRED_MIN_PRICE &&
        <Text text-sm-lh1 primaryLight {...rest}>
            При заказе от
            <Text text-sm-bo-lh1 primaryLight>{SPACE}{catalogUtil.formatPriceCurrency(entity.REQUIRED_MIN_PRICE)}</Text>
        </Text>
}

const styles = StyleSheet.create({})

