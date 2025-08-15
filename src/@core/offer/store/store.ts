import {action, computed, makeObservable, observable} from "mobx"
import {TCommonDialogProps} from "@core/main/types"
import {Offer} from "~gql/api"
import {OfferModel} from "@core/offer/model/Offer";
import CommonStore from "@core/main/lib/store/common";
import {DiscountItemModel} from "@core/sale/model/DiscountItemModel";
import {classComputedPropsCache} from "@core/main/lib/mobx/class-computed-props-cache";
import DialogStore from "@core/main/lib/store/dialog";
import {InstagramStoryProps} from "~ui/stories/core/dto/instagramStoriesDTO";
import {imagerService} from "@core/ui/service/imager";
import {busService} from "@core/main/service/bus";
import {TOfferAction, TOfferViewMode} from "@core/offer/types";
import {makePersistable} from "mobx-persist-store";
import {imagePrefetch} from "~ui/image";

type TOfferDialogProps = TCommonDialogProps & {
    element?: OfferModel | null
}

export class OfferStore extends CommonStore {

    @observable
    viewedOffers: Record<any, boolean> = {}

    @observable
    userOffers: OfferModel[] = []

    @observable
    commonOffers: OfferModel[] = []

    @observable
    dialog = new DialogStore<TOfferDialogProps>({
        element: null
    })

    constructor() {
        super()
        makeObservable(this)

        makePersistable(this, {
            name: OfferStore.name,
            properties: ['viewedOffers'],
        })
    }

    init() {
        this.disposers = classComputedPropsCache(this, [], ['offersOnFront', 'dialog'])
        this.bus().on('action:offer', this.action)
        this.bus().on('image:bootstrapPrefetch', this.imageBootstrapPrefetch.bind(this))
    }

    imageBootstrapPrefetch() {
        /*
        imagePrefetch(this.allOffers.reduce<string[]>((map, offer) => {
            offer.SLIDES.forEach(slide => {
                map.push(imagerService.resolve(slide.CONTENT_IMAGE?.SRC, 'w-1'))
            })
            return map
        }, []))

         */
    }

    @action
    SCOPE_APP(data: any) {
        if (data.commonList) this.commonOffers = data.commonList.map((element: Offer) => new OfferModel(element))
    }

    @action
    SCOPE_USER(data: any) {
        if (data.userList) this.userOffers = data.userList.map((element: Offer) => new OfferModel(element))
    }

    @action
    openOffer(offer: OfferModel, mode?: TOfferViewMode) {
        const _mode = mode || offer.getViewMode() || 'story'
        if (_mode === 'sheet') {
            this.dialog.show({
                element: offer
            })
        } else {
            busService.emitter.emit('bus:offer-open-story', offer)
        }
    }

    @action
    offersClear() {
        this.userOffers = []
    }

    findUserOfferByDiscountItem(discount: DiscountItemModel) {
        return this.userOffers.find(offer => {
            return offer.DISCOUNT_ID === discount.DISCOUNT?.ID
        })
    }

    @computed
    get commonOffersSorted() {
        return [...this.commonOffers].sort((a, b) => a.SORT - b.SORT)
    }

    @computed
    get allOffers() {
        return [...this.userOffers, ...this.commonOffers]
        //return this.commonOffersSorted
    }

    offersToStories(offers: OfferModel[]) {
        return offers.map<InstagramStoryProps>(offer => ({
            id: offer.ID.toString(),
            name: offer.NAME_TEMPLATED,
            offerId: offer.ID,
            imgUrl: imagerService.resolve(offer.BANNER_SQUARE?.SRC, 'w-1-3') || '',
            offer: offer,
            stories: offer.SLIDES ? offer.SLIDES.map(slide => {
                let content
                if (slide.CONTENT_TYPE === 'image') {
                    content = imagerService.resolve(slide.CONTENT_IMAGE?.SRC, 'w-1')
                } else {
                    content = slide.getContent()
                }
                return {
                    id: 'slide-' + slide.ID.toString(),
                    contentType: slide.CONTENT_TYPE,
                    offer: offer,
                    content: content,
                    bgColor: slide.BG_COLOR || ''
                }
            }) : []
        }))
    }

    @computed
    get allOffersAsStories(): InstagramStoryProps[] {
        return this.offersToStories(this.allOffers)
    }

    @computed
    get offersByDiscountId() {
        return this.userOffers.reduce<Record<number, OfferModel>>((map, offer) => {
            if (offer.DISCOUNT_ID)
                map[offer.DISCOUNT_ID] = offer
            return map
        }, {})
    }

    @computed
    get offersOnFront() {
        //const hottestDiscountId = this.stores().sale.userClientCard?.hotestDiscount?.DISCOUNT?.ID
        //console.log(hottestDiscountId, 'hottestDiscountId')
        //return this.userOffers.filter(offer => offer.DISCOUNT_ID !== hottestDiscountId)
        return this.userOffers
    }

    @computed
    get hottestOffer() {
        return this.allOffers.find(offer => offer.IS_HOT)
    }

    @action
    setOfferViewed(id: any) {
        this.allOffers.forEach(offer => {
            this.viewedOffers[offer.ID] = true
        })
        //this.viewedOffers[id] = true
    }

    isNewOffer(offer: OfferModel) {
        return offer.IS_HOT && !this.viewedOffers[offer.ID]
    }

    showNewOffers(run = false, offerId = null) {
        let offer = offerId ?
            this.allOffers.find(offer => {
                return offer.ID === offerId
            })
            :
            this.commonOffers.find(offer => this.isNewOffer(offer))

        this.stores().debug.info('showNewHottestOffer', {
            IDS: offer ? offer.ID : null
        }, {scope: ['boot']})

        if (offer) {
            imagePrefetch(offer.SLIDES.map(slide => imagerService.resolve(slide.CONTENT_IMAGE?.SRC, 'w-1')))
        }

        const cb = offer ? () => offer && this.openOffer(offer) : null

        return run ? cb && cb() : cb
    }

    @action
    action(action: TOfferAction) {
        const emitter = this.services().bus.emitter
        switch (action.type) {
            case 'view': {

                break
            }
        }
    }
}

export default OfferStore
