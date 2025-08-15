const libCloneDeep = require('clone-deep');

export default function cloneDeep(o: any) {
  return libCloneDeep(o)
}
