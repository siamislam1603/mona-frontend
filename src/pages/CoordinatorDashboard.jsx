
import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Form, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link } from 'react-router-dom';
import BootstrapTable from "react-bootstrap-table-next";
import axios from 'axios';
import { BASE_URL } from '../components/App';
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
            {console.log(cell[2], "cell[2].length")}
            {cell[2] === "null" ? (<><img src="../img/upload.jpg" alt="" /></>) : (<><img src={cell[2]} alt="" /></>)}
            {/* <img src={cell[2] ? (
              cell[2]
            ) : (
              "../img/upload.jpg"
            )} alt='' /> */}
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
            <Dropdown.Item href="/form/response">View</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div></>)
    },
  }
];

const CoordinatorDashboard = () => {
  const [count, setcount] = React.useState();
  const [user, setUser] = useState([]);
  const [userData, setUserData] = useState([]);

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
    // setUser(response)
    // console.log("The data",response)

    // const users = response.childrenEnrolled[0].users;
    if (response.status === "pass") {
      console.log(" data repsonse", response)

      let data = response.childrenEnrolled;
      let tempData = data.map((dt) => ({
        name: `${dt.fullname}`,
        educatorname: `${dt?.users[0]?.fullname},${dt?.users[1]?.fullname},${dt?.users[0]?.profile_photo},${dt?.users[1]?.profile_photo}`,

        // educatorname: `${dt.users[0].fullname}`,

        // formname: `${dt.form_name}, ${dt.audited_on}`,
        // educatorname: `${dt.user.profile_photo},${dt.user.fullname},${dt.user.franchisee.franchisee_name} `
        // console.log("THe dt",)
        // let data =  

      }))
      console.log("THE TEMPDATA", tempData)
      setUserData(tempData);
    }
    // console.log(users, ">>>>>>>>>");
    // let data = response.data.data.formData;
    // let tempData = users.map((dt) => ({
    // name: `${dt.fullname}`,
    //   // educatorname : `${dt.users.profile_photo}, ${dt.users.fullname}`
    //   // createdAt: dt.createdAt,
    //   // creatorName: dt.creatorName + "," + dt.creatorRole,
    //   // Shaired: dt.repository.repository_shares.length,
    //   // categoryId: dt.categoryId
    // }));

    // console.log('tempData', tempData)
    // setUserData(tempData);
  }
  const [onboarding, setonboarding] = useState([]);

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
  React.useEffect(() => {
    count_Api();
  }, []);
  console.log("USERDATA", userData)
  if (!count) return null;
  return (
    <>
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
                              <div" className="flex">
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
                            {onboarding.newEducators === 0 ? (<></>) : (<><div className="item">
                              <a className="item" style={{ cursor: "not-allowed" }}>
                                <span className="name">New Educator Enrolled</span>
                                <span className="separator">|</span>
                                <span className="num">{onboarding.newEducators}</span>
                              </a>
                            </div></>)}

                            <div className="item">
                              <a href="/user-management/Guardian" className="item">
                                <span className="name">New Parents Enrolled</span>
                                <span className="separator">|</span>
                                <span className="num">{onboarding.newParents}</span>
                              </a>
                            </div>
                            <div className="item">
                              <a className="item" href="/form/response">
                                <span className="name">New Forms Submitted</span>
                                <span className="separator">|</span>
                                <span className="num">{onboarding.newForms}</span>
                              </a>
                            </div>
                            <div className="item">
                              <a className="item" href="/file-repository">
                                <span className="name"> New Files</span>
                                <span className="separator">|</span>
                                <span className="num">{onboarding.newFiles}</span>
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="children-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Children Wtih Additional Needs</strong></h4>
                            <Link to="/user-management/Guardian" className="viewall">View All</Link>
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
                              <div className="text-center mb-5 mt-5"><strong>No children enrolled yet !</strong></div>
                            </>)}
                          </div>
                        </div>
                        {/*<div className="files-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h2 className="title-sm mb-0"><strong>Forms</strong></h2>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <div className="column-list files-list two-col">
                            <div className="item">
                              <div className="pic"><img src="../img/folder-ico.png" alt=""/></div>
                              <div className="name">Perfromance Evaluation <span className="time">Created on: 01/22/2022</span></div>
                              <div className="cta-col">
                                <Dropdown>
                                  <Dropdown.Toggle variant="transparent" id="ctacol">
                                    <img src="../img/dot-ico.svg" alt=""/>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><img src="../img/folder-ico.png" alt=""/></div>
                              <div className="name">Perfromance Evaluation <span className="time">Created on: 01/22/2022</span></div>
                              <div className="cta-col">
                                <Dropdown>
                                  <Dropdown.Toggle variant="transparent" id="ctacol">
                                    <img src="../img/dot-ico.svg" alt=""/>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><img src="../img/folder-ico.png" alt=""/></div>
                              <div className="name">Perfromance Evaluation <span className="time">Created on: 01/22/2022</span></div>
                              <div className="cta-col">
                                <Dropdown>
                                  <Dropdown.Toggle variant="transparent" id="ctacol">
                                    <img src="../img/dot-ico.svg" alt=""/>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><img src="../img/folder-ico.png" alt=""/></div>
                              <div className="name">Perfromance Evaluation <span className="time">Created on: 01/22/2022</span></div>
                              <div className="cta-col">
                                <Dropdown>
                                  <Dropdown.Toggle variant="transparent" id="ctacol">
                                    <img src="../img/dot-ico.svg" alt=""/>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="Policies-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h3 className="title-sm mb-0"><strong>Policies</strong></h3>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <div className="column-list policies-list">
                            <div className="item">
                              <div className="pic"><img src="../img/policies-ico.png" alt=""/></div>
                              <div className="name">Title goes here <span className="time">Udpated on: 12 April, 2022</span></div>
                              <div className="content">
                                <p>Privacy Policy is meant to help you understand what information we collect, why we collect it, and how you can update, manage, export, and delete your account.</p>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><img src="../img/policies-ico.png" alt=""/></div>
                              <div className="name">Title goes here <span className="time">Udpated on: 12 April, 2022</span></div>
                              <div className="content">
                                <p>Privacy Policy is meant to help you understand what information we collect, why we collect it, and how you can update, manage, export, and delete your account.</p>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><img src="../img/policies-ico.png" alt=""/></div>
                              <div className="name">Title goes here <span className="time">Udpated on: 12 April, 2022</span></div>
                              <div className="content">
                                <p>Privacy Policy is meant to help you understand what information we collect, why we collect it, and how you can update, manage, export, and delete your account.</p>
                              </div>
                            </div>
                          </div>
                        </div>*/}
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
                                <span className="num">{count.educatorsLoggedIn}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a className="item" href="/form/response">
                                <span className="name">Overdue Forms</span>
                                <span className="separator">|</span>
                                <span className="num">{count.overdueForms}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a className="item" href="/training">
                                <span className="name">Overdue Trainings</span>
                                <span className="separator">|</span>
                                <span className="num">{count.overdueTrainings}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a className="item" href="/user-management/Guardian" >
                                <span className="name">New Enrollments</span>
                                <span className="separator">|</span>
                                <span className="num">{count.newEnrollments}</span>
                              </a>
                            </div>
                            <div className="kidsart">
                              <img src="../img/kid-art.svg" alt="" />
                            </div>
                          </div>
                        </div>
                        {/*<div className="files-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Files</strong></h4>
                          </header>
                          <div className="column-list files-list">
                            <div className="item">
                              <div className="pic"><img src="../img/book-ico.png" alt=""/></div>
                              <div className="name">Getting and staying organized <span className="time">3 Hours</span></div>
                              <div className="cta-col">
                                <Dropdown>
                                  <Dropdown.Toggle variant="transparent" id="ctacol">
                                    <img src="../img/dot-ico.svg" alt=""/>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><img src="../img/audio-ico.png" alt=""/></div>
                              <div className="name">Getting and staying organized <span className="time">3 Hours</span></div>
                              <div className="cta-col">
                                <Dropdown>
                                  <Dropdown.Toggle variant="transparent" id="ctacol">
                                    <img src="../img/dot-ico.svg" alt=""/>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><img src="../img/sound-ico.png" alt=""/></div>
                              <div className="name">Getting and staying organized <span className="time">3 Hours</span></div>
                              <div className="cta-col">
                                <Dropdown>
                                  <Dropdown.Toggle variant="transparent" id="ctacol">
                                    <img src="../img/dot-ico.svg" alt=""/>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><img src="../img/book-ico.png" alt=""/></div>
                              <div className="name">Getting and staying organized <span className="time">3 Hours</span></div>
                              <div className="cta-col">
                                <Dropdown>
                                  <Dropdown.Toggle variant="transparent" id="ctacol">
                                    <img src="../img/dot-ico.svg" alt=""/>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><img src="../img/book-ico.png" alt=""/></div>
                              <div className="name">Getting and staying organized <span className="time">3 Hours</span></div>
                              <div className="cta-col">
                                <Dropdown>
                                  <Dropdown.Toggle variant="transparent" id="ctacol">
                                    <img src="../img/dot-ico.svg" alt=""/>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <div className="kidsart">
                              <img src="../img/kid-art.svg" alt=""/>
                            </div>
                          </div>
                        </div>*/}
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