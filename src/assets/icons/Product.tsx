import * as React from 'react';
import Svg, {Rect, Circle} from 'react-native-svg';
import type {SvgProps} from 'react-native-svg';
const SvgProduct = (props: SvgProps) => (
  <Svg width={139} height={92} fill="none" {...props}>
    <Rect
      width={135}
      height={88}
      x={2}
      y={2}
      fill="#fff"
      stroke="#D8D8D8"
      strokeWidth={4}
      rx={13}
    />
    <Rect
      width={31}
      height={31}
      x={17}
      y={13}
      fill="#fff"
      stroke="#D8D8D8"
      strokeWidth={4}
      rx={15.5}
    />
    <Rect
      width={13}
      height={31}
      x={52}
      y={12}
      fill="#fff"
      stroke="#D8D8D8"
      strokeWidth={4}
      rx={2}
    />
    <Rect
      width={13}
      height={31}
      x={104}
      y={12}
      fill="#fff"
      stroke="#D8D8D8"
      strokeWidth={4}
      rx={2}
    />
    <Rect
      width={13}
      height={31}
      x={18}
      y={49}
      fill="#fff"
      stroke="#D8D8D8"
      strokeWidth={4}
      rx={2}
    />
    <Rect
      width={13}
      height={31}
      x={70}
      y={49}
      fill="#fff"
      stroke="#D8D8D8"
      strokeWidth={4}
      rx={2}
    />
    <Rect
      width={31}
      height={31}
      x={35}
      y={49}
      fill="#fff"
      stroke="#D8D8D8"
      strokeWidth={4}
      rx={15.5}
    />
    <Rect
      width={31}
      height={31}
      x={69}
      y={13}
      fill="#fff"
      stroke="#D8D8D8"
      strokeWidth={4}
      rx={15.5}
    />
    <Rect
      width={31}
      height={31}
      x={87}
      y={49}
      fill="#fff"
      stroke="#D8D8D8"
      strokeWidth={4}
      rx={15.5}
    />
    <Circle cx={32.5} cy={28.5} r={5.5} fill="#C4C4C4" />
    <Circle cx={50.5} cy={64.5} r={5.5} fill="#C4C4C4" />
    <Circle cx={84.5} cy={28.5} r={5.5} fill="#C4C4C4" />
    <Circle cx={102.5} cy={64.5} r={5.5} fill="#C4C4C4" />
  </Svg>
);
export default SvgProduct;
