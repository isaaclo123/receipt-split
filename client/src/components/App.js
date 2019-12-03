import React from 'react';
import './App.css';

import {
  Route,
  Link,
  Switch
} from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';

import Login from './Login';
import Home from './Home';

function App() {
  return (
    <>
      <Navbar>
        <Navbar.Brand>Reciept Split</Navbar.Brand>
      </Navbar>

      <div>
        <Route path="/" component={Login}/>
        <Route path="/home" component={Home}/>
      </div>
    </>
  );
}

export default App;
