import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Form, Modal } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import Multiselect from "multiselect-react-dropdown";
import DropAllFile from "../components/DragDropMultiple";
import DropOneFile from '../components/DragDrop';
import axios from 'axios';
import { BASE_URL } from '../components/App';
import { useParams } from 'react-router-dom';
import {AddNewAnnouncementValidation} from "../helpers/validation" 
const AddNewAnnouncements = () => {

  // const [show, setShow] = useState(false);
  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

const handleSaveAndClose = () => setShow(false);

// CUSTOM STATES
const [loader, setLoader] = useState(false);
const [userRoles, setUserRoles] = useState([]);
const [announcementData, setAnnouncementData] = useState({
  user_roles: []
});
// const [allowSubmit, setAllowSubmit] = useState(false);


  // const [coverImage, setCoverImage] = useState({});
  const [videoTutorialFiles, setVideoTutorialFiles] = useState([]);
  // const [relatedFiles, setRelatedFiles] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState("Special DayCare, Sydney");
  const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState([]);
  const [error, setError] = useState({user_roles: []});

  const [topErrorMessage, setTopErrorMessage] = useState(null);




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

const createAnnouncement = async (data) => {
  console.log('CREATING THE ANNOUNCEMENT');
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${BASE_URL}/announcement/`, data, {
      headers: {
        "Authorization": "Bearer " + token
      }
    }
  );

  if(response.status === 201 && response.data.status === "success") {
    console.log("datasaved");
        let { id } = response.data.announcement;
    
        let data = new FormData();
        data.append('id', id);
        data.append('image', coverImage[0]);
    
        let imgSaveResponse = await axios.post(
          `${BASE_URL}/training/coverImg?title=announcement`, data, {
            headers: {
              "Authorization": "Bearer " + token
            }
          }
        );
        console.log(imgSaveResponse);
    
      if(imgSaveResponse.status === 201 && imgSaveResponse.data.status === "success") {
            
        console.log('SUCCESS RESPONSE!');
        setLoader(false)
        localStorage.setItem('success_msg', 'Announcement Created Successfully!');
        localStorage.setItem('active_tab', '/created-announcement');
        window.location.href="/announcements";
      
      } else {
    
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
    };  

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

    const handleAnnouncementSettings = (event) => {
      const { name, value } = event.target;
  
      setAnnouncementData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    const handleAnnouncementData = (event) => {
      const { name, value } = event.target;
      console.log("The name and value",name,value)
      setAnnouncementData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      if (!!error[name]) {
        setError({
          ...error,
          [name]: null,
        });
      }
      
      // setAnnouncementData({...announcementData, [name]: value});
    };

    const checkValidity = (inputName, inputValue) => {
      switch (inputName) {
        case "title":
          let pattern = /^[A-Za-z]{3,}[ ]{0,1}[A-Za-z]{0,}$/i;
          announcementData.titleValid = pattern.test(inputValue);
          console.log("The titlevalid",announcementData.titleValid )
          break;
        case "meta_description":
          announcementData.meta_descriptionValid = inputValue.length >= 10;
          break;
        case "coverImage":
          let image_pattern = /\.(jpe?g|png|gif|bmp)$/i;
          announcementData.coverImageValid = image_pattern.test(inputValue);
        default:
          break;
      }
    };
      

    const handleDataSubmit = event => {
      event.preventDefault();
      console.log("The annoucement ",announcementData)
      let errorObj = AddNewAnnouncementValidation(announcementData,coverImage);
      console.log("The error of announcement",errorObj)
       if(Object.keys(errorObj).length>0){
        setError(errorObj);
       }
       else{
        setError({});
        if(announcementData.start_date== " " || announcementData.start_time == " "){
          setSettingsModalPopup(true)
        }
        if(announcementData && coverImage && videoTutorialFiles) {
          let data = new FormData();
    
          for(let [ key, values ] of Object.entries(announcementData)) {
            data.append(`${key}`, values)
          }
    
          videoTutorialFiles.forEach((file, index) => {
            data.append(`images`, file);
          });
    
          relatedFiles.forEach((file, index) => {
            data.append(`images`, file);
          });
  
          setLoader(true);
        createAnnouncement(data);
        console.log("The data",data)
       }
       
     
    }
    if (!announcementData.titleValid) {
      setError(prevError => {
          return { 
              ...prevError, 
              title: "Required Title" 
            }
      }); 
    }
    if (!announcementData.meta_descriptionValid) {
      setError(prevError => {
          return {
        ...prevError,
        meta_description: "Description must be at least ten characters long"
      }
    }); 
  }
  if (!announcementData.coverImageValid) {
    setError(prevError => {
        return {
      ...prevError,
      coverImage: "Required CoverImage"
    }
  }); 
}
  };

  useEffect(() => {
    fetchFranchiseeUsers(selectedFranchisee);
  }, [selectedFranchisee]);

  const [show, setShow] = useState(false);
  const handleClose = () => setSettingsModalPopup(false);
  const handleShow = () => setShow(true);
  
  const [settingsModalPopup, setSettingsModalPopup] = useState(false);

  const [allowSubmit, setAllowSubmit] = useState(false);
  const [AnnouncementsSettings, setAnnouncementsSettings] = useState({ user_roles: [] });
  // const [errors, setErrors] = useState({});
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
  const [coverImage, setCoverImage] = useState({});
  
  // const setOperatingManualField = (field, value) => {
  //   console.log("The field and value",field,value)
  //   setOperatingManualData({ ...operatingManualData, [field]: value });
  //   if (!!errors[field]) {
  //     setErrors({
  //       ...errors,
  //       [field]: null,
  //     });
  //   }
  // };

  // const handleAnnouncementsSettings = (event) => {
  //   const { name, value } = event.target;
    
  //   setAnnouncementsSettings((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  // const onSubmit = (e) => {
  //   e.preventDefault();
  //   const newErrors = AddNewAnnouncementValidation(operatingManualData);
  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //   } 
  //   // else {
  //   //   upperRoleUser=getUpperRoleUser();
  //   //   var myHeaders = new Headers();
  //   //   myHeaders.append('Content-Type', 'application/json');
  //   //   let data={...operatingManualData};
  //   //   data.created_by=localStorage.getItem('user_id');
  //   //   data.upper_role=upperRoleUser;
  //   //   fetch(`${BASE_URL}/operating_manual/add`, {
  //   //     method: 'post',
  //   //     body: JSON.stringify(data),
  //   //     headers: myHeaders,
  //   //   })
  //   //     .then((res) => res.json())
  //   //     .then((res) => {
  //   //       setOperatingManualData(res?.result);
  //   //       setFormSettingFlag(true);
  //   //       // navigate('/operatingmanual');
  //   //     });
  //   // }
  //   else{
  //     console.log("The data", operatingManualData.cover_image)
  //     setErrors({});
  //     if(Object.keys(AnnouncementsSettings).length === 1){
  //         setSettingsModalPopup(true)
  //     }

  //     if(settingsModalPopup === false && allowSubmit && operatingManualData ) {
  //       let data = new FormData();

  //       // for(let [key, values] of Object.entries(trainingSettings)) {
  //       //   data.append(`${key}`, values);
  //       // }

  //     //   for(let [ key, values ] of Object.entries(trainingData)) {
  //     //     data.append(`${key}`, values)
  //     //   }

  //     //   videoTutorialFiles.forEach((file, index) => {
  //     //     data.append(`images`, file);
  //     //   });

  //     //   relatedFiles.forEach((file, index) => {
  //     //     data.append(`images`, file);
  //     //   });
        
  //     //   window.scrollTo(0, 0);
  //     //   setLoader(true);
  //     //   createTraining(data);
  //     }
      

  //   }
  // };
 

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
 
    // const uploadFiles = async (name, file) => {
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
    //     const body = new FormData();
    //     const blob = await fetch(await toBase64(file)).then((res) => res.blob());
    //     body.append('image', blob, file.name);
    //     body.append('description', 'operating manual');
    //     body.append('title', name);
    //     body.append('uploadedBy', 'vaibhavi');
  
    //     var myHeaders = new Headers();
    //     myHeaders.append('shared_role', 'admin');
    //     fetch(`${BASE_URL}/uploads/uiFiles`, {
    //       method: 'post',
    //       body: body,
    //       headers: myHeaders,
    //     })
    //       .then((res) => res.json())
    //       .then((res) => {
    //         if (name === 'reference_video') {
    //           data['video_thumbnail'] = res.thumbnail;
    //           data[name] = res.url;
    //           setOperatingManualData(data);
  
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
    useEffect(() =>{
      const role = localStorage.getItem("user_role")
      console.log("The role 3", role) 
      setUserRole(role)
    },[])
  return (
    <>
    {console.log("The annno",announcementData)}

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
                    <h1 className="title-lg">Add New Announcement <span className="setting-ico" onClick={() => setSettingsModalPopup(true)}><img src="../img/setting-ico.png" alt=""/></span></h1>
                  </header>
                </div>
                  <Row>
                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Announcement Title</Form.Label>
                          <Form.Control 
                          type="text" 
                          name="announcement_title"
                          onChange={handleAnnouncementData} 
                          isInvalid = {!!error.announcement_title}
                          />
                          <Form.Control.Feedback type="invalid">
                            {error.announcement_title}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Announcement Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="announcement_description"
                            rows={3}
                            onChange={handleAnnouncementData}
                            isInvalid = {!!error.announcement_description}
                            />
                             <Form.Control.Feedback type="invalid">
                            {error.announcement_description}
                          </Form.Control.Feedback>
                       
                        </Form.Group>
                      </Col>
                    
                    </Row>
                  <div className="my-new-formsection">
                    <Row>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label>Upload Related Image :</Form.Label>
                          <DropOneFile onSave={setCoverImage} 
                           isInvalid = {!!error.coverImage}
                          />
                          {/* <Form.Control.Feedback type="invalid">
                              {(error.coverImage)}
                            </Form.Control.Feedback> */}
                           <span  className="error">
                            {error.coverImage}
                           </span>
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label>Upload Video Tutorial Here :</Form.Label>
                          <DropAllFile onSave={setVideoTutorialFiles} />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Related Files :</Form.Label>
                          <DropAllFile onSave={setRelatedFiles}/>
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <div className="cta text-center mt-5 mb-5">
                          <Button variant="outline" className="me-3" type="submit">Preview</Button>
                          <Button variant="primary" type="submit" onClick={handleDataSubmit}>Save</Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <Row>
                    <Col sm={12}>
                      <div className="bottom_button">
                        {/* <Button className="preview">Preview</Button>
                        <Button className="saveForm" onClick={onSubmit}>
                          Save
                        </Button> */}
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
      <Modal className="training-modal" size="lg" show={settingsModalPopup} 
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
                  <div className="btn-checkbox d-block">
                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox">
                      <Form.Check 
                        type="checkbox" 
                        checked={announcementData.user_roles.includes("coordinator")}
                        label="Co-ordinators"
                        onChange={() => {
                          if(announcementData.user_roles.includes("coordinator")) {
                            let data = announcementData.user_roles.filter(t => t !== "coordinator");
                            setAnnouncementData(prevState => ({
                              ...prevState,
                              user_roles: [...data]
                            }));
                          }

                          if(!announcementData.user_roles.includes("coordinator"))
                          setAnnouncementData(prevState => ({
                            ...prevState,
                            user_roles: [...announcementData.user_roles, "coordinator"]
                        }))}} />
                    </Form.Group>
                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox1">
                      <Form.Check 
                        type="checkbox" 
                        label="Educator"
                        checked={announcementData.user_roles.includes("educator")}
                        onChange={() => {
                          if(announcementData.user_roles.includes("educator")) {
                            let data = announcementData.user_roles.filter(t => t !== "educator");
                            setAnnouncementData(prevState => ({
                              ...prevState,
                              user_roles: [...data]
                            }));
                          }

                          if(!announcementData.user_roles.includes("educator"))
                          setAnnouncementData(prevState => ({
                            ...prevState,
                            user_roles: [...announcementData.user_roles, "educator"]
                        }))}} />
                    </Form.Group>
                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox1">
                      <Form.Check 
                        type="checkbox" 
                        label="Parents"
                        checked={announcementData.user_roles.includes("parents")}
                        onChange={() => {
                          if(announcementData.user_roles.includes("parents")) {
                            let data = announcementData.user_roles.filter(t => t !== "parents");
                            setAnnouncementData(prevState => ({
                              ...prevState,
                              user_roles: [...data]
                            }));
                          }

                          if(!announcementData.user_roles.includes("parents"))
                          setAnnouncementData(prevState => ({
                            ...prevState,
                            user_roles: [...announcementData.user_roles, "parents"]
                        }))}} />
                    </Form.Group>
                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox3">
                      <Form.Check 
                        type="checkbox" 
                        label="All Roles"
                        checked={announcementData.user_roles.length === 3}
                        onChange={() => {
                          if(announcementData.user_roles.includes("coordinator") 
                              && announcementData.user_roles.includes("educator") && announcementData.user_roles.includes("parents")) {
                                setAnnouncementData(prevState => ({
                                  ...prevState,
                                  user_roles: [],
                                }));
                              }
                            
                          if(!announcementData.user_roles.includes("coordinator") 
                              && !announcementData.user_roles.includes("educator") && !announcementData.user_roles.includes("parents"))
                              setAnnouncementData(prevState => ({
                              ...prevState,
                              user_roles: ["coordinator", "educator", "parents"]
                            })
                        )}} />
                    </Form.Group>
                  </div>
                  {/* <Multiselect
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
                  /> */}
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
                  onChange={handleAnnouncementSettings}
                  />
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                <Form.Group>
                  <Form.Label>Schedule Time</Form.Label>
                  <Form.Control 
                  type="time"
                  name="start_time"
                  onChange={handleAnnouncementSettings}
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
          <Button variant="primary" onClick={() =>{
            setAllowSubmit(true)
            setSettingsModalPopup(false)
          }}>
            Save Settings
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddNewAnnouncements;




// import React, { useState } from "react";
// import { Button, Col, Container, Row, Form, Modal } from "react-bootstrap";
// import LeftNavbar from "../components/LeftNavbar";
// import TopHeader from "../components/TopHeader";
// import Multiselect from "multiselect-react-dropdown";
// import DropAllFile from "../components/DragDropMultiple";
// import DropOneFile from '../components/DragDrop';

// const AddNewAnnouncements = () => {

// const [show, setShow] = useState(false);
// const handleClose = () => setShow(false);
// const handleShow = () => setShow(true);
// const handleSaveAndClose = () => setShow(false);

// // CUSTOM STATES
// const [loader, setLoader] = useState(false);

// const [userRoles, setUserRoles] = useState([]);
// const [announcementData, setAnnouncementData] = useState({
//   user_roles: []
// });
// const [coverImage, setCoverImage] = useState({});
// const [videoTutorialFiles, setVideoTutorialFiles] = useState([]);
// const [relatedFiles, setRelatedFiles] = useState([]);
// const [selectedFranchisee, setSelectedFranchisee] = useState("Special DayCare, Sydney");
// const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState([]);

// const [topErrorMessage, setTopErrorMessage] = useState(null);




// const fetchUserRoles = async () => {
//   const response = await axios.get(`${BASE_URL}/api/user-role`);
//   if (response.status === 200) {
//     const { userRoleList } = response.data;
//     setUserRoles([
//       ...userRoleList.map((data) => ({
//         cat: data.role_name,
//         key: data.role_label,
//       })),
//     ]);
//   }
// };

// const createAnnouncement = async (data) => {
//   console.log('CREATING THE ANNOUNCEMENT');
//   const token = localStorage.getItem('token');
//   const response = await axios.post(
//     `${BASE_URL}/announcement/`, data, {
//       headers: {
//         "Authorization": "Bearer " + token
//       }
//     }
//   );

//   if(response.status === 201 && response.data.status === "success") {
//     let { id } = response.data.announcement;

//     let data = new FormData();
//     data.append('id', id);
//     data.append('image', coverImage[0]);

//     let imgSaveResponse = await axios.post(
//       `${BASE_URL}/announcement/coverImg`, data, {
//         headers: {
//           "Authorization": "Bearer " + token
//         }
//       }
//     );

//   if(imgSaveResponse.status === 201 && imgSaveResponse.data.status === "success") {
        
//     console.log('SUCCESS RESPONSE!');
//     setLoader(false)
//     localStorage.setItem('success_msg', 'Announcement Created Successfully!');
//     localStorage.setItem('active_tab', '/created-announcement');
//     window.location.href="/announcement";
  
//   } else {

//     console.log('ERROR RESPONSE!');
//     setTopErrorMessage("unable to save cover image!");
//     setTimeout(() => {
//       setTopErrorMessage(null);
//     }, 3000)
  
//   }
// } else if(response.status === 200 && response.data.status === "fail") {
//   console.log('ERROR RESPONSE!');
//   const { msg } = response.data;
//   setTopErrorMessage(msg);
//   setTimeout(() => {
//     setTopErrorMessage(null);
//   }, 3000)
// }
// };  

//   return (
//     <>
//       <div id="main">
//         <section className="mainsection">
//           <Container>
//             <div className="admin-wrapper">
//               <aside className="app-sidebar">
//                 <LeftNavbar/>
//               </aside>
//               <div className="sec-column">
//                 <TopHeader/>
//                 <div className="entry-container">
//                   <header className="title-head">
//                     <h1 className="title-lg">New Announcement <span className="setting-ico" onClick={handleShow}><img src="../img/setting-ico.png" alt=""/></span></h1>
//                   </header>
//                   <div className="training-form">
//                     <Row>
//                       <Col md={12} className="mb-3">
//                         <Form.Group>
//                           <Form.Label>Announcement Title</Form.Label>
//                           <Form.Control type="text" name="announcement_title" />
//                         </Form.Group>
//                       </Col>
//                       <Col md={12} className="mb-3">
//                         <Form.Group>
//                           <Form.Label>Announcement Description</Form.Label>
//                           <Form.Control
//                             as="textarea"
//                             name="announcement_description"
//                             rows={3}
//                             />
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                     <Row>
//                       <Col md={6} className="mb-3">
//                         <Form.Group>
//                           <Form.Label>Upload Related Image :</Form.Label>
//                           <DropAllFile />
//                         </Form.Group>
//                       </Col>
//                       <Col md={6} className="mb-3">
//                         <Form.Group>
//                           <Form.Label>Upload Video Tutorial Here :</Form.Label>
//                           <DropAllFile />
//                         </Form.Group>
//                       </Col>
//                       <Col md={6} className="mb-3">
//                         <Form.Group>
//                           <Form.Label>Upload Related Files :</Form.Label>
//                           <DropAllFile />
//                         </Form.Group>
//                       </Col>
//                       <Col md={12}>
//                         <div className="cta text-center mt-5 mb-5">
//                           <Button variant="outline" className="me-3" type="submit">Preview</Button>
//                           <Button variant="primary" type="submit">Save</Button>
//                         </div>
//                       </Col>
//                     </Row>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Container>
//         </section>
//       </div>
      
//       <Modal className="training-modal" size="lg" show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title><img src="../img/setting-ico.png" alt=""/> Settings</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="form-settings-content">
//             <Row>
//               <Col lg={3} md={6}>
//                 <Form.Group>
//                   <Form.Label>Send to all franchisee</Form.Label>
//                   <div className="new-form-radio">
//                     <div className="new-form-radio-box">
//                       <label for="yes1">
//                         <input
//                           type="radio"
//                           value="Yes"
//                           name="form_template_select1"
//                           id="yes1"
//                         />
//                         <span className="radio-round"></span>
//                         <p>Yes</p>
//                       </label>
//                     </div>
//                     <div className="new-form-radio-box">
//                       <label for="no1">
//                         <input
//                           type="radio"
//                           value="No"
//                           name="form_template_select1"
//                           id="no1"
//                         />
//                         <span className="radio-round"></span>
//                         <p>No</p>
//                       </label>
//                     </div>
//                   </div>
//                 </Form.Group>
//               </Col>
//               <Col lg={9} md={6}  className="mt-3 mt-md-0">
//                 <Form.Group>
//                   <Form.Label>Select Franchisee</Form.Label>
//                   <Multiselect
//                     placeholder="Select Franchisee"
//                     displayValue="key"
//                     className="multiselect-box default-arrow-select"
//                     onKeyPressFn={function noRefCheck() {}}
//                     onRemove={function noRefCheck() {}}
//                     onSearch={function noRefCheck() {}}
//                     onSelect={function noRefCheck() {}}
//                     options={[
//                       {
//                         cat: "Group 1",
//                         key: "Option 1",
//                       },
//                       {
//                         cat: "Group 1",
//                         key: "Option 2",
//                       },
//                       {
//                         cat: "Group 1",
//                         key: "Option 3",
//                       },
//                       {
//                         cat: "Group 2",
//                         key: "Option 4",
//                       },
//                       {
//                         cat: "Group 2",
//                         key: "Option 5",
//                       },
//                       {
//                         cat: "Group 2",
//                         key: "Option 6",
//                       },
//                       {
//                         cat: "Group 2",
//                         key: "Option 7",
//                       },
//                     ]}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Row className="mt-4">
//               <Col lg={3} md={6}>
//                 <Form.Group>
//                   <Form.Label>Send to all user roles</Form.Label>
//                   <div className="new-form-radio">
//                     <div className="new-form-radio-box">
//                       <label for="yes2">
//                         <input
//                           type="radio"
//                           value="Yes"
//                           name="form_template_select2"
//                           id="yes2"
//                         />
//                         <span className="radio-round"></span>
//                         <p>Yes</p>
//                       </label>
//                     </div>
//                     <div className="new-form-radio-box">
//                       <label for="no2">
//                         <input
//                           type="radio"
//                           value="No"
//                           name="form_template_select2"
//                           id="no2"
//                         />
//                         <span className="radio-round"></span>
//                         <p>No</p>
//                       </label>
//                     </div>
//                   </div>
//                 </Form.Group>
//               </Col>
//               <Col lg={9} md={6}  className="mt-3 mt-md-0">
//                 <Form.Group>
//                   <Form.Label>Select User Roles</Form.Label>
//                   <Multiselect
//                     placeholder="Select User Roles"
//                     displayValue="key"
//                     className="multiselect-box default-arrow-select"
//                     onKeyPressFn={function noRefCheck() {}}
//                     onRemove={function noRefCheck() {}}
//                     onSearch={function noRefCheck() {}}
//                     onSelect={function noRefCheck() {}}
//                     options={[
//                       {
//                         cat: "Group 1",
//                         key: "Option 1",
//                       },
//                       {
//                         cat: "Group 1",
//                         key: "Option 2",
//                       },
//                       {
//                         cat: "Group 1",
//                         key: "Option 3",
//                       },
//                       {
//                         cat: "Group 2",
//                         key: "Option 4",
//                       },
//                       {
//                         cat: "Group 2",
//                         key: "Option 5",
//                       },
//                       {
//                         cat: "Group 2",
//                         key: "Option 6",
//                       },
//                       {
//                         cat: "Group 2",
//                         key: "Option 7",
//                       },
//                     ]}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Row className="mt-4">
//               <Col lg={3} sm={6}>
//                 <Form.Group>
//                   <Form.Label>Schedule Date</Form.Label>
//                   <Form.Control type="date" name="form_name" />
//                 </Form.Group>
//               </Col>
//               <Col lg={3} sm={6} className="mt-3 mt-lg-0">
//                 <Form.Group>
//                   <Form.Label>Schedule Time</Form.Label>
//                   <Form.Control type="time" name="form_name" />
//                 </Form.Group>
//               </Col>
//             </Row>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="transparent" onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button variant="primary">
//             Save Settings
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default AddNewAnnouncements;
