import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';
import type {SvgProps} from 'react-native-svg';
const SvgCountMinus = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 40 40" {...props}>
    <Rect width={39} height={39} x={0.5} y={0.5} fill="#fff" rx={14.5} />
    <Path
      fill="#D16837"
      d="M25 20.094c0 .472-.377.85-.85.85h-8.3a.846.846 0 0 1-.85-.85c0-.471.377-.849.85-.849h8.3c.473 0 .85.378.85.85"
    />
    <Rect width={39} height={39} x={0.5} y={0.5} stroke="#D16837" rx={14.5} />
  </Svg>
);
export default SvgCountMinus;
