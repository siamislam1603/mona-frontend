import React, { useState, useEffect } from 'react';
import { Col, Container, Form, Row, Button, Modal } from 'react-bootstrap';
import { BASE_URL } from '../components/App';
import TopHeader from '../components/TopHeader';
import LeftNavbar from '../components/LeftNavbar';
import Multiselect from 'multiselect-react-dropdown';
// import MyEditor from '../CKEditor';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {EditAnnouncementValidation} from '../helpers/validation';
import { useLocation, useNavigate } from 'react-router-dom';
import DropAllRelatedFile from '../components/DragDropMultipleRelatedFiles';
import axios from 'axios';
let selectedUserId = '';
let upperRoleUser='';
const EditAnnouncement = () => {


  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [settingsModalPopup, setSettingsModalPopup] = useState(false);

  const [allowSubmit, setAllowSubmit] = useState(false);
  const [AnnouncementsSettings, setAnnouncementsSettings] = useState({ user_roles: [] });
  const [errors, setErrors] = useState({});
  const [ImageloaderFlag, setImageLoaderFlag] = useState(false);
  const [videoloaderFlag, setVideoLoaderFlag] = useState(false);
  const [filesLoaderFlag, setFilesLoaderFlag] = useState(false);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [formSettingFlag, setFormSettingFlag] = useState(false);
  const [formSettingError, setFormSettingError] = useState({});
  const [formSettingData, setFormSettingData] = useState({ shared_role: '' });
  const [userRole,setUserRole] = useState("");
  const [operatingManualData, setOperatingManualData] = useState({
    related_files: [],
  });
  const [announcementData,setAnnouncementData] = useState("")
  const [coverImage, setCoverImage] = useState({});
  
  const setOperatingManualField = (field, value) => {
    console.log("The field and value",field,value)
    setOperatingManualData({ ...operatingManualData, [field]: value });
    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const handleAnnouncementsSettings = (event) => {
    const { name, value } = event.target;
    
    setOperatingManualData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setAnnouncementsSettings((operatingManualData) =>({
      ...operatingManualData,
      [name]:value
    }))
    
  };
  const UpdateAnnouncement = async(data) =>{
  try {
     let token = localStorage.getItem('token')
     console.log("The token",token)
    const res = await axios.put('http://localhost:4000/announcement/2',{
      title: announcementData.title,
      start_date : data.start_date,
      start_time : data.start_time,
      meta_description:data.meta_description,
    },{
      headers: {
        "Authorization": "Bearer " + token
      }
     } )
    console.log("The response",res)
  } catch (error) {
    console.log(error)
  }
    
  }
  const onSubmit = (e) => {
    e.preventDefault();
    const newErrors = EditAnnouncementValidation(operatingManualData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } 
    else{
      
      setErrors({});
      if(Object.keys(AnnouncementsSettings).length === 1){
          setSettingsModalPopup(true)
      }

      if(settingsModalPopup === false && allowSubmit && operatingManualData ) {
         console.log("After submit the buton",operatingManualData)
        UpdateAnnouncement(operatingManualData)

        // for(let [key, values] of Object.entries(trainingSettings)) {
        //   data.append(`${key}`, values);
        // }

      //   for(let [ key, values ] of Object.entries(trainingData)) {
      //     data.append(`${key}`, values)
      //   }

      //   videoTutorialFiles.forEach((file, index) => {
      //     data.append(`images`, file);
      //   });

      //   relatedFiles.forEach((file, index) => {
      //     data.append(`images`, file);
      //   });
        
      //   window.scrollTo(0, 0);
      //   setLoader(true);
      //   createTraining(data);
      }
      

    }
  };
 

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
 
    const uploadFiles = async (name, file) => {
      let flag = false;
      if (name === 'cover_image') {
        if (file.size > 2048 * 1024) {
          let errorData={...errors};
          errorData["cover_image"]= "File is too much large";
          setErrors(errorData);
          flag = true;
        }
      }
      if (name === 'reference_video')
      {
        if (file.size > 1024 * 1024 * 1024) {
          let errorData={...errors};
          errorData["reference_video"]= "File is too much large";
          setErrors(errorData);
          flag = true;
        }
      }
  
      if (flag === false) {
        if (name === 'cover_image') {
          setImageLoaderFlag(true);
        }
        if (name === 'reference_video') {
          setVideoLoaderFlag(true);
        }
        let data = { ...operatingManualData };
        const body = new FormData();
        const blob = await fetch(await toBase64(file)).then((res) => res.blob());
        body.append('image', blob, file.name);
        body.append('description', 'operating manual');
        body.append('title', name);
        body.append('uploadedBy', 'vaibhavi');
  
        var myHeaders = new Headers();
        myHeaders.append('shared_role', 'admin');
        fetch(`${BASE_URL}/uploads/uiFiles`, {
          method: 'post',
          body: body,
          headers: myHeaders,
        })
          .then((res) => res.json())
          .then((res) => {
            if (name === 'reference_video') {
              data['video_thumbnail'] = res.thumbnail;
              data[name] = res.url;
              setOperatingManualData(data);
  
              setTimeout(() => {
                setVideoLoaderFlag(false);
              }, 8000);
            } else {
              data[name] = res.url;
              setOperatingManualData(data);
  
              setTimeout(() => {
                setImageLoaderFlag(false);
              }, 5000);
            }
            if (!!errors[name]) {
              setErrors({
                ...errors,
                [name]: null,
              });
            }
          })
          .catch((err) => {
            console.log('error---->', err);
          });
      }
    };
  const AnnouncementDetails = async(id) => {
     let token = localStorage.getItem('token')
     const response = await axios.get("http://localhost:4000/announcement/2", {
      headers: {
        "Authorization": "Bearer " + token
      }
     })
     if(response.status === 200) {
       setAnnouncementData(response.data.data.all_announcements)
     }
  } 

    useEffect(() =>{
      AnnouncementDetails();
      const role = localStorage.getItem("user_role")
      console.log("The role 3", role) 
      setUserRole(role)  
    },[])

    console.log("The data ",announcementData)
  return (
    <>
      {console.log('errors--->', errors)}
      {console.log('operating manual--->', operatingManualData)}
      <div id="main">
        <section className="mainsection ">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
                <div className="new_module">
                <TopHeader/>
                <div className='entry-container'>
                <header className="title-head">
                    <h1 className="title-lg">Edit Announcement <span className="setting-ico" onClick={() => setSettingsModalPopup(true)}><img src="../img/setting-ico.png" alt=""/></span></h1>
                  </header>
                </div>
                  <Row>
                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Announcement Title</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="announcement_title" 
                            // value={operatingManualData?.title}
                            // value={announcementData.title || ""}
                            defaultValue={announcementData.title}
                            placeholder="Enter Title"
                            onChange={(e) => {
                              setOperatingManualField(
                                e.target.name,
                                e.target.value
                              );
                            }}
                            isInvalid={!!errors.announcement_title}
                            />
                          <Form.Control.Feedback type="invalid">
                            {errors.announcement_title}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Announcement Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="meta_description"
                            rows={3}
                            defaultValue={announcementData.meta_description}
                            placeholder="Enter Description"
                            onChange={(e) => {
                              setOperatingManualField(
                                e.target.name,
                                e.target.value
                              );
                            }}
                            isInvalid={!!errors.meta_description}
                            />
                             <Form.Control.Feedback type="invalid">
                            {errors.meta_description}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    
                    </Row>
                  <div className="my-new-formsection">
                  
              
                    <Row>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Upload Cover Image :
                          </Form.Label>
                          <div className="upload_cover_box">
                            <div className="cover_image">
                              {ImageloaderFlag ? (
                                <img src="../img/loader.gif" />
                              ) : null}
                              <img
                                src={
                                  operatingManualData.cover_image
                                    ? operatingManualData.cover_image
                                    : '../img/image_icon.png'
                                }
                              ></img>
                            </div>
                            <div className="add_image">
                              <div className="add_image_box">
                                <span>
                                  <img
                                    src="../img/bi_cloud-upload.svg"
                                    alt=""
                                  />
                                  Add Image
                                </span>
                                <Form.Control
                                  className="add_image_input"
                                  type="file"
                                  name="cover_image"
                                  onChange={(e) => {
                                    if (e.target.files) {
                                      uploadFiles(
                                        e.target.name,
                                        e.target.files[0]
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <Button
                              variant="link"
                              onClick={() => {
                                let data = { ...operatingManualData };
                                delete data['cover_image'];
                                setOperatingManualData(data);
                              }}
                            >
                              <img src="../../img/removeIcon.svg" />
                            </Button>
                          </div>
                          <p className="form-errors">{errors.cover_image}</p>
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Upload Reference Video Here :
                          </Form.Label>

                          <div className="upload_cover_box video_reference">
                            <div className="cover_image">
                              {videoloaderFlag ? (
                                <img src="../img/loader.gif" />
                              ) : null}
                              <img
                                src={
                                  operatingManualData.video_thumbnail
                                    ? operatingManualData.video_thumbnail
                                    : '../img/video_icon_demo.png'
                                }
                              ></img>
                            </div>
                            <div className="add_image">
                              <div className="add_image_box">
                                <span>
                                  <img
                                    src="../img/bi_cloud-upload.svg"
                                    alt=""
                                  />
                                  Add File
                                </span>
                                <Form.Control
                                  className="add_image_input"
                                  type="file"
                                  name="reference_video"
                                  onChange={(e) => {
                                    console.log(
                                      'e.target.files---->',
                                      e.target.files
                                    );
                                    if (e.target.files) {
                                      uploadFiles(
                                        e.target.name,
                                        e.target.files[0]
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <Button
                              variant="link"
                              className="remove_bin"
                              onClick={() => {
                                let data = { ...operatingManualData };
                                delete data['reference_video'];
                                delete data['video_thumbnail'];
                                setOperatingManualData(data);
                              }}
                            >
                              <img src="../../img/removeIcon.svg" />
                              {/* <span>Remove</span> */}
                            </Button>
                          </div>
                          <p className="form-errors">
                            {errors.reference_video}
                          </p>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12}>
                        <div className="upload_related_files">
                          <Form.Group>
                            <Form.Label className="formlabel">
                              Upload Related Files :
                            </Form.Label>

                            <DropAllRelatedFile
                              onSave={(value) => {
                                let data = { ...operatingManualData };
                                data['related_files'] = value;
                                setOperatingManualData(data);
                              }}
                              relatedFilesData={
                                operatingManualData.related_files
                              }
                            />
                            <p className="form-errors">
                              {errors.related_files}
                            </p>
                          </Form.Group>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <Row>
                    <Col sm={12}>
                      <div className="bottom_button">
                        <Button className="preview">Preview</Button>
                        <Button className="saveForm" onClick={onSubmit}>
                          Save
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
      <Modal className="training-modal" 
              size="lg" show={settingsModalPopup} 
              onHide={() => setSettingsModalPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title><img src="../img/setting-ico.png" alt=""/> Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settings-content">
            <Row>
              {userRole === "franchisor_admin" ? <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label>Send to all franchisee</Form.Label>
                  <div className="new-form-radio">
                    <div className="new-form-radio-box">
                      <label for="yes1">
                        <input
                          type="radio"
                          value="Yes"
                          name="form_template_select1"
                          id="yes1"
                        />
                        <span className="radio-round"></span>
                        <p>Yes</p>
                      </label>
                    </div>
                    <div className="new-form-radio-box">
                      <label for="no1">
                        <input
                          type="radio"
                          value="No"
                          name="form_template_select1"
                          id="no1"
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </Col>: null}
             {userRole === "franchisor_admin" ?  <Col lg={9} md={6}  className="mt-3 mt-md-0">
                <Form.Group>
                  <Form.Label>Select Franchisee</Form.Label>
                  <Multiselect
                    placeholder="Select Franchisee"
                    displayValue="key"
                    className="multiselect-box default-arrow-select"
                    onKeyPressFn={function noRefCheck() {}}
                    onRemove={function noRefCheck() {}}
                    onSearch={function noRefCheck() {}}
                    onSelect={function noRefCheck() {}}
                    options={[
                      {
                        cat: "Group 1",
                        key: "Option 1",
                      },
                      {
                        cat: "Group 1",
                        key: "Option 2",
                      },
                      {
                        cat: "Group 1",
                        key: "Option 3",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 4",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 5",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 6",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 7",
                      },
                    ]}
                  />
                </Form.Group>
              </Col>: null}
            </Row>
            <Row className="mt-4">
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label>Send to all user roles</Form.Label>
                  <div className="new-form-radio">
                    <div className="new-form-radio-box">
                      <label for="yes2">
                        <input
                          type="radio"
                          value="Yes"
                          name="form_template_select2"
                          id="yes2"
                        />
                        <span className="radio-round"></span>
                        <p>Yes</p>
                      </label>
                    </div>
                    <div className="new-form-radio-box">
                      <label for="no2">
                        <input
                          type="radio"
                          value="No"
                          name="form_template_select2"
                          id="no2"
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              <Col lg={9} md={6}  className="mt-3 mt-md-0">
                <Form.Group>
                  <Form.Label>Select User Roles</Form.Label>
                  <Multiselect
                    placeholder="Select User Roles"
                    displayValue="key"
                    className="multiselect-box default-arrow-select"
                    onKeyPressFn={function noRefCheck() {}}
                    onRemove={function noRefCheck() {}}
                    onSearch={function noRefCheck() {}}
                    onSelect={function noRefCheck() {}}
                    options={[
                      {
                        cat: "Group 1",
                        key: "Option 1",
                      },
                      {
                        cat: "Group 1",
                        key: "Option 2",
                      },
                      {
                        cat: "Group 1",
                        key: "Option 3",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 4",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 5",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 6",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 7",
                      },
                    ]}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={3} sm={6}>
                <Form.Group>
                  <Form.Label>Schedule Date</Form.Label>
                  <Form.Control  
                        type="date"
                        name="start_date"
                        onChange={handleAnnouncementsSettings}
                      />
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                <Form.Group>
                  <Form.Label>Schedule Time</Form.Label>
                  <Form.Control 
                    type="time"
                    name="start_time"
                    onChange={handleAnnouncementsSettings}
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
    </>
  );
};

export default EditAnnouncement;
