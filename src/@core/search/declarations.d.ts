import {SearchStore} from "./store/store";

declare module "@core/main/types" {
    interface TAppStores {
        search: SearchStore,
    }
}


