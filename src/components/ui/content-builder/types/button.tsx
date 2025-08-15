import React from "react";
import {TBuilderItem, TBuilderItemField, TContentBuilderRendererProps} from "~ui/content-builder/types";
import {UiBtn, UiBtnProps} from "~ui/btn";

export type TBuilderItemButton = TBuilderItemField & {
    type: 'button'
    props?: UiBtnProps
    content?: string
    children: TBuilderItem[]
}

export function render({fieldKey, fieldParents, item, builder}: TContentBuilderRendererProps<TBuilderItemButton>) {
    const children = item.content || item.props?.children || item.children
    return <UiBtn
        key={fieldKey}
        {...item.props}
    >{builder.renderItems(children, fieldParents)}</UiBtn>
}
