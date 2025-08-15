import {action, makeObservable, observable} from "mobx"
import {
    TBuilderFieldParents,
    TBuilderItem,
    TBuilderProps,
    TContentBuilderRenderer,
    TContentBuilderRendererProps
} from "~ui/content-builder/types";
import deepSet from "lodash/set";
import deepGet from "lodash/get";
import {View} from "react-native-ui-lib";
import {UiCard} from "~ui/card";
import {ScrollView} from "react-native";
import React from "react";
import {TValidateErrors} from "@core/main/types";
import {useBuilderParser} from "~ui/content-builder/util";

export class ContentBuilder {

    static renderers: Record<string, TContentBuilderRenderer> = {}

    schema: TBuilderItem[] = []
    fieldsRef: any = {}
    refs: any = {}

    //@observable
    components: any = {}

    @observable
    vars: any = {}

    @observable
    fieldsValue: any = {}

    @observable
    name?: string

    @observable
    inited?: boolean

    @observable
    version: number = 1

    @observable
    data: any = {}

    constructor(props?: TBuilderProps) {
        if (props)
            this.init(props)
        makeObservable(this)
    }

    static registerRenderer(name: string, renderer: TContentBuilderRenderer) {
        ContentBuilder.renderers[name] = renderer
    }

    @action
    init(props: TBuilderProps) {
        if (this.inited)
            return;
        const {
            datasources = {},
            components = {},
            schema = [],
            fieldsValue = {},
            deps,
            data,
            vars,
            refs = {
                current: {}
            },
            fieldsRef = {
                current: {}
            },
        } = props

        this.schema = schema ? (typeof schema === 'string' ? useBuilderParser(schema) : schema) : []
        this.fieldsValue = fieldsValue
        this.fieldsRef = fieldsRef
        this.refs = refs
        this.components = components
        this.data = data || {}
        this.vars = vars || {}
        this.inited = true
    }

    @action
    commitVersion() {
        this.version++
    }

    @action
    setComponent(name: string, com: any) {
        this.components[name] = com
    }

    @action
    setComponents(components: Record<string, any>) {
        Object.assign(this.components, components)
    }

    @action
    assignData(data: any) {
        Object.assign(this.data, data)
        this.version++
    }

    @action
    setSchemaIfNeed(schema: TBuilderItem[] | undefined) {
        if (schema && (!this.schema || !this.schema.length))
            this.setSchema(schema)
    }

    @action
    setSchema(schema: TBuilderItem[] | undefined) {
        if (schema) {
            this.schema = schema ? (typeof schema === 'string' ? useBuilderParser(schema) : schema) : []
            this.version++
        }
    }

    @action
    fieldSetValue(name: string, value: any) {
        deepSet(this.fieldsValue, name, value)
    }

    @action
    fieldGetValue(name: string) {
        return deepGet(this.fieldsValue, name)
    }

    @action
    fieldEnsureRow(name: string) {
        const val = deepGet(this.fieldsValue, name)
        if (!val || !Array.isArray(val)) {
            const arr: any = []
            deepSet(this.fieldsValue, name, arr)
            return arr
        } else {
            return val
        }
    }

    @action
    fieldAddRow(name: string) {
        const rows = this.fieldEnsureRow(name)
        const row = {}
        rows.push(row)
        deepSet(this.fieldsValue, name, rows)
        return row
    }

    @action
    fieldDeleteRow(name: string, index: number) {
        const rows = this.fieldEnsureRow(name)
        rows.splice(index, 1)
        deepSet(this.fieldsValue, name, rows)
    }


    validate(collector: TValidateErrors = []) {

        let errors: any = []

        for (const [fieldPath, fieldRef] of Object.entries(this.fieldsRef.current)) {
            if (fieldRef) {
                // @ts-ignore
                if (fieldRef.validate) {
                    // @ts-ignore
                    const res = fieldRef.validate()
                    if (res && res !== true && Array.isArray(res)) {
                        errors = [...errors, ...res]
                    }
                }
            }
        }

        Array.prototype.push.apply(collector, errors)

        return !errors.length
    }

    render() {
        return this.schema.length ? this.renderItems(this.schema, [], 0) : null
    }

    renderItems(items: TBuilderItem[] | React.ReactNode | string | undefined, fieldParents: TBuilderFieldParents = [], index?: number) {

        if (items) {
            if (typeof items === 'string') {
                return items
            } else if (Array.isArray(items) && items.length) {
                if (items.length === 1) {
                    return this.renderItem(items[0], fieldParents, 0)
                } else {
                    return items.map((item, itemIndex) => {
                        return this.renderItem(item, fieldParents, itemIndex)
                    })
                }
            }
        }
    }

    wrapItem(content: any, item: TBuilderItem, key: string) {

        if (content) {
            switch (item.wrapper) {
                case 'view':
                    return <View
                        key={key}
                        {...item.wrapperProps}
                        {...item.wrapperModifiers}
                    >{content}</View>
                case 'card':
                    return <UiCard
                        key={key}
                        {...item.wrapperProps}
                        {...item.wrapperModifiers}
                    >{content}</UiCard>
                case 'scroll-view':
                    return <ScrollView
                        key={key}
                        {...item.wrapperProps}
                        {...item.wrapperModifiers}
                    >{content}</ScrollView>
                default:
                    return content
            }
        }
    }

    renderItem(item: TBuilderItem, fieldParents: TBuilderFieldParents = [], index: number) {

        const renderer = ContentBuilder.renderers[item.type]

        if (renderer) {

            const level = this.treeLevel(item, fieldParents, index)

            const {fieldPath, fieldKey, value} = level

            const properties: any = {}

            if (item.ref) {
                properties.ref = (r: any) => item.ref && (this.refs.current[item.ref] = r)
            }

            const props: TContentBuilderRendererProps = {
                item,
                properties,
                fieldPath,
                fieldKey,
                value,
                handleChange: (v: any) => {
                    this.fieldSetValue(fieldPath, v)
                },
                handleBlur: (e: any) => {

                },
                fieldsRef: this.fieldsRef,
                fieldParents: fieldParents,
                vars: this.vars,
                depVal: this.getDepPropVal(item),
                builder: this
            }

            return this.wrapItem(renderer(props), item, fieldKey)
        }
    }

    treeLevel(item: TBuilderItem, fieldParents: TBuilderFieldParents = [], index: number) {
        let path = [...fieldParents]
        if (item.field) {
            path.push(item.field)
        }
        const pathStr = path.join('.')
        const value = deepGet(this.fieldsValue, pathStr)
        return {
            path: path,
            fieldPath: pathStr,
            fieldKey: pathStr + index,
            value
        }
    }

    getDepPropVal(item: TBuilderItem) {
        let res: any = null
        if (item.depDataKeys && item.depDataKeys.length) {
            res = {}
            for (const key of item.depDataKeys) {
                res[key] = this.data[key]
            }
        }

        return res
    }
}

