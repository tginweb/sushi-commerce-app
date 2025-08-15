import React from "react";
import {TBuilderItemField, TContentBuilderRendererProps} from "~ui/content-builder/types";
import {RenderHTMLProps} from "react-native-render-html/src/shared-types";
import {wWidth} from "~assets/design";
import {UiHtml} from "~ui/html";

export type TBuilderItemHtml = TBuilderItemField & {
    type: 'html'
    props?: Partial<RenderHTMLProps>
    content?: string
}

export function render({fieldKey, item}: TContentBuilderRendererProps<TBuilderItemHtml>) {
    return <UiHtml
        key={fieldKey}
        {...item.props}
        contentWidth={item.props?.contentWidth || wWidth}
        source={{html: item.content || ''}}
    />
}
