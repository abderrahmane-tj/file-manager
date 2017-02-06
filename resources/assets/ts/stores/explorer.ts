import {Http} from "../helpers/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
export class Explorer {
  public path$ = new BehaviorSubject("");
  public folder$ = new BehaviorSubject({id:null,folders:[],files:[]});
  public folderId$ = new BehaviorSubject(null);
  public structure$ = new BehaviorSubject({id:null, name: "/", folders:[]});

  // get folder contents
  getPathContent(path:string){
    return Http.get(`/folder-from-path${path}`);
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
  addItem(item){
    return Http.post(`/${item.path}`,item);
  }
  updateItem(item){
    return Http.put(`/${item.path}`,item);
  }
  delteItem(path){
    return Http.delete(`/${path}`);
  }
}

export let explorer = new Explorer();
