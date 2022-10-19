import React, { useState,useEffect } from "react";
import { Button, Container, Form, Dropdown, Accordion, Row, Col } from "react-bootstrap";
import CircularProgress from '@material-ui/core/CircularProgress';

import { BASE_URL } from "../components/App";
import axios from "axios";

import AnnouncementVideo from "./AnnouncementVideo";
import moment from 'moment';
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";


const MyAnnouncements = ({theMyAnnouncement,myLoadData,selectedFranchisee,theLoad,removeItem}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const[relatedFileCheck,setRelatedFileCheck]= useState(false)
  const [topErrorMessage, setTopErrorMessage] = useState(null);
  const [topMessage,setTopMessage] = useState(null);
  const [myAnnouncement,setmyAnnouncement] = useState([]);
  // const {id} = useParams
  const [userRole,setUserRole]=useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const myAnnouncementData = async() =>{
    try {
      let token = localStorage.getItem('token')
    let id= localStorage.getItem("user_id")
    // console.log("sending response");
    let franhiseAlias = "all"
    let userId = localStorage.getItem("user_id")
    // http://localhost:4000/announcement/created-announcement-events/2/?franchiseeAlias=all&limit=25&search=
    // http://localhost:4000/announcement/created-announcement-events/2?franchiseeAlias=all&limit=25&search=
    const response =
     await axios
     .get(`${BASE_URL}/announcement/created-announcement-events/${userId}/?franchiseeAlias=${franhiseAlias}&offset=0&limit=5&search=  
     `, {
      headers: {
        "Authorization": "Bearer " + token
      }
     })
     if(response.status === 200) {
        setmyAnnouncement(response.data.result.searchedData)
        setIsLoading(true)

     }
    } catch (error) {
       setmyAnnouncement([])
       setIsLoading(false)

    }
  }
  

  const deleteAnnouncementAlert = (id) =>{
    if (window.confirm('Are you sure you want to delete ?')) {
      deleteAnnouncement(id)


    }
    else{
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
      if(response.status === 200){
          setTopMessage("Delete succussfully")
          // myAnnouncementData()
          removeItem(id)
  
          setTimeout(() =>{
            setTopMessage(null)
        },3000)
      }
    } catch (error) {
    }
  }

  const  relatedFile = (file) =>{
    for (let i = 0; i < file?.length; i++) {
      if (file[i].fileType !== ".mp4" || file[i].fileType !== ".flv" || file[i].fileType!==".mkv") { 
         return true
        break; }
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
    //  const date1 = new Date(datae);
    //  const date2 = new Date(str);
    //  console.log("THE Date1",Added,datae)
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

  useEffect(() =>{
    myAnnouncementData()
    const user_role = localStorage.getItem("user_role")
    setUserRole(user_role)
  },[])
  useEffect(() =>{
    if(myLoadData?.length>0){
      setmyAnnouncement(myLoadData)
    }
    else{
         
    }
  },[myLoadData])

  useEffect(()=>{

      if(theMyAnnouncement?.length>0) {
        // setIsLoading(true)
        setmyAnnouncement(theMyAnnouncement)
      }
      else{
        // setIsLoading(false)

        setmyAnnouncement([])
      }
  },[theMyAnnouncement])

useEffect(() =>{
  setTimeout(() => {
    setTopErrorMessage(null);
  }, 6000)
},[topErrorMessage])






// {myAnnouncement &&  console.log("schedule time",myAnnouncement[0].scheduled_date)}
 return (
 
    <div className="announcement-accordion">
    {topErrorMessage && <p className="alert alert-danger" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topErrorMessage}</p>} 
   {topMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topMessage}</p>} 

    <Accordion defaultActiveKey="0" >
      { myAnnouncement &&
       myAnnouncement.length !== 0 ? (
        myAnnouncement.map((data,index) => 
        (

          <Accordion.Item eventKey={index} key={index} >
          <Accordion.Header>
            <div className="head-title">
              <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
              <div className="title-xxs">{data.title}
              <small>
                <span>
              <span className="timesec">{getAddedTime(data.createdAt)}</span>

              {/* {
                                         data.user.role.split('_')
                                         .map(
                                          (data) =>
                                           data.charAt(0).toUpperCase() + data.slice(1)
                                          ).join(' ')
                                      } :  */}
                                  
                             </span>
                             {data.user.fullname[0].toUpperCase()+data.user.fullname.slice(1)}
                  
                          {/* {data.is_event === 1 ?<span style ={{color:"black",fontWeight:"bold"}}> Event</span>:<span style ={{color:"black",fontWeight:"900"}}> Announcement</span> } */}
                            
                          </small>
                          </div>              
              <div className="date">
                 
                      {
                    userRole === "franchisor_admin" || userRole === "franchisee_admin" ?
                    (
                      <Dropdown>
                      <Dropdown.Toggle id="extrabtn" className="ctaact">
                        <img src="../img/dot-ico.svg" alt=""/>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>                        
                        <Dropdown.Item href={
                          new Date(data?.scheduled_date)>new Date() ? (
                            `/edit-announcement/${data.id}`  

                          ):
                          (
                              null  
                             
                          )
                        }
                        onClick={() =>  
                          new Date(data?.scheduled_date)>new Date() ? (
                            setTopErrorMessage(null)

                          ):(
                            setTopErrorMessage("Cannot edit started announcement/event")

                          )
                          }
                      
                        >Edit</Dropdown.Item>                                          
                           
                      
                        <Dropdown.Item onClick={() => {deleteAnnouncementAlert(data.id)}}>Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    ):(
                      null
                    )
                   }
                     {/* <Dropdown>
                                  <Dropdown.Toggle id="extrabtn" className="ctaact">
                                    <img src="../img/dot-ico.svg" alt=""/>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                  {userRole === "franchisor_admin" || userRole === "franchisee_admin" ? (
                                    <Dropdown.Item href={`/edit-announcement/${data.id}`}>Edit</Dropdown.Item>                                   
                                    ): (
                                      null
                                    )}
                                    <Dropdown.Item onClick={() =>deleteAnnouncement(data.id)}>Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown> */}
                
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
              <Col lg={4}>
                <div className="video-col">
                {data.announcement_files.map((detail,index) =>(
                  <>
                      {detail.fileType == ".mp4"||detail.fileType === ".mkv" || detail.fileType === ".flv" && !detail.is_deleted  ? (
                                 <AnnouncementVideo 
                                      data={detail}
                                      title={`Annoucnement Video ${index + 1}`}
                                                // duration={trainingDetails.completion_time} 
                                        fun={handleClose}/>
                                   ):(
                                       null
                                   )}
                       </>
                     ))}
                </div>
              </Col>
              <Col lg={8}>
              {data &&data.coverImage && <div className="head">Related Images :</div>
              }
              {data && data.coverImage && 
                    <div className="cont">
                    <div className="related-images">
              
                      {/* <div className="item"><a href="/"><img src="../img/related-pic4.png" alt=""/></a></div> */}
                      <div className="item"><a href="/"><img src={data.coverImage} alt=""/></a></div>
                    
                    </div>
                  </div>
              }
              {relatedFile(data?.announcement_files) && 
                              <div className="head">Related Files :</div>
              
              }
              
             {relatedFile(data?.announcement_files) &&
                             <div className="cont">
                             <div className="related-files">
                             {data.announcement_files && data.announcement_files.map((detail,index) =>(
                                 <>
                                   {detail.fileType != ".mp4" &&  detail.fileType !== ".flv"  && detail.fileType != ".mkv" && !detail.is_deleted ?(
                                       <div className="item"><a  href={detail.file} target='_blank' rel='noopener noreferrer'  ><img src="../img/abstract-ico.png" alt=""/> <span className="name">
                                         <p>{getRelatedFileName(detail.file)}</p>
                                        
                                        <small>{getAddedTime(detail.createdAt)}</small></span></a></div>
                                         ):(null)} </>
                                   ))}
                             </div>
                           </div>}
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        ))
       )
       :(
        <div className="text-center mb-5 mt-5"> {isLoading ===true && theLoad === true? (<CircularProgress/>) :  <strong>No data found</strong> }</div>

       )
      }
   
    </Accordion>
    {/* <button type="button"  className="btn btn-primary">Load More</button> */}

  </div>
  )
}

export default MyAnnouncements