import {COLORS} from "~assets/design";

export default [
    {
        type: 'view',
        modifiers: {
            'gap-15': true
        },
        children: [
            /*
            {
                type: 'card',
                props: {
                    preset: 'frontUser',
                    title: 'Предложения для вас',
                },
                modifiers: {
                    'marginH-screenH': true
                },
                children: [
                    {
                        type: 'component',
                        component: 'offersIndividual',
                    },
                ]
            },
             */
            {
                type: 'card',
                props: {
                    preset: 'front',
                    title: 'Акции',
                    headerActions: [
                        {
                            label: 'показать все',
                            size: 'xSmall',
                            link: true,
                            color: COLORS.primary,
                            action: {
                                url: 'router://info/news'
                            },
                        }
                    ]
                },
                children: [
                    {
                        type: 'component',
                        component: 'offersCommon',
                    },
                ]
            },
            {
                type: 'card',
                props: {
                    preset: 'front',
                    title: 'Популярное',
                    headerActions: [
                        {
                            label: 'показать все',
                            size: 'xSmall',
                            link: true,
                            color: COLORS.primary,
                            action: {
                                url: 'catalog://tab.popular'
                            },
                        }
                    ]
                },
                children: [
                    {
                        type: 'component',
                        component: 'popular',
                    },
                ]
            },
            {
                type: 'card',
                ref: 'menu',
                props: {
                    preset: 'front',
                    title: 'Каталог меню',
                },
                children: [
                    {
                        type: 'component',
                        component: 'menu',
                    },
                ]
            },
            {
                type: 'card',
                props: {
                    preset: 'front',
                    title: 'Спец. предложения',
                    headerActions: [
                        {
                            label: 'показать все',
                            size: 'xSmall',
                            link: true,
                            color: COLORS.primary,
                            action: {
                                url: 'catalog://tab.special'
                            },
                        }
                    ]
                },
                children: [
                    {
                        type: 'component',
                        component: 'special',
                    },
                ]
            },
        ]
    }
]
