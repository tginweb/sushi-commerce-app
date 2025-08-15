import React from "react"
import {StyleSheet} from "react-native"
import {ViewProps} from "react-native-ui-lib";
import {ProductModel} from "@core/catalog/model/Product";
import {UiTransitionView} from "~ui/transition/view";
import {UiMessage} from "~ui/message";
import {TMessage} from "@core/main/types";

type TProps = ViewProps & {
    entity: ProductModel
    error: any
    errorSafe: any
}

export const ProductErrors: React.FC<TProps> = (props) => {

    const {
        entity,
        error,
        errorSafe,
        ...rest
    } = props

    return <UiTransitionView
        preset={'message'}
        visible={!!error}
        {...rest}
    >
        <UiMessage
            message={errorSafe as TMessage}
            preset={['outline', 'dense']}
        />
    </UiTransitionView>
}

const styles = StyleSheet.create({})

