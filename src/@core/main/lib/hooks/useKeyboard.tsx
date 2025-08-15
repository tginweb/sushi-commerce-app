import {useEffect, useRef, useState} from "react"
import {Animated, Keyboard, Platform} from "react-native"

const useKeyboard = (platforms: string[] = ['ios', 'android']) => {

    const [state, setState] = useState<{
        willShow: boolean,
        show: boolean,
        willHide: boolean,
        hide: boolean
        height: number,
    }>({
        willShow: false,
        show: false,
        willHide: false,
        hide: true,
        height: 0
    })


    /*
    useEffect(() => {
        Animated.timing(animationHeight.current, {
            toValue: open ? keyboardHeight : 0,
            duration: 350,
            useNativeDriver: false,
        }).start()
    }, [open, keyboardHeight, animationHeight.current])

     */

    useEffect(() => {
        if (isEventRequired(platforms)) {
            const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
            const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);

            const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', keyboardWillHide);
            const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

            // cleanup function
            return () => {
                keyboardWillShowListener.remove()
                keyboardDidShowListener.remove()

                keyboardDidHideListener.remove()
                keyboardWillHideListener.remove()
            };
        } else {
            return () => {
            }
        }
    }, []);

    const isEventRequired = (platforms: any) => {
        try {
            return platforms?.map((p: string) => p?.toLowerCase()).indexOf(Platform.OS) !== -1 || !platforms;
        } catch (ex: any) {

        }
        return false;
    }

    const keyboardWillShow = (ev: any) => {
        setState({
            ...state,
            willShow: true,
            show: true
        })
    };

    const keyboardDidShow = (ev: any) => {
        setState({
            ...state,
            willShow: true,
            show: true,
            height: ev.endCoordinates.height
        })
    };

    const keyboardWillHide = () => {
        setState({
            ...state,
            willShow: false,
            show: true,
            willHide: true,
            hide: true
        })
    }

    const keyboardDidHide = () => {
        setState({
            ...state,
            height: 0,
            willShow: false,
            show: false,
            willHide: false,
            hide: true
        })
    }

    return state
};

export default useKeyboard;
