import {action, makeObservable} from "mobx"
import {OrderProfileModel} from "@core/sale/model/OrderProfile"
import DialogStore from "@core/main/lib/store/dialog";
import {TCommonDialogProps} from "@core/main/types";
import {OrderProfile} from "~gql/api";

export type TDeliveryEditDialogProps = TCommonDialogProps & {
    isStartup?: boolean
    cntHolder: {
        cnt: number
    }
    profile?: OrderProfileModel
    onSaved?: (profile: OrderProfileModel, action: 'save' | 'create') => void
    onDeleted?: (profile: OrderProfileModel) => void
}

export class DeliveryEditDialogStore extends DialogStore<TDeliveryEditDialogProps> {

    constructor() {
        super()
        makeObservable(this)
    }

    @action
    open(props: Partial<TDeliveryEditDialogProps> = {}) {

        let profile = props.profile || this.stores().vorder.profile || this.stores().sale.getUserDefaultProfile()

        if (!profile)
            profile = new OrderProfileModel({} as OrderProfile)

        profile = profile.ID ? profile.getClone(true) : profile

        this.show({
            ...props,
            cntHolder: {
                cnt: 0
            },
            profile
        })
    }
}

export default DeliveryEditDialogStore
