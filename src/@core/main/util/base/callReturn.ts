export default function callReturn(val: any, that: any) {
  if ('function' == typeof val) {
    return val.call(that)
  } else {
    return val
  }
}
