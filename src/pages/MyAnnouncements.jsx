import React, { useState,useEffect } from "react";
import { Button, Container, Form, Dropdown, Accordion, Row, Col } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { BASE_URL } from "../components/App";
import axios from "axios";
import { NavLink } from "react-router-dom";

const MyAnnouncements = () => {
  return (
    <div className="announcement-accordion">
        <h1> My Announecment</h1>
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <div className="head-title">
            <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
            <div className="title-xxs">Regarding Submission of Documents of all classes students admitted in AY 2021-22 <small><span>Educator:</span> Smile Daycare</small></div>
            <div className="date">
              <NavLink to="/new-announcements">
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
      <Accordion.Item eventKey="1">
        <Accordion.Header>
          <div className="head-title">
            <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
            <div className="title-xxs">Regarding Submission of Documents of all classes students admitted in AY 2020-21 <small><span>Educator:</span> Smile Daycare</small></div>
            <div className="date">
                <NavLink to="/new-announcements">
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
                  <NavLink to="/new-announcements">
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
    </Accordion>
  </div>
  )
}

export default MyAnnouncements