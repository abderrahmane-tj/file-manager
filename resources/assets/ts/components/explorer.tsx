import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Dropzone from "react-dropzone";
import * as request from 'superagent';
import {explorer} from "../stores/explorer"
import {LinkToItem} from "./link-to-item";
import {BASE_URL, CSRF_TOKEN} from "../helpers/constants";
import {
  makeArray, buildPath, getIdFromPath,
  travelStructure, toggleClass
} from "../helpers/functions";
import {Subscription} from "rxjs/Subscription";
import {Structure} from "./file-structure";


interface state{
  path?, id?, currentfolder?, structure?
}
interface props{ params: {}, location: {pathname:string} }
export class Explorer extends React.Component<props,state>{
  subscriptions: Subscription[] = [];
  fullyMounted = false;
  createFolderInput = null;
  private dropzone;
  constructor(props){
    super(props);
    this.state = {
      path: "",
      currentfolder: {id: null,folders : [], files: []},
      structure: {id: null, name: "/", folders:[]}
    };
    this.toggleNewFolderInput=this.toggleNewFolderInput.bind(this);
    this.startUpload=this.startUpload.bind(this);
    this.createFolder=this.createFolder.bind(this);
    this.onDrop=this.onDrop.bind(this);
    this.onMainDropZoneclick=this.onMainDropZoneclick.bind(this);
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
    let baseString = BASE_URL.replace(window.location.origin,"");
    let BASE_FOLDER = baseString.substr(0,baseString.length-1);
    let path = props.location.pathname;
    if(path.startsWith(BASE_FOLDER)){
      path = path.substr(BASE_FOLDER.length);
    }
    return decodeURI(path);
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
  updateStructure(folder, path = this.getPath(), asChild = false){
    let pathParts = path.split("/").filter(x=>x!=="");
    let structureClone = {...explorer.structure$.getValue()};
    let currentInStructure = travelStructure(structureClone,pathParts);
    if(asChild){
      currentInStructure.folders.push(folder);
    }else{
      // todo : compare children and add new ones
      if(!currentInStructure.files){
        currentInStructure.files = folder.files;
      }
      if(!currentInStructure.folders){
        currentInStructure.folders = folder.folders;
      }
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
    ReactDOM.findDOMNode(this).classList.remove('hidden');
  }
  toggleNewFolderInput(e){
    e.preventDefault();
    toggleClass(this.createFolderInput,'hidden');
  }
  createFolder(e){
    e.preventDefault();
    if(e.keyCode === 13 && e.target.value.trim().length > 0){
      let value = this.createFolderInput.value;
      this.createFolderInput.classList.add('hidden');
      this.createFolderInput.value = '';
      explorer
        .addItem(value,explorer.folder$.getValue().id)
        .subscribe(folder=>{
           this.updateStructure(folder,this.getPath(),true);
        });
    }
  }
  startUpload(e){
    e.preventDefault();
    console.log(event);
  }
  onDrop(acceptedFiles, rejectedFiles) {
    let formData: FormData = new FormData();
    let id = explorer.folderId$.getValue() || "";
    let baseString = BASE_URL.replace(window.location.origin,"");
    let BASE_FOLDER = baseString.substr(0,baseString.length-1);
    let suffix = "";
    if(id!==null){
      suffix = `/${id}`;
    }
    let req = request.post(`${BASE_FOLDER}/api/upload${suffix}`)
      .set('X-CSRF-TOKEN', CSRF_TOKEN);
    acceptedFiles.forEach(f=>{
      req.attach('files[]',f);
    });
    req.on('error', ()=>{console.log("upload on error")})
    .end(function(err, res){
      if(err){
        console.log(err);
        return;
      }
      let cloneFolder = {...explorer.folder$.getValue()};
      if(!cloneFolder.files){
        cloneFolder.files = [];
      }
      res.body.forEach(f=>cloneFolder.files.push(f));
      explorer.folder$.next(cloneFolder);
    });

  }
  onMainDropZoneclick(e){
    if(e.target.classList.contains('open-drop-zone')){
      this.dropzone.open();
    }
  }
  render(){
    const {path, currentfolder, structure} = this.state;
    return (
<div id="explorer" className="explorer hidden">
  <aside className="file-structure">
    <Structure structure={structure}/>
  </aside>
  <main className="main-area">
    <nav className="commands">
      <ul className="add-content list-inline pull-right">
        <input type="text" placeholder="New Folder"
               id="create-folder-input" className="create-new-folder hidden"
               onKeyUp={this.createFolder}
               ref={(input)=>{this.createFolderInput = input}}
        />
        <li className="new-folder">
          <a href="#" onClick={this.toggleNewFolderInput}>New Folder</a>
        </li>
        <li className="upload-file">
          <a href="#" className="open-drop-zone"
             onClick={this.onMainDropZoneclick}>Upload File</a>
        </li>
      </ul>
    </nav>
    <section className="folder-content">
      <Dropzone
        onDrop={this.onDrop} disableClick={true}
        ref={(node) => { this.dropzone = node; }}
        className={"dropzone"}
        activeClassName={"active"}
      >
        <div className="content-wrapper open-drop-zone" onClick={this.onMainDropZoneclick}>
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
      </Dropzone>
    <div className="temp-upload hidden">
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
    <pre className="debug-area hidden">{path}</pre>
  </main>
  <aside className="details">

  </aside>
</div>
    )
  }
}

