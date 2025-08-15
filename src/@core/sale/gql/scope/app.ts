import {gql} from "@apollo/client"
import DeliveryZoneElement from "~gql/fragments/DeliveryZoneElement"
import OrderStatus from "~gql/fragments/OrderStatus"
import BonusLevelElement from "~gql/fragments/BonusLevelElement"

export default gql`
    query { 
        sale__deliveryZones: sale_delivery_zone_list {
            ...DeliveryZoneElement
        }
        sale__orderStatuses: sale_order_statuses {
            ...OrderStatus
        }
        sale__bonusLevels: sale_bonus_levels {
            ...BonusLevelElement
        }
    }
    ${BonusLevelElement}
    ${DeliveryZoneElement}
    ${OrderStatus}
`
