import React, { useState, useEffect } from "react";
import { Col, Container, Row, Dropdown, Modal } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from "../components/App";


const ParentsDashboard = () => {
  
  const [userDetails, setUserDetails] = useState(null);
  const [childEnrollMessageDialog, setChildEnrollMessageDialog] = useState(false);

  const fetchUserDetails = async (userId) => {
    let token = localStorage.getItem('token');
    let response = await axios.get(`${BASE_URL}/auth/user/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if(response.status === 200 && response.data.status === "success") {
      let { user } = response.data;
      setUserDetails(user);
    }
  };

  const moveToChildEnrollmentForm = () => {
    let parentId = localStorage.getItem('user_id')
    window.location.href=`/child-enrollment/71/${parentId}`;
  }

  useEffect(() => {
    let user_role = localStorage.getItem('user_role');
    let user_id = localStorage.getItem('user_id');
    
    if(user_role === 'guardian')
      fetchUserDetails(user_id);
  }, []);

  useEffect(() => {
    if(userDetails?.isChildEnrolled === 0) {
      setChildEnrollMessageDialog(true);
    }
  }, [userDetails?.isChildEnrolled]);
  
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
                        <div className="educator-sec mb-5">
                          <div className="educator-pic"><img src="../img/educator-pic.jpg" alt=""/></div>
                          <div className="educator-detail">
                            <h1 class="edu-name mb-2">James Parker</h1>
                            <div className="edu-tel mb-2"><a href="tel:+6145434234">+61 454 342 34</a></div>
                            <div className="edu-email mb-2"><a href="mailto:sarahp@specialdaycare.com">sarahp@specialdaycare.com</a></div>
                            <div className="edu-know mb-2">Languages, Science, General Knowledge</div>
                          </div>
                        </div>
                        <div className="event-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Events</strong></h4>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <div className="column-list event-list">
                            <div className="item">
                              <div className="pic"><a href=""><img src="../img/event-ico.png" alt=""/></a></div>
                              <div className="name"><a href="">Some title of the event</a> <span className="date">03/06/2022</span></div>
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
                              <div className="pic"><a href=""><img src="../img/event-ico.png" alt=""/></a></div>
                              <div className="name"><a href="">Some title of the event</a> <span className="date">03/06/2022</span></div>
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
                              <div className="pic"><a href=""><img src="../img/event-ico.png" alt=""/></a></div>
                              <div className="name"><a href="">Some title of the event</a> <span className="date">03/06/2022</span></div>
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
                              <div className="pic"><a href=""><img src="../img/event-ico.png" alt=""/></a></div>
                              <div className="name"><a href="">Some title of the event</a> <span className="date">03/06/2022</span></div>
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
                              <div className="pic"><a href=""><img src="../img/event-ico.png" alt=""/></a></div>
                              <div className="name"><a href="">Some title of the event</a> <span className="date">03/06/2022</span></div>
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
                              <div className="pic"><img src="../img/story-ico.png" alt=""/></div>
                              <div className="name">Story park</div>
                            </div>
                            <div className="item">
                              <div className="pic"><img src="../img/harmony-ico.png" alt=""/></div>
                              <div className="name">Harmony</div>
                            </div>
                          </div>
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
    </>
  );
};

export default ParentsDashboard;
