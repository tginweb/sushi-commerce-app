import React, {useCallback, useMemo} from "react"
import {StyleSheet} from "react-native"

import {observer} from "mobx-react"
import {useStores} from "~stores"
import {UiBottomSheet} from "~com//ui/bottom-sheet";
import {Text, View} from "react-native-ui-lib";
import excludeEmptyFields from "@core/main/util/base/excludeEmptyFields";
import {UiBtnProps} from "~ui/btn";
import {COLORS} from "~assets/design";
import {iconResolve} from "~ui/icon-resolver";
import {UiContentRenderText} from "~ui/content-builder/text";
import timestampToFormat from "@core/main/util/date/timestampToFormat";

export const NoticeDialog: React.FC = observer(() => {

    const {noticeDialog, notice: noticeStore} = useStores()

    const notice = noticeDialog.props.notice

    const body = useMemo(() => {
        const content = notice.body || notice.message
        return content
    }, [notice.id])

    const actions = useMemo(() => {
        const res: UiBtnProps[] = excludeEmptyFields(notice.actionsMobile)
        if (!res.length)
            res.push({
                label: 'Закрыть',
                outline: true,
                color: COLORS.primary,
                onPress: () => {
                    noticeDialog.hide()
                }
            })
        return res
    }, [notice.id])

    const onClose = useCallback(() => {
        console.log('noticeStore.setNoticeReaded', notice.id)
        noticeStore.setNoticeReaded(notice)
        noticeDialog.hide()
    }, [notice.id])

    const date = timestampToFormat(notice.createdAt, 'datetime')

    return <UiBottomSheet
        id={'notice'}
        isVisible={noticeDialog.visible}
        onClose={onClose}
        autoHeight={true}
        title={'Уведомление'}
        preset={'default'}
        footerActions={actions}
    >
        <View marginV-20 gap-22>
            <View right>
                <Text grey30>{date}</Text>
            </View>

            {notice.image &&
                <View centerH marginB-10>
                    {iconResolve(notice.image, {
                        size: 75,
                        color: COLORS.primary
                    })}
                </View>
            }
            <View>
                <Text text-lg-bo-lh1>{notice.title}</Text>
            </View>
            <View style={styles.body}>
                <UiContentRenderText
                    content={body}
                    textProps={{}}
                />
            </View>
        </View>
    </UiBottomSheet>
})

export default NoticeDialog

const styles = StyleSheet.create({
    body: {
        minHeight: 200
    }
})
