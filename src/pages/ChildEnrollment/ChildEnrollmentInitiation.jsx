import axios from "axios";
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import LeftNavbar from "../../components/LeftNavbar";
import TopHeader from "../../components/TopHeader";
import { useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import { BASE_URL } from "../../components/App";

const ChildEnrollmentInitiation = ({ nextStep, handleFormData }) => {
  let { parentId } = useParams();

  const [formOneChildData, setFormOneChildData] = useState({
    fullname: "",
    dob: "",
    home_address: "",
    gender: "M",
  });
  const [educatorData, setEducatorData] = useState();

  const fetchEducatorList = async () => {
    const response = await axios.get(`${BASE_URL}/user-group/users/educator`);

    if(response.status === 200 && response.data.status === "success") {
      let { users } = response.data;
      setEducatorData(users.map(user => ({
        id: user.id,
        value: user.fullname,
        label: user.fullname
      })));
    }
  };

  const handleChildData = (event) => {
    event.preventDefault();
    let { name, value } = event.target;
    setFormOneChildData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const submitFormData = async (event) => {
    event.preventDefault();
    console.log('SUBMITTING FORM DATA');
    let token = localStorage.getItem('token');
    let response = await axios.post(`${BASE_URL}/enrollment/child`, { ...formOneChildData }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if(response.status === 201 && response.data.status === "success") {
      let { child } = response.data;
      // SAVING PARENT DETAIL
      response = await axios.post(`${BASE_URL}/enrollment/parent/`, {user_parent_id: parentId, childId: child.id}, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if(response.status === 201 && response.data.status === "success") {
        response = await axios.post(`${BASE_URL}/enrollment/child/assign-educators/${child.id}`, { educatorIds: formOneChildData.educator }, {
          headers: {
            "Authorization": `Bearer ${token}`
          }     
        }); 
        if(response.status === 201 && response.data.status === "success") {
          window.location.href = `/children/${parentId}`;
        }
      }
    }
  }

  useEffect(() => {
    fetchEducatorList();
  }, [])
  
  formOneChildData && console.log('CHILD DATA:', formOneChildData);
  educatorData && console.log('EDUCATOR DATA:', educatorData);
  return (
    <>
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar/>
              </aside>
              <div className="sec-column">
                <TopHeader />
                <div className="entry-container">
                  <header className="title-head">
                    <h1 className="title-lg">Child Enrollment Initiation Form</h1>
                  </header>
                  <div className="enrollment-form-sec my-5">
                    <Form onSubmit={submitFormData}>
                      <div className="enrollment-form-column">
                        <div className="grayback">
                          <h2 className="title-xs mb-2">Basic details about the child</h2>
                          <p className="form_info mb-4">A parent or guardian who has lawful authority in relation to the child must complete this form. Licensed children’s services may use this form to collect the child’s enrolment information as required in the Children’s Service’s Regulations 2017 and education and care services national law act 2010. Based on these regulations, parents are not required to fill questions marked with an asterisk, however, it will be highly important for the service to have those details.</p>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Child’s Full Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="fullname"
                                  placeholder="Child’s Full Name"
                                  value={formOneChildData?.fullname || ""}
                                  onChange={(e) => {
                                    handleChildData(e);
                                  }} />
                              </Form.Group>
                            </Col>
                            
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Date Of Birth</Form.Label>
                                <Form.Control
                                  type="date"
                                  placeholder=""
                                  name="dob"
                                  value={formOneChildData?.dob || ""}
                                  onChange={(e) => {
                                    handleChildData(e);
                                  }} />
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
                                    checked={formOneChildData?.gender === "M"}
                                    defaultChecked
                                    onChange={(event) => setFormOneChildData(prevState => ({
                                      ...prevState,
                                      gender: "M"
                                    }))} />
                                  <Form.Check
                                    type="radio"
                                    name="gender"
                                    id="femalecheck"
                                    checked = {formOneChildData?.gender === "F"}
                                    label="Female"
                                    onChange={(event) => setFormOneChildData(prevState => ({
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
                                  value={formOneChildData?.home_address || ""}
                                  onChange={(e) => {
                                    handleChildData(e);
                                  }} />
                              </Form.Group>
                            </Col>

                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Select an Educator:</Form.Label>
                                <Select
                                  placeholder={formOneChildData?.language || "Select"}
                                  closeMenuOnSelect={true}
                                  isMulti
                                  options={educatorData}
                                  onChange={(e) => {
                                    setFormOneChildData((prevState) => ({
                                      ...prevState,
                                      educator: [...e.map(e => e.id)]
                                    }));
                                  }}
                                />
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
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default ChildEnrollmentInitiation;
