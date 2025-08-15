import React, {useMemo} from "react"
import {StyleSheet} from "react-native"
import {COLORS} from "~assets/design"

import {UiBottomSheet, UiBottomSheetMethods} from "~com/ui/bottom-sheet";
import {observer} from "mobx-react";
import {useStores} from "~stores";
import {useServices} from "~services";
import {UiBtnProps} from "~ui/btn";
import {UiHtml} from "~ui/html";

export const PageModal: React.FC = observer(({}) => {

    const {page, pageDialog} = useStores()
    const {imager, html} = useServices()

    const pageCode = pageDialog.props.code

    const pageElement = useMemo(() => {
        return page.pages.find(page => {
            return page.CODE === pageCode
        })
    }, [pageCode]);

    const refs = {
        sheet: React.useRef<UiBottomSheetMethods>(null as any),
    }

    const footerActions = useMemo(() => {
        const res: UiBtnProps[] = []
        res.push({
            label: 'Закрыть',
            outline: true,
            color: COLORS.primary,
            onPress: () => {
                pageDialog.hide()
            }
        })
        return res
    }, [pageCode])

    if (!pageElement)
        return <></>

    return <UiBottomSheet
        id={'offer'}
        ref={refs.sheet}
        isVisible={pageDialog.visible}
        footerActions={footerActions}
        title={pageElement.NAME}
        onClose={() => {
            pageDialog.hide()
        }}
        preset={'default'}
        stackBehavior={'push'}
    >
        <UiHtml
            source={{html: pageElement.DETAIL_TEXT || ''}}
        />
    </UiBottomSheet>
})

export default PageModal

const styles = StyleSheet.create({});
