import React, { useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import WelcomeMsg from "../components/WelcomeMsg";
import validateResetPassword from "../helpers/validateResetPassword";
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const initialFields = {
    email:''
  }
  const [topErrorMessage, setTopErrorMessage] = useState('');
  const [fields, setFields] = useState(initialFields);
  const { email} = fields;
  const [formErrors, setFormErrors] = useState([]);

    const handleChange = (e) =>{
      const {name,value} = e.target;
      setFields({
        ...fields,
        [name]:value
      })
    }
    const handleSubmit = (e) =>{
      e.preventDefault();
      setFormErrors(validateResetPassword(fields));
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
                  <p> Forgot Password</p>
                </div>
                
                <Form className="login_form">
                  <Form.Group className="mb-4 form-group" controlId="formBasicEmail">
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
                      {!formErrors.email && formErrors.validemail}
                    </span>
                    <Row>
                      <Col className="text-end">
                        <p className="custom_rest">Already have an account?  <Link to="/" className="custom_rest">
                          Log in
                        </Link></p>
                       
                      </Col>
                    </Row>
                  </Form.Group>

                  <div className="custom_submit text-center pt-3">
                    <Button variant="primary" className="w-100" type="submit" onClick={handleSubmit}>
                      Submit
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
  );
};

export default ForgotPassword;
