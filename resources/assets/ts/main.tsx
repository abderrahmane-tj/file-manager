import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, Route, browserHistory} from 'react-router';
import {App} from "./app";

ReactDOM.render(<Router history={browserHistory}>
  <Route path="/*" component={App} />
</Router>,document.getElementById('root'));

