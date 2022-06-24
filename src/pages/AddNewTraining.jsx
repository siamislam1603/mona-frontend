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
import { BASE_URL } from '../components/App';

const animatedComponents = makeAnimated();

const timereq = [
  {
    value: '3',
    label: '3',
  },
  {
    value: '5',
    label: '5',
  },
];

const AddNewTraining = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSaveAndClose = () => setShow(false);

  // CUSTOM STATES
  const [hideSelect, setHideSelect] = useState(false);
  const [hideRoleDialog, setHideRoleDialog] = useState(false);
  const [hideUserDialog, setHideUserDialog] = useState(false);

  const [userRoles, setUserRoles] = useState([]);
  const [trainingCategory, setTrainingCategory] = useState([]);
  const [trainingData, setTrainingData] = useState();
  const [coverImage, setCoverImage] = useState({});
  const [videoTutorialFiles, setVideoTutorialFiles] = useState([]);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState("Special DayCare, Sydney");
  const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState([]);

  // LOG MESSAGES
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
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${BASE_URL}/training/addTraining`, data, {
        headers: {
          "Authorization": "Bearer "+ token
        }
      }
    );

    console.log('RESPONSE:', response);

    if(response.status === 201 && response.data.status === "success") {
      localStorage.setItem('success_msg', 'Training Created Successfully!');
      window.location.href="/training";


    } else if(response.status === 200 && response.data.status === "fail") {
      const { msg } = response.data;
      setTopErrorMessage(msg);
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
          cat: data.fullname.toLowerCase().split(" ").join("_"),
          key: data.fullname
        })),
      ]);
    }
  };

  // FETCHING TRAINING CATEGORIES
  const fetchTrainingCategories = async () => {
    const response = await axios.get(
      `${BASE_URL}/training/get-training-categories`
    );
    if (response.status === 200) {
      const { categoryList } = response.data.data;
      setTrainingCategory([
        ...categoryList.map((data) => ({
          value: data.category_alias,
          label: data.category_name,
        })),
      ]);
    }
  };

  // FUNCTION TO SAVE TRAINING SETTINGS
  const handleTrainingSettings = (event) => {
    const { name, value } = event.target;
    setTrainingData((prevState) => ({
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

    if(trainingData && coverImage && videoTutorialFiles && relatedFiles) {
      let data = new FormData();

      for(let [ key, values ] of Object.entries(trainingData)) {
        data.append(`${key}`, values)
      }

      data.append('images', coverImage[0]);
      videoTutorialFiles.forEach((file, index) => {
        data.append(`images`, file);
      });
      relatedFiles.forEach((file, index) => {
        data.append(`images`, file);
      });

      createTraining(data);
    }
  };

  useEffect(() => {
    fetchUserRoles();
    fetchTrainingCategories();
  }, []);

  useEffect(() => {
    fetchFranchiseeUsers(selectedFranchisee);
  }, [selectedFranchisee]);
  
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
                    <h1 className="title-lg">
                      Add New Training{' '}
                      <span className="setting-ico" onClick={handleShow}>
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
                                training_category: event.value,
                              }))
                            }
                          />
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
                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Group className="relative">
                          <Form.Label>Time required to complete</Form.Label>
                          <Select
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            options={timereq}
                            onChange={(event) =>
                              setTrainingData((prevState) => ({
                                ...prevState,
                                time_required_to_complete:
                                  event.value + ' Hours',
                              }))
                            }
                          />
                          <span className="rtag">hours</span>
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
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Video Tutorial Here :</Form.Label>
                          <DropAllFile
                            onSave={setVideoTutorialFiles}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Related Files :</Form.Label>
                          <DropAllFile
                            onSave={setRelatedFiles}
                          />
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
        show={show}
        onHide={handleClose}
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
                  <Form.Label>Applicable to all users</Form.Label>
                  <div className="new-form-radio">
                    <div className="new-form-radio-box">
                      <label htmlFor="yes1">
                        <input
                          type="radio"
                          value="Y"
                          name="roles"
                          id="yes1"
                          onChange={(event) => {
                            setTrainingData((prevState) => ({
                              ...prevState,
                              is_applicable_to_all: true,
                            }));
                            setHideSelect(true);
                          }}
                        />
                        <span className="radio-round"></span>
                        <p>Yes</p>
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
                            setTrainingData((prevState) => ({
                              ...prevState,
                              is_applicable_to_all: false,
                            }));
                            setHideSelect(false);
                          }}
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
              
                </Form.Group>
              </Col>
              <Col lg={9} md={6} className="mt-3 mt-md-0">
                <div className="custom-checkbox">
                  <Form.Label className="d-block">Select User Roles</Form.Label>
                  <div className="btn-checkbox d-block">
                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox">
                      <Form.Check type="checkbox" label="Co-ordinators" />
                    </Form.Group>
                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox1">
                      <Form.Check type="checkbox" label="Educator" />
                    </Form.Group>
                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox2">
                      <Form.Check type="checkbox" label="Parents" />
                    </Form.Group>
                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox3">
                      <Form.Check type="checkbox" label="All Roles" />
                    </Form.Group>
                  </div>
                </div>
                <Form.Group className={hideSelect || hideRoleDialog ? 'd-none' : ''}>
                  <Form.Label>Select User Roles</Form.Label>
                  <Multiselect
                    placeholder="Select User Roles"
                    displayValue="key"
                    onChange={() => {console.log("Change")}}
                    className="multiselect-box default-arrow-select"
                    onKeyPressFn={function noRefCheck() {}}
                    onRemove={function noRefCheck(data) {
                      if(data.length === 0) {
                        setHideUserDialog(false);
                      }
                    }}
                    onSearch={function noRefCheck() {}}
                    onSelect={function noRefCheck(data) {
                      setHideUserDialog(true);

                      if(hideUserDialog === true) {
                        setTrainingData((prevState) => ({
                          ...prevState,
                          assigned_users: [],
                        }));
                      }

                      setTrainingData((prevState) => ({
                        ...prevState,
                        roles: [...data.map((data) => data.cat)],
                      }));
                    }}
                    options={userRoles}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className={`mt-4 ${hideUserDialog ? "d-none" : ""}`}>
              <Col lg={3} md={6}>
              </Col>
              <Col lg={9} md={6} className="mt-3 mt-md-0">
                <Form.Group className={hideSelect ? 'd-none' : ''}>
                  <Form.Label>Select User Names</Form.Label>
                  <Multiselect
                    placeholder={fetchedFranchiseeUsers ? "Select User Names" : "No User Available"}
                    displayValue="key"
                    className="multiselect-box default-arrow-select"
                    onKeyPressFn={function noRefCheck() {}}
                    onRemove={function noRefCheck(data) {
                      if(data.length === 0) {
                        setHideRoleDialog(false);
                      }
                    }}
                    onSearch={function noRefCheck() {}}
                    onSelect={function noRefCheck(data) {
                      setHideRoleDialog(true);

                      if(hideRoleDialog === true) {
                        setTrainingData((prevState) => ({
                          ...prevState,
                          roles: [],
                        }));
                      }

                      setTrainingData((prevState) => ({
                        ...prevState,
                        assigned_users: [...data.map((data) => data.cat)],
                      }));
                    }}
                    options={fetchedFranchiseeUsers}
                  />
                 {/* {roles ? null: <p>please choose roles</p>} */}
                  
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="transparent" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveAndClose}>
            Save Settings
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddNewTraining;
