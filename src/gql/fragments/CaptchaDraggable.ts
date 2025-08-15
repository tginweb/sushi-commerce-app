
import {gql} from "@apollo/client"


export default gql`

fragment CaptchaDraggable on CaptchaDraggable {
  CANVAS_HEIGHT
  CANVAS_WIDTH
  HANDLE_HEIGHT
  HANDLE_WIDTH
  UUID
}

`
