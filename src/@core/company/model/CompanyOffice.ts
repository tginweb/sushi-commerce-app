import {ElementModel} from "@core/main/model/Element";
import {CompanyOffice, Coordinates} from "~gql/api";
import {computed, makeObservable} from "mobx";
import {GeoCoordinates} from "@core/geo/class/GeoCoordinates";
import {logComputed} from "@core/main/lib/mobx/log-computed";

export class CompanyOfficeModel extends ElementModel {

    COORDS?: Coordinates
    ROLES?: string[]

    constructor(data?: CompanyOffice, observer: boolean = true) {
        super(null, false)
        if (data) {
            Object.assign(this as any, data)
            this.indexProps(this.PROPS)
        }
        if (observer)
            makeObservable(this)
    }

    @computed
    get coordinates() {
        logComputed(this, 'coordinates')
        return this.COORDS || (this.propValue['COORDS'] ? this.propValue['COORDS'].split(':') : '')
    }

    @computed
    get coordinatesObject() {
        logComputed(this, 'coordinatesObject')
        return this.coordinates ? new GeoCoordinates(this.coordinates) : null
    }

    @computed
    get phoneToCall() {
        logComputed(this, 'phoneToCall')
        return this.propValue.PHONES?.length ? this.propValue.PHONES[0] : null
    }

    @computed
    get roles() {
        logComputed(this, 'roles')
        return this.ROLES || []
    }

    @computed
    get roleName() {
        logComputed(this, 'roleName')
        if (this.roles.includes('bar')) {
            return 'Суши-бар'
        } else if (this.roles.includes('delivery')) {
            return 'Пункт самовывоза'
        } else {
            return 'Офис'
        }
    }
}

