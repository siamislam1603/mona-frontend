import React, { useState } from "react";
import { Button, Col, Container, Row, Form, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link } from 'react-router-dom';
import BootstrapTable from "react-bootstrap-table-next";
import axios from 'axios';
import { BASE_URL } from '../components/App';
import moment from 'moment';

const products = [
  {
    id: 1,
    name: "../img/user.png, James Smith",
    educator: "Ms. Shelby Goode",
  },
  {
    id: 2,
    name: "../img/user.png, James Smith",
    educator: "Ms. Shelby Goode",
  },
  {
    id: 3,
    name: "../img/user.png, James Smith",
    educator: "Ms. Shelby Goode",
  },
  {
    id: 4,
    name: "../img/user.png, James Smith",
    educator: "Ms. Shelby Goode",
  },
];
const columns = [
  {
    dataField: 'name',
    text: 'Child Name',
    formatter: (cell) => {
      cell = cell.split(",");
      return (<><div className="user-list"><span className="user-pic"><img src={cell[0]} alt='' /></span><span className="user-name">{cell[1]} </span></div></>)
    },
  },
  {
    dataField: 'educator',
    text: 'Educator',
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

const FranchiseeDashboard = () => {
  const [countUser, setcountUser] = React.useState(null);

  const [latest_announcement, setlatest_announcement] = React.useState([{}]);

  const announcement = () => {
    let token = localStorage.getItem('token');
    const countUrl = `${BASE_URL}/dashboard/franchisor/latest-announcement`;
    axios.get(countUrl, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then((response) => {
      setlatest_announcement(response.data.recentAnnouncement);
    }).catch((e) => {
      console.log("Error", e);
    })
  }

  console.log(latest_announcement[0], "latest_announcement")
  const count_User_Api = () => {
    let token = localStorage.getItem('token');

    const countUrl = `${BASE_URL}/dashboard/franchisee/activity-count`;
    axios.get(countUrl, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then((response) => {
      setcountUser(response.data);
    }).catch((e) => {
      console.log("Error", e);
    })
  }

  console.log(countUser, "lksjgydtadHUJISKiaudygquISOIWUAYTDGH")
  React.useEffect(() => {
    count_User_Api();
    announcement();
  }, []);

  const count_Api = async () => {
    const countUrl = `${BASE_URL}/dashboard/franchisee/activity-count`;
    var myHeaders = new Headers();
    myHeaders.append(
      'authorization',
      'Bearer ' + localStorage.getItem('token')
    );

    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };
    await axios(countUrl, requestOptions).then((response) => {
      setcountUser(response.data);
    }).catch((e) => {
      console.log(e);
    })
    console.log(countUser, ":lksjdgcasjhgjhjchvs")
  }
  const getAddedTime = (str) =>{
    const Added= moment(str).format('DD/MM/YYYY')
    var today = new Date();
    let d = new Date(today);
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    let year = d.getFullYear();
     let datae =  [day, month, year].join('/');
     const date1 = new Date(datae);
     const date2 = new Date(str);
     console.log("THE Date1",date1,date2)
     if(date1 === date2){
      return "Added today"
     }
     else if(date2<date1){
      return Added
     }
  
  }

  React.useEffect(() => {
    announcement();
    count_Api();
  }, []);
  if (!countUser) return null;
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
                                <div className="pic"><img src="../img/intranet-ico.png" alt="" /></div>
                                <div className="name">Intranet</div>
                              </a>
                            </div>
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
                        </div>*/}
                        <div className="enrollments-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h3 className="title-sm mb-0"><strong>Children With Additional Needs</strong></h3>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
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
                                <span className="name">Total Users</span>
                                <span className="separator">|</span>
                                <span className="num">{countUser.totalUsers}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a href="/" className="item">
                                <span className="name">Total Locations</span>
                                <span className="separator">|</span>
                                <span className="num">{countUser.totalLocations}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a href="/" className="item">
                                <span className="name">New Enrollments</span>
                                <span className="separator">|</span>
                                <span className="num">{countUser.newEnrollments}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a href="/" className="item">
                                <span className="name">No. of audit forms created in last 30 days</span>
                                <span className="separator">|</span>
                                <span className="num">{countUser.auditForms}</span>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="enrollments-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>New Enrollments</strong></h4>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <div className="column-table user-management-sec">
                            <BootstrapTable
                              keyField="name"
                              data={products}
                              columns={columns}
                            />
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

export default FranchiseeDashboard;