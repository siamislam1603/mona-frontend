import React, { useState,useEffect } from "react";
import { Button, Container, Form, Dropdown, Accordion, Row, Col } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { BASE_URL } from "../components/App";
import axios from "axios";
import { NavLink } from "react-router-dom";

const AllAnnouncements = () => {
const userName = localStorage.getItem("user_name");
const userROle = localStorage.getItem("user_role")
const [announcementDetails,setAnnouncementDetail] = useState([])
const [announcementFiles,setAnnouncementFiles] = useState([])

  const AllAnnouncementData = async () =>{
  const token = localStorage.getItem('token');
  const response = await axios.get(`${BASE_URL}/announcement`, {
    headers: {
      "Authorization": "Bearer " + token
    }
  });
  if(response.status === 200 && response.data.status === "success") {
      setAnnouncementDetail(response.data.data.all_announcements);
  }
}
useEffect(() => {
  AllAnnouncementData()
}, [])
console.log("The annoumce detial",announcementDetails)
  return (
    <div className="announcement-accordion">
                    <Accordion defaultActiveKey="0">
                      {
                        announcementDetails.map((details,index) => (
                         <div key={index}>
                        <Accordion.Item eventKey={index} >
                          <Accordion.Header>
                            <div className="head-title">
                              <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                              <div className="title-xxs">{details.title}<small><span>{userROle}:</span>{userName}</small></div>
                              <div className="date">
                                 <div className="date">
                                  <a href={`/edit-announcement/${details.id}`}><img src="../img/editPen.png" alt=""/></a></div>
                              </div>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <Row className="mb-4">
                              <Col xl={2} lg={3}>
                                <div className="head">Description :</div>
                              </Col>
                              <Col xl={10} lg={9}>
                                <div className="cont"><p> {details.meta_description}</p></div>
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
  

                                    <div className="item">
                                      <a href="/"><img src={details.coverImage} alt=""/></a>
                                    </div>
          
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
                         </div> 
                        
                        ))
                      }

                      {/* <Accordion.Item eventKey="1">
                        <Accordion.Header>
                          <div className="head-title">
                            <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                            <div className="title-xxs">Regarding Submission of Documents of all classes students admitted in AY 2020-21 <small><span>Educator:</span> Smile Daycare</small></div>
                            <div className="date">
                              <NavLink to="/edit-announcement">
                                <img src="../img/dot-ico.svg" alt=""/>
                              </NavLink>
                            </div>
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
                            <div className="date">
                               <NavLink to="/edit-announcement">
                                  <img src="../img/dot-ico.svg" alt=""/>
                                </NavLink>
                            </div>
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
                      </Accordion.Item> */}
                    </Accordion>
                  </div>
  )
}

export default AllAnnouncements