import React, {useImperativeHandle} from "react"
import {ISectionContext, Section, TSectionProps} from "./section"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {UiTextField, UiTextFieldApi} from "~ui/text-field";
import {INPUT_MASK_PHONE} from "~assets/config";
import {UiBtn} from "~ui/btn";
import {COLORS, TYPOGRAPHY} from "~assets/design";
import checkPhone from "@core/main/util/validate/checkPhone";
import {View} from "react-native-ui-lib";
import {StyleProp, TextStyle} from "react-native";
import {TValidatableComponentHandle} from "@core/main/types";

export const SectionPhoneInner: React.FC<TSectionProps> = (props, ref) => {
    const {vorder, user} = useStores()

    const sectionRef = React.useRef<TValidatableComponentHandle>()
    const inputRef = React.useRef<UiTextFieldApi>(null as any)
    const phoneValid = checkPhone(vorder.attrValue['PHONE'])

    useImperativeHandle<any, any>(ref, () => inputRef.current)

    const onChangePhone = (v: string) => {
        vorder.setPropValue('PHONE', v)
        vorder.validateReset('person')
    }

    const slotContent = (ctx: ISectionContext, style: StyleProp<TextStyle>, renderedValidate: any) => {
        return <View gap-6>

            <UiTextField
                ref={inputRef}
                floatingPlaceholder
                placeholder={'Ваш телефон'}
                presets={['outline', 'sm']}
                value={vorder.attrValue['PHONE']}
                keyboardType={'phone-pad'}
                mask={INPUT_MASK_PHONE}
                required={true}
                onChangeText={onChangePhone}
            />

            {renderedValidate}

            {phoneValid &&
                <UiBtn
                    onPress={() => vorder.navLogin()}
                    marginT-10
                    marginB-3
                    backgroundColor={COLORS.colorAspid}
                    outlineColor={COLORS.colorAspid}
                    label={'Войти для использования бонусов и скидок'}
                    labelProps={{
                        numberOfLines: 2
                    }}
                    labelStyle={{
                        ...TYPOGRAPHY['text-sm-lh2'],
                        textAlign: 'center'
                    }}
                />
            }
        </View>
    }

    return <Section
        contentSlot={slotContent}
        validate={() => vorder.vorderValidate('person')}
        validateResult={vorder.validateResult.person}
        ref={sectionRef}
        raw={true}
        wrap={true}
        {...props}
    />
}

// @ts-ignore
export const SectionPhone = observer(React.forwardRef(SectionPhoneInner))
