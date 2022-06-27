import React, { useState } from "react";
import { Button, Col, Container, Row, Form, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link, NavLink, useLocation } from 'react-router-dom';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useEffect } from "react";

const animatedComponents = makeAnimated();
const styles = {
  option: (styles, state) => ({
    ...styles,
    backgroundColor: state.isSelected ? "#E27235" : "",
  }),
};
const training = [
  {
    value: "sydney",
    label: "Sydney",
  },
  {
    value: "melbourne",
    label: "Melbourne",
  },
];
const Training = () => {
  let location = useLocation();
  const [topSuccessMessage, setTopSuccessMessage] = useState(null);

  // STYLE ACTIVE LINKS
  const navLinkStyles = ({ isActive }) => {
    return isActive ? { 
        color: "#AA0061", 
        fontWeight: "700", 
        opacity: 1
      } : {}
  };

  useEffect(() => {
    if(localStorage.getItem('success_msg')) {
      setTopSuccessMessage(localStorage.getItem('success_msg'));
      localStorage.removeItem('success_msg');

      setTimeout(() => {
        setTopSuccessMessage(null);
      }, 3000);
    }
  }, [])

  console.log('LOCATION:', location); 
  return (
    <>
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar/>
              </aside>
              <div className="sec-column">
                <TopHeader/>
                <div className="entry-container">
                  <header className="title-head">
                    <h1 className="title-lg">Trainings</h1>
                    <div className="othpanel">
                      <div className="extra-btn">
                        <div className="data-search me-3">
                          <label for="search-bar" className="search-label">
                            <input id="search-bar" type="text" className="form-control" placeholder="Search" value=""/>
                          </label>
                        </div>
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
                                  label='Admin'
                                  value='Admin'
                                  name="users"
                                  type="radio"
                                  id='one'
                                />
                                <Form.Check
                                  inline
                                  label='Co-ordinator'
                                  value='Co-ordinator'
                                  name="users"
                                  type="radio"
                                  id='two'
                                />
                                <Form.Check
                                  inline
                                  label='Educator'
                                  value='Educator'
                                  name="users"
                                  type="radio"
                                  id='three'
                                />
                                <Form.Check
                                  inline
                                  label='Parent/Guardian'
                                  value='Parent-Guardian'
                                  name="users"
                                  type="radio"
                                  id='four'
                                />
                              </Form.Group>
                            </div>
                            <div className="custom-radio">
                              <label className="mb-2">Location:</label>
                              <Form.Group>
                                <Select
                                  closeMenuOnSelect={false}
                                  components={animatedComponents}
                                  isMulti
                                  options={training}
                                />
                              </Form.Group>
                            </div>
                            <footer>
                              <Button variant="transparent" type="submit">Cancel</Button>
                              <Button variant="primary" type="submit">Apply</Button>
                            </footer>
                          </Dropdown.Menu>
                        </Dropdown>
                        <a href="/new-training" className="btn btn-primary me-3">+ Add New Training</a>
                        <Dropdown>
                          <Dropdown.Toggle id="extrabtn" className="ctaact">
                            <img src="../img/dot-ico.svg" alt=""/>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item href="#">Export All</Dropdown.Item>
                            <Dropdown.Item href="#">Delete All</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </header>
                  <div className="training-cat d-md-flex align-items-center mb-3">
                    <ul>
                      <li><NavLink to="/available-training" className="active" style={navLinkStyles}>Trainings Available</NavLink></li>
                      <li><NavLink to="/complete-training" style={navLinkStyles}>Complete Training</NavLink></li>
                      <li><NavLink to="/" style={navLinkStyles}>Trainings Created</NavLink></li>
                    </ul>
                    <div className="selectdropdown ms-auto d-flex align-items-center">
                      <Form.Group className="d-flex align-items-center">
                        <Form.Label className="d-block me-2">Choose Category</Form.Label>
                        <Select
                          closeMenuOnSelect={true}
                          components={animatedComponents}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  {
                    topSuccessMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topSuccessMessage}</p>
                  } 
                  <div className="training-column">
                    <Row>
                      <Col lg={4} md={6}>
                        <div className="item mt-3 mb-3">
                          <div className="pic"><a href="/training-detail"><img src="../img/trainingpic1.jpg" alt=""/> <span className="lthumb"><img src="../img/logo-thumb.png" alt=""/></span></a></div>
                          <div className="fixcol">
                            <div className="icopic"><img src="../img/traning-audio-ico1.png" alt=""/></div>
                            <div className="iconame"><a href="/training-detail">Getting and staying organized</a> <span className="time">3 Hours</span></div>
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
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="item mt-3 mb-3">
                          <div className="pic"><a href="/training-detail"><img src="../img/trainingpic2.jpg" alt=""/> <span className="lthumb"><img src="../img/logo-thumb.png" alt=""/></span></a></div>
                          <div className="fixcol">
                            <div className="icopic"><img src="../img/traning-audio-ico1.png" alt=""/></div>
                            <div className="iconame"><a href="/training-detail">Getting and staying organized</a> <span className="time">3 Hours</span></div>
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
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="item mt-3 mb-3">
                          <div className="pic"><a href="/training-detail"><img src="../img/trainingpic3.jpg" alt=""/> <span className="lthumb"><img src="../img/logo-thumb.png" alt=""/></span></a></div>
                          <div className="fixcol">
                            <div className="icopic"><img src="../img/traning-audio-ico1.png" alt=""/></div>
                            <div className="iconame"><a href="/training-detail">Getting and staying organized</a> <span className="time">3 Hours</span></div>
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
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="item mt-3 mb-3">
                          <div className="pic"><a href="/training-detail"><img src="../img/trainingpic4.jpg" alt=""/> <span className="lthumb"><img src="../img/logo-thumb.png" alt=""/></span></a></div>
                          <div className="fixcol">
                            <div className="icopic"><img src="../img/traning-audio-ico1.png" alt=""/></div>
                            <div className="iconame"><a href="/training-detail">Getting and staying organized</a> <span className="time">3 Hours</span></div>
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
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="item mt-3 mb-3">
                          <div className="pic"><a href="/training-detail"><img src="../img/trainingpic5.jpg" alt=""/> <span className="lthumb"><img src="../img/logo-thumb.png" alt=""/></span></a></div>
                          <div className="fixcol">
                            <div className="icopic"><img src="../img/traning-audio-ico1.png" alt=""/></div>
                            <div className="iconame"><a href="/training-detail">Getting and staying organized</a> <span className="time">3 Hours</span></div>
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
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="item mt-3 mb-3">
                          <div className="pic"><a href="/training-detail"><img src="../img/trainingpic6.jpg" alt=""/> <span className="lthumb"><img src="../img/logo-thumb.png" alt=""/></span></a></div>
                          <div className="fixcol">
                            <div className="icopic"><img src="../img/traning-audio-ico1.png" alt=""/></div>
                            <div className="iconame"><a href="/training-detail">Getting and staying organized</a> <span className="time">3 Hours</span></div>
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
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="item mt-3 mb-3">
                          <div className="pic"><a href="/training-detail"><img src="../img/trainingpic7.jpg" alt=""/> <span className="lthumb"><img src="../img/logo-thumb.png" alt=""/></span></a></div>
                          <div className="fixcol">
                            <div className="icopic"><img src="../img/traning-audio-ico1.png" alt=""/></div>
                            <div className="iconame"><a href="/training-detail">Getting and staying organized</a> <span className="time">3 Hours</span></div>
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
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="item mt-3 mb-3">
                          <div className="pic"><a href="/training-detail"><img src="../img/trainingpic8.jpg" alt=""/> <span className="lthumb"><img src="../img/logo-thumb.png" alt=""/></span></a></div>
                          <div className="fixcol">
                            <div className="icopic"><img src="../img/traning-audio-ico1.png" alt=""/></div>
                            <div className="iconame"><a href="/training-detail">Getting and staying organized</a> <span className="time">3 Hours</span></div>
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
                      </Col>
                    </Row>
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

export default Training;
