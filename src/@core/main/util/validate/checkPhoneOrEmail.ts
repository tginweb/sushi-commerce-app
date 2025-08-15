import checkEmail from "./checkEmail";
import checkPhone from "./checkPhone";

export default function checkPhoneOrEmail(val: any) {
  return checkPhone(val) || checkEmail(val)
}
