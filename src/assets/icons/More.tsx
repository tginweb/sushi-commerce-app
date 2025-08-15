import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import type {SvgProps} from 'react-native-svg';
const SvgMore = (props: SvgProps) => (
  <Svg width={16} height={4} fill="none" {...props}>
    <Path
      fill="#fff"
      stroke="#ADAFBB"
      d="M14 3.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm-6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm-6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
    />
  </Svg>
);
export default SvgMore;
