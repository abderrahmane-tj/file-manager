import * as React from "react";
import {Link} from "react-router";
import {browserHistory} from "react-router";

interface state{
  params?
}
interface props{
  params: {}
}
export class App extends React.Component<props,state>{
  constructor(props){
    super(props);
    this.state = {
      params: {}
    };
    this.onClick = this.onClick.bind(this);
  }
  componentDidMount(){
    this.setState({params:this.props.params});
  }
  componentWillReceiveProps(props:props){
    this.setState({params:props.params});
  }
  onClick(event){
    event.preventDefault();
    browserHistory.push(event.target.href);
  }
  render(){
    const {params} =  this.state;
    return (
      <div id="app">
        <h1>File Manager</h1>
        <p>to the rescue</p>
        <pre>
          you are here : {JSON.stringify(params)}
        </pre>
        <div><Link to="/static" className="list-group-item">Static</Link> </div>
        <div>
          <a
            href="/dynamic" className="list-group-item"
            onClick={this.onClick}
          >Dynamic</a> </div>
      </div>
    )
  }
}

