import {Observable} from 'rxjs/Observable';
import {ajax} from "rxjs/observable/dom/ajax";
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import {BASE_URL} from "./constants";
const headers = {
  Accept: 'application/json',
  'X-CSRF-TOKEN': document.querySelector('[name=csrf-token]').getAttribute('content')
};


export class Http {
  static baseString = BASE_URL.replace(window.location.origin,"");
  static BASE_FOLDER = Http.baseString.substr(0,Http.baseString.length-1);
  static API_URL = Http.BASE_FOLDER+'/api';

  static HEADERS = {Accept: 'application/json'};

  static get(path: string, params = {}){
    if(path.endsWith("/")){
      path = path.substr(0,path.length-1);
    }
    return ajax({
      url: Http.API_URL + path,
      method: 'GET',
      responseType: 'json',
      headers
    }).map(r=>r.response)
    .catch(error=>Observable.throw(error));
  }
  static post(path: string, body: any){
    return ajax({
      method: 'POST',
      url: Http.API_URL + path,
      responseType: 'json',
      headers,
      body
    }).map(r=>r.response)
    .catch(error=>Observable.throw(error));
  }
  static put(path: string, body: any){
    return ajax({
      method: 'PUT',
      url: Http.API_URL + path,
      responseType: 'json',
      headers,
      body
    }).map(r=>r.response)
    .catch(error=>Observable.throw(error));
  }
  static delete(path: string){
    return ajax({
      method: 'DELETE',
      url: Http.API_URL + path,
      responseType: 'json',
      headers
    }).map(r=>r.response)
    .catch(error=>Observable.throw(error));
  }
}
