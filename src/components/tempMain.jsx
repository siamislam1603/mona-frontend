import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import FormResponse from "../pages/FormBuilder/FormResponse";
import Training from "../pages/Training";
import AddNewTraining from "../pages/AddNewTraining";
import TrainingDetail from "../pages/TrainingDetail";
import ChildEnrollment1 from "../pages/ChildEnrollment/ChildEnrollment1";
import ChildEnrollment2 from "../pages/ChildEnrollment/ChildEnrollment2";
import ChildEnrollment3 from "../pages/ChildEnrollment/ChildEnrollment3";
import ChildEnrollment4 from "../pages/ChildEnrollment/ChildEnrollment4";
import ChildEnrollment5 from "../pages/ChildEnrollment/ChildEnrollment5";
import ChildEnrollment6 from "../pages/ChildEnrollment/ChildEnrollment6";
import ChildEnrollment7 from "../pages/ChildEnrollment/ChildEnrollment7";
import ChildEnrollment8 from "../pages/ChildEnrollment/ChildEnrollment8";
import ChildEnrollment9 from "../pages/ChildEnrollment/ChildEnrollment9";
import ChildEnrollment10 from "../pages/ChildEnrollment/ChildEnrollment10";
import ChildEnrollment11 from "../pages/ChildEnrollment/ChildEnrollment11";
import ChildEnrollment12 from "../pages/ChildEnrollment/ChildEnrollment12";
import ChildEnrollment13 from "../pages/ChildEnrollment/ChildEnrollment13";

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
      <Routes>
        <Route 
          exact 
          activeClassName="active" 
          path="/" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === false ? <SignIn /> : <Navigate to="/user-management" />} />

        <Route 
          path="/signup" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === false ? <SignUp /> : <Navigate to="/user-management" />} />
        
        <Route 
          path="/child/signup" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <ChildRegister /> : <Navigate to="/" />} />
        
        <Route 
          path="/dashboard" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <Dashboard /> : <Navigate to="/" />} />
        
        <Route 
          path="/resetpassword" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === false ? <ResetPassword /> : <Navigate to="/user-management" />} />
        
        <Route 
          path="/user-management" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <UserManagement /> : <Navigate to="/" />} />
        
        <Route 
          path="/new-user" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <NewUser /> : <Navigate to="/" />} />
        
        <Route 
          path="/franchisor-dashboard" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <FranchisorDashboard /> : <Navigate to="/" />} />
        
        <Route 
          path="/franchisee-dashboard" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <FranchiseeDashboard /> : <Navigate to="/" />} />
        
        <Route 
          path="/educator-dashboard" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <EducatorDashboard /> : <Navigate to="/" />} />
        
        <Route 
          path="/coordinator-dashboard" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <CoordinatorDashboard /> : <Navigate to="/" />} />
        
        <Route 
          path="/parents-dashboard" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <ParentsDashboard /> : <Navigate to="/" />} />
        
        <Route 
          path="/operatingmanual/add" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <AddOperatingManual /> : <Navigate to="/" />} />
        
        <Route 
          path="/operatingmanual" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <OperatingManual /> : <Navigate to="/" />} />
        
        <Route 
          path="/form/field/add" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <AddFormField /> : <Navigate to="/" />} />
        
        <Route 
          path="/form/add" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <AddFormBuilder /> : <Navigate to="/" />} />
        
        <Route 
          path="/form/response" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <FormResponse /> : <Navigate to="/" />} />
        
        <Route 
          path="/form" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <ViewFormBuilder /> : <Navigate to="/" />} />
        
        <Route 
          path="/add-role" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <AddUserRole /> : <Navigate to="/" />} />

        <Route 
          path="/training" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <Training /> : <Navigate to="/" />} />
        
        <Route 
          path="/new-training" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <AddNewTraining /> : <Navigate to="/" />} />
        
        <Route 
          path="/training-detail" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <TrainingDetail /> : <Navigate to="/" />} />
          
        <Route 
          path="/child-enrollment1" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <ChildEnrollment1 /> : <Navigate to="/" />} />
        
        <Route 
          path="/child-enrollment2" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <ChildEnrollment2 /> : <Navigate to="/" />} />
        
        <Route 
          path="/child-enrollment3" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <ChildEnrollment3 /> : <Navigate to="/" />} />
        
        <Route 
          path="/child-enrollment4" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <ChildEnrollment4 /> : <Navigate to="/" />} />
        
        <Route 
          path="/child-enrollment5" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <ChildEnrollment5 /> : <Navigate to="/" />} />
        
        <Route 
          path="/child-enrollment6" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <ChildEnrollment6 /> : <Navigate to="/" />} />
        
        <Route 
          path="/child-enrollment7" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <ChildEnrollment7 /> : <Navigate to="/" />} />
        
        <Route 
          path="/child-enrollment8" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <ChildEnrollment8 /> : <Navigate to="/" />} />
        
        <Route 
          path="/child-enrollment9" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <ChildEnrollment9 /> : <Navigate to="/" />} />
        
        <Route 
          path="/child-enrollment10" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <ChildEnrollment10 /> : <Navigate to="/" />} />
        
        <Route 
          path="/child-enrollment11" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <ChildEnrollment11 /> : <Navigate to="/" />} />
        
        <Route 
          path="/child-enrollment12" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <ChildEnrollment12 /> : <Navigate to="/" />} />
        
        <Route 
          path="/child-enrollment13" 
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <ChildEnrollment13 /> : <Navigate to="/" />} />
        
      </Routes>
    </main>
  );
};

export default Main;