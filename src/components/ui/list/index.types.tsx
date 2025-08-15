import {UiListItemProps} from "~ui/list-item";
import {TMessage, TPresetName} from "@core/main/types";
import {ViewStyle} from "react-native";
import {ViewProps} from "react-native-ui-lib";

export type UiListProps = ViewProps & {
    itemsRef?: any
    items: UiListItemProps[]
    itemPreset?: TPresetName
    itemProps?: UiListItemProps,
    preset?: TPresetName
    separated?: boolean | TPresetName
    containerStyle?: ViewStyle
    backgroundColor?: string
    delimiter?: ({index, key}: {index: number, key: string}) => any
    error?: TMessage
    errorPreset?: TPresetName
    datasources?: any
}
