import React, {useCallback, useEffect, useImperativeHandle, useRef, useState} from "react"
import {UiTextField, UiTextFieldApi, UiTextFieldProps} from "./text-field"
import axios from "axios"
import {DaDataAddress} from "@core/main/types/dadata"
import {TNullable, TValidateRules} from "@core/main/types"
import {useDebounceCallback} from "@core/main/lib/hooks/useDebounceCallback";
import {cleanLocalAddress} from "@core/geo/util/cleanLocalAddress";
import {NativeSyntheticEvent, TextInputFocusEventData} from "react-native";

export type UiAddressInputProps = UiTextFieldProps & {
    fromBound?: any
    toBound?: any
    onChangeValue?: ((v: any) => void) | undefined
    addressOptionLabel?: string
    addressOptionValue?: string
    locations?: any
    location?: any
    streetFiasId?: any
    settlementFiasId?: any
    house?: any
    hideLocalOnBlur?: boolean
}

export type UiAddressInputOption = {
    label: string
    value: string,
    data: DaDataAddress
}

export type UiTAddressInputApi = UiTextFieldApi & {}

export const UiAddressInputComponent: React.FC<UiAddressInputProps> = (props, ref) => {
    const {
        onFocus,
        validateOnBlur = true,
        onChangeValue,
        addressOptionLabel = 'value',
        addressOptionValue = 'value',
        onChangeText,
        rules,
        hideLocalOnBlur,
        fromBound,
        toBound,
        location,
        locations = [
            {
                "region": "Иркутская",
                "city": "Иркутск"
            },
            {
                "region": "Иркутская",
                "area": "Иркутский"
            },
            {
                "region": "Иркутская",
                "settlement": "Мегет"
            },
            {
                "kladr_id": "3800100200000"
            },
            {
                "kladr_id": "3800100009200"
            },
            {
                "kladr_id": "3800100003900"
            },
            {
                "kladr_id": "3800100004800"
            },
            {
                "kladr_id": "3800001500000"
            },
            {
                "kladr_id": "3800100010800"
            },
            {
                "kladr_id": "3800100001600"
            }

        ]
    } = props

    let queryToken: any = null

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [options, setOptions] = useState<UiAddressInputOption[]>([])

    let initialText = props.value || ''
    let initialTextBeforeClean = ''

    if (hideLocalOnBlur) {
        const [strCleaned, strLocal] = cleanLocalAddress(initialText, 'city')
        if (strLocal) {
            initialText = strCleaned
            initialTextBeforeClean = strCleaned
        }
    }

    const [text, setText] = useState<string>(initialText)
    const textBeforeClean = useRef<string | null>(initialTextBeforeClean)

    const [valueText, setValueText] = useState(props.value)
    const [valueHouse, setValueHouse] = useState(props.house)

    const [value, setValue] = useState<UiAddressInputOption>()

    const inputRef = useRef<UiTextFieldApi>(null)

    const _rules: TValidateRules = rules || []

    _rules.push(v => !!valueText || 'Не выбран адрес')
    _rules.push(v => !!valueHouse || 'Не выбран дом')

    const updateText = (newText?: string) => {
        let _newText = newText || ''
        if (hideLocalOnBlur) {
            const [strCleaned, strLocal] = cleanLocalAddress(_newText, 'city')
            if (strLocal) {
                textBeforeClean.current = _newText
                _newText = strCleaned
            } else {
                textBeforeClean.current = null
            }
        }
        setText(_newText)
    }

    useEffect(() => {
        
        setValueHouse(props.house)
    }, [props.house])

    useEffect(() => {
        
        updateText(props.value)
        setValueText(props.value)
    }, [props.value])

    useImperativeHandle<any, UiTAddressInputApi>(ref, () => ({
        ...inputRef.current as any,
        clear
    }))

    const clear = useCallback(() => {
        setText('')
        setValueText('')
        textBeforeClean.current = ''
    }, [])

    const methods = {
        getSuggestionData: (data: any, field: any) => {
            if (typeof field === 'string') {
                return data[field] || data.data[field]
            } else if (typeof field === 'function') {
                return field(data)
            }
        },
        houseFormat: (val: TNullable<string>): string => {
            val = val || ''
            val = val.toUpperCase().replace(/\\/, '/').replace(/[^\d\w\.\/А-Я]/, '').trim()
            return val
        },
        querySuggestions: async (query: string, count: number = 10) => {

            return new Promise(async (resolve, reject) => {
                if (queryToken) queryToken.cancel();
                queryToken = axios.CancelToken.source()
                setIsLoading(true)
                const apiUrl = `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address`
                const apiKey = '26b365bf33da0ed78ba841536dbb413248c21ca0'
                const headers = {
                    'Authorization': `Token ${apiKey}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }

                let params: any = {};

                if (location) {
                    params.locations = [location]
                } else if (locations) {
                    params.locations = locations
                }

                params.query = query
                params.count = count

                if (fromBound)
                    params.from_bound = {"value": fromBound}

                if (toBound)
                    params.to_bound = {"value": toBound}

                axios.post(apiUrl, params, {
                    headers: headers,
                    cancelToken: queryToken.token
                }).then((response) => {

                    const suggestions = response.data.suggestions.map((suggestion: { data: DaDataAddress }) => {
                        suggestion.data.house = methods.houseFormat(suggestion.data.house)
                        return suggestion
                    })


                    if (fromBound === 'house') {

                        const queryHouse = methods.houseFormat(query)
                        const [queryHouseNumber, queryHouseSection] = queryHouse.split('/')

                        if (!suggestions.find((suggestion: {
                            data: DaDataAddress
                        }) => suggestion.data.house === queryHouse)) {

                            /*
                            let nearHouse = suggestions.find(suggestion => {
                              if (suggestion.data.house) {
                                const [houseNumber, houseSection] = suggestion.data.house.split('/')
                                if (houseNumber === queryHouseNumber) {
                                  return true
                                }
                              }
                              return false
                            })
                            */

                            let houseData = {
                                house: query
                            }
                            suggestions.push({
                                label: query,
                                value: query,
                                data: houseData
                            })
                        }
                    }
                    resolve(response.data.suggestions);
                }).catch(() => {
                    reject();
                }).then(() => {
                    setIsLoading(false)
                })
            })
        },
        filter: async (query: string): Promise<UiAddressInputOption[]> => {
            if (!query)
                return []

            let suggestions: any = await methods.querySuggestions(query)
            let options: UiAddressInputOption[] = []
            if (!suggestions.length) {
                let queryClean = query.replace(/\,?\s*(д|дом)?\.?\s*?[\d\\\/]+\s*[а-яА-я]?/, '').trim()
                suggestions = await methods.querySuggestions(queryClean)
            }
            options = suggestions.map((suggestion: any) => {
                return {
                    label: methods.getSuggestionData(suggestion, addressOptionLabel),
                    value: methods.getSuggestionData(suggestion, addressOptionValue),
                    data: suggestion.data
                }
            })
            return options
        },
        onChangeText: async (v: string) => {
            setText(v)
            onChangeText && onChangeText(v, v, v)
            methods.onChangeTextDebounced(v)
        },
        onChangeValue: (v: UiAddressInputOption) => {
            setValue(v)
            setValueText(v.value)
            setValueHouse(v.data.house)
            onChangeValue && onChangeValue(v)
        },
        onChangeTextDebounced: useDebounceCallback(async (text: string) => {
            const options = await methods.filter(text)
            setOptions(options)
        }, 1000),
        onBlur: () => {
            if (hideLocalOnBlur) {
                textBeforeClean.current = text
                const [textCleaned] = cleanLocalAddress(text, 'city')
                setText(textCleaned)
            }
        },
        onFocus: (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            onFocus && onFocus(e)
            if (textBeforeClean.current) {
                if (text)
                    setText(textBeforeClean.current)
                textBeforeClean.current = null
            }
        }
    }

    return <UiTextField
        ref={inputRef}
        {...props}
        value={text}
        blurOnSubmit={true}
        onChangeText={methods.onChangeText}
        onChangeValue={methods.onChangeValue}
        onBlur={methods.onBlur}
        onFocus={methods.onFocus}
        options={options}
        loading={isLoading}
        optionsHideOnBlur={false}
        validateOnBlur={validateOnBlur}
        rules={_rules}

        multiline={true}
        autoCorrect={false}
        spellCheck={false}
        autoComplete={'off'}

    />
}

// @ts-ignore
export const UiAddressInput = React.forwardRef<UiTAddressInputApi, UiAddressInputProps>(UiAddressInputComponent)
