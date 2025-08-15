import BlurBackground from "./components/BlurBackground/BlurBackground";
import BlurEdge from "./components/BlurEdge/BlurEdge";
import styles from "./styles";
import { View, ViewProps } from "react-native";
import { vec } from "@shopify/react-native-skia";
import React, { useRef } from "react";
import {
  SafeAreaViewProps,
  useSafeAreaInsets
} from "react-native-safe-area-context";

type Props = ViewProps & {
  children?: React.ReactNode;
  bottomBlur?: boolean;
  edges?: SafeAreaViewProps["edges"];
};

const BlurBox = ({
  bottomBlur,
  edges = [],
  ...props
}: React.PropsWithChildren<Props>): JSX.Element => {
  const edgeHeight = useRef(60).current;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, props.style]}>

      {props.children}

      <BlurBackground />
    </View>
  );
};

export default BlurBox;
