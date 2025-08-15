import React from "react"
import {IStore, TAppStores, TVoid} from "@core/main/types"

import "./_hydration"

import {app} from "~modules/info"

export const stores = app.createStores()
export default stores

const storeContext = React.createContext<TAppStores>(stores);
export const StoresProvider = ({children}: any) => (
    <storeContext.Provider value={stores}>{children}</storeContext.Provider>
);
export const useStores = (): TAppStores => React.useContext(storeContext)


export const bootStores = async (): TVoid => {
    for (const key in stores) {
        if (Object.prototype.hasOwnProperty.call(stores, key)) {
            const s = (stores as any)[key] as IStore;
            if (s.hydrate) {
                await s.hydrate();
            }
        }
    }
    for (const key in stores) {
        if (Object.prototype.hasOwnProperty.call(stores, key)) {
            const s = (stores as any)[key] as IStore
            if (s.boot && !s.booted) {
                //await s.boot()
                s.boot()
                s.booted = true
            }
        }
    }
}

export const initStores = async (): TVoid => {
    for (const key in stores) {
        if (Object.prototype.hasOwnProperty.call(stores, key)) {
            const s = (stores as any)[key] as IStore;
            if (s.init && !s.inited) {
                //await s.init()
                s.init()
                s.inited = true
            }
        }
    }
}
