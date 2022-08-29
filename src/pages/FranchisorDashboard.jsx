
import React, { useState } from "react";
import { Button, Col, Container, Row, Form, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link, useNavigate } from 'react-router-dom';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import BootstrapTable from "react-bootstrap-table-next";
import axios from 'axios';
import { BASE_URL } from '../components/App';
import moment from 'moment';


const FranchisorDashboard = () => {
  const navigate = useNavigate();
  const [count, setcount] = React.useState(null);
  const [state, setstate] = React.useState();
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [latest_announcement, setlatest_announcement] = React.useState([{}]);
  const [forms_count, setForms_count] = React.useState([])
  const [formData, setFormData] = useState([])
  const [Index, setIndex] = useState(0);
  const [innerIndex, setInnerIndex] = useState(0);
  const [MeFormData, setMeFormData] = useState([]);

  let token = localStorage.getItem('token');
  const columns1 = [
    {
      dataField: 'formname',
      text: 'Form Name',
      formatter: (cell) => {
        return (<><div className="user-list"><span className="user-pic"><img src="../img/audit-form.png" /></span><span className="user-name">Compliance Visit<small>Audited on:  {moment(cell[1]).format('DD/MM/YYYY')}</small></span></div></>)
      },
    },
    {
      dataField: 'educatorname',
      text: 'Educator Name',
      formatter: (cell) => {
        console.log("EDUCATIN CELL", cell)
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
              <Dropdown.Item href="/form/response">View</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div></>)
      },
    }
  ];

















  const Forms_count = () => {
    let token = localStorage.getItem('token');
    const countUrl = `${BASE_URL}/dashboard/franchisor/audit-forms-count`;

    axios.get(countUrl, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then((response) => {
      setForms_count(response.data.totalNumberOfAuditFormsInLast30Days);

    }).catch((e) => {
      console.log("Error", e);
    })
  }

  const announcement = () => {
    let token = localStorage.getItem('token');
    const countUrl = `${BASE_URL}/dashboard/franchisor/latest-announcement`;

    axios.get(countUrl, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then((response) => {
      setlatest_announcement(response.data.recentAnnouncement);
      console.log(response.data)
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
      console.log(count)
    }).catch((e) => {
      console.log(e);
    })
  }

  const getAddedTime = (str) => {
    const Added = moment(str).format('DD/MM/YYYY')
    var today = new Date();
    let d = new Date(today);
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    let year = d.getFullYear();
    let datae = [day, month, year].join('/');
    //  const date1 = new Date(datae);
    //  const date2 = new Date(str);
    console.log("THE Date1", Added, datae)
    if (datae === Added) {
      return "Added today"
    }
    else if (Added < datae) {
      return Added
    }
    else {
      return Added
    }
    // return Added

  }
  const FormData = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/dashboard/franchisor/audit-forms-quick-access`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    })
    console.log("FORM Data", response)
    if (response.status == 200) {
      let data = response.data.data.formData;
      let tempData = data.map((dt) => ({
        formname: `${dt.audited_on}`,
        educatorname: `${dt.user.profile_photo},${dt.user.fullname},${dt.user.franchisee.franchisee_name} `
        // console.log("THe dt",)

      }))
      setFormData(tempData);
    }
  }


  React.useEffect(() => {
    count_Api();
    announcement();
    Forms_count();
    FormData();
  }, []);

  selectedFranchisee && console.log('Selected Franchisee Inside Dashboard:', selectedFranchisee);
  console.log("The latest Announcement", latest_announcement)
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
                <TopHeader
                  setSelectedFranchisee={setSelectedFranchisee} />
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
                              <a href="https://login.xero.com/identity/user/login" className="flex">
                                <div className="pic"><img src="../img/xero-ico.png" alt="" /></div>
                                <div className="name">Xero</div>
                              </a>
                            </div>
                            <div className="item nolink">
                              <div className="flex">
                                <div className="pic"><img src="../img/bitool-ico.png" alt="" /></div>
                                <div className="name">BI Tool</div>
                              </div>
                            </div>
                            <div className="item">
                              <a href="https://app.storypark.com/users/sign_in?_ga=2.96275036.1184893872.1661406994-2035467191.1661406993" className="flex">
                                <div className="pic"><img src="../img/story-ico.png" alt="" /></div>
                                <div className="name">Story park</div>
                              </a>
                            </div>
                            <div className="item">
                              <a href="https://sp8.harmonykids.com.au/UserAccount/Login" className="flex">
                                <div className="pic"><img src="../img/harmony-ico.png" alt="" /></div>
                                <div className="name">Harmony</div>
                              </a>
                            </div>
                            <div className="item">
                              <a href="https://app.engagebay.com/login  " className="flex">
                                <div className="pic"><img src="../img/engagebay-ico.png" alt="" /></div>
                                <div className="name">Engagebay</div>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="record-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h2 className="title-sm mb-0"><strong>Record of Audits</strong></h2>

                            <Link to="/form/response" className="viewall">View All</Link>
                          </header>
                          <div className="audit-form">
                            <p>Total Number of Audit Forms <br />in Last 30 Days</p>
                            <span className="totalaudit">{forms_count}</span>
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
                            {/* <ToolkitProvider
                              keyField="name"
                              data={products1}
                              columns={columns1}
                              search
                            >
                              {(props) => ( */}
                            {
                              formData?.length > 0 ?
                                (
                                  <BootstrapTable
                                    keyField="name"
                                    data={formData}
                                    columns={columns1}
                                  />
                                ) : (
                                  <div className="text-center mb-5 mt-5"><strong>
                                    No forms present!
                                  </strong></div>

                                )
                            }
                            {/* )}
                            </ToolkitProvider> */}
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
                              <Link to="/all-franchisees" className="item">
                                <span className="name">Total Franchises</span>
                                <span className="separator">|</span>
                                <span className="num">{count.totalFranchisees}</span>
                              </Link>
                            </div>
                            <div className="listing">
                              <Link to="/user-management" className="item">
                                <span className="name">Total Users</span>
                                <span className="separator">|</span>
                                <span className="num">{count.totalUsers}</span>
                              </Link>
                            </div>
                            <div className="listing">
                              <a className="item" href="/user-management/Guardian">
                                <span className="name">Total Children</span>
                                <span className="separator">|</span>
                                <span className="num">{count.totalChildren}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a href="/user-management/Educator" className="item">
                                <span className="name">Total Locations</span>
                                <span className="separator">|</span>
                                <span className="num">{count.totalLocations}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a className="item" href="/user-management/Guardian">
                                <span className="name">No. of enrolment forms signed in past 7 days</span>
                                <span className="separator">|</span>
                                <span className="num">{count.noOfEnrollmentFormsSignedInPast7Days}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a className="item" style={{ cursor: "not-allowed" }}>
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
                                  <a href="/announcements" className="item">
                                    <div className="pic"><img src="../img/announcement-ico.png" alt="" /></div>
                                    <div className="name">{!data.title ? "No Announcement" : data.title}
                                      <div>
                                        <span className="timesec">{getAddedTime(data?.createdAt)}</span>

                                      </div>

                                    </div>
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