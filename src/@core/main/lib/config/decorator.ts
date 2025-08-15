import configService, {TConfigParamInfo} from "../../service/config";

type IEnvClassOptions = {
    ns?: string
} | string

type IEnvOptions = {
    name?: string
    writable?: boolean
    server?: boolean
    default?: any
} | string

function upperSnakeCase(str: string): string {
    return str
        .split(/(?=[A-Z])/)
        .join('_')
        .toUpperCase();
}

export function Env(options?: IEnvOptions): any {
    return (target: any, key: string, descriptor: PropertyDescriptor & {initializer: any}) => {


        const className = target.constructor.name;

        if (!options) {
            options = {}
        } else if (typeof options === 'string') {
            options = {
                name: options
            }
        }

        const paramInfo: TConfigParamInfo = {
            className: className,
            classMember: key,
            ...options
        }

        configService.setParamInfo(key, paramInfo)

        let defaultValue

        if (descriptor.initializer && typeof descriptor.initializer === 'function') {
            defaultValue = descriptor.initializer()
        }

        let value = configService.get(key, defaultValue)

        const define = {}

        if (options.server || options.writable) {
            return {
                ...define,
                get: () => {
                    const val = configService.get(key, value)
                    return val
                },
                set: (val: any) => {
                    configService.set(key, val)
                },
                enumerable: true,
            }
        } else {
            return {
                ...define,
                value: value,
                writable: false,
                enumerable: true,
                configurable: true,
            }
        }
    }
}

export function EnvClass(options?: IEnvClassOptions): any {
    return (constructor: Function) => {
        //  services.config.setParamClassInfo(constructor.name, options||{})
    }
}

