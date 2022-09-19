import React, { useState, useEffect } from "react";
import { Col, Container, Row, Dropdown, Modal } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from "../components/App";
import { logoutUser } from '../helpers/logout';
import moment from 'moment';


const ParentsDashboard = () => {
  const [event, setEvent] = useState([]);
  const [announcements, setannouncements] = useState([]);
  const [editTrainingData, setEditTrainingData] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [logUserOutDialog, setLogUserOutDialog] = useState(false);
  const [topSuccessMessage, setTopSuccessMessage] = useState(null)




  const events = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/dashboard/parent/quick-access-events`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (response.status === 200 && response.data.status === "success") {
      const training = response.data.recentAnnouncement;

      console.log("The event", training)
      setEvent(training);
    }
  };

  const Userannouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/dashboard/parent/quick-access-announcements`, {
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

  const assignededucators = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/dashboard/parent/educators-assigned/${selectedFranchisee}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    console.log(response, "response??????????????")
    if (response.status === 200 && response.data.status === "pass") {
      const result = response.data.assignedEducatorData.users;

      setEditTrainingData(result);
    }
  }
  console.log(selectedFranchisee, "selectedFranchisee")


  const getAddedTime = (str) => {
    const Added = moment(str).format('DD/MM/YYYY')
    console.log(Added, "Added")
    var today = new Date();
    let d = new Date(today);
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    let year = d.getFullYear();
    let datae = [day, month, year].join('/');


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


  const handleParentLogout = async () => {
    setLogUserOutDialog(false);
    await localStorage.clear();
    await logoutUser();
  }



  useEffect(() => {

    if (localStorage.getItem('user_role') !== 'guardian') {
      window.location.href = '/';
    }

  }, []);



  useEffect(() => {
    events();
    Userannouncements();
    assignededucators();
  }, [selectedFranchisee])





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
                <TopHeader
                  setSelectedFranchisee={setSelectedFranchisee}
                />
                <div className="entry-container">
                  <Row>
                    <Col md={7}>
                      <div className="maincolumn">
                        <header className="title-head mb-4 justify-content-between">
                          <h4 className="title-sm mb-0"><strong>Educators</strong></h4>
                        </header>

                        {editTrainingData && editTrainingData?.length > 0 ? (
                          editTrainingData?.map((item) => {
                            return <>
                              <div className="educator-sec mb-5">
                                <div className="educator-pic"><img src={item?.profile_photo} alt="" /></div>
                                <div className="educator-detail">
                                  <h1 className="edu-name mb-2">{item?.fullname}</h1>
                                  <div className="edu-tel mb-2"><a href="tel:+6145434234">{item?.phone}</a></div>
                                  <div className="edu-email mb-2"><a href="mailto:sarahp@specialdaycare.com">{item?.email}</a></div>
                                  <div className="edu-know mb-2">{item?.address}</div>
                                </div>
                              </div>
                            </>
                          })
                        ) : (
                          <div className="text-center mb-5 mt-5"><strong>No educators assigned</strong></div>
                        )}
                        <header className="title-head mb-4 justify-content-between">
                          <h4 className="title-sm mb-0"><strong>Events</strong></h4>
                          <Link to="/announcements-announcement/all-events" className="viewall">View All</Link>
                        </header>
                        {event ? (<>
                          <div className="event-sec pb-5">
                            <div className="column-list event-list">
                              {event.map((item, index) => {
                                return <>
                                  {!item.title ? "" : <div className="item">
                                    <div className="pic"><a href=""><img src="../img/event-ico.png" alt="" /></a></div>
                                    <div className="name"><a href="">{item?.title}</a> <span className="date">{getAddedTime(item?.scheduled_date)}</span></div>
                                    <div className="cta-col">
                                      <Dropdown>
                                        <Dropdown.Toggle variant="transparent" id="ctacol">
                                          <img src="../img/dot-ico.svg" alt="" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                          {/* /announcements-announcement/:id/:key */}
                                          <Dropdown.Item href={`/announcements-announcement/all-events/${index}`}>View</Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </div>}
                                </>
                              })}
                            </div>
                          </div>
                        </>) : (
                          <div className="text-center mb-5 mt-5"><strong>No Events</strong></div>

                        )}
                      </div>
                    </Col>
                    <Col md={5}>
                      <aside className="rightcolumn">
                        <div className="access-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Quick Access Links</strong></h4>
                          </header>
                          <div className="column-list access-list two-col">
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
                          </div>
                        </div>
                        <div className="announcements-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Announcements</strong></h4>
                            <Link to="/announcements" className="viewall">View All</Link>
                          </header>
                          <div className="column-list announcements-list">
                            {
                              announcements?.length > 0 ? (
                                announcements.map((item, index) => {
                                  return <>
                                    <div className="listing">
                                      <a href={`/announcements-announcement/${index}`} className="item">
                                        <div className="pic"><img src="../img/announcement-ico.png" alt="" /></div>
                                        <div className="name">{item.title}
                                          <div>
                                            <span className="timesec">{getAddedTime(item?.createdAt)}</span>
                                          </div>
                                        </div>

                                      </a>
                                    </div>
                                  </>
                                })
                              ) :
                                (
                                  <div className="text-center mb-5 mt-5"><strong>No Announcements</strong></div>

                                )
                            }


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

export default ParentsDashboard;