import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Form, Modal } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Multiselect from 'multiselect-react-dropdown';
import DropOneFile from '../components/DragDrop';
import DropAllFile from '../components/DragDropMultiple';
import axios from 'axios';
import { TrainingFormValidation } from '../helpers/validation';
import { BASE_URL } from '../components/App';
import * as ReactBootstrap from 'react-bootstrap';

const animatedComponents = makeAnimated();

const timeqty = [
  {
    value: 'hours',
    label: 'Hours',
  },
  {
    value: 'months',
    label: 'Months',
  },
];

const AddNewTraining = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSaveAndClose = () => setShow(false);

  // CUSTOM STATES
  const [loader, setLoader] = useState(false);

  const [userRoles, setUserRoles] = useState([]);
  const [settingsModalPopup, setSettingsModalPopup] = useState(false);
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [trainingCategory, setTrainingCategory] = useState([]);
  const [trainingData, setTrainingData] = useState({ 
    time_unit: "Hours",
    title: "",
    description: "",
    meta_description: "",
    category_id: "",
    time_required_to_complete: "" 
  });
  const [trainingSettings, setTrainingSettings] = useState({ user_roles: [] });
  const [coverImage, setCoverImage] = useState({});
  const [videoTutorialFiles, setVideoTutorialFiles] = useState([]);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState("Special DayCare, Sydney");
  const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState([]);

  // LOG MESSAGES
  const [errors, setErrors] = useState({});
  const [topErrorMessage, setTopErrorMessage] = useState(null);

  // FETCHING USER ROLES
  const fetchUserRoles = async () => {
    const response = await axios.get(`${BASE_URL}/api/user-role`);
    if (response.status === 200) {
      const { userRoleList } = response.data;
      setUserRoles([
        ...userRoleList.map((data) => ({
          cat: data.role_name,
          key: data.role_label,
        })),
      ]);
    }
  };

  // FUNCTION TO SEND TRAINING DATA TO THE DB
  const createTraining = async (data) => {
    console.log('CREATING THE TRAINING');
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${BASE_URL}/training/addTraining`, data, {
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );

    if(response.status === 201 && response.data.status === "success") {
      let { id } = response.data.training;

      let data = new FormData();
      data.append('id', id);
      data.append('image', coverImage[0]);

      let imgSaveResponse = await axios.post(
        `${BASE_URL}/training/coverImg`, data, {
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      );

      if(imgSaveResponse.status === 201 && imgSaveResponse.data.status === "success") {
        setLoader(false)
        localStorage.setItem('success_msg', 'Training Created Successfully!');
        localStorage.setItem('active_tab', '/created-training');
        window.location.href="/training";
      } else {
        setTopErrorMessage("unable to save cover image!");
        setTimeout(() => {
          setTopErrorMessage(null);
        }, 3000)
      }

    } else if(response.status === 200 && response.data.status === "fail") {
      const { msg } = response.data;
      setTopErrorMessage(msg);
      setLoader(false);
      setTimeout(() => {
        setTopErrorMessage(null);
      }, 3000)
    }
  };  

  // FUNCTION TO FETCH USERS OF A PARTICULAR FRANCHISEE
  const fetchFranchiseeUsers = async (franchisee_name) => {
    const response = await axios.get(`${BASE_URL}/role/user/${franchisee_name.split(",")[0].split(" ").map(dt => dt.charAt(0).toLowerCase() + dt.slice(1)).join("_")}`);
    if(response.status === 200 && Object.keys(response.data).length > 1) {
      const { users } = response.data;
      setFetchedFranchiseeUsers([
        ...users?.map((data) => ({
          id: data.id,
          cat: data.fullname.toLowerCase().split(" ").join("_"),
          key: data.fullname
        })),
      ]);
    }
  };

  // FETCHING TRAINING CATEGORIES
  const fetchTrainingCategories = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${BASE_URL}/training/get-training-categories`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );

    if (response.status === 200 && response.data.status === "success") {
      const { categoryList } = response.data;
      console.log('CATEGORY:', )
      setTrainingCategory([
        ...categoryList.map((data) => ({
          id: data.id,
          value: data.category_alias,
          label: data.category_name,
        })),
      ]);
    }
  };

  // FUNCTION TO SAVE TRAINING SETTINGS
  const handleTrainingSettings = (event) => {
    const { name, value } = event.target;
    setTrainingSettings((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // FUNCTION TO SAVE TRAINING DATA
  const handleTrainingData = (event) => {
    const { name, value } = event.target;
    setTrainingData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDataSubmit = event => {
    event.preventDefault();
    // window.scrollTo(0, 0);
    
    let errorObj = TrainingFormValidation(trainingData, coverImage, videoTutorialFiles, relatedFiles); 

    if(Object.keys(errorObj).length > 0) {
      setErrors(errorObj);
    } else {
      setErrors({});
      if(Object.keys(trainingSettings).length === 1) {
        setSettingsModalPopup(true);
      }

      if(settingsModalPopup === false && allowSubmit && trainingData && coverImage) {
        let data = new FormData();

        for(let [key, values] of Object.entries(trainingSettings)) {
          data.append(`${key}`, values);
        }

        for(let [ key, values ] of Object.entries(trainingData)) {
          data.append(`${key}`, values)
        }

        videoTutorialFiles.forEach((file, index) => {
          data.append(`images`, file);
        });

        relatedFiles.forEach((file, index) => {
          data.append(`images`, file);
        });
        
        window.scrollTo(0, 0);
        setLoader(true);
        createTraining(data);
      }
    }
  };

  useEffect(() => {
    fetchUserRoles();
    fetchTrainingCategories();
  }, []);

  useEffect(() => {
    fetchFranchiseeUsers(selectedFranchisee);
  }, [selectedFranchisee]);

  trainingSettings && console.log('TRAINING SETTINGS:', trainingSettings);
  trainingData && console.log('TRAINING DATA:', trainingData);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
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
                    <h1 className="title-lg">
                      Add New Training{' '}
                      <span className="setting-ico" onClick={() => setSettingsModalPopup(true)}>
                        <img src="../img/setting-ico.png" alt="" />
                      </span>
                    </h1>
                  </header>
                    {topErrorMessage && <p className="alert alert-danger" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topErrorMessage}</p>} 
                  <div className="training-form">
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Training Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            onChange={handleTrainingData}
                          />
                          { errors && errors.title && <span className="error">{errors.title}</span> }
                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Training Category</Form.Label>
                          <Select
                            closeMenuOnSelect={true}
                            components={animatedComponents}
                            options={trainingCategory}
                            onChange={(event) =>
                              setTrainingData((prevState) => ({
                                ...prevState,
                                category_id: event.id,
                              }))
                            }
                          />
                          { errors && errors.category_id && <span className="error">{errors.category_id}</span> }
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Training Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="description"
                            rows={3}
                            onChange={handleTrainingData}
                          />
                          { errors && errors.description && <span className="error">{errors.description}</span> }
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Meta Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="meta_description"
                            rows={3}
                            onChange={handleTrainingData}
                          />
                          { errors && errors.meta_description && <span className="error">{errors.meta_description}</span> }
                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Group className="relative">
                          <Form.Label>Time required to complete</Form.Label>
                          <div style={{ display: "flex", gap: "5px" }}>
                            <Form.Control
                              style={{ flex: 6 }}
                              type="number"
                              onChange={(event) =>
                                setTrainingData((prevState) => ({
                                  ...prevState,
                                  time_required_to_complete: parseInt(event.target.value),
                                }))
                              }
                            />
                            <Select
                              style={{ flex: 3 }}
                              closeMenuOnSelect={true}
                              placeholder={trainingData.time_unit}
                              value={trainingData.time_unit || ""}
                              components={animatedComponents}
                              options={timeqty}
                              onChange={(event) =>
                                setTrainingData((prevState) => ({
                                  ...prevState,
                                  time_unit:
                                    event.label,
                                }))
                              }
                            />
                          </div>
                          { errors && errors.time_required_to_complete && <span className="error">{errors.time_required_to_complete}</span> }
                        </Form.Group>
                        {/* <Form.Control.Feedback type="invalid">
                            {errors.select_hour}
                          </Form.Control.Feedback> */}
                      </Col>
                    </Row>
                    <Row>
      
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Cover Image :</Form.Label>
                          <DropOneFile
                            onSave={setCoverImage}
                            // setTrainingData={setTraining}
                          />
                        { errors && errors.coverImage && <span className="error mt-2">{errors.coverImage}</span> } 
                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Video Tutorial Here :</Form.Label>
                          <DropAllFile
                            onSave={setVideoTutorialFiles}
                          />
                        { errors && errors.videoTutorialFiles && <span className="error mt-2">{errors.videoTutorialFiles}</span> } 
                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Related Files :</Form.Label>
                          <DropAllFile
                            onSave={setRelatedFiles}
                          />
                        { errors && errors.relatedFiles && <span className="error mt-2">{errors.relatedFiles}</span> } 
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <div className="cta text-center mt-5 mb-5">
                          <Button
                            variant="outline"
                            className="me-3"
                            type="submit"
                          >
                            Preview
                          </Button>
                          <Button
                            variant="primary"
                            type="submit"
                            onClick={handleDataSubmit}
                          >
                            Save
                          </Button>
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

      <Modal
        className="training-modal"
        size="lg"
        show={settingsModalPopup}
        onHide={() => setSettingsModalPopup(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <img src="../img/setting-ico.png" alt="" /> Training Settings
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settings-content">
            <Row>
              <Col lg={3} sm={6}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="start_date"
                    onChange={handleTrainingSettings}
                  />
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-sm-0">
                <Form.Group>
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="start_time"
                    onChange={handleTrainingSettings}
                  />
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="end_date"
                    onChange={handleTrainingSettings}
                  />
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                <Form.Group>
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="end_time"
                    onChange={handleTrainingSettings}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label>Applicable to:</Form.Label>
                  <div className="new-form-radio">
                    <div className="new-form-radio-box">
                      <label htmlFor="yes1">
                        <input
                          type="radio"
                          value="Y"
                          name="roles"
                          id="yes1"
                          onChange={(event) => {
                            setTrainingSettings((prevState) => ({
                              ...prevState,
                              is_applicable_to_all: true,
                            }));
                          }}
                        />
                        <span className="radio-round"></span>
                        <p>User Roles</p>
                      </label>
                    </div>
                    <div className="new-form-radio-box">
                      <label htmlFor="no1">
                        <input
                          type="radio"
                          value="N"
                          name="roles"
                          id="no1"
                          onChange={(event) => {
                            setTrainingSettings((prevState) => ({
                              ...prevState,
                              is_applicable_to_all: false,
                            }));
                          }}
                        />
                        <span className="radio-round"></span>
                        <p>Specific Users</p>
                      </label>
                    </div>
                  </div>
              
                </Form.Group>
              </Col>
              <Col lg={9} md={6} className="mt-3 mt-md-0">
                <div className={`custom-checkbox ${trainingSettings.is_applicable_to_all === false ? "d-none": ""}`}>
                  <Form.Label className="d-block">Select User Roles</Form.Label>
                  <div className="btn-checkbox d-block">
                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox">
                      <Form.Check 
                        type="checkbox" 
                        checked={trainingSettings.user_roles.includes("coordinator")}
                        label="Co-ordinators"
                        onChange={() => {
                          if(trainingSettings.user_roles.includes("coordinator")) {
                            let data = trainingSettings.user_roles.filter(t => t !== "coordinator");
                            setTrainingSettings(prevState => ({
                              ...prevState,
                              user_roles: [...data]
                            }));
                          }

                          if(!trainingSettings.user_roles.includes("coordinator"))
                            setTrainingSettings(prevState => ({
                            ...prevState,
                            user_roles: [...trainingSettings.user_roles, "coordinator"]
                        }))}} />
                    </Form.Group>
                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox1">
                      <Form.Check 
                        type="checkbox" 
                        label="Educator"
                        checked={trainingSettings.user_roles.includes("educator")}
                        onChange={() => {
                          if(trainingSettings.user_roles.includes("educator")) {
                            let data = trainingSettings.user_roles.filter(t => t !== "educator");
                            setTrainingSettings(prevState => ({
                              ...prevState,
                              user_roles: [...data]
                            }));
                          }

                          if(!trainingSettings.user_roles.includes("educator"))
                            setTrainingSettings(prevState => ({
                            ...prevState,
                            user_roles: [...trainingSettings.user_roles, "educator"]
                        }))}} />
                    </Form.Group>
                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox3">
                      <Form.Check 
                        type="checkbox" 
                        label="All Roles"
                        checked={trainingSettings.user_roles.length === 2}
                        onChange={() => {
                          if(trainingSettings.user_roles.includes("coordinator") 
                              && trainingSettings.user_roles.includes("educator")) {
                                setTrainingSettings(prevState => ({
                                  ...prevState,
                                  user_roles: [],
                                }));
                              }
                            
                          if(!trainingSettings.user_roles.includes("coordinator") 
                              && !trainingSettings.user_roles.includes("educator"))
                            setTrainingSettings(prevState => ({
                              ...prevState,
                              user_roles: ["coordinator", "educator"]
                            })
                        )}} />
                    </Form.Group>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className={`mt-4`}>
              <Col lg={3} md={6}>
              </Col>
              <Col lg={9} md={6} className={`mt-3 mt-md-0 ${trainingSettings.is_applicable_to_all === true ? "d-none": ""}`}>
                <Form.Group>
                  <Form.Label>Select User Names</Form.Label>
                  <Multiselect
                    placeholder={fetchedFranchiseeUsers ? "Select User Names" : "No User Available"}
                    displayValue="key"
                    selectedValues={trainingSettings.assigned_users_data}
                    className="multiselect-box default-arrow-select"
                    onKeyPressFn={function noRefCheck() {}}
                    onRemove={function noRefCheck(data) {
                      setTrainingSettings((prevState) => ({
                        ...prevState,
                        assigned_users: [...data.map(data => data.id)],
                        assigned_users_data: [...data.map(data => data)]
                      }));
                    }}
                    onSearch={function noRefCheck() {}}
                    onSelect={function noRefCheck(data) {
                      setTrainingSettings((prevState) => ({
                        ...prevState,
                        assigned_users: [...data.map((data) => data.id)],
                        assigned_users_data: [...data.map(data => data)]
                      }));
                    }}
                    options={fetchedFranchiseeUsers}
                  />
                  
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="transparent" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {
            setAllowSubmit(true);
            setSettingsModalPopup(false)
          }}>
            Save Settings
          </Button>
        </Modal.Footer>
      </Modal> 
      {
        loader === true && <div style={{ 
          width: "100vw", 
          height: "100vh", 
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff80",
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
        }}>
          <ReactBootstrap.Spinner animation="border" />
        </div>
      }
    </div>
  );
};

export default AddNewTraining;
