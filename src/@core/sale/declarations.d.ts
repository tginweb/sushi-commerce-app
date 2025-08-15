import {FavStore} from "./store/fav";
import {SaleStore} from "./store/store";
import {VorderStore} from "./store/vorder";
import {ProfileDialogStore} from "./store/profile-dialog";
import {OrderPayDialogStore} from "./store/order-pay-dialog";
import {OrderCancelDialogStore} from "@core/sale/store/order-cancel-dialog";
import {GiftsDialogStore} from "@core/sale/store/gifts-dialog";
import ProfileEditDialogStore from "@core/sale/store/profile-edit-dialog";
import ProfileMapDialogStore from "@core/sale/store/profile-map-dialog";
import DeliveryEditDialogStore from "@core/sale/store/delivery-edit-dialog";

declare module "@core/main/types" {
    interface TAppStores {
        sale: SaleStore
        vorder: VorderStore,
        fav: FavStore,
        deliveryEditDialog: DeliveryEditDialogStore,
        profileDialog: ProfileDialogStore,
        profileEditDialog: ProfileEditDialogStore,
        profileMapDialog: ProfileMapDialogStore,
        orderPayDialog: OrderPayDialogStore,
        orderCancelDialog: OrderCancelDialogStore,
        giftsDialog: GiftsDialogStore
    }
}

