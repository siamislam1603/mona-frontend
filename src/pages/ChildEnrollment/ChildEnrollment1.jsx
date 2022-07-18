import axios from "axios";
import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { BASE_URL } from "../../components/App";
import ChildEnrollment5 from "./ChildEnrollment5";

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
    const response = await axios.post(`${BASE_URL}/child/signup`, data);
    console.log('Response:', response);
    if (response.status === 201)
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
    nextStep();
  };


  return (
    <>
      <div className="enrollment-form-sec my-5">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <div className="grayback">
              <h2 className="title-xs mb-2">Information about the child</h2>
              <p className="form_info mb-4">A parent or guardian who has lawful authority in relation to the child must complete this form. Licensed children’s services may use this form to collect the child’s enrolment information as required in the Children’s Service’s Regulations 2017 and education and care services national law act 2010. Based on these regulations, parents are not required to fill questions marked with an asterisk, however, it will be highly important for the service to have those details.</p>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Child’s Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullname"
                      placeholder="Child’s Full Name"
                      value={formOneData.fullname || ""}
                      onChange={handleFormOneChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Family Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Family Name"
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
                      placeholder="Usually Called"
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
                      placeholder="Some text here for the label"
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
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="py-3"> if at School, Date first went to School :</Form.Label>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Control type="date" placeholder="" name="dob" />
                  </Form.Group>
                </Col>
                <Col md={2}>

                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="py-3">if at School, Name and address of School</Form.Label>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Control type="date" placeholder="" name="dob" />
                  </Form.Group>
                </Col>
                <Col md={2}>

                </Col>
                {/* <Col md={12} className="">
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
                </Col> */}
              </Row>
            </div>
          </div>
          <div className="enrollment-form-sec mt-5">
            <Form onSubmit={submitFormData}>
              <div className="enrollment-form-column">
                <h2 className="title-xs mb-3">Information about the child’s parents or guardians</h2>
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
                          <Form.Control type="text" placeholder="Family Name" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Given Name</Form.Label>
                          <Form.Control type="text" placeholder="Given Name" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Date Of Birth</Form.Label>
                          <Form.Control type="date" placeholder="" name="dob" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Address As Per Child</Form.Label>
                          <Form.Control as="textarea" rows={3} placeholder="Address As Per Child" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Telephone</Form.Label>
                          <Form.Control type="tel" placeholder="+3375005467" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control type="email" placeholder="Email Address" />
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
                          <Form.Control type="text" placeholder="Family Name" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Given Name</Form.Label>
                          <Form.Control type="text" placeholder="Given Name" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Date Of Birth</Form.Label>
                          <Form.Control type="date" placeholder="" name="dob" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Address As Per Child</Form.Label>
                          <Form.Control as="textarea" rows={3} placeholder="Address As Per Child" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Telephone</Form.Label>
                          <Form.Control type="tel" placeholder="+3375005467" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control type="email" placeholder="Email Address" />
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
                  </Row>
                </div>

              </div>
              {/* <div className="cta text-center mt-5 mb-5">
            <Button variant="outline" type="submit" onClick={prevStep} className="me-3">Previous</Button>
            <Button variant="primary" type="submit">Next</Button>
          </div> */}
            </Form>
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
