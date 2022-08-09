/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Button, Container, Accordion, Form, Dropdown, Row, Col } from "react-bootstrap";
import LeftNavbar from "../../components/LeftNavbar";
import TopHeader from "../../components/TopHeader";
import makeAnimated from 'react-select/animated';
import { useEffect } from "react";
import { BASE_URL } from "../../components/App";
import axios from 'axios';

const animatedComponents = makeAnimated();

const ChildNotifications = () => {
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [announcementDetails, setAnnouncementDetails] = useState(null);

  const AllAnnouncementData = async () =>{
    try {
      const token = localStorage.getItem('token');
      let franhiseAlias = "all"
      const response = await axios.get(`${BASE_URL}/announcement/?franchiseeAlias=${franhiseAlias}&search=&offset=0&limit=5`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      if(response.status === 200 && response.data.status === "success") {
          setAnnouncementDetails(response.data.result.searchedData);
      }
    } catch (error) {
        if(error.response.status === 404){
          // console.log("The code is 404")
          setAnnouncementDetails([])
        }
    } 
  }

  useEffect(() => {
    AllAnnouncementData();
  }, []);

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
                <TopHeader
                  selectedFranchisee={selectedFranchisee}
                  setSelectedFranchisee={setSelectedFranchisee} />
                <div className="entry-container">
                  <header className="title-head">
                    <h1 className="title-lg">Notifications</h1>
                  </header>
                  <div className="othpanel">
                    <div className="extra-btn">
                      {
                        localStorage.getItem('user_role') === 'stanley' &&
                        <Dropdown className="filtercol me-3">
                          <Dropdown.Toggle id="extrabtn" variant="btn-outline">
                            <i className="filter-ico"></i> Add Filters
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <header>Filter by:</header>
                            <div className="custom-radio btn-radio mb-2">
                              <label>Users:</label>
                              <Form.Group>
                                <Form.Check
                                  inline
                                  label='Franchisee'
                                  value='franchisee'
                                  name="users"
                                  type="radio"
                                  id='one'
                                  // onChange={e => setFilterData(prevState => ({
                                  //   ...prevState,
                                  //   user: e.target.value
                                  // }))}
                                />
                              </Form.Group>
                            </div>
                            <footer>
                              <Button variant="transparent" type="submit">Cancel</Button>
                              <Button variant="primary" type="submit">Apply</Button>
                            </footer>
                          </Dropdown.Menu>
                        </Dropdown>
                      }

                      {
                        localStorage.getItem('user_role') === 'stanley' &&
                        <Dropdown>
                          <Dropdown.Toggle id="extrabtn" className="ctaact">
                            <img src="../img/dot-ico.svg" alt="" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item href="#">Export All</Dropdown.Item>
                            <Dropdown.Item href="#">Delete All</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      }
                      <div className="announcement-accordion"> 
                        <Accordion defaultActiveKey="0">
                          { announcementDetails &&
                            announcementDetails.length !==0 ? (
                              announcementDetails.map((details,index) => (
                                <div key={index}>
                                <Accordion.Item eventKey={index} >
                                  <Accordion.Header>
                                    <div className="head-title">
                                      <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                                      <div className="title-xxs">{details.title}<small><span> {
                                      localStorage.getItem('user_role')
                                          ? localStorage
                                            .getItem('user_role')
                                            .split('_')
                                            .map(
                                              (data) =>
                                              data.charAt(0).toUpperCase() + data.slice(1)
                                              ).join(' ')
                                  : ''} : </span>{}</small></div>
                                      <div className="date">
                                        <Dropdown>
                                          <Dropdown.Toggle id="extrabtn" className="ctaact">
                                            <img src="../img/dot-ico.svg" alt=""/>
                                          </Dropdown.Toggle>
                                          <Dropdown.Menu>
                                            <Dropdown.Item href={`/edit-announcement/${details.id}`}>Edit</Dropdown.Item>
                                            <Dropdown.Item>Delete</Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      </div>
                                    </div>
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <Row className="mb-4">
                                      <Col xl={2} lg={3}>
                                        <div className="head">Description :</div>
                                      </Col>
                                      <Col xl={10} lg={9}>
                                          <div
                                          dangerouslySetInnerHTML={{
                                            __html: details.meta_description
                                              ? details.meta_description
                                              : null,
                                          }}
                                          />
                                        {/* <div className="cont"> {details.meta_description}</div> */}
                                      </Col>
                                    </Row>
                                  </Accordion.Body>
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
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default ChildNotifications;
