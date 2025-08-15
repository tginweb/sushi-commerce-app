import React from "react";
import {TBuilderItem, TBuilderItemBase, TContentBuilderRendererProps} from "~ui/content-builder/types";
import {UiCard, UiCardProps} from "~ui/card";

export type TBuilderItemCard = TBuilderItemBase & {
    type: 'card'
    props?: UiCardProps
    modifiers?: any
    children: TBuilderItem[]
}

export function render({fieldKey, item, fieldParents, properties, builder}: TContentBuilderRendererProps<TBuilderItemCard>) {
    return <UiCard
        key={fieldKey}
        {...item.props}
        {...item.modifiers}
        {...properties}
    >
        {builder.renderItems(item.children, fieldParents)}
    </UiCard>
}
