// @flow
import React from 'react';
import {ItemCloseTrigger, SwipeContext, SwipeItemRef, SwipeMode} from './swipeContext';

type ProviderProps = {
    mode?: SwipeMode,
    closeTrigger?: ItemCloseTrigger,
    children?: any
};

const SwipeProvider = React.memo<ProviderProps>((props) => {
    const {mode = 'single', closeTrigger = 'onItemMoved', ...others} = props;

    const openedItemRef = React.useRef<SwipeItemRef | null>(null);

    const value = React.useMemo(
        () => ({
            mode,
            closeTrigger,
            setOpenedItemRef: (ref: any, trigger: any) => {
                if (trigger !== closeTrigger || mode === 'multiple') {
                    return;
                }
                openedItemRef.current && openedItemRef.current.close();
                openedItemRef.current = ref;
            },
            removeOpenedItemRef: (ref: any) => {
                if (ref === openedItemRef.current) {
                    openedItemRef.current = null;
                }
            },
        }),
        [closeTrigger, mode]
    );

    return <SwipeContext.Provider {...others} value={value}/>;
});

export default SwipeProvider;
