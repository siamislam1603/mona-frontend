import {
  faEllipsisVertical,
  faPen,
  faPlus,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import {
  Accordion,
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  Row,
} from "react-bootstrap";
import LeftNavbar from "../../components/LeftNavbar";
import TopHeader from "../../components/TopHeader";

function FormResponse(props) {
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
                <Row>
                  <Col sm={8}>
                    <div className="mynewForm-heading  mb-0">
                      <Button
                        onClick={() => {
                          props.history.push("/form");
                        }}
                      >
                        <img src="../../img/back-arrow.svg" />
                      </Button>
                      <h4 className="mynewForm">My New Form</h4>
                    </div>
                  </Col>
                </Row>
                <div className="responses-forms-header-section forms-header-section">
                  <div className="forms-managment-section">
                    <div className="forms-managment-left">
                      <p>2 Responses</p>
                    </div>
                    <div className="forms-managment-right">
                      <div className="forms-search">
                        <Form.Group>
                          <div className="forms-icon">
                            <img src="../img/search-icon-light.svg" alt="" />
                          </div>
                          <Form.Control
                            type="text"
                            placeholder="Search..."
                            name="search"
                          />
                        </Form.Group>
                      </div>
                      <div className="forms-filter">
                        <Button variant="outline-primary">
                          <img src="../img/Vector.svg" />
                          Add Filters
                        </Button>
                      </div>
                      <div className="forms-toogle">
                        <div class="custom-menu-dots">
                          <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic">
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item href="#/action-1">
                                <FontAwesomeIcon icon={faPen} /> Edit
                              </Dropdown.Item>
                              <Dropdown.Item href="#/action-2">
                                <FontAwesomeIcon icon={faRemove} /> Remove
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="responses-collapse">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <div className="responses-header-row">
                          <div className="responses-header-left">
                            <div className="responses-header-image">
                              <img src="../img/small-user.png" alt="" />
                            </div>
                            <div className="responses-header-detail">
                              <h5>James Parker</h5>
                              <h6>
                                <span>Educator,</span> Smile Daycare
                              </h6>
                            </div>
                          </div>
                          <div className="responses-header-right">
                            <p>
                              Completed on: <br />
                              05/15/2022, 14:00:00 hrs
                            </p>
                          </div>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="responses-content-wrap">
                          <h4 className="content-wrap-title">Section Name</h4>
                          <div className="responses-content-box">
                            <div className="responses-content-question">
                              <span>1</span>
                              <h6>Some text here for the label</h6>
                            </div>
                            <div className="responses-content-answer">
                              <img src="../img/bx_right-arrow-alt.svg" alt="" />
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                              </p>
                            </div>
                          </div>
                          <div className="responses-content-box">
                            <div className="responses-content-question">
                              <span>2</span>
                              <h6>Some text here for the label</h6>
                            </div>
                            <div className="responses-content-answer">
                              <img src="../img/bx_right-arrow-alt.svg" alt="" />
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                              </p>
                            </div>
                          </div>
                          <div className="responses-content-box">
                            <div className="responses-content-question">
                              <span>3</span>
                              <h6>Some text here for the label</h6>
                            </div>
                            <div className="responses-content-answer">
                              <img src="../img/bx_right-arrow-alt.svg" alt="" />
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                              </p>
                            </div>
                          </div>
                          <div className="responses-content-box">
                            <div className="responses-content-question">
                              <span>4</span>
                              <h6>Some text here for the label</h6>
                            </div>
                            <div className="responses-content-answer">
                              <img src="../img/bx_right-arrow-alt.svg" alt="" />
                              <div className="answer-files">
                                <img src="../img/audio-ico.png" alt="" />
                                <h4>audiofilename.mp3</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>
                        <div className="responses-header-row">
                          <div className="responses-header-left">
                            <div className="responses-header-image">
                              <img src="../img/small-user.png" alt="" />
                            </div>
                            <div className="responses-header-detail">
                              <h5>James Parker</h5>
                              <h6>
                                <span>Educator,</span> Smile Daycare
                              </h6>
                            </div>
                          </div>
                          <div className="responses-header-right">
                            <p>
                              Completed on: <br />
                              05/15/2022, 14:00:00 hrs
                            </p>
                          </div>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="responses-content-wrap">
                          <h4 className="content-wrap-title">Section Name</h4>
                          <div className="responses-content-box">
                            <div className="responses-content-question">
                              <span>1</span>
                              <h6>Some text here for the label</h6>
                            </div>
                            <div className="responses-content-answer">
                              <img src="../img/bx_right-arrow-alt.svg" alt="" />
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                              </p>
                            </div>
                          </div>
                          <div className="responses-content-box">
                            <div className="responses-content-question">
                              <span>2</span>
                              <h6>Some text here for the label</h6>
                            </div>
                            <div className="responses-content-answer">
                              <img src="../img/bx_right-arrow-alt.svg" alt="" />
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                              </p>
                            </div>
                          </div>
                          <div className="responses-content-box">
                            <div className="responses-content-question">
                              <span>3</span>
                              <h6>Some text here for the label</h6>
                            </div>
                            <div className="responses-content-answer">
                              <img src="../img/bx_right-arrow-alt.svg" alt="" />
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                              </p>
                            </div>
                          </div>
                          <div className="responses-content-box">
                            <div className="responses-content-question">
                              <span>4</span>
                              <h6>Some text here for the label</h6>
                            </div>
                            <div className="responses-content-answer">
                              <img src="../img/bx_right-arrow-alt.svg" alt="" />
                              <div className="answer-files">
                                <img src="../img/audio-ico.png" alt="" />
                                <h4>audiofilename.mp3</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}

export default FormResponse;
