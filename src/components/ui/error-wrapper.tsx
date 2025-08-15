import React, {PropsWithChildren} from "react"
import {View} from "react-native-ui-lib"
import {TMessage, TPresetName} from "@core/main/types";
import {UiMessage} from "~ui/message";
import {ErrorProvider} from "@core/main/lib/provider/error";

export type UiErrorWrapperProps = PropsWithChildren<{
    error: TMessage
    preset?: TPresetName
    position?: 'prepend' | 'append'
}>

export const UiErrorWrapper: React.FC<UiErrorWrapperProps> = (props) => {
    const {
        error,
        position = 'prepend',
        preset,
        children,
        ...rest
    } = props

    return <ErrorProvider value={{error: error}}>
        <View {...rest}>
            {
                error && position === 'prepend' && <UiMessage
                    message={error}
                    preset={preset}
                />
            }
            {children}
            {
                error && position === 'append' && <UiMessage
                    message={error}
                    preset={preset}
                />
            }
        </View>
    </ErrorProvider>
}
