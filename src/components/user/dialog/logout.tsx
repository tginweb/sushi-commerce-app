import React from "react"
import {observer} from "mobx-react"
import {useStores} from "~stores";
import {UiDialog} from "~ui/dialog"
import {Text} from "react-native-ui-lib"
import AppConfig from "@core/main/config";

type TProps = {}

export const LogoutDialog: React.FC<TProps> = observer((props) => {

    const {logoutDialog, user, router} = useStores()

    const onSuccess = async () => {
        await user.logout()
        router.push(AppConfig.APP_FRONT_PAGE)
    }

    return (
        <UiDialog
            title={'Выход из профиля'}
            visible={logoutDialog.visible}
            onClose={() => logoutDialog.hide()}
            onSuccess={onSuccess}
            actionSuccess={{label: 'Выйти'}}
            actionCancel={{label: 'Остаться'}}
        >
            <Text font-size-md>Вы уверены что хотите выйти из своего аккаунта?</Text>
        </UiDialog>
    )
})

export default LogoutDialog

