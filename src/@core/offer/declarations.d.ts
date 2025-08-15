import {OfferStore} from "./store/store";

declare module "@core/main/types" {
    interface TAppStores {
        offer: OfferStore
    }
}
