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
import { useParams } from 'react-router-dom';
import { TrainingFormValidation } from '../helpers/validation';
import { BASE_URL } from '../components/App';
import moment from 'moment';
import * as ReactBootstrap from 'react-bootstrap';

const animatedComponents = makeAnimated();

const timeqty = [
  {
    value: 'hours',
    label: 'Hours',
  },
  {
    value: 'days',
    label: 'Days',
  },
  {
    value: 'weeks',
    label: 'Weeks',
  },
  {
    value: 'months',
    label: 'Months',
  },
];

const EditTraining = () => {
  const { trainingId } = useParams();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  // CUSTOM STATES
  const [loader, setLoader] = useState(false);
  const [createTrainingModal, setCreateTrainingModal] = useState(false)

  const [userRoles, setUserRoles] = useState([]);
  const [settingsModalPopup, setSettingsModalPopup] = useState(false);
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [trainingCategory, setTrainingCategory] = useState([]);
  const [trainingData, setTrainingData] = useState({});
  const [trainingSettings, setTrainingSettings] = useState({ user_roles: [] });
  const [coverImage, setCoverImage] = useState({});
  
  const [videoTutorialFiles, setVideoTutorialFiles] = useState([]);
  const [fetchedVideoTutorialFiles, setFetchedVideoTutorialFiles] = useState([]);

  const [relatedFiles, setRelatedFiles] = useState([]);
  const [fetchedRelatedFiles, setFetchedRelatedFiles] = useState([]);

  const [selectedFranchisee, setSelectedFranchisee] = useState("Special DayCare, Sydney");
  const [franchiseeList, setFranchiseeList] = useState();
  const [sendToAllFranchisee, setSendToAllFranchisee] = useState();
  const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState([]);

  const [editTrainingData, setEditTrainingData] = useState();

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

  // FETCHING FRANCHISEE LIST
  const fetchFranchiseeList = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/role/franchisee`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if(response.status === 200 && response.data.status === "success") {
      setFranchiseeList(response.data.franchiseeList.map(data => ({
        id: data.id,
        cat: data.franchisee_alias,
        key: `${data.franchisee_name}, ${data.city}`
      })));
    }
  };

  // FUNCTION TO FETCH USERS OF A PARTICULAR FRANCHISEE
  const fetchFranchiseeUsers = async (franchisee_id) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/role/user/franchiseeById/${franchisee_id}`);
    console.log('RESPONSE:', response);
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

  const fetchTrainingData = async () => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/training/getTrainingById/${trainingId}/${userId}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    console.log('RESPONSE EDIT TRAINING:', response);
    if(response.status === 200 && response.data.status === "success") {
      const { training } = response.data;

      setEditTrainingData(training);
    }
  };

  // COPYING FETCHED DATA INTO INTERNAL STATE
  const copyFetchedData = () => {
    setTrainingData(prevState => ({
      ...prevState,
      title: editTrainingData?.title,
      description: editTrainingData?.description,
      meta_description: editTrainingData?.meta_description,
      category_id: editTrainingData?.category_id,
      time_required_to_complete: parseInt(editTrainingData?.completion_time.split(" ")[0]),
      time_unit: editTrainingData?.completion_time.split(" ")[1],
    }));

    setTrainingSettings(prevState => ({
      start_date: moment(editTrainingData?.start_date).format('YYYY-MM-DD'),
      start_time: moment(editTrainingData?.start_date).format('HH:mm'),
      end_date: moment(editTrainingData?.end_date).format('YYYY-MM-DD'),
      end_time: moment(editTrainingData?.end_date).format('HH:mm'),
      user_roles: editTrainingData?.shares[0].assigned_roles,
      assigned_users: editTrainingData?.shares[0].assigned_users,
      assigned_users_obj: fetchedFranchiseeUsers?.filter(user => editTrainingData?.shares[0].assigned_users.includes(user.id + "")),
      assigned_franchisee: editTrainingData?.shares[0].franchisee === null ? ['all'] : [parseInt(editTrainingData?.shares[0].franchisee)],
      assigned_franchisee_obj: editTrainingData?.shares[0].franchisee === null ? [] : franchiseeList?.filter(franchisee => franchisee.id === parseInt(editTrainingData?.shares[0].franchisee)),
      is_applicable_to_all: editTrainingData?.shares[0].user_or_roles === 1 ? true : false,
    }));

    setSendToAllFranchisee(editTrainingData?.shares[0].franchisee === null ? "all" : "none");
    
    setFetchedVideoTutorialFiles(editTrainingData?.training_files?.filter(file => file.fileType === ".mp4" && file.is_deleted === false));
    
    setFetchedRelatedFiles(editTrainingData?.training_files?.filter(file => file.type !== '.mp4' && file.is_deleted === false));
    console.log('FETCHED DATA COPIED!');
  }

  // FUNCTION TO SEND TRAINING DATA TO THE DB
  const updateTraining = async (data) => {
    console.log('CREATING THE TRAINING');
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${BASE_URL}/training/updateTraining/${trainingId}`, data, {
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );

    if(response.status === 200 && response.data.status === "success") {
      let token = localStorage.getItem('token');
      let user_id = localStorage.getItem('user_id')
      const shareResponse = await axios.post(`${BASE_URL}/share/${trainingId}`, {
        assigned_franchisee: trainingSettings.assigned_franchisee,
        assigned_users: trainingSettings.assigned_users,
        user_roles: trainingSettings.user_roles,
        shared_by: user_id,
        is_applicable_to_all: trainingSettings.is_applicable_to_all,
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if(shareResponse.status === 201 && shareResponse.data.status === "success") {
        setLoader(false)
        setCreateTrainingModal(false);
        localStorage.setItem('success_msg', 'Training Updated Successfully!');
        localStorage.setItem('active_tab', '/created-training');
        window.location.href="/training";

      } else if(response.status === 200 && response.data.status === "fail") {
        const { msg } = response.data;
        setTopErrorMessage(msg);
        setLoader(false);
        setTimeout(() => {
          setTopErrorMessage(null);
        }, 3000)
      }
    }
  };    

  // FUNCTION TO FETCH USERS OF A PARTICULAR FRANCHISEE
  // const fetchFranchiseeUsers = async (franchisee_name) => {
  //   const response = await axios.get(`${BASE_URL}/role/user/${franchisee_name.split(",")[0].split(" ").map(dt => dt.charAt(0).toLowerCase() + dt.slice(1)).join("_")}`);
  //   if(response.status === 200 && Object.keys(response.data).length > 1) {
  //     const { users } = response.data;
  //     setFetchedFranchiseeUsers([
  //       ...users?.map((data) => ({
  //         id: data.id,
  //         cat: data.fullname.toLowerCase().split(" ").join("_"),
  //         key: data.fullname
  //       })),
  //     ]);
  //   }
  // };

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
    // window.scrollTo(0, 0);
    
    let errorObj = TrainingFormValidation(trainingData, coverImage, videoTutorialFiles, relatedFiles); 

    if(Object.keys(errorObj).length > 0) {
      setErrors(errorObj);
    } else {
      setErrors({});
      if(Object.keys(trainingSettings).length === 1) {
        setSettingsModalPopup(true);
      } else {
        setAllowSubmit(true);
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
        setCreateTrainingModal(true);
        setLoader(true);
        updateTraining(data);
      }
    }
  };

  const handleTrainingFileDelete = async (fileId) => {
    console.log(`Delete file with id: ${fileId}`);
    let token = localStorage.getItem('token');
    const deleteRespone = await axios.delete(`${BASE_URL}/training/deleteFile/${fileId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    console.log('Delete response:', deleteRespone);
    // if(deleteRespone.status === 200 && deleteRespone.data.status === "success") {

    // }
  }

  useEffect(() => {
    fetchUserRoles();
    fetchTrainingCategories();
    fetchTrainingData();
    fetchFranchiseeList();
  }, []);

  useEffect(() => {
    fetchFranchiseeUsers(selectedFranchisee);
  }, [selectedFranchisee]);

  useEffect(() => {
    copyFetchedData();
  }, [franchiseeList, editTrainingData]);

  useEffect(() => {
    fetchFranchiseeUsers(parseInt(trainingSettings.assigned_franchisee));
  }, [trainingSettings.assigned_franchisee]);

  // trainingData && console.log('TRAINING DATA:', trainingData);
  // trainingSettings && console.log('TRAINING SETTINGS:', trainingSettings);
  // videoTutorialFiles && console.log('Vide Tutorial:', videoTutorialFiles);

  // fetchedFranchiseeUsers && console.log('USER OBJ:', fetchedFranchiseeUsers?.filter(user => editTrainingData?.shares[0].assigned_users.includes(user.id + "")));
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
                      Edit Training{' '}
                      <span className="setting-ico" onClick={() => setSettingsModalPopup(true)}>
                        <img src="../img/setting-ico.png" alt="" />
                      </span>
                    </h1>
                  </header>
                    {topErrorMessage && <p className="alert alert-danger" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topErrorMessage}</p>} 
                  {
                    editTrainingData &&
                    <div className="training-form">
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label>Training Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="title"
                              value={trainingData.title}
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
                              value={trainingCategory.filter(c => c.id === trainingData.category_id) || trainingCategory.filter(c => c.id === editTrainingData.category_id)}
                              onChange={(e) => setTrainingData(prevState => ({
                                ...prevState,
                                category_id: e.id
                              }))}
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
                              value={trainingData.description}
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
                              value={trainingData.meta_description}
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
                                value={trainingData.time_required_to_complete}
                                onChange={(e) => setTrainingData(prevState => ({
                                  ...prevState,
                                  time_required_to_complete: parseInt(e.target.value)
                                }))}
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
                            <div className="media-container">
                              {
                                fetchedVideoTutorialFiles &&
                                fetchedVideoTutorialFiles.map((video, index) => {
                                  return (
                                    <div className="file-container">
                                      <img className="file-thumbnail" src={`${video.thumbnail}`} alt={`${video.videoId}`} />
                                      <p className="file-text"><strong>{`Video ${videoTutorialFiles.length + (index + 1)}`}</strong></p>
                                      <img 
                                        onClick={() => handleTrainingFileDelete(video.id)}
                                        className="file-remove" 
                                        src="../img/removeIcon.svg" 
                                        alt="" />
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label>Upload Related Files :</Form.Label>
                            <DropAllFile
                              onSave={setRelatedFiles}
                            />
                            <div className="media-container">
                              {
                                fetchedRelatedFiles &&
                                fetchedRelatedFiles.map((file, index) => {
                                  return (
                                    <div className="file-container">
                                      <img className="file-thumbnail-vector" src={`../img/file.png`} alt={`${file.videoId}`} />
                                      <p className="file-text"><strong>{`Related File ${relatedFiles.length + (index + 1)}`}</strong></p>
                                      <img 
                                        onClick={() => handleTrainingFileDelete(file.id)}
                                        className="file-remove" 
                                        src="../img/removeIcon.svg" 
                                        alt="" />
                                    </div>
                                  )
                                })
                              }
                            </div>
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
                    }
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
          {
            editTrainingData &&
            <div className="form-settings-content">
              <Row>
                <Col lg={3} sm={6}>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="start_date"
                      value={trainingSettings.start_date}
                      onChange={(e) => setTrainingSettings(prevState => ({
                        ...prevState,
                        start_date: e.target.value
                      }))}
                    />
                  </Form.Group>
                </Col>
                <Col lg={3} sm={6} className="mt-3 mt-sm-0">
                  <Form.Group>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="time"
                      name="start_time"
                      value={trainingSettings.start_time}
                      onChange={(e) => setTrainingSettings(prevState => ({
                        ...prevState,
                        start_time: e.target.value
                      }))}
                    />
                  </Form.Group>
                </Col>
                <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="end_date"
                      value={trainingSettings.end_date}
                      onChange={(e) => setTrainingSettings(prevState => ({
                        ...prevState,
                        start_date: e.target.value
                      }))}
                    />
                  </Form.Group>
                </Col>
                <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                  <Form.Group>
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="time"
                      name="end_time"
                      value={trainingSettings.end_time}
                      onChange={(e) => setTrainingSettings(prevState => ({
                        ...prevState,
                        end_time: e.target.value
                      }))}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mt-4">
                <Col lg={3} md={6}>
                  <Form.Group>
                    <Form.Label>Send to all franchisee:</Form.Label>
                    <div className="new-form-radio d-block">
                      <div className="new-form-radio-box">
                        <label for="all">
                          <input
                            type="radio"
                            checked={sendToAllFranchisee === 'all'}
                            name="send_to_all_franchisee"
                            id="all"
                            onChange={() => {
                              setTrainingSettings(prevState => ({
                                ...prevState,
                                assigned_franchisee: ['all']
                              }));
                              setSendToAllFranchisee('all')
                            }}
                          />
                          <span className="radio-round"></span>
                          <p>Yes</p>
                        </label>
                      </div>
                      <div className="new-form-radio-box m-0 mt-3">
                        <label for="none">
                          <input
                            type="radio"
                            name="send_to_all_franchisee"
                            checked={sendToAllFranchisee === 'none'}
                            id="none"
                            onChange={() => {
                              setTrainingSettings(prevState => ({
                                ...prevState,
                                assigned_franchisee: []
                              }));
                              setSendToAllFranchisee('none')
                            }}
                          />
                          <span className="radio-round"></span>
                          <p>No</p>
                        </label>
                      </div>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg={9} md={12}>
                  <Form.Group>
                    <Form.Label>Select Franchisee</Form.Label>
                    <div className="select-with-plus">
                      <Multiselect
                        disable={sendToAllFranchisee === 'all'}
                        singleSelect={true}
                        placeholder={"Select User Names"}
                        displayValue="key"
                        selectedValues={trainingSettings.assigned_franchisee_obj}
                        className="multiselect-box default-arrow-select"
                        onKeyPressFn={function noRefCheck() {}}
                        onRemove={function noRefCheck(data) {
                          setTrainingSettings((prevState) => ({
                            ...prevState,
                            assigned_franchisee: [...data.map(data => data.id)],
                          }));
                        }}
                        onSearch={function noRefCheck() {}}
                        onSelect={function noRefCheck(data) {
                          setTrainingSettings((prevState) => ({
                            ...prevState,
                            assigned_franchisee: [...data.map((data) => data.id)],
                          }));
                        }}
                        options={franchiseeList}
                      />
                    </div>
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
                            checked={trainingSettings.is_applicable_to_all === true}
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
                            checked={trainingSettings.is_applicable_to_all === false}
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
                          checked={trainingSettings.user_roles?.includes("coordinator")}
                          label="Co-ordinators"
                          onChange={() => {
                            if(trainingSettings.user_roles?.includes("coordinator")) {
                              let data = trainingSettings.user_roles.filter(t => t !== "coordinator");
                              setTrainingSettings(prevState => ({
                                ...prevState,
                                user_roles: [...data]
                              }));
                            }

                            if(!trainingSettings.user_roles?.includes("coordinator"))
                              setTrainingSettings(prevState => ({
                              ...prevState,
                              user_roles: [...trainingSettings.user_roles, "coordinator"]
                          }))}} />
                      </Form.Group>
                      <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox1">
                        <Form.Check 
                          type="checkbox" 
                          label="Educator"
                          checked={trainingSettings.user_roles?.includes("educator")}
                          onChange={() => {
                            if(trainingSettings.user_roles?.includes("educator")) {
                              let data = trainingSettings.user_roles.filter(t => t !== "educator");
                              setTrainingSettings(prevState => ({
                                ...prevState,
                                user_roles: [...data]
                              }));
                            }

                            if(!trainingSettings.user_roles?.includes("educator"))
                              setTrainingSettings(prevState => ({
                              ...prevState,
                              user_roles: [...trainingSettings.user_roles, "educator"]
                          }))}} />
                      </Form.Group>
                      <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox3">
                        <Form.Check 
                          type="checkbox" 
                          label="All Roles"
                          checked={trainingSettings.user_roles?.length === 2}
                          onChange={() => {
                            if(trainingSettings.user_roles?.includes("coordinator") 
                                && trainingSettings.user_roles.includes("educator")) {
                                  setTrainingSettings(prevState => ({
                                    ...prevState,
                                    user_roles: [],
                                  }));
                                }
                              
                            if(!trainingSettings.user_roles?.includes("coordinator") 
                                && !trainingSettings.user_roles.includes("educator"))
                              setTrainingSettings(prevState => ({
                                ...prevState,
                                user_roles: ["coordinator", "educator"]
                              })
                          )}} />
                      </Form.Group>
                    </div>
                  </div>

                  <div lg={9} md={6} className={`mt-3 mt-md-0 ${trainingSettings.is_applicable_to_all === true ? "d-none": ""}`}>
                    <Col>
                      <Form.Group>
                        <Form.Label>Select User Names</Form.Label>
                        <Multiselect
                          placeholder={fetchedFranchiseeUsers ? "Select User Names" : "No User Available"}
                          displayValue="key"
                          selectedValues={trainingSettings.assigned_users_obj}
                          className="multiselect-box default-arrow-select"
                          onKeyPressFn={function noRefCheck() {}}
                          onRemove={function noRefCheck(data) {
                            setTrainingSettings((prevState) => ({
                              ...prevState,
                              assigned_users: [...data.map(data => data.id)],
                              assigned_users_obj: [...data.map(data => data)]
                            }));
                          }}
                          onSearch={function noRefCheck() {}}
                          onSelect={function noRefCheck(data) {
                            setTrainingSettings((prevState) => ({
                              ...prevState,
                              assigned_users: [...data.map((data) => data.id)],
                              assigned_users_obj: [...data.map(data => data)]
                            }));
                          }}
                          options={fetchedFranchiseeUsers}
                        />
                        
                      </Form.Group>
                    </Col>
                  </div>
                </Col>
              </Row>
            </div>
          }
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
        createTrainingModal && 
        <Modal
          show={createTrainingModal}
          onHide={() => setCreateTrainingModal(false)}>
          <Modal.Header>
            <Modal.Title>
              Updating Training
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="create-training-modal" style={{ textAlign: 'center' }}>
              <p>This may take some time.</p>
              <p>Please Wait...</p>
            </div>
          </Modal.Body>

          <Modal.Footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {
            loader === true && <div>
              <ReactBootstrap.Spinner animation="border" />
            </div>
          }
          </Modal.Footer>
        </Modal>
      }
    </div>
  );
};

export default EditTraining;
