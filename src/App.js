import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import { useEffect } from 'react'
import Home from "./components/Home";
import Leftbar from './components/Leftbar';
import Header from './components/Header';
import Chat from "./components/Chat";
import Login from "./components/Login";
import React, { useState } from 'react'
import SignUp from "./components/SignUp";
import Verify from "./components/Verify";
import Form from "./components/Form";
import VideoCall from "./components/Video"
import Room from "./components/Room";
import Profile from "./components/Profile";
import { useStateValue } from "./StateProvider";

function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [{ user }, dispatch] = useStateValue()

  return (
    <Router>
      <Route path="/login" exact>
        <Login setPath={setPath} />
      </Route>
      <Route path="/signup" exact>
        <SignUp />
      </Route>
      <Route path="/form" exact>
        <Form setPath={setPath} />
      </Route>
      <Route path="/verify" exact>
        <Verify />
      </Route>
      <Route path='/video' exact>
        <VideoCall />
      </Route>
      {((path !== "/login") && (path !== "/signup") && (path !== "/form")) ?
        <div className="app">
          <Header />
          <div className="app-content">
            <Leftbar />
            <Switch>
              <Route path='/chats' exact>
                <Chat />
              </Route>
              <Route path='/rooms' exact>
                <Room />
              </Route>
              <Route path='/profile' exact>
                <Profile />
              </Route>
              <Route path='/' >
                <Home setPath={setPath} />
              </Route>
            </Switch>
          </div>
        </div>
        : null}
    </Router>
  );
}

export default App;