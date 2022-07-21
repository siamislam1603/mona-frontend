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
import Select from 'react-select';
import MyEditor from './CKEditor';
import { useLocation, useNavigate } from 'react-router-dom';
const AddNewAnnouncements = () => {




const handleSaveAndClose = () => setShow(false);

// CUSTOM STATES
const location = useLocation();
const [loader, setLoader] = useState(false);
const [userRoles, setUserRoles] = useState([]);
const [announcementData, setAnnouncementData] = useState({
  user_roles: []
});

  const [videoTutorialFiles, setVideoTutorialFiles] = useState([]);
  const [coverImage, setCoverImage] = useState({});
  const [selectedFranchisee, setSelectedFranchisee] = useState("Special DayCare, Sydney");
  const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState([]);
  const [error, setError] = useState({user_roles: []});

  const [topErrorMessage, setTopErrorMessage] = useState(null);
  const [franchiseeData, setFranchiseeData] = useState(null);




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
  console.log(response);
  console.log("jjjjjjjjjjjjjjjjjjjj");

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

    const fetchFranchiseeList = async () => {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem("user_id");
      const role = localStorage.getItem("user_role");
      if(role == "franchisor_admin"){
      const response = await axios.get(`${BASE_URL}/role/franchisee`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      if(response.status === 200 && response.data.status === "success") {
        let { franchiseeList } = response.data;
  
        setFranchiseeData(franchiseeList.map(franchisee => ({
          id: franchisee.id,
          value: franchisee.franchisee_alias,
          label: franchisee.franchisee_name
        })));  
      }
    }
    else if(role == "franchisee_admin"){
      const response = await axios.get(`${BASE_URL}/role/franchisee/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      if(response.status === 200 && response.data.status === "success") {
        let { franchiseeByIdList } = response.data;
  
        setFranchiseeData(franchiseeByIdList.map(franchisee => ({
          id: franchisee.id,
          value: franchisee.franchisee_alias,
          label: franchisee.franchisee_name
        })));  
      }

    }
    }

    useEffect(() => {
      fetchFranchiseeList();
    }, []);

    const handleAnnouncementFranchisee = (event) => {
      setAnnouncementData((prevState) => ({
        ...prevState,
        franchise: [...event.map(option => option.id + "")]
      }));
    };

    const announcementDescription = (field, value) => {
      setAnnouncementData({ ...announcementData, [field]: value });
      if (!!error[field]) {
        setError({
          ...error,
          [field]: null,
        });
      }
    };

    const handleAnnouncementData = (event) => {
      const { name, value } = event.target;
      console.log("The name and value",name,value)
      setAnnouncementData((prevState) => ({
        ...prevState,
        [name]: value,
      })); 
    };



      

    const handleDataSubmit = event => {
      event.preventDefault();
      console.log("The annoucement ",announcementData)
      let errorObj = AddNewAnnouncementValidation(announcementData, coverImage);
      console.log("The error of announcement",errorObj)
       if(Object.keys(errorObj).length>0){
        setError(errorObj);
       }
       else{
        setError({});
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
       
     
    // }
    if (!announcementData.title) {
      setError(prevError => {
          return { 
              ...prevError, 
              title: "Required Title" 
            }
      }); 
    }
    if (!announcementData.meta_description) {
      setError(prevError => {
          return {
        ...prevError,
        meta_description: "Description must be at least ten characters long"
      }
    }); 
  }
  if (!announcementData.coverImage) {
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
  const handleShow = () => setShow(true);
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [AnnouncementsSettings, setAnnouncementsSettings] = useState({ user_roles: [] });
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
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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
                    <h1 className="title-lg">Add New Announcement <span className="setting-ico"></span></h1>
                  </header>
                </div>
                  <Row>
                        <Form.Group className="col-md-6 mb-3">
                          <Form.Label>Announcement Title</Form.Label>
                          <Form.Control 
                          type="text" 
                          name="title"
                          onChange={handleAnnouncementData} 
                          isInvalid = {!!error.title}
                          />
                          <Form.Control.Feedback type="invalid">
                            {error.title}
                          </Form.Control.Feedback>
                        </Form.Group>
                      <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Select Franchisee</Form.Label>

                            <div className="select-with-plus">
                            <Select
                              placeholder="Which Franchisee?"
                              closeMenuOnSelect={false}
                              isMulti
                              value={franchiseeData?.filter(d => parseInt(d.id) === parseInt(localStorage.getItem('franchisee_id')))}
                              options={franchiseeData} 
                              onChange={handleAnnouncementFranchisee}
                            />
                  </div>
                            
                          </Form.Group>
                          </Row>
                          <Row>
                      <Col md={12} className="mb-3">
                        <Form.Group>
                        <Form.Label>Announcement Description</Form.Label>
                        <MyEditor
                              errors={error}
                              name ="meta_description"
                              data={announcementData.meta_description} 

                              handleChange={(e, data) => {
                                announcementDescription(e, data);
                              }}
                            />
                           {error.meta_description && <p className="form-errors">{error.meta_description}</p>}
                            {/* <Form.Control
                          type="text" 
                          name="meta_description"
                          onChange={handleAnnouncementData} 
                          isInvalid = {!!error.meta_description}
                          />
                          <Form.Control.Feedback type="invalid">
                            {error.meta_description}
                          </Form.Control.Feedback> */}
                        </Form.Group>
                      </Col>
                    </Row>
                  <div className="my-new-formsection">
                    <Row>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label>Upload Related Image :</Form.Label>
                          <DropOneFile onSave={setCoverImage} 
                          setErrors={setError}
                          />
                            { error.coverImage && <span className="error mt-2">{error.coverImage}</span> }
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
                  <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                  <Form.Group>
                  <Form.Label>Schedule Date</Form.Label>
                  <Form.Control 
                   type="date"
                   name="start_date"
                  onChange={handleAnnouncementData}
                  />
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                <Form.Group>
                  <Form.Label>Schedule Time</Form.Label>
                  <Form.Control 
                  type="time"
                  name="start_time"
                  onChange={handleAnnouncementData}
                  />
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


export default AddNewAnnouncements;




