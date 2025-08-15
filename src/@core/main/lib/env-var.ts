const { from, logger } =  require('env-var')

// @ts-ignore
import config from "react-native-expand-dotenv"

export const env = from(config, {}, logger)

export const set = (name: string, val: any) => {
    config[name] = val
}

export default env
