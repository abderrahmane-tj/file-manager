import * as React from "react";
import {Link} from "react-router";
import {browserHistory} from "react-router";

interface state{
}
interface props{
}
export class App extends React.Component<props,state>{
  constructor(props){
    super(props);
    this.state = {
    };
  }
  componentDidMount(){
  }
  componentWillReceiveProps(props:props){
  }
  render(){
    return this.props.children as JSX.Element;
  }
}

