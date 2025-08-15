import React, {useImperativeHandle} from "react"
import {Section, styles as sectionStyles, TSectionProps} from "./section"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {TValidatableComponentHandle} from "@core/main/types"
import {StyleSheet} from "react-native"
import {icons} from "~assets/icons-map"
import {UiTimeView} from "~ui/time-view";

export const SectionTimeInner: React.FC<TSectionProps> = (props, ref) => {
    const {vorder} = useStores()

    const sectionRef = React.useRef<TValidatableComponentHandle>()

    useImperativeHandle<any, any>(ref, () => sectionRef.current)

    const openCallback = () => {
        //sectionRef.current?.validateReset()
        if (vorder.deliveryFieldsEnough) {
            //bus.emitter.emit('vorder.section.validate', 'delivery')
            //return false
            vorder.vorderDialogOpen('time')
        } else {
            vorder.vorderValidate('pickup')
        }
    }

    return (
        <Section
            dialogId={'time'}
            openCallback={openCallback}
            loading={vorder.apiMutateReserve.pending}
            title={vorder.timeModeNearest ? 'Ближайшее время' : 'Выбранное время'}
            icon={icons.clock}
            wrap={true}
            validate={() => vorder.vorderValidate('time')}
            validateResult={vorder.validateResult.time}
            ref={sectionRef}
            value={vorder.deliveryDateTimeStr}
            {...props}
        >
            <UiTimeView
                value={vorder.deliveryTimeDayjs}
                valueFormat={'object'}
                placeholder={'выбрать время'}
                textStyle={sectionStyles.content}
            />
        </Section>
    )
}


// @ts-ignore
export const SectionTime = observer(React.forwardRef(SectionTimeInner))


const styles = StyleSheet.create({});
