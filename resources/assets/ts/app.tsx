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
  }
  componentDidMount(){
    this.setState({params:this.props.params});
    console.log(this.props);
  }
  componentWillReceiveProps(props:props){
    this.setState({params:props.params});
    console.log(props);
  }
  render(){
    const {params} =  this.state;
    return (
      <div id="app">
        <h1>File Manager</h1>
        <p>to the rescue <span className="glyphicon glyphicon-cloud"></span></p>
        <pre>
          you are here : {JSON.stringify(params)}
        </pre>
        <div><Link to="/static1" className="list-group-item">Static</Link> </div>
        <div><Link to="/static3" className="list-group-item">Static</Link> </div>
        <div><Link to="/static2" className="list-group-item">Static</Link> </div>
      </div>
    )
  }
}

