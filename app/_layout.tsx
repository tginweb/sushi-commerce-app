import 'react-native-get-random-values';
import * as Notifications from 'expo-notifications';

import {
    configureReanimatedLogger,
    ReanimatedLogLevel,
} from 'react-native-reanimated';

import {Stack} from "expo-router"
import React, {useEffect, useRef, useState} from 'react'

import {configureDesignSystem, wHeight, wWidth} from '~assets/design'

import {bootStores, initStores, stores} from '~stores'
import {bootServices, initServices} from '~services'
import * as Font from 'expo-font'
import {AppProviders} from '~com/app/providers'

import {configService} from "@core/main/service/config"
import {restService} from "@core/main/service/rest"
import AppConfig from "@core/main/config"
import {busService} from "@core/main/service/bus"
import {Modals} from "~com/app/modals"
import {Informers} from "~com/app/informers";
import {useApp} from "@core/main/lib/hooks/useApp";
import {UiSplashScreen} from "~ui/splash-screen";
import AppErrorScreen from "~com/app/screen/app-error";
import {TAppScreenData} from "@core/main/types";
import {Bus} from "~com/app/bus";
import {graphqlService} from "@core/main/service/graphql";
import {
    guidelineBaseHeight,
    guidelineBaseWidth,
    moderateVerticalScale,
    scale,
    verticalScale
} from "@core/main/lib/scale";
import {RequiredComponents} from "~com/app/required-components";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Platform} from "react-native";

type TMode = 'loading' |
    'loading_error' |
    'app_disable' |
    'need_update' |
    'need_update_required' |
    'normal'

let errorsQueue: Record<string, {
    error: Error,
    isFatal?: boolean
}> = {}

let runQueueDelay = 0

/*
import { LogBox, LogBoxNotification } from 'react-native-web-log-box'

if (true) {
    console.log('OOO')
    LogBox.ignoreLogs(['Received'])
    LogBox.install()
}

 */

const runErrorsQueue = () => {
    Object.values(errorsQueue).forEach((item) => {
        stores.debug.error(item.error.message, {
            name: item.error.name,
            isFatal: item.isFatal,
        })
    })
    errorsQueue = {}
}

const myErrorHandler = (error: Error, isFatal?: boolean) => {
    if (runQueueDelay > 200)
        runQueueDelay = 0
    runQueueDelay += 5
    const key = error.message.toString()
    errorsQueue[key] = {
        error,
        isFatal
    }
    setTimeout(runErrorsQueue, runQueueDelay)
}

const registerErrorHandler = () => {

    if (typeof ErrorUtils === 'undefined')
        return;

    const defaultErrorHandler = ErrorUtils.getGlobalHandler()

    ErrorUtils.setGlobalHandler((error, isFatal) => {
        myErrorHandler(error, isFatal)
        defaultErrorHandler(error, isFatal)
    })
}

export default function RootLayout() {

    registerErrorHandler()

    configureReanimatedLogger({
        level: ReanimatedLogLevel.warn,
        strict: false
    });

    const loggerEvent = {
        scope: 'boot'
    }

    //useReactNavigationDevTools(navigationRef)
    //useApolloClientDevTools(client)

    //LogBox.ignoreLogs([/ADVICE/])

    const [mode, setMode] = useState<TMode>('loading')
    const modeRef = useRef<TMode>(mode)

    modeRef.current = mode

    const [requiredComponentEnable, setRequiredComponentEnable] = useState(false)
    const [loading, setLoading] = useState(true)
    const [wasLoadedOnce, setWasLoadedOnce] = useState<boolean | 'required'>(false)
    const [errorScreenData, setErrorScreenData] = useState<TAppScreenData>({})

    const updateMode = (newMode: TMode) => {
        stores.debug.info('App mode change', {newMode}, {scope: 'boot'})

        //stores.debug.error('App mode change', {newMode}, {scope: 'boot'})
        setMode(newMode)
        modeRef.current = newMode
        if (newMode === "loading")
            setLoading(true)
    }

    const start = async () => {

        stores.debug.info('App start', null, {scope: 'boot'})

        stores.debug.info('Services boot', null, {scope: 'boot'})
        busService.boot()
        configService.boot()
        restService.boot()
        graphqlService.boot()
        await bootServices()

        stores.debug.info('Stores boot', null, {scope: 'boot'})
        await bootStores()

        await preloadServerData()
        await bootDesign()
        await loadServerData()
    }

    const bootDesign = async () => {

        stores.debug.info('Boot design', null, {scope: 'boot'})

        setRequiredComponentEnable(true)

        if (Platform.OS !== "web") {
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: false,
                    shouldSetBadge: false,
                }),
            });
        }

        //await SplashScreen.preventAutoHideAsync();

        await Font.loadAsync({
            ttb: require('~assets/fonts/Montserrat-Bold.ttf'),
            ttr: require('~assets/fonts/Montserrat-Regular.ttf'),
            ttm: require('~assets/fonts/Montserrat-Medium.ttf'),
        })

        stores.debug.info('Configure design', null, {scope: 'boot'})

        configureDesignSystem()

        stores.debug.info('Design', {
            windowWidth: wWidth,
            windowHeight: wHeight,
            guidelineBaseWidth,
            guidelineBaseHeight,
            scale_10: scale(10),
            verticalScale_10: verticalScale(10),
            moderateVerticalScale_10_20: moderateVerticalScale(10, 20)
        }, {scope: 'boot'})
    }

    const preloadServerData = async () => {

        const debug = stores.debug
        const user = stores.user

        stores.user.ensureClientId()

        try {
            debug.info('Preload server data')
            await user.queryAppClient()

        } catch (e: any) {
            console.log(e)
        }

    }

    const loadServerData = async () => {
        setErrorScreenData({})
        updateMode('loading')
        const res = await loadServerDataRun()
        setLoading(false)
        if (res) setWasLoadedOnce(true)
    }

    const loadServerDataRun = async () => {

        const app = useApp()

        const debug = stores.debug

        const clientContext = await stores.main.loadClientContextGlobal()

        debug.info('Loading app', {
            currentMode: modeRef.current,
            clientContext
        }, {scope: 'boot'})

        try {
            await stores.main.scopesFetch(['boot'])
        } catch (e: any) {
            updateMode('loading_error')
            return false
        }

        debug.info('Boot scope data', {
            SESSION_ID: stores.user.sessionId,
            USER_ID: stores.user.userId,
            APP_SITE_URL: AppConfig.APP_SITE_URL,
        }, {scope: 'boot'})

        if (AppConfig.APP_DISABLE) {
            debug.warn('App disabled', null, {scope: 'boot'})
            AppConfig.APP_DISABLE_INFO && setErrorScreenData(AppConfig.APP_DISABLE_INFO)
            updateMode('app_disable')
        }

        if (AppConfig.APP_NEED_UPDATE) {
            debug.warn('App need update', null, {scope: 'boot'})
            AppConfig.APP_NEED_UPDATE_INFO && setErrorScreenData(AppConfig.APP_NEED_UPDATE_INFO)
            if (AppConfig.APP_NEED_UPDATE === 'required') {
                updateMode('need_update_required')
                return false
            } else {
                updateMode('need_update')
            }
        }

        const sessionScopes = stores.user.isAuthorized ? ['app', 'session', 'user'] : ['app', 'session']

        try {
            await stores.main.scopesFetch(sessionScopes)
        } catch (e: any) {
            updateMode('loading_error')
            return false
        }

        debug.info('Services init', null, {scope: 'boot'})
        await initServices()

        debug.info('Stores init', null, {scope: 'boot'})
        await initStores()

        stores.app.alertsQueueFill(true)

        busService.emit('image:bootstrapPrefetch')

        app.runDeferredFetchTasks()

        debug.info('Vorder prepare', null, {scope: 'boot'})
        stores.vorder.setup()

        if (Platform.OS !== "web") {
            debug.info('Push setup', null, {scope: 'boot'})
            stores.push.setup()
        }

        debug.info('Register components', null, {scope: 'boot'})

        app.runCallbacks('componentsRegister', app as any)

        debug.info('Set route options', null, {scope: 'boot'})

        app.setRoutesOptions({
            '/': {
                tabBarHide: true
            },
            '/login': {
                //  tabBarHide: true
            },
            '/sale/address': {
                tabBarHide: true
            },
            '/user/profile-edit': {
                tabBarHide: true
            },
            '/user/bonuses': {
                tabBarHide: true
            },
            '/info/page': {
                tabBarHide: true
            },
            '/info/delivery': {
                tabBarHide: true
            },
        })

        if (modeRef.current === 'loading') {
            updateMode('normal')
        }

        return true
    }


    const onDebugChangeMode = (val: TMode) => {
        console.log(val, 'onDebugChangeMode')
        setMode(val)
    }

    useEffect(() => {
        busService.emitter.on('app.root.changeMode', onDebugChangeMode)
        start()
        return () => {
            busService.emitter.off('app.root.changeMode', onDebugChangeMode)
        }
    }, []);

    let _mode: TMode

    if (loading) {
        _mode = 'loading'
    } else {
        _mode = mode
    }

    const ComNormal = () => {
        return (
            <Stack
                screenOptions={
                    {
                        headerShown: false,
                    }
                }
            />
        )
    }

    /*
    console.log('_mode', {
        mode, _mode, loading, wasLoadedOnce
    })
     */

    const AppInner = () => {
        switch (_mode) {
            case 'loading':
                return <UiSplashScreen/>
            case 'loading_error':
                return <AppErrorScreen
                    title={'Ошибка загрузки'}
                    message={'Во время загрузки приложения произошла ошибка. Побробуйте немного позднее'}
                    actions={['reload', 'site', 'contact']}
                    {...errorScreenData}
                    onActionReload={() => loadServerData()}
                />
            case 'app_disable':
                return <AppErrorScreen
                    title={'Приложение временно недоступно'}
                    actions={['site', 'contact']}
                    {...errorScreenData}
                    onActionReload={() => loadServerData()}
                />
            case 'need_update':
                return <AppErrorScreen
                    title={'Доступна новая версия приложения'}
                    message={'Обновить версию приложения чтобы использовать новые возможности'}
                    actions={['update', 'skip']}
                    onActionReload={() => loadServerData()}
                />
            case 'need_update_required':
                return <AppErrorScreen
                    title={'Ваша версия приложения устарела'}
                    message={'Необходимо обновить версию приложения чтобы использовать новые возможности'}
                    actions={['update', 'site',]}
                    {...errorScreenData}
                    onActionReload={() => loadServerData()}
                />
            case 'normal':
                return <ComNormal/>
            default:
                return <></>
        }
    }

    const wrap = (children: any) => {

        return wasLoadedOnce ?
            <AppProviders>
                {children}
                <Informers/>
                <Modals/>
                <Bus/>
            </AppProviders>
            :
            <>
                {children}
            </>
    }

    return <GestureHandlerRootView style={{flex: 1}}>
        {wrap(<AppInner/>)}
        {requiredComponentEnable && <RequiredComponents/>}
    </GestureHandlerRootView>
}

