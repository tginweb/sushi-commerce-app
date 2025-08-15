import React, {useMemo} from "react"
import {StyleSheet} from "react-native"
import {TBuildableComponentProps} from "@core/main/types";
import {UiBuildable} from "~ui/buildable";
import {wWidth} from "~assets/design";
import {RenderersProps, RenderHTMLProps} from "react-native-render-html/src/shared-types";
import {useStores} from "~stores";
import {useServices} from "~services";
import {MixedStyleRecord} from "@native-html/transient-render-engine";
import RenderHtml, {TDefaultRenderer, TNode} from "react-native-render-html"
import {useApp} from "@core/main/lib/hooks/useApp";
import {CustomTagRendererRecord} from "react-native-render-html/src/render/render-types";

export type UiHtmlBaseProps = RenderHTMLProps & {
    classesStyles?: string | MixedStyleRecord
    tagsStyles?: string | MixedStyleRecord
}

export const UiHtmlComponent: React.FC<UiHtmlBaseProps> = (props) => {

    const {
        contentWidth,
        classesStyles = 'default',
        tagsStyles = 'default',
        ...rest
    } = props

    const app = useApp()

    const {imager, html} = useServices()

    const {menu} = useStores()

    const _contentWidth = contentWidth || wWidth

    const renderersProps = useMemo<Partial<RenderersProps>>(() => {
        return {
            a: {
                onPress(event: any, url: string, htmlAttribs: any, target: any) {
                    menu.runActionItem({
                        url: url
                    })
                }
            }
        }
    }, [])

    const renderers = useMemo<CustomTagRendererRecord>(() => {
        return {
            data: (
                {
                    TDefaultRenderer,
                    tnode,
                    ...props
                }: {
                    TDefaultRenderer: TDefaultRenderer<any>
                    tnode: TNode
                },
            ) => {
                const comName = tnode?.attributes?.com
                const comInfo = app.componentInfo[comName]
                const Component = comInfo && comInfo.renderer ? comInfo.renderer : <></>

                return <Component/>
            }
        }
    }, [])

    const _tagsStyles = useMemo<MixedStyleRecord>(() => {
        return html.getTagsStyles(tagsStyles)
    }, [tagsStyles])

    const _classesStyles = useMemo<MixedStyleRecord>(() => {
        return html.getClassesStyles(classesStyles)
    }, [classesStyles])


    return <RenderHtml
        classesStyles={_classesStyles}
        tagsStyles={_tagsStyles}
        renderersProps={renderersProps}
        renderers={renderers}
        contentWidth={_contentWidth}
        {...rest}
    />
}

export type UiHtmlProps = UiHtmlBaseProps & TBuildableComponentProps

export const UiHtml: React.FC<UiHtmlProps> = (props) => {
    return props.templatableProps || props.condition ?
        <UiBuildable
            Component={UiHtmlComponent}
            {...props}
        />
        :
        <UiHtmlComponent {...props}/>
}

const styles = StyleSheet.create({})

