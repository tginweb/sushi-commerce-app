import React, {useImperativeHandle} from "react"
import {StyleSheet} from "react-native"
import {View, ViewProps} from "react-native-ui-lib"
import {ContentBuilder} from "~ui/content-builder/Builder";
import {TValidatableComponentHandle, TValidateErrors, TValidateMode} from "@core/main/types";
import {UiDatePublicMethods} from "~ui/date";
import {observer} from "mobx-react";

export type UiContentBuilderProps = ViewProps & {
    builder: ContentBuilder
}

export type UiContentPublicMethods = TValidatableComponentHandle & {}

const UiContentBuilderComponent: React.FC<UiContentBuilderProps> = (props, ref) => {

    const {
        children,
        builder,
        ...rest
    } = props

    useImperativeHandle<any, UiDatePublicMethods>(ref, () => ({
        validate: validate,
        validateReset: validateReset,
    }))

    const validate = (mode?: TValidateMode, errorsCollector?: TValidateErrors) => {
        const errors: TValidateErrors = []
        if (builder.inited)
            builder.validate(errors)
        return errors
    }

    const validateReset = () => {

    }

    return (
        <View
            {...rest}
            key={builder.version}
        >
            {builder.inited && builder.render()}
        </View>
    )
}

// @ts-ignore
export const UiContentBuilder = observer(React.forwardRef<UiContentPublicMethods, UiContentBuilderProps>(UiContentBuilderComponent))

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        height: 200
    },
});

