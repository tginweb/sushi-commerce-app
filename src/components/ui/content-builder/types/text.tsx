import React from "react";
import {TBuilderItem, TBuilderItemField, TContentBuilderRendererProps} from "~ui/content-builder/types";
import {UiText, UiTextProps} from "~ui/text";

export type TBuilderItemText = TBuilderItemField & {
    type: 'text'
    props?: UiTextProps
    content?: string
    children: TBuilderItem[]
}

export function render({fieldKey, fieldParents, item, builder, vars}: TContentBuilderRendererProps<TBuilderItemText>) {
    const children = item.content || item.props?.children || item.children
    return <UiText
        vars={vars}
        {...item.props}
        key={fieldKey}
    >
       {builder.renderItems(children, fieldParents)}
    </UiText>
}
