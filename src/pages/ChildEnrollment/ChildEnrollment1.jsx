import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';


const ChildEnrollment1 = ({ nextStep, handleFormData }) => {
  const submitFormData = (e) => {
    e.preventDefault();
      nextStep();
  };

const animatedComponents = makeAnimated();

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
const country = [
  {
    value: "india",
    label: "India",
  },
  {
    value: "usa",
    label: "USA",
  },
];


  return (
    <>
      <div className="enrollment-form-sec">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <h2 className="title-xs mb-4">Information about the child</h2>
            
            <div className="grayback">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Child’s Full Name</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Family Name</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>*Usually Called</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date Of Birth</Form.Label>
                    <Form.Control type="date" placeholder="" name="dob" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <div className="btn-radio inline-col">
                      <Form.Label>Sex</Form.Label>
                      <Form.Check type="radio" name="gender" id="malecheck" label="Male" defaultChecked />
                      <Form.Check type="radio" name="gender" id="femalecheck" label="Female" />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Home Address</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Language spoken in the home</Form.Label>
                    <Select
                      placeholder="Select"
                      closeMenuOnSelect={true}
                      options={language}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Country Of Birth</Form.Label>
                    <Select
                      placeholder="Select"
                      closeMenuOnSelect={true}
                      options={country}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>*Is the child of Aboriginal and/or Torres Strait Islander origin?</Form.Label>
                    <div className="btn-radio two-col">
                      <Form.Check type="radio" name="aboriginaltorres" id="noaboriginaltorres" label="No, not Aboriginal or Torres Straight Islander" />
                      <Form.Check type="radio" name="aboriginaltorres" id="yesaboriginal" label="Yes, Aboriginal" />
                      <Form.Check type="radio" name="aboriginaltorres" id="yesaboriginaltorres" label="Yes, Aboriginal and Torres Straight Islander" />
                      <Form.Check type="radio" name="aboriginaltorres" id="yestorres" label="Yes, Torres Straight Islander" />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>*Does the child have a developmental delay or disability including intellectual, sensory or physical impairment?</Form.Label>
                    <div className="btn-radio inline-col">
                      <Form.Check type="radio" name="disability" id="yesc" className="ps-0" label="Yes" />
                      <Form.Check type="radio" name="disability" id="noc" label="No" />
                    </div>
                    <Form.Text className="text-muted">
                      if ‘Yes’ please provide information (Inclusion Support Form if applicable)
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Child Medical No.</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Child CRN</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Parents CRN</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Is the child using another service?</Form.Label>
                    <div className="btn-radio inline-col">
                      <Form.Check type="radio" name="anotherser" id="yess" className="ps-0" label="Yes" />
                      <Form.Check type="radio" name="anotherser" id="nos" label="No" />
                    </div>
                    <Form.Text className="text-muted">
                      If you answered YES please specify day and hours at other service.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col xl={3} lg={4} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Monday</Form.Label>
                    <Form.Control type="number" />
                  </Form.Group>
                </Col>
                <Col xl={3} lg={4} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tuesday</Form.Label>
                    <Form.Control type="number" />
                  </Form.Group>
                </Col>
                <Col xl={3} lg={4} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Wednesday</Form.Label>
                    <Form.Control type="number" />
                  </Form.Group>
                </Col>
                <Col xl={3} lg={4} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Thrusday</Form.Label>
                    <Form.Control type="number" />
                  </Form.Group>
                </Col>
                <Col xl={3} lg={4} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Friday</Form.Label>
                    <Form.Control type="number" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <div className="btn-radio inline-col">
                      <Form.Label>School Status :</Form.Label>
                      <Form.Check type="radio" name="school" id="atschool" label="At School" defaultChecked />
                      <Form.Check type="radio" name="school" id="nonschool" label="Non School" />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>If at School, Date first went to School</Form.Label>
                    <Form.Control type="date" placeholder="" name="dob" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>If at School, Name and address of School</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
              </Row>
            </div>
            
          </div>
          <div className="cta text-center mt-5 mb-5">
            <Button variant="primary" type="submit">Next</Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ChildEnrollment1;
