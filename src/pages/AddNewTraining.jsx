import React, { useState } from "react";
import { Button, Col, Container, Row, Form, Modal } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link } from 'react-router-dom';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Multiselect from "multiselect-react-dropdown";
import DropAllFile from "../components/DragDrop";


const animatedComponents = makeAnimated();

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

const timereq = [
  {
    value: "3",
    label: "3",
  },
  {
    value: "5",
    label: "5",
  },
];
const AddNewTraining = () => {

const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);

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
                    <h1 className="title-lg">Add New Training <span className="setting-ico" onClick={handleShow}><img src="../img/setting-ico.png" alt=""/></span></h1>
                  </header>
                  <div className="training-form">
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Training Name</Form.Label>
                          <Form.Control type="text" name="training_name" />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Training Category</Form.Label>
                          <Select
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              isMulti
                              options={training}
                            />
                        </Form.Group>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Training Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="training_description"
                            rows={3}
                            />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group className="relative">
                          <Form.Label>Time required to complete</Form.Label>
                          <Select
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              options={timereq}
                            />
                            <span className="rtag">hours</span>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Cover Image :</Form.Label>
                          <DropAllFile />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Video Tutorial Here :</Form.Label>
                          <DropAllFile />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Related Files :</Form.Label>
                          <DropAllFile />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <div className="cta text-center mt-5 mb-5">
                          <Button variant="outline" className="me-3" type="submit">Preview</Button>
                          <Button variant="primary" type="submit">Save</Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
      
      <Modal className="training-modal" size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><img src="../img/setting-ico.png" alt=""/> Training Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settings-content">
            <Row>
              <Col lg={3} sm={6}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control type="date" name="form_name" />
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-sm-0">
                <Form.Group>
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control type="time" name="form_name" />
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control type="date" name="form_name" />
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                <Form.Group>
                  <Form.Label>End Time</Form.Label>
                  <Form.Control type="time" name="form_name" />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label>Applicable to all users</Form.Label>
                  <div className="new-form-radio">
                    <div className="new-form-radio-box">
                      <label for="yes1">
                        <input
                          type="radio"
                          value="Yes"
                          name="form_template_select1"
                          id="yes1"
                        />
                        <span className="radio-round"></span>
                        <p>Yes</p>
                      </label>
                    </div>
                    <div className="new-form-radio-box">
                      <label for="no1">
                        <input
                          type="radio"
                          value="No"
                          name="form_template_select1"
                          id="no1"
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              <Col lg={9} md={6}  className="mt-3 mt-md-0">
                <Form.Group>
                  <Form.Label>Select User Roles</Form.Label>
                  <Multiselect
                    placeholder="Select User Roles"
                    displayValue="key"
                    className="multiselect-box default-arrow-select"
                    onKeyPressFn={function noRefCheck() {}}
                    onRemove={function noRefCheck() {}}
                    onSearch={function noRefCheck() {}}
                    onSelect={function noRefCheck() {}}
                    options={[
                      {
                        cat: "Group 1",
                        key: "Option 1",
                      },
                      {
                        cat: "Group 1",
                        key: "Option 2",
                      },
                      {
                        cat: "Group 1",
                        key: "Option 3",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 4",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 5",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 6",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 7",
                      },
                    ]}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="transparent" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary">
            Save Settings
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddNewTraining;
