import React, {useRef} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {UiBottomSheet, UiBottomSheetMethods} from "~com/ui/bottom-sheet";
import {CatalogMenu} from "~com/catalog/menu";
import {TCatalogMenuItem} from "@core/catalog/types";
import icons from "~assets/icons-map";

type TProps = {}

export const SectionsDialog: React.FC<TProps> = observer(({}) => {

    const {sectionsDialog, catalog} = useStores()

    const ref = useRef<UiBottomSheetMethods>(null as any)

    const onNavItem = () => {
        ref.current?.forceClose()
    }

    const items: TCatalogMenuItem[] = []

    Array.prototype.push.apply(items, catalog.rootSections.map((section) => section.getMenuItem()))

    items.push({
        type: 'fav',
        code: 'fav',
        title: 'Избранное',
        icon: icons.heart
    })

    items.push({
        type: 'popular',
        code: 'popular',
        title: 'Популярное',
        icon: icons.star
    })

    return (
        <UiBottomSheet
            id={'sections-dialog'}
            isVisible={sectionsDialog.visible}
            autoHeight={true}
            bodyScrollable={true}
            targetModifiers={{
                scroll: ['paddingH-3']
            }}
            preset={'default'}
            title={'Каталог меню'}
            onClose={() => {
                sectionsDialog.hide(true)
            }}
            ref={ref}
        >
            <CatalogMenu
                items={items}
                onNavItem={onNavItem}
                overrideThemeId={'1-3'}
                marginV-10
            />
        </UiBottomSheet>
    );
});

export default SectionsDialog

const styles = StyleSheet.create({});
