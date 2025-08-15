import React from "react"
import {IService, TAppServices, TVoid} from "@core/main/types"

import {app} from "~modules/info"

export const services: TAppServices = app.getServices()

export const graphql = services.graphql
export default services

const servicesContext = React.createContext<TAppServices>(services);
export const ServicesProvider = ({children}: any) => (
    <servicesContext.Provider value={services}>{children}</servicesContext.Provider>
)
export const useServices = (): TAppServices => React.useContext(servicesContext);

export const bootServices = async (): TVoid => {
    for (const key in services) {
        if (Object.prototype.hasOwnProperty.call(services, key)) {
            const s = (services as any)[key] as IService;
            if (s.boot && !s.booted) {
                s.boot()
                s.booted = true
            }
        }
    }
}

export const initServices = async (): TVoid => {
    for (const key in services) {
        if (Object.prototype.hasOwnProperty.call(services, key)) {
            const s = (services as any)[key] as IService;
            if (s.init && !s.inited) {
                s.init()
                s.inited = true
            }
        }
    }
}
