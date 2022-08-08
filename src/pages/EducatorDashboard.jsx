import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Form, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link } from 'react-router-dom';
import BootstrapTable from "react-bootstrap-table-next";
import { Progress } from 'react-sweet-progress';
import axios from 'axios';
import { BASE_URL } from "../components/App";
import "react-sweet-progress/lib/style.css";
import moment from 'moment';

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
      cell = cell.split(",");
      return (<><div className="user-list"><span className="user-pic"><img src={cell[0]} alt='' /></span><span className="user-name">{cell[1]} </span></div></>)
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

const EducatorDashboard = () => {
  const [announcements, setannouncements] = useState([{}]);
  const [training, setTraining] = useState([])
  const [coordinator, setCoordinator] = useState([])

  const Userannouncements = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/dashboard/educator/quick-access-announcements`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (response.status === 200 && response.data.status === "success") {
      const training = response.data.recentAnnouncement;
      setannouncements(training);
    }
  };


  const Coordinator = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/dashboard/educator/primary-coordinator`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    console.log(response, "responseresponseresponse")
    if (response.status === 200 && response.data.status === "pass") {
      const Result = response.data.primaryCoordinator;
      setCoordinator(Result);
    }
  };
  console.log("coordinator", coordinator)

  const Training = async () => {
    const token = localStorage.getItem('token');
    let response = await axios.get(`${BASE_URL}/dashboard/educator/quick-access-training`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    })

    setTraining(response.data.trainingQuickAccess)
  }
  console.log(training, "response")



  useEffect(() => {
    Userannouncements();
    Training();
    Coordinator();
  }, [])


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
                                {training.length !== 0 ? (
                                  training.map((item) => {
                                    return <>
                                      <div className="item">
                                        <div className="pic"><a href="/"><img src={item.coverImage} alt="" /></a></div>
                                        <div className="fixcol">
                                          <div className="icopic"><img src="../img/traning-audio-ico.png" alt="" /></div>
                                          <div className="iconame">
                                            <a href="/" className="nowrap">{item.title}</a>
                                            <div className="datecol">
                                              <span className="red-date">Due Date:{' '}{moment(item.createdAt).format('DD/MM/YYYY')}</span>
                                              <span className="time">{item.completion_time}</span>
                                            </div>
                                          </div>
                                          <div className="cta-col">
                                            <Dropdown>
                                              <Dropdown.Toggle variant="transparent" id="ctacol">
                                                <img src="../img/dot-ico.svg" alt="" />
                                              </Dropdown.Toggle>
                                              <Dropdown.Menu>
                                                <Dropdown.Item href="#">Delete</Dropdown.Item>
                                              </Dropdown.Menu>
                                            </Dropdown>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  })
                                ) :
                                  (<div className="text-center mb-5 mt-5"><strong>No Training</strong></div>)}

                              </div>
                            </Col>
                            {/* <Col md={6}>
                              <div className="training-column">
                                <div className="item">
                                  <div className="pic"><a href="/"><img src="../img/training-pic1.jpg" alt="" /></a></div>
                                  <div className="fixcol">
                                    <div className="icopic"><img src="../img/traning-audio-ico.png" alt="" /></div>
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
                                  <div className="pic"><a href="/"><img src="../img/training-pic1.jpg" alt="" /></a></div>
                                  <div className="fixcol">
                                    <div className="icopic"><img src="../img/traning-audio-ico.png" alt="" /></div>
                                    <div className="iconame">
                                      <a href="/" className="nowrap">Getting and staying organized</a>
                                      <div className="datecol">
                                        <span className="time">3 Hours</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Col> */}
                          </Row>
                        </div>
                        <div className="announcements-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Announcements</strong></h4>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <div className="column-list announcements-list">
                            <div className="listing">

                              {announcements.length !== 0 ?
                                (announcements.map((item) => {
                                  return <>
                                    <div className="listing">
                                      <a href="/" className="item">
                                        <div className="pic"><img src="../img/announcement-ico.png" alt="" /></div>
                                        <div className="name">{item.title} <span className="date">{item.scheduled_date}</span></div>
                                      </a>
                                    </div>
                                  </>
                                })) : (<div className="text-center mb-5 mt-5"><strong>No Announcements</strong></div>)}
                            </div>
                            {/* <div className="listing">
                              <a href="/" className="item">
                                <div className="pic"><img src="../img/announcement-ico.png" alt="" /></div>
                                <div className="name">Regarding Submission of Documents of all classes students admitted in AY 2021-22 <span className="date">12 April, 2022</span></div>
                              </a>
                            </div> */}
                          </div>
                        </div>
                        <div className="educator-column">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Primary Co-ordinators</strong></h4>
                          </header>
                          {coordinator.length !== 0 ? (
                            coordinator.map((item) => {
                              return <>
                                <div className="educator-sec mb-5">
                                  <div className="educator-pic">
                                    <img src={item.profile_photo} alt="" />
                                  </div>
                                  <div className="educator-detail">
                                    <h1 class="edu-name mb-2">{item.fullname}</h1>
                                    <div className="edu-tel mb-2"><a href="tel:+6145434234">{item.phone}</a></div>
                                    <div className="edu-email mb-2"><a href="mailto:sarahp@specialdaycare.com">{item.email}</a></div>
                                  </div>
                                </div>
                              </>
                            })
                          ) : (
                            <div className="text-center mb-5 mt-5"><strong>No Co-ordinators</strong></div>
                          )}
                          {/* // {coordinator.map((item) => {
                          //   return <>
                          //     <div className="educator-sec mb-5">
                          //       <div className="educator-pic">
                          //         <img src={item.profile_photo} alt="" />
                          //       </div>
                          //       <div className="educator-detail">
                          //         <h1 class="edu-name mb-2">{item.fullname}</h1>
                          //         <div className="edu-tel mb-2"><a href="tel:+6145434234">{item.phone}</a></div>
                          //         <div className="edu-email mb-2"><a href="mailto:sarahp@specialdaycare.com">{item.email}</a></div>
                          //       </div>
                          //     </div>
                          //   </>
                          // })} */}

                        </div>
                      </aside>
                    </Col>
                  </Row>
                </div>
              </div>
            </div >
          </Container >
        </section >
      </div >
    </>
  );
};

export default EducatorDashboard;
