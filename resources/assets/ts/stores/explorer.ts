import {Http} from "../helpers/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
export class Explorer {
  public path$ = new BehaviorSubject({});

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
