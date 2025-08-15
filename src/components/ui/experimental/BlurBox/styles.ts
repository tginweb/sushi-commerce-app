import { StyleSheet } from "react-native";
import {wHeight, wWidth} from "~assets/design";

export default StyleSheet.create({
  background: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: -1
  },
  blur: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 1
  },
  bottom: {
    bottom: 0
  },
  content: {
    flex: 1,
    position: "relative"
  },
  top: {
    top: 0
  },
  wrapper: {
    flex: 1,
    position: "relative",
    width: wWidth,
    height: wHeight
  }
});
