import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import {App} from "./components/app";
import {Explorer} from "./components/explorer";

ReactDOM.render((
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Explorer}/>
        <Route path="*" component={Explorer}/>
      </Route>
    </Router>
  ),
  document.getElementById('root')
);

