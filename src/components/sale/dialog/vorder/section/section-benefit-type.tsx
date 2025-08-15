import React, {useImperativeHandle, useMemo, useState} from "react"
import {TSectionProps} from "./section"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {TValidatableComponentHandle} from "@core/main/types"
import {Text, View} from "react-native-ui-lib";
import {useWatch} from "@core/main/lib/hooks/useWatch";
import {UiOptions} from "~ui/options";
import {UiListItemProps} from "~ui/list-item";
import {COLORS} from "~assets/design";
import {iconResolve} from "~ui/icon-resolver";

export const SectionBenefitTypeInner: React.FC<TSectionProps & { showCaption?: boolean }> = (props, ref) => {

    const {vorder} = useStores()

    const {
        value,
        showCaption = true,
        ...rest
    } = props

    const benefitTypes = vorder.benefitTypes.slice(0, 3)

    const sectionRef = React.useRef<TValidatableComponentHandle>()

    const [benefitTypeState, setBenefitTypeState] = useState(() => vorder.benefitType)

    useWatch(() => {
        setTimeout(() => {
            setBenefitTypeState(vorder.benefitType)
        }, 300)
    }, [vorder.benefitType])

    const optionLabelProps = useMemo<any>(() => benefitTypes.length > 3 ? {
        'text-xs-m-lh0': true
    } : {
        'text-xs-m-lh0': true
    }, [benefitTypes.length])

    const options: UiListItemProps[] = useMemo(() =>
        benefitTypes.map(item => {
            return {
                label: () => {
                    return <View gap-5 >

                        <View centerH>
                            <View row>
                                {iconResolve(item.ICON, {size: 17, color: benefitTypeState === item.VALUE ? COLORS.primary : '#2c525d'})}
                            </View>
                        </View>

                        <Text
                            style={{
                                color: benefitTypeState === item.VALUE ? COLORS.primary : '#2c525d'
                            }}
                            {...optionLabelProps}
                            center
                        >{item.NAME}</Text>
                    </View>
                },
                value: item.VALUE,
            }
        }), [benefitTypes, benefitTypeState, optionLabelProps])

    const optionsRendered = useMemo(() => <UiOptions
        items={options}
        value={benefitTypeState}
        onBeforeChange={(option) => {
            vorder.vorderDialogOpen('benefit', {benefitType: option.value})
            return false
        }}
        onChange={(option) => {
            setBenefitTypeState(option.value)
            vorder.setBenefitType(option.value)
        }}
        itemProps={{
            showMore: false,
            elementsStyle: {
                container: {
                    flexGrow: 1
                }
            }
        }}
        itemPreset={['switchOptions']}
        preset={['switchOptions']}
    />, [options, benefitTypeState])

    useImperativeHandle<any, any>(ref, () => sectionRef.current)

    return <View {...rest}>
        {showCaption && (options.length > 1) &&
            <Text marginB-8 text-3xs-r-lh1 center grey30>можно использовать один из вариантов:</Text>}
        {optionsRendered}
    </View>
}

// @ts-ignore
export const SectionBenefitType = observer(React.forwardRef(SectionBenefitTypeInner))
