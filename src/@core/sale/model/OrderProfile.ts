import {action, computed, makeObservable, observable, runInAction, toJS} from "mobx"
import {UiAddressInputOption} from "~ui/address-input";
import {OrderableModel} from "@core/sale/model/Orderable";
import {graphql} from "~services";
import {GeoCoordinates} from "@core/geo/class/GeoCoordinates";
import {GeoObject, OrderAttr, OrderProfile} from "~gql/api";
import {createViewModel} from "mobx-utils";
import {logComputed} from "@core/main/lib/mobx/log-computed";
import API_SAVE from "@core/sale/gql/mutation/profile_save"

export class OrderProfileModel extends OrderableModel {

    @observable
    ID: number = 0

    @observable
    NAME: string = ''

    @observable
    USER_ID: number = 0

    @observable
    PERSON_TYPE_ID: number = 0

    @observable
    IS_DEFAULT?: boolean

    @observable
    DELIVERY_FREE_FROM_PRICE: number = 0

    @observable
    ATTRS: OrderAttr[] = []

    constructor(data: OrderProfile) {
        super()
        this.assign(data)
        this.indexAttrs(this.ATTRS)
        makeObservable(this)
    }

    @action
    assign(data: OrderProfile) {
        Object.assign(this as any, data)
    }

    getClone(viewModel = false) {
        const model = new OrderProfileModel(toJS(this))
        return viewModel ? createViewModel(model) : model
    }

    @action
    setAttrValue(type: string, code: string, value: any) {

        let attr = this.ATTRS.find(item => item.CODE === code && item.ATTR_TYPE === type)

        if (!attr) {
            attr = {
                ATTR_TYPE: type,
                CODE: code,
                VALUE: value
            }
            this.ATTRS.push(attr)
            this.attr[code] = attr
        }

        attr.VALUE = value

        this.attrValue[code] = value
    }

    @action
    setPropValue(code: string, value: any) {
        this.setAttrValue('prop', code, value)
    }

    @action
    setPropValues(props: object) {
        for (const [code, value] of Object.entries(props)) {
            this.setPropValue(code, value)
        }
    }

    @action
    onChangeAddressValue(option: UiAddressInputOption) {
        this.setPropValues(this.addressOptionToAttrs(option))
    }

    @action
    onChangeAddressMap(data: GeoObject) {
        this.setPropValues(this.addressMapToAttrs(data))
    }

    @action
    clearAddress() {
        this.setPropValues(this.addressMapToAttrs({}))
    }

    @action
    async setDefault() {
        try {

            await graphql.mutateWrapped({
                mutation: require('@core/sale/gql/mutation/profile_default').default,
                variables: {
                    id: this.ID,
                    personTypeId: this.PERSON_TYPE_ID
                }
            })

            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    @action
    async save(updateSelf: boolean = false) {
        try {
            const resProfile = await API_SAVE.request({
                variables: {
                    id: this.ID,
                    attrs: this.getAttrValuesMap()
                }
            }, {
                throwError: true
            })
            if (resProfile) {
                if (updateSelf || !this.ID) {
                    runInAction(() => {
                        this.assign(resProfile)
                        this.indexAttrs(this.ATTRS)
                    })
                    return new OrderProfileModel(resProfile)
                } else {
                    return this
                }
            }
        } catch (e) {
            console.log(e)
            return false
        }
    }

    @action
    async delete() {
        try {
            await graphql.mutateWrapped({
                mutation: require('@core/sale/gql/mutation/profile_delete').default,
                variables: {
                    id: this.ID,
                }
            })
            return true
        } catch (e) {
            return false
        }
    }

    @computed
    get mapCoords(): GeoCoordinates | undefined {
        logComputed(this, 'mapCoords')
        const coordsStr = this.attrValue['HOUSE_COORDS'] || this.attrValue['STREET_COORDS']
        if (coordsStr) {
            return new GeoCoordinates(coordsStr)
        }
    }

    @computed
    get addressToHouse(): string {
        logComputed(this, 'addressToHouse')
        let res = this.attrValue['ADDRESS']
        return res
    }

    @computed
    get isPrivateHouse() {
        logComputed(this, 'isPrivateHouse')
        return this.attrValue['PRIVATE_HOUSE'] == 'Y'
    }


    getVorderProps() {
        const res: any = {}
        for (let attr of this.ATTRS) {
            if (attr.ATTR_TYPE === 'prop' && attr.CODE) {
                res[attr.CODE] = attr.VALUE
            }
        }
        return res
    }


    @action
    restoreFromClone(clonedProfile: OrderProfileModel) {
        this.NAME = clonedProfile.NAME
        this.USER_ID = clonedProfile.USER_ID
        this.PERSON_TYPE_ID = clonedProfile.PERSON_TYPE_ID
        this.IS_DEFAULT = clonedProfile.IS_DEFAULT
        this.DELIVERY_FREE_FROM_PRICE = clonedProfile.DELIVERY_FREE_FROM_PRICE
        this.ATTRS = clonedProfile.ATTRS
        this.indexAttrs(this.ATTRS)
        return this
    }

    @computed
    get deliveryFreeFromPrice(): number {
        return this.DELIVERY_FREE_FROM_PRICE
    }

    @action
    updateDeliveryFreeFromPrice(price: number) {
        this.DELIVERY_FREE_FROM_PRICE = price
        this.setPropValue('DELIVERY_FREE_FROM_PRICE', price)
        this.setPropValue('DELIVERY_FREE_UPDATED_TIME', Math.round(Date.now() / 1000))
    }
}
