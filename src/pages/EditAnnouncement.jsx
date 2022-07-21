import React, { useState, useEffect } from 'react';
import { Col, Container, Form, Row, Button, Modal } from 'react-bootstrap';
import { BASE_URL } from '../components/App';
import TopHeader from '../components/TopHeader';
import LeftNavbar from '../components/LeftNavbar';
import Multiselect from 'multiselect-react-dropdown';
import MyEditor from './CKEditor';
import Select from 'react-select';

import DropAllFile from "../components/DragDropMultiple";
import DropOneFile from '../components/DragDrop';
import {EditAnnouncementValidation} from '../helpers/validation';
import axios from 'axios';
import * as ReactBootstrap from 'react-bootstrap';


import { useParams } from 'react-router-dom';
let selectedUserId = '';
let upperRoleUser='';
const EditAnnouncement = () => {


  const [show, setShow] = useState(false);


  const [createTrainingModal, setCreateTrainingModal] = useState(false);
  const [settingsModalPopup, setSettingsModalPopup] = useState(false);
  const [videoTutorialFiles, setVideoTutorialFiles] = useState([]);
  // const [relatedFiles,setRealtedFiles]=useState([])
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [AnnouncementsSettings, setAnnouncementsSettings] = useState({ user_roles: [] });
  const [errors, setErrors] = useState({});

  const [relatedFiles, setRelatedFiles] = useState([]);
  const [theRelatedFiles,setTheRelatedFiles] = useState([])
  const [selectedFranchisee, setSelectedFranchisee] = useState("Special DayCare, Sydney");
  const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState([]);
  
  const [userRole,setUserRole] = useState("");
  const [operatingManualData, setOperatingManualData] = useState({
    related_files: [],
   
  });
  const [announcementData,setAnnouncementData] = useState("")
  const [coverImage, setCoverImage] = useState({});
  const [loader, setLoader] = useState(false);
  const [topErrorMessage, setTopErrorMessage] = useState(null);
  const [franchiseeData, setFranchiseeData] = useState(null);


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
      setLoader(false);
      setCreateTrainingModal(false);
      setTimeout(() => {
        setTopErrorMessage(null);
      }, 3000)
    }
    
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
  
  }
  const fetchFranchiseeList = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/role/franchisee`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    console.log("The franchiselist",response.data)
    if(response.status === 200 && response.data.status === "success") {
      let { franchiseeList } = response.data;

      setFranchiseeData(franchiseeList.map(franchisee => ({
        id: franchisee.id,
        value: franchisee.franchisee_alias,
        label: franchisee.franchisee_name
      })));  
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();
 
    const newErrors = EditAnnouncementValidation(operatingManualData,coverImage);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } 
    else{
      setErrors({})
      if(operatingManualData && coverImage) {
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
          setCreateTrainingModal(true);
          setLoader(true)
          UpdateAnnouncement(data)
      }
    }
  };
 

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
    useEffect(() => {
      fetchFranchiseeList();
    }, []);

  console.log("FRANCHISESS DATA ",franchiseeData)
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
                    <h1 className="title-lg">Edit Announcement</h1>
                  </header>
                </div>
                  <Row>
                      
                        <Form.Group className="col-md-6 mb-3" >
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
                        <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Select Franchisee</Form.Label>

                            <div className="select-with-plus">
                            <Select
                              placeholder="Which Franchisee?"
                              closeMenuOnSelect={false}
                              isMulti
                              options={franchiseeData} 
                              onChange={(selectedOptions) => {
                                setOperatingManualData((prevState) => ({
                                  ...prevState,
                                  franchise: [...selectedOptions.map(option => option.id + "")]
                                }));
                              }}
                            />
                         </div>      
                          </Form.Group>
                    
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Announcement Description</Form.Label>
                          {/* <MyEditor
                              operatingManual={{ ...operatingManualData }}
                              errors={errors}
                              handleChange={(e, data) => {
                                setOperatingManualField(e, data);
                              }}
                            /> */}
                            
                              <MyEditor
                              data={announcementData.meta_description} 
            
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
                    <Row>
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
   
    </>
  );
};

export default EditAnnouncement;
