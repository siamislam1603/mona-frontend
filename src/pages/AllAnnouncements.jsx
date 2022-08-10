import React, { useState,useEffect } from "react";
import { Button, Container, Form, Dropdown, Accordion, Row, Col } from "react-bootstrap";
import { BASE_URL } from "../components/App";
import axios from "axios";
// import VideoPop from "../components/VideoPop";
import AnnouncementVideo from "./AnnouncementVideo";
import { debounce } from 'lodash';
import moment from 'moment';

import MyEditor from "./CKEditor";


const AllAnnouncements = (props) => {
  const [operatingManualData, setOperatingManualData] = useState({
    related_files: [],
  });
const [userRole,setUserRole]=useState(null)

const userName = localStorage.getItem("user_name");
const userROle = localStorage.getItem("user_role");
const [search,setSearch]=useState('');

const [topMessage,setTopMessage] = useState(null);
const [theRelatedFiles,setTheRelatedFiles] = useState([])
const [announcementDetails,setAnnouncementDetail] = useState([])
const [announcementFiles,setAnnouncementFiles] = useState([])
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const [searchData,setSearchData] = useState()
 
  const AllAnnouncementData = async () =>{
    try {
      // console.log("Announcement detial API")
      const token = localStorage.getItem('token');
      let franhiseAlias = "all"
      const response = await axios.get(`${BASE_URL}/announcement/?franchiseeAlias=${franhiseAlias}&isEvent=0&search=&offset=0&limit=5`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      // console.log("The All Announcement",response.data.result);
      
      if(response.status === 200 && response.data.status === "success") {
          setAnnouncementDetail(response.data.result.searchedData);
      }
    } catch (error) {
        if(error.response.status === 404){
          // console.log("The code is 404")
          setAnnouncementDetail([])
        }

    }
  
}
// console.log("The props",props.search)

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
const getAddedTime = (str) =>{
  // const Added= moment(str).format('YYYY-MM-DD')
  // console.log("THe astring",str)
  const Added= moment(str).format('DD/MM/YYYY')
  // console.log("THe data",dateww)
  var today = new Date();
  let d = new Date(today);
  let month = (d.getMonth() + 1).toString().padStart(2, '0');
  let day = d.getDate().toString().padStart(2, '0');
  let year = d.getFullYear();
   let datae =  [day, month, year].join('/');
  //  console.log("THE DATE",datae,Added)
   let temp;
   if(datae === Added){
    temp = "Added today";
   }

   if(Added < datae){
    temp = Added;
    // console.log("THE added date i smaller",typeof Added, typeof datae);
   }

   return temp;
}
useEffect(() => {
  AllAnnouncementData()
  const user_role = localStorage.getItem("user_role")
  setUserRole(user_role)
  
}, [])
useEffect(() =>{
  // console.log("The props.ssearch state change")
  setSearchData(props.search)
},[props.search]) 
useEffect(() =>{
  if(!props.search){
    AllAnnouncementData()
    // console.log("The search value is not found",props.search)
  }
  else if(props.allAnnouncement){
    // console.log("The search value have something",props.search)
    // setAnnouncementDetail(props.search)
    setAnnouncementDetail(props.allAnnouncement)
  }
  else {
    setAnnouncementDetail(props.search)
  }
},[search])
//  useEffect(() =>{
//     if(props.allAnnouncements?.length>0){
//       // console.log("Don't have fanrhise")
//     }
//     setAnnouncementDetail(props.allAnnouncements)
//     console.log("The frnahise under all announcement",props.allAnnouncements)
    
// },[props.franchisee])
useEffect(() =>{
    if(props.allAnnouncement){
      setAnnouncementDetail(props.allAnnouncement)
      console.log("THE Annoncement all props",props.allAnnouncement)
    }
},[props.allAnnouncement])

useEffect(() =>{
  if(props?.loadMoreData?.length>0){
    setAnnouncementDetail(props.loadMoreData)
    // console.log("THE LOAD MORE DATA IS NOT EMPYU",props.loadMoreData)
  }
  else{
    // console.log("THE LOAD MORE DATA EMPY ")
  }
},[props.loadMoreData])

//  announcementDetails.filter(c => console.log("The announcment file",c.announcement_files))

// console.log("The franhise",props.franchisee)
//   console.log(" THE All  MORE DATA inside All ANnoncements",announcementDetails)
// console.log("The annoumce all ",props.allAnnouncement)
//   // console.log("The seach in all announcement", props.search)
  {console.log("THE ANNOINCE",announcementDetails)}

  return (
    <div className="announcement-accordion">
       
                  {topMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topMessage}</p>} 
                    <Accordion defaultActiveKey="0">
                      { announcementDetails &&
                        announcementDetails?.length !==0 ? (
                          announcementDetails.map((details,index) => (
                            <div key={index}>
                           <Accordion.Item eventKey={index} >
                             <Accordion.Header>
                               <div className="head-title">
                                 <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                                 <div className="title-xxs">{details.title}
                                 
                                 <small><span>
                                <span>{getAddedTime(details.createdAt)}</span>
                                  
                                   {
                                 localStorage.getItem('user_role')
                                     ? localStorage
                                       .getItem('user_role')
                                        .split('_')
                                        .map(
                                         (data) =>
                                          data.charAt(0).toUpperCase() + data.slice(1)
                                         ).join(' ')
                             : ''} : </span>{userName}
                             
                             </small>
                             </div>
                                 {/* <div className="date">
                                    <Dropdown>
                                     <Dropdown.Toggle id="extrabtn" className="ctaact">
                                       <img src="../img/dot-ico.svg" alt=""/>
                                     </Dropdown.Toggle>
                                     <Dropdown.Menu>
                                     {userRole === "franchisor_admin" || userRole === "franchisee_admin" ? (
                                     <Dropdown.Item href={`/edit-announcement/${details.id}`}>Edit</Dropdown.Item>
                                          
                                          ): (
                                            null
                                          )}
                                       <Dropdown.Item onClick={() =>deleteAlert(details.id)}>Delete</Dropdown.Item>
                                     </Dropdown.Menu>
                                   </Dropdown>
                                 </div> */}
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
                                   
                                     {   details?.announcement_files?.map((detail,index) =>(
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
                                   {details &&details?.coverImage && <div className="head">Related Images :</div>}
                                   <div className="cont">
                                     <div className="related-images">
     
   
                                       {details && details?.coverImage &&
                                         <div className="item">
                                           <a href="/"><img src={details.coverImage} alt=""/></a>
                                         </div>
                                       }
             
                                     </div>
                                   </div>
   
                                  {details?.announcement_files?.length>0 ? ( <div className="head">Related Files :</div> ):(null)}                     
                                     <div className="cont">
                                     <div className="related-files">
                                       {details?.announcement_files?.map((detail,index) =>(
                                         
                                              <>
                                               
                                              {detail.fileType !== ".mp4" && !detail.is_deleted ?(
                                                <div className="item"><a href={detail.file}><img src="../img/abstract-ico.png" alt=""/> <span className="name">
                                                 <p>{getRelatedFileName(detail.file)}</p>
                                                 <small>
                                                 {getAddedTime(detail.createdAt)}
                                                 {/* {console.log("COnsole date",detail.createdAt)} */}
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
                        ): (
                          <div className="text-center mb-5 mt-5"><strong>No data found</strong></div>
                        )
                      }
                    </Accordion>
                  </div>
  )
}

export default AllAnnouncements