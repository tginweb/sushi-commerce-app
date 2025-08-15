import {
    TAppServices,
    TAppStores,
    TComponentInfo,
    TComponentRenderers,
    TComponentRenderFunc,
    TDeferredFetchTask
} from "@core/main/types";
import {AppStores} from "./app-stores";
import {AppServices} from "@core/main/lib/app-services";
import deepGet from "lodash/get";
import {deferredFetchTasks} from "@core/sale/module";


export default class App {

    data: any
    registry: any = []
    modulesRefs: any = []
    modules: any = []
    modulesCallbacks: any = {
        boot: [],
        request: [],
        stores: [],
        scopeQuery: [],
        deferredFetchTasks: [],
        modals: [],
        informers: [],
        guardAccess: [],
        routes: [],
        routesPrebuild: [],
        scopes: [],
        widgets: [],
        routerInit: [],
        routerAfterEach: [],
        busComponents: [],
        componentsRegister: []
    }
    scaned: boolean = false
    scopes: any = null
    hooks: any = {}
    appScope: any = null
    context: any = null

    routeOptions: any = {}

    constructor(data = {}) {

    }

    registerModules(items: any) {
        for (const item of items) {
            this.registry.push(item)
            this.modulesRefs.push(item.module)
        }
    }

    getModules() {
        return this.modulesRefs.map((ref: any) => ref())
    }

    scanModules() {

        const scan = (tree: any, contextOptions: any) => {

            tree.forEach((mod: any) => {

                let module, options

                if (Array.isArray(mod)) {

                    module = mod[0]

                    if (!module) return;

                    let localOptions

                    localOptions = mod[1] || {}

                    options = {
                        ...contextOptions,
                        ...localOptions
                    }

                    if (module.register) {
                        options = module.register(options)
                    }

                } else {
                    module = mod

                    if (!module) return;

                    if (module.register) {
                        options = {
                            ...contextOptions,
                        }
                        options = module.register(options)
                    } else {
                        options = contextOptions
                    }
                }

                const moduleKeys = Object.keys(module)

                for (let key of moduleKeys) {
                    if (this.modulesCallbacks[key]) {
                        this.modulesCallbacks[key].push([module[key], options])
                    }
                }

                if (module.children) {
                    const children = module.children(options, this)
                    scan(children, options)
                }
            })
        }

        scan(this.getModules(), {})

        this.scaned = true
    }

    getCallbacks(name: string) {

        if (!this.scaned)
            this.scanModules()

        return this.modulesCallbacks[name]
    }

    applyFilters(name: string, val: any, ...args: any) {

        const callbacks = this.getCallbacks(name)

        if (callbacks) {
            for (const cb of callbacks) {
                const self = {
                    $app: this,
                    options: cb[1],
                }
                val = cb[0].apply(self, [...[val], ...args])
            }
        }

        if (this.hooks[name]) {
            for (const cb of this.hooks[name]) {
                const self = {
                    $app: this,
                    options: cb[1],
                }
                val = cb.apply(self, [...[val], ...args])
            }
        }

        return val
    }

    runCallbacks(name: string, ...args: any) {

        const callbacks = this.getCallbacks(name)

        for (const cb of callbacks) {
            const self = {
                $app: this,
                options: cb[1]
            }
            cb[0].apply(self, args)
        }

        return args[0]
    }

    onBoot(ctx: any) {
        this.runCallbacks('boot', ctx)
    }

    scopeQuery(query: any, scope: string) {
        return this.applyFilters('scopeQuery', query, scope as any)
    }

    getStores() {
        return require('~stores').stores
    }

    async runDeferredFetchTask(task: TDeferredFetchTask) {
        const stores = this.getStores()
        const needRun = !task.condition || task.condition()
        stores.debug.info('Deferred task: ' + task.name, {needRun}, {scope: 'boot'})
        if (needRun) {
            await task.task.apply(this as any, task.args)
            if (task.onResolve)
                task.onResolve()
        }
    }

    runDeferredFetchTasks() {
        const tasks = this.getDeferredFetchTasks()
        const stores = this.getStores()
        stores.debug.info('runDeferredFetchTasks', {tasks}, {scope: 'boot'})
        tasks.forEach(async (task) => this.runDeferredFetchTask(task))
    }

    getDeferredFetchTasks() {
        const tasks: TDeferredFetchTask[] = []
        this.applyFilters('deferredFetchTasks', tasks, this.getStores())
        return tasks
    }

    getModals() {
        const modals: TComponentRenderers = []
        this.runCallbacks('modals', modals as any)
        return modals
    }

    createStores(): TAppStores {
        // @ts-ignore
        const map: TAppStores = new AppStores()

        for (const [storeName, storeClass] of Object.entries(this.getStoresClasses())) {
            // @ts-ignore
            map[storeName as keyof TAppStores] = new storeClass()
        }

        return map
    }

    getStoresClasses() {

        let res = {}

        for (const info of this.registry) {
            if (info.stores) {
                const cbResult = info.stores()
                if (cbResult) {
                    res = {
                        ...res,
                        ...cbResult
                    }
                }
            }
        }

        return res
    }

    getServices(): TAppServices {

        // @ts-ignore
        let map: TAppServices = new AppServices()

        for (const info of this.registry) {
            if (info.services) {
                const cbResult = info.services()
                if (cbResult) {
                    for (const [key, val] of Object.entries(cbResult)) {
                        // @ts-ignore
                        map[key] = val
                    }
                }
            }
        }

        return map
    }

    getInformers() {
        const components: TComponentRenderers = []
        this.runCallbacks('informers', components as any)
        return components
    }

    getBusComponents(): TComponentRenderFunc[] {
        const components: TComponentRenderFunc[] = []
        this.runCallbacks('busComponents', components as any)
        return components
    }

    addFilter(name: string, cb: any) {
        this.hooks[name] = this.hooks[name] || []
        this.hooks[name].push(cb)
    }

    isDev() {
        return process.env.DEV
    }

    componentInfo: Record<string, TComponentInfo> = {}

    getComponentRenderers(wrapper?: any, lowercase = false) {
        const res: any = {}
        for (const [name, info] of Object.entries(this.componentInfo)) {
            if (info.renderer)
                res[lowercase ? name.toLowerCase() : name] = wrapper ? (props: any) => wrapper(props, info.renderer) : info.renderer
        }
        return res
    }

    registerComponent(componentName: string, renderer: any) {
        if (!this.componentInfo[componentName]) {
            this.componentInfo[componentName] = {
                renderer: renderer,
                presets: {}
            }
        }
    }

    addPresets(componentName: string, presets: any) {
        for (const [presetName, presetConfig] of Object.entries(presets)) {
            this.addPreset(componentName, presetName, presetConfig)
        }
    }

    addPreset(componentName: string, preset: string, config: any) {
        if (!this.componentInfo[componentName]) {
            this.componentInfo[componentName] = {
                presets: {}
            }
        }
        if (!this.componentInfo[componentName].presets[preset]) {
            this.componentInfo[componentName].presets[preset] = {}
        }
        this.componentInfo[componentName].presets[preset] = config
    }

    getPresets(componentName: string, preset?: string) {
        if (preset) {
            return deepGet(this.componentInfo, [componentName, 'presets', preset])
        } else {
            return deepGet(this.componentInfo, [componentName, 'presets'])
        }
    }

    setRouteOptions(routePath: string, options: any = {}) {
        this.routeOptions[routePath] = options
    }

    setRoutesOptions(map: any) {
        for (const [routePath, options] of Object.entries(map)) {
            this.setRouteOptions(routePath, options)
        }
    }

}

