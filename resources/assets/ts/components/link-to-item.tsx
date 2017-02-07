import * as React from "react";
import {browserHistory} from "react-router";
import {explorer} from "../stores/explorer";

interface state{
}
interface props{
  to,id,title, className?
}
export class LinkToItem extends React.Component<props,state>{
  constructor(props){
    super(props);
    this.state = {
    };
    this.onClick = this.onClick.bind(this);
  }
  componentDidMount(){}
  onClick(e){
    e.preventDefault();
    browserHistory.push(this.props.to);
    if(explorer.folder$.getValue()!==this.props.id){
      explorer.folderId$.next(this.props.id);
    }
  }
  render(){
    const {to,children,title,className} = this.props;
    let isActive = browserHistory.getCurrentLocation().pathname === to;
    let c = className ? className : "";
    c += isActive ? " active":"";
    return <a
      href={to} onClick={this.onClick} title={title}
      className={c}
    >{children}</a>
  }
}

