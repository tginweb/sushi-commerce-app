import React from "react"
import {COLORS} from "~assets/design";
import {LoaderScreen, LoaderScreenProps} from "react-native-ui-lib";

export type UiLoadingProps = Omit<LoaderScreenProps, 'message'> & {
    preset: 'light' | 'fullscreen' | 'bus'
    message?: string | null
    opacity?: number
}

export const UiLoadingComponent: React.FC<UiLoadingProps> = (props, ref) => {

    const {
        preset,
        message = 'Загрузка',
        ...rest
    } = props

    switch (preset) {
        case 'bus': {
            const {
                opacity = 0.7,
            } = props
            const presetProps: UiLoadingProps = {
                ...props,
                color: COLORS.primary,
                messageStyle: {
                    backgroundColor: COLORS.white,
                    borderRadius: 12,
                    overflow: 'hidden',
                    borderColor: COLORS.colorAspid,
                    borderWidth: 1,
                    padding: 10,
                    fontWeight: '600',
                    color: COLORS.colorAspid,
                },
                containerStyle: {
                    backgroundColor: 'rgba(255, 255, 255, ' + opacity + ')'
                },
                style: {}
            }
            return <LoaderScreen
                overlay={true}
                message={message as string}
                {...presetProps as LoaderScreenProps}
            />
            break
        }
        case "fullscreen": {
            const {
                opacity = 0.2,
            } = props
            return <LoaderScreen
                overlay={true}
                message={message as string}
                color={COLORS.primary}
                messageStyle={{fontWeight: '600', color: COLORS.grey20}}
                containerStyle={{
                    backgroundColor: 'rgba(255, 255, 255, ' + opacity + ')',
                    overflow: 'hidden',
                }}
                {...rest}
            />
            break
        }
        case "light": {
            const {
                opacity = 0.4,
            } = props
            return <LoaderScreen
                overlay={true}
                message={message as string}
                color={COLORS.grey40}
                containerStyle={{
                    backgroundColor: 'rgba(255, 255, 255, ' + opacity + ')',
                    overflow: 'hidden'
                }}
                {...rest}
            />
            break
        }
    }
}

// @ts-ignore
export const UiLoading = React.forwardRef(UiLoadingComponent)
