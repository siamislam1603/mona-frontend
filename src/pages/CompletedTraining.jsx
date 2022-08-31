import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Form, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { BASE_URL } from "../components/App";
import { useNavigate, useParams, NavLink, useLocation  } from 'react-router-dom';
import axios from "axios";
import { FullLoader } from "../components/Loader";

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

const CompleteTraining = () => {
  const [completedTrainingData, setCompletedTrainingData] = useState([]);
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);



  const fetchCompletedTrainingData = async () => {
    alert("dddddddddddddddddd")
    let user_id = localStorage.getItem('user_id');
    const response = await axios.get(`${BASE_URL}/training/${user_id}`);

    console.log('RESPONSE:', response);
    if(response.status === 200 && response.data.status === "success") {
      const { trainingList } = response.data;
      // setfullLoaderStatus(false)

      setCompletedTrainingData(trainingList);

    }
  };  

  useEffect(() => {
    fetchCompletedTrainingData();
  }, []);

console.log("ddddddddddddddddddddddd",fullLoaderStatus)



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
              <FullLoader loading={fullLoaderStatus} />

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
                  <div className="training-cat mb-3">
                    <ul>
                    <li><NavLink to="/available-training">Trainings Available</NavLink></li>
                    <li><NavLink to="/complete-training">Complete Training</NavLink></li>
                    <li><NavLink to="/">Trainings Created</NavLink></li>
                    </ul>
                  </div>
                  <div className="training-column">
                    <Row>
                    {completedTrainingData?.map((item) => {
                      return(
                      <Col lg={4} md={6} key={item.id}>
                        <div className="item mt-3 mb-3">
                          <div className="pic"><a href={`/training-detail/${item.training.id}`}><img src={`${item.training.training_files[0].thumbnail}`} alt=""/> <span className="lthumb"><img src="../img/logo-thumb.png" alt=""/></span></a></div>
                          <div className="fixcol">
                            <div className="icopic"><img src="../img/traning-audio-ico1.png" alt=""/></div>
                            <div className="iconame"><a href="/training-detail">{item.training.title}</a> <span className="time">{ item.training.completion_time }</span></div>
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

export default CompleteTraining;
