import React, {useCallback, useMemo} from "react"
import {StyleSheet} from "react-native"
import {UiActions} from "~ui/actions";
import {ProductModel} from "@core/catalog/model/Product";
import {UiBtnProps} from "~ui/btn";
import icons from "~assets/icons-map"
import {COLORS} from "~assets/design"
import {useStores} from "~stores";
import {observer} from "mobx-react";
import {useServices} from "~services";

type TProps = {
    entity: ProductModel
}

export const _ProductActions: React.FC<TProps> = (
    {
        entity
    },
    ref
) => {

    const {fav, catalog} = useStores()
    const {bus, catalogUtil} = useServices()

    const favItem = fav.itemsByProductId ? fav.itemsByProductId[entity.ID] : null

    const entityId = entity.ID

    const onFavAdd = useCallback(async () => {
        await fav.apiMutateAdd({productId: entityId})
        bus.showAlert({
            type: 'info',
            message: 'Товар добавлен в избранное'
        })
    }, [entityId])

    const onFavRemove = useCallback(async () => {
        await fav.apiMutateRemove({productId: entity.ID})
        bus.showAlert({
            type: 'info',
            message: 'Товар удален из избранного'
        })
    }, [entityId])

    const items = useMemo(() => {

        const res: UiBtnProps[] = []

        if (entity.saleAllow) {
            if (!favItem) {
                res.push({
                    icon: icons.heart,
                    link: true,
                    loading: fav.apiMutateAdd.pending,
                    onPress: () => onFavAdd()
                })
            } else {
                res.push({
                    icon: icons.heartSolid,
                    link: true,
                    loading: fav.apiMutateRemove.pending,
                    onPress: () => onFavRemove()
                })
            }
        }

        return res

    }, [
        entity.ID,
        favItem,
        fav.apiMutateAdd.pending,
        fav.apiMutateRemove.pending,
        onFavAdd,
        onFavRemove
    ])


    return <UiActions
        items={items}
        itemProps={{
            color: COLORS.primary,
            size: 'large',
            iconSize: 30,
            buttonStyle: {
                paddingVertical: 7,
                paddingRight: 7
            }
        }}
    />
}

const styles = StyleSheet.create({})

// @ts-ignore
export const ProductActions = observer(React.forwardRef(_ProductActions))
