import React, {useCallback, useImperativeHandle} from "react"
import {Section, styles as sectionStyles, TSectionProps} from "./section"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {TValidatableComponentHandle} from "@core/main/types"
import {Switch, Text, View} from "react-native-ui-lib";
import {COLORS} from "~assets/design";

export const SectionOperatorInner: React.FC<TSectionProps> = (props, ref) => {

    const sectionRef = React.useRef<TValidatableComponentHandle>()

    useImperativeHandle<any, any>(ref, () => sectionRef.current)

    const {vorder} = useStores();

    const onChange = useCallback((v?: boolean) => {
        if (typeof v !== 'undefined') {
            vorder.setPropValue('WITH_OPERATOR', v ? 'Y' : 'N')
        } else {
            vorder.setPropValue('WITH_OPERATOR', vorder.attrValue['WITH_OPERATOR'] !== 'Y' ? 'Y' : 'N')
        }
    }, [vorder.attrValue['WITH_OPERATOR']])

    return (
        <Section
            title={''}
            //icon={icons.phone}
            wrap={false}
            value={vorder.attrValue['WITH_OPERATOR']}
            ref={sectionRef}
            onOpen={() => onChange()}
            {...props}
        >
            <View
                row
                centerV
                style={{flexWrap: 'nowrap'}}
            >
                <View marginR-10>
                    <Switch
                        onColor={COLORS.primary}
                        width={30}
                        height={20}
                        thumbSize={14}
                        value={vorder.attrValue.WITH_OPERATOR === 'Y'}
                        onValueChange={onChange}
                    />
                </View>
                <Text text-sm-lh1 flex style={sectionStyles.content}>
                    {vorder.attrValue.WITH_OPERATOR === 'Y' ? 'Перезвонить Вам для подтвержения' : 'НЕ звонить Вам для подтверждения'}
                </Text>
            </View>
        </Section>
    )
}

// @ts-ignore
export const SectionOperator = observer(React.forwardRef(SectionOperatorInner))
