
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
import { EditTrainingFormValidation } from '../helpers/validation';
import { BASE_URL } from '../components/App';
import moment from 'moment';
import * as ReactBootstrap from 'react-bootstrap';
import DragDropTraning from '../components/DragDropTraning';
import ImageCropTraning from '../components/ImageCropPopup/ImageCropTraning';

const animatedComponents = makeAnimated();

const timeqty = [
  {
    value: 'minutes',
    label: 'Minutes'
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

function getTimeUnit(unit) {
  let obj = {
    "Hour(s)": "Hours",
    "Minute(s)": "Minutes",
    "Day(s)": "Days",
    "Week(s)": "Weeks",
    "Month(s)": "Months"
  }

  return obj[unit];
}

// HELPER FUNCTION FOR TRAINING SETTINGS VALIDATION
const validateTrainingSettings = (trainingSettings) => {
  let errors = {};
  let {
    start_date,
    start_time,
    end_date,
    end_time
  } = trainingSettings;

  if (!start_date)
    errors.start_date = "Choose a start date";

  if (!start_time)
    errors.start_time = "Choose a start time";

  if (end_date && end_date < start_date)
    errors.end_date = "End date must be greater than start date";

  if (start_date && start_time && end_date && end_time && start_date === end_date && start_time > end_time)
    errors.end_time = "End time must be greater than start time"


  return errors;
}


// HELPER FUNCTIONS
/* FETCHES RELATED FILE NAME*/
function fetchRealatedFileName(fileURLString) {
  let name = fileURLString.split("/");
  name = name[name.length - 1];
  name = name.split(".");
  let extension = name[1];
  name = name[0].split("-").join(" ");
  name = name.split("_")[0];
  return name + "." + extension;
}

// function convertToArray(objString) {
//   let str;
//   str = objString.substring(1, objString.length - 1); 
//   let data = str.split(",");
//   if(data[0] === '"all"') {
//     return ['all'];
//   } 

//   let parsed = data.map(d => parseInt(d.substring(1, str.length - 1)));
//   return parsed;
// }

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
  const [trainingSettings, setTrainingSettings] = useState({});

  const [fetchedCoverImage, setFetchedCoverImage] = useState();
  const [videoTutorialFiles, setVideoTutorialFiles] = useState([]);
  const [fetchedVideoTutorialFiles, setFetchedVideoTutorialFiles] = useState([]);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [fetchedRelatedFiles, setFetchedRelatedFiles] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState("Special DayCare, Sydney");
  const [franchiseeList, setFranchiseeList] = useState();
  const [sendToAllFranchisee, setSendToAllFranchisee] = useState();
  const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState([]);
  const [fileDeleteResponse, setFileDeleteResponse] = useState();
  const [trainingFormData, setTrainingFormData] = useState([]);
  const [docFileError, setDocFileError] = useState(null);

  // LOG MESSAGES
  const [errors, setErrors] = useState({});
  const [topErrorMessage, setTopErrorMessage] = useState(null);
  const [videoFileErrorMessage, setVideoFileErrorMessage] = useState(null);
  const [docError, setDocError] = useState([]);
  const [videoError, setVideoError] = useState([]);
  const [trainingSettingErrors, setTrainingSettingErrors] = useState(null);

  // IMAGECROPER
  const [coverImage, setCoverImage] = useState({});
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);



  // FETCHING USER ROLES
  const fetchUserRoles = async () => {
    const response = await axios.get(`${BASE_URL}/api/user-role`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')
          }`
      }
    });
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

  const handleTrainingCancel = () => {
    localStorage.setItem('active_tab', '/created-training');
    window.location.href = "/training";
  };

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

  // FUNCTION TO FETCH USERS OF A PARTICULAR FRANCHISEE
  const fetchFranchiseeUsers = async (franchisee_id) => {
    console.log('FRANCHISEE ID>>>>>>>>>>>>>>>>>>>>>', franchisee_id);
    // let f = franchisee_id[0] === 'all' ? "" : [franchisee_id];
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}/auth/users/franchisees?franchiseeId=${franchisee_id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (response.status === 200 && response.data.status === "success") {
      const { users } = response.data;
      setFetchedFranchiseeUsers([
        ...users?.map((data) => ({
          id: data.id,
          cat: data.fullname.toLowerCase().split(" ").join("_"),
          key: `${data.fullname} (${data.email})`
        })),
      ]);
    }
  };


  const fetchTrainingData = async () => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/training/getTrainingByIdCreated/${trainingId}/${userId}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if (response.status === 200 && response.data.status === "success") {
      const { training } = response.data;
      console.log('TRAINING:', training);
      copyDataToStates(training);
    }
  };
  // console.log(editTrainingData, "editTrainingData")



  const copyDataToStates = (training) => {
    // POPULATING STATES WITH THE FETCHED DATA
    setTrainingData(prevState => ({
      ...prevState,
      title: training?.title,
      description: training?.description,
      category_id: training?.category_id,
      meta_description: training?.meta_description,
      time_unit: getTimeUnit(training?.completion_time?.split(" ")[1]),
      time_required_to_complete: training?.completion_time?.split(" ")[0],
      training_form_id: training?.training_form_id,
      addedBy: training?.addedBy
    }));
    setTrainingSettings(prevState => ({
      ...prevState,
      start_date: moment(training?.start_date).format('YYYY-MM-DD'),
      start_time: moment(training?.start_date).format('HH:mm'),
      end_date: training?.end_date ? moment(training?.end_date).format('YYYY-MM-DD') : '',
      end_time: training?.end_date ? moment(training?.end_date).format('HH:mm') : '',
      applicable_to: training?.shares[0]?.applicable_to,
      send_to_all_franchisee: training?.shares[0]?.franchisee[0] === 'all' ? true : false,
      assigned_franchisee: training?.shares[0]?.franchisee,
      assigned_roles: training?.shares[0]?.assigned_roles,
      assigned_users: training?.shares[0]?.assigned_users.includes('undefined') ? [] : training?.shares[0]?.assigned_users
    }));

    // COPYING FETCHED MEDIA FILES

    setCroppedImage(training?.coverImage);
    setFetchedCoverImage(training?.coverImage);
    setFetchedVideoTutorialFiles(training?.training_files?.filter(file => file.fileType === ".mp4"));
    setFetchedRelatedFiles(training?.training_files?.filter(file => file.fileType !== '.mp4'));
  }
  console.log(coverImage, "coverImage")

  // FUNCTION TO SEND TRAINING DATA TO THE DB
  const updateTraining = async (data) => {
    const token = localStorage.getItem('token');

    const response = await axios.put(
      `${BASE_URL}/training/updateTraining/${trainingId}`, data, {
      headers: {
        "Authorization": "Bearer " + token
      }
    }
    );

    if (response.status === 201 && response.data.status === "success") {
      let data = new FormData();

      let imgSaveResponse;


      if (typeof croppedImage === 'object') {

        data.append('id', trainingId);
        imgSaveResponse = await fetch(croppedImage.getAttribute('src')).then((res) => res.blob());
        data.append('image', imgSaveResponse);

        imgSaveResponse = await axios.post(
          `${BASE_URL}/training/coverImg?title=training`, data, {
          headers: {
            "Authorization": "Bearer " + token
          }
        });

      } else if (typeof croppedImage === 'string') {
        imgSaveResponse = await axios.patch(
          `${BASE_URL}/training/updateCoverImgString`, { croppedImage, trainingId }, {
          headers: {
            "Authorization": "Bearer " + token
          }
        });
      }
      console.log(imgSaveResponse, "imgSaveResponse")

      if (imgSaveResponse.status === 201 && imgSaveResponse.data.status === "success") {
        setLoader(false)
        setCreateTrainingModal(false);
        localStorage.setItem('success_msg', 'Training Updated Successfully');
        localStorage.setItem('active_tab', '/created-training');
        window.location.href = "/training";
      }
      else {
        setLoader(false)
        setCreateTrainingModal(false);
        setTopErrorMessage("unable to save cover image!");
        setTimeout(() => {
          setTopErrorMessage(null);
        }, 3000)
      }
    } else {
      setLoader(false)
      setCreateTrainingModal(false);
      setTopErrorMessage(response.data.msg);
      setTimeout(() => {
        setTopErrorMessage(null);
      }, 3000)
    }
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

    if (errors.doc === null) {
      window.scrollTo(0, 0);
    }

    let errorObj = EditTrainingFormValidation(trainingData, relatedFiles, fetchedRelatedFiles, fetchedVideoTutorialFiles, videoTutorialFiles);
    if (Object.keys(errorObj).length > 0) {
      setErrors(errorObj);
    } else {
      setErrors({});

      if (settingsModalPopup === false && trainingData && coverImage) {
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
        updateTraining(data);
      }
    }

    // console.log('COVER IMAGE:', coverImage[0]);
  };

  const handleTrainingFileDelete = async (fileId, fileType) => {
    console.log('FILE ID:', fileId);
    console.log('FILE TYPE:', fileType);
    let token = localStorage.getItem('token');
    await axios.delete(`${BASE_URL}/training/deleteFile/${fileId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then(function () {

      if (fileType === "related_files") {
        let newData = fetchedRelatedFiles.filter(d => parseInt(d.id) !== parseInt(fileId))
        setFetchedRelatedFiles(newData);
      } else if (fileType === "video_files") {
        let newData = fetchedVideoTutorialFiles.filter(d => parseInt(d.id) !== parseInt(fileId))
        console.log('NEW DATA:', newData);
        setFetchedVideoTutorialFiles(newData);
      }
    })
      .catch(error => {
        console.log(error)
      });
  }



  // const handleTrainingFileDelete = async (fileId) => {
  //   console.log(`Delete file with id: ${fileId}`);
  //   let token = localStorage.getItem('token');
  //   const deleteResponse = await axios.delete(`${BASE_URL}/training/deleteFile/${fileId}`, {
  //     headers: {
  //       "Authorization": `Bearer ${token}`
  //     }
  //   });
  //   setFileDeleteResponse(deleteResponse);
  //   // if(deleteRespone.status === 200 && deleteRespone.data.status === "success") {
  //   // }
  // }

  useEffect(() => {
    fetchUserRoles();
    fetchTrainingCategories();
    fetchTrainingData();
    fetchFranchiseeList();
    fetchTrainingFormData();
  }, []);

  useEffect(() => {
    // if (trainingSettings.assigned_franchisee !== 'all') {
    fetchFranchiseeUsers(trainingSettings.assigned_franchisee);
    // }
  }, [trainingSettings?.assigned_franchisee]);

  useEffect(() => {
    fetchTrainingFormData();
  }, [fileDeleteResponse]);

  useEffect(() => {
    if ((relatedFiles?.length + fetchedRelatedFiles?.length) < 5) {
      setErrors(prevState => ({
        ...prevState,
        doc: null
      }));
    }
  }, [relatedFiles]);

  useEffect(() => {
    if ((videoTutorialFiles?.length + fetchedVideoTutorialFiles?.length) < 5) {
      setErrors(prevState => ({
        ...prevState,
        video: null
      }));
    }
  }, [videoTutorialFiles]);

  const getUniqueErrors = (arr) => {
    var result = [];
    arr.forEach(function (item) {
      if (result.indexOf(item) < 0) {
        result.push(item);
      }
    });

    return result;
  }

  useEffect(() => {
    setVideoError(videoFileErrorMessage?.map(errObj => (
      errObj?.error[0]?.message
    )));
  }, [videoFileErrorMessage])

  useEffect(() => {
    setDocError(docFileError?.map(errObj => (
      errObj?.error[0]?.message
    )));
  }, [docFileError])

  trainingSettings && console.log('TRAINING SETTINGS:', trainingSettings);

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
                    trainingData &&
                    <div className="training-form">
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label>Training Name</Form.Label>
                            <Form.Control
                              type="text"
                              maxLength={100}
                              name="title"
                              value={trainingData?.title}
                              onChange={handleTrainingData}
                            />
                            {errors && errors.title && <span className="error">{errors.title}</span>}
                          </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label>Training Category</Form.Label>
                            <Select
                              closeMenuOnSelect={true}
                              components={animatedComponents}
                              placeholder="Select"
                              options={trainingCategory}
                              value={trainingCategory.filter(c => c.id === trainingData.category_id) || trainingCategory.filter(c => c.id === trainingData.category_id)}
                              onChange={(e) => setTrainingData(prevState => ({
                                ...prevState,
                                category_id: e.id
                              }))}
                            />
                            {errors && errors.category_id && <span className="error">{errors.category_id}</span>}
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
                            {errors && errors.description && <span className="error">{errors.description}</span>}
                          </Form.Group>
                        </Col>

                        <Col md={12} className="mb-3">
                          <Form.Group>
                            <Form.Label>Meta Description</Form.Label>
                            <Form.Control
                              as="textarea"
                              name="meta_description"
                              maxLength={255}
                              rows={3}
                              value={trainingData.meta_description}
                              onChange={handleTrainingData}
                            />
                            {errors && errors.meta_description && <span className="error">{errors.meta_description}</span>}
                          </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                          <Form.Group className="relative">
                            <Form.Label>Time required to complete</Form.Label>
                            <div className="timelimit" style={{ display: "flex", gap: "5px" }}>
                              <Form.Control
                                style={{ flex: 6 }}
                                type="number"
                                value={trainingData.time_required_to_complete}
                                onChange={(event) => {
                                  if (parseInt(event.target.value) < 10000) {
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
                            {errors && errors.time_required_to_complete && <span className="error">{errors.time_required_to_complete}</span>}
                          </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label>Select Training Form*</Form.Label>
                            <Select
                              closeMenuOnSelect={true}
                              components={animatedComponents}
                              placeholder="Select"
                              options={trainingFormData}
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                              styles={{
                                menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                                menu: (provided) => ({ ...provided, zIndex: 9999 })
                              }}
                              value={trainingFormData?.filter(d => parseInt(d.id) === trainingData?.training_form_id)}
                              onChange={(event) => {
                                setTrainingData((prevState) => ({
                                  ...prevState,
                                  training_form_id: event.id,
                                }));

                                setErrors(prevState => ({
                                  ...prevState,
                                  training_form_id: null
                                }));
                              }}
                            />
                            {errors.training_form_id && <span className="error">{errors.training_form_id}</span>}
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>

                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label>Upload Cover Image</Form.Label>
                            {console.log(croppedImage, "croppedImage")}
                            <DragDropTraning
                              croppedImage={croppedImage}
                              setCroppedImage={setCroppedImage}
                              onSave={setImage}
                              coverImage={image}
                              setPopupVisible={setPopupVisible}
                              setFetchedCoverImage={setFetchedCoverImage}
                              fetchedPhoto={""}
                            />

                            {
                              popupVisible &&
                              <ImageCropTraning
                                image={image}
                                setCoverImage={setImage}
                                croppedImage={croppedImage}
                                setCroppedImage={setCroppedImage}
                                setPopupVisible={setPopupVisible} />
                            }

                            {typeof croppedImage === "string" ? (<>
                              <img className="cover-image-style" src={croppedImage} alt="training cover image" />
                            </>) :
                              (<></>)
                            }
                            {errors && errors.coverImage && <span className="error mt-2">{errors.coverImage}</span>}
                          </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3 vidcol">
                          <Form.Group>
                            <Form.Label>Upload Videos</Form.Label>
                            <DropAllFile
                              title="Videos"
                              type="video"
                              setUploadError={setVideoFileErrorMessage}
                              onSave={setVideoTutorialFiles}
                            />
                            {
                              videoError &&
                              getUniqueErrors(videoError).map(errorObj => {
                                return (
                                  <p style={{ color: 'tomato', fontSize: '12px' }}>{errorObj === "Too many files" ? "Only five video files allowed" : errorObj}</p>
                                )
                              })
                            }
                            <div className="media-container">
                              {
                                fetchedVideoTutorialFiles &&
                                fetchedVideoTutorialFiles.map((video, index) => {
                                  return (
                                    <div className="file-container">
                                      <div className="pic" style={{ cursor: 'default' }}><img className="file-thumbnail" src={`${video.thumbnail}`} alt={`${video.videoId}`} /></div>
                                      <p className="file-text" style={{ cursor: 'default' }}><strong>{`Video ${videoTutorialFiles.length + (index + 1)}`}</strong></p>
                                      <img
                                        onClick={() => {
                                          if (window.confirm('Are you sure you want to delete this video?')) {
                                            handleTrainingFileDelete(video.id, "video_files");
                                          }
                                        }}
                                        className="file-remove"
                                        src="../img/removeIcon.svg"
                                        alt="" />
                                    </div>
                                  )
                                })
                              }
                              {errors.video !== null && <span className="error">{errors.video}</span>}
                            </div>
                          </Form.Group>

                        </Col>

                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label>Upload Files</Form.Label>
                            <DropAllFile
                              setUploadError={setDocFileError}
                              onSave={setRelatedFiles}
                            />
                            {
                              docError &&
                              getUniqueErrors(docError).map(errorObj => {
                                return (
                                  <p style={{ color: 'tomato', fontSize: '12px' }}>{errorObj === "Too many files" ? "Only five files allowed" : errorObj.includes("File type must be text/*") ? "zip file uploads aren't allowed" : errorObj}</p>
                                )
                              })
                            }
                            <div className="media-container">
                              {
                                fetchedRelatedFiles &&
                                fetchedRelatedFiles.map((file, index) => {
                                  return (
                                    <div className="file-container">
                                      <img className="file-thumbnail-vector" style={{ marginRight: '10px' }} src={`../img/book-ico.png`} alt={`${file.videoId}`} />
                                      <a href={file.file}><p className="file-text">{`${fetchRealatedFileName(file.file)}`}</p></a>
                                      <img
                                        onClick={() => {
                                          if (window.confirm('Are you sure you want to delete this file?')) {
                                            handleTrainingFileDelete(file.id, "related_files");
                                          }
                                        }}
                                        className="file-remove"
                                        src="../img/removeIcon.svg"
                                        alt="" />
                                    </div>
                                  )
                                })
                              }
                              {errors.doc !== null && <span className="error">{errors.doc}</span>}
                            </div>
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
                  }
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>

      {
        localStorage.getItem('user_role') === 'franchisor_admin'
          ? (
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
                  trainingSettings &&
                  <div className="form-settings-content">
                    <Row>
                      <Col lg={3} sm={6}>
                        <Form.Group>
                          <Form.Label>Start Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="start_date"
                            className="datepicker"
                            placeholder={trainingSettings?.start_date ? moment(trainingSettings?.start_date).format("DD/MM/YYYY") : "dd/mm/yyyy"}
                            value={trainingSettings?.start_date}
                            min={moment().format('YYYY-MM-DD')}
                            onChange={(e) => {
                              setTrainingSettings(prevState => ({
                                ...prevState,
                                start_date: e.target.value
                              }));
                              setTrainingSettingErrors(prevState => ({
                                ...prevState,
                                start_date: null
                              }))
                            }}
                          />
                          {trainingSettingErrors?.start_date !== null && <span className="error">{trainingSettingErrors?.start_date}</span>}
                        </Form.Group>
                      </Col>
                      <Col lg={3} sm={6} className="mt-3 mt-sm-0">
                        <Form.Group>
                          <Form.Label>Start Time</Form.Label>
                          <Form.Control
                            type="time"
                            name="start_time"
                            value={trainingSettings?.start_time}
                            onChange={(e) => {
                              setTrainingSettings(prevState => ({
                                ...prevState,
                                start_time: e.target.value
                              }));
                              setTrainingSettingErrors(prevState => ({
                                ...prevState,
                                start_time: null
                              }))
                            }}
                          />
                          {trainingSettingErrors?.start_time !== null && <span className="error">{trainingSettingErrors?.start_time}</span>}
                        </Form.Group>
                      </Col>
                      <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                        <Form.Group>
                          <Form.Label>End Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="end_date"
                            className="datepicker"
                            placeholder={trainingSettings?.end_date ? moment(trainingSettings?.end_date).format("DD/MM/YYYY") : "dd/mm/yyyy"}
                            value={trainingSettings?.end_date}
                            min={moment().format('YYYY-MM-DD')}
                            onChange={(e) => {
                              setTrainingSettings(prevState => ({
                                ...prevState,
                                end_date: e.target.value
                              }));
                              setTrainingSettingErrors(prevState => ({
                                ...prevState,
                                end_date: null
                              }))
                            }}
                          />
                          {trainingSettingErrors?.end_date !== null && <span className="error">{trainingSettingErrors?.end_date}</span>}
                        </Form.Group>
                      </Col>
                      <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                        <Form.Group>
                          <Form.Label>End Time</Form.Label>
                          <Form.Control
                            type="time"
                            name="end_time"
                            value={trainingSettings?.end_time}
                            onChange={(e) => {
                              setTrainingSettings(prevState => ({
                                ...prevState,
                                end_time: e.target.value
                              }));
                              setTrainingSettingErrors(prevState => ({
                                ...prevState,
                                end_time: null
                              }))
                            }}
                          />
                          {trainingSettingErrors?.end_time !== null && <span className="error">{trainingSettingErrors?.end_time}</span>}
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
                              selectedValues={franchiseeList?.filter(d => trainingSettings?.assigned_franchisee?.includes(parseInt(d.id) + ''))}
                              className="multiselect-box default-arrow-select"
                              onKeyPressFn={function noRefCheck() { }}
                              onRemove={function noRefCheck(data) {
                                setTrainingSettings((prevState) => ({
                                  ...prevState,
                                  assigned_franchisee: [...data.map(data => data.id + '')],
                                }));
                              }}
                              onSearch={function noRefCheck() { }}
                              onSelect={function noRefCheck(data) {
                                setTrainingSettings((prevState) => ({
                                  ...prevState,
                                  assigned_franchisee: [...data.map((data) => data.id + '')],
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
                          <div className="new-form-radio d-block">
                            <div className="new-form-radio-box mb-3">
                              <label htmlFor="yes1">
                                <input
                                  type="radio"
                                  value="Y"
                                  checked={trainingSettings?.applicable_to === 'roles'}
                                  name="roles"
                                  id="yes1"
                                  onChange={(event) => {
                                    setTrainingSettings((prevState) => ({
                                      ...prevState,
                                      applicable_to: 'roles',
                                    }));
                                  }}
                                />
                                <span className="radio-round"></span>
                                <p>User Roles</p>
                              </label>
                            </div>
                            <div className="new-form-radio-box mb-3">
                              <label htmlFor="no1">
                                <input
                                  type="radio"
                                  value="N"
                                  checked={trainingSettings?.applicable_to === 'users'}
                                  name="roles"
                                  id="no1"
                                  onChange={(event) => {
                                    setTrainingSettings((prevState) => ({
                                      ...prevState,
                                      applicable_to: 'users',
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
                        <div className={`custom-checkbox ${trainingSettings?.applicable_to === 'users' ? "d-none" : ""}`}>
                          <Form.Label className="d-block">Select User Roles</Form.Label>
                          <div className="btn-checkbox d-block">
                            <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox">
                              <Form.Check
                                type="checkbox"
                                checked={trainingSettings.assigned_roles?.includes("franchisee_admin")}
                                label="Franchisee Admin"
                                onChange={() => {
                                  if (trainingSettings.assigned_roles?.includes("franchisee_admin")) {
                                    let data = trainingSettings.assigned_roles.filter(t => t !== "franchisee_admin");
                                    setTrainingSettings(prevState => ({
                                      ...prevState,
                                      assigned_roles: [...data]
                                    }));
                                  }

                                  if (!trainingSettings.assigned_roles?.includes("franchisee_admin"))
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
                                  if (trainingSettings.assigned_roles?.includes("coordinator")) {
                                    let data = trainingSettings.assigned_roles.filter(t => t !== "coordinator");
                                    setTrainingSettings(prevState => ({
                                      ...prevState,
                                      assigned_roles: [...data]
                                    }));
                                  }

                                  if (!trainingSettings.assigned_roles?.includes("coordinator"))
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
                                checked={trainingSettings.assigned_roles?.includes("educator")}
                                onChange={() => {
                                  if (trainingSettings.assigned_roles?.includes("educator")) {
                                    let data = trainingSettings.assigned_roles.filter(t => t !== "educator");
                                    setTrainingSettings(prevState => ({
                                      ...prevState,
                                      assigned_roles: [...data]
                                    }));
                                  }

                                  if (!trainingSettings.assigned_roles?.includes("educator"))
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
                                checked={trainingSettings.assigned_roles?.length === 3}
                                onChange={() => {

                                  if (trainingSettings?.assigned_roles?.length > 0) {
                                    setTrainingSettings(prevState => ({
                                      ...prevState,
                                      assigned_roles: ["franchisee_admin", "coordinator", "educator"]
                                    }));
                                  }

                                  if (trainingSettings.assigned_roles?.includes("franchisee_admin")
                                    && trainingSettings.assigned_roles.includes("coordinator")
                                    && trainingSettings.assigned_roles.includes("educator")) {
                                    setTrainingSettings(prevState => ({
                                      ...prevState,
                                      assigned_roles: [],
                                    }));
                                  }

                                  if (!trainingSettings.assigned_roles.includes("franchisee_admin")
                                    && !trainingSettings.assigned_roles?.includes("coordinator")
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

                        <div lg={9} md={6} className={`mt-3 mt-md-0 ${trainingSettings?.applicable_to === 'roles' ? "d-none" : ""}`}>
                          <Col>
                            <Form.Group>
                              <Form.Label>Select User Names</Form.Label>
                              <Multiselect
                                placeholder={fetchedFranchiseeUsers ? "Select" : "No User Available"}
                                displayValue="key"
                                selectedValues={fetchedFranchiseeUsers?.filter(d => trainingSettings?.assigned_users?.includes(d.id + ''))}
                                className="multiselect-box default-arrow-select"
                                onKeyPressFn={function noRefCheck() { }}
                                onRemove={function noRefCheck(data) {
                                  setTrainingSettings((prevState) => ({
                                    ...prevState,
                                    assigned_users: [...data.map(data => data.id + '')],
                                  }));
                                }}
                                onSearch={function noRefCheck() { }}
                                onSelect={function noRefCheck(data) {
                                  setTrainingSettings((prevState) => ({
                                    ...prevState,
                                    assigned_users: [...data.map((data) => data.id + '')],
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
                <Button variant="transparent" onClick={() => setSettingsModalPopup(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => {
                  let settingErrors = validateTrainingSettings(trainingSettings);
                  if (Object.keys(settingErrors).length > 0) {
                    setTrainingSettingErrors(settingErrors);
                  } else {
                    setTrainingSettingErrors(prevState => ({
                      ...prevState,
                      start_date: null,
                      end_date: null,
                      start_time: null,
                      end_time: null
                    }));
                    setSettingsModalPopup(false)
                    setAllowSubmit(true);
                  }
                }}>
                  Save Settings
                </Button>
              </Modal.Footer>
            </Modal>
          )
          : (
            <Modal
              className="training-modal"
              size="lg"
              show={settingsModalPopup}
              onHide={() => setSettingsModalPopup(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  <img src="../img/setting-ico.png" alt="" /> Training Edit Settings
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {
                  trainingSettings &&
                  <div className="form-settings-content">
                    <Row>
                      <Col lg={3} sm={6}>
                        <Form.Group>
                          <Form.Label>Start Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="start_date"
                            className="datepicker"
                            placeholder={trainingSettings?.start_date ? moment(trainingSettings?.start_date).format("DD/MM/YYYY") : "dd/mm/yyyy"}
                            value={trainingSettings?.start_date}
                            onChange={(e) => {
                              setTrainingSettings(prevState => ({
                                ...prevState,
                                start_date: e.target.value
                              }));
                              setTrainingSettingErrors(prevState => ({
                                ...prevState,
                                start_date: null
                              }))
                            }}
                            max={trainingSettings?.end_date}
                          />
                          {trainingSettingErrors?.start_date !== null && <span className="error">{trainingSettingErrors?.start_date}</span>}
                        </Form.Group>
                      </Col>
                      <Col lg={3} sm={6} className="mt-3 mt-sm-0">
                        <Form.Group>
                          <Form.Label>Start Time</Form.Label>
                          <Form.Control
                            type="time"
                            name="start_time"
                            // className="timepicker"
                            // placeholder={trainingSettings?.start_time ? moment(trainingSettings?.start_time).format("HH:mm") : "tt:tt tt" }
                            value={trainingSettings?.start_time}
                            onChange={(e) => {
                              setTrainingSettings(prevState => ({
                                ...prevState,
                                start_time: e.target.value
                              }));
                              setTrainingSettingErrors(prevState => ({
                                ...prevState,
                                start_time: null
                              }))
                            }}
                          />
                          {trainingSettingErrors?.start_time !== null && <span className="error">{trainingSettingErrors?.start_time}</span>}
                        </Form.Group>
                      </Col>
                      <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                        <Form.Group>
                          <Form.Label>End Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="end_date"
                            className="datepicker"
                            placeholder={trainingSettings?.end_date ? moment(trainingSettings?.end_date).format("DD/MM/YYYY") : "dd/mm/yyyy"}
                            value={trainingSettings?.end_date}
                            onChange={(e) => {
                              setTrainingSettings(prevState => ({
                                ...prevState,
                                end_date: e.target.value
                              }));
                              setTrainingSettingErrors(prevState => ({
                                ...prevState,
                                end_date: null
                              }))
                            }}
                            min={trainingSettings?.start_date}
                          />
                          {trainingSettingErrors?.end_date !== null && <span className="error">{trainingSettingErrors?.end_date}</span>}
                        </Form.Group>
                      </Col>
                      <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                        <Form.Group>
                          <Form.Label>End Time</Form.Label>
                          <Form.Control
                            type="time"
                            name="end_time"
                            value={trainingSettings?.end_time}
                            onChange={(e) => {
                              setTrainingSettings(prevState => ({
                                ...prevState,
                                end_time: e.target.value
                              }));
                              setTrainingSettingErrors(prevState => ({
                                ...prevState,
                                end_time: null
                              }))
                            }}
                          />
                          {trainingSettingErrors?.end_time !== null && <span className="error">{trainingSettingErrors?.end_time}</span>}
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col lg={3} md={6}>
                        <Form.Group>
                          <Form.Label>Accessible to</Form.Label>
                          <div className="new-form-radio">
                            <div className="new-form-radio-box">
                              <label htmlFor="yes1">
                                <input
                                  type="radio"
                                  value="Y"
                                  checked={trainingSettings?.applicable_to === 'roles'}
                                  name="roles"
                                  id="yes1"
                                  onChange={(event) => {
                                    setTrainingSettings((prevState) => ({
                                      ...prevState,
                                      applicable_to: 'roles',
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
                                  checked={trainingSettings?.applicable_to === 'users'}
                                  name="roles"
                                  id="no1"
                                  onChange={(event) => {
                                    setTrainingSettings((prevState) => ({
                                      ...prevState,
                                      applicable_to: 'users',
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
                        <div className={`custom-checkbox ${trainingSettings?.applicable_to === 'users' ? "d-none" : ""}`}>
                          <Form.Label className="d-block">Select User Roles</Form.Label>
                          <div className="btn-checkbox d-block">
                            {
                              localStorage.getItem('user_role') === 'franchisor_admin'
                                ? (
                                  <>
                                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox">
                                      <Form.Check
                                        type="checkbox"
                                        checked={trainingSettings.assigned_roles?.includes("franchisee_admin")}
                                        label="Franchisee Admin"
                                        onChange={() => {
                                          if (trainingSettings.assigned_roles?.includes("franchisee_admin")) {
                                            let data = trainingSettings.assigned_roles.filter(t => t !== "franchisee_admin");
                                            setTrainingSettings(prevState => ({
                                              ...prevState,
                                              assigned_roles: [...data]
                                            }));
                                          }

                                          if (!trainingSettings.assigned_roles?.includes("franchisee_admin"))
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
                                          if (trainingSettings.assigned_roles?.includes("coordinator")) {
                                            let data = trainingSettings.assigned_roles.filter(t => t !== "coordinator");
                                            setTrainingSettings(prevState => ({
                                              ...prevState,
                                              assigned_roles: [...data]
                                            }));
                                          }

                                          if (!trainingSettings.assigned_roles?.includes("coordinator"))
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
                                        checked={trainingSettings.assigned_roles?.includes("educator")}
                                        onChange={() => {
                                          if (trainingSettings.assigned_roles?.includes("educator")) {
                                            let data = trainingSettings.assigned_roles.filter(t => t !== "educator");
                                            setTrainingSettings(prevState => ({
                                              ...prevState,
                                              assigned_roles: [...data]
                                            }));
                                          }

                                          if (!trainingSettings.assigned_roles?.includes("educator"))
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
                                        checked={trainingSettings.assigned_roles?.length === 3}
                                        onChange={() => {

                                          if (trainingSettings?.assigned_roles?.length > 0) {
                                            setTrainingSettings(prevState => ({
                                              ...prevState,
                                              assigned_roles: ["franchisee_admin", "coordinator", "educator"]
                                            }));
                                          }

                                          if (trainingSettings.assigned_roles?.includes("franchisee_admin")
                                            && trainingSettings.assigned_roles.includes("coordinator")
                                            && trainingSettings.assigned_roles.includes("educator")) {
                                            setTrainingSettings(prevState => ({
                                              ...prevState,
                                              assigned_roles: [],
                                            }));
                                          }

                                          if (!trainingSettings.assigned_roles.includes("franchisee_admin")
                                            && !trainingSettings.assigned_roles?.includes("coordinator")
                                            && !trainingSettings.assigned_roles.includes("educator"))
                                            setTrainingSettings(prevState => ({
                                              ...prevState,
                                              assigned_roles: ["franchisee_admin", "coordinator", "educator"]
                                            })
                                            )
                                        }} />
                                    </Form.Group>
                                  </>
                                )
                                : (
                                  <>
                                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox1">
                                      <Form.Check
                                        type="checkbox"
                                        checked={trainingSettings.assigned_roles?.includes("coordinator")}
                                        label="Coordinator"
                                        onChange={() => {
                                          if (trainingSettings.assigned_roles?.includes("coordinator")) {
                                            let data = trainingSettings.assigned_roles.filter(t => t !== "coordinator");
                                            setTrainingSettings(prevState => ({
                                              ...prevState,
                                              assigned_roles: [...data]
                                            }));
                                          }

                                          if (!trainingSettings.assigned_roles?.includes("coordinator"))
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
                                        checked={trainingSettings.assigned_roles?.includes("educator")}
                                        onChange={() => {
                                          if (trainingSettings.assigned_roles?.includes("educator")) {
                                            let data = trainingSettings.assigned_roles.filter(t => t !== "educator");
                                            setTrainingSettings(prevState => ({
                                              ...prevState,
                                              assigned_roles: [...data]
                                            }));
                                          }

                                          if (!trainingSettings.assigned_roles?.includes("educator"))
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
                                        checked={trainingSettings.assigned_roles?.length === 2}
                                        onChange={() => {

                                          if (trainingSettings?.assigned_roles?.length > 0) {
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

                                          if (!trainingSettings.assigned_roles?.includes("coordinator")
                                            && !trainingSettings.assigned_roles.includes("educator"))
                                            setTrainingSettings(prevState => ({
                                              ...prevState,
                                              assigned_roles: ["coordinator", "educator"]
                                            })
                                            )
                                        }} />
                                    </Form.Group>
                                  </>
                                )
                            }
                          </div>
                        </div>

                        <div lg={9} md={6} className={`mt-3 mt-md-0 ${trainingSettings?.applicable_to === 'roles' ? "d-none" : ""}`}>
                          <Col>
                            <Form.Group>
                              <Form.Label>Select User Names</Form.Label>
                              <Multiselect
                                placeholder={fetchedFranchiseeUsers ? "Select" : "No User Available"}
                                displayValue="key"
                                selectedValues={fetchedFranchiseeUsers?.filter(d => trainingSettings?.assigned_users.includes(d.id + ''))}
                                className="multiselect-box default-arrow-select"
                                onKeyPressFn={function noRefCheck() { }}
                                onRemove={function noRefCheck(data) {
                                  setTrainingSettings((prevState) => ({
                                    ...prevState,
                                    assigned_users: [...data.map(data => data.id + '')],
                                  }));
                                }}
                                onSearch={function noRefCheck() { }}
                                onSelect={function noRefCheck(data) {
                                  setTrainingSettings((prevState) => ({
                                    ...prevState,
                                    assigned_users: [...data.map((data) => data.id + '')],
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
                <Button variant="transparent" onClick={() => setSettingsModalPopup(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => {
                  let settingErrors = validateTrainingSettings(trainingSettings);
                  if (Object.keys(settingErrors).length > 0) {
                    setTrainingSettingErrors(settingErrors);
                  } else {
                    setTrainingSettingErrors(prevState => ({
                      ...prevState,
                      start_date: null,
                      end_date: null,
                      start_time: null,
                      end_time: null
                    }));
                    setSettingsModalPopup(false)
                    setAllowSubmit(true);
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
          show={createTrainingModal}>
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

export default EditTraining;
