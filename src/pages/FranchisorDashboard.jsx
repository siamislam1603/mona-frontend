import React, { useState } from "react";
import { Button, Col, Container, Row, Form, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link } from 'react-router-dom';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import BootstrapTable from "react-bootstrap-table-next";
import axios from 'axios';
import { BASE_URL } from '../components/App';




const products1 = [
  {
    id: 1,
    formname: "../img/audit-form.png, AuditForm-v1.0, Audited on: 01/22/2022",
    educatorname: "../img/user.png, James Smith, Homecare For Children",
  },
  {
    id: 2,
    formname: "../img/audit-form.png, AuditForm-v1.0, Audited on: 01/22/2022",
    educatorname: "../img/user.png, James Smith, Homecare For Children",
  },
  {
    id: 3,
    formname: "../img/audit-form.png, AuditForm-v1.0, Audited on: 01/22/2022",
    educatorname: "../img/user.png, James Smith, Homecare For Children",
  },
  {
    id: 4,
    formname: "../img/audit-form.png, AuditForm-v1.0, Audited on: 01/22/2022",
    educatorname: "../img/user.png, James Smith, Homecare For Children",
  },

];
const columns1 = [
  {
    dataField: 'formname',
    text: 'Form Name',
    formatter: (cell) => {
      cell = cell.split(",");
      return (<><div className="user-list"><span className="user-pic"><img src={cell[0]} alt='' /></span><span className="user-name">{cell[1]} <small>{cell[2]}</small></span></div></>)
    },
  },
  {
    dataField: 'educatorname',
    text: 'Educator Name',
    formatter: (cell) => {
      cell = cell.split(",");
      return (<><div className="user-list"><span className="user-pic"><img src={cell[0]} alt='' /></span><span className="user-name">{cell[1]} <small>{cell[2]}</small></span></div></>)
    },
  },
  {
    dataField: "action",
    text: "",
    formatter: (cell) => {
      return (<><div className="cta-col">
        <Dropdown>
          <Dropdown.Toggle variant="transparent" id="ctacol">
            <img src="../img/dot-ico.svg" alt="" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#">Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div></>)
    },
  }
];

const FranchisorDashboard = () => {
  const [count, setcount] = React.useState(null);
  const [state, setstate] = React.useState();
  const [latest_announcement, setlatest_announcement] = React.useState([{}]);

  console.log("alsoidjh", latest_announcement[0].scheduled_date)
  const announcement = () => {
    let token = localStorage.getItem('token');
    const countUrl = `${BASE_URL}/dashboard/franchisor/latest-announcement`;
    axios.get(countUrl, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then((response) => {
      setlatest_announcement(response.data.data.all_announcements);
    }).catch((e) => {
      console.log("Error", e);
    })
  }
  const count_Api = () => {
    let token = localStorage.getItem('token');
    const countUrl = `${BASE_URL}/dashboard/franchisor/activity-count`;
    axios.get(countUrl, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then((response) => {
      setcount(response.data);
    }).catch((e) => {
      console.log(e);
    })
  }


  React.useEffect(() => {
    count_Api();
    announcement();
  }, []);

  if (!count) return null;
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
                                <div className="pic"><img src="../img/xero-ico.png" alt="" /></div>
                                <div className="name">Xero</div>
                              </a>
                            </div>
                            <div className="item">
                              <a href="/" className="flex">
                                <div className="pic"><img src="../img/bitool-ico.png" alt="" /></div>
                                <div className="name">BI Tool</div>
                              </a>
                            </div>
                            <div className="item">
                              <a href="/" className="flex">
                                <div className="pic"><img src="../img/story-ico.png" alt="" /></div>
                                <div className="name">Story park</div>
                              </a>
                            </div>
                            <div className="item">
                              <a href="/" className="flex">
                                <div className="pic"><img src="../img/harmony-ico.png" alt="" /></div>
                                <div className="name">Harmony</div>
                              </a>
                            </div>
                            <div className="item">
                              <a href="/" className="flex">
                                <div className="pic"><img src="../img/engagebay-ico.png" alt="" /></div>
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
                          <div className="audit-form">
                            <p>Total Number of Audit Forms <br />in Last 30 Days</p>
                            <span className="totalaudit">70</span>
                          </div>
                        </div>
                        {/*<div className="record-column">
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
                          </div>*/}
                        <div className="enrollments-sec pb-5">
                          <div className="column-table user-management-sec">
                            <BootstrapTable
                              keyField="name"
                              data={products1}
                              columns={columns1}
                            />
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
                            <div className="listing">
                              <a href="/" className="item">
                                <span className="name">Total Franchises</span>
                                <span className="separator">|</span>
                                <span className="num">{count.totalFranchisees}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a href="/" className="item">
                                <span className="name">Total Users</span>
                                <span className="separator">|</span>
                                <span className="num">{count.totalUsers}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a href="/" className="item">
                                <span className="name">Total Children</span>
                                <span className="separator">|</span>
                                <span className="num">{count.totalChildren}</span>
                              </a>
                            </div>
                            {/* <div className="listing">
                              <a href="/" className="item">
                                <span className="name">Total Locations</span>
                                <span className="separator">|</span>
                                <span className="num">{count.totalLocations}</span>
                              </a>
                            </div> */}
                            <div className="listing">
                              <a href="/" className="item">
                                <span className="name">No. of enrolment forms signed in past 7 days</span>
                                <span className="separator">|</span>
                                <span className="num">{count.noOfEnrollmentFormsSignedInPast7Days}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a href="/" className="item">
                                <span className="name">Users yet to log in</span>
                                <span className="separator">|</span>
                                <span className="num">{count.usersYetToLogin}</span>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="announcements-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Announcements</strong></h4>
                            <Link to="/announcements" className="viewall">View All</Link>
                          </header>
                          <div className="column-list announcements-list">

                            {latest_announcement.map((data) => {
                              return (
                                <div className="listing">
                                  <a href="/" className="item">
                                    <div className="pic"><img src="../img/announcement-ico.png" alt="" /></div>
                                    <div className="name">{data.title}<span className="date">{data.scheduled_date}</span></div>
                                  </a>
                                </div>
                              );
                            })}
                            {/* <div className="listing">
                              <a href="/" className="item">
                                <div className="pic"><img src="../img/announcement-ico.png" alt="" /></div>
                                <div className="name">Regarding Submission of Documents of all classes students admitted in AY 2021-22 <span className="date">12 April, 2022</span></div>
                              </a>
                            </div> */}
                          </div>
                        </div>
                        {/*<div className="ads text-center pb-5">
                          <img src="../img/icon-column.png" alt=""/>
                        </div>*/}
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