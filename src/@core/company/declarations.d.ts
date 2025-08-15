import {CompanyStore} from "./store/store";

declare module "@core/main/types" {
    interface TAppStores {
        company: CompanyStore
    }
}
