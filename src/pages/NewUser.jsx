import React, { useState } from "react";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import DragDropSingle from "../components/DragDropSingle";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();
const styles = {
  option: (styles, state) => ({
    ...styles,
    backgroundColor: state.isSelected ? "#E27235" : "",
  }),
};
const role = [
  {
    value: "educator",
    label: "Educator",
  },
  {
    value: "educator",
    label: "Educator",
  },
];
const city = [
  {
    value: "sydney",
    label: "Sydney",
  },
  {
    value: "melbourne",
    label: "Melbourne",
  },
];
const training = [
  {
    value: "by-companies",
    label: "By Companies",
  },
  {
    value: "by-round",
    label: "By Round",
  },
];

const NewUser = () => {
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
                <TopHeader/>
                <div className="entry-container">
                  <header className="title-head">
                    <h1 className="title-lg">New User</h1>
                  </header>
                  <div className="maincolumn">
                    <div className="new-user-sec">
                      <div className="user-pic-sec">
                        <DragDropSingle/>
                      </div>
                      <div className="user-form">
                        <Row>
                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Full Name" />
                          </Form.Group>
                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>User Role</Form.Label>
                            <Select
                              closeMenuOnSelect={false}
                              options={role}
                            />
                          </Form.Group>
                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>City</Form.Label>
                            <Select
                              closeMenuOnSelect={false}
                              options={city}
                            />
                          </Form.Group>
                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" placeholder="Enter Your Address" />
                          </Form.Group>
                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" placeholder="Enter Your Email ID" />
                          </Form.Group>
                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Contact Number</Form.Label>
                            <div className="tel-col">
                              <Form.Control as="select" className="telcode">
                                <option>+91</option>
                                <option>+91</option>
                                <option>+91</option>
                                <option>+91</option>
                                <option>+91</option>
                              </Form.Control>
                              <Form.Control type="tel" placeholder="Enter Your Number" />
                            </div>
                          </Form.Group>
                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Training Categories</Form.Label>
                            <Select
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              isMulti
                              options={training}
                            />
                          </Form.Group>
                          <Col md={12}>
                            <div className="cta text-center mt-5">
                              <Button variant="transparent" type="submit">Back to All Users</Button>
                              <Button variant="primary" type="submit">Save Details</Button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
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

export default NewUser;
