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
      console.log("The cell", cell)
      cell = cell?.split(",");
      return (<><div className="user-list"><span className="user-pic"><img src="../img/upload.jpg" alt='' /></span><span className="user-name">{cell} </span></div></>)
    },
  },
  {
    dataField: 'specialneed',
    text: 'Child with special needs',
    formatter: (cell) => {
      console.log("The cell", cell)
      // cell = cell.split(",");
      return (<>
        <div className="user-list">
          {/* <span className="user-pic"><img src={cell} alt='' /></span> */}
          <span className="user-name">{cell === "false" ? "No" : "Yes"} </span>
        </div>
      </>)
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
            <Dropdown.Item href="/user-management/Guardian">View</Dropdown.Item>
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
  const [childrenData, setChildrenData] = useState([])
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
  const Children = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/dashboard/educator/children-with-special-needs`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if (response.status === 200) {
      let data = response.data.childrenWithSpecialNeeds;
      let tempData = data.map((dt) => ({
        name: `${dt.fullname}`,
        specialneed: `${dt.child_medical_information.has_special_needs}`

      }))
      console.log("THE TEM", tempData)
      setChildrenData(tempData)
    }
    console.log("THE CHILDER REPONSE", response)

  }


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

  useEffect(() => {
    Userannouncements();
    Training();
    Coordinator();
    Children();
  }, [])

  console.log("Childeren data", childrenData)
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
                              <a href="https://app.engagebay.com/login" className="flex">
                                <div className="pic"><img src="../img/engagebay-ico.png" alt="" /></div>
                                <div className="name">Engagebay</div>
                              </a>
                            </div>
                            <div className="item">
                              <a href="https://login.xero.com/identity/user/login" className="flex">
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
                            <Link to="/user-management/Guardian" className="viewall">View All</Link>
                          </header>
                          <div className="column-table user-management-sec">
                            {/* <BootstrapTable
                              keyField="name"
                              data={childrenData}
                              columns={columns}
                            /> */}
                            {
                              childrenData?.length > 0 ? (
                                <BootstrapTable
                                  keyField="name"
                                  data={childrenData}
                                  columns={columns}
                                />
                              ) : (
                                <div className="text-center mb-5 mt-5"><strong>No children enrolled yet !</strong></div>

                              )
                            }
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
                            <Link to="/training" className="viewall">View All</Link>
                          </header>
                          <Row>
                            <Col md={12}>
                              <div className="training-column">
                                {training.length !== 0 ? (
                                  training.map((item) => {
                                    return <>
                                      <div className="item">
                                        <div className="pic"><a href="/training"><img src={item.coverImage} alt="" /></a></div>
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
                            <Link to="/announcements" className="viewall">View All</Link>
                          </header>
                          <div className="column-list announcements-list">
                            <div className="listing">

                              {announcements.length !== 0 ?
                                (announcements.map((item) => {
                                  return <>
                                    <div className="listing">
                                      <a href="/announcements" className="item">
                                        <div className="pic"><img src="../img/announcement-ico.png" alt="" /></div>
                                        <div className="name">{item.title}

                                          <div>
                                            <span className="timesec">{getAddedTime(item?.createdAt)}</span>

                                          </div>
                                        </div>
                                        {/* {console.log("THE TIME",item.scheduled_date,getAddedTime(item.scheduled_date))} */}
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
