import { useSelectContext } from '../../context';
import { isOptionIndexType, isOptionType } from '../../types';

export const useClearOption = () => {
    const {
        styles: mainStyles,
        disabled,
        clearOptionButtonProps,
        clearOptionImageProps,
        dispatch,
        searchValue,
        optionsResolver,
        selectedOption,
        selectedOptionIndex,
        onRemove,

    } = useSelectContext();

    const { clear } = mainStyles?.select ?? {};
    const { icon: iconCustomStyles, container: containerCustomStyles } = clear ?? {};

    const removeSingleOption = () => {
        dispatch({
            type: 'selectOption',
            payload: {
                selectedOption: null,
                selectedOptionIndex: -1,
            },
        });

        const isSearchable = typeof searchValue === 'string';
        if (isSearchable) {
            dispatch({
                type: 'setSearchValue',
                payload: '',
            });
        }
    };
    const onPressClearOption = () => {
        if (disabled) {
            return;
        }
        removeSingleOption();
        if (
            onRemove &&
            selectedOption &&
            isOptionType(selectedOption) &&
            isOptionIndexType(selectedOptionIndex)
        ) {

            if (optionsResolver) {
                dispatch({type: 'setOptions', payload: []})
            }

            // callback
            onRemove(selectedOption, selectedOptionIndex);
        }
    };

    return {
        disabled,
        clearOptionButtonProps,
        clearOptionImageProps,
        iconCustomStyles,
        containerCustomStyles,
        onPressClearOption,
    };
};
