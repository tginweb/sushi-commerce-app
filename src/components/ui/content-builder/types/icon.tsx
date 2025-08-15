import React, {Fragment} from "react";
import {TBuilderItemField, TContentBuilderRendererProps} from "~ui/content-builder/types";
import {TIconProps} from "@core/main/types";
import icons from "~assets/icons-map";

export type TBuilderItemIcon = TBuilderItemField & {
    type: 'icon'
    props?: TIconProps & {
        name: string
    }
}

export function render({fieldKey, fieldParents, item, builder}: TContentBuilderRendererProps<TBuilderItemIcon>) {
    const props: any = item.props || {}
    const iconName = props.name
    const icon = icons[iconName as keyof typeof icons]
    return icon && <Fragment
        key={fieldKey}
    >
        {icon(item.props || {})}
    </Fragment>
}

