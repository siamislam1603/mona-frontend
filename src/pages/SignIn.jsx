import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import WelcomeMsg from '../components/WelcomeMsg';
import { BASE_URL } from '../components/App';
import validateSignInForm from '../helpers/validateSignInForm';
import axios from 'axios';

const initialFields = {
  email: '',
  password: '',
};

const SignIn = () => {
  const [topErrorMessage, setTopErrorMessage] = useState('');
  const [hide, setHide] = useState(true);
  const [fields, setFields] = useState(initialFields);
  const { email, password } = fields;
  const [formErrors, setFormErrors] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);

  const verifyUser = async (data) => {
    const res = await axios.post(`${BASE_URL}/auth/login`, data);
    if (res.status === 200 && res.data.status === 'success') {
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('user_id', res.data.user.id);
      localStorage.setItem('user_role', res.data.user.role);
      localStorage.setItem('user_name', res.data.user.name);
      localStorage.setItem('email', res.data.user.email);
      
      localStorage.setItem('franchisee_id', res.data.user.franchisee_id);
      if (res.data.user.role === 'franchisor_admin')
      {
        window.location.href = '/franchisor-dashboard';
        localStorage.setItem('selectedFranchisee',"All")
      }
      else if (res.data.user.role === 'coordinator')
        window.location.href = '/coordinator-dashboard';
      else if (res.data.user.role === 'franchisee_admin')
        window.location.href = '/franchisee-dashboard';
      else if (res.data.user.role === 'educator')
        window.location.href = '/educator-dashboard';
      else if (res.data.user.role === 'guardian')
        window.location.href = '/parents-dashboard';
    } else if (res.status === 200 && res.data.status === 'fail') {
      setTopErrorMessage(res.data.msg);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validateSignInForm(fields));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit === true) {
      let data = new FormData();
      for (let [key, value] of Object.entries(fields)) {
        data.append(`${key}`, `${value}`);
      }
      verifyUser(fields);
    }
  }, [formErrors]);

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

                {topErrorMessage && (
                  <span className="toast-error">{topErrorMessage}</span>
                )}

                <Form className="login_form" onSubmit={handleSubmit}>
                  <Form.Group
                    className="mb-4 form-group"
                    controlId="formBasicEmail"
                  >
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      className="form_input"
                      placeholder="Enter email"
                      onChange={handleChange}
                      name="email"
                      value={email}
                    />
                    <span className="error">
                      {!fields.email && formErrors.email}
                    </span>
                  </Form.Group>

                  <Form.Group
                    className="mb-4 form-group"
                    controlId="formBasicPassword"
                  >
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      className="form_input"
                      type={!hide ? 'text' : 'password'}
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
                    <span className="error">
                      {!fields.password && formErrors.password}
                    </span>
                  </Form.Group>

                  <Form.Group
                    className="mb-4 form-group"
                    controlId="formBasicCheckbox"
                  >
                    <Row>
                      <Col>
                        <Form.Check type="checkbox" label="Remember me" />
                      </Col>
                      <Col className="text-end">
                        <Link to="/forgot-password" className="custom_rest">
                        Forgot Password?
                        </Link>
                      </Col>
                    </Row>
                  </Form.Group>
                  <div className="custom_submit text-center pt-3">
                    <Button variant="primary" className="w-100" type="submit">
                      Log in
                    </Button>
                    <div className="kids-art">
                      <img src="../img/kid-art.svg" alt="" />
                    </div>
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
