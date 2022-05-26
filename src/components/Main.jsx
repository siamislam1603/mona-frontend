import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import ChildRegister from "../pages/ChildRegister";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import ResetPassword from "../pages/ResetPassword";
import UserManagement from "../pages/UserManagement";
import NewUser from "../pages/NewUser";
import AddUserRole from '../pages/AddUserRole';
import FranchisorDashboard from "../pages/FranchisorDashboard";
import FranchiseeDashboard from "../pages/FranchiseeDashboard";
import EducatorDashboard from "../pages/EducatorDashboard";
import CoordinatorDashboard from "../pages/CoordinatorDashboard";
import ParentsDashboard from "../pages/ParentsDashboard";
import AddOperatingManual from "../pages/OperatingManual/add";
import OperatingManual from "../pages/OperatingManual/view";
import AddFormBuilder from "../pages/FormBuilder/add";
import ViewFormBuilder from "../pages/FormBuilder/view";
import AddFormField from "../pages/FormBuilder/FormField/add";


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
        <Route path="/franchisor-dashboard" component={FranchisorDashboard} />
        <Route path="/franchisee-dashboard" component={FranchiseeDashboard} />
        <Route path="/educator-dashboard" component={EducatorDashboard} />
        <Route path="/coordinator-dashboard" component={CoordinatorDashboard} />
        <Route path="/parents-dashboard" component={ParentsDashboard} />
        <Route path="/operatingmanual/add" component={AddOperatingManual}/>
        <Route path="/operatingmanual" component={OperatingManual}/>
        <Route path="/form/field/add" component={AddFormField} />
        <Route path="/form/add" component={AddFormBuilder} />
        <Route path="/form" component={ViewFormBuilder} />
        <Route path="/add-role" component={AddUserRole} />
      </Switch>
    </main>
  );
};

export default Main;
