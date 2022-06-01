import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";

const ChildEnrollment13 = ({ nextStep, handleFormData, prevStep }) => {
    const submitFormData = (e) => {
      e.preventDefault();
        nextStep();
    };
  
  return (
    <>
      <div className="enrollment-form-sec">
        <Form onSubmit={submitFormData}>
          step13
          <div className="cta text-center mt-5 mb-5">
            <Button variant="outline" type="submit" onClick={prevStep} className="me-3">Previous</Button>
            <Button variant="primary" type="submit">Submit</Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ChildEnrollment13;
