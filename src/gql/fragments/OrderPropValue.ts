
import {gql} from "@apollo/client"

import OrderProp from './OrderProp'
export default gql`

fragment OrderPropValue on OrderPropValue {
  CODE
  ID
  IS_READONLY
  NAME
  PROP {
    ...OrderProp
  }
  VALUE
  VALUES
  VALUE_DESCRIPTION
  VALUE_SHORT
  VALUE_VIEW
}
${OrderProp}
`
