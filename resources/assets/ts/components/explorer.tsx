import * as React from "react";
import {browserHistory,Link} from "react-router";
import {explorer} from "../stores/explorer"
import {LinkToItem} from "./link-to-item";
import {BASE_URL, CSRF_TOKEN} from "../helpers/constants";
import {
  makeArray, buildPath, getIdFromPath,
  travelStructure
} from "../helpers/functions";
import {Subscription} from "rxjs/Subscription";
import {Structure} from "./file-structure";

interface state{ path?, id?, currentfolder?, structure?}
interface props{ params: {}, location: {pathname:string} }
export class Explorer extends React.Component<props,state>{
  subscriptions: Subscription[] = [];
  fullyMounted = false;
  constructor(props){
    super(props);
    this.state = {
      path: "",
      currentfolder: {id: null,folders : [], files: []},
      structure: {id: null, name: "/", folders:[]}
    };
  }
  componentDidMount(){
    let pathSub = explorer.path$.subscribe((path)=>{
      console.log('new path ==> ',path);
      this.setState({path});
    });
    let folderSub = explorer.folder$.subscribe((folder)=>{
      console.log('new folder ==> ',folder);
      this.setState({currentfolder:folder});
    });
    let folderIdSub = explorer.folderId$.subscribe((id)=>{
      console.log('new folderId ==> ',id);
      if(!this.fullyMounted){return;}
      this.getContent(id);
    });
    let structureSub = explorer.structure$.subscribe((structure)=>{
      console.log('new structure ==>',structure);
      this.setState({structure});
    });
    this.subscriptions.push(...[
      pathSub, folderSub, structureSub, folderIdSub
    ]);

    this.getInitialFoldersFromPath();
  }
  componentWillUnmount(){
    this.subscriptions.forEach((sub:Subscription)=>sub.unsubscribe());
  }

  componentWillReceiveProps(props:props){
    let path = this.getPath(props);
    let pathParts = path.split("/").filter(x=>x!=="");
    let id = null;
    if(pathParts.length){
      id = getIdFromPath(explorer.structure$.getValue(),pathParts);
    }

    if(path !== explorer.path$.getValue()){
      console.log('path updating');
      explorer.path$.next(path);
    }
    if(id !== explorer.folderId$.getValue()){
      console.log('id change');
      explorer.folderId$.next(id);
    }
  }
  getPath(props=this.props){
    return decodeURI(props.location.pathname);
  }
  getInitialFoldersFromPath(){
    let path = this.getPath();
    explorer.path$.next(path);
    explorer.getPathContent(path).subscribe(folders=>{
      this.buildStructure(folders);
    });
  }
  getContent(id){
    explorer.getContent(id).subscribe(folder=>{
      explorer.folder$.next(folder);
      this.updateStructure(folder);
    });
  }
  updateStructure(folder){
    let path = this.getPath();
    let pathParts = path.split("/").filter(x=>x!=="");
    let structureClone = {...explorer.structure$.getValue()};
    let currentInStructure = travelStructure(structureClone,pathParts);
    if(!currentInStructure.files){
      currentInStructure.files = folder.files;
    }
    if(!currentInStructure.folders){
      currentInStructure.folders = folder.folders;
    }
    explorer.structure$.next(structureClone);
  }
  //noinspection JSMethodCanBeStatic
  buildStructure(folders){
    let structure = {
      id: null,
      name: "/",
      folders: [],
      files: []
    };
    let last = null;

    folders.forEach(folder=>{
      if(last===null){
        structure.folders = folder.folders;
        structure.files = folder.files;
        last = structure;
      }else{
        let thisInLast = last.folders.find(f=>f.id===folder.id);
        thisInLast.folders = folder.folders;
        thisInLast.files = folder.files;
        last = folder;
      }
    });
    explorer.folder$.next(last);
    explorer.structure$.next(structure);
    this.fullyMounted = true;
  }

  render(){
    const {path, currentfolder, structure} = this.state;
    return (
<div id="explorer" className="explorer">
  <aside className="file-structure">
    <Structure structure={structure}/>
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
    <div className="content-wrapper">
      {currentfolder.folders.map(folder=><LinkToItem
        key={folder.id}
        to={buildPath(path,folder.name)}
        title={folder.name}
        id={folder.id}
        className="item folder"
      >
        <div className="item-icon">
          <img src={BASE_URL+'images/folder-full.png'} alt="Folder"/>
        </div>
        <div className="item-name">
          <p>{folder.name}</p>
        </div>
      </LinkToItem>)}
      {currentfolder.files.map(file=><div className="item file" key={file.id}>
        <div className="item-icon">
          <img src={BASE_URL+'images/file.png'} alt="File"/>
        </div>
        <div className="item-name">
          <p>{file.name}</p>
        </div>
      </div>)}
    </div>
    <div className="temp-upload">
      <form
        action={BASE_URL+'upload/'+(currentfolder.id!==null?currentfolder.id:"")}
        method="POST" acceptCharset="UTF-8" encType="multipart/form-data"
      >
        <input id="upload_to_current" type="file" name="item"/>
        <input className="current_hidden_token" name="_token" type="hidden"
               value={CSRF_TOKEN} />
        <input type="submit" value={"Submit"}/>
      </form>
    </div>
    </section>
  </main>
  <aside className="details">

  </aside>
</div>
    )
  }
}

