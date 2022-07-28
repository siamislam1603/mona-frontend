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
import AnnouncementVideo from "./AnnouncementVideo";

const MyAnnouncements = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
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
     console.log("The repsonse mY anncounce,",response)
     if(response.status === 200) {
        setmyAnnouncement(response.data.data.searchedData)
     }
  }
  const deleteAnnouncement = async (id) =>{
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${BASE_URL}/announcement/${id}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    }); 
    console.log("The response after delete",response)
    if(response.status === 200){
        console.log("Delete succussfully")
        myAnnouncementData()

    }
  
  }
  const userName = localStorage.getItem("user_name");
  const userROle = localStorage.getItem("user_role")
  const getRelatedFileName = (str) => {
    let arr = str.split("/");
    let fileName = arr[arr.length - 1].split("_")[0];
    let ext =arr[arr.length-1].split(".")[1]
    let name = fileName.concat(".",ext)
    return name;
  }
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
                     <Dropdown>
                                  <Dropdown.Toggle id="extrabtn" className="ctaact">
                                    <img src="../img/dot-ico.svg" alt=""/>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href={`/edit-announcement/${data.id}`}>Edit</Dropdown.Item>
                                    <Dropdown.Item onClick={() =>deleteAnnouncement(data.id)}>Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                
            </div>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <Row className="mb-4">
              <Col xl={2} lg={3}>
                <div className="head">Description :</div>
              </Col>
              <Col xl={10} lg={9}>
                {/* <div className="cont"><p> {data.meta_description}</p></div> */}
                <div
                    dangerouslySetInnerHTML={{
                    __html: data.meta_description
                      ? data.meta_description
                       : null,
                      }}
                   />
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <div className="video-col">
                {data.announcement_files.map((detail,index) =>(
                  <>
                      {detail.fileType == ".mp4" && !detail.is_deleted  ? (
                                 <AnnouncementVideo 
                                      data={detail}
                                      title={`Training Video ${index + 1}`}
                                                // duration={trainingDetails.completion_time} 
                                        fun={handleClose}/>
                                   ):(
                                       null
                                   )}
                       </>
                     ))}
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
                  {data.announcement_files.map((detail,index) =>(
                      <>
                        {detail.fileType !== ".mp4" && !detail.is_deleted ?(
                            <div className="item"><a href={detail.file}><img src="../img/abstract-ico.png" alt=""/> <span className="name">
                              <p>{getRelatedFileName(detail.file)}</p>
                             <small>Added Today</small></span></a></div>
                              ):(null)} </>
                        ))}
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