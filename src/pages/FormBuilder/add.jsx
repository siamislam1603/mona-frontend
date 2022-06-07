import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import LeftNavbar from "../../components/LeftNavbar";
import TopHeader from "../../components/TopHeader";
import { BASE_URL } from "../../components/App";
import { createFormValidation } from "../../helpers/validation";
import { useLocation,useNavigate } from 'react-router-dom';

function AddFormBuilder(props) {
  
  const [formData, setFormData] = useState([]);
  const [form, setForm] = useState({ form_template_select: "Yes" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if(location?.state?.id)
    {
      getParticularFormData();
    }
    getFormData();
  }, []);
  const setField = (field, value) => {
    setForm({ ...form, [field]: value });
    console.log("form---->", form);
    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };
  const OnSubmit = (e) => {
    e.preventDefault();
    const newErrors = createFormValidation(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      fetch(`${BASE_URL}/form/add`, {
        method: "post",
        body: JSON.stringify(form),
        headers: myHeaders,
      })
        .then((res) => res.json())
        .then((res) => {
          navigate('/form/field/add',{state:{form_name: form?.form_name}});
        });
    }
  };
  const getParticularFormData = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${BASE_URL}/form/${location?.state?.id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => setForm(result?.result))
      .catch((error) => console.log("error", error));
  };
  const getFormData = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${BASE_URL}/form?search=`, requestOptions)
      .then((response) => response.json())
      .then((result) => setFormData(result?.result))
      .catch((error) => console.log("error", error));
  };
  return (
    <>
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
                <TopHeader />
                <Row>
                  <div className="forms-managment-left new-form-title">
                    <h6>New Form</h6>
                  </div>
                </Row>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Form title</Form.Label>
                        <Form.Control
                          type="text"
                          name="form_name"
                          value={form?.form_name}
                          onChange={(e) => {
                            setField(e.target.name, e.target.value);
                          }}
                          isInvalid={!!errors.form_name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.form_name}
                          </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mt-3 mt-md-0">
                      <Form.Group>
                        <Form.Label>Form Type</Form.Label>
                        <Form.Select
                          name="form_type"
                          onChange={(e) => {
                            setField(e.target.name, e.target.value.trim());
                          }}
                          isInvalid={!!errors.form_type} 
                        >
                          <option value="">Select Form Type</option>
                          <option value="single_submission" selected={form?.form_type==="single_submission"}>
                            One time fill and submit
                          </option>
                          <option value="multi_submission" selected={form?.form_type==="multi_submission"}>
                            Multiple time fill and submit
                          </option>
                          <option value="editable" selected={form?.form_type==="editable"}>
                            One time fill and Edit
                          </option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.form_type}
                          </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={12} className="mt-3 mb-3">
                      <Form.Group>
                        <Form.Label>Form Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="form_description"
                          value={form?.form_description}
                          rows={3}
                          className="child_input"
                          onChange={(e) => {
                            setField(e.target.name, e.target.value);
                          }}
                          isInvalid={!!errors.form_description} 
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.form_description}
                          </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Select Previous Form as a Template
                        </Form.Label>
                        <div className="new-form-radio">
                          <div className="new-form-radio-box">
                            <label for="yes">
                              <input
                                type="radio"
                                value="Yes"
                                name="form_template_select"
                                id="yes"
                                checked={form?.form_template_select === "Yes" || form?.form_template_select === true}
                                onClick={(e) => {
                                  setField(e.target.name, e.target.value);
                                }}
                              />
                              <span className="radio-round"></span>
                              <p>Yes, I want to select</p>
                            </label>
                          </div>
                          <div className="new-form-radio-box">
                            <label for="no">
                              <input
                                type="radio"
                                value="No"
                                name="form_template_select"
                                id="no"
                                onClick={(e) => {
                                  setField(e.target.name, e.target.value);
                                }}
                                checked={form?.form_template_select === "No" || form?.form_template_select === false}
                              />
                              <span className="radio-round"></span>
                              <p>No, I want to create a new form</p>
                            </label>
                          </div>
                        </div>
                      </Form.Group>
                    </Col>
                    {form?.form_template_select === "Yes" ? (
                      <Col md={6}  className="mt-3 mt-md-0">
                        <Form.Group>
                          <Form.Label>Select Previous Form</Form.Label>
                          <Form.Select name="previous_form" isInvalid={!!errors.previous_form}>
                            <option value="1">Select Previous Form</option>
                            {formData?.map((item) => {
                              return (
                                <option value={item.form_name} selected={form?.previous_form===item.form_name}>{item.form_name}</option>
                              );
                            })}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                          {errors.previous_form}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    ) : null}

                    <Col sm={12}>
                      <div className="mt-5 mb-5 d-flex justify-content-center">
                        <Button
                          className="theme-light"
                          onClick={() => {
                            navigate("/form");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button className="primary" onClick={OnSubmit}>
                          Next
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}

export default AddFormBuilder;
