import * as React from "react";
import {LinkToItem} from "./link-to-item";
import {BASE_FOLDER} from "../helpers/constants";

export function Structure(props){
  return (
    <ul>
      <StructureNode
        node={props.structure}
        path={BASE_FOLDER.substr(0,BASE_FOLDER.length-1)}
      />
    </ul>
  );
}

export function StructureNode(props){
  const {node, path} = props;
  if(!node.folders){
    return (<li>
      <LinkToItem to={path+node.name} id={node.id} title={node.name}
      >{node.name}</LinkToItem>
    </li>);
  }
  let suffix = path+"/" === BASE_FOLDER ? "" : "/";
  return (
    <li><LinkToItem to={path+node.name} id={node.id} title={node.name}
    >{node.name}</LinkToItem>
      <ul>
        {node.folders.map(folder=>{
          return <StructureNode
            node={folder} key={folder.id} path={path+node.name+suffix}/>;
        })}
      </ul>
    </li>
  );
}
