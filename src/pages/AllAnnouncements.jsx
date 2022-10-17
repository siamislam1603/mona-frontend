
import React, { useState,useEffect } from "react";
import { Button, Container, Form, Dropdown, Accordion, Row, Col } from "react-bootstrap";
import { BASE_URL } from "../components/App";
import axios from "axios";
// import VideoPop from "../components/VideoPop";
import CircularProgress from '@material-ui/core/CircularProgress';

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
const [isLoading, setIsLoading] = useState(true)
const [topMessage,setTopMessage] = useState(null);
const [theRelatedFiles,setTheRelatedFiles] = useState([])
const [announcementDetails,setAnnouncementDetail] = useState([])
const [announcementFiles,setAnnouncementFiles] = useState([])
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const [searchData,setSearchData] = useState()
const [realtedFile,setRelatedFile] = useState(false)
 
const paramsid = props.announId
const theKey =Number(paramsid)
  const AllAnnouncementData = async () =>{
    try {
      console.log("All Annocuneent method call")
      const token = localStorage.getItem('token');

      
      let franhiseAlias = "all"
     

      const response = await axios.get(`${BASE_URL}/announcement/?franchiseeAlias=${franhiseAlias}&isEvent=0&search=&offset=0&limit=5`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      console.log("THe Response 2645",response)
      
      if(response.status === 200 && response.data.status === "success") {
          setAnnouncementDetail(response.data.result.searchedData);
          setIsLoading(true)
         
    
        }
        if(response.status === 200 && response.data.status === "fail"){
          setAnnouncementDetail([])
          setIsLoading(false)

        }
        
    } catch (error) {
        if(error.response.status === 404){
          setAnnouncementDetail([])
          setIsLoading(false)

        }

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
  const Added= moment(str).format('DD/MM/YYYY')
  var today = new Date();
  let d = new Date(today);
  let month = (d.getMonth() + 1).toString().padStart(2, '0');
  let day = d.getDate().toString().padStart(2, '0');
  let year = d.getFullYear();
   let datae =  [day, month, year].join('/');

   if(datae === Added){
    return "Added today"
   }
   else if(Added<datae){
    return Added
   }
   else {
    return Added
   }
  // return Added

}
const realtedFile1 = ( )=>{
  announcementDetails?.map((data)=>{

    if(data.announcement_files.fileType != ".mp4"){
       setRelatedFile(true)
    }
})
}
useEffect(() => {
  const user_role = localStorage.getItem("user_role")
  setUserRole(user_role)
  
}, [])
useEffect(() =>{
  setSearchData(props.search)
},[props.search]) 
useEffect(() =>{
  if(!props.search ){
    console.log("The Search ann")
    // AllAnnouncementData()
  }
  else if(props.allAnnouncement){
    setAnnouncementDetail(props.allAnnouncement)
  }
  else {
    setAnnouncementDetail(props.search)
  }
},[search])

useEffect(() =>{
    if(props.allAnnouncement){
      setAnnouncementDetail(props.allAnnouncement)
    }
},[props.allAnnouncement])

useEffect(() =>{
  if(props?.loadMoreData?.length>0){
    setAnnouncementDetail(props.loadMoreData)
  }
  else{
    // console.log("THE LOAD MORE DATA EMPY ")
  }
},[props.loadMoreData])
console.log("Announcemen detal",announcementDetails)

  return (
    <div className="announcement-accordion">

       
                  {topMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topMessage}</p>} 
                    <Accordion defaultActiveKey={theKey}>
                      { announcementDetails &&
                        announcementDetails?.length !==0 ? (
                          announcementDetails.map((details,index) => (
                            <div key={index}>
                           <Accordion.Item eventKey={index}  >
                             <Accordion.Header>
                               <div className="head-title">
                                 <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                                 <div className="title-xxs">{details?.title}
                                 
                                 <small><span>
                                <span className="timesec">{getAddedTime(details.createdAt)}</span>
                                  
                                      {/* {
                                         details.user.role.split('_')
                                         .map(
                                          (data) =>
                                           data.charAt(0).toUpperCase() + data.slice(1)
                                          ).join(' ')
                                      } :  */}
                                  
                             </span>
                             {details.user.fullname[0].toUpperCase()+details.user.fullname.slice(1)}

                             
                             </small>
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
                                 <Col lg={4}>
                                   <div className="video-col">
                                   
                                     {   details?.announcement_files?.map((detail,index) =>(
                                     !detail.is_deleted? 
                                              <>
                                              {detail.fileType == ".mp4"||detail.fileType == ".mkv" || detail.fileType == ".flv" ? (
                                                 <AnnouncementVideo 
                                                   data={detail}
                                                   title={`Annoucnement Video ${index + 1}`}
                                                   // duration={trainingDetails.completion_time} 
                                                   fun={handleClose}/>
                                                ):(
                                               null
                                              )}
   
                                              </>:(null)
                                       ))}
   
                                   </div>
                                 </Col>
                                 <Col lg={8}>
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
   
                                                        
               {details?.announcement_files?.length>0 ? <>
                    { details?.announcement_files[0]?.fileType === ".mp4" || details?.announcement_files[0]?.fileType === ".flv" ||details?.announcement_files[0].fileType === ".mkv" ? 
                                  (
                                    null
                                    // <div className="head">Related Files :</div>

                                  ):
                                  (
                                    <div className="head">Related Files :</div>
                                  )}
                                               
                                            </>
                                          :(
                                            null
                                          )

                                          }    
                                     <div className="cont">
                                     <div className="related-files">
                                       {details?.announcement_files?.map((detail,index) =>(
                                              <>
                                               
                                              {detail.fileType != ".mp4" && detail.fileType != '.mkv' && detail.fileType != '.flv' && !detail.is_deleted ?(
                                           
                                                <div className="item">

                                                  <a href={detail.file} target='_blank' rel='noopener noreferrer'  ><img src="../img/abstract-ico.png" alt=""/> <span className="name">
                                                 <p>{getRelatedFileName(detail.file)}</p>
                                                 <small>
                                                 {getAddedTime(detail.createdAt)}
                                                 
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
                          <div className="text-center mb-5 mt-5"> {isLoading && props.loadCheck? (<CircularProgress/>) :  <strong>No data found</strong> }</div>
                        )
                      }
                    </Accordion>
                  </div>
  )
}

export default AllAnnouncements