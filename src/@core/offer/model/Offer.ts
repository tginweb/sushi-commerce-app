import {ElementModel} from "@core/main/model/Element";
import {Image, MenuItemMobile, Offer} from "~gql/api";
import {computed, makeObservable} from "mobx";
import {OfferSlideModel} from "@core/offer/model/OfferSlide";
import templater from "@core/main/util/base/templater";
import {strip_tags} from "locutus/php/strings";
import {TTemplateValueWrapper} from "@core/main/types";
import reactTemplater from "@core/main/util/react/reactTemplater";

export class OfferModel extends ElementModel {

    BANNER_INTERNAL_TEXT?: string

    BANNER_HOR_MOBILE?: Image
    BANNER_SQUARE?: Image

    ACTIONS_MOBILE: MenuItemMobile[] = []
    SLIDES: OfferSlideModel[] = []

    VARS: any
    HAVE_DETAILS?: boolean
    VIEW_MODE: string = ''

    IS_HOT: boolean = false

    constructor(data?: Offer, observer: boolean = true) {
        super(null, false)
        if (data) {
            Object.assign(this as any, data)
            if (data.SLIDES)
                this.SLIDES = data.SLIDES.map(item => new OfferSlideModel(item)) || []
            this.indexProps(this.PROPS)
        }
        if (observer)
            makeObservable(this)
    }

    @computed
    get BANNER_INTERNAL_TEXT_TEMPLATED() {
        return templater(this.BANNER_INTERNAL_TEXT, this.VARS)
    }

    @computed
    get NAME_TEMPLATED() {
        return templater(this.NAME, this.VARS)
    }

    @computed
    get DETAIL_TEXT_TEMPLATED() {
        return templater(this.DETAIL_TEXT, this.VARS)
    }

    @computed
    get PREVIEW_TEXT_TEMPLATED() {
        return templater(this.PREVIEW_TEXT, this.VARS)
    }

    @computed
    get haveDetails() {
        return this.HAVE_DETAILS || strip_tags(this.DETAIL_TEXT).trim().length > 100
    }

    getViewMode() {
        return this.VIEW_MODE
    }

    getTemplatedReact(key: 'NAME', valueWrapper?: TTemplateValueWrapper) {
        switch (key) {
            case "NAME":
                return reactTemplater(this.NAME, this.VARS, valueWrapper)
        }
    }
}

