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

const AddNewAnnouncements = () => {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

const handleSaveAndClose = () => setShow(false);

// CUSTOM STATES
const [loader, setLoader] = useState(false);
const [userRoles, setUserRoles] = useState([]);
const [announcementData, setAnnouncementData] = useState({
  user_roles: []
});

  const [coverImage, setCoverImage] = useState({});
  const [videoTutorialFiles, setVideoTutorialFiles] = useState([]);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState("Special DayCare, Sydney");
  const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState([]);

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
        window.location.href="/training";
      
      } else {
    
        console.log('ERROR RESPONSE!');
        setTopErrorMessage("unable to save cover image!");
        setTimeout(() => {
          setTopErrorMessage(null);
        }, 3000)
      
      }
    } else if(response.status === 200 && response.data.status === "fail") {
      console.log('ERROR RESPONSE!');
      const { msg } = response.data;
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
      setAnnouncementData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    const handleDataSubmit = event => {
      event.preventDefault();

      console.log(announcementData);
      console.log("ppppppppppppppppppppppppppppp");
  
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
    }
  };

  useEffect(() => {
    fetchFranchiseeUsers(selectedFranchisee);
  }, [selectedFranchisee]);

  

  // coverImage && console.log('COVER IMAGE:', coverImage);
  // videoTutorialFiles && console.log('VIDEO FILES:', videoTutorialFiles);
  // relatedFiles && console.log('RELATED FILES:', relatedFiles);

  announcementData && console.log('announcementData', announcementData);


  return (
    <>
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar/>
              </aside>
              <div className="sec-column">
                <TopHeader/>
                <div className="entry-container">
                  <header className="title-head">
                    <h1 className="title-lg">New Announcement <span className="setting-ico" onClick={handleShow}><img src="../img/setting-ico.png" alt=""/></span></h1>
                  </header>
                  <div className="training-form">
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Announcement Title</Form.Label>
                          <Form.Control 
                          type="text" 
                          name="title"
                          onChange={handleAnnouncementData} 
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Announcement Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="meta_description"
                            rows={3}
                            onChange={handleAnnouncementData}
                            />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Related Image :</Form.Label>
                          <DropOneFile onSave={setCoverImage} 
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
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
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
      
      <Modal className="training-modal" size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><img src="../img/setting-ico.png" alt=""/> Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settings-content">
            <Row>
              <Col lg={3} md={6}>
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
              </Col>
              <Col lg={9} md={6}  className="mt-3 mt-md-0">
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
              </Col>
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
          <Button variant="primary" onClick={handleSaveAndClose}>
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
