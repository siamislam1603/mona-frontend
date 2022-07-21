import React, { useState,useEffect } from "react";
import { Button, Container, Form, Dropdown, Accordion, Row, Col } from "react-bootstrap";
import { BASE_URL } from "../components/App";
import axios from "axios";
import AnnouncementVideo from "./AnnouncementVideo";
import MyEditor from "./CKEditor";


const MyAnnouncements = () => {
  const [operatingManualData, setOperatingManualData] = useState({
    related_files: [],
  });
const userName = localStorage.getItem("user_name");
const userROle = localStorage.getItem("user_role")
const [theRelatedFiles,setTheRelatedFiles] = useState([])
const [announcementDetails,setAnnouncementDetail] = useState([])
const [announcementFiles,setAnnouncementFiles] = useState([])
const [videoFile, setVideoFile] = useState("https://embed.api.video/vod/vi38jFGbfBrkIlcrHXWLszG");
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
 
  const AllAnnouncementData = async () =>{
    console.log("Announcement detial API")
  const token = localStorage.getItem('token');
  const id = localStorage.getItem("user_id");
  const response = await axios.get(`${BASE_URL}/announcement/createdAnnouncement/${id}`, {
    headers: {
      "Authorization": "Bearer " + token
    }
  });
  console.log(response);
  
  if(response.status === 200 && response.data.status === "success") {
      setAnnouncementDetail(response.data.createdAnnouncement);
  }
}


const formatMetaDescription = (str) => {
    let newFile = str.replace(/<p>/g, '');
    newFile = newFile.split('</p>')[0];
    return newFile;
}

const getRelatedFileName = (str) => {
  let arr = str.split("/");
  let fileName = arr[arr.length - 1].split("_")[0];
  let ext =arr[arr.length-1].split(".")[1]
  let name = fileName.concat(".",ext)
  return name;
}
useEffect(() => {
  AllAnnouncementData()
}, [])

console.log("The annoumce detial",announcementDetails,theRelatedFiles)
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
                                  <div
                                  dangerouslySetInnerHTML={{
                                    __html: details.meta_description
                                      ? details.meta_description
                                      : null,
                                  }}
                                  />
                              </Col>
                            </Row>
                            <Row>
                              <Col md={4}>
                                <div className="video-col"> 
                                  {details.announcement_files.map((detail,index) =>(
                                           <>
                                           {detail.fileType == ".mp4" ?(
                                              <AnnouncementVideo 
                                                data={detail}
                                                title={`Training Video ${index + 1}`} 
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
  

                                    <div className="item">
                                      <a href="/"><img src={details.coverImage} alt=""/></a>
                                    </div>
          
                                  </div>
                                </div>
                                <div className="head">Related Files :</div>
                                <div className="cont">
                                  <div className="related-files">
                                    {details.announcement_files.map((detail,index) =>(
                                           <>
                                           {detail.fileType !== ".mp4" ?(
                                             <div className="item"><a href={detail.file}><img src="../img/abstract-ico.png" alt=""/> <span className="name">
                                              <p>{getRelatedFileName(detail.file)}</p>
                                              <small>
                                              Added Today
                                              </small></span></a></div>
                                           ):(
                                            null
                                           )}

                                           </>
                                    ))}
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </Accordion.Body>
                        </Accordion.Item>
                         </div> 
                        
                        ))
                      }
                    </Accordion>
                  </div>
  )
}

export default MyAnnouncements