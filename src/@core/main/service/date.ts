import dayjs from "dayjs";
import CommonService from "@core/main/lib/service/common";
import AppConfig from "@core/main/config";

const advancedFormat = require('dayjs/plugin/advancedFormat')
const isYesterday = require('dayjs/plugin/isYesterday')
const isToday = require('dayjs/plugin/isToday')
const isTomorrow = require('dayjs/plugin/isTomorrow')
const utc = require('dayjs/plugin/utc')

const timezone = require('dayjs/plugin/timezone')
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const duration = require('dayjs/plugin/duration')

require('dayjs/locale/ru')

export class DateService extends CommonService {

    constructor() {
        super()
    }

    async boot() {
        dayjs.extend(duration)
        dayjs.extend(utc)
        dayjs.extend(timezone)
        dayjs.extend(isYesterday)
        dayjs.extend(isToday)
        dayjs.extend(isTomorrow)
        dayjs.extend(isSameOrAfter)
        dayjs.extend(customParseFormat)
        dayjs.extend(advancedFormat)

        if (AppConfig.TIMEZONE_OVERRIDE) {
            // @ts-ignore
            dayjs.tz.setDefault(AppConfig.TIMEZONE_OVERRIDE)
        }

        dayjs.locale('ru')
    }

}

export const service = new DateService()
export const dateService = service
export default service


