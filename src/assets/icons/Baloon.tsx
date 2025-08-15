import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
import type {SvgProps} from 'react-native-svg';
const SvgBaloon = (props: SvgProps) => (
  <Svg viewBox="0 0 54 68" {...props}>
    <Path d="M28.865 66.177c-.659 1.704-3.071 1.704-3.73 0L11.519 30.97a2 2 0 0 1 1.865-2.721h27.231a2 2 0 0 1 1.866 2.721z" />
    <Rect width={54} height={52} rx={19} />
  </Svg>
);
export default SvgBaloon;
