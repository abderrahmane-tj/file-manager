export function makeArray(element){
  return Array.prototype.slice.call(element);
}
export function buildPath(path,name){
  if(path === "/"){
    return path+name;
  }
  return path+"/"+name;
}

export function getIdFromPath(node,path){
  if(path.length===0){
    return node.id;
  }
  let [head,...tail] = path;
  return getIdFromPath(node.folders.find(folder=>folder.name===head),tail);
}

export function travelStructure(node,path){
  if(path.length===0){
    return node;
  }
  let [head,...tail] = path;
  return travelStructure(node.folders.find(folder=>folder.name===head),tail);
}