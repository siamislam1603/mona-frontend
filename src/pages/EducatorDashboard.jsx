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
          <span className="user-name">{cell === "0" ? "No" : "Yes"} </span>
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
            <Dropdown.Item href="/children-all">View</Dropdown.Item>
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
  const [topSuccessMessage, setTopSuccessMessage] = useState(null)

  const first = training[0];
  const second = training[1];
  const third = training[2];

  // 👇️ Make sure first is not undefined




  const Userannouncements = async () => {
    try {
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
    } catch (error) {
      setannouncements([])
      console.log("error", error)
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
      console.log(data, "responseresponseresponse")
      let tempData = data.map((dt) => ({
        name: `${dt?.fullname}`,
        specialneed: `${dt?.has_special_needs}`

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
    // console.log("THE Date1", Added, datae)
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
    if (localStorage.getItem('success_msg')) {
      setTopSuccessMessage(localStorage.getItem('success_msg'));

      localStorage.removeItem('success_msg');
      setTimeout(() => {

        setTopSuccessMessage(null);

      }, 3000);

    }

    // Redirect to baseurl when not not specific Role
    if (localStorage.getItem('user_role') !== 'educator') {
      window.location.href = '/';
    }


  }, []);



  useEffect(() => {
    Userannouncements();
    Training();
    Coordinator();
    Children();
  }, [])

  console.log("Childeren data", childrenData)
  return (
    <>
      {
        topSuccessMessage && <p className="alert alert-danger" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topSuccessMessage}</p>
      }
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

                          </div>
                        </div>
                        <div className="children-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Children</strong></h4>
                            <Link to="/children-all" className="viewall">View All</Link>
                          </header>
                          <div className="column-table user-management-sec">

                            {
                              childrenData?.length > 0 ? (
                                <BootstrapTable
                                  keyField="name"
                                  data={childrenData}
                                  columns={columns}
                                />
                              ) : (
                                <div className="text-center mb-5 mt-5"><strong>No children enroled yet !</strong></div>

                              )
                            }
                          </div>
                        </div>

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
                                {console.log(training[0], "training")}
                                {training.length !== 0 ? (
                                  <div className="item">
                                    <div className="pic"><a href="/training"><img src={first?.coverImage} alt="" /></a></div>
                                    <div className="fixcol">
                                      <div className="icopic"><img src="../img/traning-audio-ico.png" alt="" /></div>
                                      <div className="iconame">
                                        <a href="/" className="nowrap">{first?.title}</a>
                                        <div className="datecol">
                                          <span className="red-date">Due Date:{' '}{moment(first?.createdAt).format('DD/MM/YYYY')}</span>
                                          <span className="time">{first?.completion_time}</span>
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

                                ) :
                                  (<div className="text-center mb-5 mt-5"><strong>No Training</strong></div>)}
                              </div>
                            </Col>
                            <Col md={6}>
                              {second ? (<>
                                < div className="training-column">
                                  <div className="item">
                                    <div className="pic">
                                      <a href="/">
                                        <img src={second?.coverImage} alt="" />
                                      </a></div>
                                    <div className="fixcol">
                                      <div className="icopic"><img src="../img/traning-audio-ico.png" alt="" /></div>
                                      <div className="iconame">
                                        <a href="/" className="nowrap">{second?.title}</a>
                                        <div className="datecol">
                                          <span className="time">{second?.completion_time}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>) : (<></>)}
                            </Col>
                            <Col md={6}>
                              {third ? (<>
                                < div className="training-column">
                                  <div className="item">
                                    <div className="pic">
                                      <a href="/">
                                        <img src={third?.coverImage} alt="" />
                                      </a></div>
                                    <div className="fixcol">
                                      <div className="icopic"><img src="../img/traning-audio-ico.png" alt="" /></div>
                                      <div className="iconame">
                                        <a href="/" className="nowrap">{third?.title}</a>
                                        <div className="datecol">
                                          <span className="time">{third?.completion_time}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>) : (<></>)}
                            </Col>
                          </Row>
                        </div>
                        <div className="announcements-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Announcements</strong></h4>
                            <Link to="/announcements" className="viewall">View All</Link>
                          </header>
                          <div className="column-list announcements-list">
                            <div className="listing">
                              {announcements?.length > 0 ?
                                (announcements?.map((item) => {
                                  return <>
                                    <div className="listing">
                                      <a href="/announcements" className="item">
                                        <div className="pic"><img src="../img/announcement-ico.png" alt="" /></div>
                                        <div className="name">{item?.title}

                                          <div>
                                            <span className="timesec">{getAddedTime(item?.createdAt)}</span>
                                          </div>
                                        </div>
                                      </a>
                                    </div>
                                  </>
                                })) : (<div className="text-center mb-5 mt-5"><strong>No Announcements</strong></div>)}
                            </div>

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
                                    <img src={item?.profile_photo} alt="" />
                                  </div>
                                  <div className="educator-detail">
                                    <h1 className="edu-name mb-2">{item?.fullname}</h1>
                                    <div className="edu-tel mb-2"><a href="tel:+6145434234">{item?.phone}</a></div>
                                    <div className="edu-email mb-2"><a href="mailto:sarahp@specialdaycare.com">{item?.email}</a></div>
                                  </div>
                                </div>
                              </>
                            })
                          ) : (
                            <div className="text-center mb-5 mt-5"><strong>No Co-ordinators</strong></div>
                          )}

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
