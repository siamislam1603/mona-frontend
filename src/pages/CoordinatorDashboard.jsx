import React, { useState } from "react";
import { Button, Col, Container, Row, Form, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link } from 'react-router-dom';
import BootstrapTable from "react-bootstrap-table-next";
import axios from 'axios';
import { BASE_URL } from '../components/App';
const products = [
  {
    id: 1,
    name: "../img/user.png, James Smith",
    educator: "../img/user.png, James Smith",
  },
  {
    id: 2,
    name: "../img/user.png, James Smith",
    educator: "../img/user.png, James Smith",
  },
  {
    id: 3,
    name: "../img/user.png, James Smith",
    educator: "../img/user.png, James Smith",
  },
  {
    id: 4,
    name: "../img/user.png, James Smith",
    educator: "../img/user.png, James Smith",
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
    text: 'Educator Name',
    formatter: (cell) => {
      cell = cell.split(",");
      return (<><div className="user-list"><span className="user-pic"><img src={cell[0]} alt='' /></span><span className="user-name">{cell[1]} </span></div></>)
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

const CoordinatorDashboard = () => {
  const [count, setcount] = React.useState();
  const count_Api = () => {
  const countUrl = `${BASE_URL}/dashboard/coordinator/onboarding-count`;
  let token = localStorage.getItem('token');

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
  console.log(count)
  React.useEffect(() => {
    count_Api();
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
                              columns={columns}
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
                                <p>Privacy Policy is meant to help you understand what information we collect, why we collect it, and how you can update, manage, export, and delete your account.</p>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><img src="../img/policies-ico.png" alt=""/></div>
                              <div className="name">Title goes here <span className="time">Udpated on: 12 April, 2022</span></div>
                              <div className="content">
                                <p>Privacy Policy is meant to help you understand what information we collect, why we collect it, and how you can update, manage, export, and delete your account.</p>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><img src="../img/policies-ico.png" alt=""/></div>
                              <div className="name">Title goes here <span className="time">Udpated on: 12 April, 2022</span></div>
                              <div className="content">
                                <p>Privacy Policy is meant to help you understand what information we collect, why we collect it, and how you can update, manage, export, and delete your account.</p>
                              </div>
                            </div>
                          </div>
                        </div>*/}
                      </div>
                    </Col>
                    <Col md={5}>
                      <aside className="rightcolumn">
                        <div className="activity-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Onboarding</strong></h4>
                          </header>
                          <div className="activity-list relative">
                            <div className="listing">
                              <a href="/" className="item">
                                <span className="name">Educators logged in</span>
                                <span className="separator">|</span>
                                <span className="num">{count.educatorsLoggedIn}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a href="/" className="item">
                                <span className="name">Overdue Forms</span>
                                <span className="separator">|</span>
                                <span className="num">{count.overdueForms}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a href="/" className="item">
                                <span className="name">Overdue Trainings</span>
                                <span className="separator">|</span>
                                <span className="num">{count.overdueTrainings}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a href="/" className="item">
                                <span className="name">New Enrolments</span>
                                <span className="separator">|</span>
                                <span className="num">{count.newEnrollments}</span>
                              </a>
                            </div>
                            <div className="kidsart">
                              <img src="../img/kid-art.svg" alt="" />
                            </div>
                          </div>
                        </div>
                        {/*<div className="files-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Files</strong></h4>
                          </header>
                          <div className="column-list files-list">
                            <div className="item">
                              <div className="pic"><img src="../img/book-ico.png" alt=""/></div>
                              <div className="name">Getting and staying organized <span className="time">3 Hours</span></div>
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
                              <div className="pic"><img src="../img/audio-ico.png" alt=""/></div>
                              <div className="name">Getting and staying organized <span className="time">3 Hours</span></div>
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
                              <div className="pic"><img src="../img/sound-ico.png" alt=""/></div>
                              <div className="name">Getting and staying organized <span className="time">3 Hours</span></div>
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
                              <div className="pic"><img src="../img/book-ico.png" alt=""/></div>
                              <div className="name">Getting and staying organized <span className="time">3 Hours</span></div>
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
                              <div className="pic"><img src="../img/book-ico.png" alt=""/></div>
                              <div className="name">Getting and staying organized <span className="time">3 Hours</span></div>
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
                            <div className="kidsart">
                              <img src="../img/kid-art.svg" alt=""/>
                            </div>
                          </div>
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

export default CoordinatorDashboard;