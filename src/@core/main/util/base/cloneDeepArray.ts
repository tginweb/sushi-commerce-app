const cloneDeep = require('clone-deep');

export default function cloneDeepArray(a: any) {

  let r: any = [];

  a.forEach((v: any)=>{
    r.push(cloneDeep(v));
  })

  return r
}
