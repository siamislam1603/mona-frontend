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

const ResetPasswordLink = () => {
  return (
    <Container>
    <Row className="justify-content-md-center">
      <Col>
        <h1>This link is expired</h1>
        <p className="custom_rest">Already have an account?  <Link to="/" className="custom_rest">
                        Log in
        </Link></p>
        <p className="custom_rest">Want to reset password?  <Link to="/forgot-password" className="custom_rest">
                       Reset Password
        </Link></p>

      </Col>
    </Row> 
  </Container>
  )
}

export default ResetPasswordLink