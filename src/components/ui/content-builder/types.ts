import {ViewProps} from "react-native-ui-lib";
import {ScrollViewProps} from "react-native";
import {TValidateRule} from "@core/main/types";
import {TBuilderItemFieldInput} from "~ui/content-builder/types/input";
import {TBuilderItemView} from "~ui/content-builder/types/view";
import {ContentBuilder} from "~ui/content-builder/Builder";
import {TBuilderItemFieldArray} from "~ui/content-builder/types/array";
import {TBuilderItemComponent} from "~ui/content-builder/types/component";
import {TBuilderItemCard} from "~ui/content-builder/types/card";
import {TBuilderItemFieldPicker} from "~ui/content-builder/types/picker";
import {TBuilderItemFieldDate} from "~ui/content-builder/types/date";
import {DatasourceModel} from "@core/main/model/Datasource";
import {TBuilderItemText} from "~ui/content-builder/types/text";
import {TBuilderItemHtml} from "~ui/content-builder/types/html";
import {TBuilderItemFragment} from "~ui/content-builder/types/fragment";
import {TBuilderItemIcon} from "~ui/content-builder/types/icon";

export type TContentBuilderRendererProps<T = TBuilderItem> = {
    item: T
    fieldPath: string
    fieldKey: string
    value: any
    handleChange: any
    handleBlur: any
    fieldsRef: any
    fieldParents: TBuilderFieldParents
    vars: any
    depVal: any
    builder: ContentBuilder
    properties: any
}

export type TContentBuilderRenderer = (props: TContentBuilderRendererProps) => any

export type TBuilderItem = TBuilderItemBase
    | TBuilderItemFieldInput
    | TBuilderItemView
    | TBuilderItemFieldArray
    | TBuilderItemComponent
    | TBuilderItemCard
    | TBuilderItemFieldPicker
    | TBuilderItemFieldDate
    | TBuilderItemText
    | TBuilderItemFragment
    | TBuilderItemIcon
    | TBuilderItemHtml

export type TBuilderItemBase = {
    type: string
    code?: string
    field?: string
    label?: string
    ref?: string
    wrapper?: 'view' | 'card' | 'scroll-view'
    wrapperProps?: ViewProps | ScrollViewProps
    wrapperModifiers?: any
    validationType?: string
    validations?: any
    children?: TBuilderItem[]
    skipPath?: boolean
    depDataKeys?: string[]
}


export type TBuilderItemField = TBuilderItemBase & {
    validate?: TBuilderItemFieldValidateRule[]
}

export type TBuilderItemFieldValidateRule = string | TValidateRule

export type TBuilderFieldParents = (string | number | undefined)[]

export type TBuilderProps = {
    datasources?: Record<string, DatasourceModel>
    components?: Record<string, any>
    schema?: TBuilderItem[] | string,
    fieldsValue?: any,
    fieldsRef?: any,
    refs?: any,
    deps?: any
    data?: any
    vars?: any
}
