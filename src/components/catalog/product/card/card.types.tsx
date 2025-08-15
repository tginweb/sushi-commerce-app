import {ProductModel} from "@core/catalog/model/Product";
import {LayoutChangeEvent, StyleProp, ViewStyle} from "react-native";
import {TImageSize} from "@core/ui/types";
import {ViewProps} from "react-native-ui-lib";

export type TProductCardViewMode = 'list' | 'list_set' | 'grid' | 'slide' | 'detail' | 'mini' | 'offer'

export type TProductCardProps = {
    entity: ProductModel
    style?: StyleProp<ViewStyle>
    excludeFlags?: string[]
    imageSize?: TImageSize
    descriptionHide?: boolean
    visible?: boolean
    showTopbar?: boolean
    productOpenAllowSecondary?: boolean
    onPressBehavior?: 'basket' | 'product'
    onPress?: (product: ProductModel) => void
    onLayout?: (event: LayoutChangeEvent) => void
    containerStyle?: ViewStyle
    containerShadow?: boolean
    hideSale?: boolean
    //openProduct?: boolean
    onOpenProduct?: any
    titleNumberOfLines?: number
    descNumberOfLines?: number
}

export type TProductCardSaleProps = ViewProps & {
    entity: ProductModel
    onBasketAdd?: any
    onBasketQuantity?: any
    visible?: boolean
}

export type TUseProductProps = {
    entity: ProductModel
    giftsVisible?: boolean
    validateAdd?: any
    imageSize?: TImageSize
    visible?: boolean
    onOpenProduct?: () => void
    onPressBehavior?: 'basket' | 'product'
    onPress?: (product: ProductModel) => void
    excludeFlags?: string[]
    productOpenAllowSecondary?: boolean
}

export type TUseProductSaleProps = {
    entity: ProductModel
    onBasketAdd?: any
    onBasketQuantity?: any
    visible?: boolean
}
