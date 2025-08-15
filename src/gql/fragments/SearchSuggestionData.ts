
import {gql} from "@apollo/client"


export default gql`

fragment SearchSuggestionData on SearchSuggestionData {
  entityId
  entityRole
  entityTitle
  entityTypeCode
  entityTypeId
  entityTypeName
  hint
  type
}

`
