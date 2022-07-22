import React, { useState,useEffect } from "react";
import { Button, Container, Form, Dropdown, Accordion, Row, Col } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { BASE_URL } from "../components/App";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";

const MyAnnouncements = () => {
  const [myAnnouncement,setmyAnnouncement] = useState([]);
  // const {id} = useParams
  const myAnnouncementData = async() =>{
    let token = localStorage.getItem('token')
    let id= localStorage.getItem("user_id")
    console.log("sending response");
    const response = await axios.get(`${BASE_URL}/announcement/createdAnnouncement/${id}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
     })
     if(response.status === 200) {
        setmyAnnouncement(response.data.data.all_announcements)
     }
  }
  const userName = localStorage.getItem("user_name");
  const userROle = localStorage.getItem("user_role")
  useEffect(() =>{
    myAnnouncementData()
  },[])
 
  return (
    <div className="announcement-accordion">
        <h1> My Announecment</h1>
    <Accordion defaultActiveKey="0">
      {
        myAnnouncement.map((data,index) => (
          <Accordion.Item eventKey={index} key={index}>
          <Accordion.Header>
            <div className="head-title">
              <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
              <div className="title-xxs">{data.title} <small><span>Educator:</span>{userName}</small></div>
              <div className="date">
                 
                  {/* <Dropdown.Toggle id="extrabtn" className="ctaact">
                      <NavLink to="/edit-announcement">
                        <img src="../img/dot-ico.svg" alt=""/>
                      </NavLink>
                   </Dropdown.Toggle> */}
                 <div className="date">
                  <a href={`/edit-announcement/${data.id}`}><img src="../img/editPen.png" alt=""/></a></div>
              </div>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <Row className="mb-4">
              <Col xl={2} lg={3}>
                <div className="head">Description :</div>
              </Col>
              <Col xl={10} lg={9}>
                <div className="cont"><p> {data.meta_description}</p></div>
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
            
                    {/* <div className="item"><a href="/"><img src="../img/related-pic4.png" alt=""/></a></div> */}
                    <div className="item"><a href="/"><img src={data.coverImage} alt=""/></a></div>
                  
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
        ))
      }
   
    </Accordion>
  </div>
  )
}

export default MyAnnouncements