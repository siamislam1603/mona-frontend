import React, { useState, useEffect } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { BASE_URL } from "../../components/App";
import { createOperatingManualValidation } from "../../helpers/validation";
import MyEditor from "../CKEditor";

const AddOperatingManual = () => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [category, setCategory] = useState([]);
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
  useEffect(() => {
    getCategory();
  }, []);
  const getCategory = async () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${BASE_URL}/operating_manual/category`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
        console.log("result---->", result.result);
        setCategory(result.result);
      })
      .catch((error) => console.log("error", error));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const newErrors = createOperatingManualValidation(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const body = new FormData();
      body.append("image", form.media);
      body.append("description", "sample video");
      body.append("title", "video");
      body.append("uploadedBy", "vaibhavi");
      var myHeaders = new Headers();
      myHeaders.append("role", "admin");
      fetch(
        `https://766a-2409-4053-2e07-4723-f958-1c8c-a080-1a86.in.ngrok.io/uploads/uiFiles`,
        {
          method: "post",
          body: body,
          headers: myHeaders,
        }
      )
        .then((res) => res.json())
        .then((res) => {
          let data = { ...form };
          data["media"] = res.url;
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(data),
            redirect: "follow",
          };

          fetch(`${BASE_URL}/operating_manual/add`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
              result = JSON.parse(result);
              alert(result?.message);
            })
            .catch((error) => console.log("error", error));
        });
    }
  };
  return (
    <>
      <section className="child_register">
        <Container>
          <Form>
            <div className="child_information">
              <Row>
                <Col md={12}>
                  <h2>Add Operating Manual</h2>
                  <div className="child_information_box">
                    <Row>
                      <Col md={12}>
                        <div className="child_info_field">
                          <span>Question:</span>
                          <Form.Control
                            type="text"
                            name="question"
                            className="child_input"
                            placeholder=""
                            onChange={(e) => {
                              setField(e.target.name, e.target.value.trim());
                            }}
                            isInvalid={!!errors.question}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.question}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="child_info_field">
                          <span>Answer:</span>
                          <MyEditor handleChange={setField} />
                          <p>{errors.answer}</p>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label className="createFormLabel">
                            Operating Manual Category
                          </Form.Label>
                          <Form.Select
                            name="category"
                            className="child_input"
                            aria-label="Default select example"
                            onChange={(e) => {
                              setField(e.target.name, e.target.value);
                            }}
                            isInvalid={!!errors.category}
                          >
                            <option>Operating Manual Category</option>
                            {category?.map((item) => {
                              return (
                                <option value={item.id}>
                                  {item.category_name}
                                </option>
                              );
                            })}
                          </Form.Select>

                          <Form.Control.Feedback type="invalid">
                            {errors.category}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <div className="child_info_field">
                          <span>Media:</span>
                          <Form.Control
                            type="file"
                            name="media"
                            className="child_input"
                            placeholder=""
                            onChange={(e) => {
                              setField(e.target.name, e.target.files[0]);
                            }}
                            isInvalid={!!errors.question}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.question}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="custom_submit">
                          <Button
                            className="custom_submit_button w-auto ml-auto mr-auto d-block"
                            onClick={onSubmit}
                          >
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

export default AddOperatingManual;
