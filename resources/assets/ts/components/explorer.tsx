import * as React from "react";
import {browserHistory,Link} from "react-router";
import {explorer} from "../stores/explorer"
import {LinkToItem} from "./link-to-item";
import {BASE_URL, CSRF_TOKEN} from "../helpers/constants";
import {makeArray} from "../helpers/functions";

interface state{ path? }
interface props{ params: {}, location: {pathname:string} }
export class Explorer extends React.Component<props,state>{
  constructor(props){
    super(props);
    this.state = {
      path: ""
    };
  }
  componentDidMount(){
    explorer.getItem('/').subscribe((r)=>console.log(r));
    this.handlePath(this.props.location.pathname);
  }
  componentWillReceiveProps(props:props){
    this.handlePath(props.location.pathname);
  }
  handlePath(path){
    path = decodeURI(path);
    this.setState({path:path});
  }
  render(){
    const {path} = this.state;
    return (
<div id="explorer" className="explorer">
  <aside className="file-structure">
    <p><LinkToItem to="/" title="/">#root</LinkToItem></p>
    <ul>
      <li>
        <Link to="/Folder 1" >Folder 1</Link>
        <ul>
          <li><LinkToItem to="/Folder 1/Folder 11" title="Folder 11">Folder 11</LinkToItem></li>
          <li><LinkToItem to="/Folder 1/Folder 12" title="Folder 12">Folder 12</LinkToItem></li>
          <li><LinkToItem to="/Folder 1/Folder 13" title="Folder 13">Folder 13</LinkToItem></li>
        </ul>
      </li>
      <li><LinkToItem to="/Folder 2" title="Folder 2">Folder 2</LinkToItem></li>
      <li><LinkToItem to="/Folder 3" title="Folder 3">Folder 3</LinkToItem></li>
    </ul>
  </aside>
  <main className="main-area">
    <nav className="commands">
      <ul className="add-content list-inline">
        <li className="new-folder">New Folder</li>
        <li className="upload-file">Upload File</li>
      </ul>
    </nav>
    <section className="folder-content">
      <pre>{path}</pre>
      <ul>
        <li>Folder 11</li>
        <li>Folder 12</li>
        <li>Folder 13</li>
      </ul>
      <form
        action={BASE_URL+'upload'}
        method="POST" acceptCharset="UTF-8" encType="multipart/form-data"
      >
        <input id="upload_to_current" type="file" name="item"/>
        <input className="current_hidden_token" name="_token" type="hidden"
               value={CSRF_TOKEN} />
        <input id="path" name="path" type="hidden" value={path}/>
        <input type="submit" value={"Submit"}/>
      </form>
    </section>
  </main>
  <aside className="details">

  </aside>
</div>
    )
  }
}
