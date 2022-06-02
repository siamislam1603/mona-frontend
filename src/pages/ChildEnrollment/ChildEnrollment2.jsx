import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";

const ChildEnrollment2 = ({ nextStep, handleFormData, prevStep }) => {
    const submitFormData = (e) => {
      e.preventDefault();
        nextStep();
    };
  
  return (
    <>
      <div className="enrollment-form-sec">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <h2 className="title-xs mb-4">Court orders relating to the child R 160 (C)</h2>
            
            <div className="grayback">
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Are there any court orders relating to the powers, duties, responsibilities or authorities of any person in relation to the child or access to the child?</Form.Label>
                    <div className="btn-radio inline-col">
                      <Form.Check type="radio" name="powers" id="yesd" className="ps-0" label="Yes" />
                      <Form.Check type="radio" name="powers" id="nod" label="No" />
                    </div>
                    <Form.Text className="text-muted">
                      if ‘Yes’ please provide to the service for sighting.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Please describe these changes and provide the contact details of any person given these powers: </Form.Label>
                    <Form.Control as="textarea" rows={3} />
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

export default ChildEnrollment2;
