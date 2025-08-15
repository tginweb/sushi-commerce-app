import React from "react"
import {StyleSheet} from "react-native"

import {observer} from "mobx-react"
import {useStores} from "~stores"
import {CompanyOfficeModel} from "@core/company/model/CompanyOffice"
import {UiBottomSheet} from "~com/ui/bottom-sheet";
import {UiList} from "~ui/list";
import normalizePhone from "@core/main/util/format/normalizePhone";
import * as Linking from "expo-linking";
import icons from "~assets/icons-map";

type TProps = {
    showMap?: boolean
}

export type TCompanyOfficeModalProps = TProps

export const OfficeModal: React.FC<TProps> = observer(({}) => {

    const {company} = useStores();
    const office = company.officeModal.office || new CompanyOfficeModel({} as CompanyOfficeModel)

    const methods = {}

    return (
        <UiBottomSheet
            id={'office'}
            isVisible={company.officeModal.visible}
            onClose={() => {
                company.hideOfficeModal()
            }}
            backgroundColor={'#eeeeee'}
            title={office.NAME}
        >
            <UiList
                containerStyle={{gap: 10}}
                itemPreset={['menu', 'fontMd']}
                items={[
                    {
                        label: office.propValue.PHONES?.join(', '),
                        icon: icons.phone,
                        hidden: !office.propValue.PHONES?.length,
                        onPress: () => {
                            const phone = normalizePhone(office.propValue.PHONES[0], 'to-call')
                            try {
                                Linking.openURL('tel:' + phone);
                            } catch (e) {

                            }
                        }
                    },
                    {
                        label: office.propValue.WORKTIME,
                        icon: icons.clock,
                    },
                ]}
            />
        </UiBottomSheet>
    );
});

export default OfficeModal

const styles = StyleSheet.create({});
