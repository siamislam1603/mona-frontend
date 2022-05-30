import React, { useState } from "react";
import { Button, Col, Container, Row, Form, Modal } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link } from 'react-router-dom';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';


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
          <Row>
            <Col lg={3} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control type="text" name="sdate" />
              </Form.Group>
            </Col>
            <Col lg={3} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Start Time</Form.Label>
                <Form.Control type="text" name="stime" />
              </Form.Group>
            </Col>
            <Col lg={3} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control type="text" name="edate" />
              </Form.Group>
            </Col>
            <Col lg={3} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>End Time</Form.Label>
                <Form.Control type="text" name="etime" />
              </Form.Group>
            </Col>
            <Col lg={3} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Applicable to all users</Form.Label>
                
              </Form.Group>
            </Col>
            <Col lg={9} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Select User Roles</Form.Label>
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={training}
                />
              </Form.Group>
            </Col>
            
            
          </Row>
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
