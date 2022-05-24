import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import LeftNavbar from "../../../components/LeftNavbar";
import TopHeader from "../../../components/TopHeader";

function AddFormField() {
  return (
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
                <Col sm={8}>
                  <h4>My New Form</h4>
                </Col>
                <Col sm={4}>
                  <a href="#">Questions</a>
                  <a href="#">Answers</a>
                </Col>
                <Col sm={12}>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua.
                  </p>
                </Col>
              </Row>
              <Form>
                <Row>
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>Label 1</Form.Label>
                      <Form.Control
                        type="text"
                        name="form_label"
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label> </Form.Label>
                      <Form.Select name="field_type">
                        <option>Field Type</option>
                        <option value="text">Text Answer</option>
                        <option value="radio">Multiple Choice</option>
                        <option value="checkbox">Checkboxes</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col sm={12}>
                    <Button>Preview</Button>
                    <Button className="primary">Save Form</Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default AddFormField;
