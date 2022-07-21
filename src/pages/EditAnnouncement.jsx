import React, { useState, useEffect } from 'react';
import { Col, Container, Form, Row, Button, Modal } from 'react-bootstrap';
import { BASE_URL } from "../components/App";
import TopHeader from '../components/TopHeader';
import LeftNavbar from '../components/LeftNavbar';
import Multiselect from 'multiselect-react-dropdown';
import MyEditor from './CKEditor';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  createCategoryValidation,
  createOperatingManualValidation,
} from '../helpers/validation';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';

import DropAllFile from "../components/DragDropMultiple";
import DropOneFile from '../components/DragDrop';
import {EditAnnouncementValidation} from '../helpers/validation';
import axios from 'axios';
import DropAllRelatedFile from '../components/DragDropMultipleRelatedFiles';
let selectedUserId = '';
let upperRoleUser = '';
const EditAnnouncement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [operatingManualData, setOperatingManualData] = useState({
    related_files: [],
  });
  const [errors, setErrors] = useState({});
  const [ImageloaderFlag, setImageLoaderFlag] = useState(false);
  const [videoloaderFlag, setVideoLoaderFlag] = useState(false);
  const [filesLoaderFlag, setFilesLoaderFlag] = useState(false);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [imageUrl,setImageUrl]=useState("");
  const [videoUrl,setVideoUrl]=useState("");
  const [videoThumbnailUrl,setVideoThumbnailUrl]=useState("");
  const [formSettingFlag, setFormSettingFlag] = useState(false);
  const [formSettingError, setFormSettingError] = useState({});
  const [formSettingData, setFormSettingData] = useState({ shared_role: '' });
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const [category, setCategory] = useState([]);
  const [categoryModalFlag, setCategoryModalFlag] = useState(false);
  const [categoryData, setCategoryData] = useState({});
  const [categoryError, setCategoryError] = useState({});
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [selectedFranchiseeId, setSelectedFranchiseeId] = useState(null);

   const [createTrainingModal, setCreateTrainingModal] = useState(false);
  const [settingsModalPopup, setSettingsModalPopup] = useState(false);
  const [videoTutorialFiles, setVideoTutorialFiles] = useState([]);
  // const [relatedFiles,setRealtedFiles]=useState([])
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [AnnouncementsSettings, setAnnouncementsSettings] = useState({ user_roles: [] });

  const [theRelatedFiles,setTheRelatedFiles] = useState([])
  const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState([]);
  

  const [announcementData,setAnnouncementData] = useState("")
  const [coverImage, setCoverImage] = useState({});
  const [loader, setLoader] = useState(false);
  const [topErrorMessage, setTopErrorMessage] = useState(null);
  const [franchiseeData, setFranchiseeData] = useState(null);


  const { id } = useParams();

  const setOperatingManualField = (field, value) => {
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
  useEffect(() => {
    fetchFranchiseeList();
  }, []);
  useEffect(() =>{
    setTheRelatedFiles(announcementData?.announcement_files?.filter(file => file.fileType !== '.mp4' && file.is_deleted === false))

  },[announcementData])








  // selectedFranchisee && console.log('sds ->>>', selectedFranchisee);
  return (
    <>
      {console.log('selectedFranchiseeId--->', selectedFranchiseeId)}
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
                  <Row>
                  <div className='entry-container'>
                <header className="title-head">
                    <h1 className="title-lg">Edit Announcement</h1>
                  </header>
                </div>
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
                  </Row>
                  <div>
                    <Row>
                      <Col sm={12}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Description
                          </Form.Label>
                          {/* <MyEditor
                              data={announcementData.meta_description} 
                              name ="meta_description"
                              operatingManual={{ ...operatingManualData }}
                              errors={errors}
                              handleChange={(e,data) => {
                                setOperatingManualField(
                                 e,data
                                );
                              }}

                            /> */}
                         
                           
                          
                            <MyEditor
                              errors={errors}
                              name ="meta_description"
                              data={announcementData.meta_description} 

                              handleChange={(e, data) => {
                                setOperatingManualField(e, data);
                              }}
                            />
                           {errors.meta_description && <p className="form-errors">{errors.meta_description}</p>}
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
                          
                           <DropOneFile onSave={setCoverImage} 
                           isInvalid = {!!errors.coverImage}
                            image = {announcementData.coverImage}
                          
                          />
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
                          <DropAllFile onSave={setVideoTutorialFiles}

                           />
                          <p className="form-errors">
                            {errors.reference_video}
                          </p>
                        </Form.Group>
                      </Col>
                    </Row>
  
                      
                     <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Related Files :</Form.Label>
                          <DropAllFile onSave={setRelatedFiles}
                            Files={theRelatedFiles}

                          />
                        </Form.Group>
                      </Col>
                  </div>
                  </div>
                  <Row>
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
