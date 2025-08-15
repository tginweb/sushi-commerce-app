import CaptchaDialogStore from "@core/captcha/store/captcha-dialog";

declare module "@core/main/types" {
    interface TAppStores {
        captchaDialog: CaptchaDialogStore,
    }
}


