import {useEffect} from "react"
import {EmitterSubscription, Keyboard, Platform} from "react-native"
import {useSharedValue, withTiming} from "react-native-reanimated";

const useKeyboardAnimatedShow = (duration: number = 300, onWill: boolean = true) => {

    const show = useSharedValue(0)


    useEffect(() => {
        

        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

        let keyboardWillShowListener: EmitterSubscription,
            keyboardWillHideListener: EmitterSubscription

        if (Platform.OS === 'ios') {
            keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
            keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', keyboardWillHide);
        }

        // cleanup function
        return () => {
            keyboardDidShowListener.remove()
            keyboardDidHideListener.remove()

            if (Platform.OS === 'ios') {
                keyboardWillShowListener.remove()
                keyboardWillHideListener.remove()
            }
        }
    }, []);


    const keyboardWillShow = (ev: any) => {
        if (onWill)
            show.value = withTiming(1, {duration})
    }

    const keyboardDidShow = (ev: any) => {
        if (!onWill || Platform.OS !== 'ios')
            show.value = withTiming(1, {duration})
    }

    const keyboardWillHide = () => {
        if (onWill)
            show.value = withTiming(0, {duration})
    }

    const keyboardDidHide = () => {
        if (!onWill || Platform.OS !== 'ios')
            show.value = withTiming(0, {duration})
    }

    return show
};

export default useKeyboardAnimatedShow;
