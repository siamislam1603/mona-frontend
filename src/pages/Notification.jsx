import React, { useState,useEffect } from "react";
import { Button, Container, Form, Dropdown, Accordion, Row, Col } from "react-bootstrap";
import { BASE_URL } from "../components/App";
import axios from "axios";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";


const Noticefication = (props) => {

const userName = localStorage.getItem("user_name");
const [notificationDetails,setNotificationDetail] = useState([])
// const [show, setShow] = useState(false);
// const handleClose = () => setShow(false);
 
  const AllAnnouncementData = async () =>{
    try {
      // console.log("Announcement detial API")
      const token = localStorage.getItem('token');
      let id = localStorage.getItem('user_id');
      const response = await axios.get(`${BASE_URL}/notification/${id}`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      // console.log("The All Announcement",response.data.result);
      console.log(response);
      
      if(response.status === 200 && response.data.status === "success") {
          setNotificationDetail(response.data.notification);
      }
    } catch (error) {
        if(error.response.status === 404){
          // console.log("The code is 404")
          setNotificationDetail([])
        }

    }
  
}

useEffect(() => {
  AllAnnouncementData()
}, [])

useEffect(() =>{
    if(props.allAnnouncement){
      setNotificationDetail(props.allAnnouncement)
      console.log("THE Annoncement all props",props.allAnnouncement)
    }
},[props.allAnnouncement])
// notificationDetails && console.log('NOTIFICATION DETAILS:', notificationDetails);

  return (
    <div className="announcement-accordion">

<Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
              <LeftNavbar />
              </aside>
              <div className="sec-column">
                <TopHeader 
                  notificationType='Child Enrollment'/>

              <div className="entry-container">
                  <header className="title-head">
                    <h1 className="title-lg">Notifications</h1>
                    </header>
                    <Accordion defaultActiveKey="0">
                      { notificationDetails &&
                        notificationDetails.length !==0 ? (
                          notificationDetails.map((details,index) => (
                            <div key={index}>
                            
                           <Accordion.Item  eventKey={index}>
                               <div className="head-title">
                                 <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                                 <div className="title-xxs"
                                 dangerouslySetInnerHTML={{
                          __html: `${details.title}`,
                        }}/>
                               </div>
                           </Accordion.Item>
                           
                            </div> 
                           
                           ))
                        ): (
                          <div className="text-center mb-5 mt-5"><strong>No data found</strong></div>
                        )
                      }
                    </Accordion>
                    </div>
                    </div>
                    </div>
                    </Container>
                  </div>
  )
}

export default Noticefication