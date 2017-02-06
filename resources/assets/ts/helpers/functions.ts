export function makeArray(element){
  return Array.prototype.slice.call(element);
}
export function buildPath(path,name){
  if(path === "/"){
    return path+name;
  }
  return path+"/"+name;
}