import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";

const ChildEnrollment3 = ({ nextStep, handleFormData, prevStep }) => {
    const submitFormData = (e) => {
      e.preventDefault();
        nextStep();
    };
  
  return (
    <>
      <div className="enrollment-form-sec">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <h2 className="title-xs mb-4">Child’s health information R 162 (b)</h2>
            
            <div className="grayback">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Doctor’s Name/Medical Service</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control type="tel" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Doctor’s Address/Medical Service</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Maternal And Child Health Centre</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Does ypur child have a child health record?</Form.Label>
                    <div className="btn-radio inline-col">
                      <Form.Check type="radio" name="health" id="yesh" className="ps-0" label="Yes" />
                      <Form.Check type="radio" name="health" id="noh" label="No" />
                    </div>
                    <Form.Text className="text-muted">
                      if ‘Yes’ please provide to the service for sighting.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name and position of person at the service who has sighted the child’s health record</Form.Label>
                    <Row>
                      <Col md={4}>
                        <div className="mb-3">
                          <Form.Label>Name</Form.Label>
                          <Form.Control type="text" />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-3">
                          <Form.Label>Signature & Date</Form.Label>
                          <Form.Control type="text" />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-3">
                          <Form.Label>&nbsp;</Form.Label>
                          <Form.Control type="date" placeholder="" name="dob" />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-3">
                          <Form.Label>Position</Form.Label>
                          <Form.Control type="text" />
                        </div>
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
              </Row>
            </div>
            
            <h2 className="title-xs mt-4 mb-4">Child’s immunization record R 162 (F)</h2>
            
            <div className="grayback">
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Has the child been immunized?</Form.Label>
                    <div className="btn-radio inline-col">
                      <Form.Check type="radio" name="immunized" id="yesi" className="ps-0" label="Yes" />
                      <Form.Check type="radio" name="immunized" id="noi" label="No" />
                    </div>
                    <Form.Text className="text-muted">
                      if ‘Yes’ please provide the details.
                    </Form.Text>
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

export default ChildEnrollment3;
