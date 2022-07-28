import React, { useState,useEffect } from "react";
import { Button, Container, Form, Dropdown, Accordion, Row, Col } from "react-bootstrap";
import { BASE_URL } from "../components/App";
import axios from "axios";
// import VideoPop from "../components/VideoPop";
import AnnouncementVideo from "./AnnouncementVideo";
import { debounce } from 'lodash';

import MyEditor from "./CKEditor";


const AllAnnouncements = (props) => {
  const [operatingManualData, setOperatingManualData] = useState({
    related_files: [],
  });
const userName = localStorage.getItem("user_name");
const userROle = localStorage.getItem("user_role");
const [search,setSearch]=useState('');

const [topMessage,setTopMessage] = useState(null);
const [theRelatedFiles,setTheRelatedFiles] = useState([])
const [announcementDetails,setAnnouncementDetail] = useState([])
const [announcementFiles,setAnnouncementFiles] = useState([])
const [videoFile, setVideoFile] = useState("https://embed.api.video/vod/vi38jFGbfBrkIlcrHXWLszG");
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const [theDelete,setTheDelete] = useState("");
const [searchData,setSearchData] = useState()
 
  const AllAnnouncementData = async () =>{
    try {
      // console.log("Announcement detial API")
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/announcement`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      // console.log("The data",response);
      
      if(response.status === 200 && response.data.status === "success") {
          setAnnouncementDetail(response.data.searchedData);
      }
    } catch (error) {
        if(error.response.status === 404){
          // console.log("The code is 404")
          setAnnouncementDetail([])
        }

    }
  
}
// console.log("The props",props.search)


const formatMetaDescription = (str) => {
    let newFile = str.replace(/<p>/g, '');
    newFile = newFile.split('</p>')[0];
    return newFile;
} 
const deleteAlert = (id) =>{
  if(window.confirm('Are you sure you want to delete?')){
     deleteAnnouncement(id);
  }
}

const deleteAnnouncement = async (id) =>{
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${BASE_URL}/announcement/${id}`, {
    headers: {
      "Authorization": "Bearer " + token
    }
  }); 
  // console.log("The response after delete",response)
  if(response.status === 200){
      setTopMessage("Delete successfully")
      AllAnnouncementData()
    
      setTimeout(() => {
        setTopMessage(null)
      }, 2000);
  }
  } catch (error) {
    console.log("The error",error)
  }
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
useEffect(() =>{
  console.log("The props.ssearch state change")
  setSearchData(props.search)
},[props.search]) 
useEffect(() =>{
  if(!props.searchValue){
    AllAnnouncementData()
    console.log("The search value is not found",props.searchValue)
  }
  else{
    console.log("The search value have something",props.searchValue)
    setAnnouncementDetail(props.search)
  }
},[props.search])
//  announcementDetails.filter(c => console.log("The announcment file",c.announcement_files))

// console.log("The annoumce all ",announcementDetails)
  console.log("The seach in all announcement", props.search,props.searchValue)

  return (
    
    <div className="announcement-accordion">
       
                  {topMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topMessage}</p>} 

                        {/* <MyEditor
                              operatingManual={{ ...operatingManualData }} 
                             
                            /> */}
      {/* <iframe title="video file" className="embed-responsive-item" src="https://embed.api.video/vod/vi54sj9dAakOHJXKrUycCQZp" frameborder="0"  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> */}

                    <Accordion defaultActiveKey="0">
                      {
                        announcementDetails && announcementDetails.map((details,index) => (
                         <div key={index}>
                        <Accordion.Item eventKey={index} >
                          <Accordion.Header>
                            <div className="head-title">
                              <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                              <div className="title-xxs">{details.title}<small><span> {
                              localStorage.getItem('user_role')
                                  ? localStorage
                                    .getItem('user_role')
                                     .split('_')
                                     .map(
                                      (data) =>
                                       data.charAt(0).toUpperCase() + data.slice(1)
                                      ).join(' ')
                          : ''}:</span>{userName}</small></div>
                              <div className="date">
                                 <Dropdown>
                                  <Dropdown.Toggle id="extrabtn" className="ctaact">
                                    <img src="../img/dot-ico.svg" alt=""/>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href={`/edit-announcement/${details.id}`}>Edit</Dropdown.Item>
                                    <Dropdown.Item onClick={() =>deleteAlert(details.id)}>Delete</Dropdown.Item>
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
                                  <div
                                  dangerouslySetInnerHTML={{
                                    __html: details.meta_description
                                      ? details.meta_description
                                      : null,
                                  }}
                                  />
                                {/* <div className="cont"> {details.meta_description}</div> */}
                              </Col>
                            </Row>
                            <Row>
                              <Col md={4}>
                                <div className="video-col">
                                  {/* <a href="/" className="vid-col">
                                    <img src="../img/video-pic.jpg" alt="" />
                                    <span className="caption">Regarding Submission of Documents of all classes students admitted in AY 2021-22</span>
                                  </a> */}
                                  {/* <iframe  src="https://embed.api.video/vod/vi38jFGbfBrkIlcrHXWLszG">
                                  </iframe> */}
                                  
                                  {   details.announcement_files?.map((detail,index) =>(
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
                                {details &&details.coverImage && <div className="head">Related Images :</div>}
                                <div className="cont">
                                  <div className="related-images">
  

                                    {details && details.coverImage &&
                                      <div className="item">
                                        <a href="/"><img src={details.coverImage} alt=""/></a>
                                      </div>
                                    }
          
                                  </div>
                                </div>
                                {/* {details.announcement_files.map((detail,index) =>(
                                      
                                      
                                      //  for(let i =0 ; i<detail.length<i++){

                                      //  }

                                    
                               ))} */}
                               {details.announcement_files.length>0 ? ( <div className="head">Related Files :</div> ):(null)}                     
                                  <div className="cont">
                                  <div className="related-files">
                                    {details.announcement_files.map((detail,index) =>(
                                      
                                           <>
                                            
                                           {detail.fileType !== ".mp4" && !detail.is_deleted ?(
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
                                    {/* <div className="item"><a href="/"><img src="../img/abstract-ico.png" alt=""/> <span className="name">Abstract.doc <small>Added Today</small></span></a></div>
                                    <div className="item"><a href="/"><img src="../img/abstract-ico.png" alt=""/> <span className="name">Abstract.doc <small>Added Today</small></span></a></div>
                                    <div className="item"><a href=""><img src="../img/abstract-ico.png" alt=""/> <span className="name">Abstract.doc <small>Added Today</small></span></a></div> */}
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