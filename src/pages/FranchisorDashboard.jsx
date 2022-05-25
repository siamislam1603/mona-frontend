import React, { useState } from "react";
import { Button, Col, Container, Row, Form, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link } from 'react-router-dom';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";


const FranchisorDashboard = () => {
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
                  <Row>
                    <Col md={7}>
                      <div className="maincolumn">
                        <div className="access-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h1 className="title-sm mb-0"><strong>Quick Access Links</strong></h1>
                          </header>
                          <div className="column-list access-list three-col">
                            <div className="item">
                              <a href="/" className="flex">
                                <div className="pic"><img src="../img/story-ico.png" alt=""/></div>
                                <div className="name">Story park</div>
                              </a>
                            </div>
                            <div className="item">
                              <a href="/" className="flex">
                                <div className="pic"><img src="../img/harmony-ico.png" alt=""/></div>
                                <div className="name">Harmony</div>
                              </a>
                            </div>
                            <div className="item">
                              <a href="/" className="flex">
                                <div className="pic"><img src="../img/engagebay-ico.png" alt=""/></div>
                                <div className="name">Engagebay</div>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="record-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h2 className="title-sm mb-0"><strong>Record of Audits</strong></h2>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <div className="record-column">
                            <div className="item">
                              <div className="fixcol">
                                <div className="icopic"><img src="../img/folder-ico.png" alt=""/></div>
                                <div className="iconame">COVID Survey 2022 <span className="date">Created on: 01/22/2022</span></div>
                                <div className="cta-col">
                                  <div className="record-modi">Last modified by: <br/> Special Daycare on 04/29/2022</div>
                                  <Dropdown>
                                    <Dropdown.Toggle variant="transparent" id="ctacol">
                                      <img src="../img/dot-ico.svg" alt=""/>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item href="#">Delete</Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>
                              <hr/>
                              <div className="record-status">
                                <Row>
                                  <Col lg={5} md={6}>
                                    <div className="cprogress text-center">
                                      <Progress type="circle" width={150} strokeWidth={14} percent={56}
                                        theme={{
                                          active: {
                                            trailColor: '#dbdbdb',
                                            color: '#AA0061'
                                          }
                                        }} />
                                    </div>
                                  </Col>
                                  <Col lg={7} md={6}>
                                    <div className="status-col">
                                      <div className="col">
                                        <small>Status</small>
                                        <p>Active</p>
                                      </div>
                                      <div className="col">
                                        <small>Form Type</small>
                                        <p>One time fill and submit</p>
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                              <div className="record-submission">
                                <Row>
                                  <Col md={6}>
                                    <div className="submission-col text-center">
                                      <p>56</p>
                                      <small>Total Submissions</small>
                                    </div>
                                  </Col>
                                  <Col md={6}>
                                    <div className="submission-col text-center">
                                      <p>56</p>
                                      <small>Pending Submissions</small>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                              <hr/>
                              <div className="record-value">
                                <div className="label">
                                  <small>Label1</small>
                                  <p>Value 1</p>
                                </div>
                                <div className="label">
                                  <small>Label2</small>
                                  <p>Value 2</p>
                                </div>
                                <div className="label">
                                  <small>Label3</small>
                                  <p>Value 3</p>
                                </div>
                                <div className="label">
                                  <small>Label4</small>
                                  <p>Value 4</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={5}>
                      <aside className="rightcolumn">
                        <div className="activity-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Activity</strong></h4>
                          </header>
                          <div className="activity-list">
                            <div className="item">
                              <span className="name">Logged in Users</span>
                              <span className="separator">|</span>
                              <span className="num">04</span>
                            </div>
                            <div className="item">
                              <span className="name">Users yet to log in</span>
                              <span className="separator">|</span>
                              <span className="num">04</span>
                            </div>
                            <div className="item">
                              <span className="name">Total Forms</span>
                              <span className="separator">|</span>
                              <span className="num">04</span>
                            </div>
                            <div className="item">
                              <span className="name">Total Franchisee</span>
                              <span className="separator">|</span>
                              <span className="num">14</span>
                            </div>
                          </div>
                        </div>
                        <div className="ads text-center pb-5">
                          <img src="../img/icon-column.png" alt=""/>
                        </div>
                      </aside>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default FranchisorDashboard;
