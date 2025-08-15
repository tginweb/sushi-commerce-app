import React from "react";
import {TBuilderItem, TBuilderItemBase, TContentBuilderRendererProps} from "~ui/content-builder/types";
import {UiView, UiViewProps} from "~ui/view";

export type TBuilderItemView = TBuilderItemBase & {
    type: 'view'
    props?: UiViewProps
    modifiers?: any
    children: TBuilderItem[]
}

export function render({fieldKey, item, fieldParents, builder, vars}: TContentBuilderRendererProps<TBuilderItemView>) {
    return <UiView
        vars={vars}
        {...item.props}
        {...item.modifiers}
        key={fieldKey}
    >
        {builder.renderItems(item.children, fieldParents)}
    </UiView>
}
