import {Text, TextProps} from "react-native-ui-lib";
import CommonService from "@core/main/lib/service/common";

export class CatalogUtilService extends CommonService {

    price(v?: number | string | null,
          props: {
              withSpace?: boolean,
              round?: boolean,
              wrapSpaces?: number,
              currency?: boolean,
              currencySpace?: boolean,
              splitSpaces?: boolean,
              currencyTag?: boolean,
              currencyProps?: TextProps,
          } = {}
    ) {

        const {
            round = true,
            currency = true,
            currencySpace = true,
            splitSpaces = false,
            wrapSpaces,
            currencyTag,
            currencyProps
        } = props

        let res: any

        let price = v ? (round ? Math.round(v as number).toString() : (v as number).toString()) : ''

        if (splitSpaces)
            price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")

        if (currency) {
            let curr: any = currencySpace ? ' ₽' : '₽'
            if (currencyTag) {
                res = <>{price}<Text {...currencyProps}>{curr}</Text></>
            } else {
                res = price + curr
                if (wrapSpaces)
                    res = "\u00A0".repeat(wrapSpaces) + res + "\u00A0".repeat(wrapSpaces)
            }
        }

        return res
    }

    formatPriceCurrency(v?: number | string | null, withSpace: boolean = true, round = true, wrapSpaces?: number | boolean) {
        let res = v ? (round ? Math.round(v as number) : v) + (withSpace ? ' ₽' : '₽') : ''
        if (wrapSpaces) {
            const wrapSpacesCount = typeof wrapSpaces === 'boolean' ? 1 : wrapSpaces
            res = "\u00A0".repeat(wrapSpacesCount) + res + "\u00A0".repeat(wrapSpacesCount)
        }
        return res
    }

    isFilterFilled = (data: any, filledPath?: string[]) => {

        const scan = (items: any, parents: any) => {
            for (const [filterName, filterValue] of Object.entries(items)) {
                if (filterValue) {
                    if (Array.isArray(filterValue)) {
                        const val = filterValue.find(item => !!item)
                        if (val)
                            return [...parents, filterName, val]
                    } else if (typeof filterValue === 'object') {
                        const path: any = scan(filterValue, [...parents, filterName])
                        if (path.length)
                            return path
                    } else {
                        return [...parents, filterName, filterValue]
                    }
                }
            }
            return []
        }

        const path = scan(data, [])

        if (filledPath)
            path.forEach((v: any) => {
                filledPath.push(v)
            })

        return !!path.length
    }

}

const service = new CatalogUtilService()

export const catalogUtil = service
export default service
