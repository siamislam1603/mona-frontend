import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import WelcomeMsg from "../components/WelcomeMsg";
import { BASE_URL } from '../components/App';

const initialFields = {
  fullname: "",
  email: "",
  password: ""
}

const SignUp = () => {
  
  const [hide, setHide] = useState(true);
  const [fields, setFields] = useState(initialFields);
  const { fullname, email, password } = fields;

  const location = useLocation();
  console.log('Location:', location);

  // function to post data in the database
  const addUser = async (data) => {
    const res = await axios.post(`${BASE_URL}/signup`, data);
    if(res.status === 201 && res.data?.status === "success") {
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
    addUser(fields);
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
                  <p>Sign Up</p>
                </div>
                <Form className="login_form" onSubmit={ handleSubmit }>
                  <Form.Group className="mb-4 form-group" controlId="formBasicFullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form_input"
                      placeholder="Enter name"
                      name="fullname"
                      onChange={handleChange}
                      value={fullname}
                    />
                  </Form.Group>
                  <Form.Group className="mb-4 form-group" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      className="form_input"
                      placeholder="Enter email"
                      name="email"
                      onChange={handleChange}
                      value={email}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4 form-group" controlId="formBasicPassword">
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

                  <Form.Group className="mb-4 form-group" controlId="formBasicCheckbox">
                    <Row>
                      <Col md={12} className="d-flex">
                        <Form.Check type="checkbox" label="" />
                        <label className="term-use">
                          By creating an account you agree to the <Link to='#'>terms of use</Link> and our <Link to='#'>privacy policy</Link>.
                        </label>
                      </Col>
                      
                    </Row>
                  </Form.Group>
                  <div className="custom_submit text-center pt-3">
                    <Button variant="primary" className="w-100" type="submit">
                      Create account
                    </Button>
                  </div>

                  <div className="custom_bottom">
                    <p>
                       Already have an account? <Link to="#">Log in</Link>{" "}
                    </p>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default SignUp;
