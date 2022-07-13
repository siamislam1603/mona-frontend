import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Form, Modal } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import axios from 'axios';
import { PasswordValidation } from '../helpers/validation';
import { BASE_URL } from '../components/App';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as ReactBootstrap from 'react-bootstrap';
const ChangePassword = () => {
  const [userRoles, setUserRoles] = useState([]);
  const [franchiseeList, setFranchiseeList] = useState();
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [selectedFranchisee, setSelectedFranchisee] = useState("Special DayCare, Sydney");
  const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState([]);
  const [passwords, setPasswords] = useState({});
  const [hide, setHide] = useState(true);

  // LOG MESSAGES
  
  const [errors, setErrors] = useState({});
  const [topMessage, setTopMessage] = useState(null);
  const [topErrorMessage, setTopErrorMessage] = useState(null);


  
  // FETCHING FRANCHISEE LIST
  const fetchFranchiseeList = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/role/franchisee`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if(response.status === 200 && response.data.status === "success") {
      setFranchiseeList(response.data.franchiseeList.map(data => ({
        id: data.id,
        cat: data.franchisee_alias,
        key: `${data.franchisee_name}, ${data.city}`
      })));
    }
  };

  // FETCHING USER ROLES
  const fetchUserRoles = async () => {
    const response = await axios.get(`${BASE_URL}/api/user-role`);
    if (response.status === 200) {
      const { userRoleList } = response.data;
      setUserRoles([
        ...userRoleList.map((data) => ({
          cat: data.role_name,
          key: data.role_label,
        })),
      ]);
    }
  };
  // FUNCTION TO FETCH USERS OF A PARTICULAR FRANCHISEE
  const fetchFranchiseeUsers = async (franchisee_id) => {
    const response = await axios.get(`${BASE_URL}/role/user/franchiseeById/${franchisee_id}`);
    console.log('RESPONSE:', response);
    if(response.status === 200 && Object.keys(response.data).length > 1) {
      const { users } = response.data;
      setFetchedFranchiseeUsers([
        ...users?.map((data) => ({
          id: data.id,
          cat: data.fullname.toLowerCase().split(" ").join("_"),
          key: data.fullname
        })),
      ]);
    }
  };

   const ChangePassword = async(data) =>{
    try {
        console.log("The password",data)
        let token = localStorage.getItem("token");
        let userId = localStorage.getItem("user_id");
        const response = await axios.post(`${BASE_URL}/auth/changePassword`,{
        id: userId,
        oldPassword:data.oldpassword,
        newPassword:data.new_password
      },{
        headers: {
          "Authorization": "Bearer " + token
        }
       } )
    if(response.status===200 && response.data.status === "success"){
        setTopMessage("Password Change Successfully")
        setTimeout(() => {
            logout()
        }, 2000);
    }
    } catch (error) {
        setTopMessage("Old passsword is incorrect")
    }
   } 
   const logout = async () => {
    const response = await axios.get(`${BASE_URL}/auth/logout`);
    if (response.status === 200) {
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_role');
      localStorage.removeItem('menu_list');
      localStorage.removeItem('active_tab');
      localStorage.removeItem('selectedFranchisee');
      window.location.href = '/';
    }
  };

   const setField = (field, value) => {
    setPasswords({ ...passwords, [field]: value });
    console.log("form---->", passwords);
    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const onSubmit = event =>{
    event.preventDefault()
    let errObj = PasswordValidation(passwords)
    if(Object.keys(errObj).length>0){
        setErrors(errObj)
    }
    else{
        setErrors({})
        console.log("The data",passwords.oldpassword)
        ChangePassword(passwords)
    }
  }
  useEffect(() => {
    fetchUserRoles();
    fetchFranchiseeList();
  }, []);
//   useEffect(() => {
//     fetchFranchiseeUsers(trainingSettings.assigned_franchisee[0]);
//   }, [trainingSettings.assigned_franchisee.length > 0]);

//   trainingSettings && console.log('TRAINING SETTINGS:', trainingSettings);
//   trainingData && console.log('TRAINING DATA:', trainingData);
// console.log("All password", passwords)
const initialFields = {
    oldpassword:'',
    new_password:""
  }
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
    <div id="main">
      <section className="mainsection">
        <Container>
          <div className="admin-wrapper">
            <aside className="app-sidebar">
              <LeftNavbar />
            </aside>
            <div className="sec-column">
              <TopHeader
                selectedFranchisee={selectedFranchisee} 
                setSelectedFranchisee={setSelectedFranchisee} />
              <div className="entry-container">
                <header className="title-head">
                  <h1 className="title-lg">
                    Change Password{' '}
                  </h1>
                </header>
                  {topMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topMessage}</p>} 
                  {topErrorMessage && <p className="alert alert-danger" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topErrorMessage}</p>}                 
                <div className="training-form">
                  <Row>
                  <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Old Password</Form.Label>
                          <Form.Control
                            type={!hide ? "text" : "password"}
                            name="oldpassword"
                            value={passwords?.oldpassword}
                            onChange={(e) => {
                                setField(e.target.name,e.target.value)
                            }}
                            isInvalid={!!errors.oldpassword}
                          />
                           {!hide ? (
                      <FontAwesomeIcon
                        onClick={() => {
                          setHide(true);
                        }}
                        className="custom_hide"
                        icon={faEye}
                      />
                    ) : (
                      <FontAwesomeIcon
                        onClick={() => {
                          setHide(false);
                        }}
                        className="custom_hide"
                        icon={faEyeSlash}
                      />
                    )}
                         <Form.Control.Feedback type="invalid">
                            {errors.oldpassword}
                          </Form.Control.Feedback>
                        </Form.Group>
                 </Col>
                 <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="text"
                            name="new_password"
                            onChange={(e) => {
                                setField(e.target.name,e.target.value)
                            }}
                            isInvalid={!!errors.new_password}

                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.new_password}
                          </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Confirm Password</Form.Label>
                          <Form.Control
                            type="text"
                            name="confirm_password"
                            value={passwords?.confirm_password}
                            onChange={(e) => {
                                setField(e.target.name,e.target.value)
                            }}
                            isInvalid={!!errors.confirm_password}

                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.confirm_password}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <div className="custom_submit text-center pt-3">
                    <Button variant="primary" className="w-100" type="submit" onClick={onSubmit}>
                      Submit
                    </Button>
                    </div>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
 
  </div>
  )
}

export default ChangePassword