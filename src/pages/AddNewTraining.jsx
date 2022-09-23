
import React, { useEffect, useState, useRef } from 'react';
import { Button, Col, Container, Row, Form, Modal } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Multiselect from 'multiselect-react-dropdown';
import DropOneFile from '../components/DragDrop';
import DropAllFile from '../components/DragDropMultiple';
import axios from 'axios';
import { TrainingFormValidation } from '../helpers/validation'
import { BASE_URL } from '../components/App';
import * as ReactBootstrap from 'react-bootstrap';

import DragDropTraning from '../components/DragDropTraning';
import ImageCropTraning from '../components/ImageCropPopup/ImageCropTraning';

const animatedComponents = makeAnimated();

const timeqty = [
  {
    value: 'minutes',
    label: 'Minutes',
  },
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

// HELPER FUNCTION FOR TRAINING SETTINGS VALIDATION
const validateTrainingSettings = (trainingSettings) => {
  let errors = {};
  let {
    start_date,
    start_time
  } = trainingSettings;

  if (!start_date)
    errors.start_date = "Choose a start date!";

  if (!start_time)
    errors.start_time = "Choose a start time!";

  return errors;
}

const AddNewTraining = () => {
  // const [show, setShow] = useState(false);
  // const handleClose = () => setShow(false);

  // USE REF
  let title = useRef(null);
  let category_id = useRef(null);
  let description = useRef(null);
  let meta_description = useRef(null);
  let time_required_to_complete = useRef(null);

  // CUSTOM STATES
  const [loader, setLoader] = useState(false);
  const [createTrainingModal, setCreateTrainingModal] = useState(false);
  const [saveSettingsToast, setSaveSettingsToast] = useState(null);
  const [error, setError] = useState(false);
  const [trainingData, setTrainingData] = useState({
    time_unit: "Minutes",
    title: "",
    description: "",
    meta_description: "",
    category_id: "",
    time_required_to_complete: "",
    training_form_id: null
  });
  const [trainingSettings, setTrainingSettings] = useState({
    start_date: "",
    start_time: "",
    send_to_all_franchisee: false,
    applicable_to: 'roles',
    assigned_franchisee: [],
    assigned_roles: [],
    assigned_users: []
  });
  const [userRoles, setUserRoles] = useState([]);
  const [franchiseeList, setFranchiseeList] = useState();
  const [settingsModalPopup, setSettingsModalPopup] = useState(false);
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [trainingCategory, setTrainingCategory] = useState([]);
  const [coverImage, setCoverImage] = useState({});
  const [videoTutorialFiles, setVideoTutorialFiles] = useState([]);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState("Special DayCare, Sydney");
  const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState([]);
  const [trainingFormData, setTrainingFormData] = useState([]);
  const [docErrorMessage, setDocErrorMessage] = useState(null);


  const [popupVisible, setPopupVisible] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  // LOG MESSAGES
  const [errors, setErrors] = useState({});
  console.log(errors, "errors")

  const [trainingSettingErrors, setTrainingSettingErrors] = useState({});
  const [topErrorMessage, setTopErrorMessage] = useState(null);
  const [videoFileErrorMessage, setVideoFileErrorMessage] = useState(null);

  // FETCHING FRANCHISEE LIST
  const fetchFranchiseeList = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/role/franchisee`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.status === "success") {
      setFranchiseeList(response.data.franchiseeList.map(data => ({
        id: data.id,
        cat: data.franchisee_alias,
        key: `${data.franchisee_name}, ${data.city}`
      })));
    }
  };

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

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

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

    console.log('Training Details Response:', response);

    if (response.status === 201 && response.data.status === "success") {
      let { id } = response.data.training;

      const blob = await fetch(croppedImage.getAttribute('src')).then((res) => res.blob());
      let data = new FormData();
      data.append('id', id);
      data.append('image', blob);

      let imgSaveResponse = await axios.post(
        `${BASE_URL}/training/coverImg?title="training"`, data, {
        headers: {
          "Authorization": "Bearer " + token
        }
      }
      );

      if (imgSaveResponse.status === 201 && imgSaveResponse.data.status === "success") {
        setLoader(false)
        localStorage.setItem('success_msg', 'Training Created Successfully');
        // localStorage.setItem('active_tab', '/created-training');
        window.location.href = "/training-createdby-me";
      } else {
        setTopErrorMessage("unable to save cover image");
        setTimeout(() => {
          setTopErrorMessage(null);
        }, 3000)
      }
    } else if (response.status === 200 && response.data.status === "fail") {
      const { msg } = response.data;
      setTopErrorMessage(msg);
      setLoader(false);
      setCreateTrainingModal(false);
      setTimeout(() => {
        setTopErrorMessage(null);
      }, 3000)
    }
  };

  // FUNCTION TO FETCH USERS OF A PARTICULAR FRANCHISEE


  const fetchFranchiseeUsers = async (franchisee_id) => {

    let f_id = localStorage.getItem('user_role') === 'franchisor_admin' ? franchisee_id : selectedFranchisee;
    const response = await axios.post(`${BASE_URL}/auth/users/franchisees?franchiseeId=${f_id}`);
    if (response.status === 200 && response.data.status === "success") {
      const { users } = response.data;
      setFetchedFranchiseeUsers([
        ...users?.map((data) => ({
          id: data.id,
          cat: data.fullname.toLowerCase().split(" ").join("_"),
          key: data.fullname
        })),
      ]);
    }
    // }
  };

  // FETCHING TRAINING FORM DATA
  const fetchTrainingFormData = async () => {
    const response = await axios.get(`${BASE_URL}/training/forms/training`);

    if (response.status === 200 && response.data.status === "success") {
      const { formData } = response.data;
      setTrainingFormData(formData.map(d => ({
        id: d.id,
        label: d.form_name,
        value: d.form_name
      })));
    }
  }

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
      console.log('CATEGORY:',)
      setTrainingCategory([
        ...categoryList.map((data) => ({
          id: data.id,
          value: data.category_name,
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
      [name]: value.trim(),
    }));
  };

  // const [err, seterr] = useState(false)

  // AUTOFOCUS ON TRAINING
  const setAutoFocusOnTraining = (errorObj) => {
    let errArray = Object.keys(errorObj);
    
    if(errArray.includes("title")) {
      title?.current?.focus();
    } else if(errArray.includes("category_id")) {
      category_id?.current?.focus();
    } else if(errArray.includes("description")) {
      description?.current?.focus();
    } else if(errArray.includes("meta_description")) {
      meta_description?.current?.focus();
    } else if(errArray.includes("time_required_to_complete")) {
      time_required_to_complete?.current?.focus();
    } 
  }

  const handleDataSubmit = event => {
    event.preventDefault();
    // window.scrollTo(0, 0);
    console.log(coverImage, "coverImage")
    let errorObj = TrainingFormValidation(trainingData, relatedFiles);
    console.log(errorObj);
    if (Object.keys(errorObj).length > 0) {
      setErrors(errorObj);
      setAutoFocusOnTraining(errorObj);
    } else {
      setErrors({});
      if (!allowSubmit)
        setSettingsModalPopup(true);
      if (!croppedImage) {
        setError(true);
        return false
      }
      if (settingsModalPopup === false && allowSubmit && trainingData && croppedImage) {

        let data = new FormData();
        for (let [key, values] of Object.entries(trainingSettings)) {
          data.append(`${key}`, values);
        }

        for (let [key, values] of Object.entries(trainingData)) {
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
        createTraining(data);
      }
    }
  };

  const handleTrainingCancel = () => {
    localStorage.setItem('active_tab', '/created-training');
    window.location.href = "/training";
  };

  useEffect(() => {
    setTimeout(() => {
      setSaveSettingsToast(null);
    }, 3000);
  }, [saveSettingsToast]);

  useEffect(() => {
    fetchUserRoles();
    fetchTrainingCategories();
    fetchFranchiseeList();
    fetchTrainingFormData();
  }, []);


  useEffect(() => {
    if (trainingSettings?.assigned_franchisee.length === 0) {
      setTrainingSettings(prevState => ({
        ...prevState,
        assigned_users: []
      }));

      setFetchedFranchiseeUsers([]);
    }

    fetchFranchiseeUsers(trainingSettings?.assigned_franchisee);
  }, [trainingSettings.assigned_franchisee]);

  useEffect(() => {
    if (localStorage.getItem('user_role') === 'guardian') {
      window.location.href = `/parents-dashboard`;
    }
  }, []);

  useEffect(() => {
    if(localStorage.getItem('user_role') !== 'franchisor_admin') {
      setTrainingSettings(prevState => ({
        ...prevState,
        assigned_franchisee: [selectedFranchisee]
      }));
    }
  }, [selectedFranchisee]);

  useEffect(() => {
    if(relatedFiles?.length < 5) {
      setErrors(prevState => ({
        ...prevState,
        doc: null
      }));
    }
  }, [relatedFiles]);

  trainingSettings && console.log('TRAINING SETTINGS:', trainingSettings);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div id="main">
        {
          saveSettingsToast && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{saveSettingsToast}</p>
        }
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
                  <div className="training-form error-sec">
                    <Row>

                      <Col md={6} className="mb-3 relative">
                        <Form.Group>
                          <Form.Label>Training Name *</Form.Label>
                          <Form.Control
                            type="text"
                            maxLength={100}
                            name="title"
                            ref={title}
                            onChange={(e) => {
                              // if (trainingData.title.length <= 20) {
                              setTrainingData(prevState => ({
                                ...prevState,
                                title: e.target.value
                              }));
                              // }

                              if (trainingData.title.length > 2) {
                                setErrors(prevState => ({
                                  ...prevState,
                                  title_length: null
                                }));
                              }

                              setErrors(prevState => ({
                                ...prevState,
                                title: null
                              }));
                            }}
                          />
                          {errors.title !== null && <span className="error">{errors.title}</span>}
                          {errors.title === null && errors.title_length !== null && <span className="error">{errors.title_length}</span>}
                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3 relative">
                        <Form.Group>
                          <Form.Label>Training Category *</Form.Label>
                          <Select
                            closeMenuOnSelect={true}
                            placeholder="Select"
                            ref={category_id}
                            components={animatedComponents}
                            options={trainingCategory}
                            onChange={(event) => {
                              setTrainingData((prevState) => ({
                                ...prevState,
                                category_id: event.id,
                              }));

                              setErrors(prevState => ({
                                ...prevState,
                                category_id: null
                              }));
                            }}
                          />
                          {errors.category_id && <span className="error">{errors.category_id}</span>}
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mb-3 relative">
                        <Form.Group>
                          <Form.Label>Training Description *</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="description"
                            ref={description}
                            rows={3}
                            onChange={(e) => {
                              handleTrainingData(e);
                              setErrors(prevState => ({
                                ...prevState,
                                description: null
                              }));
                            }}
                          />
                          {errors.description !== null && <span className="error">{errors.description}</span>}
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mb-3 relative">
                        <Form.Group>
                          <Form.Label>Meta Description *</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="meta_description"
                            ref={meta_description}
                            maxLength={255}
                            rows={3}
                            onChange={(e) => {
                              if (trainingData.meta_description.length >= 0 && trainingData.meta_description.length <= 250) {
                                setTrainingData(prevState => ({
                                  ...prevState,
                                  meta_description: e.target.value
                                }));
                              }
                              setErrors(prevState => ({
                                ...prevState,
                                meta_description: null
                              }));
                            }}
                          />
                          {errors.meta_description !== null && <span className="error">{errors.meta_description}</span>}
                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3 relative">
                        <Form.Group>
                          <Form.Label>Time required to complete*</Form.Label>
                          <div className="timelimit" style={{ display: "flex", gap: "5px" }}>
                            <Form.Control
                              style={{ flex: 6 }}
                              type="number"
                              ref={time_required_to_complete}
                              max={9999}
                              value={trainingData?.time_required_to_complete || ""}
                              onChange={(event) => {
                                if(parseInt(event.target.value) < 10000) {
                                  setTrainingData((prevState) => ({
                                    ...prevState,
                                    time_required_to_complete: parseInt(event.target.value),
                                  }));

                                  setErrors(prevState => ({
                                    ...prevState,
                                    time_required_to_complete: null
                                  }));
                                } else {
                                  setTrainingData((prevState) => ({
                                    ...prevState,
                                    time_required_to_complete: event.target.value.slice(0, -1),
                                  }));
                                }
                              }}
                            />
                            <Select
                              style={{ flex: 3 }}
                              closeMenuOnSelect={true}
                              Multiselect={false}
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
                          {errors.time_required_to_complete !== null && <span className="error">{errors.time_required_to_complete}</span>}
                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3 relative">
                        <Form.Group>
                          <Form.Label>Select Training Form</Form.Label>
                          <Select
                            closeMenuOnSelect={true}
                            placeholder="Select"
                            components={animatedComponents}
                            options={trainingFormData}
                            onChange={(event) => {
                              setTrainingData((prevState) => ({
                                ...prevState,
                                training_form_id: event.id,
                              }));
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>

                      <Col md={6} className="mb-3 relative">
                        <Form.Group>
                          <Form.Label>Upload Cover Image *</Form.Label>
                          {/* <DropOneFile
                            title="Image"
                            croppedImage={croppedImage}
                            setCroppedImage={setCroppedImage}
                            onSave={setCoverImage}
                            setPopupVisible={setPopupVisible}
                            fetchedPhoto={""}
                            setErrors={setErrors}
                          // setTrainingData={setTraining}
                          /> */}

                          {console.log(croppedImage, "croppedImage", coverImage)}
                          <DragDropTraning
                            croppedImage={croppedImage}
                            setCroppedImage={setCroppedImage}
                            onSave={setCoverImage}
                            setPopupVisible={setPopupVisible}
                            fetchedPhoto={""}
                          />

                          {
                            popupVisible &&
                            <ImageCropTraning
                              image={coverImage}
                              setCroppedImage={setCroppedImage}
                              setPopupVisible={setPopupVisible} />
                          }
                          <small className="fileinput mt-1">(png, jpg & jpeg)</small>
                          {error && !croppedImage && < span className="error"> Cover image is required</span>}
                          {/* {errors.croppedImage !== null && <span className="error">{errors.croppedImage}</span>} */}

                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3 relative">
                        <Form.Group>
                          <Form.Label>Upload Videos</Form.Label>
                          <DropAllFile
                            title="Videos"
                            type="video"
                            setUploadError={setVideoFileErrorMessage}
                            onSave={setVideoTutorialFiles}
                          />
                          <small className="fileinput">(mp4, flv & mkv)</small>
                          <small className="fileinput">(max. 5 video files, less than 1GB each)</small>
                          {
                            videoFileErrorMessage  &&
                            videoFileErrorMessage.map(errorObj => {
                              return (
                                // errorObj?.error[0].message
                                <p style={{ color: 'tomato', fontSize: '12px' }}>{"Video file should be less than 1GB in size"}</p>
                              )
                            })
                          }
                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3 relative">
                        <Form.Group>
                          <Form.Label>Upload Files</Form.Label>
                          <DropAllFile
                            setUploadError={setDocErrorMessage}
                            onSave={setRelatedFiles}
                          />
                          <small className="fileinput">(pdf, doc, ppt, xlsx and other documents)</small>
                          <small className="fileinput">(max. 5 documents, less than 5MB each)</small>
                          {
                            docErrorMessage  &&
                            docErrorMessage.map(errorObj => {
                              return (
                                // errorObj?.error[0].message
                                <p style={{ color: 'tomato', fontSize: '12px' }}>{"File should be less than 5MB in size"}</p>
                              )
                            })
                          }
                          { errors.doc !== null && <span className="error">{errors.doc}</span> }
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <div className="cta text-center mt-5 mb-5">
                          <Button
                            variant="outline"
                            className="me-3"
                            type="submit"
                            onClick={handleTrainingCancel}
                          >
                            Cancel
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
      
      {
          localStorage.getItem('user_role') === 'franchisor_admin'
          ?
          (<Modal
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
                      <Form.Label>Start Date *</Form.Label>
                      <Form.Control
                        type="date"
                        name="start_date"
                        value={trainingSettings?.start_date}
                        min={new Date().toISOString().slice(0, 10)}
                        onChange={(e) => {
                          handleTrainingSettings(e);

                          setTrainingSettingErrors(prevState => ({
                            ...prevState,
                            start_date: null
                          }));
                        }}
                      />
                      {trainingSettingErrors.start_date !== null && <span className="error">{trainingSettingErrors.start_date}</span>}
                    </Form.Group>
                  </Col>
                  <Col lg={3} sm={6} className="mt-3 mt-sm-0">
                    <Form.Group>
                      <Form.Label>Start Time *</Form.Label>
                      <Form.Control
                        type="time"
                        name="start_time"
                        style={{ zIndex: "9999999 !important" }}
                        value={trainingSettings?.start_time}
                        onChange={(e) => {
                          handleTrainingSettings(e);
                          setTrainingSettingErrors(prevState => ({
                            ...prevState,
                            start_time: null
                          }));
                        }}
                      />
                      {trainingSettingErrors.start_time !== null && <span className="error">{trainingSettingErrors.start_time}</span>}
                    </Form.Group>
                  </Col>
                  <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                    <Form.Group>
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="end_date"
                        value={trainingSettings?.end_date}
                        onChange={(e) => {
                          handleTrainingSettings(e);
                          setTrainingSettingErrors(prevState => ({
                            ...prevState,
                            start_time: null
                          }));
                        }}
                        min={trainingSettings?.start_date}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                    <Form.Group>
                      <Form.Label>End Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="end_time"
                        value={trainingSettings?.end_time}
                        onChange={handleTrainingSettings}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label>Give access to all franchises</Form.Label>
                      <div className="new-form-radio d-block">
                        <div className="new-form-radio-box">
                          <label for="all">
                            <input
                              type="radio"
                              checked={trainingSettings?.send_to_all_franchisee === true}
                              name="send_to_all_franchisee"
                              id="all"
                              onChange={() => {
                                setTrainingSettings(prevState => ({
                                  ...prevState,
                                  send_to_all_franchisee: true,
                                  assigned_franchisee: ['all']
                                }));
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
                              checked={trainingSettings?.send_to_all_franchisee === false}
                              id="none"
                              onChange={() => {
                                setTrainingSettings(prevState => ({
                                  ...prevState,
                                  send_to_all_franchisee: false,
                                  assigned_franchisee: []
                                }));
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
                      <Form.Label>Select Franchise(s)</Form.Label>
                      <div className="select-with-plus">
                        <Multiselect
                          disable={trainingSettings?.send_to_all_franchisee === true}
                          // singleSelect={true}
                          placeholder={"Select"}
                          displayValue="key"
                          selectedValues={franchiseeList?.filter(d => trainingSettings?.assigned_franchisee?.includes(parseInt(d.id)))}
                          className="multiselect-box default-arrow-select"
                          onKeyPressFn={function noRefCheck() { }}
                          onRemove={function noRefCheck(data) {
                            setTrainingSettings((prevState) => ({
                              ...prevState,
                              assigned_franchisee: [...data.map(data => data.id)],
                            }));
                          }}
                          onSearch={function noRefCheck() { }}
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
                      <Form.Label>Accessible to</Form.Label>
                      <div>
                        <div className="new-form-radio-box">
                          <label htmlFor="yes1">
                            <input
                              type="radio"
                              value="Y"
                              name="roles"
                              checked={trainingSettings?.applicable_to === 'roles'}
                              id="yes1"
                              onChange={(event) => {
                                setTrainingSettings((prevState) => ({
                                  ...prevState,
                                  applicable_to: 'roles',
                                }));

                                setTrainingSettings((prevState) => ({
                                  ...prevState,
                                  assigned_users: [],
                                  assigned_users_data: []
                                }));
                              }}
                            />
                            <span className="radio-round"></span>
                            <p>User Roles</p>
                          </label>
                        </div>
                        <div className="new-form-radio-box" style={{ marginLeft: 0, marginTop: '10px' }}>
                          <label htmlFor="no1">
                            <input
                              type="radio"
                              value="N"
                              name="roles"
                              checked={trainingSettings?.applicable_to === 'users'}
                              id="no1"
                              onChange={(event) => {
                                setTrainingSettings((prevState) => ({
                                  ...prevState,
                                  applicable_to: 'users'
                                }));

                                setTrainingSettings((prevState) => ({
                                  ...prevState,
                                  assigned_roles: []
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
                    <div className={`custom-checkbox ${trainingSettings.applicable_to === 'users' ? "d-none" : ""}`}>
                      <Form.Label className="d-block">Select User Roles</Form.Label>
                      <div className="btn-checkbox d-block">
                        <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox">
                          <Form.Check
                            type="checkbox"
                            checked={trainingSettings.assigned_roles?.includes("franchisee_admin")}
                            label="Franchisee Admin"
                            onChange={() => {
                              if (trainingSettings.assigned_roles.includes("franchisee_admin")) {
                                let data = trainingSettings.assigned_roles.filter(t => t !== "franchisee_admin");
                                setTrainingSettings(prevState => ({
                                  ...prevState,
                                  assigned_roles: [...data]
                                }));
                              }

                              if (!trainingSettings.assigned_roles.includes("franchisee_admin"))
                                setTrainingSettings(prevState => ({
                                  ...prevState,
                                  assigned_roles: [...trainingSettings.assigned_roles, "franchisee_admin"]
                                }))
                            }} />
                        </Form.Group>
                        <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox1">
                          <Form.Check
                            type="checkbox"
                            checked={trainingSettings.assigned_roles?.includes("coordinator")}
                            label="Coordinator"
                            onChange={() => {
                              if (trainingSettings.assigned_roles.includes("coordinator")) {
                                let data = trainingSettings.assigned_roles.filter(t => t !== "coordinator");
                                setTrainingSettings(prevState => ({
                                  ...prevState,
                                  assigned_roles: [...data]
                                }));
                              }

                              if (!trainingSettings.assigned_roles.includes("coordinator"))
                                setTrainingSettings(prevState => ({
                                  ...prevState,
                                  assigned_roles: [...trainingSettings.assigned_roles, "coordinator"]
                                }))
                            }} />
                        </Form.Group>
                        <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox2">
                          <Form.Check
                            type="checkbox"
                            label="Educator"
                            checked={trainingSettings.assigned_roles.includes("educator")}
                            onChange={() => {
                              if (trainingSettings.assigned_roles.includes("educator")) {
                                let data = trainingSettings.assigned_roles.filter(t => t !== "educator");
                                setTrainingSettings(prevState => ({
                                  ...prevState,
                                  assigned_roles: [...data]
                                }));
                              }

                              if (!trainingSettings.assigned_roles.includes("educator"))
                                setTrainingSettings(prevState => ({
                                  ...prevState,
                                  assigned_roles: [...trainingSettings.assigned_roles, "educator"]
                                }))
                            }} />
                        </Form.Group>
                        <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox3">
                          <Form.Check
                            type="checkbox"
                            label="All Roles"
                            checked={trainingSettings.assigned_roles.length === 3}
                            onChange={() => {

                              if(trainingSettings?.assigned_roles?.length > 0) {
                                setTrainingSettings(prevState => ({
                                  ...prevState,
                                  assigned_roles: ["franchisee_admin", "coordinator", "educator"]
                                }));
                              }

                              if (trainingSettings.assigned_roles.includes("franchisee_admin")
                                && trainingSettings.assigned_roles.includes("coordinator")
                                && trainingSettings.assigned_roles.includes("educator")) {
                                setTrainingSettings(prevState => ({
                                  ...prevState,
                                  assigned_roles: [],
                                }));
                              }

                              if (!trainingSettings.assigned_roles.includes("franchisee_admin")
                                && !trainingSettings.assigned_roles.includes("coordinator")
                                && !trainingSettings.assigned_roles.includes("educator"))
                                setTrainingSettings(prevState => ({
                                  ...prevState,
                                  assigned_roles: ["franchisee_admin", "coordinator", "educator"]
                                })
                                )
                            }} />
                        </Form.Group>
                      </div>
                    </div>

                    <div className={`mt-3 mt-md-0 ${trainingSettings.applicable_to === 'roles' ? "d-none" : ""}`}>
                      <Form.Group>
                        <Form.Label>Select User Names</Form.Label>
                        <Multiselect
                          placeholder={fetchedFranchiseeUsers ? "Select" : "No User Available"}
                          displayValue="key"
                          selectedValues={fetchedFranchiseeUsers.filter(d => trainingSettings.assigned_users.includes(parseInt(d.id)))}
                          className="multiselect-box default-arrow-select"
                          onKeyPressFn={function noRefCheck() { }}
                          onRemove={function noRefCheck(data) {
                            setTrainingSettings((prevState) => ({
                              ...prevState,
                              assigned_users: [...data.map(data => data.id)],
                            }));
                          }}
                          onSearch={function noRefCheck() { }}
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
                    </div>
                  </Col>
                </Row>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="transparent" onClick={() => setSettingsModalPopup(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => {
                let settingErrors = validateTrainingSettings(trainingSettings);
                if (Object.keys(settingErrors).length > 0) {
                  setTrainingSettingErrors(settingErrors);
                } else {
                  console.log('CLOSING POPUP');
                  setAllowSubmit(true);
                  setSaveSettingsToast('Settings saved successfully.');
                  setSettingsModalPopup(false);
                }
              }}>
                Save Settings
              </Button>
            </Modal.Footer>
          </Modal>
          )
          :
          (<Modal
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
                      <Form.Label>Start Date *</Form.Label>
                      <Form.Control
                        type="date"
                        name="start_date"
                        value={trainingSettings?.start_date}
                        min={new Date().toISOString().slice(0, 10)}
                        onChange={(e) => {
                          handleTrainingSettings(e);

                          setTrainingSettingErrors(prevState => ({
                            ...prevState,
                            start_date: null
                          }));
                        }}
                      />
                      {trainingSettingErrors.start_date !== null && <span className="error">{trainingSettingErrors.start_date}</span>}
                    </Form.Group>
                  </Col>
                  <Col lg={3} sm={6} className="mt-3 mt-sm-0">
                    <Form.Group>
                      <Form.Label>Start Time *</Form.Label>
                      <Form.Control
                        type="time"
                        name="start_time"
                        style={{ zIndex: "9999999 !important" }}
                        value={trainingSettings?.start_time}
                        onChange={(e) => {
                          handleTrainingSettings(e);
                          setTrainingSettingErrors(prevState => ({
                            ...prevState,
                            start_time: null
                          }));
                        }}
                      />
                      {trainingSettingErrors.start_time !== null && <span className="error">{trainingSettingErrors.start_time}</span>}
                    </Form.Group>
                  </Col>
                  <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                    <Form.Group>
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="end_date"
                        value={trainingSettings?.end_date}
                        onChange={(e) => {
                          handleTrainingSettings(e);
                          setTrainingSettingErrors(prevState => ({
                            ...prevState,
                            start_time: null
                          }));
                        }}
                        min={trainingSettings?.start_date}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                    <Form.Group>
                      <Form.Label>End Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="end_time"
                        value={trainingSettings?.end_time}
                        onChange={handleTrainingSettings}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label>Accessible to</Form.Label>
                      <div>
                        <div className="new-form-radio-box">
                          <label htmlFor="yes1">
                            <input
                              type="radio"
                              value="Y"
                              name="roles"
                              checked={trainingSettings?.applicable_to === 'roles'}
                              id="yes1"
                              onChange={(event) => {
                                setTrainingSettings((prevState) => ({
                                  ...prevState,
                                  applicable_to: 'roles',
                                }));

                                setTrainingSettings((prevState) => ({
                                  ...prevState,
                                  assigned_users: [],
                                  assigned_users_data: []
                                }));
                              }}
                            />
                            <span className="radio-round"></span>
                            <p>User Roles</p>
                          </label>
                        </div>
                        <div className="new-form-radio-box" style={{ marginLeft: 0, marginTop: '10px' }}>
                          <label htmlFor="no1">
                            <input
                              type="radio"
                              value="N"
                              name="roles"
                              checked={trainingSettings?.applicable_to === 'users'}
                              id="no1"
                              onChange={(event) => {
                                setTrainingSettings((prevState) => ({
                                  ...prevState,
                                  applicable_to: 'users'
                                }));

                                setTrainingSettings((prevState) => ({
                                  ...prevState,
                                  assigned_roles: []
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
                    <div className={`custom-checkbox ${trainingSettings.applicable_to === 'users' ? "d-none" : ""}`}>
                      <Form.Label className="d-block">Select User Roles</Form.Label>
                      <div className="btn-checkbox d-block">
                        {
                          localStorage.getItem('user_role') === "franchisor_admin" &&
                          <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox">
                            <Form.Check
                              type="checkbox"
                              checked={trainingSettings.assigned_roles?.includes("franchisee_admin")}
                              label="Franchisee Admin"
                              onChange={() => {
                                if (trainingSettings.assigned_roles.includes("franchisee_admin")) {
                                  let data = trainingSettings.assigned_roles.filter(t => t !== "franchisee_admin");
                                  setTrainingSettings(prevState => ({
                                    ...prevState,
                                    assigned_roles: [...data]
                                  }));
                                }

                                if (!trainingSettings.assigned_roles.includes("franchisee_admin"))
                                  setTrainingSettings(prevState => ({
                                    ...prevState,
                                    assigned_roles: [...trainingSettings.assigned_roles, "franchisee_admin"]
                                  }))
                              }} />
                          </Form.Group>
                        }
                        <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox1">
                          <Form.Check
                            type="checkbox"
                            checked={trainingSettings.assigned_roles?.includes("coordinator")}
                            label="Coordinator"
                            onChange={() => {
                              if (trainingSettings.assigned_roles.includes("coordinator")) {
                                let data = trainingSettings.assigned_roles.filter(t => t !== "coordinator");
                                setTrainingSettings(prevState => ({
                                  ...prevState,
                                  assigned_roles: [...data]
                                }));
                              }

                              if (!trainingSettings.assigned_roles.includes("coordinator"))
                                setTrainingSettings(prevState => ({
                                  ...prevState,
                                  assigned_roles: [...trainingSettings.assigned_roles, "coordinator"]
                                }))
                            }} />
                        </Form.Group>
                        <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox2">
                          <Form.Check
                            type="checkbox"
                            label="Educator"
                            checked={trainingSettings.assigned_roles.includes("educator")}
                            onChange={() => {
                              if (trainingSettings.assigned_roles.includes("educator")) {
                                let data = trainingSettings.assigned_roles.filter(t => t !== "educator");
                                setTrainingSettings(prevState => ({
                                  ...prevState,
                                  assigned_roles: [...data]
                                }));
                              }

                              if (!trainingSettings.assigned_roles.includes("educator"))
                                setTrainingSettings(prevState => ({
                                  ...prevState,
                                  assigned_roles: [...trainingSettings.assigned_roles, "educator"]
                                }))
                            }} />
                        </Form.Group>

                        {
                          localStorage.getItem('user_role') === 'franchisor_admin'
                          ?(
                            <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox3">
                              <Form.Check
                                type="checkbox"
                                label="All Roles"
                                checked={trainingSettings.assigned_roles.length === 3}
                                onChange={() => {
                                  if(trainingSettings?.assigned_roles?.length > 0) {
                                    setTrainingSettings(prevState => ({
                                      ...prevState,
                                      assigned_roles: ["franchisee_admin", "coordinator", "educator"]
                                    }));
                                  }

                                  if (trainingSettings.assigned_roles.includes("franchisee_admin")
                                    && trainingSettings.assigned_roles.includes("coordinator")
                                    && trainingSettings.assigned_roles.includes("educator")) {
                                    setTrainingSettings(prevState => ({
                                      ...prevState,
                                      assigned_roles: [],
                                    }));
                                  }

                                  if (!trainingSettings.assigned_roles.includes("franchisee_admin")
                                    && !trainingSettings.assigned_roles.includes("coordinator")
                                    && !trainingSettings.assigned_roles.includes("educator"))
                                    setTrainingSettings(prevState => ({
                                      ...prevState,
                                      assigned_roles: ["franchisee_admin", "coordinator", "educator"]
                                    })
                                    )
                                }} />
                            </Form.Group>
                          )
                          :(
                            <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox3">
                              <Form.Check
                                type="checkbox"
                                label="All Roles"
                                checked={trainingSettings.assigned_roles.length === 2}
                                onChange={() => {
                                  if(trainingSettings?.assigned_roles?.length > 0) {
                                    setTrainingSettings(prevState => ({
                                      ...prevState,
                                      assigned_roles: ["coordinator", "educator"]
                                    }));
                                  }

                                  if (trainingSettings.assigned_roles.includes("coordinator")
                                    && trainingSettings.assigned_roles.includes("educator")) {
                                    setTrainingSettings(prevState => ({
                                      ...prevState,
                                      assigned_roles: [],
                                    }));
                                  }

                                  if (!trainingSettings.assigned_roles.includes("coordinator")
                                    && !trainingSettings.assigned_roles.includes("educator"))
                                    setTrainingSettings(prevState => ({
                                      ...prevState,
                                      assigned_roles: ["coordinator", "educator"]
                                    })
                                    )
                                }} />
                            </Form.Group>
                          )
                        }
                      </div>
                    </div>

                    <div className={`mt-3 mt-md-0 ${trainingSettings.applicable_to === 'roles' ? "d-none" : ""}`}>
                      <Form.Group>
                        <Form.Label>Select User Names</Form.Label>
                        <Multiselect
                          placeholder={fetchedFranchiseeUsers ? "Select" : "No User Available"}
                          displayValue="key"
                          selectedValues={fetchedFranchiseeUsers.filter(d => trainingSettings.assigned_users.includes(parseInt(d.id)))}
                          className="multiselect-box default-arrow-select"
                          onKeyPressFn={function noRefCheck() { }}
                          onRemove={function noRefCheck(data) {
                            setTrainingSettings((prevState) => ({
                              ...prevState,
                              assigned_users: [...data.map(data => data.id)],
                            }));
                          }}
                          onSearch={function noRefCheck() { }}
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
                    </div>
                  </Col>
                </Row>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="transparent" onClick={() => setSettingsModalPopup(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => {
                let settingErrors = validateTrainingSettings(trainingSettings);
                if (Object.keys(settingErrors).length > 0) {
                  setTrainingSettingErrors(settingErrors);
                } else {
                  console.log('CLOSING POPUP');
                  setAllowSubmit(true);
                  setSaveSettingsToast('Settings saved successfully.');
                  setSettingsModalPopup(false);
                }
              }}>
                Save Settings
              </Button>
            </Modal.Footer>
          </Modal>
          )
        }
      {
        createTrainingModal &&
        <Modal
          show={createTrainingModal}
          onHide={() => setCreateTrainingModal(false)}>
          <Modal.Header>
            <Modal.Title>
              Creating Training
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="create-training-modal" style={{ textAlign: 'center' }}>
              <p>This may take some time.</p>
              <p>Please Wait...</p>
            </div>
          </Modal.Body>

          <Modal.Footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

export default AddNewTraining;

