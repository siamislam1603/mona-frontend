import React, { useState } from "react";
import { Button, Col, Container, Row, Form, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link } from 'react-router-dom';
import BootstrapTable from "react-bootstrap-table-next";
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

const products = [
  {
    id: 1,
    name: "../img/user.png, Jones Smith",
    specialneed: "Yes",
  },
  {
    id: 2,
    name: "../img/user.png, James Smith",
    specialneed: "Yes",
  },
  {
    id: 3,
    name: "../img/user.png, Andraw Smith",
    specialneed: "No",
  },
  {
    id: 4,
    name: "../img/user.png, Helan Smith",
    specialneed: "Yes",
  },
];
const columns = [
{
  dataField: 'name',
  text: 'Child Name',
  formatter: (cell) => {
    cell=cell.split(",");
    return (<><div className="user-list"><span className="user-pic"><img src={cell[0]} alt=''/></span><span className="user-name">{cell[1]} </span></div></>)
  },
},
{
    dataField: 'specialneed',
    text: 'Child with special needs',
  },
  {
    dataField: "action",
    text: "",
    formatter: (cell) => {
      return (<><div className="cta-col">
        <Dropdown>
          <Dropdown.Toggle variant="transparent" id="ctacol">
            <img src="../img/dot-ico.svg" alt=""/>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#">Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div></>)
    },
  }
];

const EducatorDashboard = () => {
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
                            <div className="item">
                              <a href="/" className="flex">
                                <div className="pic"><img src="../img/xero-ico.png" alt=""/></div>
                                <div className="name">Xero</div>
                              </a>
                            </div>
                            <div className="item">
                              <a href="/" className="flex">
                                <div className="pic"><img src="../img/bitool-ico.png" alt=""/></div>
                                <div className="name">BI Tool</div>
                              </a>
                            </div>
                            <div className="item">
                              <a href="/" className="flex">
                                <div className="pic"><img src="../img/intranet-ico.png" alt=""/></div>
                                <div className="name">Intranet</div>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="children-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Children</strong></h4>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <div className="column-table user-management-sec">
                            <BootstrapTable
                              keyField="name"
                              data={products}
                              columns={ columns }
                            />
                          </div>
                        </div>
                        {/*<div className="files-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h2 className="title-sm mb-0"><strong>Forms</strong></h2>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <div className="column-list files-list two-col">
                            <div className="item">
                              <div className="pic"><img src="../img/folder-ico.png" alt=""/></div>
                              <div className="name">Perfromance Evaluation <span className="time">Created on: 01/22/2022</span></div>
                              <div className="cta-col">
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
                            <div className="item">
                              <div className="pic"><img src="../img/folder-ico.png" alt=""/></div>
                              <div className="name">Perfromance Evaluation <span className="time">Created on: 01/22/2022</span></div>
                              <div className="cta-col">
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
                            <div className="item">
                              <div className="pic"><img src="../img/folder-ico.png" alt=""/></div>
                              <div className="name">Perfromance Evaluation <span className="time">Created on: 01/22/2022</span></div>
                              <div className="cta-col">
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
                            <div className="item">
                              <div className="pic"><img src="../img/folder-ico.png" alt=""/></div>
                              <div className="name">Perfromance Evaluation <span className="time">Created on: 01/22/2022</span></div>
                              <div className="cta-col">
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
                          </div>
                        </div>
                        <div className="Policies-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h3 className="title-sm mb-0"><strong>Policies</strong></h3>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <div className="column-list policies-list">
                            <div className="item">
                              <div className="pic"><img src="../img/policies-ico.png" alt=""/></div>
                              <div className="name">Title goes here <span className="time">Udpated on: 12 April, 2022</span></div>
                              <div className="content">
                                <p>Privacy Policy is meant to help you understand what information we collect, why we collect it, and how you can update, manage, export, and delete your account. Privacy Policy is meant to help you understand what information we collect, why we collect it, and how you can update, manage, export, and delete your account.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="announcements-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Announcements</strong></h4>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <div className="column-list announcements-list">
                            <div className="item grayback">
                              <div className="pic"><img src="../img/announcement-ico.png" alt=""/></div>
                              <div className="name">Regarding Submission of Documents of all classes students admitted in AY 2021-22 <span className="date">12 April, 2022</span></div>
                              <Link to="/"><img src="../img/akar-icons.png" alt=""/></Link>
                            </div>
                            <div className="item grayback">
                              <div className="pic"><img src="../img/announcement-ico.png" alt=""/></div>
                              <div className="name">Regarding Submission of Documents of all classes students admitted in AY 2021-22 <span className="date">12 April, 2022</span></div>
                              <Link to="/"><img src="../img/akar-icons.png" alt=""/></Link>
                            </div>
                          </div>
                        </div>*/}
                      </div>
                    </Col>
                    <Col md={5}>
                      <aside className="rightcolumn">
                        <div className="training-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Training</strong></h4>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <Row>
                            <Col md={12}>
                              <div className="training-column">
                                <div className="item">
                                  <div className="pic"><a href="/"><img src="../img/training-pic1.jpg" alt=""/></a></div>
                                  <div className="fixcol">
                                    <div className="icopic"><img src="../img/traning-audio-ico.png" alt=""/></div>
                                    <div className="iconame">
                                      <a href="/" className="nowrap">Getting and staying organized</a>
                                      <div className="datecol">
                                        <span className="red-date">Due Date: 22/01/2022</span>
                                        <span className="time">3 Hours</span>
                                      </div>
                                    </div>
                                    <div className="cta-col">
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
                                  {/*<hr/>
                                  <div className="training-status">
                                    <div className="status-col">
                                      <div className="col">
                                        <small>Status</small>
                                        <p>In Progress</p>
                                      </div>
                                      <div className="col">
                                        <small>Category</small>
                                        <p>Getting Organised</p>
                                      </div>
                                      <div className="col">
                                        <small>Label 1</small>
                                        <p>Value 1</p>
                                      </div>
                                      <div className="col">
                                        <small>Label 2</small>
                                        <p>Value 2</p>
                                      </div>
                                    </div>
                                    <div className="total-percentage">
                                      <div className="cprogress">
                                        <Progress type="circle" width={90} strokeWidth={9} percent={66}
                                          theme={{
                                            active: {
                                              trailColor: '#dbdbdb',
                                              color: '#AA0061'
                                            }
                                          }} />
                                      </div>
                                    </div>
                                  </div>*/}
                                </div>
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="training-column">
                                <div className="item">
                                  <div className="pic"><a href="/"><img src="../img/training-pic1.jpg" alt=""/></a></div>
                                  <div className="fixcol">
                                    <div className="icopic"><img src="../img/traning-audio-ico.png" alt=""/></div>
                                    <div className="iconame">
                                      <a href="/" className="nowrap">Getting and staying organized</a>
                                      <div className="datecol">
                                        <span className="time">3 Hours</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="training-column">
                                <div className="item">
                                  <div className="pic"><a href="/"><img src="../img/training-pic1.jpg" alt=""/></a></div>
                                  <div className="fixcol">
                                    <div className="icopic"><img src="../img/traning-audio-ico.png" alt=""/></div>
                                    <div className="iconame">
                                      <a href="/" className="nowrap">Getting and staying organized</a>
                                      <div className="datecol">
                                        <span className="time">3 Hours</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                        <div className="announcements-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Announcements</strong></h4>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <div className="column-list announcements-list">
                            <div className="listing">
                              <a href="/" className="item">
                                <div className="pic"><img src="../img/announcement-ico.png" alt=""/></div>
                                <div className="name">Regarding Submission of Documents of all classes students admitted in AY 2021-22 <span className="date">12 April, 2022</span></div>
                              </a>
                            </div>
                            <div className="listing">
                              <a href="/" className="item">
                                <div className="pic"><img src="../img/announcement-ico.png" alt=""/></div>
                                <div className="name">Regarding Submission of Documents of all classes students admitted in AY 2021-22 <span className="date">12 April, 2022</span></div>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="educator-column">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Primary Co-ordinators</strong></h4>
                          </header>
                          <div className="educator-sec mb-5">
                            <div className="educator-pic"><img src="../img/educator-pic.jpg" alt=""/></div>
                            <div className="educator-detail">
                              <h1 class="edu-name mb-2">James Parker</h1>
                              <div className="edu-tel mb-2"><a href="tel:+6145434234">+61 454 342 34</a></div>
                              <div className="edu-email mb-2"><a href="mailto:sarahp@specialdaycare.com">sarahp@specialdaycare.com</a></div>
                            </div>
                          </div>
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

export default EducatorDashboard;
