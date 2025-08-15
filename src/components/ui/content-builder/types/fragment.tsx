import React, {Fragment} from "react";
import {TBuilderItem, TBuilderItemField, TContentBuilderRendererProps} from "~ui/content-builder/types";
import {TextProps} from "react-native-ui-lib";

export type TBuilderItemFragment = TBuilderItemField & {
    type: 'fragment'
    props?: TextProps
    content?: string
    children: TBuilderItem[]
}

export function render({fieldKey, fieldParents, item, builder}: TContentBuilderRendererProps<TBuilderItemFragment>) {
    return <Fragment key={fieldKey}>
        {item.content ? item.content : builder.renderItems(item.children, fieldParents)}
    </Fragment>
}
