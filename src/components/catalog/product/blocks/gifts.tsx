import React, {useImperativeHandle} from "react"
import {StyleSheet} from "react-native"
import {TValidatableComponentHandle, TValidateMode} from "@core/main/types"
import {validateRefs, validateResultArray} from "@core/main/util/validate/validateRefs"
import {UiOptions} from "~ui/options";
import {Text, View} from "react-native-ui-lib";
import {UiImage} from "~ui/image";
import {ProductModel} from "@core/catalog/model/Product";
import {ProductGift} from "~gql/api";

type TProps = {
    basketInputProps: any
    entity: ProductModel
    onSelect?: (id: string, gift: ProductGift) => void
    label?: string | boolean
    showLabel?: boolean
    prepend?: any
}

export const _ProductGifts: React.FC<TProps> = (props, ref) => {

    const {
        entity,
        onSelect,
        label = 'Подарок:',
        showLabel = true,
        basketInputProps,
        prepend,
        ...rest
    } = props

    useImperativeHandle<any, TValidatableComponentHandle>(ref, () => ({
        validate: methods.validate,
        validateReset: () => true
    }))

    const methods = {
        validate: (mode: TValidateMode) => {
            return validateResultArray(validateRefs(refs, mode, 'first'))
        }
    }

    const refs = {
        gift: React.useRef(),
    }

    if (!entity.haveGifts)
        return <></>

    const items = entity.GIFTS

    return !!items && !!items.length &&
        <View
            row
            centerV
            style={{gap: 9, flexWrap: 'wrap'}}
            {...rest}
        >
            {prepend}
            {label && <Text text-sm-m primary>{label}</Text>}
            <UiOptions
                preset={['chips']}
                itemPreset={['chip', 'chip_selected_outline']}
                itemProps={{
                    showMore: false,
                    withoutFeedback: true
                }}
                containerStyle={{
                    flexWrap: 'nowrap'
                }}
                onChangeValue={onSelect}
                value={basketInputProps.GIFT}
                delimiter={() => <Text marginT-6 text-xs>или</Text>}
                items={items.map((gift) => ({
                    value: gift.GIFT_ID,
                    data: gift,
                    label: showLabel ? gift.NAME : undefined,
                    icon: gift.IMAGE ? () => <UiImage
                        source={{uri: gift.IMAGE?.SRC}}
                        contentFit={'cover'}
                        height={30}
                        width={14}
                        style={{marginLeft: 3}}
                    /> : null
                }))}
            />
        </View>
}

const styles = StyleSheet.create({})

// @ts-ignore
export const ProductGifts = React.forwardRef(_ProductGifts)
