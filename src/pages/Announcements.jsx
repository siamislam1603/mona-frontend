import React, { useState,useEffect } from "react";
import { Button, Container, Form, Dropdown, Accordion, Row, Col } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { BASE_URL } from "../components/App";
import axios from "axios";
import AllAnnouncements from "./AllAnnouncements";
import MyAnnouncements from "./MyAnnouncements";


const animatedComponents = makeAnimated();
const training = [
  {
    value: "sydney",
    label: "Sydney",
  },
  {
    value: "melbourne",
    label: "Melbourne",
  },
];

const Announcements =  () => {
  const [announcementDetails,setAnnouncementDetail] = useState("")
  const [tabLinkPath, setTabLinkPath] = useState("/all-announcements");

 
  const handleLinkClick = event => {
    let path = event.target.getAttribute('path');
    setTabLinkPath(path);
  }


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
                  <header className="title-head">
                    <h1 className="title-lg">Announcements</h1>
                    <div className="othpanel">
                      <div className="extra-btn">
                        <div className="data-search me-3">
                          <label for="search-bar" className="search-label">
                            <input id="search-bar" type="text" className="form-control" placeholder="Search" value=""/>
                          </label>
                        </div>
                        <Dropdown className="filtercol me-3">
                          <Dropdown.Toggle id="extrabtn" variant="btn-outline">
                            <i className="filter-ico"></i> Add Filters
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <header>Filter by:</header>
                            <div className="custom-radio btn-radio mb-2">
                              <label>Users:</label>
                              <Form.Group>
                                <Form.Check
                                  inline
                                  label='Admin'
                                  value='Admin'
                                  name="users"
                                  type="radio"
                                  id='one'
                                />
                                <Form.Check
                                  inline
                                  label='Co-ordinator'
                                  value='Co-ordinator'
                                  name="users"
                                  type="radio"
                                  id='two'
                                />
                                <Form.Check
                                  inline
                                  label='Educator'
                                  value='Educator'
                                  name="users"
                                  type="radio"
                                  id='three'
                                />
                                <Form.Check
                                  inline
                                  label='Parent/Guardian'
                                  value='Parent-Guardian'
                                  name="users"
                                  type="radio"
                                  id='four'
                                />
                              </Form.Group>
                            </div>
                            <div className="custom-radio">
                              <label className="mb-2">Location:</label>
                              <Form.Group>
                                <Select
                                  closeMenuOnSelect={false}
                                  components={animatedComponents}
                                  isMulti
                                  options={training}
                                />
                              </Form.Group>
                            </div>
                            <footer>
                              <Button variant="transparent" type="submit">Cancel</Button>
                              <Button variant="primary" type="submit">Apply</Button>
                            </footer>
                          </Dropdown.Menu>
                        </Dropdown>
                        <a href="/new-announcements" className="btn btn-primary me-3">+ Add New</a>
                        <Dropdown>
                          <Dropdown.Toggle id="extrabtn" className="ctaact">
                            <img src="../img/dot-ico.svg" alt=""/>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item href="#">Export All</Dropdown.Item>
                            <Dropdown.Item href="#">Delete All</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </header>
                  <div className="training-cat mb-3">
                    <ul>
                      <li><a onClick={handleLinkClick}  path="/all-announcements" className={`${tabLinkPath === "/all-announcements" ? "active" : ""}`}>All Announcements</a></li>
                      <li><a onClick={handleLinkClick} path="/my-announcements" className={`${tabLinkPath === "/my-announcements" ? "active" : ""}`} >My Announcements</a></li>
                  
                    </ul>
                  </div>
                  {/* <div className="announcement-accordion">
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>
                          <div className="head-title">
                            <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                            <div className="title-xxs">Regarding Submission of Documents of all classes students admitted in AY 2021-22 <small><span>Educator:</span> Smile Daycare</small></div>
                            <div className="date">Sent on: <br/>05/15/2022</div>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <Row className="mb-4">
                            <Col xl={2} lg={3}>
                              <div className="head">Description :</div>
                            </Col>
                            <Col xl={10} lg={9}>
                              <div className="cont"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id tincidunt est, et pellentesque gravida urna. Laoreet at eget et et dui, nisi. Id convallis aliquet ut nunc quam ultricies nulla nunc, maecenas. Volutpat eu suspendisse tristique auctor vitae in. Placerat tristique elit, consectetur egestas volutpat, mi. Est adipiscing tempor amet, enim, sed faucibus cras nunc morbi.</p></div>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <div className="video-col">
                                <a href="/" className="vid-col">
                                  <img src="../img/video-pic.jpg" alt="" />
                                  <span className="caption">Regarding Submission of Documents of all classes students admitted in AY 2021-22</span>
                                </a>
                              </div>
                            </Col>
                            <Col md={8}>
                              <div className="head">Related Images :</div>
                              <div className="cont">
                                <div className="related-images">
                                  <div className="item"><a href="/"><img src="../img/related-pic1.png" alt=""/></a></div>
                                  <div className="item"><a href="/"><img src="../img/related-pic2.png" alt=""/></a></div>
                                  <div className="item"><a href="/"><img src="../img/related-pic3.png" alt=""/></a></div>
                                  <div className="item"><a href="/"><img src="../img/related-pic4.png" alt=""/></a></div>
                                </div>
                              </div>
                              <div className="head">Related Files :</div>
                              <div className="cont">
                                <div className="related-files">
                                  <div className="item"><a href="/"><img src="../img/abstract-ico.png" alt=""/> <span className="name">Abstract.doc <small>Added Today</small></span></a></div>
                                  <div className="item"><a href="/"><img src="../img/abstract-ico.png" alt=""/> <span className="name">Abstract.doc <small>Added Today</small></span></a></div>
                                  <div className="item"><a href="/"><img src="../img/abstract-ico.png" alt=""/> <span className="name">Abstract.doc <small>Added Today</small></span></a></div>
                                  <div className="item"><a href=""><img src="../img/abstract-ico.png" alt=""/> <span className="name">Abstract.doc <small>Added Today</small></span></a></div>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Accordion.Body>
                      </Accordion.Item>
                      <Accordion.Item eventKey="1">
                        <Accordion.Header>
                          <div className="head-title">
                            <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                            <div className="title-xxs">Regarding Submission of Documents of all classes students admitted in AY 2020-21 <small><span>Educator:</span> Smile Daycare</small></div>
                            <div className="date">Sent on: <br/>05/15/2022</div>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <Row className="mb-4">
                            <Col xl={2} lg={3}>
                              <div className="head">Description :</div>
                            </Col>
                            <Col xl={10} lg={9}>
                              <div className="cont"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id tincidunt est, et pellentesque gravida urna. Laoreet at eget et et dui, nisi. Id convallis aliquet ut nunc quam ultricies nulla nunc, maecenas. Volutpat eu suspendisse tristique auctor vitae in. Placerat tristique elit, consectetur egestas volutpat, mi. Est adipiscing tempor amet, enim, sed faucibus cras nunc morbi.</p></div>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <div className="video-col">
                                <a href="/" className="vid-col">
                                  <img src="../img/video-pic.jpg" alt="" />
                                  <span className="caption">Regarding Submission of Documents of all classes students admitted in AY 2021-22</span>
                                </a>
                              </div>
                            </Col>
                            <Col md={8}>
                              <div className="head">Related Images :</div>
                              <div className="cont">
                                <div className="related-images">
                                  <div className="item"><a href="/"><img src="../img/related-pic1.png" alt=""/></a></div>
                                  <div className="item"><a href="/"><img src="../img/related-pic2.png" alt=""/></a></div>
                                  <div className="item"><a href="/"><img src="../img/related-pic3.png" alt=""/></a></div>
                                  <div className="item"><a href="/"><img src="../img/related-pic4.png" alt=""/></a></div>
                                </div>
                              </div>
                              <div className="head">Related Files :</div>
                              <div className="cont">
                                <div className="related-files">
                                  <div className="item"><a href="/"><img src="../img/abstract-ico.png" alt=""/> <span className="name">Abstract.doc <small>Added Today</small></span></a></div>
                                  <div className="item"><a href="/"><img src="../img/abstract-ico.png" alt=""/> <span className="name">Abstract.doc <small>Added Today</small></span></a></div>
                                  <div className="item"><a href="/"><img src="../img/abstract-ico.png" alt=""/> <span className="name">Abstract.doc <small>Added Today</small></span></a></div>
                                  <div className="item"><a href=""><img src="../img/abstract-ico.png" alt=""/> <span className="name">Abstract.doc <small>Added Today</small></span></a></div>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Accordion.Body>
                      </Accordion.Item>
                      <Accordion.Item eventKey="2">
                        <Accordion.Header>
                          <div className="head-title">
                            <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                            <div className="title-xxs">Regarding Submission of Documents of all classes students admitted in AY 2019-20 <small><span>Educator:</span> Smile Daycare</small></div>
                            <div className="date">Sent on: <br/>05/15/2022</div>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <Row className="mb-4">
                            <Col xl={2} lg={3}>
                              <div className="head">Description :</div>
                            </Col>
                            <Col xl={10} lg={9}>
                              <div className="cont"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id tincidunt est, et pellentesque gravida urna. Laoreet at eget et et dui, nisi. Id convallis aliquet ut nunc quam ultricies nulla nunc, maecenas. Volutpat eu suspendisse tristique auctor vitae in. Placerat tristique elit, consectetur egestas volutpat, mi. Est adipiscing tempor amet, enim, sed faucibus cras nunc morbi.</p></div>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <div className="video-col">
                                <a href="/" className="vid-col">
                                  <img src="../img/video-pic.jpg" alt="" />
                                  <span className="caption">Regarding Submission of Documents of all classes students admitted in AY 2021-22</span>
                                </a>
                              </div>
                            </Col>
                            <Col md={8}>
                              <div className="head">Related Images :</div>
                              <div className="cont">
                                <div className="related-images">
                                  <div className="item"><a href="/"><img src="../img/related-pic1.png" alt=""/></a></div>
                                  <div className="item"><a href="/"><img src="../img/related-pic2.png" alt=""/></a></div>
                                  <div className="item"><a href="/"><img src="../img/related-pic3.png" alt=""/></a></div>
                                  <div className="item"><a href="/"><img src="../img/related-pic4.png" alt=""/></a></div>
                                </div>
                              </div>
                              <div className="head">Related Files :</div>
                              <div className="cont">
                                <div className="related-files">
                                  <div className="item"><a href="/"><img src="../img/abstract-ico.png" alt=""/> <span className="name">Abstract.doc <small>Added Today</small></span></a></div>
                                  <div className="item"><a href="/"><img src="../img/abstract-ico.png" alt=""/> <span className="name">Abstract.doc <small>Added Today</small></span></a></div>
                                  <div className="item"><a href="/"><img src="../img/abstract-ico.png" alt=""/> <span className="name">Abstract.doc <small>Added Today</small></span></a></div>
                                  <div className="item"><a href=""><img src="../img/abstract-ico.png" alt=""/> <span className="name">Abstract.doc <small>Added Today</small></span></a></div>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </div> */}

            <div className="training-column">
                    {tabLinkPath === "/all-announcements" 
                      && <AllAnnouncements/>}
                    {tabLinkPath === "/my-announcements" 
                      && <MyAnnouncements
                             />}
                
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default Announcements;
