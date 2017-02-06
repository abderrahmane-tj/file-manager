import * as React from "react";
import {LinkToItem} from "./link-to-item";

export function Structure(props){
  return (
    <ul>
      <StructureNode node={props.structure} path=""/>
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
  let suffix = path === "" ? "" : "/";
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
