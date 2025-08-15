import {computed} from "mobx";
import {duration} from "@core/main/util/date";
import parseIntAny from "@core/main/util/base/parseIntAny";
import {BonusLevelElement, SaleClientCard} from "~gql/api";
import {logComputed} from "@core/main/lib/mobx/log-computed";

export class SaleClientCardModel {

    ID: number | null = null
    BONUSES: number = 0
    BONUSES_EXPIRE: number | string = 0
    MONTH_SPENT: number = 0
    COLOR: string = ''
    BONUSES_PERCENT: number = 0
    LEVEL?: BonusLevelElement = {}
    GIFTS: number[] = []
    FETCHED: boolean = false
    FETCHED_ACTUAL: boolean = false
    EXPIRED: boolean = false

    constructor(data: SaleClientCard, observer = true) {
        Object.assign(this as any, {
            ...data,
        })
    }

    @computed
    get bonusesExpireDuration(): string {
        logComputed(this, 'bonusesExpireDuration')
        return this.BONUSES_EXPIRE ? duration(Date.now(), parseIntAny(this.BONUSES_EXPIRE), 'day') : ''
    }


    isFetched() {
        return this.FETCHED
    }

    isFetchedAndActual() {
        return this.FETCHED
    }
}
