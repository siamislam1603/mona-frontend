import React, { useState } from "react";
import { Button, Col, Container, Row, Form, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link } from 'react-router-dom';


const ParentsDashboard = () => {
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
                        <div className="files-sec pb-5">
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
                        </div>
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
                        <div className="event-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Events</strong></h4>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <div className="column-list event-list">
                            <div className="item">
                              <div className="pic"><img src="../img/event-ico.png" alt=""/></div>
                              <div className="name">Some title of the event <span className="date">03/06/2022</span></div>
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
                              <div className="pic"><img src="../img/event-ico.png" alt=""/></div>
                              <div className="name">Some title of the event <span className="date">03/06/2022</span></div>
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
                              <div className="pic"><img src="../img/event-ico.png" alt=""/></div>
                              <div className="name">Some title of the event <span className="date">03/06/2022</span></div>
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
                              <div className="pic"><img src="../img/event-ico.png" alt=""/></div>
                              <div className="name">Some title of the event <span className="date">03/06/2022</span></div>
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
                              <div className="pic"><img src="../img/event-ico.png" alt=""/></div>
                              <div className="name">Some title of the event <span className="date">03/06/2022</span></div>
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
                        <div className="announcements-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Announcements</strong></h4>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <div className="column-list announcements-list">
                            <div className="item">
                              <div className="pic"><img src="../img/announcement-ico.png" alt=""/></div>
                              <div className="name">Regarding Submission of Documents of all classes students admitted in AY 2021-22 <span className="date">12 April, 2022</span></div>
                            </div>
                            <div className="item">
                              <div className="pic"><img src="../img/announcement-ico.png" alt=""/></div>
                              <div className="name">Regarding Submission of Documents of all classes students admitted in AY 2021-22 <span className="date">12 April, 2022</span></div>
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
    </>
  );
};

export default ParentsDashboard;
