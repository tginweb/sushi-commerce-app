import React, {useMemo} from "react"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {useServices} from "~services";
import {UiMessage} from "~ui/message";
import {TMessage} from "@core/main/types";
import {timestampToFormat} from "@core/main/util/date"

interface TProps {
    onTimeRecheck?: () => void,
    onTimeSelect?: (time: any) => void,
    dense?: boolean,
    preset?: any
}

export const TimeResultMessageInner: React.FC<TProps> = (
    props: TProps,
    ref
) => {
    const {vorder} = useStores()
    const {} = useServices()

    const {
        onTimeRecheck,
        onTimeSelect,
        dense,
        preset
    } = props

    vorder.validateResult.time

    const message = useMemo(() => {

        const res: TMessage = {}

        res.code = vorder.deliveryRequest.result.status

        if (vorder.deliveryRequest.result.success) {
            if (vorder.deliveryRequestReserveActual) {
                res.type = 'success'
                res.message = 'время свободно'
            } else {
                res.type = 'info'
                res.message = 'необходимо проверить время'
            }
        } else if (vorder.deliveryRequest.result.status === 'time_busy') {
            res.type = 'error'
            res.message = dense ? 'время занято' : 'Время занято, выбрать ближайшее:'
            res.actionsInline = false
            if (!dense) {
                res.actionsProps = {
                    outline: false,
                    //themeColor: colors.primary
                }
                res.actions = [
                    {
                        label: timestampToFormat(vorder.deliveryRequest.result.timeAvailable, 'datetime'),
                        onPress: () => onTimeSelect && onTimeSelect(vorder.deliveryRequest.result.timeAvailable),
                    }
                ]
            }
        } else if (vorder.deliveryRequest.result.status === 'service_unavailable') {
            res.type = 'error'
            res.message = 'сервис временно недоступен'
        } else {
            res.type = 'info'
            res.message = dense ? 'не проверено' : 'время не проверено'
            res.actionsProps = {
                outline: false,
            }
            res.actionsInline = false
        }

        return res
    }, [vorder.deliveryRequest, vorder.deliveryRequestReserveActual])

    return (
        <UiMessage
            message={message}
            preset={dense ? ['flat', 'dense'] : ['outline']}
        />
    )
}


// @ts-ignore
export const TimeResultMessage = observer(React.forwardRef(TimeResultMessageInner))


