import React, {useMemo} from "react"
import {StyleSheet} from "react-native"
import {ContentBuilder} from "~ui/content-builder/Builder";
import {TBuilderItem} from "~ui/content-builder/types";
import {useBuilderParser} from "~ui/content-builder/util";

export type UiContentBuilderProps = {
    vars?: any,
    content: TBuilderItem[] | string
    components?: Record<string, any>
    deps?: any
}

const UiContentRenderComponent: React.FC<UiContentBuilderProps> = (props, ref) => {

    const {
        vars,
        content,
        components,
        deps,
        ...rest
    } = props

    const schema = useMemo(() => {
        return typeof content === 'string' ? useBuilderParser(content) : content
    }, [content])


    const builder = useMemo(() => {
        return new ContentBuilder({
            components,
            vars,
            schema,
        })
    }, [content, ...(deps || [])])

    return builder.render()
}

export const UiContentRender = UiContentRenderComponent

const styles = StyleSheet.create({});

