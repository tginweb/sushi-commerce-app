import React from "react"
import {LoaderScreen as VendorLoaderScreen} from "react-native-ui-lib";
import {COLORS} from "~assets/design";

export type TProps = {
    message?: string
    overlay?: boolean
}

export const UiLoaderScreen: React.FC<TProps> = (
    {
        message = 'Загрузка',
        overlay
    }
) => {
    return !overlay ?
        <VendorLoaderScreen
            message={message}
            color={COLORS.grey40}
        />
        :
        <VendorLoaderScreen
            overlay={true}
            message={message}
            color={COLORS.grey40}
            containerStyle={{backgroundColor: 'rgba(200, 200, 200, 0.3)'}}
            messageStyle={{
                backgroundColor: '#FFFFFF',
                padding: 10
            }}
        />
};
