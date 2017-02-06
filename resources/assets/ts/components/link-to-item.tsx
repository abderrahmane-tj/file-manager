import * as React from "react";
import {browserHistory} from "react-router";
import {explorer} from "../stores/explorer";

interface state{
}
interface props{
  to,id,title
}
export class LinkToItem extends React.Component<props,state>{
  constructor(props){
    super(props);
    this.state = {
    };
    this.onClick = this.onClick.bind(this);
  }
  componentDidMount(){
  }
  onClick(e){
    e.preventDefault();
    explorer.folderId$.next(this.props.id);
    browserHistory.push(this.props.to);
  }
  render(){
    const {to,children,title} = this.props;
    return <a
      href={to} onClick={this.onClick} title={title}
    >{children}</a>
  }
}

