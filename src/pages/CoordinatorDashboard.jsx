
import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Form, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link } from 'react-router-dom';
import BootstrapTable from "react-bootstrap-table-next";
import axios from 'axios';
import { BASE_URL } from '../components/App';
import moment from 'moment';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
const products = [
  {
    id: 1,
    name: "../img/user.png, James Smith",
    educator: "../img/user.png, James Smith",
  },
  {
    id: 2,
    name: "../img/user.png, James Smith",
    educator: "../img/user.png, James Smith",
  },
  {
    id: 3,
    name: "../img/user.png, James Smith",
    educator: "../img/user.png, James Smith",
  },
  {
    id: 4,
    name: "../img/user.png, James Smith",
    educator: "../img/user.png, James Smith",
  },
];
const columns = [
  {
    dataField: 'name',
    text: 'Child Name',
    formatter: (cell) => {
      cell = cell.split(",");
      return (<><div className="user-list"><span className="user-pic"><img src="../img/upload.jpg" alt='' /></span><span className="user-name">{cell[0]} </span></div></>)
    },
  },
  {
    dataField: 'educatorname',
    text: 'Educator Name',
    formatter: (cell) => {
      console.log("THE ECUTOR", cell)
      cell = cell.split(",");
      return (<>
        <div className="user-list">
          <span className="user-pic">

            {cell[2] === "null" ? (<><img src="../img/upload.jpg" alt="" /></>) : (<><img src={cell[2]} alt="" /></>)}

          </span>
          <span className="user-name">
            {cell[0]}
          </span>
        </div> <br />
        {
          cell[1] === "undefined" || cell[1] === "null" ? (
            <>

            </>
          ) : (
            <>
              <div className="user-list">
                <span className="user-pic">

                  {/* <img src={cell[3]} alt='' /> */}
                  {cell[3] === "null" ? (<><img src="../img/upload.jpg" alt="" /></>) : (<><img src={cell[3]} alt="" /></>)}

                </span>
                <span className="user-name">
                  {cell[1] === " " || cell[1] === "undefined" ? (null) : (cell[1])}

                </span>
              </div>
            </>
          )
        }

        {/* {
          cell[1]? (
            
          )
          :(
           <></>
          )
        } */}
      </>)
    },
  },
  {
    dataField: "action",
    text: "",
    formatter: (cell) => {
      return (<><div className="cta-col">
        <Dropdown>
          <Dropdown.Toggle variant="transparent" id="ctacol">
            <img src="../img/dot-ico.svg" alt="" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="/children-all">View</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div></>)
    },
  }
];

const CoordinatorDashboard = () => {
  const [count, setcount] = React.useState({
    educatorsLoggedIn: 0,
    overdueForms: 0,
    overdueTrainings: 0,
    newEnrollments: 0,
  });

  const [user, setUser] = useState([]);
  const [userData, setUserData] = useState([]);
  const [latest_announcement, setlatest_announcement] = React.useState([{}]);
  const [topSuccessMessage, setTopSuccessMessage] = useState(null)

  const announcement = () => {
    let token = localStorage.getItem('token');
    const countUrl = `${BASE_URL}/dashboard/franchisor/latest-announcement`;

    axios.get(countUrl, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then((response) => {
      setlatest_announcement(response.data.recentAnnouncement);
      console.log(response.data)
    }).catch((e) => {
      setlatest_announcement([])
      console.log("Error", e);

    })
  }
  const getAddedTime = (str) => {
    const Added = moment(str).format('DD/MM/YYYY')
    var today = new Date();
    let d = new Date(today);
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    let year = d.getFullYear();
    let datae = [day, month, year].join('/');
    //  const date1 = new Date(datae);
    //  const date2 = new Date(str);
    // console.log("THE Date1", Added, datae)
    if (datae === Added) {
      return "Added today"
    }
    else if (Added < datae) {
      return Added
    }
    else {
      return Added
    }
    // return Added

  }
  const Additional_Needs = async () => {
    var myHeaders = new Headers();
    myHeaders.append(
      'authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };

    let response = await fetch(`${BASE_URL}/dashboard/coordinator/children-enrolled`, requestOptions)
    response = await response.json();

    if (response.status === "pass") {
      console.log(" data repsonse", response)

      let data = response.childrenEnrolled;
      let tempData = data.map((dt) => ({
        name: `${dt.fullname}`,
        educatorname: `${dt?.users[0]?.fullname},${dt?.users[1]?.fullname},${dt?.users[0]?.profile_photo},${dt?.users[1]?.profile_photo}`,
      }))
      console.log("THE TEMPDATA", tempData)
      setUserData(tempData);
    }

  }
  const [onboarding, setonboarding] = useState(
    {
      newEducators: 0,
      newParents: 0,
      newForms: 0,
      newFiles: 0,
    }
  );

  const newonboarding = async () => {
    var myHeaders = new Headers();
    myHeaders.append(
      'authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };

    let response = await fetch(`${BASE_URL}/dashboard/coordinator/new-onboarding`, requestOptions)
    response = await response.json();
    setonboarding(response)
  }

  useEffect(() => {
    newonboarding();
    Additional_Needs()
  }, [])
  const count_Api = () => {
    const countUrl = `${BASE_URL}/dashboard/coordinator/onboarding-count`;
    let token = localStorage.getItem('token');

    axios.get(countUrl, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then((response) => {


      setcount(response.data);
    }).catch((e) => {
      console.log(e);
    })
  }

  console.log(count)


  useEffect(() => {
    if (localStorage.getItem('success_msg')) {
      setTopSuccessMessage(localStorage.getItem('success_msg'));

      localStorage.removeItem('success_msg');
      setTimeout(() => {
        setTopSuccessMessage(null);
      }, 3000);
    }

    // Redirect to baseurl when not not specific Role
    if (localStorage.getItem('user_role')!=='coordinator') {
      window.location.href = '/';
    }


  }, []);


  React.useEffect(() => {
    count_Api();
    announcement()
  }, []);
  console.log("USERDATA", userData)
  return (
    <>
      {
        topSuccessMessage && <p className="alert alert-danger" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topSuccessMessage}</p>
      }
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
                <TopHeader />
                <div className="entry-container">
                  <Row>
                    <Col md={7}>
                      <div className="maincolumn">
                        <div className="access-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h1 className="title-sm mb-0"><strong>Quick Access Links</strong></h1>
                          </header>
                          <div className="column-list access-list three-col">
                            <div className="item">
                              <a href="https://app.storypark.com/users/sign_in?_ga=2.96275036.1184893872.1661406994-2035467191.1661406993" className="flex">
                                <div className="pic"><img src="../img/story-ico.png" alt="" /></div>
                                <div className="name">Story park</div>
                              </a>
                            </div>
                            <div className="item">
                              <a href="https://sp8.harmonykids.com.au/UserAccount/Login" className="flex">
                                <div className="pic"><img src="../img/harmony-ico.png" alt="" /></div>
                                <div className="name">Harmony</div>
                              </a>
                            </div>
                            <div className="item">
                              <a href="https://app.engagebay.com/login" className="flex">
                                <div className="pic"><img src="../img/engagebay-ico.png" alt="" /></div>
                                <div className="name">Engagebay</div>
                              </a>
                            </div>
                            <div className="item">
                              <a href="https://login.xero.com/identity/user/login" className="flex">
                                <div className="pic"><img src="../img/xero-ico.png" alt="" /></div>
                                <div className="name">Xero</div>
                              </a>
                            </div>
                            <div className="item nolink">
                              <div className="flex">
                                <div className="pic"><img src="../img/bitool-ico.png" alt="" /></div>
                                <div className="name">BI Tool</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="Onboarding-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Onboarding</strong></h4>
                          </header>
                          <div className="activitylist relative two-col">
                            {onboarding?.newEducators === 0 ? (<></>) : (
                              <>
                                <div className="item">
                                  <a className="item" href="/user-management/Educator">
                                    <span className="name">New Educator Enrolled</span>
                                    <span className="separator">|</span>
                                    <span className="num">{onboarding?.newEducators}</span>
                                  </a>
                                </div>
                              </>
                            )}

                            <div className="item">
                              <a href="/user-management/Guardian" className="item">
                                <span className="name">New Parents Enroled</span>
                                <span className="separator">|</span>
                                <span className="num">{onboarding?.newParents}</span>
                              </a>
                            </div>
                            <div className="item">
                              <a className="item" href="/form/response">
                                <span className="name">New Forms Submitted</span>
                                <span className="separator">|</span>
                                <span className="num">{onboarding?.newForms}</span>
                              </a>
                            </div>
                            <div className="item">
                              <a className="item" href="/file-repository">
                                <span className="name"> New Files</span>
                                <span className="separator">|</span>
                                <span className="num">{onboarding?.newFiles}</span>
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="children-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Children Wtih Additional Needs</strong></h4>
                            <Link to="/children-all" className="viewall">View All</Link>
                          </header>
                          <div className="column-table user-management-sec">
                            {userData.length > 0 ? (<>
                              <ToolkitProvider
                                keyField="name"
                                data={userData}
                                columns={columns}
                                search
                              >
                                {(props) => (
                                  <BootstrapTable
                                    {...props.baseProps}
                                  // pagination={paginationFactory()}
                                  />
                                )}
                              </ToolkitProvider>
                            </>) : (<>
                              <div className="text-center mb-5 mt-5"><strong>No children with additional needs</strong></div>
                            </>)}
                          </div>
                        </div>

                      </div>
                    </Col>
                    <Col md={5}>
                      <aside className="rightcolumn">
                        <div className="activity-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Activity</strong></h4>
                          </header>
                          <div className="activity-list relative">
                            <div className="listing">
                              <a href="/user-management/Educator" className="item">
                                <span className="name">Educators logged in</span>
                                <span className="separator">|</span>
                                <span className="num">{count?.educatorsLoggedIn}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a className="item" href="/form/response">
                                <span className="name">Overdue Forms</span>
                                <span className="separator">|</span>
                                <span className="num">{count?.overdueForms}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a className="item" href="/training">
                                <span className="name">Overdue Training</span>
                                <span className="separator">|</span>
                                <span className="num">{count?.overdueTrainings}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a className="item" href="/children-all" >
                                <span className="name">New Enrolments</span>
                                <span className="separator">|</span>
                                <span className="num">{count?.newEnrollments}</span>
                              </a>
                            </div>
                            <div className="kidsart">
                              <img src="../img/kid-art.svg" alt="" />
                            </div>
                          </div>
                        </div>
                        <div className="announcements-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Announcements</strong></h4>
                            <Link to="/announcements" className="viewall">View All</Link>
                          </header>
                          <div className="column-list announcements-list">
                            {
                              latest_announcement?.length > 0 ?
                                (
                                  latest_announcement?.map((data) => {
                                    return (
                                      <div className="listing">
                                        <a href="/announcements" className="item">
                                          <div className="pic"><img src="../img/announcement-ico.png" alt="" /></div>
                                          <div className="name">{data?.title}
                                            <div>
                                              <span className="timesec">{getAddedTime(data?.createdAt)}</span>
                                            </div>

                                          </div>
                                        </a>
                                      </div>
                                    );
                                  })
                                )
                                :
                                (
                                  <div className="text-center mb-5 mt-5"><strong>No Announcements</strong></div>
                                )
                            }
                        
                          </div>
                        </div>
 
                      </aside>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default CoordinatorDashboard;