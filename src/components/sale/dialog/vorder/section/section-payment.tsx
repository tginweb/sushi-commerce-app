import React, {useImperativeHandle} from "react"
import {Text} from "react-native-ui-lib"
import {Section, styles as sectionStyles, TSectionProps} from "./section"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {TValidatableComponentHandle} from "@core/main/types"
import {icons, TIconNames} from "~assets/icons-map"

export const SectionPaymentInner: React.FC<TSectionProps> = (props, ref) => {

    const sectionRef = React.useRef<TValidatableComponentHandle>()

    useImperativeHandle<any, any>(ref, () => sectionRef.current)

    const {vorder} = useStores();

    const icon = vorder.currentPaymentType ? icons[vorder.currentPaymentType.ICON as TIconNames] : icons.payment_card

    return (
        <Section
            dialogId={'payment'}
            title={'Оплата'}
            icon={icon}
            wrap={true}
            validate={() => vorder.vorderValidate('payment')}
            validateResult={vorder.validateResult.payment}
            value={vorder.attrValue['PAYMENT_TYPE']}
            ref={sectionRef}
            {...props}
        >
            <Text style={sectionStyles.content}>
                {vorder.summaryPayment}
            </Text>
            {
                vorder.attrValue['PAYMENT_TYPE'] === 'cash' && !!vorder.attrValue['CASH_SUM'] &&
                <Text text-3xs-r-lh0>
                    {vorder.attrValue['CASH_SUM'] === 'equal' ? 'без сдачи' : 'сдача с ' + vorder.attrValue['CASH_SUM'] + '₽'}
                </Text>
            }
        </Section>
    )
}

// @ts-ignore
export const SectionPayment = observer(React.forwardRef(SectionPaymentInner))
