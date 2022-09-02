
import React, { useEffect, useState,useRef } from 'react';
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
import * as ReactBootstrap from 'react-bootstrap';
import DropVideo from '../components/DragDropVideo';

import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
const AddNewAnnouncements = () => {


  const theDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = yyyy + '-' + mm + '-' + dd;
    console.log("Today",today)
    return today
  }
  const hour = () =>{
    var date = new Date();
    let currentHours = date.getHours();
    currentHours = ("0" + currentHours).slice(-2);
    console.log("Current hour",currentHours)
    let  min = date.getMinutes()
    console.log("Time",typeof min)
    min = ("0" + min).slice(-2);


    let time = currentHours + ":" + min
    console.log("time and current hour",time,"min",min+"10",currentHours)
    return time;
    
   } 



const handleSaveAndClose = () => setShow(false);

// CUSTOM STATES
const location = useLocation();
const [loader, setLoader] = useState(false);
const [addNewAnnouncement,setAddnewAnnouncement] = useState(false)
const [userRoles, setUserRoles] = useState([]);
const [announcementData, setAnnouncementData] = useState({
  user_roles: [],
  is_event:0,
  franchise:[],
  start_date:theDate(),
  // start_time:new Date().getHours() + ":" + new Date().getMinutes()
  start_time:hour()
});
const [titleError,setTitleError] = useState();
  const [videoTutorialFiles, setVideoTutorialFiles] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [selectedFranchisee, setSelectedFranchisee] = useState();
  const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState([]);
  const [error, setError] = useState({user_roles: []});
  const [allFranchise,setAllFranchise] = useState(false)
  const [topErrorMessage, setTopErrorMessage] = useState(null);
  const [franchiseeData, setFranchiseeData] = useState();
  const [titleChecking,setTitleChecking] = useState(true)



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
  console.log("CALLING CREATED ANNOUCNEMENT")
  try {
    
    // console.log("title checking", resp)
    const token = localStorage.getItem('token');

  const response = await axios.post(
    `${BASE_URL}/announcement/`, data, {
      headers: {
        "Authorization": "Bearer " + token
      }
    }
  );

  console.log("ADde anncunement response",response);
  console.log("jjjjjjjjjjjjjjjjjjjj");
  if(response.status === 200 && response.data.status === "fail"){
    setAddnewAnnouncement(false)
    console.log("TITLE ALREADY EXIT")
    setTitleError("Title already exit")
  }
  

  if(response.status === 201 && response.data.status === "success" && coverImage.length > 0) {
    console.log(typeof(coverImage));

    console.log("datasaved");
    console.log(response.data);
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
          setTopErrorMessage("Unable to save cover image!");
          setLoader(false)
          setAddnewAnnouncement(false)


          setTimeout(() => {
            setTopErrorMessage(null);
          }, 3000)
        
        }      
    } 
    // else if(response.status === 403 && response.data.status === "fail"){
    //   console.log('ERROR RESPONSE! Permission Denied');
    //   setTopErrorMessage("Permission Denied");
    //   setLoader(false)
    //   setAddnewAnnouncement(false)

    //   setTimeout(() => {
    //     setTopErrorMessage(null);
    //   }, 3000)
    // }
    else if(response.status === 201 && response.data.status === "success" && coverImage.length <1){
    window.location.href="/announcements";
        
    }
   } catch (error) {
    console.log("ERROR ADD ANNOUNCEMNT",error)
    if(error.response.status === 403 && error.response.data.status === "fail")
    console.log('ERROR RESPONSE! Permission Denied');
    setTopErrorMessage("Permission Denied");
    setAddnewAnnouncement(false)

    setLoader(false)
    setTimeout(() => {
      setTopErrorMessage(null);
    }, 3000)
   }
}

    const fetchFranchiseeUsers = async (franchisee_name) => {
      const response = await axios.get(`${BASE_URL}/role/user/${franchisee_name.split(",")[0].split(" ").map(dt => dt.charAt(0).toLowerCase() + dt.slice(1)).join("_")}`);
      if(response.status === 200 && Object.keys(response.data).length > 1) {
        const { users } = response.data;
        setFetchedFranchiseeUsers(
          ...users?.map((data) => ({
            id: data.id,
            cat: data.fullname.toLowerCase().split(" ").join("_"),
            key: data.fullname
          })),
        );
      }
    };

    const fetchFranchiseeList = async () => {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem("user_id");
      const role = localStorage.getItem("user_role");

      const response = await axios.get(`${BASE_URL}/role/franchisee`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      console.log("The franhsie list",response)
      if(response.status === 200 && response.data.status === "success") {
        let { franchiseeList } = response.data;
        setFranchiseeData(franchiseeList.map(franchisee => ({
                   
          id: franchisee.id,
          value: franchisee.franchisee_name,
          label: franchisee.franchisee_name,
          city: franchisee.franchisee_city,
          key: `${franchisee.franchisee_name}`

        })));  

      }
    }

    useEffect(() => {
      fetchFranchiseeList();
    }, []);

    const handelSingleFranhisee = (event) =>{
      setAnnouncementData((prevState) => ({
        ...prevState,
      franchise: []
        
      }))
    }
    const handleAnnouncementFranchisee = (event) => {
      // localStorage.getItem('user_role') === 'franchisor_admin' ?

      setAnnouncementData((prevState) => ({
        ...prevState,
        franchise: [...event.map(option => option.id + "")]
      }));
      // console.log("EVENT ",event)
     
    };

    const announcementDescription = (field, value) => {
      // console.log("The field and value in addnewannoucement",field,value)
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
      // console.log("The name and value",name,value)
      if(localStorage.getItem("user_role") === "franchisee_admin"){

        let id = localStorage.getItem("franchisee_id")
        setAnnouncementData((prevState) => ({
          ...prevState,
        franchise: [id]
          
        }))
      }
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

    };
    const titleCheck = async() =>{
      try {
        const token = localStorage.getItem('token');
        console.log(announcementData.title)
            const resp = await axios.get(`${BASE_URL}/announcement/check-title?title=${announcementData.title}`,{
              headers: {
                "Authorization": "Bearer " + token
              }
            })
            console.log("title checking", resp)
            if(resp.status === 200 && resp.data.status === "success"){
              setTitleChecking(true)
            }
      } catch (error) {
         if(error.response.status === 404){
          console.log("TItle checking error",error)
          setTitleChecking(false)
          setAddnewAnnouncement(false)
          setTitleError("Title already exit")
         }
      }
    }

    const handleDataSubmit = event => {
      event.preventDefault();
      // if()
      console.log("All frnahise",allFranchise)
      console.log("The annoucement after submit ",announcementData)
      console.log("THe title error",titleError,titleChecking)
      let errorObj = AddNewAnnouncementValidation(announcementData, coverImage, allFranchise,titleError,);

      console.log("The error of announcement",errorObj)
       if(Object.keys(errorObj).length>0){
        setError(errorObj);
        // errorRef.current.scrollIntoView();

        window.scroll(0,0)
        
       }
       else{
        console.log("INSDIE ERROR EMPTY")
        setError({});
        if(announcementData && coverImage && videoTutorialFiles) {
          let data = new FormData();
    
          for(let [ key, values ] of Object.entries(announcementData)) {
            data.append(`${key}`, values)
          }
    
          videoTutorialFiles.forEach((file, index) => {
            data.append(`images`, file);
            console.log("APPEND VIDEO")
          });
    
          relatedFiles.forEach((file, index) => {
            data.append(`images`, file);
          });
          setAddnewAnnouncement(true)
          setLoader(true);
          // {
          //   titleChecking ? 
          // createAnnouncement(data) :
          // null

          // }
          console.log("titlechecing",titleChecking)
          titleChecking && createAnnouncement(data);
         console.log("The data",data)
       }
      }
      console.log("The datad adndsjkvnskdja ")
       
     
    // }
    // if (!announcementData.title) {
    //   setError(prevError => {
    //       return { 
    //           ...prevError, 
    //           title: "Required Title" 
    //         }
    //   }); 
    // }
  //   if (!announcementData.meta_description) {
  //     setError(prevError => {
  //         return {
  //       ...prevError,
  //       // meta_description: "Description must be at least ten characters long"
  //     }
  //   }); 
  // }
//   if (!announcementData.coverImage) {
//     setError(prevError => {
//         return {
//       ...prevError,
//       coverImage: "Required CoverImage"
//     }
//   }); 
// }

  };

  

  console.log("Date",new Date().toISOString().slice(0,10))
  // console.log("Time",new Date().getHours() + ":" + new Date().getMinutes())
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
      // hour()
      // theDate()
    },[])
    // useEffect(() =>{
    //   titleCheck()
    // },[announcementData.title])

   
  // coverImage && console.log("TYPE OF IMAGE:", typeof coverImage);
  console.log("The franhiseData 1",allFranchise,titleChecking);
  console.log("SELECETED FRANHISE",selectedFranchisee,franchiseeData)
  announcementData && console.log('Announcement Data:', announcementData);
  return (
    
    <>
    {topErrorMessage && <p className="alert alert-danger" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topErrorMessage}</p>} 
     
      <div id="main">
        <section className="mainsection ">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
                <div className="new_module">
                {/* <TopHeader/> */}
                <TopHeader setSelectedFranchisee={setSelectedFranchisee} />

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
                          isInvalid = {!!error.title || !!error.titleError}
                          />
                          <Form.Control.Feedback type="invalid">
                            {error.title}
                          </Form.Control.Feedback>
                          {/* {titleError && <div className="error">{titleError}</div>}  */}
                         
                        </Form.Group>
                        {
                          localStorage.getItem("user_role") === "franchisor_admin" ? (
                            
                            <Form.Group className="col-md-6 mb-3">
                              <div className="btn-radio inline-col">
                                <Form.Label>Send to all Franchises :</Form.Label>
                                <div>
                                <Form.Check
                                  type="radio"
                                  name="franchise"
                                  id="r"
                                  label="Yes"
                                  // checked={announcementData?.send_to_all_franchise === true}
                                  onChange={(event) =>{             
                                    setAnnouncementData((prevState) => ({
                                      ...prevState,
                                      send_to_all_franchise: true,
                                      franchise: []
                                    }));
                                  setAllFranchise(true)
                                  }}
                                  
                                   />
                                <Form.Check
                                  type="radio"
                                  name="franchise"
                                  id="t"
                                  // checked={announcementData?.send_to_all_franchise === false}
                                  onChange={() =>{
                                    setAnnouncementData(prevState => ({
                                      ...prevState,
                                      send_to_all_franchise: false
                                    }))
                                    setAllFranchise(false)
                                  }
                                  
                                }
                                  
                                defaultChecked
                                  label="No"
                                   />
                                   
                                </div>
                              
                              </div>
                            </Form.Group>
                        
                          )
                          :(
                            null
                          )
                        }
                            <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Select Franchise</Form.Label>
        
                            {
                            localStorage.getItem('user_role') === 'franchisor_admin' ?
                            <div className="select-with-plus">
                              <Multiselect
                              disable={allFranchise === false?false:true}
                              // singleSelect={true}
                              // placeholder={"Select Franchise Names"}
                              // isInvalid = {!!error.franchise}

                              displayValue="key"
                              selectedValues={franchiseeData?.filter(d => announcementData?.franchise?.includes(parseInt(d.id)))}
                              className="multiselect-box default-arrow-select"
                              onKeyPressFn={function noRefCheck() { }}
                              onRemove={function noRefCheck(data) {
                                setAnnouncementData((prevState) => ({
                                  ...prevState,
                                  franchise: [...data.map(data => data.id)],

                                  // : [...event.map(option => option.id + "")]
                                }));
                              }}
                              // onSearch={function noRefCheck() { }}
                              onSelect={function noRefCheck(data) {
                                setAnnouncementData((prevState) => ({
                                  ...prevState,
                                  franchise: [...data.map(data => data.id)],

                                  // : [...event.map(option => option.id + "")]
                                }));
                              }}
                              options={franchiseeData}
                           />

                            
                            </div>
                            
                          : <div className="select-with-plus">
                              <Select
                               
                                placeholder={franchiseeData?.filter(d => parseInt(d.id) === parseInt(selectedFranchisee))[0]?.label || "Which Franchisee?"}
                                isDisabled={true}
                                closeMenuOnSelect={true}
                                hideSelectedOptions={true}
                              />
                            </div>

                          }
                        {allFranchise? null: <>
                            {   
                             error.franchise && <p className="form-errors">{error.franchise}</p>}

                           </>}
                           {/* {
                           error.franchise && <p className="form-errors">{error.franchise}</p>} */}


                          </Form.Group>
                          </Row>
                          <Row>

                          
                      
                        
                      <Col md={12} className="mb-3">
                        <Form.Group>
                        <Form.Label>Announcement Description</Form.Label>
                        <MyEditor
                              errors={error}
                              name ="meta_description"
                              // data={announcementData.meta_description} 
                             

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
                    <Row>
                    <Col lg={3} sm={6}>
                <Form.Group>
                  <Form.Label>Schedule Date</Form.Label>

                  <Form.Control  
                        type="date"
                        // min={new Date().toISOString().slice(0, 10)}
                    min={new Date().toISOString().slice(0, 10)}

                        // defaultValue= {new Date().toISOString().slice(0, 10)}
                        defaultValue={theDate()}
                          // value={new Date().toISOString().slice(0, 10)}
                        name="start_date"
                        onChange={handleAnnouncementData}
                      />
                </Form.Group>
           
                {error.start_date && <p className="form-errors">{error.start_date}</p>}

              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                <Form.Group>
                  <Form.Label>Schedule Time</Form.Label>
                  <Form.Control 
                    type="time"
                    name="start_time"
                    onChange={handleAnnouncementData}
                    defaultValue={hour()}
                    // min={moment().add(6, "hours")}
                    onInvalid={!!error.start_time}
                  />
                </Form.Group>
                {error.start_time && <p className="form-errors">{error.start_time}</p>}
             
              </Col>

              <Col lg={3} sm={6}>
                  <Form.Group >
                    <div className="btn-radio inline-col">
                      <Form.Label>Event or Announcement</Form.Label>
                      <div>
                      <Form.Check
                        type="radio"
                        name="is_event"
                        id="a"
                        label="Announcement"
                        onChange={() =>{
                          setAnnouncementData((prevState) => ({
                            ...prevState,
                            // [name]: value,
                            is_event:0
                          })); 
                        }}
                        
                        defaultChecked
                       
                         />
                      <Form.Check
                        type="radio"
                        name="is_event"
                        id="e"
                        onChange={() =>{
                          setAnnouncementData((prevState) => ({
                            ...prevState,
                            // [name]: value,
                            is_event:1
                          })); 
                        }}
                        label="Event"
                         />
                      </div>
                    
                    </div>
                  </Form.Group>
                </Col>
              
              
                    </Row>
                  <div className="my-new-formsection">
                    <Row>
                      <Col sm={6}>
                        <Form.Group className="mb-3 form-group">
                          <Form.Label> Cover Image </Form.Label>
                          <DropOneFile onSave={setCoverImage} 
                          setErrors={setError}
                          />
                            { error.coverImage && <span className="error mt-2">{error.coverImage}</span> }
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group className="mb-3 form-group">
                          <Form.Label>Upload Video </Form.Label>
                          <DropVideo onSave={setVideoTutorialFiles} />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group className="mb-3 form-group">
                          <Form.Label>Upload Files </Form.Label>
                          <DropAllFile onSave={setRelatedFiles}/>
                        </Form.Group>
                      </Col>
                  {/* <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                  <Form.Group className="mb-3 form-group">
                  <Form.Label>Schedule Date</Form.Label>
                  <Form.Control 
                   type="date"
                   name="start_date"
                  onChange={handleAnnouncementData}
                  />
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                <Form.Group className="mb-3 form-group">
                  <Form.Label>Schedule Time</Form.Label>
                  <Form.Control 
                  type="time"
                  name="start_time"
                  onChange={handleAnnouncementData}
                  />
                </Form.Group>
              </Col> */}
                      <Col md={12}>
                        <div className="cta text-center mt-5 mb-5">
                        <Button className="preview" onClick={() =>window.location.href="/announcements" }>Cancel</Button>

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
      {
        addNewAnnouncement && 
        <Modal
        show={addNewAnnouncement}
        onHide={() => setAddnewAnnouncement(false)}>
        <Modal.Header>
          <Modal.Title>
            Adding Announcement
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="create-training-modal" style={{ textAlign: 'center' }}>
            <p>This may take some time.</p>
            <p>please wait....</p>
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
    </>
  );
};


export default AddNewAnnouncements;


