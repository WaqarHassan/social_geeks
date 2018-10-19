import React, { Component } from "react";
import {BrowserRouter as Router , Route} from  "react-router-dom"
import NavBar from "./components/layout/Navbar";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login"
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";

import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
                <NavBar />
                <Route exact path = "/" component = {Landing} />
                <div className = "container">
                  <Route exact path= "/register" component={Register} />
                  <Route exact path= "/login" component={Login} />
                </div>
                <Footer />
              </div>
      </Router>
    
    );
  }
}

export default App;
