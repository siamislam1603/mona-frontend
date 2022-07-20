import React, { useState, useEffect } from 'react';
import { Col, Container, Form, Row, Button, Modal } from 'react-bootstrap';
import { BASE_URL } from '../components/App';
import TopHeader from '../components/TopHeader';
import LeftNavbar from '../components/LeftNavbar';
import Multiselect from 'multiselect-react-dropdown';
import MyEditor from './CKEditor';
import DropAllFile from "../components/DragDropMultiple";
import DropOneFile from '../components/DragDrop';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {EditAnnouncementValidation} from '../helpers/validation';
import { useLocation, useNavigate } from 'react-router-dom';
import DropAllRelatedFile from '../components/DragDropMultipleRelatedFiles';
import axios from 'axios';

import { useParams } from 'react-router-dom';
let selectedUserId = '';
let upperRoleUser='';
const EditAnnouncement = () => {


  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [settingsModalPopup, setSettingsModalPopup] = useState(false);
  const [videoTutorialFiles, setVideoTutorialFiles] = useState([]);
  // const [relatedFiles,setRealtedFiles]=useState([])
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [AnnouncementsSettings, setAnnouncementsSettings] = useState({ user_roles: [] });
  const [errors, setErrors] = useState({});
  const [ImageloaderFlag, setImageLoaderFlag] = useState(false);
  const [videoloaderFlag, setVideoLoaderFlag] = useState(false);
  const [filesLoaderFlag, setFilesLoaderFlag] = useState(false);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [theRelatedFiles,setTheRelatedFiles] = useState([])
  const [formSettingFlag, setFormSettingFlag] = useState(false);
  const [formSettingError, setFormSettingError] = useState({});
  const [formSettingData, setFormSettingData] = useState({ shared_role: '' });
  const [userRole,setUserRole] = useState("");
  const [operatingManualData, setOperatingManualData] = useState({
    related_files: [],
   
  });
  const [announcementData,setAnnouncementData] = useState("")
  const [coverImage, setCoverImage] = useState({});
  const [loader, setLoader] = useState(false);
  const [topErrorMessage, setTopErrorMessage] = useState(null);


  const { id } = useParams();
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
  
    console.log("Updating Annoucement")
   const token = localStorage.getItem('token');
    
      const response = await axios.put(`${BASE_URL}/announcement/${id}`, data,{ 
      headers: {
        "Authorization": "Bearer " + token
      }
     });
     console.log("The response",response)
     if(response.status === 200 && response.data.status === "success"){
        const id = announcementData.id;
        console.log("The id",id)
        let data = new FormData()
        data.append('id',id);
        data.append('image', coverImage[0]);

        let imgSaveResponse = await axios.post(
          `${BASE_URL}/training/coverImg?title=announcement`, data, {
            headers: {
              "Authorization": "Bearer " + token
            }
          }
        );
        console.log("The image",imgSaveResponse);
        if(imgSaveResponse.status === 201 && imgSaveResponse.data.status === "success") {            
          console.log('SUCCESS RESPONSE!');
          setLoader(false)
          localStorage.setItem('success_msg', 'Announcement Created Successfully!');
          localStorage.setItem('active_tab', '/created-announcement');
          window.location.href="/announcements";    
        }
        else{
              console.log('ERROR RESPONSE!');
              setTopErrorMessage("unable to save cover image!");
              setTimeout(() => {
              setTopErrorMessage(null);
            }, 3000)
        }
      
     }
     else if(response.status === 200 && response.data.status === "fail") {
      console.log('ERROR RESPONSE!');
      const { msg } = response.data;
      console.log("Annoncement Already exit",msg)
      setTopErrorMessage(msg);
      setTimeout(() => {
        setTopErrorMessage(null);
      }, 3000)
    }
    
  
   
   

  }

  const onSubmit = (e) => {
    e.preventDefault();
 
    const newErrors = EditAnnouncementValidation(operatingManualData,coverImage);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } 
    else{
      setErrors({});
      if(Object.keys(AnnouncementsSettings).length === 1){
          setSettingsModalPopup(true)
      }
      if(settingsModalPopup === false && allowSubmit && operatingManualData && coverImage) {
         console.log("After submit the buton",operatingManualData)
         let data = new FormData();
      
         for(let [ key, values ] of Object.entries(operatingManualData)) {
           data.append(`${key}`, values)
          }
          videoTutorialFiles.forEach((file, index) => {
            data.append(`images`, file);
          });
          relatedFiles.forEach((file, index) => {
            data.append(`images`, file);
          });
          
          UpdateAnnouncement(data)
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
 
    // const uploadFiles = async (name, file) => {
    //   console.log("The file and name",name,file)
    //   let flag = false;
    //   if (name === 'cover_image') {
    //     if (file.size > 2048 * 1024) {
    //       let errorData={...errors};
    //       errorData["cover_image"]= "File is too much large";
    //       setErrors(errorData);
    //       flag = true;
    //     }
    //   }
    //   if (name === 'reference_video')
    //   {
    //     if (file.size > 1024 * 1024 * 1024) {
    //       let errorData={...errors};
    //       errorData["reference_video"]= "File is too much large";
    //       setErrors(errorData);
    //       flag = true;
    //     }
    //   }
  
    //   if (flag === false) {
    //     if (name === 'cover_image') {
    //       setImageLoaderFlag(true);
    //     }
    //     if (name === 'reference_video') {
    //       setVideoLoaderFlag(true);
    //     }
    //     let data = { ...operatingManualData };
    //     console.log("The data image", data)
    //     const body = new FormData();
    //     const blob = await fetch(await toBase64(file)).then((res) => res.blob());
    //     body.append('image', blob, file.name);
    //     body.append('description', 'operating manual');
    //     body.append('title', name);
    //     body.append('uploadedBy', 'vaibhavi');
  
    //     var myHeaders = new Headers();
    //     myHeaders.append('shared_role', 'admin');
    //     const response = fetch(`${BASE_URL}/uploads/uiFiles`, {
    //       method: 'post',
    //       body: body,
    //       headers: myHeaders,
    //     })
    //       .then((res) => res.json())
    //       // console.log("The response",response)

    //       .then((res) => {
    //         if (name === 'reference_video') {
    //            console.log("The response",response)

    //            data['video_thumbnail'] = res.thumbnail;
    //            data[name] = res.url;

    //            setOperatingManualData(data);
  
    //           setTimeout(() => {
    //             setVideoLoaderFlag(false);
    //           }, 8000);

    //         } else {
    //           data[name] = res.url;
    //           setOperatingManualData(data);
  
    //           setTimeout(() => {
    //             setImageLoaderFlag(false);
    //           }, 5000);
    //         }
    //         if (!!errors[name]) {
    //           setErrors({
    //             ...errors,
    //             [name]: null,
    //           });
    //         }
    //       })
    //       .catch((err) => {
    //         console.log('error---->', err);
    //       });
    //   }
    // };
  const AnnouncementDetails = async() => {
     let token = localStorage.getItem('token')
     const response = await axios.get(`${BASE_URL}/announcement/${id}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
     })
     console.log("The detalis",response)
     if(response.status === 200) {
       setAnnouncementData(response.data.data.all_announcements)
     }
  } 

    useEffect(() =>{
      AnnouncementDetails();
      const role = localStorage.getItem("user_role")
      setUserRole(role)  
     
    },[])
    useEffect(() =>{
      setTheRelatedFiles(announcementData?.announcement_files?.filter(file => file.fileType !== '.mp4' && file.is_deleted === false))

    },[announcementData])

  console.log("The data we revce ",theRelatedFiles)
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
                            name="title" 
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
                            isInvalid={!!errors.title}
                            />
                          <Form.Control.Feedback type="invalid">
                            {errors.title}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Announcement Description</Form.Label>
                          {/* <Form.Control
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
                            /> */}
                              <MyEditor
                              data={announcementData.meta_description} 
                              // onChange={(event, editor) => {
                              //           const data = editor.getData();
                              //           setOperatingManualField("answer", data);
                              //           }}
                              name ="meta_description"
                              operatingManual={{ ...operatingManualData }}
                              errors={errors}
                              handleChange={(e,data) => {
                                setOperatingManualField(
                                 e,data
                                );
                              }}

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
                          {/* <div className="upload_cover_box">
                            <div className="cover_image">
                              {ImageloaderFlag ? (
                                <img src="../img/loader.gif" />
                              ) : <img src={announcementData.coverImage}/>}
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
                          </div> */}
                           <DropOneFile onSave={setCoverImage} 
                           isInvalid = {!!errors.coverImage}
                            image = {announcementData.coverImage}
                          
                          />
                          {/* <Form.Control.Feedback type="invalid">
                              {(error.coverImage)}
                            </Form.Control.Feedback> */}
                           <span  className="error">
                            {errors.coverImage}
                           </span>


                          {/* <p className="form-errors">{errors.cover_image}</p> */}
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Upload Reference Video Here :
                          </Form.Label>

                          {/* <div className="upload_cover_box video_reference">
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
                            {/* </Button>
                          </div> */} 
                          {/* <Form.Label>Upload Video Tutorial Here :</Form.Label> */}
                          <DropAllFile onSave={setVideoTutorialFiles}
                           />
                          <p className="form-errors">
                            {errors.reference_video}
                          </p>
                        </Form.Group>
                      </Col>
                    </Row>
                    {/* <Row>
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
                    </Row> */}
                     <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Related Files :</Form.Label>
                          <DropAllFile onSave={setRelatedFiles}
                            Files={theRelatedFiles}

                          />
                        </Form.Group>
                      </Col>
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
