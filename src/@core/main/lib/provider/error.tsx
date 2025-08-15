import React from "react";
import {TMessage} from "@core/main/types";

type TErrorContext = {
    error: TMessage | null
}

const ErrorContext = React.createContext<TErrorContext>({
    error: null
})

export const ErrorProvider = ({children, error}: any) => {
    return <ErrorContext.Provider value={{error}}>
        {children}
    </ErrorContext.Provider>
}

export const useError = (): TErrorContext => React.useContext(ErrorContext);
