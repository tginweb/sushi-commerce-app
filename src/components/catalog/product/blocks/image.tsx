import React from "react"
import {StyleSheet} from "react-native"
import {ProductModel} from "@core/catalog/model/Product";
import {UiImage, UiImageProps} from "~ui/image";
import {TImageSize} from "@core/ui/types";

type TProps = UiImageProps & {
    entity: ProductModel
    imageSize?: TImageSize
}

export const ProductImage: React.FC<TProps> = (props) => {
    const {
        entity,
        imageSize = 200,
        ...rest
    } = props
    return <UiImage
        source={entity.imageSrcRequired}
        contentFit={'contain'}
        alt={'alt'}
        vendor={'expo'}
        {...rest}
    />
}

const styles = StyleSheet.create({})

