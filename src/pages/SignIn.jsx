import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import WelcomeMsg from "../components/WelcomeMsg";
import axios from "axios";

const initialFields = {
  email: "",
  password: ""
}

const SignIn = () => {
  const [hide, setHide] = useState(true);
  const [fields, setFields] = useState(initialFields);
  const { email, password } = fields;

  const verifyUser = async (data) => {
    console.log('Verifying user details');
    const res = await axios.post('http://3.26.39.12:4000/auth/login', data);
    console.log('Login Response:', res);
    if(res.status === 200) {
      console.log('Moving to dashboard');
      localStorage.setItem("token", res.data.accessToken);
      window.location.href="/dashboard";
    }
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setFields({
      ...fields,      
      [name]: value 
    });
  }

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Signing In');
    verifyUser(fields);
  }

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
                  <p>Log In</p>
                </div>

                <Form className="login_form" onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="formBasicEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      className="form_input"
                      placeholder="Enter email"
                      onChange={handleChange}
                      name="email"
                      value={email}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      className="form_input"
                      type={!hide ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      onChange={handleChange}
                      value={password}
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
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicCheckbox">
                    <Row>
                      <Col md={8}>
                        <Form.Check type="checkbox" label="Remember me" />
                      </Col>
                      <Col md={4} className="text-end">
                        <Link to="/resetpassword" className="custom_rest">
                          Reset Password?
                        </Link>
                      </Col>
                    </Row>
                  </Form.Group>
                  <div className="custom_submit text-center pt-3">
                    <Button variant="primary" className="w-100" type="submit">
                      Log in
                    </Button>
                    <div className="kids-art"><img src="../img/kid-art.svg" alt=""/></div>
                  </div>

                  {/*<div className="custom_bottom">
                    <p>
                      Don’t have account yet? <Link to="#">New Account</Link>{" "}
                    </p>
                  </div>*/}
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default SignIn;
