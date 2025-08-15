
import {ImagerService} from "./service/imager";
import {UIStore} from "./store/ui";
import {GalleryDialogStore} from "./store/gallery-dialog";

declare module "@core/main/types" {
    interface TAppServices {
        imager: ImagerService
    }
}

declare module "@core/main/types" {
    interface TAppStores {
        ui: UIStore
        galleryDialog: GalleryDialogStore
    }
}

