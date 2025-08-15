import {IReactionDisposer} from "mobx";

export class Model {
    disposers: IReactionDisposer[] = []
    ID: number = 0
    NAME: string = ''

    getImagePrefetchUrl(): string | null | undefined {
        return null
    }

    stores() {
        return require('~stores').stores
    }
}

