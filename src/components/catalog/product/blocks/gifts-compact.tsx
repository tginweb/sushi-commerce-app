import React from "react"
import {StyleSheet} from "react-native"
import {UiOptions} from "~ui/options";
import {Text, View} from "react-native-ui-lib";
import {UiImage} from "~ui/image";
import {ProductModel} from "@core/catalog/model/Product";
import {ProductGift} from "~gql/api";

type TProps = {
    basketInputProps: any
    entity: ProductModel
    onSelect?: (id: string, gift: ProductGift) => void
    label?: string | null
    showLabel?: boolean
    prepend?: any
}

export const _ProductGiftsCompact: React.FC<TProps> = (props, ref) => {

    const {
        basketInputProps,
        entity,
        onSelect,
        label = 'Подарок',
        showLabel = true,
        prepend,
        ...rest
    } = props


    if (!entity.haveGifts)
        return <></>

    const items = entity.GIFTS

    return !!items && !!items.length &&
        <View
            row
            centerV
            style={{gap: 5, flexWrap: 'wrap'}}
            {...rest}
        >
            {prepend}
            {label && <Text text-sm-m>Подарок:</Text>}
            <UiOptions
                containerStyle={{
                    flexWrap: 'nowrap'
                }}
                preset={['chips']}
                itemPreset={['chip', 'chip_selected_outline']}
                itemProps={{
                    showMore: false,
                    withoutFeedback: true,
                    elementsStyle: {
                        container: {
                            paddingHorizontal: 4,
                            borderColor: '#FFFFFF'
                        }
                    }
                }}
                value={basketInputProps.GIFT}
                onChangeValue={onSelect}
                delimiter={() => <Text marginT-10 text-3xs-m>или</Text>}
                items={items.map((gift) => ({
                    value: gift.GIFT_ID,
                    data: gift,
                    label: showLabel ? gift.NAME : undefined,
                    icon: gift.IMAGE ? () => <UiImage
                        source={{uri: gift.IMAGE?.SRC}}
                        contentFit={'cover'}
                        height={30}
                        width={14}
                        style={{marginLeft: 4}}
                    /> : null
                }))}
            />
        </View>
}

const styles = StyleSheet.create({})

// @ts-ignore
export const ProductGiftsCompact = React.forwardRef(_ProductGiftsCompact)
