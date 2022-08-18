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

  useEffect(() => {
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
                  notificationType='Child Enrollment'/>
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
                          <Accordion.Item>
                            <Accordion.Header>
                              <div className="head-title">
                                <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                                <div className="title-xxs">title<small><span> {
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
                                      <Dropdown.Item href="#">Edit</Dropdown.Item>
                                      <Dropdown.Item>Delete</Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>
                            </Accordion.Header>
                          </Accordion.Item>
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
