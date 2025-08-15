import React, {useImperativeHandle} from "react"
import {Text, View} from "react-native-ui-lib"
import {Section, TSectionProps} from "./section"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {TValidatableComponentHandle} from "@core/main/types"

export const SectionDiscountInner: React.FC<TSectionProps> = (props, ref) => {
    const {vorder} = useStores()

    const valueComp = vorder.personsNumber
    const sectionRef = React.useRef<TValidatableComponentHandle>()

    useImperativeHandle<any, any>(ref, () => sectionRef.current)

    return vorder.discountBestBenefited && <Section
        dialogId={'benefit'}
        rules={vorder.rulesCutlery}
        value={valueComp}
        ref={sectionRef}
        outline={true}
        {...props}
    >
        {!!vorder.discountBestBenefited &&
            <View centerV centerH style={{gap: 10}}>
                <Text
                    text-sm-lh0
                    center
                    style={{width: '100%', textAlign: 'center'}}
                >
                    {vorder.discountBestBenefited.getTemplatedReact(
                        'NAME_TEMPLATE',
                        (v) => <Text text-sm-bo-lh0 key={1}>{v}</Text>
                    )}
                </Text>
            </View>
        }
    </Section>
}

// @ts-ignore
export const SectionDiscount = observer(React.forwardRef(SectionDiscountInner))
