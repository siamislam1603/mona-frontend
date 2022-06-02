import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const ChildEnrollment5 = ({ nextStep, handleFormData, prevStep }) => {
const submitFormData = (e) => {
  e.preventDefault();
    nextStep();
};
const animatedComponents = makeAnimated();

const ethnicity = [
  {
    value: "ethnicity",
    label: "Ethnicity",
  },
  {
    value: "ethnicity",
    label: "Ethnicity",
  },
];
const birth = [
  {
    value: "india",
    label: "India",
  },
  {
    value: "usa",
    label: "USA",
  },
];
const language = [
  {
    value: "english",
    label: "English",
  },
  {
    value: "hindi",
    label: "Hindi",
  },
];
const occupation = [
  {
    value: "developer",
    label: "Developer",
  },
  {
    value: "designer",
    label: "Designer",
  },
];
    
  
  return (
    <>
      <div className="enrollment-form-sec">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <h2 className="title-xs mb-4">Information about the child’s parents or guardians</h2>
            
            <div className="grayback">
              <Row>
                <Col md={6}>
                  <div className="parent_fields">
                    <Form.Group className="mb-3">
                      <div className="btn-radio inline-col">
                        <Form.Check type="radio" name="information1" id="parent1" className="ps-0" label="Parent" defaultChecked />
                        <Form.Check type="radio" name="information1" id="guardian1" label="Guardian" />
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Family Name</Form.Label>
                      <Form.Control type="text" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Given Name</Form.Label>
                      <Form.Control type="text" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Date Of Birth</Form.Label>
                      <Form.Control type="date" placeholder="" name="dob" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Address As Per Child</Form.Label>
                      <Form.Control as="textarea" rows={3} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Telephone</Form.Label>
                      <Form.Control type="tel" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control type="email" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <div className="btn-radio inline-col">
                        <Form.Label>Child live with this parent/guardian?</Form.Label>
                        <Form.Check type="radio" name="live1" id="Yesp" label="Yes" defaultChecked />
                        <Form.Check type="radio" name="live1" id="nop" label="No" />
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Place Of Birth</Form.Label>
                      <Select
                        placeholder="Select"
                        closeMenuOnSelect={true}
                        options={birth}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Ethnicity</Form.Label>
                      <Select
                        placeholder="Select"
                        closeMenuOnSelect={true}
                        options={ethnicity}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Primary Language</Form.Label>
                      <Select
                        placeholder="Select"
                        closeMenuOnSelect={true}
                        options={language}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Occupation</Form.Label>
                      <Select
                        placeholder="Select"
                        closeMenuOnSelect={true}
                        options={occupation}
                      />
                    </Form.Group>
                    
                  </div>
                </Col>
                <Col md={6}>
                  <div className="parent_fields">
                    <Form.Group className="mb-3">
                      <div className="btn-radio inline-col">
                        <Form.Check type="radio" name="information2" id="parent2" className="ps-0" label="Parent" />
                        <Form.Check type="radio" name="information2" id="guardian2" label="Guardian" defaultChecked />
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Family Name</Form.Label>
                      <Form.Control type="text" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Given Name</Form.Label>
                      <Form.Control type="text" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Date Of Birth</Form.Label>
                      <Form.Control type="date" placeholder="" name="dob" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Address As Per Child</Form.Label>
                      <Form.Control as="textarea" rows={3} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Telephone</Form.Label>
                      <Form.Control type="tel" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control type="email" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <div className="btn-radio inline-col">
                        <Form.Label>Child live with this parent/guardian?</Form.Label>
                        <Form.Check type="radio" name="live2" id="Yesp1" label="Yes" defaultChecked />
                        <Form.Check type="radio" name="live2" id="nop1" label="No" />
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Place Of Birth</Form.Label>
                      <Select
                        placeholder="Select"
                        closeMenuOnSelect={true}
                        options={birth}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Ethnicity</Form.Label>
                      <Select
                        placeholder="Select"
                        closeMenuOnSelect={true}
                        options={ethnicity}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Primary Language</Form.Label>
                      <Select
                        placeholder="Select"
                        closeMenuOnSelect={true}
                        options={language}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Occupation</Form.Label>
                      <Select
                        placeholder="Select"
                        closeMenuOnSelect={true}
                        options={occupation}
                      />
                    </Form.Group>
                    
                  </div>
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

export default ChildEnrollment5;
