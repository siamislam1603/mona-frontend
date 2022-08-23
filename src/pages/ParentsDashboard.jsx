import React, { useState, useEffect } from "react";
import { Col, Container, Row, Dropdown, Modal } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from "../components/App";
import moment from 'moment';


const ParentsDashboard = () => {

  const [userDetails, setUserDetails] = useState(null);
  const [childEnrollMessageDialog, setChildEnrollMessageDialog] = useState(false);
  const [event, setEvent] = useState([{}]);
  const [announcements, setannouncements] = useState([]);
  const [editTrainingData, setEditTrainingData] = useState([]);
  const [viewEnrollmentDialog, setViewEnrollmentDialog] = useState(false);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  console.log(selectedFranchisee, "selectedFranchisee")
  const checkPendingConsent = async () => {
    let response = await axios.get(`${BASE_URL}/enrollment/parent-consent/${localStorage.getItem('user_id')}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.status === 200 && response.data.status === "success") {
      let { parentConsentData } = response.data;
      console.log('PDATA:', parentConsentData);
      console.log('PARENT CONSENT DATA:', parentConsentData[0]);

      if(parentConsentData.length > 0) {
        localStorage.setItem('enrolled_parent_id', parentConsentData[0]?.consent_recipient_id);
        localStorage.setItem('enrolled_child_id', parentConsentData[0]?.child_id);
        localStorage.setItem('asked_for_consent', parentConsentData[0]?.asked_for_consent);
        localStorage.setItem('consent_comment', parentConsentData[0]?.comment);
        localStorage.setItem('has_given_consent', parentConsentData[0]?.has_given_consent);

        if (parentConsentData[0].has_given_consent === null || parentConsentData[0].has_given_consent === false) {
          console.log('VIEWING ENROLLMENT DIALOG');
          setViewEnrollmentDialog(true);
        }
      } else {

      }
    }
  }

  const handleViewEnrollment = async () => {
    setViewEnrollmentDialog(false);
    window.location.href = `/child-enrollment/${localStorage.getItem('enrolled_child_id')}/${localStorage.getItem('enrolled_parent_id')}`;
  }

  // const educators_assigned = async () => {
  //   let response = await axios.get(`${BASE_URL}/dashboard/parent/educators-assigned/84`, {
  //     headers: {
  //       authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //   });
  //   console.log(response, "===============")
  //   if (response.status === 200) {
  //     const users = response.data.assignedEducatorData;
  //     console.log('=========users', users)
  //   }
  // }
  // useEffect(() => {
  //   educators_assigned();
  // }, [])

  const events = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/dashboard/parent/quick-access-events`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (response.status === 200 && response.data.status === "success") {
      const training = response.data.recentAnnouncement;
      console.log(training)
      setEvent(training);
    }
  };

  const Userannouncements = async () => {
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
      // const result = response.data.assignedEducatorData
      console.log(result, "<<<<<<<<<<<>>>>>>>>>>>>")
      setEditTrainingData(result);
    }

  }

  const getAddedTime = (str) => {
    const Added = moment(str).format('DD/MM/YYYY')
    console.log(Added, "Added")
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
  // const getAddedTime = (str) =>{
  //   // const Added= moment(str).format('YYYY-MM-DD')
  //   // console.log("THe astring",str)
  //   const Added= moment(str).format('DD/MM/YYYY')
  //   // console.log("THe data",dateww)
  //   var today = new Date();
  //   let d = new Date(today);
  //   let month = (d.getMonth() + 1).toString().padStart(2, '0');
  //   let day = d.getDate().toString().padStart(2, '0');
  //   let year = d.getFullYear();
  //    let datae =  [day, month, year].join('/');
  //    console.log("THE DATE",datae,Added)
  //    let temp;
  //    if(datae === Added){
  //     temp = "Added today";
  //    }

  //    if(Added < datae){
  //     temp = Added;
  //     // console.log("THE added date i smaller",typeof Added, typeof datae);
  //    }

  //    return temp;
  // }
  console.log(editTrainingData, "<<<<<<<<<<response")


  useEffect(() => {
    events();
    Userannouncements();
    assignededucators();
  }, [])

  const fetchUserDetails = async (userId) => {
    let token = localStorage.getItem('token');
    let response = await axios.get(`${BASE_URL}/auth/user/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.status === "success") {
      let { user } = response.data;
      setUserDetails(user);
    }
  };

  const moveToChildEnrollmentForm = () => {
    let parentId = localStorage.getItem('user_id')
    window.location.href = `/child-enrollment/73/${parentId}`;
  }

  useEffect(() => {
    let user_role = localStorage.getItem('user_role');
    let user_id = localStorage.getItem('user_id');

    if (user_role === 'guardian')
      fetchUserDetails(user_id);
  }, []);


  useEffect(() => {
    if (userDetails?.isChildEnrolled === 0) {
      setChildEnrollMessageDialog(true);
    }
  }, [userDetails?.isChildEnrolled]);

  useEffect(() => {
    checkPendingConsent();
  });

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
                  setSelectedFranchisee={setSelectedFranchisee}
                />
                <div className="entry-container">
                  <Row>
                    <Col md={7}>
                      <div className="maincolumn">
                        <header className="title-head mb-4 justify-content-between">
                          <h4 className="title-sm mb-0"><strong>Educators</strong></h4>
                        </header>
                        {console.log(editTrainingData.length)}
                        {editTrainingData.length !== 0 ? (
                          editTrainingData.map((item) => {
                            return <>
                              <div className="educator-sec mb-5">
                                <div className="educator-pic"><img src={item.profile_photo} alt="" /></div>
                                <div className="educator-detail">
                                  <h1 class="edu-name mb-2">{item.fullname}</h1>
                                  <div className="edu-tel mb-2"><a href="tel:+6145434234">{item.phone}</a></div>
                                  <div className="edu-email mb-2"><a href="mailto:sarahp@specialdaycare.com">{item.email}</a></div>
                                  <div className="edu-know mb-2">{item.address}</div>
                                </div>
                              </div>
                            </>
                          })
                        ) : (<div className="text-center mb-5 mt-5"><strong>No Educators</strong></div>)}

                        <div className="event-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Events</strong></h4>
                            <Link to="/announcements" className="viewall">View All</Link>
                          </header>
                          <div className="column-list event-list">
                            {event.map((item) => {
                              return <>
                                {!item.title ? "" : <div className="item">
                                  <div className="pic"><a href=""><img src="../img/event-ico.png" alt="" /></a></div>
                                  <div className="name"><a href="">{item.title}</a> <span className="date">{getAddedTime(item.scheduled_date)}</span></div>
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
                                </div>}
                              </>
                            })}
                            {/* <div className="item">
                              <div className="pic"><a href=""><img src="../img/event-ico.png" alt="" /></a></div>
                              <div className="name"><a href="">Some title of the event</a> <span className="date">03/06/2022</span></div>
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
                            </div> */}
                            {/* <div className="item">
                              <div className="pic"><a href=""><img src="../img/event-ico.png" alt="" /></a></div>
                              <div className="name"><a href="">Some title of the event</a> <span className="date">03/06/2022</span></div>
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
                            </div> */}
                            {/* <div className="item">
                              <div className="pic"><a href=""><img src="../img/event-ico.png" alt="" /></a></div>
                              <div className="name"><a href="">Some title of the event</a> <span className="date">03/06/2022</span></div>
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
                            </div> */}
                            {/* <div className="item">
                              <div className="pic"><a href=""><img src="../img/event-ico.png" alt="" /></a></div>
                              <div className="name"><a href="">Some title of the event</a> <span className="date">03/06/2022</span></div>
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
                            </div> */}
                          </div>
                        </div>
                        {/*<div className="files-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h2 className="title-sm mb-0"><strong>Files</strong></h2>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <div className="column-list files-list two-col">
                            <div className="item">
                              <div className="pic"><img src="../img/book-ico.png" alt=""/></div>
                              <div className="name">document1.docx <span className="time">3 Hours</span></div>
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
                              <div className="name">document2.pdf <span className="time">3 Hours</span></div>
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
                              <div className="name">audiofile1.mp3 <span className="time">2 Hours</span></div>
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
                              <div className="name">audiofile2.mp3 <span className="time">2 Hours</span></div>
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
                              <div className="pic"><img src="../img/ppt-ico.png" alt=""/></div>
                              <div className="name">presentation1.pptx <span className="time">2 Hours</span></div>
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
                              <div className="pic"><img src="../img/ppt-ico.png" alt=""/></div>
                              <div className="name">presentation1.pptx <span className="time">3 Hours</span></div>
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
                        <div className="files-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h3 className="title-sm mb-0"><strong>Forms</strong></h3>
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
                              <div className="pic"><img src="../img/story-ico.png" alt="" /></div>
                              <div className="name">Story park</div>
                            </div>
                            <div className="item">
                              <div className="pic"><img src="../img/harmony-ico.png" alt="" /></div>
                              <div className="name">Harmony</div>
                            </div>
                          </div>
                        </div>
                        <div className="announcements-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Announcements</strong></h4>
                            <Link to="/announcements" className="viewall">View All</Link>
                          </header>
                          <div className="column-list announcements-list">
                            {announcements.map((item) => {
                              return <>
                                <div className="listing">
                                  <a href="/announcements" className="item">
                                    <div className="pic"><img src="../img/announcement-ico.png" alt="" /></div>
                                    <div className="name">{item.title}
                                      <div>
                                        <span className="timesec">{getAddedTime(item?.createdAt)}</span>
                                      </div>
                                    </div>

                                  </a>
                                </div>
                              </>
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
      {
        childEnrollMessageDialog &&
        <Modal

          show={childEnrollMessageDialog}>
          <Modal.Header>
            <Modal.Title>Welcome {userDetails?.fullname.split(" ")[0]}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Thank you for choosing MONA. Please go to <strong>Forms</strong></p>
            <p style={{ marginTop: "-5px" }}>section and select <strong>Child Enrollment Form</strong> to enrol your</p>
            <p style={{ marginTop: "-5px" }}>child with MONA or click below to directly open the</p>
            <p style={{ marginTop: "-5px" }}><strong>Child Enrollment Form.</strong></p>
          </Modal.Body>

          <Modal.Footer>
            <button style={{
              padding: ".7rem 1.4rem",
              fontWeight: '500',
              fontSize: '.8rem',
              color: "#fff",
              backgroundColor: '#3E5D58',
              border: "none",
              borderRadius: "5px"
            }} onClick={() => moveToChildEnrollmentForm()}>Child Enrollment Form</button>
          </Modal.Footer>
        </Modal>
      }

      <Modal
        show={viewEnrollmentDialog}>
        <Modal.Header>
          <Modal.Title>Pending Consent Notification</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>You have a pending consent from your coordinator. Click on <strong>View Enrollment Form</strong> to go through it.</p>
        </Modal.Body>

        <Modal.Footer>
          <button
            className="modal-button"
            onClick={() => handleViewEnrollment()}>View Enrollment Form</button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ParentsDashboard;
