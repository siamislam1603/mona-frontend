import axios from "axios";
import React, { useState } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { BASE_URL } from "../components/App";

const ChildRegister = () => {
  const [form, setForm] = useState({ school: "Y", sex: "M", physical: "Y", service: "Y" });
  const [errors, setErrors] = useState({});

  const addChild = async (data) => {
    const token = localStorage.getItem('token');
    const res = await axios.post(`${BASE_URL}/child/signup`, data, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (res.status === 201 && res.data?.status === 'success') {
      window.location.ref = "/dashboard";
    }
  };

  const setField = e => {
    const { name: field, value } = e.target;
    setForm({ ...form, [field]: value });
    console.log("form ---->", form);
    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const checkValidation = () => {
    let newErrors = {};
    let { child_name, family_name, given_name, usually_called, dob, country_of_birth, home_address } = form;
    if (!child_name) {
      newErrors.child_name = "Child name is required";
    }
    if (!family_name) {
      newErrors.family_name = "Family name is required";
    }
    if (!given_name) {
      newErrors.given_name = "Given name is required";
    }
    if (!usually_called) {
      newErrors.usually_called = "Usually called is required";
    }
    if (!dob) {
      newErrors.dob = "Date of Birth is required";
    }
    if (!country_of_birth) {
      newErrors.country_of_birth = "Country of Birth is required";
    }
    if (!home_address) {
      newErrors.home_address = "Home Address is required";
    }

    console.log("newErrors---->", newErrors);
    return newErrors;
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const newErrors = checkValidation();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      addChild(form)
    }
  }

  return (
    <>
      <section className="child_register">
        <Container>
          <Form>
            <div className="child_heading">
              <Row className="align-items-center">
                <Col md={12}>
                  <p>Mona Family Day Care</p>
                </Col>
              </Row>
            </div>
            <div className="child_information">
              <Row>
                <Col md={12}>
                  <h2>Information about the child</h2>
                  <div className="child_information_box">
                    <Row>
                      <Col md={4}>
                        <div className="child_info_field">
                          <span>Child's full name:</span>
                          <Form.Control
                            type="text"
                            name="child_name"
                            className="child_input"
                            placeholder=""
                            onChange={setField}
                            isInvalid={!!errors.child_name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.child_name}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="child_info_field">
                          <span>Family name:</span>
                          <Form.Control
                            type="text"
                            name="family_name"
                            className="child_input"
                            placeholder=""
                            onChange={setField}
                            isInvalid={!!errors.family_name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.family_name}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="child_info_field">
                          <span>Given name:</span>
                          <Form.Control
                            type="text"
                            className="child_input"
                            placeholder=""
                            name="given_name"
                            onChange={setField}
                            isInvalid={!!errors.given_name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.given_name}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="child_info_field">
                          <span>Usually called:</span>
                          <Form.Control
                            type="text"
                            className="child_input"
                            placeholder=""
                            name="usually_called"
                            onChange={setField}
                            isInvalid={!!errors.usually_called}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.usually_called}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="child_info_field">
                          <span>Date of birth:</span>
                          <Form.Control
                            type="date"
                            className="child_input"
                            placeholder=""
                            name="dob"
                            onChange={setField}
                            isInvalid={!!errors.dob}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.dob}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="child_info_field sex">
                          <span>Sex:</span>
                          <div className="d-flex mt-2">
                            <div className="btn-radio d-flex align-items-center">
                              <label htmlFor="male">Male</label>
                              <Form.Check
                                type="radio"
                                name="sex"
                                id="male"
                                value="M"
                                defaultChecked
                                onChange={setField}
                              />
                            </div>
                            <div className="btn-radio d-flex align-items-center">
                              <label htmlFor="female">Female</label>
                              <Form.Check
                                type="radio"
                                name="sex"
                                id="female"
                                value="F"
                                onChange={setField}
                              />
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="child_info_field">
                          <span>Home address:</span>
                          <Form.Control
                            type="text"
                            className="child_input"
                            placeholder=""
                            name="home_address"
                            onChange={setField}
                            isInvalid={!!errors.home_address}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.home_address}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="child_info_field">
                          <span>Languages(s) spoken in the home:</span>
                          <Form.Control
                            type="text"
                            className="child_input"
                            placeholder=""
                            name="languages_spoken_in_home"
                            onChange={setField}
                            isInvalid={!!errors.languages_spoken_in_home}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.languages_spoken_in_home}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="child_info_field">
                          <span>Country of birth:</span>
                          <Form.Control
                            type="text"
                            className="child_input"
                            placeholder=""
                            name="country_of_birth"
                            onChange={setField}
                            isInvalid={!!errors.country_of_birth}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.country_of_birth}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="child_info_field">
                          <span>
                            Is the child of aboriginal and/or Torres Strait
                            islander origin? (please tick):
                          </span>
                          <Row>
                            <Col md={6}>
                              <div className="btn-radio d-flex align-items-center">
                                <Form.Check
                                  type="checkbox"
                                  name="aboriginal"
                                  id="aboriginal1"
                                  onChange={setField}
                                />
                                <label htmlFor="aboriginal1">
                                  No, not Aboriginal or Torres Strait Islander
                                  Yes, Aboriginal
                                </label>
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="btn-radio d-flex align-items-center">
                                <Form.Check
                                  type="checkbox"
                                  name="aboriginal"
                                  id="aboriginal2"
                                  onChange={setField}
                                />
                                <label htmlFor="aboriginal2">
                                  Yes, Aboriginal
                                </label>
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="btn-radio d-flex align-items-center">
                                <Form.Check
                                  type="checkbox"
                                  name="aboriginal"
                                  id="aboriginal3"
                                  onChange={setField}
                                />
                                <label htmlFor="aboriginal3">
                                  Yes, Aboriginal and Torres Strait Islander
                                  Yes, Aboriginal
                                </label>
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="btn-radio d-flex align-items-center">
                                <Form.Check
                                  type="checkbox"
                                  name="aboriginal"
                                  id="aboriginal4"
                                  onChange={setField}
                                />
                                <label htmlFor="aboriginal4">
                                  Yes, Torres Strait Islander
                                </label>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="child_info_field sex">
                          <span>
                            Does the child have a developmental delay or
                            disability including intellectual, sensory or
                            physical impairment?:
                          </span>
                          <div className="d-flex mt-2">
                            <div className="btn-radio d-flex align-items-center">
                              <label htmlFor="no">No</label>
                              <Form.Check
                                type="radio"
                                name="phisical"
                                id="no"
                                value="N"
                                onChange={setField}
                              />
                            </div>
                            <div className="btn-radio d-flex align-items-center">
                              <label htmlFor="yes">Yes</label>
                              <Form.Check
                                type="radio"
                                name="phisical"
                                id="yes"
                                value="Y"
                                defaultChecked
                                onChange={setField}
                              />
                            </div>
                            <div>
                              , if "Yes please provide information{" "}
                              <strong>
                                (Inclusion Support Form if applicable)
                              </strong>
                            </div>
                          </div>
                        </div>
                      </Col>

                      {form.phisical === "Y" || !form.phisical ? (
                        <>
                          <Col md={7}>
                            <div className="child_info_field">
                              <span>Child Medicare No:</span>
                              <Form.Control
                                type="text"
                                className="child_input"
                                placeholder=""
                                name="child_medicare_no"
                                onChange={setField}
                              />
                            </div>
                          </Col>
                          <Col md={5}>
                            <div className="child_info_field">
                              <span>Child CRN:</span>
                              <Form.Control
                                type="text"
                                className="child_input"
                                placeholder=""
                                name="child_crn"
                                onChange={setField}
                              />
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="child_info_field">
                              <span>Parent's CRN 1:</span>
                              <Form.Control
                                type="text"
                                className="child_input"
                                placeholder=""
                                name="parent_crn_1"
                                onChange={setField}
                              />
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="child_info_field">
                              <span>Parent's CRN 2:</span>
                              <Form.Control
                                type="text"
                                className="child_input"
                                placeholder=""
                                name="parent_crn_2"
                                onChange={setField}
                              />
                            </div>
                          </Col>
                        </>
                      ) : null}
                      <Col md={12}>
                        <div className="child_info_field sex">
                          <span>Is this child using another service?</span>
                          <div className="d-flex mt-2">
                            <div className="btn-radio d-flex align-items-center">
                              <label htmlFor="no">Yes</label>
                              <Form.Check
                                type="radio"
                                name="service"
                                id="yes"
                                defaultChecked
                                value="Y"
                                onChange={setField}
                              />
                            </div>
                            <div className="btn-radio d-flex align-items-center">
                              <label htmlFor="yes">No</label>
                              <Form.Check
                                type="radio"
                                name="service"
                                value="N"
                                id="no"
                                onChange={setField}
                              />
                            </div>
                            <div>
                              If you answered YES please specify day and hours
                              at other service.
                            </div>
                          </div>
                        </div>
                      </Col>

                      {form.service === "Y" || !form.service ? (
                        <>
                          <Col md={2}>
                            <div className="child_info_field">
                              <span>Monday</span>
                              <Form.Control
                                type="time"
                                className="child_input"
                                placeholder=""
                                name="monday_time"
                                onChange={setField}
                              />
                            </div>
                          </Col>
                          <Col md={2}>
                            <div className="child_info_field">
                              <span>Tuesday</span>
                              <Form.Control
                                type="time"
                                className="child_input"
                                placeholder=""
                                name="tuesday_time"
                                onChange={setField}
                              />
                            </div>
                          </Col>
                          <Col md={2}>
                            <div className="child_info_field">
                              <span>Wednesday</span>
                              <Form.Control
                                type="time"
                                className="child_input"
                                placeholder=""
                                name="wednesday_time"
                                onChange={setField}
                              />
                            </div>
                          </Col>
                          <Col md={2}>
                            <div className="child_info_field">
                              <span>Thursday</span>
                              <Form.Control
                                type="time"
                                className="child_input"
                                placeholder=""
                                name="thursday_time"
                                onChange={setField}
                              />
                            </div>
                          </Col>
                          <Col md={2}>
                            <div className="child_info_field">
                              <span>Friday</span>
                              <Form.Control
                                type="time"
                                className="child_input"
                                placeholder=""
                                name="friday_time"
                                onChange={setField}
                              />
                            </div>
                          </Col>
                        </>
                      ) : null}
                      <Col md={12}>
                        <div className="child_info_field sex">
                          <span>School Status:</span>
                          <div className="d-flex mt-2">
                            <div className="btn-radio d-flex align-items-center">
                              <label htmlFor="at_school">At School</label>
                              <Form.Check
                                type="radio"
                                name="school"
                                id="at_school"
                                value="Y"
                                defaultChecked
                                onChange={setField}
                              />
                            </div>
                            <div className="btn-radio d-flex align-items-center">
                              <label htmlFor="non_school">Non- School</label>
                              <Form.Check
                                type="radio"
                                name="school"
                                id="non_school"
                                value="N"
                                onChange={setField}
                              />
                            </div>
                          </div>
                        </div>
                      </Col>
                      {form.school === "Y" ? (
                        <Col md={12}>
                          <div className="child_info_field">
                            <span>
                              If at School, Date first went to School:
                            </span>
                            <Form.Control
                              type="text"
                              className="child_input"
                              placeholder=""
                            />
                          </div>
                        </Col>
                      ) : null}
                      {form.school === "N" ? (
                        <Col md={12}>
                          <div className="child_info_field">
                            <span>
                              If at school, name and address of school:
                            </span>
                            <Form.Control
                              type="text"
                              className="child_input"
                              placeholder=""
                            />
                          </div>
                        </Col>
                      ) : null}
                      <Col md={12}>
                        <div className="custom_submit">
                          <Button className="custom_submit_button w-auto ml-auto mr-auto d-block" onClick={onSubmit}>
                            Submit
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
          </Form>
        </Container>
      </section>
    </>
  );
};

export default ChildRegister;
