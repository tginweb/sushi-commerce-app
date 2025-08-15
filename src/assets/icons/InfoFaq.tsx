import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import type {SvgProps} from 'react-native-svg';
const SvgInfoFaq = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 20 20" {...props}>
    <Path d="M9.99 13.796V9.377M9.99 6.204H10" />
    <Path
      stroke="#F39768"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14.335.75H5.666C2.645.75.751 2.89.751 5.916v8.168c0 3.027 1.885 5.166 4.915 5.166h8.668c3.031 0 4.917-2.139 4.917-5.166V5.916c0-3.027-1.886-5.166-4.916-5.166"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgInfoFaq;
