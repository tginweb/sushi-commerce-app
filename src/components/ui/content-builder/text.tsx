import React, {useMemo} from "react"
import {StyleSheet} from "react-native"
import {ContentBuilder} from "~ui/content-builder/Builder";
import {TBuilderItem} from "~ui/content-builder/types";
import {useBuilderParser} from "~ui/content-builder/util";
import {Text, TextProps} from "react-native-ui-lib";

export type UiContentBuilderProps = {
    content: TBuilderItem[] | string
    components?: Record<string, any>
    textWrapper?: () => any
    textProps?: TextProps
}

export const UiContentRenderText: React.FC<UiContentBuilderProps> = (props, ref) => {

    const {
        content,
        components,
        textWrapper,
        textProps,
        ...rest
    } = props

    const _textWrapper = textWrapper ? textWrapper : (content: any) => {
        return <Text {...textProps}>{content}</Text>
    }

    const needTextWrapper = useMemo(() => {
        if (typeof content === 'string') {
            let _content = content.trim()
            return _content[0] !== '<'
        } else {
            return false
        }
    }, [content])

    const schema = useMemo(() => {
        return typeof content === 'string' ? useBuilderParser(content) : content
    }, [content])

    const builder = useMemo(() => {
        return new ContentBuilder({
            components,
            schema
        })
    }, [content])

    return needTextWrapper ? _textWrapper(builder.render()) : builder.render()
}

const styles = StyleSheet.create({});

