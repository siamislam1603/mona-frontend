import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { BASE_URL } from "../components/App";
import { DynamicFormValidation } from "../helpers/validation";
import InputFields from "./InputFields";
import { useLocation } from "react-router-dom";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
let values = [];
const DynamicForm = (props) => {
  const location = useLocation();
  console.log("location----->", location);
  const [formData, setFormData] = useState([]);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({});
  const setField = (field, value) => {
    setForm({ ...form, [field]: value });
    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
    if (field === "hobby") {
      values.includes(value) ? values.pop(value) : values.push(value);
      setForm({ ...form, [field]: values });

      console.log("Values", values);
    }
  };
  useEffect(() => {
    console.log("history---->");
    getFormFields();
  }, []);
  const getFormFields = async () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `${BASE_URL}/field?form_name=${
        location.pathname.split("/")[location.pathname.split("/").length - 1]
      }`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        let res = JSON.parse(result);
        setFormData(res.result);
        console.log(res.result);
      })
      .catch((error) => console.log("error", error));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const newErrors = DynamicFormValidation(form, formData);
    console.log("newErrors---->", newErrors);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          form_id: formData[0]?.form?.id,
          user_id: 1,
          data: form,
        }),
        redirect: "follow",
      };

      fetch("http://localhost:5000/form/add", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          result = JSON.parse(result);
          alert(result?.message);
        })
        .catch((error) => console.log("error", error));
    }
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
                    {formData?.map((item) => {
                      return (
                        <InputFields
                          {...item}
                          error={errors}
                          onChange={setField}
                        />
                      );
                    })}
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
                </Form>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default DynamicForm;
