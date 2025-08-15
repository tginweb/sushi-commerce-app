import {CatalogUtilService} from "./service/util";
import {CatalogStore} from "./store/catalog";
import {CatalogConstructorStore} from "./store/constructor";
import SectionsDialogStore from "@core/catalog/store/sections-dialog";
import ProductPrimaryDialogStore from "@core/catalog/store/product-primary-dialog";
import ProductSecondaryDialogStore from "@core/catalog/store/product-secondary-dialog";

declare module "@core/main/types" {
    interface TAppServices {
        catalogUtil: CatalogUtilService
    }
}

declare module "@core/main/types" {
    interface TAppStores {
        catalog: CatalogStore,
        catalogConstructor: CatalogConstructorStore,
        productPrimaryDialog: ProductPrimaryDialogStore,
        productSecondaryDialog: ProductSecondaryDialogStore,
        sectionsDialog: SectionsDialogStore,
    }
}
