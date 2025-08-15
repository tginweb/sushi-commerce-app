import React from "react"

import {Text, View} from "react-native-ui-lib"
import {StyleSheet} from "react-native"
import {useStores} from "~stores"
import {observer} from "mobx-react"
import {useServices} from "~services"
import {OrderModel} from "@core/sale/model/Order"
import StepIndicator from "react-native-step-indicator";
import {TOrderStatusExtended} from "~com/sale/screen/order/index.types";
import {COLORS} from "~assets/design";

type TProps = {
    order: OrderModel
    currentStatusIndex: number
    statuses: TOrderStatusExtended[]
}

export const OrderStatuses: React.FC<TProps> = observer((
    {
        order,
        currentStatusIndex,
        statuses
    }
) => {

    const {} = useStores();
    const {} = useServices();

    return (
        <StepIndicator
            customStyles={{
                stepIndicatorSize: 25,
                currentStepIndicatorSize: 30,
                separatorStrokeWidth: 2,
                currentStepStrokeWidth: 3,
                stepStrokeCurrentColor: COLORS.green30,
                stepStrokeWidth: 3,
                stepStrokeFinishedColor: '#fe7013',
                stepStrokeUnFinishedColor: '#aaaaaa',
                separatorFinishedColor: '#fe7013',
                separatorUnFinishedColor: '#aaaaaa',
                stepIndicatorFinishedColor: '#fe7013',
                stepIndicatorUnFinishedColor: '#ffffff',
                stepIndicatorCurrentColor: '#ffffff',
                stepIndicatorLabelFontSize: 13,
                currentStepIndicatorLabelFontSize: 13,
                stepIndicatorLabelCurrentColor: COLORS.green30,
                stepIndicatorLabelFinishedColor: '#ffffff',
                stepIndicatorLabelUnFinishedColor: '#aaaaaa',
                labelColor: '#999999',
                labelSize: 15,
                labelFontFamily: 'ttr',
                currentStepLabelColor: COLORS.green30,
            }}
            currentPosition={currentStatusIndex}
            stepCount={statuses.length}
            direction={'vertical'}
            labels={statuses.map(status => status.NAME || '')}
            renderLabel={(data) => {
                return <View style={{width: '100%'}} paddingV-15 paddingL-10>
                    <Text text-md-lh0>{data.label}</Text>
                </View>
            }}
        />
    )
})

const styles = StyleSheet.create({});
