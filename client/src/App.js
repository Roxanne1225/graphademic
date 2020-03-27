import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import ExploreContainer from './containers/ExploreContainer'
import ArticlesContainer from './containers/ArticlesContainer'
import ResearchersContainer from './containers/ResearchersContainer'

import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <Router>
      <div>
        <p>Insert some nav here</p>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/articles/:articleId" component={ArticlesContainer} />
          <Route path="/researchers/:researcherId" component={ResearchersContainer} />
          <Route path="/" component={ExploreContainer} />
        </Switch>
      </div>
    </Router>
  );
}