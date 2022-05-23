import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import ChildRegister from "../pages/ChildRegister";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import ResetPassword from "../pages/ResetPassword";
import UserManagement from "../pages/UserManagement";
import NewUser from "../pages/NewUser";
import AddOperatingManual from "../pages/OperatingManual/add";
import OperatingManual from "../pages/OperatingManual/view";


const Main = () => {

  const [isLoggedIn, setIsLoggedIn] = useState();

  useEffect(() => {
    const item = localStorage.getItem('token');
    if(item) { 
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    } 
  }, []);

  return (
    <main>
      <Switch>
        <Route exact activeClassName="active" path="/" render={() => (isLoggedIn ? <Redirect to="/dashboard" /> : <SignIn />)} />
        <Route path="/signup" render={() => (isLoggedIn ? <Redirect to="/dashboard" /> : <SignUp />)} />
        <Route path="/child/signup" render={() => ((isLoggedIn || typeof isLoggedin==='undefined') ? <ChildRegister /> : <Redirect to="/" />)} />
        <Route path="/dashboard" render={() => (isLoggedIn ? <Dashboard /> : <Redirect to="/" />)} />
        <Route path="/resetpassword" component={ResetPassword} />
        <Route path="/user-management" component={UserManagement} />
        <Route path="/new-user" component={NewUser} />
        <Route path="/operatingmanual/add" component={AddOperatingManual}/>
      <Route path="/operatingmanual" component={OperatingManual}/>
      </Switch>
    </main>
  );
};

export default Main;