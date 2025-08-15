import React, {useImperativeHandle} from "react"
import {Text} from "react-native-ui-lib"
import {Section, styles as sectionStyles, TSectionProps} from "./section"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {TValidatableComponentHandle} from "@core/main/types"
import {icons} from "~assets/icons-map"

export const SectionCommentInner: React.FC<TSectionProps> = (props, ref) => {

    const {vorder} = useStores()

    const sectionRef = React.useRef<TValidatableComponentHandle>()

    useImperativeHandle<any, any>(ref, () => sectionRef.current)

    const commentFormatted = vorder.attrValue['USER_DESCRIPTION'] ? vorder.attrValue['USER_DESCRIPTION'].replace(/[\n\s]+/s, ' ') : ''

    return (
        <Section
            dialogId={'comment'}
            title={'Комментарий'}
            icon={icons.commentDots}
            rules={vorder.rulesCutlery}
            value={vorder.attrValue['USER_DESCRIPTION']}
            ref={sectionRef}
            wrap={true}
            //sideSlot={slotSide}
            {...props}
        >
            {
                vorder.attrValue['USER_DESCRIPTION'] ?
                    <Text
                        text-3xs-lh1
                        numberOfLines={2}
                        style={{
                            flexGrow: 1,
                            flex: 1
                        }}
                    >
                        {commentFormatted}
                    </Text>
                    :
                    <Text style={sectionStyles.content}>указать детали</Text>
            }
        </Section>
    )
}

// @ts-ignore
export const SectionComment = observer(React.forwardRef(SectionCommentInner))
