import DialogStore from "@core/main/lib/store/dialog";
import {TCommonDialogProps, TValidateErrors, TValidateMode} from "@core/main/types";
import {action, makeObservable} from "mobx";
import VorderStore from "@core/sale/store/vorder/index";

export class VorderSectionDialogStore<T extends TCommonDialogProps> extends DialogStore<T> {

    vorder: VorderStore

    constructor(vorder: VorderStore) {
        super()
        makeObservable(this)
        this.vorder = vorder
    }

    @action
    onHide() {
        this.vorder.openedDialogCode = null
    }

    dialogCloseValidate() {
        return true
    }

    validate(mode?: TValidateMode, errorsCollector?: TValidateErrors) {

        /*
            if (rules && rules.length) {

                const res = testRules('first', rules, value, errorsCollector)

                if (res === true) {
                    setHaveError(false)
                    setErrorMessages(null)
                } else {
                    setHaveError(true)
                    setErrorMessages(res)
                }

                return res
            }

            return true

         */
    }



    onClose(fromDismiss?: boolean) {

        let valid: any = true

        if (!!this.dialogCloseValidate) {
            if (this.dialogCloseValidate()) {
                valid = this.validate()
            } else {
                valid = this.dialogCloseValidate()
            }
        }

        /*
        if (!dialogActionsCloseValidRequired || valid === true) {
            setDialogVisible(false)
            onClose && onClose(valid)
        }

        if (fromDismiss) {
            setDialogVisible(false)
        }
         */
    }
}

export default VorderSectionDialogStore
