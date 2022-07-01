import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Form, Dropdown, NavLink } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { BASE_URL } from "../components/App";
import { useNavigate, useParams  } from 'react-router-dom';
import axios from "axios";

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

const CreatedTraining = () => {
  const [createdTrainingData, setCreatedTrainingData] = useState();

  const fetchCreatedTrainings = async () => {
    let user_id = localStorage.getItem('user_id');
    console.log('USER ID:', user_id)
    const response = await axios.get(`${BASE_URL}/training/assigeedTraining/${user_id}`);
    if(response.status === 200 && response.data.status === "success") {
      const { training } = response.data;
      setCreatedTrainingData(training);
    }
  };

  const handleTrainingSelect = () => {

  }

  useEffect(() => {
    fetchCreatedTrainings();
  }, []);

  createdTrainingData && console.log('DATA:', createdTrainingData);
  
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
                  <div className="training-column">
                    <Row>
                    {createdTrainingData?.map((training) => {
                      return(
                      <Col lg={4} md={6} key={training.id}>
                        <div className="item mt-3 mb-3">
                          <div className="pic">
                            <a href={`/training-detail/${training.id}`} onClick={handleTrainingSelect}>
                              <img src={training.training_files[0].thumbnail} alt=""/>
                              <span className="lthumb">
                                <img src="../img/logo-thumb.png" alt=""/>
                              </span>
                            </a>
                          </div>
                          <div className="fixcol">
                            <div className="icopic"><img src="../img/traning-audio-ico1.png" alt=""/></div>
                            <div className="iconame"><a href="/training-detail">{training.title}</a> <span className="time">{training.completion_time}</span></div>
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
                       );
                      })}
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

export default CreatedTraining;
