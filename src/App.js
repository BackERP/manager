import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { notification } from 'antd';


import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";

import BoardOffers from "./components/board-offers.componet";
import BoardOrders from "./components/board-orders.component";
import BoardAssets from "./components/board-assets.componet";
import BoardSubjects from "./components/board-subjects.component";
import BoardSettings from "./components/board-settings.component";
import BoardLab from "./components/board-lab.component";



// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
      isManager: false

    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        isManager: AuthService.checkAuth('MANAGER')
      });
    }
    
    EventBus.on("logout", () => {
      this.logOut();
    });

    EventBus.on("unauthorized", (data) => {
      notification.error({
        message: 'Unauthorize request!!!',
        description: data,
        onClose: ()=>{
          this.logOut();
          window.location.href = '/';
        },
    });

    });
    EventBus.on("notify", (data) => {
    });
    EventBus.on("server_error", (data) => {
      notification.error({
        message: 'Server error!!!',
        description: data,
      });
   });


  }

  UNSAFE_componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
      isManager: false

    });
  }

  render() {
    const { currentUser,isManager} = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
              Token Dobra
          </Link>

          <div className="navbar-nav mr-auto">
            {isManager&&(
            <li className="nav-item">
              <Link to={"/orders"} className="nav-link">
                Orders
              </Link>
            </li>
            )}
            {isManager&&(
            <li className="nav-item">
              <Link to={"/offers"} className="nav-link">
                Offers
              </Link>
            </li>
            )}
            {isManager&&(
            <li className="nav-item">
              <Link to={"/assets"} className="nav-link">
                Assets
              </Link>
            </li>
            )}
            {isManager&&(
            <li className="nav-item">
              <Link to={"/subjects"} className="nav-link">
                Subjects
              </Link>
            </li>
            )}
            {isManager&&(
            <li className="nav-item">
              <Link to={"/settings"} className="nav-link">
                Settings
              </Link>
            </li>
            )}
            {isManager&&(
            <li className="nav-item">
              <Link to={"/lab"} className="nav-link">
                Lab
              </Link>
            </li>
            )}


          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.login}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/offers" element={<BoardOffers />} />
            <Route path="/orders" element={<BoardOrders />} />
            <Route path="/assets" element={<BoardAssets />} />
            <Route path="/subjects" element={<BoardSubjects />} />
            <Route path="/settings" element={<BoardSettings />} />
            <Route path="/lab" element={<BoardLab />} />

          </Routes>
        </div>
        {/* <AuthVerify logOut={this.logOut}/> */}
      </div>
    );
  }
}

export default App;
