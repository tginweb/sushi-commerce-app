import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import type {SvgProps} from 'react-native-svg';
const SvgSearch = (props: SvgProps) => (
  <Svg fillRule="evenodd" clipRule="evenodd" viewBox="0 0 24 24" {...props}>
    <Path d="M15.853 16.56A9.46 9.46 0 0 1 9.5 19C4.257 19 0 14.743 0 9.5S4.257 0 9.5 0 19 4.257 19 9.5c0 2.442-.923 4.67-2.44 6.353l7.44 7.44-.707.707zM9.5 1C14.191 1 18 4.809 18 9.5S14.191 18 9.5 18 1 14.191 1 9.5 4.809 1 9.5 1" />
  </Svg>
);
export default SvgSearch;
