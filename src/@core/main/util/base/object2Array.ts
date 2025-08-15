export default function objectToArray(obj: object, keyField='value', trans: any = {}) {

  let result = [], transKey;

  let cobj: any = obj

  for (var key in cobj) {

    let item = cobj[key];

    item[keyField] = key;

    for (transKey in trans) {
      item[trans[transKey]] = item[transKey];
    }

    result.push(item)
  }

  return result;
}
