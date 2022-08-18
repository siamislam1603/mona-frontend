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


const handleLinkClick = notificationId => {
  console.log("event eventeventeventevent",  notificationId)

  if(notificationId){

    const token = localStorage.getItem('token');
    const response = axios.put(
      `${BASE_URL}/notification/${notificationId}`,{}, {
      headers: {
        "Authorization": "Bearer " + token
      }
    }
    );

    console.log('notification read status updated', response);



    if (response.status === 200) {  
      console.log('notification read status updated', response.msg);


    }else{

      console.log('TYPE OF COVER IMAGE:', response.msg);

    }


  }

  // let path = event.target.getAttribute('path');
  // setTabLinkPath(path);
}


// useEffect(() =>{
//     if(props.allAnnouncement){
//       setNotificationDetail(props.allAnnouncement)
//       console.log("THE Annoncement all props",props.allAnnouncement)
//     }
// },[props.allAnnouncement])

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
                  
                  <div className="notofication-listing-sec notificationpopup mb-5">
                    <div className="notifitem unread">
                      <div className="notifimg">
                        <a className="notilink" href="/wfc/Notifications">
                          <span className="gdot"></span>
                            <div className="notifpic">
                              <img src="https://wfc-development.s3.ap-south-1.amazonaws.com/documents/629449f083201e1dcc1407dd/f967f4bb-229e-4fe2-96c3-86dd9fdee960.jpeg" className="logo-circle rounded-circle"/>
                            </div>
                          <div className="notiftxt">Vipin Semwal asked a question for startup: iMumz. Click to see</div>
                        </a>
                      </div>
                      <div className="notification-time">21 hours ago</div>
                    </div>
                    <div className="notifitem unread">
                      <div className="notifimg">
                        <a className="notilink" href="/wfc/Notifications">
                          <span className="gdot"></span>
                            <div className="notifpic">
                              <img src="https://wfc-development.s3.ap-south-1.amazonaws.com/documents/629449f083201e1dcc1407dd/f967f4bb-229e-4fe2-96c3-86dd9fdee960.jpeg" className="logo-circle rounded-circle"/>
                            </div>
                          <div className="notiftxt">Vipin Semwal asked a question for startup: iMumz. Click to see</div>
                        </a>
                      </div>
                      <div className="notification-time">21 hours ago</div>
                    </div>
                    <div className="notifitem">
                      <div className="notifimg">
                        <a className="notilink" href="/wfc/Notifications">
                          <span className="gdot"></span>
                            <div className="notifpic">
                              <img src="https://wfc-development.s3.ap-south-1.amazonaws.com/documents/629449f083201e1dcc1407dd/f967f4bb-229e-4fe2-96c3-86dd9fdee960.jpeg" className="logo-circle rounded-circle"/>
                            </div>
                          <div className="notiftxt">Vipin Semwal asked a question for startup: iMumz. Click to see</div>
                        </a>
                      </div>
                      <div className="notification-time">21 hours ago</div>
                    </div>
                  </div>
                  
                  
                  
                    <Accordion defaultActiveKey="0">
                      { notificationDetails &&
                        notificationDetails.length !==0 ? (
                          notificationDetails.map((details,index) => (
                            <div key={index}>
                            
                           <Accordion.Item  eventKey={index}>
                               <div className="head-title">
                                 <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                                 <div className="title-xxs" onClick={()=> handleLinkClick(details.id)}
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