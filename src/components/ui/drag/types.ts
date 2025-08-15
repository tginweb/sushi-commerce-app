/// <reference types="react" />
import {ImageSourcePropType, ViewStyle} from "react-native";

export type Response = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export type UiDragProps = {
    x: number;
    y: number;
    limitationHeight: number;
    limitationWidth: number;
    height?: number;
    width?: number;
    minHeight?: number;
    minWidth?: number;
    onDragStart?: () => void;
    onDragEnd: (response: Response) => void;
    onResizeEnd: (response: Response) => void;
    children: any;
    resizable?: boolean;
    draggable?: boolean;
    resizerImageSource?: ImageSourcePropType;
    style?: ViewStyle;
};

