export default function checkRs(val: string, skipEmpty: boolean, returnNull: boolean) {

  if (returnNull) return null;

  if (typeof val == "undefined" || !val) return !!skipEmpty;

  const regExp = /^\d{9}$/

  return !!val.match(regExp)
}
