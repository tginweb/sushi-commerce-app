import React, {useCallback, useEffect, useRef} from "react"
import {useServices} from "~services"
import {Href, TMaybe} from "@core/main/types"
import {observer} from "mobx-react";
import {app} from "~modules/info";
import componentRender from "@core/main/util/react/componentRender";
import {useGlobalSearchParams, useLocalSearchParams, useNavigation, usePathname, useRouter} from "expo-router";
import {useStores} from "~stores";
import {InstagramStories, InstagramStoriesPublicMethods} from "~ui/stories";
import {OfferModel} from "@core/offer/model/Offer";
import {BackHandler} from 'react-native';
import {useBottomSheetModal} from "~ui/bottom-sheet-vendor";
import {useIsFrontPage} from "@core/main/lib/hooks/useIsFrontPage";
import AppConfig from "@core/main/config";
import {useIsCatalogPage} from "@core/main/lib/hooks/useIsCatalogPage";
import {TNavigationRoute} from "@core/ui/types";

import {ResponseState} from "~gql/api";

type TProps = {}

export const Bus: React.FC<TProps> = observer(({}) => {

    const {
        menu,
        router: routerStore,
        offer,
        catalog,
        debug
    } = useStores()

    const {bus} = useServices()
    const router = useRouter()
    const nav = useNavigation()

    const currentUrl = usePathname()
    const currentParams = useLocalSearchParams()
    const currentGlobalParams = useGlobalSearchParams()

    const bottomSheetModal = useBottomSheetModal();

    const isFrontPage = useIsFrontPage()
    const isFrontPageRef = useRef<boolean>(isFrontPage)

    const isCatalogPage = useIsCatalogPage()
    const isCatalogPageRef = useRef<boolean>(isCatalogPage)

    const currentUrlRef = useRef<string>(currentUrl)
    const currentParamsRef = useRef<any>(currentParams)

    isFrontPageRef.current = isFrontPage
    isCatalogPageRef.current = isCatalogPage

    currentUrlRef.current = currentUrl
    currentParamsRef.current = currentParams

    const driverRef = useRef<InstagramStoriesPublicMethods>(null as any)

    useEffect(() => {

        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => routerBack())
        return () => backHandler.remove()
    }, [])

    useEffect(() => {

        debug.info('Route changed', {
            currentPath: currentUrl,
            params: currentParams,
            globalParams: currentGlobalParams
        }, {scope: 'router'})

        let params: any = {}

        if (Object.keys(currentParams).length) {
            params = {...currentParams}
        } else if (Object.keys(currentGlobalParams).length) {
            params = {...currentGlobalParams}
        }

        delete params.screen
        delete params.params

        routerStore.setCurrentRoutePath({
            pathname: currentUrl,
            params: params,
            canGoBack: router.canGoBack()
        })
    }, [currentUrl, currentParams, currentGlobalParams])

    const onProcessResponse = (res: ResponseState) => {
        if (res.actionsMobile && res.actionsMobile.length) {
            menu.runActionItems(res.actionsMobile)
        }
    }

    const navCatalog = (tabCode?: TMaybe<string>, scrollTo?: TMaybe<string>, notPreserveOnCurrentPage?: TMaybe<boolean>) => {
        if (isCatalogPageRef.current) {
            bus.emitter.emit('screen.catalog.nav-tab', tabCode, scrollTo)
        } else {
            routerReplace({
                pathname: AppConfig.APP_FRONT_PAGE,
                params: {
                    tab: tabCode,
                    scrollTo: scrollTo
                }
            })
        }
    }

    const navFront = (scrollSection?: TMaybe<string>) => {
        navCatalog(null, scrollSection)
    }

    const routerDismissAll = () => {
        if (router.canDismiss())
            router.dismissAll()
    }

    const routerPush = (route: any) => {
        bottomSheetModal.dismissAll()
        bus.hideToasts()
        router.push(route)
    }

    const routerReplace = (route: Href) => {
        bottomSheetModal.dismissAll()
        bus.hideToasts()
        console.log('routerReplace', route)
        router.replace(route)
    }

    const routerBack = (backCallback?: any) => {

        if (currentParamsRef.current.backdisable) {
            return true
        }

        //const currentSheet = bottomSheetModal.getCurrentSheet ? bottomSheetModal.getCurrentSheet() : null
        const currentSheet: any = null

        if (currentSheet && currentSheet.ref && currentSheet.ref.current && currentSheet.ref.current.canCloseOnRouterBack()) {
            bottomSheetModal.dismiss(currentSheet.key)
        } else {
            bottomSheetModal.dismissAll()
            routerStore.onGoBackBefore()
            if (backCallback) {
                backCallback()
            } else {
                if (currentParamsRef.current.backlink) {
                    router.replace(currentParamsRef.current.backlink as string)
                } else if (!routerStore.isFrontPage) {
                    if (router.canGoBack())
                        router.back()
                } else {
                    //console.log('back on front')
                }
            }
            setTimeout(() => {
                routerStore.onGoBackAfter()
            }, 500)
        }
        return true;
    }

    const openOfferStory = (offer: OfferModel) => {
        driverRef.current?.show(offer.ID.toString())
    }

    const lastInstaHideFrom = useRef<TMaybe<'action'>>()

    const offersInstaHide = (from?: 'action') => {
        lastInstaHideFrom.current = from
        driverRef.current?.hide()
    }

    const offersInstaOnClose = () => {
        if (lastInstaHideFrom.current !== 'action')
            routerStore.alertsQueueShow()
    }

    const routerBeforeNav = (roterName: string) => {
        if (roterName === 'catalog/catalog') {
            if (catalog.isCatalogPage) {
                bus.emitter.emit('screen.catalog.nav-tab', 'front', 'top')
            }
        }
    }

    const navEmit = (route: TNavigationRoute, event: any) => {

        switch (route.name) {
            case 'catalog/catalog':
                event.preventDefault()
                navCatalog('front')
                break
            case 'user':
                event.preventDefault()
                // @ts-ignore
                nav.navigate('user', {screen: 'index'})
                break
            case 'info':
                event.preventDefault()
                // @ts-ignore
                nav.navigate('info', {screen: 'index'})
                break
        }
    }

    useEffect(useCallback(() => {


        bus.on('nav.emit', navEmit)

        bus.emitter.on('bus:offer-open-story', openOfferStory)
        bus.emitter.on('bus:offers-insta.hide', offersInstaHide)
        bus.emitter.on('bus:offers-insta.onClose', offersInstaOnClose)

        bus.emitter.on('bus:router.beforeNav', routerBeforeNav)
        bus.emitter.on('bus:router.push', routerPush)
        bus.emitter.on('bus:router.replace', routerReplace)
        bus.emitter.on('bus:router.dismissAll', routerDismissAll)
        bus.emitter.on('bus:router.back', routerBack)

        bus.emitter.on('bus:nav:catalog', navCatalog)
        bus.emitter.on('bus:nav:front', navFront)

        bus.emitter.on('processResponse', onProcessResponse)

        return () => {

            bus.off('nav.emit', navEmit)

            bus.emitter.off('bus:offer-open-story', openOfferStory)
            bus.emitter.off('bus:offers-insta.hide', offersInstaHide)
            bus.emitter.off('bus:offers-insta.onClose', offersInstaOnClose)


            bus.emitter.off('bus:router.beforeNav', routerBeforeNav)
            bus.emitter.off('bus:router.push', routerPush)
            bus.emitter.off('bus:router.replace', routerReplace)
            bus.emitter.off('bus:router.dismissAll', routerDismissAll)
            bus.emitter.off('bus:router.back', routerBack)

            bus.emitter.off('bus:nav:catalog', navCatalog)
            bus.emitter.off('bus:nav:front', navFront)

            bus.emitter.off('processResponse', onProcessResponse)
        }

    }, [
        openOfferStory,
        offersInstaHide,
        routerPush,
        routerReplace,
        routerDismissAll,
        routerBack,
        navCatalog,
        navFront,
        onProcessResponse
    ]), [])

    return (
        <>
            {app.getBusComponents().map((com: any, index: number) => componentRender(com, {index}, {}))}

            <InstagramStories
                ref={driverRef}
                stories={offer.allOffersAsStories}
            />
        </>
    )
})
