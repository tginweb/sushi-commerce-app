import {TValidator} from "@core/main/types";
import checkEmail from "./checkEmail";
import checkPhone from "./checkPhone";
import checkNumber from "./checkNumber";
import checkString from "./checkString";
import checkRequired from "./checkRequired";

export default function validate(val: any, params: TValidator) {

  const _val = typeof val === "string" ? val.trim() : val

  if (params.type !== 'required' && !_val) {
    return true
  }

  switch (params.type) {
    case 'email':
      return checkEmail(_val, params)
    case 'phone':
      return checkPhone(_val, params)
    case 'number':
      return checkNumber(_val, params)
    case 'string':
      return checkString(_val, params)
    case 'required':
      return checkRequired(_val, params)
  }
  return true
}


