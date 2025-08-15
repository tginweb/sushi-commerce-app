import React from "react";
import {TAppServices} from "@core/main/types";
import services from "~services";

const servicesContext = React.createContext<TAppServices>(services);
export const ServicesProvider = ({children}: any) => (
    <servicesContext.Provider value={services}>{children}</servicesContext.Provider>
)
