import {action, makeObservable, observable, runInAction} from "mobx"
import CommonStore from "@core/main/lib/store/common";
import {Alert, Platform} from "react-native";
import * as Notifications from "expo-notifications";
import {Notification} from "expo-notifications";
import Constants from "expo-constants";
import AysncStorage from "@react-native-async-storage/async-storage";
import {TPushNotification,} from "@core/main/types";
import {makePersistable} from "mobx-persist-store";
import {task} from "@core/main/lib/decorator/task";
import * as Device from "expo-device";
import {ClientNotice} from "~gql/api";


export class PushStore extends CommonStore {

    receiveListener: any = null
    responseListener: any = null
    items: TPushNotification[] = []
    registered: boolean | null = null

    @observable
    pushToken: any = null

    @observable
    requestDenied: boolean = false

    constructor() {
        super()
        makeObservable(this)
        makePersistable(this, {
            name: PushStore.name,
            properties: [
                'pushToken',
            ],
        })
    }

    async setup() {
        await this.register()
        this.bus().emitter.on('bus:app.foreground', () => this.onAppForeground())
    }

    onAppForeground() {

    }

    notificationPrepare(notification: Notification) {

        const identifier = notification.request.identifier

        const {content} = notification.request

        const pushData = content.data || {}

        const push: TPushNotification = {
            id: identifier,
            type: pushData.type as any,
            notification,
        }

        if (push.type === 'notice') {
            push.notice = {
                title: content.title || undefined,
                message: content.body || undefined,
                ...pushData
            } as ClientNotice
        }

        return push
    }

    addItem(notification: Notification) {

        const identifier = notification.request.identifier

        let push = this.items.find(item => item.id === identifier)

        if (push)
            return push

        push = this.notificationPrepare(notification)

        this.items.push(push)

        return push
    }

    onReceive(notification: Notification) {
        const push = this.addItem(notification)
        this.stores().debug.info('PUSH onReceive', {push})
        if (push.type === 'notice') {
            this.stores().notice.onEventNewNotice(push.notice)
        }
    }

    onResponse(notification: Notification) {
        const push = this.addItem(notification)
        this.stores().debug.info('PUSH onResponse', {push})
        if (push.type === 'notice') {
            this.stores().notice.onEventNewNotice(push.notice)
        }
    }

    async register(requestPermissions: boolean = false, showGreet = false) {

        if (this.registered)
            return true;

        if (!Device.isDevice) {
            this.stores().debug.info('Push token: skip, NOT physical device', {}, {})
            this.registered = true
            return false
        }

        let isGranted = await this.isGranted()

        this.stores().debug.info('Push token: register', {
            prevToken: this.pushToken,
            isGranted,
            requestPermissions,
            showGreet
        })

        if (!isGranted && requestPermissions) {

            if (this.requestDenied)
                return false

            if (showGreet) {
                Alert.alert(
                    'Разрешите доставку уведомлений',
                    'Для информировании о статусе Вашего заказа разрешите доставку увдомлений от приложения Sushi-Studio',
                    [
                        {
                            text: "Разрешить",
                            onPress: () => this.register(true),
                            style: 'default'
                        },
                        {
                            text: "Отмена",
                            style: 'cancel',
                            onPress: () => this.setRequestDenied()
                        },
                    ])
                return
            }

            isGranted = await this.requestPermissions()

            if (!isGranted)
                this.setRequestDenied()
        }

        if (!isGranted) {
            this.stores().debug.warn('Push token: NOT granted')
            return false
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        this.stores().debug.info('Push token: getExpoPushTokenAsync', {})

        const token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas.projectId,
        })

        if (token) {

            this.registered = true

            const tokenData = token.data

            this.stores().debug.info('Push token: resolved', {tokenData})

            await AysncStorage.setItem('pushToken', tokenData);

            runInAction(() => {
                this.pushToken = tokenData
            })

            this.stores().user.updatePushToken(tokenData)

            this.receiveListener = Notifications.addNotificationReceivedListener(notification => {
                this.onReceive(notification)
            })

            this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
                this.onResponse(response.notification)
            })

        } else {
            this.stores().debug.warn('Push token: rejected', {token})
        }
    }

    async isGranted() {
        const {status} = await Notifications.getPermissionsAsync();
        return status === 'granted'
    }

    async requestPermissions() {
        const {status} = await Notifications.requestPermissionsAsync();
        return status === 'granted'
    }

    unregister() {
        Notifications.removeNotificationSubscription(this.receiveListener);
        Notifications.removeNotificationSubscription(this.responseListener);
    }

    @action
    setRequestDenied() {
        this.requestDenied = true
    }
}

export default PushStore
