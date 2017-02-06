import * as React from "react";
import {browserHistory,Link} from "react-router";
import {explorer} from "../stores/explorer"
import {LinkToItem} from "./link-to-item";
import {BASE_URL, CSRF_TOKEN} from "../helpers/constants";
import {makeArray, buildPath} from "../helpers/functions";

interface state{ path?, id?, folder? }
interface props{ params: {}, location: {pathname:string} }
export class Explorer extends React.Component<props,state>{
    constructor(props){
    super(props);
    this.state = {
      path: "",
      folder: {id: null,folders : [], files: []}
    };
  }
  componentDidMount(){
    let path = this.handlePath(this.props.location.pathname);
    this.guessIdfrom(path);
  }
  componentWillReceiveProps(props:props){
    this.handlePath(props.location.pathname);
    this.loadContent();
  }
  handlePath(path){
    path = decodeURI(path);
    this.setState({path:path});
    return path;
  }
  loadContent(){
    let id = explorer.folderId$.getValue();
    explorer.getContent(id).subscribe(
      folder=>this.setState({folder})
    );
  }
  guessIdfrom(path){
    explorer.getPathContent(path).subscribe((folder)=>{
      this.setState({folder});
      explorer.folderId$.next(folder.id);
    });
  }
  setFolderId(id){
    this.setState({id});
  }
  render(){
    const {path, folder} = this.state;
    return (
<div id="explorer" className="explorer">
  <aside className="file-structure">
    <p><LinkToItem to="/" title="/" id={null}>#root</LinkToItem></p>
    <ul>
      <li>
        <LinkToItem to="/Documents" title="Documents" id={3}>Documents</LinkToItem>
      </li>
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
      <ul>
        {folder.folders.map(folder=><li key={folder.id}>
          <LinkToItem
            to={buildPath(path,folder.name)}
            title="Documents"
            id={folder.id}
          >{folder.name}</LinkToItem>
        </li>)}
        {folder.files.map(file=><li key={file.id}>
          {file.name}
        </li>)}
      </ul>

      <form
        action={BASE_URL+'upload/'+(folder.id!==null?folder.id:"")}
        method="POST" acceptCharset="UTF-8" encType="multipart/form-data"
      >
        <input id="upload_to_current" type="file" name="item"/>
        <input className="current_hidden_token" name="_token" type="hidden"
               value={CSRF_TOKEN} />
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

