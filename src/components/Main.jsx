import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Protected from '../components/Protected';
import ChildEnrollment from '../pages/ChildEnrollment';
// import ChildEnrollment1 from '../pages/ChildEnrollment/ChildEnrollment1';
// import ChildEnrollment2 from '../pages/ChildEnrollment/ChildEnrollment2';
// import ChildEnrollment3 from '../pages/ChildEnrollment/ChildEnrollment3';
// import ChildEnrollment4 from '../pages/ChildEnrollment/ChildEnrollment4';
// import ChildEnrollment5 from '../pages/ChildEnrollment/ChildEnrollment5';
// import ChildEnrollment6 from '../pages/ChildEnrollment/ChildEnrollment7';
// import ChildEnrollment7 from '../pages/ChildEnrollment/ChildEnrollment8';
import SignIn from '../pages/SignIn';
import ForgotPassword from '../pages/ForgotPassword';
import UserManagement from '../pages/UserManagement';
import NewUser from '../pages/NewUser';
import AddPermissions from '../pages/AddPermissions';
import AddUserRole from '../pages/AddUserRole';
import FranchisorDashboard from '../pages/FranchisorDashboard';
import FranchiseeDashboard from '../pages/FranchiseeDashboard';
import AllFranchisees from '../pages/AllFranchisees';
import NewFranchisees from '../pages/NewFranchisees';
import EducatorDashboard from '../pages/EducatorDashboard';
import CoordinatorDashboard from '../pages/CoordinatorDashboard';
import ParentsDashboard from '../pages/ParentsDashboard';
import AddOperatingManual from '../pages/OperatingManual/add';
import OperatingManual from '../pages/OperatingManual/view';
import AddFormBuilder from '../pages/FormBuilder/add';
import ViewFormBuilder from '../pages/FormBuilder/view';
import AddFormField from '../pages/FormBuilder/FormField/add';
import FormResponse from '../pages/FormBuilder/FormResponse';
import Training from '../pages/Training';
import AddNewTraining from '../pages/AddNewTraining';
import EditTraining from '../pages/EditTraining';
import TrainingDetail from '../pages/TrainingDetail';
import FileRepository from '../pages/FileRepository';
import Announcements from '../pages/Announcements';
import AddNewAnnouncements from '../pages/AddNewAnnouncements';
import DynamicForm from '../pages/DynamicForm';
import UploadFile from '../pages/UploadFile';
import AddSubOperatingManual from '../pages/OperatingManual/addSubModule';
import AvailableTraining from '../pages/AvailableTraining';
import CompleteTraining from '../pages/CompletedTraining';
import CreatedTraining from '../pages/CreatedTraining';
import AllAnnouncements from '../pages/AllAnnouncements';
import MyAnnouncements from '../pages/MyAnnouncements';
import EditAnnouncement from '../pages/EditAnnouncement';
import ChangePassword from "../pages/ChangePassword"
import EditUser from '../pages/EditUser';
import EditFranchisees from '../pages/EditFranchisees';
import ResetPassword from "../pages/ResetPassword"
import FormSetting from '../pages/FormBuilder/formSetting';
import Children from '../pages/Children';
import Preview from '../pages/FormBuilder/Preview';
import ChildNotifications from '../pages/ChildEnrollment/ChildNotifications';
import ChildEnrollmentInitiation from '../pages/ChildEnrollment/ChildEnrollmentInitiation';
import FileRpositoryList from '../pages/FileRpositoryList';
import FilerepoMyAdd from '../pages/FilerepoMyAdd';
import RepoEdit from '../pages/RepoEdit';
import Noticefication from '../pages/Notification';
import PageNotFound from '../pages/PageNotFound';
import SearchResult from '../pages/SearchResult';
const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState();

  useEffect(() => {
    const item = localStorage.getItem('token');


    if (item) {
      // SETTING 2 HOURS TIMEOUT FOR LOGOUT
      const loginTime = new Date();
      const logoutTime = new Date();
      logoutTime.setTime(loginTime.getTime() + 2 * 60 * 60 * 1000); // 1 HOUR
      console.log("Auto logout at:", logoutTime);

      function autoLogout() {
        (function loop() {
          var now = new Date();
          if (now > logoutTime) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_name');
            localStorage.removeItem('user_role');
            localStorage.removeItem('menu_list');
            localStorage.removeItem('active_tab');
            localStorage.removeItem('selectedFranchisee');
            localStorage.removeItem("attempts")
            localStorage.removeItem("enrolled_parent_id")
            localStorage.removeItem("enrolled_child_id")
            window.location.href = '/';
          }
          now = new Date();
          var delay = 6000 - (now % 6000);
          setTimeout(loop, delay);
        })();
      }

      autoLogout();
      setIsLoggedIn(true);
      localStorage.setItem('is_user_logged_in', true);
    } else {
      setIsLoggedIn(false);
      localStorage.setItem('is_user_logged_in', false);
    }
  }, []);

  return (
    <main>
      <Routes>
        <Route
          exact
          activeClassName="active"
          path="/"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <UserManagement />
            </Protected>
          }
        />

        <Route
          path="/child-enrollment-init/:parentId"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <ChildEnrollmentInitiation />
            </Protected>
          }
        />

        <Route
          path="/notification"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <ChildNotifications />
            </Protected>
          }
        />


        <Route
          path="/child-enrollment/notification"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <ChildNotifications />
            </Protected>
          }
        />

        <Route
          path="/child-enrollment"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <ChildEnrollment />
            </Protected>
          }
        />

        <Route
          path="/child-enrollment/:childId/:parentId"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <ChildEnrollment />
            </Protected>
          }
        />



        {/* <Route
          path="/child-enrollment/:childId/:parentId"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <ChildEnrollment />
            </Protected>
          }
        /> */}

        <Route
          path="/forgot-password"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <ForgotPassword />
              <UploadFile />
            </Protected>
          }
        />
        <Route
          path="/reset-password"
          element={

            <ResetPassword />
          }
        />

        <Route
          path="/add-permissions"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              {/* <ForgotPassword /> */}
              <SignIn />
              <AddPermissions />
            </Protected>
          }
        />

        <Route
          path="/new-franchisees"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <NewFranchisees />
            </Protected>
          }
        />

        <Route
          path="/edit-franchisees/:franchiseeId"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <EditFranchisees />
            </Protected>
          }
        />

        <Route
          path="/all-franchisees"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <AllFranchisees />
            </Protected>
          }
        />

        <Route
          path="/user-management"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <UserManagement />
            </Protected>
          }
        />

        <Route
          path="/new-user"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <NewUser />
            </Protected>
          }
        />

        <Route
          path="/edit-user/:userId"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <EditUser />
            </Protected>
          }
        />

        <Route
          path="/franchisor-dashboard"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <FranchisorDashboard />
            </Protected>
          }
        />

        <Route
          path="/franchisee-dashboard"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <FranchiseeDashboard />
            </Protected>
          }
        />

        <Route
          path="/educator-dashboard"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <EducatorDashboard />
            </Protected>
          }
        />

        <Route
          path="/coordinator-dashboard"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <CoordinatorDashboard />
            </Protected>
          }
        />

        <Route
          path="/parents-dashboard"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <ParentsDashboard />
            </Protected>
          }
        />
        <Route
          path="/operatingmanual/add/sub"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <AddSubOperatingManual />
            </Protected>
          }
        />
        <Route
          path="/operatingmanual/add"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <AddOperatingManual />
            </Protected>
          }
        />

        <Route
          path="/operatingmanual"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <OperatingManual />
            </Protected>
          }
        />

        {/* <Route 
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
          element={typeof isLoggedIn === 'undefined' || isLoggedIn === true ? <ViewFormBuilder /> : <Navigate to="/" />} /> */}
        <Route
          path="/form/dynamic/:name"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <DynamicForm />
            </Protected>
          }
        />
        <Route
          path="/form/preview/:name"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <Preview />
            </Protected>
          }
        />
        <Route
          path="/form/field/add"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <AddFormField />
            </Protected>
          }
        />
        <Route
          path='/form/setting'
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <FormSetting />
            </Protected>
          }
        />
        <Route
          path="/form/add"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <AddFormBuilder />
            </Protected>
          }
        />
          <Route
          path="/SearchResult/"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <SearchResult />
            </Protected>
          }
        />


        <Route
          path="/form/response"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <FormResponse />
            </Protected>
          }
        />

        <Route
          path="/form"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <ViewFormBuilder />
            </Protected>
          }
        />

        <Route
          path="/add-role"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <AddUserRole />
            </Protected>
          }
        />

        <Route
          path="/training"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <Training />
            </Protected>
          }
        />

        <Route
          path="/training"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <Training />
            </Protected>
          }
        />

        <Route
          path="/new-training"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <AddNewTraining />
            </Protected>
          }
        />

        <Route
          path="/edit-training/:trainingId"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <EditTraining />
            </Protected>
          }
        />

        <Route
          path="/training-detail/:trainingId"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <TrainingDetail />
            </Protected>
          }
        />

        <Route
          path="/available-training"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <AvailableTraining />
            </Protected>
          }
        />

        <Route
          path="/all-announcements"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <AllAnnouncements />
            </Protected>
          }
        />

        <Route
          path="/my-announcements"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <MyAnnouncements />
            </Protected>
          }
        />

        <Route
          path="/notifications"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <Noticefication />
            </Protected>
          }
        />

        <Route
          path="/complete-training"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <CompleteTraining />
            </Protected>
          }
        />

        <Route
          path="/created-training"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <CreatedTraining />
            </Protected>
          }
        />

        <Route
          path="/file-repository"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <FileRepository />
            </Protected>
          }
        />
        <Route
          path="/file-repository-List-me/:id"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <FilerepoMyAdd />
            </Protected>
          }
        />
        <Route
          path="/file-repository-Edit/:id"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <RepoEdit />
            </Protected>
          }
        />
        <Route
          path="/announcements"
          element={
            typeof isLoggedIn === 'undefined' || isLoggedIn === true ? (
              <Announcements />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/new-announcements"
          element={
            typeof isLoggedIn === 'undefined' || isLoggedIn === true ? (
              <AddNewAnnouncements />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/edit-announcement/:id"
          element={
            typeof isLoggedIn === 'undefined' || isLoggedIn === true ? (
              <EditAnnouncement />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/change-password"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <ChangePassword />
            </Protected>
          }
        />

        {/* <Route path="/not-found" component={NotFound } />
        <Redirect from="/" to="/not-found" /> */}

        <Route
          path="/children/:id"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <Children />
            </Protected>
          }
        />
        <Route
          path="/file-repository-List/:id"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <SignIn />
              <FileRpositoryList />
            </Protected>
          }
        />
        <Route path="*" element={
          <PageNotFound />
        } />


      </Routes>

    </main>
  );
};

export default Main;
