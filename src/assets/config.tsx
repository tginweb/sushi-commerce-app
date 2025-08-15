import {AppNavHeader} from "~com/app/layout/mobile/header"
import {COLORS} from "~assets/design";

export const nativeHeaderScreenOptions = () => {

    //Platform.OS !== "web" ? AppNavHeader :

    return {
        headerShown: true,
        header: (props: any) => <AppNavHeader {...props}/>,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS._black,
    }
}

export const screenOptions = () => ({
    contentStyle: {
        backgroundColor: '#eeeeee'
    }
})

export const INPUT_MASK_PHONE = ['+', '7', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]
