import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import WelcomeMsg from '../components/WelcomeMsg';
import { BASE_URL } from '../components/App';
import { ResetPasswordValidation } from '../helpers/validation';
import axios from 'axios';
import ResetPasswordLink from './ResetPasswordLink';

function appendUserString(role) {
  let roleStr = '';

  if(role === 'franchisee_admin') {
    roleStr = 'franchisee'
  }

  if(role === 'coordinator') {
    roleStr = 'coordinator'
  }
  
  if(role === 'educator') {
    roleStr = 'educator'
  }
  
  if(role === 'guardian') {
    roleStr = 'parents'
  }

  return roleStr;
}

const ResetPassword = () => {
  const query = new URL(window.location.href);
  // let resetType = query.searchParams.get('resetType');


const [passwords, setPasswords] = useState({});
const [errors, setErrors] = useState({});
const [hide, setHide] = useState(true);
const [secHide, setSecHide] = useState(true);
const [topMessage, setTopMessage] = useState(null);
const [searchParams, setSearchParams] = useSearchParams();
const [theToken, setTheToken] = useState(null)
const [checkResetPassword,setCheckResetPassword]= useState(true);
let token = searchParams.get("token")
let userID = searchParams.get("user")
let resetType = searchParams.get("resetType")

const setField = (field, value) => {
    console.log("The field and value",field,value)
  // .replace(/\s/g, '')
    setPasswords({ ...passwords, [field]: value
  })
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
    let errObj = ResetPasswordValidation(passwords)
    if(Object.keys(errObj).length>0){
        setErrors(errObj)
    }    
    else{
        setErrors({})
        console.log("API CALL")
        resetPassword()
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
  const resetPassword = async () =>{
    const password =passwords.confirm_password
    let response = await axios.get(`${BASE_URL}/auth/passwordReset/?token=${theToken}&password=${password}`)
    if(response.status===200 && response.data.status === "success"){
      setTopMessage("Password Reset Successfully ")
      // userInfo()

      if(resetType === "resetPWD") {
        setTimeout(() =>{
            logout()
        },3000)
      } else {
        setTimeout(() => {
          window.location.href=`/${appendUserString(localStorage.getItem('user_role'))}-dashboard`;
        }, 3000);
      }
  
      console.log("The success",response);
  }
}


const getUser =  async() =>{
 try {
  let response = await axios.get(`${BASE_URL}/auth/${userID}`)
  console.log("The repsonse user",response)
  if(response.status === 200 && response.data.status === "success" ){
    setCheckResetPassword(true)
    console.log("The Token inside",response.data)
  }
  // else{
  //   setCheckResetPassword(false)
  //   console.log("Link invalid")
  // }
 } catch (error) {
      setCheckResetPassword(false)
    console.log("Link invalid")
    console.log("The error",error)
 }
}
useEffect(() =>{
    getUser()
    setTheToken(token)
},[])
console.log("checkPassword", checkResetPassword)

  return (
    <>
     {checkResetPassword === true? (
        <section className="login-bg">
        <Container>
          <Row className="justify-content-between align-items-center flex-row-reverse">
            <Col md={6}>
              <WelcomeMsg />
            </Col>
            <Col md={6}>
              <div className="custom_signin_page">
                <div className="custom_title">
                  <p>Reset Password</p>
                </div>
                {topMessage && <p className="alert alert-success">{topMessage}</p>} 

                <Form className="login_form" onSubmit={onSubmit}>
                <Form.Group
                    className="mb-4 form-group"
                    controlId="formBasicPassword"
                  >
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      className="form_input"
                      type={!hide ? 'text' : 'password'}
                      // placeholder="New Password"
                      name="new_password"
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
                        {errors.new_password}
                      </span>
                  </Form.Group>
                  <Form.Group
                    className="mb-4 form-group"
                    controlId="formBasicPassword"
                  >
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      className="form_input"
                      type={!secHide ? 'text' : 'password'}
                      // placeholder="Confirm Password"
                      name="confirm_password"
                      onChange={(e) => {
                          setField(e.target.name,e.target.value)
                      }}
                   
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
                    <span className="error">
                        {errors.confirm_password}
                      </span>
                  </Form.Group>
  
                  <Form.Group
                    className="mb-4 form-group"
                    controlId="formBasicCheckbox"
                  >
                  </Form.Group>
                  <div className="custom_submit text-center pt-3">
                    <Button variant="primary" className="w-100" type="submit">
                      Save New Password
                    </Button>
                    <div className="kids-art">
                      <img src="../img/kid-art.svg" alt="" />
                    </div>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
     ):(
      <ResetPasswordLink/>
     )}
  </>
  )
}

export default ResetPassword