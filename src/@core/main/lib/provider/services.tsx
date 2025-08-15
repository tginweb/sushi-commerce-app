import React from "react";

export function provider<T>(services: T) {
    const context = React.createContext<T>(services)

    return ({children}: any) => (
        <context.Provider value={services}>{children}</context.Provider>
    );
}



