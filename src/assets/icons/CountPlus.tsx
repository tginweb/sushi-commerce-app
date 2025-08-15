import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';
import type {SvgProps} from 'react-native-svg';
const SvgCountPlus = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 40 40" {...props}>
    <Rect width={39} height={39} x={0.5} y={0.5} fill="#fff" rx={14.5} />
    <Rect width={16} height={16} x={12} y={12} fill="#fff" rx={4} />
    <Path
      fill="#D16837"
      d="M25 20.094c0 .472-.377.85-.85.85h-3.395v3.207c0 .472-.378.849-.85.849a.846.846 0 0 1-.848-.85v-3.207h-3.208a.846.846 0 0 1-.849-.849c0-.471.377-.849.85-.849h3.207V15.85c0-.472.377-.849.849-.849.471 0 .849.377.849.85v3.395h3.396c.472 0 .849.378.849.85"
    />
    <Rect width={39} height={39} x={0.5} y={0.5} stroke="#D16837" rx={14.5} />
  </Svg>
);
export default SvgCountPlus;
