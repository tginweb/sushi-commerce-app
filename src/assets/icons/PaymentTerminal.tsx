import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import type {SvgProps} from 'react-native-svg';
const SvgPaymentTerminal = (props: SvgProps) => (
  <Svg viewBox="0 0 13 20" {...props}>
    <Path d="M10.324 1.953c0-.43.343-.781.764-.781V0H4.206C3.152 0 2.294.876 2.294 1.953V7.11h8.03zM12.235.392v1.952a.773.773 0 0 0-.764.781v.508H13v-1.68c0-.638-.3-1.205-.765-1.561" />
    <Path d="M11.47 4.905v3.376H1.148V4.905A1.76 1.76 0 0 0 0 6.562v11.68C0 19.212.772 20 1.72 20h9.177c.949 0 1.72-.789 1.72-1.758V6.562a1.76 1.76 0 0 0-1.146-1.657zM4.13 17.656H2.293v-1.172H4.13zm0-2.343H2.293V14.14H4.13v1.171zm0-2.344H2.293v-1.172H4.13zm3.096 4.687H5.391v-1.172h1.835zm0-2.343H5.391V14.14h1.835v1.171zm0-2.344H5.391v-1.172h1.835zm3.098 4.687H8.488v-1.172h1.836zm0-2.343H8.488V14.14h1.836v1.171zm0-2.344H8.488v-1.172h1.836zm0-2.344h-8.03V9.453h8.03z" />
  </Svg>
);
export default SvgPaymentTerminal;
