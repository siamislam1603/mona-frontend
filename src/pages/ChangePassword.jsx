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
  const [selectedFranchisee, setSelectedFranchisee] = useState("Special DayCare, Sydney");
  const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState([]);
  const [passwords, setPasswords] = useState({});
  const [hide, setHide] = useState(true);
  const [secHide, setSecHide] = useState(true);
  const [ThreHide, setThreHide] = useState(true);
  const [check, setCheck] = useState(null);
  const [passwordInitiationFlag, setPasswordInitiationFlag] = useState(0);



  // LOG MESSAGES
  
  const [errors, setErrors] = useState({});
  const [topMessage, setTopMessage] = useState(null);
  const [topErrorMessage, setTopErrorMessage] = useState(null);
  const [attempts,setAttempts] = useState(0);
  const [attemptError,setAttemptError] = useState(null)


  const getRoleString = (role) => {
    let roleString = '';

    if(role === 'franchisor_admin') 
      roleString = 'franchisor';
    
    if(role === 'franchisee_admin') 
      roleString = 'franchisee';

    if(role === 'coordinator')
      roleString = 'coordinator';

    if(role === 'educator')
      roleString = 'educator';

    if(role === 'guardian')
      roleString = 'parents';

    return roleString;
  }
  
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
        newPassword:data.new_password,
        isLoggedIn: 1,
        changePasswordNextLogin: 0
      },{
        headers: {
          "Authorization": "Bearer " + token
        }
       } )
    if(response.status===200 && response.data.status === "success"){
        setTopMessage("Password Change Successfully")
        setTimeout(() => {
            window.location.href=`/${getRoleString(localStorage.getItem('user_role'))}-dashboard`;
        }, 2000);
    }
    } catch (error) {
      console.log("The error", error)
        if( error.response.status ==404 && error.response.data.msg === "password incorrect!"){
            setTopErrorMessage("Old passsword is incorrect")
            setAttempts(attempts+ 1)
            console.log("The attemps",attempts)
            localStorage.setItem("attempts",attempts)  
          }
        setTimeout(() => {
          setTopErrorMessage(null)
      }, 3000);

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

  const checkPasswordChangeRequestInitiation = async () => {
    let token = localStorage.getItem('token');
    let response = await axios.get(`${BASE_URL}/auth/getPasswordChangeInitiationFlag`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
  
    if(response.status === 200 && response.data.status === 'success') {
      let { passwordChangeInitiationFlag } = response.data;
      setPasswordInitiationFlag(passwordChangeInitiationFlag);
    }
  };

  const onSubmit = event =>{
    event.preventDefault()
    let count =  localStorage.getItem("attempts") 
    console.log("The coount",count)
    if(count>1){
      console.log("Please logut and retry")
      setAttemptError("You consume 3 attempts logout and retry or forgot password")
      setTimeout(() => {
        setAttemptError(null)
    }, 3000);
      return
    }
    let errObj = PasswordValidation(passwords)
    if(Object.keys(errObj).length>0){
    //  console.log("The Error object",errObj.oldpassword)
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

  useEffect(() => {
    checkPasswordChangeRequestInitiation();
  }, []);

  // Get the previous value (was passed into hook on last render)
  
const attempt = localStorage.getItem("attempts")
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {attemptError && <p className="alert alert-danger" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{attemptError}</p>} 
 
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
                <div className="change-pass-sec">
                {
                  passwordInitiationFlag ?
                  <>
                    <p style={{ fontSize: "1.2rem", fontWeight: "400", color: "#9d9d9d", marginBottom: "5px"}}>A password change request has been initiated by the Administrator.</p>
                    <p style={{ fontSize: "1.2rem", fontWeight: "400", color: "#9d9d9d", marginBottom: "1.8rem" }}>Before proceeding further, you need to set a new password.</p>
                  </>:
                  <>
                    <p style={{ fontSize: "1.2rem", fontWeight: "400", color: "#9d9d9d", marginBottom: "5px"}}>You've logged in for the first time.</p>
                    <p style={{ fontSize: "1.2rem", fontWeight: "400", color: "#9d9d9d", marginBottom: "1.8rem" }}>Before proceeding further, you need to set a new password.</p>
                  </>
                }
                  <Row>
                  {/* <Col md={12} className="mb-3">
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

                         <Form.Control.Feedback type="invalid">
                            {errors.oldpassword}
                          </Form.Control.Feedback>
                        </Form.Group>
                 </Col> */}
              <Col md={6}>
                <Form.Group
                  className="form-group"
                  controlId="formBasicPassword"
                  >
                  <Form.Label>Old Password</Form.Label>
                  <Form.Control
                    className="form_input"
                    type={!hide ? 'text' : 'password'}                   
                    name="oldpassword"
                    placeholder='Old Password'
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
                    <span className="error">
                      {errors.oldpassword}
                    </span>
                </Form.Group>
                    </Col>
                </Row>
                <Row>
                 <Col md={6}>
                <Form.Group
                  className="form-group"
                  controlId="formBasicPassword"
                  >
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    className="form_input"
                    type={!secHide ? 'text' : 'password'}                   
                    name="new_password"
                    placeholder='New Password'
                    onChange={(e) => {
                      setField(e.target.name,e.target.value)
                    }}
                    isInvalid={!!errors.new_password}
                  />
                   
                  {!secHide ? (
                    <FontAwesomeIcon
                      onClick={() => {
                        setSecHide(true);
                      }}
                      className="custom_hide"
                      icon={faEye}
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => {
                        setSecHide(false);
                      }}
                      className="custom_hide"
                      icon={faEyeSlash}
                    />
                  )}
                   
        {
          !errors.new_password &&<Form.Text className="text-muted">
Minimum 8 characters, at least one uppercase and one lowercase letter, one number and one special character</Form.Text> 
        }                

                    <span className="error">
                      {errors.new_password}
                    </span>

                </Form.Group>
                    </Col>
                    {/* <Col md={12} className="mb-3">
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
                      </Col> */}

                <Col md={6}>
                  <Form.Group
                    className="form-group"
                    controlId="formBasicPassword"
                    >
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      className="form_input"
                      type={!ThreHide ? 'text' : 'password'}                   
                      name="confirm_password"
                      placeholder='Confirm Password'
                      value={passwords?.confirm_password}
                      onChange={(e) => {
                          setField(e.target.name,e.target.value)
                      }}
                      isInvalid={!!errors.confirm_password}
                    />   
                   {!ThreHide ? (
                      <FontAwesomeIcon
                        onClick={() => {
                          setThreHide(true);
                      }}
                      className="custom_hide"
                      icon={faEye}
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => {
                        setThreHide(false);
                      }}
                      className="custom_hide"
                      icon={faEyeSlash}
                    />
                  )}
                    <span className="error">
                      {errors.confirm_password}
                    </span>
                    </Form.Group>
                    </Col>
                      <div className="custom_submit text-center pt-3">
                    <Button variant="primary" type="submit" onClick={onSubmit}>
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