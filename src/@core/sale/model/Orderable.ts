import {action, IReactionDisposer, observable} from "mobx"
import {TOrderAttrsMap} from "@core/sale/types"
import {UiAddressInputOption} from "~ui/address-input";
import {GeoObject, OrderAttr} from "~gql/api";
import CommonStore from "@core/main/lib/store/common";
import {cleanLocalAddress} from "@core/geo/util/cleanLocalAddress";
import {TCleanLocalAddressBehavior} from "@core/main/types";

export class OrderableModel extends CommonStore {

    disposers: IReactionDisposer[] = []

    @observable
    attrValue: {
        [key: string]: any;
    } = {}

    @observable
    attr: TOrderAttrsMap = {}

    @action
    indexAttrs(attrs: OrderAttr[]) {
        for (let attr of attrs) {
            if (attr.CODE) {
                this.attr[attr.CODE] = attr
                this.attrValue[attr.CODE] = attr.VALUE
            }
        }
    }

    getAttrValuesMap() {
        const res: any = {}
        for (const [code, attr] of Object.entries(this.attr)) {
            if (attr.CODE) {
                res[code] = {
                    ATTR_TYPE: attr.ATTR_TYPE,
                    CODE: attr.CODE,
                    VALUE: this.attrValue[attr.CODE]
                }
            }
        }
        return res
    }

    getHouseProps() {

        const res: any = {
            addressSource: this.attrValue['ADDRESS_SOURCE'],
            isCustom: this.attrValue['ADDRESS_SOURCE'] === 'map',
            location: {}
        }

        if (this.attrValue['STREET_FIAS_ID']) {
            res.location.street_fias_id = this.attrValue['STREET_FIAS_ID']
        } else if (this.attrValue['SETTLEMENT_FIAS_ID']) {
            res.location.settlement_fias_id = this.attrValue['SETTLEMENT_FIAS_ID']
        }

        return res
    }

    addressOptionToAttrs(option: UiAddressInputOption) {

        const data = option.data
        const propValues: any = {}

        let coords = data.geo_lon ? data.geo_lon + ':' + data.geo_lat : null

        //const parts = option.value.split(/\s*\,\s*/)

        if (option.value) {
            propValues['ADDRESS'] = option.value
        } else {
            propValues['ADDRESS'] = null
        }

        if (data.city) {
            propValues['CITY'] = data.city
            propValues['CITY_FIAS_ID'] = data.city_fias_id
        } else {
            propValues['CITY'] = null
            propValues['CITY_FIAS_ID'] = null
        }

        if (data.settlement) {
            propValues['SETTLEMENT'] = data.settlement
            propValues['SETTLEMENT_FIAS_ID'] = data.settlement_fias_id
        } else {
            propValues['SETTLEMENT'] = null
            propValues['SETTLEMENT_FIAS_ID'] = null
        }

        if (data.street) {
            propValues['STREET'] = data.street
            propValues['STREET_FIAS_ID'] = data.street_fias_id
        } else {
            propValues['STREET'] = null
            propValues['STREET_FIAS_ID'] = null
        }

        if (data.house) {
            propValues['HOUSE'] = data.house
            propValues['HOUSE_FIAS_ID'] = data.house_fias_id
        } else {
            propValues['HOUSE'] = null
            propValues['HOUSE_FIAS_ID'] = null
        }

        if (data.flat) {
            propValues['FLAT'] = data.flat
        } else {
            propValues['FLAT'] = null
        }

        propValues['STREET_COORDS'] = coords
        propValues['HOUSE_COORDS'] = coords

        return propValues
    }

    addressMapToAttrs(data: GeoObject) {

        const propValues: any = {}

        let coords = data.geo_lon ? data.geo_lon + ':' + data.geo_lat : null

        if (data.address_full) {
            propValues['ADDRESS'] = data.address_full
        } else {
            propValues['ADDRESS'] = null
        }

        if (data.city) {
            propValues['CITY'] = data.city
            propValues['CITY_FIAS_ID'] = null
        } else {
            propValues['CITY'] = null
            propValues['CITY_FIAS_ID'] = null
        }

        if (data.district) {
            propValues['SETTLEMENT'] = data.district
            propValues['SETTLEMENT_FIAS_ID'] = null
        } else {
            propValues['SETTLEMENT'] = null
            propValues['SETTLEMENT_FIAS_ID'] = null
        }

        if (data.street) {
            propValues['STREET'] = data.street
            propValues['STREET_FIAS_ID'] = null
        } else {
            propValues['STREET'] = null
            propValues['STREET_FIAS_ID'] = null
        }

        if (data.house) {
            propValues['HOUSE'] = data.house
            propValues['HOUSE_FIAS_ID'] = null
        } else {
            propValues['HOUSE'] = null
            propValues['HOUSE_FIAS_ID'] = null
        }

        propValues['STREET_COORDS'] = coords
        propValues['HOUSE_COORDS'] = coords

        return propValues
    }

    getIsFilled(flatRequired: boolean = true) {
        if (!this.attrValue['ADDRESS'] || !this.attrValue['HOUSE']) {
            return false
        }
        if (flatRequired && this.attrValue.PRIVATE_HOUSE !== 'Y' && !this.attrValue.FLAT) {
            return false
        }
        return true
    }

    getAddressForInput(cleanLocal: TCleanLocalAddressBehavior = 'region') {
        return this.getAddress(cleanLocal, false)
    }

    getAddressForView(cleanLocal: TCleanLocalAddressBehavior = 'city', withFlat = true) {
        return this.getAddress(cleanLocal, withFlat)
    }

    getAddress(cleanLocal: TCleanLocalAddressBehavior = false, withFlat: boolean = true) {

        let fields = []

        if (this.attrValue.ADDRESS) {
            fields.push(this.attrValue.ADDRESS)
        } else if (this.attrValue.STREET_PATH) {
            fields.push(this.attrValue.STREET_PATH)
            if (this.attrValue.HOUSE)
                fields.push('д ', this.attrValue.HOUSE)
        }

        if (withFlat && (this.attrValue.PRIVATE_HOUSE !== 'Y' && this.attrValue.FLAT)) {
            fields.push('кв ' + this.attrValue.FLAT)
        }

        let result = fields.join(', ')

        let resultParts = result.split(/\s*,\s*/)

        const address = resultParts.join(', ')

        const [cleanedAddress] = cleanLocalAddress(address, cleanLocal)
        return cleanedAddress
    }

}
