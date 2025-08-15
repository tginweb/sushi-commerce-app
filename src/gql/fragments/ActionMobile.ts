
import {gql} from "@apollo/client"


export default gql`

fragment ActionMobile on ActionMobile {
  addBacklink
  addSession
  await
  code
  replace
  title
  titleAuto
  url
}

`
