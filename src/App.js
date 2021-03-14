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
import axios from "./axios";
import { hasAccess, refresh } from './components/Access.js'
import Cookies from 'js-cookie'

function App() {
  const [path, setPath] = useState(window.location.pathname)

  const accessProtected = async () => {
    let accessToken = Cookies.get("access");
    let refreshToken = Cookies.get("refresh");
    const access = await hasAccess(accessToken, refreshToken);
    if (!access) {
      console.log("You are not authorized");
    } else {
      await getMe(access, refreshToken);
    }
  };

  const getMe = async (access, refreshToken) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          "/getMe",
          {},
          {
            headers: {
              authorization: `Bearer ${access}`,
            },
          }
        )
        .then(
          (response) => {
            sessionStorage.setItem("user", response.data);
            resolve(true);
          },
          async (error) => {
            if (error.response?.status === 401)
              console.log("You are not authorized!");
            else if (error.response.status === 498) {
              const access = await refresh(refreshToken);
              return await getMe(access, refreshToken);
            }
            resolve(false);
          }
        );
    });
  };

  useEffect(() => {
    if (Cookies.get("refresh"))
      accessProtected()
  }, [])
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
              <Route path='/video' exact>
                <VideoCall />
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