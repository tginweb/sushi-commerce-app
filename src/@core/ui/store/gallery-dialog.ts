import {makeObservable} from "mobx"
import DialogStore from "@core/main/lib/store/dialog";
import {ImageSourcePropType} from "react-native";
import {TCommonDialogProps} from "@core/main/types";

export type TGalleryDialogProps = TCommonDialogProps & {
    items: ImageSourcePropType[]
}

export class GalleryDialogStore extends DialogStore<TGalleryDialogProps> {
    constructor() {
        super()
        makeObservable(this)
    }
}

export default GalleryDialogStore
