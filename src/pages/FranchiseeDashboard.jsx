import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Form, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link } from 'react-router-dom';
import BootstrapTable from "react-bootstrap-table-next";
import axios from 'axios';
import { BASE_URL } from '../components/App';
import moment from 'moment'
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';

const selectRow = {
  mode: 'checkbox',
  clickToSelect: true,
};
// name: `${dt.fullname}, ${dt.profile_photo}`,
const columns = [
  {
    dataField: 'name',
    text: 'Child Name',
    formatter: (cell) => {
      return (<>
        <div className="user-list">
          <span className="user-pic">
            <img src="../img/audit-form.png" alt="" />
          </span><span className="user-name">
            {cell}
          </span>
        </div></>)
    },
  },
  {
    dataField: 'educatatoName',
    text: 'Educator Name',
    formatter: (cell) => {
      cell = cell.split(",");
      return (<>
        {
          cell[0] != "undefined" &&
          <div className="user-list">
            <span className="user-pic">
              <img src={cell[1]} />
            </span>
            <span className="user-name">
              {cell[0]}
            </span>
          </div>
        }
        {
          cell[2] != "undefined" &&
          <div className="user-list">
            <span className="user-pic">
              <img src={cell[3]} />
            </span>
            <span className="user-name">
              {cell[2]}
            </span>
          </div>
        }
      </>)
    },
  },
  {
    dataField: "action",
    text: "",
    formatter: (cell) => {
      cell = cell?.split(",");

      return (<><div className="cta-col">
        <Dropdown>
          <Dropdown.Toggle variant="transparent" id="ctacol">
            <img src="../img/dot-ico.svg" alt="" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href={`/child-enrollment-init/edit/${cell[0]}/${cell[1]}`}>View</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div></>)
    },
  }
];

const columns1 = [
  {
    dataField: 'name',
    text: 'Child Name',
    formatter: (cell) => {
      return (<>
        <div className="user-list">
          <span className="user-pic">
            <img src="../img/audit-form.png" alt="" />
          </span><span className="user-name">
            {cell}
          </span>
        </div></>)
    },
  },
  {
    dataField: 'educatatoName',
    text: 'Educator Name',
    formatter: (cell) => {
      cell = cell.split(",");
      return (<>
        {
          cell[0] != "undefined" &&
          <div className="user-list">
            <span className="user-pic">
              <img src={cell[1]} />
            </span>
            <span className="user-name">
              {cell[0]}
            </span>
          </div>
        }
        {
          cell[2] != "undefined" &&
          <div className="user-list">
            <span className="user-pic">
              <img src={cell[3]} />
            </span>
            <span className="user-name">
              {cell[2]}
            </span>
          </div>
        }
      </>)
    },
  },
  {
    dataField: "action",
    text: "",
    formatter: (cell) => {
      cell = cell?.split(",");

      return (<><div className="cta-col">
        <Dropdown>
          <Dropdown.Toggle variant="transparent" id="ctacol">
            <img src="../img/dot-ico.svg" alt="" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href={`/child-enrollment-init/edit/${cell[0]}/${cell[1]}`}>View</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div></>)
    },
  }
];

const FranchiseeDashboard = () => {
  const [countUser, setcountUser] = React.useState(null);
  const [latest_announcement, setlatest_announcement] = React.useState([{}]);
  const [enrollments, setEnrollments] = useState([])
  const [topSuccessMessage, setTopSuccessMessage] = useState(null)


  const announcement = () => {
    let token = localStorage.getItem('token');
    const countUrl = `${BASE_URL}/dashboard/franchisor/latest-announcement`;
    axios.get(countUrl, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then((response) => {
      setlatest_announcement(response?.data?.recentAnnouncement);
    }).catch((e) => {
      setlatest_announcement([])
    })
  }

  const [userData, setUserData] = useState([]);

  const FormData = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/dashboard/franchisee/children-with-additional-needs`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    })

    if (response.status === 200) {
      let data = response.data.childrenEnrolled;

      const tempData = data.map((dt, index) => (
        {
          name: `${dt.fullname}`,
          educatatoName: dt.users[0]?.fullname + "," + dt.users[0]?.profile_photo + "," + dt.users[1]?.fullname + "," + dt.users[1]?.profile_photo,
          action: `${dt.id},${dt.parents[0].id}`
        }
      ))
      console.log("tempData", tempData)
      setUserData(tempData);
    }
  }


  const Enrollments = async () => {
    const token = localStorage.getItem('token');
    let response = await axios.get(`${BASE_URL}/dashboard/franchisee/new-enrollments`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    })
    if (response.status === 200 || "pass") {

      let data = response.data.newEnrollments;
      const tempData = data.map((dt, index) => (
        {
          name: `${dt.fullname}`,
          educatatoName: dt.users[0]?.fullname + "," + dt.users[0]?.profile_photo + "," + dt.users[1]?.fullname + "," + dt.users[1]?.profile_photo,
          action: `${dt.id},${dt.parents[0].id}`
        }
      ))

      setEnrollments(tempData);
    }
  }


  const count_User_Api = () => {
    let token = localStorage.getItem('token');
    const countUrl = `${BASE_URL}/dashboard/franchisee/activity-count`;
    axios.get(countUrl, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then((response) => {
      setcountUser(response.data);
    }).catch((e) => {
      console.log("Error", e);
    })
  }

  React.useEffect(() => {
    count_User_Api();
    announcement();
    FormData();
  }, []);




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



  React.useEffect(() => {
    announcement();
    // count_Api();
    Enrollments();
  }, []);





  useEffect(() => {

    if (localStorage.getItem('success_msg')) {
      setTopSuccessMessage(localStorage.getItem('success_msg'));

      localStorage.removeItem('success_msg');
      setTimeout(() => {

        setTopSuccessMessage(null);

      }, 3000);

    }

    // Redirect to baseurl when not not specific Role
    if (localStorage.getItem('user_role') !== 'franchisee_admin') {
      window.location.href = '/';
    }



  }, []);


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

                        <div className="enrollments-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h3 className="title-sm mb-0"><strong>Children With Additional Needs</strong></h3>
                            <Link to="/children-all" className="viewall">View All</Link>
                          </header>
                          <div className="column-table user-management-sec">
                            {userData.length > 0 ? (
                              <>
                                <ToolkitProvider
                                  keyField="name"
                                  data={userData}
                                  columns={columns1}
                                  search
                                >
                                  {(props) => (
                                    <BootstrapTable
                                      {...props.baseProps}
                                    // selectRow={selectRow}
                                    // pagination={paginationFactory()}
                                    />
                                  )}
                                </ToolkitProvider>
                              </>) : (<><div className="text-center mb-5 mt-5"><strong>No children with additional needs</strong></div></>)}

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
                          <div className="activity-list">
                            <div className="listing">
                              <a href="/user-management" className="item">
                                <span className="name">Total Users</span>
                                <span className="separator">|</span>
                                <span className="num">{countUser?.totalUsers}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a href="/user-management/Educator" className="item">
                                <span className="name">Total Locations</span>
                                <span className="separator">|</span>
                                <span className="num">{countUser?.totalLocations}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a href="/children-all" className="item">
                                <span className="name">New Enrolments</span>
                                <span className="separator">|</span>
                                <span className="num">{countUser?.newEnrollments}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a href="/form/response" className="item">
                                <span className="name">No. of audit forms created in last 30 days</span>
                                <span className="separator">|</span>
                                <span className="num">{countUser?.auditForms}</span>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="enrollments-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>New Enrolments</strong></h4>
                            <Link to="/children-all" className="viewall">View All</Link>
                          </header>
                          <div className="column-table user-management-sec">

                            {enrollments.length > 0 ? (<>
                              <ToolkitProvider
                                keyField="name"
                                data={enrollments}
                                columns={columns}
                                search
                              >
                                {(props) => (
                                  <BootstrapTable
                                    {...props.baseProps}
                                  />
                                )}

                              </ToolkitProvider>
                            </>) : (<><div className="text-center mb-5 mt-5"><strong>No New Enrolments</strong></div></>)}

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
                                  latest_announcement?.map((data, index) => {
                                    return (
                                      <div className="listing">
                                        <a href={`/announcements-announcement/${index}`} className="item">
                                          <div className="pic"><img src="../img/announcement-ico.png" alt="" /></div>
                                          <div className="name">{!data.title ? "No Announcement" : data.title}
                                            <div>
                                              <span className="timesec">{getAddedTime(data?.createdAt)}</span>

                                            </div>
                                          </div>
                                        </a>
                                      </div>
                                    );
                                  }
                                  )

                                )
                                : (
                                  <div className="text-center mb-5 mt-5"><strong>No Announcements</strong></div>

                                )
                            }
                            {/* <div className="listing">
                              <a href="/" className="item">
                                <div className="pic"><img src="../img/announcement-ico.png" alt="" /></div>
                                <div className="name">Regarding Submission of Documents of all classes students admitted in AY 2021-22 <span className="date">12 April, 2022</span></div>
                              </a>
                            </div> */}
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

export default FranchiseeDashboard;