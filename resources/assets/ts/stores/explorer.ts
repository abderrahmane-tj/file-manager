import {Http} from "../helpers/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {BASE_FOLDER} from "../helpers/constants";
import {removeBaseFolder} from "../helpers/functions";
export class Explorer {
  public path$ = new BehaviorSubject(BASE_FOLDER);
  public folder$ = new BehaviorSubject({id:null,folders:[],files:[]});
  public folderId$ = new BehaviorSubject(null);
  public structure$ = new BehaviorSubject({id:null, name: BASE_FOLDER, folders:[]});

  // get folder contents
  getPathContent(path:string){
    path = removeBaseFolder(path);
    return Http.get(`/folder-from-path/${path}`);
  }
  getContent(id:number){
    let path = '/folder/';
    if(id!==null){path =`/folder/${id}`}
    return Http.get(path);
  }
  getItem(path:string, children = true){
    let prefix = "/" + (children ? "folder" : "");
    return Http.get(`${prefix}${path}`);
  }
  addItem(name,id){
    let fields = {name};
    if(id!==null){
      fields['id']=id;
    }
    return Http.post(`/folder`,fields);
  }
  uploadItem(formData,id){
    return Http.post(`/upload/test`,{formData,id});
  }
  updateItem(item){
    return Http.put(`/${item.path}`,item);
  }
  delteItem(path){
    return Http.delete(`/${path}`);
  }
}

export let explorer = new Explorer();
