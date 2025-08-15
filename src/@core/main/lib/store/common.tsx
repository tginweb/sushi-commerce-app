import {IStore, TStoreKeysOf, TVoid} from "@core/main/types";
import {hydrateStore} from "mobx-persist-store";
import {IReactionDisposer} from "mobx";

class CommonStore implements IStore {

    booted: boolean = false
    inited: boolean = false

    disposers: IReactionDisposer[] = []
    isObservable: boolean = false

    bus() {
        return this.services().bus
    }

    services() {
        return require('~services').services
    }

    stores() {
        return require('~stores').stores
    }

    hydrate = async (): TVoid => {
        await hydrateStore(this);
    };

    // Unified set methods
    set<T extends TStoreKeysOf<CommonStore>>(what: T, value: CommonStore[T]) {
        (this as CommonStore)[what] = value;
    }

    setMany<T extends TStoreKeysOf<CommonStore>>(obj: Record<T, CommonStore[T]>) {
        for (const [k, v] of Object.entries(obj)) {
            this.set(k as T, v as CommonStore[T]);
        }
    }
}

export default CommonStore
