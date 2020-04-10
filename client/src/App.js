import React from 'react';
import {
  Link,
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import ExploreContainer from './containers/ExploreContainer'
import ArticlesContainer from './containers/ArticlesContainer'
import ResearchersContainer from './containers/ResearchersContainer'

import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <Router>
      <div>
        <Navbar bg="dark" variant='dark' expand="lg">
          <Navbar.Brand as={Link} to='/'>Graphademic</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to='/explore'>Explore</Nav.Link>
              <Nav.Link as={Link} to='/articles'>Articles</Nav.Link>
              <Nav.Link as={Link} to='/researchers'>Researchers</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/articles/" component={ArticlesContainer} />
          <Route path="/researchers/:researcherId?" component={ResearchersContainer} />
          <Route path="/" component={ExploreContainer} />
        </Switch>
      </div>
    </Router>
  );
}