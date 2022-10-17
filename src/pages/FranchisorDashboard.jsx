
import React, { useState, useEffect } from "react";
import { Col, Container, Row, Form, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link, useNavigate } from 'react-router-dom';
import "react-sweet-progress/lib/style.css";
import BootstrapTable from "react-bootstrap-table-next";
import axios from 'axios';
import { BASE_URL } from '../components/App';
import moment from 'moment';
import { FullLoader } from "../components/Loader";

const FranchisorDashboard = () => {
  const navigate = useNavigate();
  const [count, setcount] = React.useState({
    totalFranchisees: 0,
    totalUsers: 0,
    totalChildren: 0,
    noOfEnrollmentFormsSignedInPast7Days: 0,
    usersYetToLogin: 0,

  });
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [latest_announcement, setlatest_announcement] = React.useState([{}]);
  const [forms_count, setForms_count] = useState([0])
  const [formData, setFormData] = useState([])
  const [topSuccessMessage, setTopSuccessMessage] = useState(null)
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);

  const columns1 = [
    {
      dataField: 'formname',
      text: 'Form Name',
      formatter: (cell) => {
        return (<><div className="user-list"><span className="user-pic"><img src="../img/audit-form.png" /></span><span className="user-name">Compliance Visit<small>Audited on:  {moment(cell).format('DD/MM/YYYY')}</small></span></div></>)
      },
    },

    {
      dataField: 'educatorname',
      text: 'Educator Name',
      formatter: (cell) => {
        cell = cell.split(",");
        return (<><div className="user-list"><span className="user-pic"><img src={cell[0] === "null" ? "../img/upload.jpg" : cell[0]} alt='' /></span><span className="user-name">{cell[1]} <small>{cell[2]}</small></span></div></>)
      },
    },
    {
      dataField: "action",
      text: "",
      formatter: (cell) => {
        cell = cell.split(",");
        localStorage.setItem("Form_Id", cell[0])
        return (<><div className="cta-col">
          <Dropdown>
            <Dropdown.Toggle variant="transparent" id="ctacol">
              <img src="../img/dot-ico.svg" alt="" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href={`/form/response/form-visit/${cell[0]}/${cell[1]}`}>View</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div></>)
      },
    }
  ];

  const Forms_count = () => {
    let token = localStorage.getItem('token');
    const selectedFranchise = selectedFranchisee === "all" ? "All" : selectedFranchisee;
    const countUrl = `${BASE_URL}/dashboard/franchisor/audit-forms-count/${selectedFranchise}`;

    axios.get(countUrl, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then((response) => {
      setForms_count(response.data.totalNumberOfAuditFormsInLast30Days);
    }).catch((e) => {
      console.log("Error", e);
    })
  }

  const announcement = () => {
    let token = localStorage.getItem('token');
    const selectedFranchise = selectedFranchisee === "all" ? "All" : selectedFranchisee;
    const countUrl = `${BASE_URL}/dashboard/franchisor/latest-announcement/${selectedFranchise}`;

    axios.get(countUrl, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then((response) => {
      setlatest_announcement(response.data.recentAnnouncement);
    }).catch((e) => {
      setlatest_announcement([])
    })
  }


  const count_Api = () => {
    let token = localStorage.getItem('token');
    const selectedFranchise = selectedFranchisee === "all" ? "All" : selectedFranchisee;
    const countUrl = `${BASE_URL}/dashboard/franchisor/activity-count/${selectedFranchise}`;
    axios.get(countUrl, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then((response) => {
      setcount(response.data);
      setfullLoaderStatus(false)
    }).catch((e) => {
      console.log(e);
      setfullLoaderStatus(false)
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
  const FormData = async () => {
    const token = localStorage.getItem('token');
    const selectedFranchise = selectedFranchisee === "all" ? "All" : selectedFranchisee;
    const response = await axios.get(`${BASE_URL}/dashboard/franchisor/audit-forms-quick-access/${selectedFranchise}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    })
    if (response.status == 200) {
      let data = response.data.data.formData;
      let tempData = data.map((dt, index) => ({
        formname: `${dt.audited_on}`,
        educatorname: `${dt.user.profile_photo},${dt.user.fullname},${dt.user.franchisee.franchisee_name} `,
        action: `${dt.form_id},${index}`,
        // form_id: `${dt.audited_on}`
      }))
      setFormData(tempData);
    }
  }
  // localStorage.setItem("Form_id", JSON.stringify(formData.))

  useEffect(() => {
    if (localStorage.getItem('success_msg')) {
      setTopSuccessMessage(localStorage.getItem('success_msg'));
      localStorage.removeItem('success_msg');
      setTimeout(() => {
        setTopSuccessMessage(null);
      }, 3000);

    }

    // Redirect to baseurl when not not specific Role
    if (localStorage.getItem('user_role') !== 'franchisor_admin') {
      window.location.href = '/';
    }


  }, []);

  React.useEffect(() => {
    if (selectedFranchisee) {
      count_Api();
      announcement();
      Forms_count();
      FormData();
    }
  }, [selectedFranchisee]);

  return (
    <>
      {
        topSuccessMessage && <p className="alert alert-danger" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topSuccessMessage}</p>
      }

      <FullLoader loading={fullLoaderStatus} />
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
                <TopHeader
                  setSelectedFranchisee={setSelectedFranchisee} />
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
                              <a href="https://login.xero.com/identity/user/login" target="_blank" className="flex">
                                <div className="pic"><img src="../img/xero-ico.png" alt="" /></div>
                                <div className="name">Xero</div>
                              </a>
                            </div>
                            <div className="item nolink">
                              <div className="flex">
                                <div className="pic"><img src="../img/bitool-ico.png" target="_blank" alt="" /></div>
                                <div className="name">BI Tool</div>
                              </div>
                            </div>
                            <div className="item">
                              <a href="https://app.storypark.com/users/sign_in?_ga=2.96275036.1184893872.1661406994-2035467191.1661406993" target="_blank" className="flex">
                                <div className="pic"><img src="../img/story-ico.png" alt="" /></div>
                                <div className="name">Story park</div>
                              </a>
                            </div>
                            <div className="item">
                              <a href="https://sp8.harmonykids.com.au/UserAccount/Login" target="_blank" className="flex">
                                <div className="pic"><img src="../img/harmony-ico.png" alt="" /></div>
                                <div className="name">Harmony</div>
                              </a>
                            </div>
                            <div className="item">
                              <a href="https://app.engagebay.com/login  " target="_blank" className="flex">
                                <div className="pic"><img src="../img/engagebay-ico.png" alt="" /></div>
                                <div className="name">Engagebay</div>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="record-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h2 className="title-sm mb-0"><strong>Record of Audits</strong></h2>
                            <Link to={`/form/response/form-visit/${localStorage.getItem("Form_Id")}/index`} className="viewall">View All</Link>
                          </header>
                          <div className="audit-form">
                            <p>Total Number of Audit Forms <br />in Last 30 Days</p>
                            <span className="totalaudit">{forms_count}</span>
                          </div>
                        </div>

                        <div className="enrollments-sec pb-5">
                          <div className="column-table user-management-sec">

                            {
                              formData?.length > 0 ?
                                (
                                  <BootstrapTable
                                    keyField="name"
                                    data={formData}
                                    columns={columns1}
                                  />
                                ) : (
                                  <div className="text-center mb-5 mt-5"><strong>
                                    No forms present!
                                  </strong></div>

                                )
                            }
                            {/* )}
                            </ToolkitProvider> */}
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
                              <Link to="/all-franchisees" className="item">
                                <span className="name">Total Franchises</span>
                                <span className="separator">|</span>
                                <span className="num">{count?.totalFranchisees}</span>
                              </Link>
                            </div>
                            <div className="listing">
                              <Link to="/user-management" className="item">
                                <span className="name">Total Users</span>
                                <span className="separator">|</span>
                                <span className="num">{count?.totalUsers}</span>
                              </Link>
                            </div>
                            <div className="listing">
                              <a className="item" href="/children-all">
                                <span className="name">Total Children</span>
                                <span className="separator">|</span>
                                <span className="num">{count?.totalChildren}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a href="/user-management/Educator" className="item">
                                <span className="name">Total Locations</span>
                                <span className="separator">|</span>
                                <span className="num">{count?.totalLocations}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a className="item" href="/children-all">
                                <span className="name">No. of enrolment forms signed in past 7 days</span>
                                <span className="separator">|</span>
                                <span className="num">{count?.noOfEnrollmentFormsSignedInPast7Days}</span>
                              </a>
                            </div>
                            <div className="listing">
                              <a className="item" style={{ cursor: "not-allowed" }}>
                                <span className="name">Users yet to log in</span>
                                <span className="separator">|</span>
                                <span className="num">{count?.usersYetToLogin}</span>
                              </a>
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
                                  latest_announcement?.map((data, index) => {
                                    return (
                                      <div className="listing">
                                        <a href={`/announcements-announcement/${index}/all-announcement`} className="item">
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

export default FranchisorDashboard;