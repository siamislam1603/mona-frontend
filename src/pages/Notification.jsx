import React, { useState,useEffect } from "react";
import { Button, Container, Form, Dropdown, Accordion, Row, Col } from "react-bootstrap";
import { BASE_URL } from "../components/App";
import axios from "axios";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import moment from "moment-timezone";
import { FullLoader } from "../components/Loader";

const PER_PAGE_LIMIT = 10;

const Noticefication = (props) => {

const userName = localStorage.getItem("user_name");
const [notificationDetail,setNotificationDetail] = useState([])
const [notificationStatus,setNotificationStatus] = useState(null)
const [totalLoadedNotifications,setTotalLoadedNotifications] = useState(0)
const [totalNotificationCount,setTotalNotificationCount] = useState(0)
const [fullLoaderStatus, setfullLoaderStatus] = useState(true);

// const [show, setShow] = useState(false);
// const handleClose = () => setShow(false);
 
  const getNotifications = async () =>{
    try {
      // console.log("Announcement detial API")
      const token = localStorage.getItem('token');
      let user_id = localStorage.getItem('user_id');
      const response = await axios.get(`${BASE_URL}/notification/${user_id}?offset=${totalLoadedNotifications}&limit=${PER_PAGE_LIMIT}`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      
      if(response.status === 200 && response.data.status === "success") {
      
        if(response.data && response.data.notification?.count == 0)
          setNotificationStatus('No Notification Available')

          console.log("notificationDetail.length", response.data.notification.rows.length)
        const totalNewNotification = response.data.notification.rows;
        if(totalNewNotification && totalNewNotification?.length){
          setTotalLoadedNotifications(totalLoadedNotifications + totalNewNotification.length)
        }
          setTotalNotificationCount(response.data.notification.count);

        // console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnn", response.data.notification.count)
        setfullLoaderStatus(false)
        setNotificationDetail(response.data.notification.rows);
      }
    } catch (error) {

      setfullLoaderStatus(false)
      setNotificationStatus('No data found')
      setNotificationDetail([])



        if(error.response.status === 404){
          // console.log("The code is 404")

        }
    }
  
}

useEffect(() => {
  getNotifications()
}, [])


const handelLoadMore = (e) => {
  e.preventDefault()
  LoadMoreALl()
}
const LoadMoreALl = async (e) => {
  const token = localStorage.getItem('token');
  let user_id = localStorage.getItem('user_id');
  const response = await axios.get(`${BASE_URL}/notification/${user_id}?offset=${totalLoadedNotifications}&limit=${PER_PAGE_LIMIT}`, {
    headers: {
      "Authorization": "Bearer " + token
    }
  });
  
  if(response.status === 200 && response.data.status === "success") {
  
      console.log("notificationDetail.length", response.data.notification.rows.length)

    const totalNewNotification = response.data.notification.rows;
    if(totalNewNotification && totalNewNotification?.length){
      
      setTotalLoadedNotifications(totalLoadedNotifications + totalNewNotification.length)
    }

    setNotificationDetail((prev) => (
      [
        ...prev,
        ...totalNewNotification
      ]
    ))

  }
}


const handleLinkClick = notificationId => {

  if(notificationId){
    const token = localStorage.getItem('token');
    const response = axios.put(
      `${BASE_URL}/notification/${notificationId}`,{}, {
      headers: {
        "Authorization": "Bearer " + token
      }
    }
    );

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

                  {/* <FullLoader loading={fullLoaderStatus} /> */}

              <div className="entry-container">
                  <header className="title-head">
                    <h1 className="title-lg">Notifications</h1>
                  </header>
                  
                  <div className="notofication-listing-sec notificationpopup mb-5">

                  { notificationDetail && notificationDetail.length !==0 ? (
                    notificationDetail.map((details,index) => (
                            
                    <div className={details.is_read == 'true' ?'notifitem':'notifitem unread'}>
                      <div className="notifimg">
                        <a className="notilink" href="javascript:void(0)">
                            <div className="notifpic">
                              
                            <img src="/img/notification-ico1.png" alt="" className="logo-circle rounded-circle"/>
                            </div>
                          <div className="notiftxt">
                          <div className="title-xxs" onClick={()=> handleLinkClick(details.id)}
                          dangerouslySetInnerHTML={{
                                    __html: `${details.title}`,
                                  }}/>
                          </div>
                      </a>
                    </div>
                    <div className="notification-time">
                      { moment(details.createdAt).tz('Australia/Sydney').fromNow()}
                      </div>
                  </div>
                ))
                ): (
                  <div className="text-center mb-5 mt-5"><strong>{notificationStatus}</strong></div>
                )
              }
             
              {
                totalLoadedNotifications < totalNotificationCount? (
                  <>
                  <br></br>
                  <div class="text-center">
                  <button type="button" onClick={handelLoadMore} className="btn btn-primary">Load More</button>
                  </div>
                  </>
                  ) :''
              }


            </div>

            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Noticefication