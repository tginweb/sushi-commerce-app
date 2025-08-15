
import {gql} from "@apollo/client"

import SearchSuggestionData from './SearchSuggestionData'
export default gql`

fragment SearchSuggestion on SearchSuggestion {
  data {
    ...SearchSuggestionData
  }
  label
  value
}
${SearchSuggestionData}
`
