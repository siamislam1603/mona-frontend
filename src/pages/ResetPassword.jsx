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

const ResetPassword = () => {
const [passwords, setPasswords] = useState({});
const [errors, setErrors] = useState({});
const [hide, setHide] = useState(true);
const [secHide, setSecHide] = useState(true);

const [topMessage, setTopMessage] = useState(null);

const [searchParams, setSearchParams] = useSearchParams();
const [theToken, setTheToken] = useState(null)
let token = searchParams.get("token")

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
  const resetPassword = async () =>{
    const password =passwords.confirm_password
    let response = await axios.get(`${BASE_URL}/auth/passwordReset/?token=${theToken}&password=${password}`)
    console.log("The Response",response)
}
useEffect(() =>{
    setTheToken(token)
},[])

  return (
    <>
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
              <Form className="login_form" onSubmit={onSubmit}>
              <Form.Group
                  className="mb-4 form-group"
                  controlId="formBasicPassword"
                >
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    className="form_input"
                    type={!hide ? 'text' : 'password'}
                    placeholder="New Password"
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
                    placeholder="Confirm Password"
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
  </>
  )
}

export default ResetPassword