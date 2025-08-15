import React, {useImperativeHandle} from "react"
import {Text, View} from "react-native-ui-lib"
import {Section, TSectionProps} from "./section"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {TValidatableComponentHandle} from "@core/main/types"
import {COLORS} from "~assets/design"
import {UiBtn, UiBtnProps} from "~ui/btn"
import {icons} from "~assets/icons-map"

import {moderateScale} from "@core/main/lib/scale";

export const SectionCutleryInner: React.FC<TSectionProps> = (props, ref) => {
    const {vorder} = useStores()

    const sectionRef = React.useRef<TValidatableComponentHandle>()

    useImperativeHandle<any, any>(ref, () => sectionRef.current)

    const btnProps: UiBtnProps = {
        round: true,
        color: COLORS.grey20,
        outlineColor: COLORS.grey40,
        backgroundColor: COLORS.white,
        size: 'xSmall',
        diameter: moderateScale(29, 1)
    }

    return <Section
        dialogId={'cultery'}
        title={'Кол-во приборов'}
        icon={icons.cutlery}
        rules={vorder.rulesCutlery}
        value={vorder.personsNumber}
        ref={sectionRef}
        wrap={true}
        {...props}
    >
        <View row centerV marginT-3 style={{gap: 10}}>
            <UiBtn
                icon={icons.minus}
                onPress={() => vorder.setCulteryDec()}
                {...btnProps}
            />
            <Text>{vorder.personsNumber}</Text>
            <UiBtn
                icon={icons.plus}
                round={true} onPress={() => vorder.setCulteryInc()}
                {...btnProps}
            />
        </View>
    </Section>
}

// @ts-ignore
export const SectionCutlery = observer(React.forwardRef(SectionCutleryInner))
