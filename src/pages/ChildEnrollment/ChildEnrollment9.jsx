import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";

const ChildEnrollment9 = ({ nextStep, handleFormData, prevStep }) => {
    const submitFormData = (e) => {
      e.preventDefault();
        nextStep();
    };
  
  return (
    <>
      <div className="enrollment-form-sec">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <h2 className="title-xs mb-4">Photo</h2>
            
            <div className="grayback">
              <div className="single-col">
                <p>My child/children having their photo taken, while under care for their educational profiles</p>
                <Form.Group className="ms-auto">
                  <div className="btn-radio inline-col mb-0">
                    <Form.Check type="radio" name="photo" id="yesp" label="Yes" />
                    <Form.Check type="radio" name="photo" id="nop" label="No" />
                  </div>
                </Form.Group>
              </div>
            </div>
            
            <h2 className="title-xs mt-4 mb-4">Getting to know you, your child and their daily routine</h2>
            
            <div className="grayback">
              <p>To help us deliver the best possible care to your child, please provide us with following information if applicable:</p>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sleep Time</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Bottle TIme/Breast Feeding Arrangements</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Toileting</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Routines</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Lies/ Dislikes</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Comforter</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Religion</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dietary Requirement</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Allergy</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
              </Row>
            </div>
            
          </div>
          <div className="cta text-center mt-5 mb-5">
            <Button variant="outline" type="submit" onClick={prevStep} className="me-3">Previous</Button>
            <Button variant="primary" type="submit">Next</Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ChildEnrollment9;
