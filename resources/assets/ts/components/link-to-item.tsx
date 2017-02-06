import * as React from "react";
import {browserHistory} from "react-router";
import {explorer} from "../stores/explorer";

interface state{
}
interface props{
  to,title
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
    explorer
      .getItem(this.props.to)
      .subscribe(data=>{
        browserHistory.push(this.props.to)
      },error=>{
        console.log(error);
      })
  }
  render(){
    const {to,children,title} = this.props;
    return <a href={to} onClick={this.onClick} title={title}>{children}</a>
  }
}

