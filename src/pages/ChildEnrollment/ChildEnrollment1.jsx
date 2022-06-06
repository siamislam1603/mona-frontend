import axios from "axios";
import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { API_BASE_URL } from "../../components/App";

const animatedComponents = makeAnimated();

// LANGUAGE DATA
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

// COUNTRY DATA
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

const ChildEnrollment1 = ({ nextStep, handleFormData }) => {
  const [formOneData, setFormOneData] = useState({});

  const saveFormOneData = async (data) => {
    const response = await axios.post(`${API_BASE_URL}/child/signup`, data);
    console.log('Response:', response);
    if(response.status === 201)
      nextStep();
  };
  
  const handleFormOneChange = event => {
    const { name, value } = event.target;
    setFormOneData({
      ...formOneData,
      [name]: value
    });
  };

  const submitFormData = (e) => {
    e.preventDefault();
    saveFormOneData(formOneData);
  };


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
                    <Form.Control 
                      type="text"
                      name="fullname"
                      value={formOneData.fullname || ""}
                      onChange={handleFormOneChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Family Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="family_name"
                      value={formOneData.family_name || ""}
                      onChange={handleFormOneChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>*Usually Called</Form.Label>
                    <Form.Control 
                      type="text"
                      name="usually_called"
                      value={formOneData.usually_called || ""}
                      onChange={handleFormOneChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date Of Birth</Form.Label>
                    <Form.Control 
                      type="date" 
                      placeholder="" 
                      name="dob"
                      value={formOneData.dob || ""}
                      onChange={handleFormOneChange} />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <div className="btn-radio inline-col">
                      <Form.Label>Sex</Form.Label>
                      <Form.Check 
                        type="radio" 
                        name="gender" 
                        id="malecheck" 
                        label="Male" 
                        defaultChecked
                        onChange={(event) => setFormOneData(prevState => ({
                          ...prevState,
                          gender: "M"
                        }))} />
                      <Form.Check 
                        type="radio" 
                        name="gender" 
                        id="femalecheck" 
                        label="Female"
                        onChange={(event) => setFormOneData(prevState => ({
                          ...prevState,
                          gender: "F"
                        }))} />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Home Address</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3}
                      name="home_address"
                      value={formOneData.home_address || ""}
                      onChange={handleFormOneChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Language spoken in the home</Form.Label>
                    <Select
                      placeholder="Select"
                      closeMenuOnSelect={true}
                      options={language}
                      onChange={(e) =>
                        setFormOneData((prevState) => ({
                          ...prevState,
                          language: e.value,
                      }))}
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
                      onChange={(e) =>
                        setFormOneData((prevState) => ({
                          ...prevState,
                          country_of_birth: e.value,
                      }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>*Is the child of Aboriginal and/or Torres Strait Islander origin?</Form.Label>
                    <div className="btn-radio two-col">
                      <Form.Check 
                        type="radio" 
                        name="aboriginaltorres" 
                        id="noaboriginaltorres" 
                        defaultChecked
                        label="No, not Aboriginal or Torres Straight Islander"
                        onChange={(event) => setFormOneData(prevState => ({
                          ...prevState,
                          child_origin: "NATSI"
                        }))} />

                      <Form.Check 
                        type="radio" 
                        name="aboriginaltorres" 
                        id="yesaboriginal" 
                        label="Yes, Aboriginal"
                        onChange={(event) => setFormOneData(prevState => ({
                          ...prevState,
                          child_origin: "A"
                        }))} />
                      <Form.Check 
                        type="radio" 
                        name="aboriginaltorres" 
                        id="yesaboriginaltorres" 
                        label="Yes, Aboriginal and Torres Straight Islander"
                        onChange={(event) => setFormOneData(prevState => ({
                          ...prevState,
                          child_origin: "YATSI"
                        }))} />
                      <Form.Check 
                        type="radio" 
                        name="aboriginaltorres" 
                        id="yestorres" 
                        label="Yes, Torres Straight Islander"
                        onChange={(event) => setFormOneData(prevState => ({
                          ...prevState,
                          child_origin: "TSI"
                        }))} />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>*Does the child have a developmental delay or disability including intellectual, sensory or physical impairment?</Form.Label>
                    <div className="btn-radio inline-col">
                      <Form.Check 
                        type="radio" 
                        name="disability" 
                        id="yesc" 
                        className="ps-0" 
                        label="Yes"
                        defaultChecked
                        onChange={(event) => setFormOneData(prevState => ({
                          ...prevState,
                          development_delay: true
                        }))} />
                      <Form.Check 
                        type="radio" 
                        name="disability" 
                        id="noc" 
                        label="No"
                        onChange={(event) => setFormOneData(prevState => ({
                          ...prevState,
                          development_delay: false
                        }))} />
                    </div>
                    <Form.Text className="text-muted">
                      if ‘Yes’ please provide information (Inclusion Support Form if applicable)
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Child Medical No.</Form.Label>
                    <Form.Control 
                      type="text"
                      name="child_medicare_no"
                      value={formOneData.child_medicare_no || ""}
                      onChange={handleFormOneChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Child CRN</Form.Label>
                    <Form.Control 
                      type="text"
                      name="child_crn"
                      value={formOneData.child_crn || ""}
                      onChange={handleFormOneChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Parents CRN 1</Form.Label>
                    <Form.Control 
                      type="text"
                      name="parent_crn_1"
                      value={formOneData.parent_crn_1 || ""}
                      onChange={handleFormOneChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Parents CRN 2</Form.Label>
                    <Form.Control 
                      type="text"
                      name="parent_crn_2"
                      value={formOneData.parent_crn_2 || ""}
                      onChange={handleFormOneChange} />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Is the child using another service?</Form.Label>
                    <div className="btn-radio inline-col">
                      <Form.Check 
                        type="radio" 
                        name="anotherser" 
                        id="yess" 
                        className="ps-0" 
                        label="Yes"
                        onChange={(event) => setFormOneData(prevState => ({
                          ...prevState,
                          another_service: true
                        }))} />
                      <Form.Check 
                        type="radio" 
                        name="anotherser" 
                        id="nos" 
                        label="No"
                        onChange={(event) => setFormOneData(prevState => ({
                          ...prevState,
                          another_service: false
                        }))} />
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
                      <Form.Check 
                        type="radio" 
                        name="school" 
                        id="atschool" 
                        label="At School" 
                        defaultChecked
                        onChange={(event) => setFormOneData(prevState => ({
                          ...prevState,
                          school_status: "at-school"
                        }))} />
                      <Form.Check 
                        type="radio" 
                        name="school" 
                        id="nonschool" 
                        label="Non School"
                        onChange={(event) => setFormOneData(prevState => ({
                          ...prevState,
                          school_status: "no-school"
                        }))} />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date first went to School</Form.Label>
                    <Form.Control type="date" placeholder="" name="dob" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name of the school</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address of the school</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3}
                      name="school_address" />
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
