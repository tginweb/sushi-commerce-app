import {action, computed, makeObservable, observable} from "mobx"
import {CompanyOffice} from "~gql/api"
import {CompanyOfficeModel} from "@core/company/model/CompanyOffice"
import {TCompanyOfficeModalProps} from "~com/company/dialog/office-modal";
import CommonStore from "@core/main/lib/store/common";
import {classComputedPropsCache} from "@core/main/lib/mobx/class-computed-props-cache";
import {task} from "@core/main/lib/decorator/task";
import API_OFFICE_LIST, {TCompanyOfficeListTask} from "../gql/query/office_list";
import {strip_tags} from "locutus/php/strings";

export class CompanyStore extends CommonStore {

    offices: CompanyOfficeModel[] = []

    @observable
    officeModal: {
        visible: boolean,
        office?: CompanyOfficeModel | null,
        params: TCompanyOfficeModalProps
    } = {
        visible: false,
        office: null,
        params: {
            showMap: false
        }
    }

    constructor() {
        super()
        makeObservable(this)
    }

    init() {
        this.disposers = classComputedPropsCache(this, [])
    }

    @action
    SCOPE_APP(data: any) {
        if (data.offices)
            this.offices = data.offices.map((element: CompanyOffice) => new CompanyOfficeModel(element))
    }

    @action
    showOfficeModal(office: CompanyOfficeModel, params: TCompanyOfficeModalProps = {showMap: true}) {
        this.officeModal.visible = true
        this.officeModal.office = office
        this.officeModal.params = params
    }

    @action
    hideOfficeModal() {
        this.officeModal.visible = false
        this.officeModal.office = null
    }

    @task
    queryOfficeList = ((variables) => {
        return API_OFFICE_LIST.request({variables}, {throwError: false})
    }) as TCompanyOfficeListTask

    @computed
    get officesPickup() {
        return this.offices.filter(office => office.ROLES?.includes('pickup'))
    }
}

export default CompanyStore
