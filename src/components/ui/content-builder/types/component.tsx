import {TBuilderItemField, TContentBuilderRendererProps} from "~ui/content-builder/types";
import reactRenderer from "@core/main/util/react/render";

export type TBuilderItemComponent = TBuilderItemField & {
    type: 'component'
    props?: any
    component: string
}

export function render({item, builder, depVal, fieldKey}: TContentBuilderRendererProps<TBuilderItemComponent>) {
    const componentName = item.props.name || item.component
    const component = builder.components[componentName]
    if (!component)
        return null
    return reactRenderer(component, {
        key: fieldKey,
        dep: depVal,
        ...(item.props || {})
    })
}
