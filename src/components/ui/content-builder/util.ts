import {TBuilderItem} from "~ui/content-builder/types";
import maybeJsonDecode from "@core/main/util/base/maybeJsonDecode";
import templater from "@core/main/util/base/templater";
import {COLORS} from "~assets/design";

const {XMLParser} = require("fast-xml-parser");

const parser = new XMLParser({
    preserveOrder: true,
    ignoreAttributes: false,
    attributeNamePrefix: '',
    attributesGroupName: 'attrs',
    removeNSPrefix: true,
    allowBooleanAttributes: true,
    parseAttributeValue: true,
    trimValues: false,
    tagValueProcessor: (tagName: string, val: any) =>
        (val || '')
            .replace(/\n/g, '')
            .replace(/\s+/g, ' ')
})

const cache: any = {}


export const useBuilderParser = (xml: string) => {

    if (cache[xml])
        return cache[xml]

    const vars = {
        COLORS
    }

    const buildNodes = (items: any) => {

        const res: TBuilderItem[] = []

        items.forEach((item: any) => {

            let node = {} as TBuilderItem

            for (const [propName, propVal] of Object.entries(item)) {

                if (propName === ':@') {

                    // @ts-ignore
                    let attrs: any = (propVal as any)?.attrs || {}

                    for (let [attrName, attrValue] of Object.entries(attrs)) {
                        if (attrValue && typeof attrValue === 'string') {
                            attrValue = templater(attrValue, vars, undefined, '##')
                            attrValue = maybeJsonDecode(attrValue as string)
                        }
                        attrs[attrName] = attrValue
                    }

                    // @ts-ignore
                    node.props = attrs

                } else if (propName === '#text') {

                    const text = propVal ? propVal.toString() : ''
                    node.type = 'fragment'
                    if (!text.trim())
                        return;

                    // @ts-ignore
                    node.content = text
                } else {
                    node.type = propName.toLowerCase()
                    node.children = buildNodes(propVal)
                }
            }
            res.push(node)
        })
        return res
    }

    let _xml = xml.trim()

    if (_xml[0] !== '<') {
        _xml = '<Fragment>' + _xml +'</Fragment>'
    }

    let obj = parser.parse(_xml);

    cache[xml] = buildNodes(obj)

    return cache[xml]
}



