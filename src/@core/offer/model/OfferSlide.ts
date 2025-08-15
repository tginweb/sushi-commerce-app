import {ElementModel} from "@core/main/model/Element";
import {Image, OfferSlide} from "~gql/api";
import {makeObservable} from "mobx";
import {TOfferContentType} from "@core/offer/types";

export class OfferSlideModel extends ElementModel {

    CONTENT_TYPE: TOfferContentType = 'image'
    CONTENT_HTML?: string
    CONTENT_IMAGE?: Image
    BG_COLOR?: string

    constructor(data?: OfferSlide, observer: boolean = true) {
        super(null, false)
        if (data) {
            Object.assign(this as any, data)
            this.indexProps(this.PROPS)
        }
        if (observer)
            makeObservable(this)
    }

    getContent() {
        switch (this.CONTENT_TYPE) {
            case 'image':
                return this.CONTENT_IMAGE?.SRC
            case 'video':
                return this.CONTENT_IMAGE?.SRC
            case 'html':
                return this.CONTENT_HTML
        }
    }
}

