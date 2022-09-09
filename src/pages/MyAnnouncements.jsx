import React, { useState,useEffect } from "react";
import { Button, Container, Form, Dropdown, Accordion, Row, Col } from "react-bootstrap";
import CircularProgress from '@material-ui/core/CircularProgress';

import { BASE_URL } from "../components/App";
import axios from "axios";

import AnnouncementVideo from "./AnnouncementVideo";
import moment from 'moment';


const MyAnnouncements = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
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
     console.log("The repsonse mY anncounce,",response)
     if(response.status === 200) {
        setmyAnnouncement(response.data.result.searchedData)
        setIsLoading(true)

     }
    } catch (error) {
       setmyAnnouncement([])
       setIsLoading(false)

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
        setTopMessage("Delete succussfully")
        myAnnouncementData()
        setTimeout(() =>{
          setTopMessage(null)
      },3000)
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
  // const getAddedTime = (str) =>{
  //   const Added= moment(str).format('DD/MM/YYYY')
  //   var today = new Date();
  //   let d = new Date(today);
  //   let month = (d.getMonth() + 1).toString().padStart(2, '0');
  //   let day = d.getDate().toString().padStart(2, '0');
  //   let year = d.getFullYear();
  //    let datae =  [year, month, day].join('/');
     
  //    if(datae == Added){
  //     return "Added today"
  //    }
  //    if(Added<datae){
  //     return Added
  //    }
  // }
  useEffect(() =>{
    myAnnouncementData()
    const user_role = localStorage.getItem("user_role")
    setUserRole(user_role)
  },[])
  useEffect(() =>{
    if(props.myLoadData?.length>0){
      console.log("MY LOAD MORE DATA")
      setmyAnnouncement(props.myLoadData)
    }
    else{
         
    }
  },[props.myLoadData])
  useEffect(()=>{
      if(props.myAnnouncementData) {
        setmyAnnouncement(props.myAnnouncementData)
    
      }
  },[props.myAnnouncementData])
  console.log("MY ANNOUNCEMENT DATA props",props.myAnnouncementData)


useEffect(() =>{
  setTimeout(() => {
    setTopErrorMessage(null);
  }, 3000)
},[topErrorMessage])

// {myAnnouncement &&  console.log("schedule time",myAnnouncement[0].scheduled_date)}
 return (
 
    <div className="announcement-accordion">
    {topErrorMessage && <p className="alert alert-danger" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topErrorMessage}</p>} 
   {topMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topMessage}</p>} 

    <Accordion defaultActiveKey="0">
      { myAnnouncement &&
       myAnnouncement.length !== 0 ? (
        myAnnouncement.map((data,index) => 
        (

          <Accordion.Item eventKey={index} key={index}>
          <Accordion.Header>
            <div className="head-title">
              <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
              <div className="title-xxs">{data.title}
              <small>
                <span>
              <span className="timesec">{getAddedTime(data.createdAt)}</span>

              {
                                         data.user.role.split('_')
                                         .map(
                                          (data) =>
                                           data.charAt(0).toUpperCase() + data.slice(1)
                                          ).join(' ')
                                      } : 
                                  
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
                            setTopErrorMessage("Cannot edit started announcement")

                          )
                          }
                      
                        >Edit</Dropdown.Item>                                          
                           
                      
                        <Dropdown.Item onClick={() =>deleteAnnouncement(data.id)}>Delete</Dropdown.Item>
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
              <Col md={4}>
                <div className="video-col">
                {data.announcement_files.map((detail,index) =>(
                  <>
                      {detail.fileType == ".mp4"||detail.fileType === ".mkv" && !detail.is_deleted  ? (
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
              {data?.announcement_files?.length>0 ? <>
                { data?.announcement_files[0]?.fileType === ".mp4" ||data?.announcement_files[0].fileType === ".mkv" ? 
                                  (
                                    null
                                  ):
                                  (
                                    <div className="head">Related Files :</div>
                                  )}
           
               
              </>
            :(
              null
            )

             }  
              {/* {data.announcement_files.length>0 ? ( <div className="head">Related Files :</div> ):(null)}                      */}
                <div className="cont">
                  <div className="related-files">
                  {data.announcement_files && data.announcement_files.map((detail,index) =>(
                      <>
                        {detail.fileType != ".mp4" && detail.fileType != ".mkv" && !detail.is_deleted ?(
                            <div className="item"><a href={detail.file}><img src="../img/abstract-ico.png" alt=""/> <span className="name">
                              <p>{getRelatedFileName(detail.file)}</p>
                             <small>{getAddedTime(detail.createdAt)}</small></span></a></div>
                              ):(null)} </>
                        ))}
                  </div>
                </div>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
        ))
       )
       :(
        <div className="text-center mb-5 mt-5"> {isLoading ? (<CircularProgress/>) :  <strong>No data found</strong> }</div>

       )
      }
   
    </Accordion>
  </div>
  )
}

export default MyAnnouncements