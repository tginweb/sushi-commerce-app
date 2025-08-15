import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import type {SvgProps} from 'react-native-svg';
const SvgFilters = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 -960 960 960"
    {...props}
  >
    <Path d="M710-150q-63 0-106.5-43.5T560-300t43.5-106.5T710-450t106.5 43.5T860-300t-43.5 106.5T710-150m0-80q29 0 49.5-20.5T780-300t-20.5-49.5T710-370t-49.5 20.5T640-300t20.5 49.5T710-230m-550-30v-80h320v80zm90-250q-63 0-106.5-43.5T100-660t43.5-106.5T250-810t106.5 43.5T400-660t-43.5 106.5T250-510m0-80q29 0 49.5-20.5T320-660t-20.5-49.5T250-730t-49.5 20.5T180-660t20.5 49.5T250-590m230-30v-80h320v80zm-230-40" />
  </Svg>
);
export default SvgFilters;
