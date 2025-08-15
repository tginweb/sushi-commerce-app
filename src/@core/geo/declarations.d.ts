import {GeoStore} from "./store/store";

declare module "@core/main/types" {
    interface TAppStores {
        geo: GeoStore
    }
}
