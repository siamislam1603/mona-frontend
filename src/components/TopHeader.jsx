import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Dropdown, Form, Button, Popover, OverlayTrigger, Image } from 'react-bootstrap';
import { BASE_URL } from './App';
import { Link } from "react-router-dom";
import $, { data } from "jquery";
import moment from "moment";
import CircularProgress from '@material-ui/core/CircularProgress';
import { logoutUser } from '../helpers/logout';
// import { FullLoader } from "./Loader";

let temp = () => { }
let Child = () => { }
const TopHeader = ({ setSelectedFranchisee = temp, setChild = Child, notificationType = 'none' }) => {
  const [franchiseeList, setFranchiseeList] = useState([]);
  const [childList, setChildList] = useState([]);

  const [franchiseeId, setFranchiseeId] = useState();
  const [childId, setChildId] = useState();

  const [permissionList, setPermissionList] = useState();
  const [notificationDialog, setNotificationDialog] = useState(true);
  const [notifType, setNotifType] = useState('none');
  const [notifData, setNotifData] = useState(null);
  const [topHeaderNotification, setTopHeaderNotification] = useState([]);
  const [topHeaderNotificationCount, setTopHeaderNotificationCount] = useState(null);
  const [topHeaderNotificationCountClass, setTopHeaderNotificationCountClass] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('none');
  const [searchResult, setSearchResult] = useState([]);
  const [searchAnnouncement, setSearchAnnouncement] = useState([]);
  const [searchFileRepository, setSearchFileRepository] = useState([]);
  const [searchFranchise, setSearchFranchise] = useState([]);
  const [searchOperatingMannual, setSearchOperatingMannual] = useState([]);
  const [searchTraining, setSearchTraining] = useState([]);
  const [searchUser, setSearchUser] = useState([]);
  const [searchLoaderFlag, setSearchLoaderFlag] = useState(false);
  const [userTyping,setuserTyping] = useState('')
  const [topHeaderNotificationMarkAllRead, setTopHeaderNotificationMarkAllRead] = useState(null);

  // const savePermissionInState = async () => {
  //   let menu_list = JSON.parse(localStorage.getItem('menu_list'));
  //   setPermissionList(menu_list.filter(permission => permission.controller.show_in_menu === true));
  // };

  const [userDashboardLink, setuserDashboardLink] = useState();

  let token = localStorage.getItem('token');


  const fetchChildList = async () => {
    let response = await axios.get(`${BASE_URL}/enrollment/parent/getChildrenByParentId`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.status === 200 && response.data.status === 'success') {
      let { children } = response.data;
   
      setChildList(children.map(d => ({
        id: d.id,
        name: d.fullname
      })));

      // let id = children.map(d => d.id);
      // // console.log('ID ARRAY:', id);
      // id = ['all', ...id].join(',');
      // // console.log('ID STRING:', id);
      // // console.log('REFORMED DATA:', data);
      // setChildList(prevState => ([
      //   { id: id, name: 'All' },
      //   ...prevState
      // ]));
    }
  };


  const fetchFranchiseeList = async () => {
    const response = await axios.get(`${BASE_URL}/role/franchisee`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    if (response.status === 200 && response.data.status === "success") {
      const { franchiseeList: franchiseeData } = response.data;

      let renderedData;
      renderedData = franchiseeData.map((data) => ({
        id: data.id,
        franchisee_name: `${data.franchisee_name}, ${data.city}`,
      }));
      setFranchiseeList(renderedData);
    }
  };


  const fetchNotificationList = async () => {
    let userID = localStorage.getItem('user_id');
    try {
      const response = await axios.get(`${BASE_URL}/notification/unread/${userID}`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      console.log("Notification",response)
      if (response.status === 200 && response.data.status === "success") {
        setTopHeaderNotification(response.data.notification.rows);
        setTopHeaderNotificationCount(response.data.notification.count);
        setTopHeaderNotificationCountClass(response.data.notification.count);
      }
    } catch (error) {
      if (error.response.status === 404) {
        // console.log("The code is 404")
        setTopHeaderNotification([])
      }
    }


  };

  // const handleLinkClick = notificationId => {

  //   if (notificationId) {
  //     const response = axios.put(
  //       `${BASE_URL}/notification/${notificationId}`, {}, {
  //       headers: {
  //         "Authorization": "Bearer " + token
  //       }
  //     }
  //     );

  //     if (response.status === 200) {
  //       console.log('notification read status updated', response.msg);
  //     } else {
  //       console.log('TYPE OF COVER IMAGE:', response.msg);

  //     }


  //   }

  //   // let path = event.target.getAttribute('path');
  //   // setTabLinkPath(path);
  // }


  const handleLinkClick = async (notificationId,link,type) => {
  
    if (notificationId, link) {
      console.log("THe link",link,type)
      const response = await axios.put(
        `${BASE_URL}/notification/${notificationId}`, {}, {
        headers: {
          "Authorization": "Bearer " + token
        }
      }
      );
      localStorage.setItem("notification_tab",type)

      console.log("response response",response)
      if (response.status === 200) {

        window.location.href = link;

        console.log('notification read status updated', response.msg);
      } else {
        console.log('TYPE OF COVER IMAGE:', response.msg);

      }


    }

    // let path = event.target.getAttribute('path');
    // setTabLinkPath(path);
  }

  function fetchData(str) {
      let link = str.split(/["]/)[1];
      let text = str.replace(/<\/?a[^>]*>/g, "");

      // let text = str.split(/[><]/)[2];
      // console.log("link link link",link)
      // console.log("text text text",text)
      return { link, text };
  }





  const handleMarkRearAll = async notificationId => {

    let userID = localStorage.getItem('user_id');

    const response = await axios.put(`${BASE_URL}/notification/unread/${userID}`, {}, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if (response.status == 200) {
      setTopHeaderNotificationCount(0);
      setTopHeaderNotificationMarkAllRead(1)
    } else {
      console.log('TYPE OF COVER IMAGE:', response.msg);
    }

  }




  const handelSearch = async (e) => {

    e.preventDefault();
    try {
      let searchKey = e.target.value;
      setuserTyping(searchKey)
      if (searchKey) {

        setSearchLoaderFlag(true)

       console.log("search key",searchKey)
        const response  = await axios.get(`${BASE_URL}/globalSearch/`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "search":`${searchKey}`
          }
        });
        console.log("Search result",response)
        
        if (response.status === 200 && response.data.status === "success") {
      
          setSearchResult(response.data.data[0])

          setSearchAnnouncement(response.data.data[0].announcement)
          setSearchFileRepository(response.data.data[0].fileRepository)
          setSearchFranchise(response.data.data[0].franchise)
          setSearchOperatingMannual(response.data.data[0].operatingMannual)
          setSearchTraining(response.data.data[0].training)
          setSearchUser(response.data.data[0].user)

          setSearchLoaderFlag(false)

        }

      }


    } catch (error) {
      if (error.response.status === 404) {
        // console.log("The code is 404")
        setTopHeaderNotification([])
      }
    }


  }





  // const fetchAndPopulateFranchiseeDetails = async () => {
  //   const response = await axios.get(
  //     `${BASE_URL}/role/franchisee/details/${localStorage.getItem('user_id')}`
  //   );
  //   if (response.status === 200) {
  //     const { franchisee } = response.data;
  //     setSelectedFranchisee(franchisee.franchisee_name ? franchisee.franchisee_name === "All" ? "" : franchisee.franchisee_name : "", franchisee.id);
  //     setFranchiseeList(
  //       [franchisee].map((data) => ({
  //         id: data.id,
  //         franchisee_name: `${data.franchisee_name}, ${data.city}`,
  //       }))
  //     );
  //   }
  // };



  const handleLogout = (event) => {
    logoutUser()
    window.location.href = '/';

    // logout();
  };

  const selectFranchisee = (e) => {
    if (e === 'All') {
      setFranchiseeId({ franchisee_name: 'All' });
      localStorage.setItem('selectedFranchise', 'all');
      setSelectedFranchisee(localStorage.getItem('selectedFranchise'));
      // setSelectedFranchisee('all');
    } else {
      setFranchiseeId({ ...franchiseeList?.filter(d => parseInt(d.id) === parseInt(e))[0] });
      localStorage.setItem('selectedFranchise', e);
      setSelectedFranchisee(localStorage.getItem('selectedFranchise'));
      // setSelectedFranchisee(e);
    }
  };

  const selectChild = (e) => {
    // console.log('SELECTED CHILD:', e);
    // if (e === 'All') {
    //   setChildId({ name: 'All' });
    //   setSelectedFranchisee('all');
    // } else {
    setChildId({ ...childList?.filter(d => parseInt(d.id) === parseInt(e))[0] });
    setSelectedFranchisee(e);
    // }
  }

  const popover = (
    <Popover id="popover-basic" className={`notificationpopup ${topHeaderNotificationMarkAllRead ?"marked-read" : ""} ${topHeaderNotificationCountClass ? "" : "no-notification"}`} >
      {/* id={topHeaderNotificationCount?"popover-basic":"popover-basic"} */}
      <Popover.Header as="h3">
        Your Unread Notifications{" "}
        <Link style={{ marginLeft: 10 }} to="/notifications">
          View All
        </Link>
      </Popover.Header>

      <Popover.Body>
        {topHeaderNotification &&
          topHeaderNotification.length !== 0 ? (
          topHeaderNotification.map((details, index) => (

            <div className={topHeaderNotificationCount ? "notifitem unread" : "notifitem"}>
              <div className="notifimg">
                <div className="notilink">
                  <div className="notifpic">
                    <img src="/img/notification-ico1.png" alt="" className="logo-circle rounded-circle" />

                  </div>
                  <div className="notiftxt">
                    {/* <div className="title-xxs" onClickCapture={() => handleLinkClick(details.id)}
                      dangerouslySetInnerHTML={{
                        __html: `${details.title}`,
                      }} /> */}

                      <div className='title-xxs'>
                        
                        <p onClick={() => handleLinkClick(details.id ,fetchData(details.title).link,details.notification_type)} style={{cursor:"pointer" }} >
                          {/* {fetchData(details.title).text} */}

                          <div dangerouslySetInnerHTML={{
                            __html: `${fetchData(details.title).text}`,
                          }} />

                        </p>
                      </div>

                  </div>
                </div>
              </div>
              <div className="notification-time">
              {
                moment(details.createdAt).fromNow()
              }
              </div>
            </div>

          ))
        ) : (
          <div className="text-center mb-5 mt-5"><strong>No Unread Notification Available</strong></div>
        )
        }

      </Popover.Body>
      {topHeaderNotificationCount?(
        <>
      <div className="totalmsg">
        You have {topHeaderNotificationCount ? topHeaderNotificationCount : 0} unread notifications
      </div>
      <div className="totalreadmsg" onClick={() => handleMarkRearAll()}>Mark All as Read</div>
      </>
      ):''
     
      }
    </Popover>
  );

  const fetchNotificationData = async () => {
    const response = await axios.get(`${BASE_URL}/notification/data/${notifType}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.status === 200 && response.data.status === "success") {
      let { data } = response.data
      let filteredData = data.map(d => ({
        id: d.id,
        title: d.title,
        created_for: d.created_for
      }));
      filteredData = filteredData.filter(d => parseInt(d.created_for) === parseInt(localStorage.getItem('user_id')));
      filteredData = filteredData.slice(0, 5);

      setNotifData(filteredData);
    }
  };
  // const handleSearch = () =>{
  //   console.log("HANDLE SEARCH")
  // }
  useEffect(() => {
    let ths = this;
    $(".topsearch").focus(function () {
      $(".tipsearch").hide();
      var i = 0;

      $(".topsearch").each(function () {
        if ($(this).is(":focus")) {
          $($(".tipsearch")[i]).show();
        }
        i++;
      });

      $(document).bind("focusin.tipsearch click.tipsearch", function (e) {
        if ($(e.target).closest(".tipsearch, .topsearch").length) return;
        $(document).unbind(".tipsearch");
        $(".tipsearch").fadeOut("medium");
      });
    });

    $(".search-col").on("click", function () {
      $(".search-bar").addClass("show");
    });
    $(".search-close").on("click", function () {
      $(".search-bar").removeClass("show");
    });
    $(".notofication-meg").on("click", function () {
      $(".notification-popup").toggleClass("show");
    });

    $(".tipsearch").hide();
  }, []);



  useEffect(() => {
    if(localStorage.getItem('selectedFranchise')) {
      if(localStorage.getItem('selectedFranchise') === 'all') {
        let selectedFID = localStorage.getItem('selectedFranchise');
        setSelectedFranchisee(selectedFID);
        setFranchiseeId({ franchisee_name: 'All' });
      } else {
        let selectedFID = localStorage.getItem('selectedFranchise');
        setSelectedFranchisee(selectedFID);
        setFranchiseeId(franchiseeList.filter(d => parseInt(d.id) === parseInt(selectedFID))[0]);
      }
    } else {
      if (localStorage.getItem('user_role') === 'franchisor_admin') {
        setSelectedFranchisee('All');
        setFranchiseeId({ franchisee_name: 'All' });
      } else {
        setSelectedFranchisee(franchiseeList[0]?.id);
      }
    }
  }, [franchiseeList, localStorage.getItem('selectedFranchise')]);

  // useEffect(() => {
    
  // }, [localStorage.getItem('selectedFranchise')]);

  useEffect(() => {
    // if (localStorage.getItem('user_role') === 'guardian') {
    // setSelectedFranchisee('All');
    // setChildId({ name: 'All' });
    // } else {
    setSelectedFranchisee(childList[0]?.id);
    // }
  }, [childList]);

  useEffect(() => {
    setNotifType(notificationType)
  }, [])

  useEffect(() => {
    // console.log('Fetching notificaiton data');
    fetchNotificationData();
  }, [notifType])

  useEffect(() => {

    if (localStorage.getItem('user_role') === 'guardian') {
      fetchChildList();
    } else {
      fetchFranchiseeList();
    }

    fetchNotificationList();

    var user_dashboar_link = '';
    if (localStorage.getItem('user_role') === 'coordinator')
      user_dashboar_link = '/coordinator-dashboard'
    else if (localStorage.getItem('user_role') === 'franchisor_admin')
      user_dashboar_link = '/franchisor-dashboard'
    else if (localStorage.getItem('user_role') === 'franchisee_admin')
      user_dashboar_link = '/franchisee-dashboard'
    else if (localStorage.getItem('user_role') === 'coodinator')
      user_dashboar_link = '/coordinator-dashboard'
    else if (localStorage.getItem('user_role') === 'educator')
      user_dashboar_link = '/educator-dashboard'
    else if (localStorage.getItem('user_role') === 'guardian')
      user_dashboar_link = '/parents-dashboard'

    setuserDashboardLink(user_dashboar_link);


  }, []);

  // useEffect(() => {
  //   savePermissionInState();
  // }, []);

  // console.log("local Storge ", localStorage.getItem('profile_photo'))

  // notifData && console.log('DATA=>:', notifData);
  // notifType && console.log('TYPE=>:', notifType);
  // console.log("training search data", searchTraining) 
  return (
    <>
      <div className="topheader" style={{ position: 'relative' }}>
        <div className="lpanel">
          {
            localStorage.getItem('user_role') === 'guardian'
              ? <div className="selectdropdown">
                <Dropdown onSelect={selectChild}>
                  <Dropdown.Toggle id="dropdown-basic">
                    {childId?.name ||
                      childList[0]?.name ||
                      'No Child Available'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {localStorage.getItem("user_role") === "franchisor_admin" ? <React.Fragment key="">
                      <Dropdown.Item eventKey="All">
                        <span className="loction-pic">
                          <img alt="" id="user-pic" src="/img/user.png" />
                        </span>
                        All
                      </Dropdown.Item>
                    </React.Fragment> : null}
                    {childList.map((data) => {
                      return (
                        <React.Fragment key={data.id}>
                          <Dropdown.Item eventKey={`${data.id}`}>
                            <span className="loction-pic">
                              <img alt="" id="user-pic" src="/img/user.png" />
                            </span>
                            {data.name}
                          </Dropdown.Item>
                        </React.Fragment>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              : <div className="selectdropdown dddddddddddddddddddd">
                <Dropdown onSelect={selectFranchisee}>

                  <Dropdown.Toggle id="dropdown-basic">

                    {/* { franchiseeId?.franchisee_name || franchiseeList[0]?.franchisee_name || JSON.parse(localStorage.getItem('selected_franchisee'))?.franchisee_name ||  */}
                    {franchiseeId?.franchisee_name || franchiseeList[0]?.franchisee_name || 'No Data Available'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {localStorage.getItem("user_role") === "franchisor_admin" ? <React.Fragment key="">
                      <Dropdown.Item eventKey="All">
                        <span className="loction-pic">
                          <img alt="" id="user-pic" src="/img/user.png" />
                        </span>
                        All
                      </Dropdown.Item>
                    </React.Fragment> : null}
                    {franchiseeList.map((data) => {
                      return (
                        <React.Fragment key={data.id}>
                          <Dropdown.Item eventKey={`${data.id}`}>
                            <span className="loction-pic">
                              <img alt="" id="user-pic" src="/img/user.png" />
                            </span>
                            {data.franchisee_name}
                          </Dropdown.Item>
                        </React.Fragment>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown >
              </div >
          }
        </div >

        <div className="rpanel ms-auto">
          <div className="search-bar">
            <Form action={`${window.location.origin}/SearchResult`}>
              <Form.Group className="form-group" controlId="formBasicSearch">
                <Form.Control
                  type="text"
                  className="topsearch"
                  placeholder="Type here to search..."
                  name="query"
                  autoComplete="off"
                  onChange={handelSearch}

                />
              { userTyping &&
                                <div className="tipsearch">
                                <div className="searchlisting cus-scr">
              
                                  {searchLoaderFlag == true ? (
                                    <div className="text-center">
                                      <CircularProgress />
                                    </div>
                                  ) : ''
                                  }
              
              
                                  <ul>
              
                                    {searchAnnouncement?.map((announceData) => (
                                      <li>
                                        <a href="/announcements" className="d-flex">
                                          {/* <img alt="" src={announceData?.coverImage?announceData.coverImage:'/img/notification-ico1.png'} className="logo-circle rounded-circle" /> */}
                                          <span className="sec-cont"><strong className="text-capitalize">{announceData?.title}</strong></span>
                                        </a>
                                      </li>
                                    ))}
              
              
                                    {searchTraining?.map((trainingData) => (
                                      <li>
                                        <a href={`/training-detail/${trainingData?.trainingId}`} className="d-flex">
                                          {/* <img alt="" src={trainingData?.coverImage?trainingData.coverImage:'/img/notification-ico1.png'} className="logo-circle rounded-circle" /> */}
                                          <span className="sec-cont"><strong className="text-capitalize">{trainingData?.training?.title}</strong></span>
                                        </a>
                                      </li>
                                    ))}
                                     {searchUser?.map((user) => (
                                      <li>
                                        <Link to={`/view-user/${user.id}`} className="d-flex">
                                          {/* <img alt="" src={trainingData?.coverImage?trainingData.coverImage:'/img/notification-ico1.png'} className="logo-circle rounded-circle" /> */}
                                          <span className="sec-cont"><strong className="text-capitalize">{user?.fullname}</strong></span>
                                        </Link>
                                      </li>
                                    ))}
              
              
                                    {searchOperatingMannual?.map((operatingData) => (
                                      <li>
                                        <a href={`/operatingmanual/?selected=${operatingData.id}`} className="d-flex">
                                          {/* <img alt="" src={operatingData?.cover_image?operatingData.cover_image:'/img/notification-ico1.png'} className="logo-circle rounded-circle" /> */}
                                          <span className="sec-cont"><strong className="text-capitalize">{operatingData?.operating_manual?.title}</strong></span>
                                        </a>
                                      </li>
                                    ))}
              
                                    {searchFranchise?.map((franchiseeData) => (
                                      <li>
                                        <a href={`/all-franchisees/`} className="d-flex">
                                          {/* <img alt="" src={operatingData?.cover_image?operatingData.cover_image:'/img/notification-ico1.png'} className="logo-circle rounded-circle" /> */}
                                          <span className="sec-cont"><strong className="text-capitalize">{franchiseeData?.franchisee_name}</strong></span>
                                        </a>
                                      </li>
                                    ))}
              
              
                                    {searchFileRepository?.map((fileRepoData) => (
                                      <li>
                                        <a href={`/file-repository-List/${fileRepoData?.repository?.repository_files[0]?.categoryId}`} className="d-flex">
                                          {/* <img alt="" src={operatingData?.cover_image?operatingData.cover_image:'/img/notification-ico1.png'} className="logo-circle rounded-circle" /> */}
                                          <span className="sec-cont"><strong className="text-capitalize">{fileRepoData?.repository?.title}</strong></span>
                                        </a>
                                      </li>
                                    ))}
              
              
              
              
              
                                  </ul>
                                </div>
                              </div>
              }
                <Link className="search-close" to="#">
                  <img alt="" src="/img/cross.png" />
                </Link>
              </Form.Group>
            </Form>
          </div>
          <div className="user-sec">
            <ul>
              <li>
                <span className="search-col cursor">

                  <img alt="" src="/img/search-icon.svg" />
                </span>
              </li>
              <li>
                <a href={userDashboardLink}>
                  <img alt="" src="/img/home-icon.svg" />
                </a>
              </li>
              <li>
                <OverlayTrigger rootClose={true} trigger="click" placement="bottom-end" overlay={popover}>
                  <div className="chat-meg cursor">
                    <img
                      alt=""
                      // onMouseEnter={() => setNotificationDialog(true)} 
                      // onMouseLeave={() => setNotificationDialog(false)} 
                      src="/img/notification-icon.svg" />
                    <span className="tag">{topHeaderNotificationCount ? topHeaderNotificationCount > 99 ? "99+" : topHeaderNotificationCount : 0}</span>
                  </div>
                </OverlayTrigger>
              </li>
              <li className="user-col">
                <Dropdown>
                  <Dropdown.Toggle id="dropdown-basic">
                    <span className="user-pic">
                      <img alt="" id="user-pic" src={localStorage.getItem('profile_photo') === 'null' ? '../img/upload.jpg' : localStorage.getItem('profile_photo')} />

                    </span>
                    <span className="user-name">
                      {localStorage.getItem('user_name')
                        ? localStorage
                          .getItem('user_name')
                          .split(' ')
                          .map(
                            (data) =>
                              data.charAt(0).toUpperCase() + data.slice(1)
                          )
                          .join(' ')
                        : ''}

                      <small>
                        {localStorage.getItem('user_role')
                          ? localStorage
                            .getItem('user_role')
                            .split('_')
                            .map(
                              (data) =>
                                data.charAt(0).toUpperCase() + data.slice(1)
                            )
                            .join(' ')
                          : ''}
                      </small>
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ zIndex: '2000' }}>
                    {/* {permissionList
                      ? permissionList.map((top_menu) => {
                        return (
                          <Dropdown.Item
                            key={top_menu.id}
                            href={top_menu.controller.menu_link}
                          >
                            {top_menu.controller.controller_label}
                          </Dropdown.Item>
                        );
                      })
                      : null} */}

                    {/* <Dropdown.Item href="#">All Franchisee</Dropdown.Item>
                      <Dropdown.Item href="#">All Users</Dropdown.Item>
                      <Dropdown.Item href="#">Forms</Dropdown.Item>
                      <Dropdown.Item href="#">Trainings</Dropdown.Item>
                      <Dropdown.Item href="#">File Repository</Dropdown.Item> */}

                    <Dropdown.Item href="/change-password">Change Password</Dropdown.Item>
                    <Dropdown.Item href={`/edit-user/${localStorage.getItem('user_id')}`}>My Profile</Dropdown.Item>
                    {/* <Dropdown.Item href="#">Settings</Dropdown.Item> */}
                    <Dropdown.Item href="#" onClick={handleLogout}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            </ul>
          </div>
        </div>
    </div>

      {/* {
        notificationDialog === true &&
        <div className="notification-dialog">
          <div className="notification-dialog-body">
            {
              notifData && notifData.map(d => {
                return (
                  <div className="notification">
                    {d.title.slice(0, 70) + '...'}
                  </div>
                )
              })
            }
          </div>
          <div className="notification-dialog-footer">
            <p className="notification-link">View More</p>
          </div>
        </div>
      } */}
    </>
  );
};
export default TopHeader;