//import {IconComponent} from "~ui/icon"
import {IService, TVoid} from "@core/main/types"


export class OnStartService implements IService {
    private inited = false;

    init = async (): TVoid => {
        if (!this.inited) {
            this.incAppLaunches();

            await this.loadAssets();

            this.inited = true;
        }
    };

    private loadAssets = async () => {
        // const fonts = [IconComponent.font];

        // const fontAssets = fonts.map(font => Font.loadAsync(font));

        // await Promise.all([...fontAssets]);
    };

    private incAppLaunches() {
        const {ui} = require('~stores').stores;
        ui.set('appLaunches', ui.appLaunches + 1);
    }
}
