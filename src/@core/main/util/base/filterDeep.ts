const isPlainObject: any = require('is-plain-object')

export default function filterDeep(value: any, fn: any) {
  if (Array.isArray(value)) {
    return filterArray(value, fn);
  } else if (isPlainObject(value)) {
    return filterObject(value, fn);
  }
  return value;
}

function filterObject(obj: any, fn: any) {
  let newObj: any = {};
  let key;
  let value;

  for (key in obj) {
    value = filterDeep(obj[key], fn);

    if (fn.call(obj, value, key, obj)) {
      if (value !== obj[key] && !isCollection(value)) {
        value = obj[key];
      }

      newObj[key] = value;
    }
  }

  return newObj;
}

function filterArray<T = any>(array: T[], fn: any) {
  let filtered: any = []

  array.forEach(function (value: any, index: number, array: any) {
    value = filterDeep(value, fn);

    if (fn.call(array, value, index, array)) {
      if (value !== array[index] && !isCollection(value)) {
        value = array[index];
      }

      filtered.push(value);
    }
  });

  return filtered;
}

function isCollection(value: any) {
  return Array.isArray(value) || isPlainObject(value);
}

