
function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export default function mergeDeep(target: any, ...sources: any): any {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (let key in source) {

      let mode = '', tkey = key;

      if (key.startsWith('=')) {
        tkey = key.substring(1);
        mode = 'set';
      }

      if (isObject(source[key]) && (mode !== 'set')) {
        if (!target[tkey]) Object.assign(target, { [tkey]: {} });
        mergeDeep(target[tkey], source[key]);
      } else {
        Object.assign(target, { [tkey]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}
