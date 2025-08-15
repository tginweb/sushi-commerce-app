import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import type {SvgProps} from 'react-native-svg';
const SvgInfoCircle = (props: SvgProps) => (
  <Svg width={10} height={10} fillRule="evenodd" clipRule="evenodd" {...props}>
    <Path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12S0 18.623 0 12 5.377 0 12 0m0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11S1 18.071 1 12 5.929 1 12 1m.5 17h-1V9h1zM12 6a.845.845 0 1 1 0 1.69A.845.845 0 0 1 12 6" />
  </Svg>
);
export default SvgInfoCircle;
