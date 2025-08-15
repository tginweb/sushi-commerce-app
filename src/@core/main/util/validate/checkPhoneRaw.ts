export default function checkPhoneRaw(val: string, skipEmpty: boolean, returnNull: boolean) {

  if (returnNull) return null;

  if (typeof val == "undefined" || !val) return !!skipEmpty;

  var regExp = /^(\+?7|7|8)[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/

  return val.match(regExp) ? true : false
}
