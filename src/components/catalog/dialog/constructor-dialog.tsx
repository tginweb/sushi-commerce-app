import React, {useCallback, useEffect, useRef, useState} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {useServices} from "~services"
import {UiBottomSheet} from "~com/ui/bottom-sheet";
import {GridList, Text, TouchableOpacity, View, Wizard, WizardStepStates} from "react-native-ui-lib";
import {ProductModel} from "@core/catalog/model/Product";
import {SectionModel} from "@core/main/model/Section";
import {imagePrefetch, UiImage} from "~ui/image";
import {COLORS, TYPOGRAPHY, wWidth} from "~assets/design";
import extractKey from "@core/main/util/react/extractKey";
import {UiMessages} from "~ui/messages";
import {UiBtn} from "~ui/btn";
import api_ensure_element from '@core/catalog/gql/query/constructor_ensure_element';
import {task} from "@core/main/lib/decorator/task";
import {UiDialog, useDialog} from "~ui/dialog";
import {BasketItem} from "~com/sale/basket-item";
import {TBasketItemCalculated} from "@core/sale/types";
import icons from "~assets/icons-map";

type TStep = {
    id?: any,
    code?: string,
    label?: string,
    sectionId?: number,
    count?: number,
    state: WizardStepStates
}

type TProductPresent = {
    product: ProductModel,
    quantity: number
}

export const ProductConstructorDialog: React.FC = observer(({}) => {

    const {vorder, catalog, fav, catalogConstructor} = useStores()
    const {catalogUtil} = useServices()

    const wokSection = catalogConstructor.constructorSectionsTreeByCode.wok

    const [productState, setProductState] = useState<ProductModel | null>(null)

    const [activeStepIndex, setActiveStepIndex] = useState(0)
    const [needValidate, setNeedValidate] = useState(false)

    const [basket, setBasket] = useState<any>({})

    const [basketItemCalculated, setBasketItemCalculated] = useState<TBasketItemCalculated>()

    useEffect(() => {
        if (activeStep.code === 'result') {
            setNeedValidate(true)
        }
    }, [activeStepIndex])

    const sections = wokSection && wokSection.CHILDREN ? wokSection.CHILDREN : []

    const methods = {
        getBasketProductQuantity(sectionId: number, productId: number) {
            return basket[sectionId] && basket[sectionId][productId] ? basket[sectionId][productId] : 0
        },
        getSectionStepState(section: SectionModel, index: number) {

            const sectionId = section.ID
            const sectionCount = Object.values(basket[sectionId] || {}).length

            if (activeStepIndex > index) {
                if (!sectionCount) {
                    if (section.propValue.REQUIRED) {
                        return WizardStepStates.ERROR
                    } else {
                        return WizardStepStates.ENABLED
                    }
                } else {
                    return WizardStepStates.COMPLETED
                }
            } else {
                return WizardStepStates.ENABLED
            }
        },
        onActiveStepIndexChanged: (index: number) => {

            setNeedValidate(true)

            if (index > activeStepIndex) {
                const _errorsBySection = getErrorsBySection()
                if (activeSection) {
                    if (!_errorsBySection[activeSection.ID]) {
                        setNeedValidate(false)
                        setActiveStepIndex(index)
                    }
                }
            } else {
                setActiveStepIndex(index)
            }
        },
        selectProduct: (product: ProductModel) => {

            if (!activeSection)
                return;

            const sectionId = product.IBLOCK_SECTION_ID
            const sectionCount = Object.values(basket[sectionId] || {}).length

            let basketSection = {
                ...(basket[sectionId] || {}),
            }

            if (!activeSection.propValue.MULTIPLE && !!sectionCount) {
                basketSection = {}
            }

            const basketQuantity = methods.getBasketProductQuantity(sectionId, product.ID)

            if (basketQuantity) {
                delete basketSection[product.ID]
            } else {
                basketSection[product.ID] = 1
            }

            if (!Object.values(basketSection).length)
                basketSection = null

            setBasket({
                ...basket,
                ...{
                    [sectionId]: basketSection
                }
            })

        },
        addToBasket: async () => {

            const product = await ensureProduct()

            if (!product)
                return;

            console.log(product.ID)
            console.log(product.NAME)
            console.log(product)

            catalog.ensureProductModel(product)

            const basketItem = vorder.basketOp({
                action: 'add',
                productId: product.ID,
                quantity: 1,
                product: product,
            })

            if (basketItem) {
                setBasketItemCalculated(vorder.getBasketItemCalculated(basketItem))
                successDialog.show()
            }
        }
    }

    const steps = React.useMemo<TStep[]>(() => {
        return [
            ...sections.map((section, index) => ({
                id: section.ID,
                code: section.CODE,
                label: section.NAME,
                sectionId: section.ID,
                count: Object.values(basket[section.ID] || {}).length,
                state: methods.getSectionStepState(section, index)
            })),
            {
                id: 'result',
                code: 'result',
                label: 'Итог',
                state: WizardStepStates.ENABLED
            }
        ]
    }, [sections, basket, activeStepIndex])

    const sectionsById = React.useMemo<Record<number, SectionModel>>(() => {
        return sections.reduce((map: any, item: any) => {
            map[item.ID] = item
            return map
        }, {})
    }, [sections])


    const activeStep = React.useMemo(() => {
        return steps[activeStepIndex]
    }, [activeStepIndex])

    const activeSection = React.useMemo(() => {
        return activeStep.sectionId ? sectionsById[activeStep.sectionId] : null
    }, [activeStepIndex])


    const activeSectionProducts = React.useMemo<TProductPresent[]>(() => {
        if (activeSection) {
            const products = catalogConstructor.constructorProductsBySection[activeSection.ID]
            return products.map(product => {
                return {
                    product: product,
                    quantity: basket[activeSection.ID] && basket[activeSection.ID][product.ID] ? basket[activeSection.ID][product.ID] : 0
                }
            })
        } else {
            return []
        }
    }, [activeSection, basket])

    const selectedProducts = React.useMemo<TProductPresent[]>(() => {
        const res: any = []
        for (const [sectionId, sectionBasket] of Object.entries(basket)) {
            for (const [productId, quantity] of Object.entries((sectionBasket || {}) as any)) {
                res.push({
                    product: catalogConstructor.constructorProductById[productId as any],
                    quantity: quantity
                })
            }
        }
        return res
    }, [basket])

    const price = React.useMemo<number>(() => {
        return selectedProducts.reduce((map, item) => {
            map += (item.product.PRICE?.PRICE || 0) * item.quantity
            return map
        }, 0)
    }, [basket])

    const getErrorsBySection = () => {
        return sections.reduce((map: any, section) => {
            if (section.propValue.REQUIRED && !basket[section.ID]) {
                map[section.ID] = 'Необходимо выбрать - ' + section.NAME
            }
            return map
        }, {})
    }

    const errorBySection = React.useMemo<Record<number, string>>(() => {
        return needValidate ? getErrorsBySection() : {}
    }, [basket, needValidate])

    const renders = {

        product: ({item}: {
            item: TProductPresent
        }) => {

            const product = item.product
            const productSelected = !!item.quantity

            const imgSrc = product.imageSrcRequired

            return <TouchableOpacity
                key={product.ID}
                onPress={() => methods.selectProduct(product)}
                style={[styles.product, productSelected ? styles.productSelected : {}]}
                paddingB-10
            >
                <View centerH>
                    <View paddingH-20>
                        <UiImage
                            source={{uri: imgSrc}}
                            vendor={'expo'}
                            aspectRatio={1}
                            style={{
                                width: '100%'
                            }}
                        />
                    </View>
                    <Text text-md-m>{product.NAME}</Text>
                    <View row marginT-0 gap-8>
                        <Text text-md-bo>{product.priceFormatted}</Text>
                        {!!product.weight && <Text grey30>/ {product.weight} гр.</Text>}
                    </View>
                </View>
            </TouchableOpacity>
        },
        section: (section: SectionModel) => {
            return <View style={{
                //position1: 'relative'
            }}>
                <GridList
                    containerWidth={wWidth}
                    scrollEnabled={false}
                    data={activeSectionProducts}
                    keyExtractor={extractKey}
                    renderItem={renders.product}
                    itemSpacing={5}
                    listPadding={10}
                    numColumns={2}
                    ListHeaderComponent={() => (
                        <View marginT-20>
                            {
                                !!errorBySection[section.ID] && (
                                    <View marginB-15>
                                        <Text red20 center>
                                            {errorBySection[section.ID]}
                                        </Text>
                                    </View>
                                )
                            }
                        </View>
                    )}
                />
            </View>
        },
        result: () => {
            return <View paddingH-20 paddingV-33 gap-23>

                <View>
                    <Text text-md-bo>Состав вашего Wok:</Text>
                </View>

                <View gap-19>
                    {
                        selectedProducts.map(product => (
                            <View row gap-13 key={product.product.ID}>
                                <View flexG>
                                    <Text text-lg-r-lh1>{product.product.NAME}</Text>
                                </View>
                                <View style={{width: 30}}>
                                    <Text text-lg-m-lh1>x {product.quantity}</Text>
                                </View>
                                <View style={{width: 70}} right>
                                    {
                                        product.product?.price &&
                                        <Text text-lg-m-lh1>
                                            {catalogUtil.price(product.quantity * product.product.price)}
                                        </Text>
                                    }
                                </View>
                            </View>
                        ))
                    }
                </View>

                <View row gap-13>
                    <View flexG>
                        <Text text-xl-bo-lh1>Итого</Text>
                    </View>
                    <View style={{width: 70}} right>
                        <Text text-3xl-bo-lh1>{price}</Text>
                    </View>
                </View>

                {
                    !!Object.values(errorBySection).length ?
                        <UiMessages
                            items={Object.keys(errorBySection).map((sectionId: any) => ({
                                type: 'error',
                                message: errorBySection[sectionId]
                            }))}
                        />
                        :
                        <View gap-20>
                            <UiBtn
                                onPress={methods.addToBasket}
                                label={'Добавить в корзину'}
                                size={'large'}
                                text-lg-r
                                loading={mutating}
                            />
                            <UiBtn
                                onPress={() => methods.onActiveStepIndexChanged(1)}
                                label={'Изменить состав'}
                                size={'large'}
                                text-lg-r
                                outline={true}
                                color={COLORS.primary}
                            />
                        </View>
                }
            </View>
        },
        step: (step: TStep) => {
            if (step.sectionId) {
                return activeSection ? renders.section(activeSection) : <></>
            } else {
                return renders.result()
            }
        },
    }

    const ensureProduct = useCallback(task(async () => {

        setProductState(null)

        try {
            const res = await api_ensure_element.request({
                variables: {
                    sectionCode: 'wok',
                    constructor: basket,
                }
            })
            if (res) {
                const product = new ProductModel(res)
                setProductState(product)
                return product
            }
        } catch (e) {
            console.log(e)
        }
    }), [basket])

    const mutating = ensureProduct.pending

    const footerSlot = <View row centerV gap-20>
        <View>
            <Text text-xl-bo-lh0>{activeStep.code !== 'result' ? price + ' ₽' : ' '}</Text>
        </View>
        <View flexG>
            {
                activeStep.code !== 'result' &&
                <UiBtn
                    onPress={() => methods.onActiveStepIndexChanged(activeStepIndex + 1)}
                    label={'Далее'}
                />
            }
        </View>
    </View>

    const successDialog = useDialog({visible: false})

    const resetBuild = () => {
        setBasket({})
        setActiveStepIndex(0)
    }

    const imagePrefetched = useRef(false)

    const onShow = useCallback(() => {
        if (!imagePrefetched.current) {
            setTimeout(() => {
                imagePrefetch(catalogConstructor.constructorProducts.map(product => product.imageSrc))
                imagePrefetched.current = true
            }, 100)
        }
    }, [])

    return (
        <UiBottomSheet
            id={'constructor'}
            preset={'default'}
            targetModifiers={{
                scroll: []
            }}
            isVisible={catalogConstructor.dialog.visible}
            onShow={onShow}
            onClose={() => {
                catalogConstructor.dialog.hide()
            }}
            autoHeight={false}
            title={'Конструктор WOK'}
            snapPoints={['100%']}
            topbarBorderBottom={false}
            bodyScrollable={true}
            footerInnerSlot={footerSlot}
            headerSlot={() => {
                return <Wizard
                    testID={'uilib.wizard'}
                    activeIndex={activeStepIndex}
                    onActiveIndexChanged={methods.onActiveStepIndexChanged}
                    // @ts-ignore
                    activeConfig={{
                        labelStyle: {
                            ...TYPOGRAPHY['text-md-bo'],
                        }
                    } as any}
                >
                    {steps.map(step => {
                        return <Wizard.Step
                            state={step.state}
                            label={step.label}
                            key={step.id}
                        />
                    })}
                </Wizard>

            }}
        >
            <UiDialog
                title={'Wok успешно добавлен'}
                visible={successDialog.visible}
                onClose={successDialog.hide}
                actions={{
                    containerStyle: {
                        flexDirection: 'column'
                    },
                    items: [
                        {
                            label: 'Составить новый Wok',
                            icon: icons.plus,
                            onPress: () => {
                                successDialog.hide()
                                resetBuild()
                            }
                        },
                        {
                            label: 'Добавить в избранное',
                            outline: true,
                            color: COLORS.primary,
                            icon: icons.heart,
                            loading: fav.apiMutateAdd.pending,
                            onPress: () => {
                                if (productState) {
                                    fav.apiMutateAdd({productId: productState.ID})
                                }
                            }
                        },
                        {
                            label: 'Закрыть',
                            outline: true,
                            color: COLORS.primary,
                            onPress: async () => {
                                successDialog.hide()
                                resetBuild()
                                catalogConstructor.dialog.hide()
                            }
                        },
                    ]
                }}
            >
                <View gap-10 center>
                    {basketItemCalculated?.model && <UiImage
                        source={{uri: basketItemCalculated.model.imageSrc}}
                        contentFit={'contain'}
                        vendor={'expo'}
                        style={{
                            aspectRatio: 1,
                            resizeMode: 'contain',
                            width: 110,
                            height: 110,
                        }}
                    />}
                    {!!basketItemCalculated &&
                        <BasketItem
                            showDiscount={true}
                            showImage={false}
                            paddingV-9
                            paddingR-12
                            paddingL-6
                            item={basketItemCalculated}
                        />
                    }
                </View>
            </UiDialog>
            {renders.step(activeStep)}
        </UiBottomSheet>
    );
});

export default ProductConstructorDialog

const styles = StyleSheet.create({
    product: {},
    productSelected: {
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 20
    },
});
