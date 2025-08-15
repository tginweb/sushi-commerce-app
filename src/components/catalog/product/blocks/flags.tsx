import React from "react"
import {StyleSheet} from "react-native"
import {Text, View, ViewProps} from "react-native-ui-lib";
import {ProductModel} from "@core/catalog/model/Product";
import {ProductFlag} from "~gql/api";

type TProps = ViewProps & {
    entity?: ProductModel
    itemProps?: ViewProps
    dense?: boolean
    exclude?: string[]
    flags?: ProductFlag[]
    detail?: boolean
}

export const ProductFlags: React.FC<TProps> = React.memo((props) => {

    const {
        entity,
        itemProps = {},
        dense,
        exclude,
        flags,
        detail = false,
        ...rest
    } = props

    const _flags = flags || (entity ? entity.getFlags(exclude) : [])

    return !!_flags.length && <View {...rest} >
        {_flags.map(flag =>
            <View
                key={flag.NAME}
                {...itemProps}
                style={[
                    {backgroundColor: flag.COLOR_HEX,},
                    styles.flag,
                    itemProps.style,
                    styles.flagCommon
                ]}
            >
                <Text {...{[(detail ? flag.MOBILE_TEXT_CLASS_DETAIL : flag.MOBILE_TEXT_CLASS)  || 'text-xs-lh0']: true}} white>{dense ? flag.NAME_SHORT : flag.NAME}</Text>
            </View>
        )}
    </View>
})

const styles = StyleSheet.create({
    flag: {
        paddingHorizontal: 5,
        paddingVertical: 2
    },
    flagCommon: {
        borderRadius: 7,
    }
})

