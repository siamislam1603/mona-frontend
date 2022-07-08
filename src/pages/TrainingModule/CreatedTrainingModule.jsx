import React, { useState, useEffect } from "react";
import { Col, Row, Dropdown, Modal, Form, Button } from "react-bootstrap";
import { BASE_URL } from "../../components/App";
import axios from "axios";
import Multiselect from 'multiselect-react-dropdown';

const CreatedTraining = ({ filter, selectedFranchisee }) => {
  const [myTrainingData, setMyTrainingData] = useState();
  const [otherTrainingData, setOtherTrainingData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [saveTrainingId, setSaveTrainingId] = useState(null);
  const [shareType, setShareType] = useState("roles");
  const [userList, setUserList] = useState();
  const [formSettings, setFormSettings] = useState({
    user_roles: []
  });

  const fetchUserList = async () => {
    let franchisee_alias = selectedFranchisee.split(",")[0].split(" ").map(d => d.charAt(0).toLowerCase() + d.slice(1)).join("_");
    const response = await axios.get(`${BASE_URL}/user-group/users/franchisee/${franchisee_alias}`);

    if(response.status === 200 && response.data.status === "success") {
      const { users } = response.data;
      setUserList(users.map(user => ({
        id: user.id,
        name: user.fullname,
        email: user.email,
        cat: user.email,
        key: user.email
      })));
    }
  };

  const handleTrainingSharing = async () => {
    let token = localStorage.getItem('token');
    let user_id = localStorage.getItem('user_id')
    const response = await axios.post(`${BASE_URL}/share/${saveTrainingId}`, {
      ...formSettings,
      franchisee: selectedFranchisee,
      shared_by: user_id
    }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if(response.status === 201 && response.data.status === "success") {
      // const { dataObj } = response.data;
      
    }
  }

  const fetchCreatedTrainings = async () => {
    let user_id = localStorage.getItem('user_id');
    let token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/training?category_id=${filter.category_id}&search=${filter.search}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if(response.status === 200 && response.data.status === "success") {
      const { createdTrainingList } = response.data;
      let myTrainings = createdTrainingList.filter(training => training.addedBy === parseInt(user_id));
      let otherTrainings = createdTrainingList.filter(training => training.addedBy !== parseInt(user_id));

      setMyTrainingData(myTrainings);
      setOtherTrainingData(otherTrainings);
    }
  };

  useEffect(() => {
    fetchCreatedTrainings();
  }, [filter]);

  useEffect(() => {
    fetchUserList();
  }, [selectedFranchisee]);

  return (
    <>
      <div id="main">
        <div className="training-column">
          <Row style={{ marginBottom: '40px' }}>
            {myTrainingData?.length > 0 && <h1>Created by me</h1>}
            {myTrainingData?.map((training) => {
            return(
            <Col lg={4} md={6} key={training.id}>
              <div className="item mt-3 mb-3">
                <div className="pic">
                  <a href={`/training-detail/${training.id}`}>
                    <img src={training.coverImage} alt=""/>
                    <span className="lthumb">
                      <img src="../img/logo-thumb.png" alt=""/>
                    </span>
                  </a>
                </div>
                <div className="fixcol">
                  <div className="icopic"><img src="../img/traning-audio-ico1.png" alt=""/></div>
                  <div className="iconame"><a href={`/training-detail/${training.id}`}>{training.title}</a> <span className="time">{training.completion_time}</span></div>
                  <div className="cta-col">
                    <Dropdown>
                      <Dropdown.Toggle variant="transparent" id="ctacol">
                        <img src="../img/dot-ico.svg" alt=""/>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#">Delete</Dropdown.Item>
                        <Dropdown.Item href="#">Edit</Dropdown.Item>
                        <Dropdown.Item href="#" onClick={() => {
                          setSaveTrainingId(training.id);
                          setShowModal(true)
                        }}>Share</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </Col>
              );
            })}
          </Row>

          <Row>
            {
              otherTrainingData?.length > 0 && <h1 style={{ marginBottom: '25px' }}>Created by others</h1>
            }
            {otherTrainingData?.map((training) => {
            return(
            <Col lg={4} md={6} key={training.id}>
              <div 
                className="item mt-3 mb-3">
                <div className="pic">
                  <a href={`/training-detail/${training.id}`}>
                    <img src={training.coverImage} alt=""/>
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
                <div className="created-by">
                  <h4 className="title">Created by:</h4>
                  <div className="createrimg">
                    <img src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?w=2000" alt="" />
                  </div>
                  <p>{training.user.fullname}, <span>{training.user.role.split("_").map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(" ")}</span></p>
                </div>
              </div>
            </Col>
              );
            })}
          </Row>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        className="form-settings-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="modal-heading">
            <img src="../../img/carbon_settings.svg" />
            Form Settings
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <div className="form-settings-content">
              <Row className="mt-4">
                <Col lg={3} md={6}>
                  <Form.Group>
                    <Form.Label>Accessible to:</Form.Label>
                    <div className="new-form-radio d-block">
                      <div className="new-form-radio-box">
                        <label for="yes">
                          <input
                            type="radio"
                            value={1}
                            checked={shareType === "roles"}
                            name="accessible_to_role"
                            id="yes"
                            onChange={() => {
                              setFormSettings(prevState => ({
                                ...prevState,
                                assigned_users: [],
                                assigned_users_data: []
                              }));
                              setShareType("roles");
                            }}
                          />
                          <span className="radio-round"></span>
                          <p>User Roles</p>
                        </label>
                      </div>
                      <div className="new-form-radio-box m-0 mt-3">
                        <label for="no">
                          <input
                            type="radio"
                            value={0}
                            name="accessible_to_role"
                            checked={shareType === "users"}
                            id="no"
                            onChange={() => {
                              setFormSettings(prevState => ({
                                ...prevState,
                                user_roles: []
                              }));
                              setShareType("users");
                            }}
                          />
                          <span className="radio-round"></span>
                          <p>Specific Users</p>
                        </label>
                      </div>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg={9} md={12}>
                {  
                  shareType === "roles" ? 
                  <>
                    <Form.Label className="d-block">Select User Roles</Form.Label>
                      <div className="btn-checkbox" style={{ display: "flex", flexDirection: "column" }}>
                        <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox">
                          <Form.Check 
                            type="checkbox" 
                            checked={formSettings.user_roles.includes("coordinator")}
                            label="Co-ordinators"
                            onChange={() => {
                              if(formSettings.user_roles.includes("coordinator")) {
                                let data = formSettings.user_roles.filter(t => t !== "coordinator");
                                setFormSettings(prevState => ({
                                  ...prevState,
                                  user_roles: [...data]
                                }));
                              }

                              if(!formSettings.user_roles.includes("coordinator"))
                                setFormSettings(prevState => ({
                                ...prevState,
                                user_roles: [...formSettings.user_roles, "coordinator"]
                            }))}} />
                        </Form.Group>
                        
                        <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox1">
                          <Form.Check 
                            type="checkbox" 
                            label="Educators"
                            checked={formSettings.user_roles.includes("educator")}
                            onChange={() => {
                              if(formSettings.user_roles.includes("educator")) {
                                let data = formSettings.user_roles.filter(t => t !== "educator");
                                setFormSettings(prevState => ({
                                  ...prevState,
                                  user_roles: [...data]
                                }));
                              }

                              if(!formSettings.user_roles.includes("educator"))
                                setFormSettings(prevState => ({
                                ...prevState,
                                user_roles: [...formSettings.user_roles, "educator"]
                            }))}} />
                        </Form.Group>

                        <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox2">
                          <Form.Check 
                            type="checkbox" 
                            label="Guardians"
                            checked={formSettings.user_roles.includes("guardian")}
                            onChange={() => {
                              if(formSettings.user_roles.includes("guardian")) {
                                let data = formSettings.user_roles.filter(t => t !== "guardian");
                                setFormSettings(prevState => ({
                                  ...prevState,
                                  user_roles: [...data]
                                }));
                              }

                              if(!formSettings.user_roles.includes("guardian"))
                                setFormSettings(prevState => ({
                                ...prevState,
                                user_roles: [...formSettings.user_roles, "guardian"]
                            }))}} />
                        </Form.Group>

                        <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox3">
                          <Form.Check 
                            type="checkbox" 
                            label="All Roles"
                            checked={formSettings.user_roles.length === 3}
                            onChange={() => {
                              if(formSettings.user_roles.includes("coordinator") 
                                  && formSettings.user_roles.includes("educator")
                                  && formSettings.user_roles.includes("guardian")) {
                                    setFormSettings(prevState => ({
                                      ...prevState,
                                      user_roles: [],
                                    }));
                                  }
                                
                              if(!formSettings.user_roles.includes("coordinator") 
                                  && !formSettings.user_roles.includes("educator")
                                  && !formSettings.user_roles.includes("guardian"))
                                setFormSettings(prevState => ({
                                  ...prevState,
                                  user_roles: ["coordinator", "educator", "guardian"]
                                })
                            )}} />
                        </Form.Group>
                      </div> </>:
                      <Form.Group>
                        <Form.Label>Select User</Form.Label>
                        <div className="select-with-plus">
                          <Multiselect
                            placeholder={"Select User Names"}
                            displayValue="key"
                            className="multiselect-box default-arrow-select"
                            onKeyPressFn={function noRefCheck() {}}
                            onRemove={function noRefCheck(data) {
                              setFormSettings((prevState) => ({
                                ...prevState,
                                assigned_users: [...data.map(data => data.id)],
                                assigned_users_data: [...data.map(data => data)]
                              }));
                            }}
                            onSearch={function noRefCheck() {}}
                            onSelect={function noRefCheck(data) {
                              setFormSettings((prevState) => ({
                                ...prevState,
                                assigned_users: [...data.map((data) => data.id)],
                                assigned_users_data: [...data.map(data => data)]
                              }));
                            }}
                            options={userList}
                          />
                        </div>
                    </Form.Group> 
                  }
                </Col>
              </Row>
            </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button className="back">Cancel</Button>
          <Button 
            className="done" 
            onClick={() => {
              setShowModal(false);
              handleTrainingSharing();
            }}>
            Save Settings
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreatedTraining;
