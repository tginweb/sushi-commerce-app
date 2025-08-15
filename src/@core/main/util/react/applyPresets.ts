import {TPresetName} from "@core/main/types";

export default function applyPresets(props: any, presets?: TPresetName, presetsMap?: any): any {

    const res: any = {
        styles: {}
    }

    let _presets: string[] = presets ? (!Array.isArray(presets) ? [presets] : presets) : []

    _presets = ['default', ..._presets]

    _presets.forEach((presetCode: string) => {

        let preset = presetsMap[presetCode]

        if (preset) {

            preset = preset(props)

            for (const [fieldKey, fieldValue] of Object.entries(preset)) {

                if (fieldKey === 'styles') {
                    for (const [styleProp, stylePropValue] of Object.entries(fieldValue as object)) {
                        if (!res.styles[styleProp]) {
                            res.styles[styleProp] = []
                        }
                        res.styles[styleProp].push(stylePropValue)
                    }
                } else {
                    if (typeof res[fieldKey] ===  'object' && typeof fieldValue === 'object') {
                        res[fieldKey] = {
                            ...res[fieldKey],
                            ...fieldValue
                        }
                    } else {
                        res[fieldKey] = fieldValue
                    }
                }
            }

        }
    })

    return res
}
