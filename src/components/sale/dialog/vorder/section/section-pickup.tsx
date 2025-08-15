import React, {useCallback, useImperativeHandle, useMemo} from "react"
import {Text} from "react-native-ui-lib"
import {Section, styles as sectionStyles, TSectionProps} from "./section"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {TValidatableComponentHandle} from "@core/main/types"
import {StyleSheet} from "react-native"
import {icons} from "~assets/icons-map"
import {COLORS} from "~assets/design"
import {UiBtn} from "~ui/btn";

export const SectionPickupInner: React.FC<TSectionProps> = (props, ref) => {
    const {vorder} = useStores()

    const sectionRef = React.useRef<TValidatableComponentHandle>()

    useImperativeHandle<any, any>(ref, () => sectionRef.current)

    const sideSlot = useMemo(() => vorder.pickupDepartmentElement && <UiBtn
        icon={icons.nav}
        iconSize={23}
        link={true}
        color={COLORS.primary}
        onPress={() => vorder.vorderDialogOpen('pickup', {viewmode: 'map'})}
        marginT-4
        marginR-6
    />, [vorder.pickupDepartmentElement])

    const validate = useCallback(() => vorder.vorderValidate('pickup'), [])

    return <Section
        dialogId={'pickup'}
        title={'Адрес самовывоза'}
        icon={icons.deliveryPickup}
        sideSlot={sideSlot}
        validate={validate}
        validateResult={vorder.validateResult.pickup}
        wrap={true}
        value={vorder.pickupDepartmentElement}
        ref={sectionRef}
        {...props}
    >
        <Text style={sectionStyles.content}>{vorder.summaryPickup}</Text>
    </Section>
}

// @ts-ignore
export const SectionPickup = observer(React.forwardRef(SectionPickupInner))


const styles = StyleSheet.create({});
