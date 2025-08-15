import React, {PropsWithChildren} from "react"
import {ApolloProvider} from "@apollo/client"
import {BottomSheetModalProvider} from "~ui/bottom-sheet-vendor"
import services, {ServicesProvider} from "~services"
import {StoresProvider} from "~stores"
import {ToastProvider} from "~ui/toast"
import {SelectProvider} from "~ui/select-pro"
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Text, View} from "react-native-ui-lib";

function logError(error: Error, errorInfo: string) {
    console.log({
        error,
        errorInfo
    })
}

const ErrorFallback = (props: any) => (
    <View style={{}}>
        <Text style={{}}>Something happened!</Text>
        <Text style={{}}>{props.error.toString()}</Text>
    </View>
)


export const AppProviders: React.FC<PropsWithChildren<{}>> = ({children}) => {

    console.log('AppProviders REDRAW')

    return <SafeAreaProvider>
        <StoresProvider>
            <BottomSheetModalProvider>
                <ApolloProvider client={services.graphql.client}>
                    <ServicesProvider>
                        <ToastProvider>
                            <SelectProvider>
                                {children}
                            </SelectProvider>
                        </ToastProvider>
                    </ServicesProvider>
                </ApolloProvider>
            </BottomSheetModalProvider>
        </StoresProvider>
    </SafeAreaProvider>
}
