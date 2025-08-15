import React, {useCallback, useImperativeHandle} from "react"
import {Text} from "react-native-ui-lib"
import {Section, styles as sectionStyles, TSectionProps} from "./section"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {TValidatableComponentHandle, TValidateRules} from "@core/main/types"
import {StyleSheet} from "react-native"
import {icons} from "~assets/icons-map"

export const SectionDeliveryInner: React.FC<TSectionProps> = (props, ref) => {

    const sectionRef = React.useRef<TValidatableComponentHandle>()

    useImperativeHandle<any, any>(ref, () => sectionRef.current)

    const {vorder, profileDialog} = useStores();

    const rules: TValidateRules = vorder.rulesDelivery

    const openCallback = useCallback(() => profileDialog.show({
        context: 'vorder',
        profileId: vorder.profileId,
        onCloseOnce: () => {
            vorder.vorderValidate('delivery')
        }
    }), [])

    const validate = useCallback(() => {
        return vorder.vorderValidate('delivery')
    }, [])

    return (
        <Section
            dialogId={'delivery'}
            icon={icons.home}
            title={'Адрес доставки'}
            wrap={true}
            rules={rules}
            ref={sectionRef}
            value={vorder.attrValue.ADDRESS}
            validate={validate}
            validateResult={vorder.validateResult.delivery}
            openCallback={openCallback}
            {...props}
        >
            <Text style={sectionStyles.content}>{vorder.summaryDelivery}</Text>
        </Section>
    )
}

// @ts-ignore
export const SectionDelivery = observer(React.forwardRef(SectionDeliveryInner))

const styles = StyleSheet.create({});
