
import React, { useEffect, useState,useRef } from 'react';
import { Button, Col, Container, Row, Form, Modal } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import Multiselect from "multiselect-react-dropdown";
import DropAllFile from "../components/DragDropMultiple";
import DropOneFile from '../components/DragDrop';
import axios from 'axios';
import { BASE_URL } from '../components/App';
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
    return today
  }


const handleSaveAndClose = () => setShow(false);

// CUSTOM STATES
const location = useLocation();

const [loader, setLoader] = useState(false);
const [timeError,setTimeError] = useState()
const [addNewAnnouncement,setAddnewAnnouncement] = useState(false)
const [userRoles, setUserRoles] = useState([]);
const [announcementData, setAnnouncementData] = useState({
  user_roles: [],
  is_event:0,
  franchise:[],
  start_date:theDate(),
  start_time:moment().add(10,"minutes").format("HH:mm")
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
  const [titleChecking,setTitleChecking] = useState(false)
  const [topMessage,setTopMessage] = useState(null);

let title = useRef(null)
const createAnnouncement = async (data) => {
  try {
    const token = localStorage.getItem('token');

  const response = await axios.post(
    `${BASE_URL}/announcement/`, data, {
      headers: {
        "Authorization": "Bearer " + token
      }
    }
  );


  if(response.status === 200 && response.data.status === "fail"){
    setAddnewAnnouncement(false)

    // setTitleError("Title already exit")
  }
  

  if(response.status === 201 && response.data.status === "success" && coverImage.length > 0) {


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
      
        if(imgSaveResponse.status === 201 && imgSaveResponse.data.status === "success") {
              
          setLoader(false)
          localStorage.setItem('success_msg', 'Announcement Created Successfully!');
          localStorage.setItem('active_tab', '/created-announcement');
          window.location.href="/announcements";
        
        } else {
      
          setTopErrorMessage("Unable to save cover image!");
          setLoader(false)
          setAddnewAnnouncement(false)


          setTimeout(() => {
            setTopErrorMessage(null);
          }, 3000)
        
        }      
    } 
  
    else if(response.status === 201 && response.data.status === "success" && coverImage.length <1){
      localStorage.setItem('success_msg', 'Announcement Created Successfully!');
      localStorage.setItem('active_tab', '/created-announcement');
      window.location.href="/announcements";
        
    }
   } catch (error) {
    if(error.response.status === 403 && error.response.data.status === "fail")
    setTopErrorMessage("Internal Server Error ");
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
      setTitleError()
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
            const resp = await axios.get(`${BASE_URL}/announcement/check-title?title=${announcementData.title}`,{
              headers: {
                "Authorization": "Bearer " + token
              }
            })
            if(resp.status === 200 && resp.data.status === "success"){
              setTitleChecking(true)
            }
      } catch (error) {
         if(error.response.status === 404){
          setTitleChecking(false)
          // setAddnewAnnouncement(false)
          setTitleError("Anouncement title already exit ")
          
         }
      }
    }
    const handleTitle = (e) =>{
      titleCheck()
    }
    const handleSubmit = (e) =>{
      handleDataSubmit(e)
    }
    const handleDataSubmit = event => {
      event.preventDefault();
      let errorObj =  AddNewAnnouncementValidation(announcementData, coverImage, allFranchise,titleError,titleChecking);
       if(Object.keys(errorObj).length>0){
        setError(errorObj);
        // window.scroll(0,0)
        console.log("Error Object",errorObj)
        // const titleDiv = useRef(null)
        console.log("dsdsads",typeof     Object.keys(errorObj), typeof title)
        // let res = useRef(Object.keys(errorObj)[0])
     
        const executeScroll = () => title.current.scrollIntoView() 
        executeScroll()
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
          setAddnewAnnouncement(true)
          setLoader(true);
           createAnnouncement(data);
       }
      }
  };

  

  useEffect(() => {
    fetchFranchiseeUsers(selectedFranchisee);
  }, [selectedFranchisee]);
 

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  const [relatedFiles, setRelatedFiles] = useState([]);
  const [userRole,setUserRole] = useState("");
 


    useEffect(() =>{
      const role = localStorage.getItem("user_role")
      setUserRole(role)
    },[])

 


var ds=moment().add(10,"minutes").format("HH:mm")
var cureent = moment().format("HH:mm")

console.log("moment",moment(new Date(),"HH:mm"))
console.log("ds",ds,cureent)
// const valid = moment().add(10,"minutes").format("HH:mm").isAfter(cureent);
// console.log("valid",valid)

   console.log("Announcement Data",announcementData)

  return (
    
    <>
   {topMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topMessage}</p>} 

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
                  <Row >
                        <Form.Group ref={title} className="col-md-6 mb-3">
                          <Form.Label>Announcement Title</Form.Label>
                          <Form.Control 
                          type="text" 
                          name="title"
                          onChange={handleAnnouncementData} 
                          onBlur={handleTitle} 
                          

                          isInvalid = {!!error.title || titleError}
                          />
                          <Form.Control.Feedback type="invalid">
                            {error.title}
                          </Form.Control.Feedback>
                          {!error.title &&titleError && <div className="error">{titleError}</div>} 
                         
                        </Form.Group>
                        {
                          localStorage.getItem("user_role") === "franchisor_admin" ? (
                            
                            <Form.Group className="col-md-6 mb-3">
                              <div className="btn-radio inline-col">
                                <Form.Label>Send to all Franchises</Form.Label>
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
                            
                            
                            <Form.Label>Select Franchise(s)</Form.Label>
        
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
                              handleChange={(e, data) => {
                                announcementDescription(e, data);
                              }}
                            />
                           {error.meta_description && <p className="form-errors">{error.meta_description}</p>}
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
                    
                    
                    defaultValue={moment().add(10, 'minutes').format('HH:mm')}
                    // min={moment().add(6, "hours")}
                    onInvalid={!!error.start_time}
                  />
                </Form.Group>
                {error.start_time && <p className="form-errors">{error.start_time}</p>}
                <h1>{timeError}</h1>
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
                          <Form.Label>Upload Cover Image </Form.Label>
                          <DropOneFile onSave={setCoverImage} 
                          setErrors={setError}
                          />
                            { error.coverImage && <span className="error mt-2">{error.coverImage}</span> }
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group className="mb-3 form-group">
                          <Form.Label>Upload Videos </Form.Label>
                          <DropVideo onSave={setVideoTutorialFiles} />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group className="mb-3 form-group">
                          <Form.Label>Upload Files </Form.Label>
                          <DropAllFile onSave={setRelatedFiles}/>
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <div className="cta text-center mt-5 mb-5">
                        <Button className="preview" onClick={() =>window.location.href="/announcements" }>Cancel</Button>

                          <Button variant="primary" type="submit" onClick={handleSubmit}>Save</Button>
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


