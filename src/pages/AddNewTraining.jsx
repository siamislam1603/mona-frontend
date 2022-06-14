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
import { BASE_URL } from '../components/App';

const animatedComponents = makeAnimated();

const timereq = [
  {
    value: '3',
    label: '3',
  },
  {
    value: '5',
    label: '5',
  },
];

const AddNewTraining = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSaveAndClose = () => setShow(false);

  // CUSTOM STATES
  const [hideSelect, setHideSelect] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [trainingCategory, setTrainingCategory] = useState([]);
  const [trainingData, setTrainingData] = useState({});
  const [trainingMedia, setTrainingMedia] = useState({});
  const [selectedFranchisee, setSelectedFranchisee] = useState("Special DayCare, Sydney");
  const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState([]);

  // LOG MESSAGES
  const [topErrorMessage, setTopErrorMessage] = useState(null);
  const [topSuccessMessage, setTopSuccessMessage] = useState(null);

  // FETCHING USER ROLES
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

  // FUNCTION TO SEND TRAINING DATA TO THE DB
  const createTraining = async (data) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${BASE_URL}/training/addTraining`, data, {
        headers: {
          "Authorization": "Bearer "+ token
        }
      }
    );

    console.log('REPSONSE:', response.data.status);
    if(response.status === 201 && response.data.status === "success") {
      setTopSuccessMessage("Training created successfully.");
      setTimeout(() => {
        setTopSuccessMessage(null);
        window.location.href="/training";
      }, 3000);

    } else if(response.status === 200 && response.data.status === "fail") {
      const { msg } = response.data;
      setTopErrorMessage(msg);
      setTimeout(() => {
        setTopErrorMessage(null);
      }, 3000);
    }
  };  

  // FUNCTION TO FETCH USERS OF A PARTICULAR FRANCHISEE
  const fetchFranchiseeUsers = async (franchisee_name) => {
    const response = await axios.get(`${BASE_URL}/role/user/${franchisee_name.split(",")[0]}`);
    if(response.status === 200 && Object.keys(response.data).length > 1) {
      const { users } = response.data;
      setFetchedFranchiseeUsers([
        ...users?.map((data) => ({
          cat: data.fullname,
          key: data.fullname.toLowerCase().split(" ").join("_"),
        })),
      ]);
    }
  };

  // FETCHING TRAINING CATEGORIES
  const fetchTrainingCategories = async () => {
    const response = await axios.get(
      `${BASE_URL}/training/get-training-categories`
    );
    if (response.status === 200) {
      const { categoryList } = response.data.data;
      setTrainingCategory([
        ...categoryList.map((data) => ({
          value: data.category_alias,
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

  const handleDataSubmit = () => {
    if(trainingData) {
      createTraining(trainingData);
    }
  };

  useEffect(() => {
    fetchUserRoles();
    fetchTrainingCategories();
  }, []);

  useEffect(() => {
    fetchFranchiseeUsers(selectedFranchisee);
  }, [selectedFranchisee]);

  return newErrors;
}
console.log()
const onSubmit=(e)=>{
  e.preventDefault();
  settheerror(" ");
  const newErrors = checkValidation();
    const err = Object.keys(newErrors);

    // Object.keys(newErrors).length > 0 || 
    if (Object.keys(newErrors).length > 0 || !count.file1) {
      // console.log("The file 1 error",file1error)
        setErrors(newErrors);
        console.log("The erros",errors);

    }
    else{
     
      addTraining(form)
    }
  
}
const addTraining = async (data) => {
  const body = {
    "images" : count.file1,
    "images" : count.file1,
    "images" : count.file1,
    "description" : data.training_description,
    "title": data.training_name,
    "uploadedBy": "pankaj",
    "images" : count.file1,
    "alias" : "update",
    "category":"1",
    "meta_description" :"meta",
    "completion_in":"hour",
    "completion_time" : data.time_required,
    "addedBy":"1",
    "is_apllicable_to_all":"1",
    "assigned_role" : " " ,
    "assigned_users":"test",
    "display_order" : "12345",
    "start_date":data.start_date


  }
  const res = await axios.post('http://3.26.39.12:4000/trainning/addTraining', body,{
    headers:{
      role: "admin"
    }
  })
  .then((response) => {
    console.log(response.data)
    if(res.status === 204) {
      console.log("Success traing added")
     }
  })
  .catch((errors) =>{
    console.log(errors)
  })
};
// const add = () =>{

//       console.log(form);
//       const body = {
//           "vehicleCategoryName": data.vehicleCategory,
//           "status":0,
//           "vehicleCategoryCode":data.vehicleCategoryCode,
//           "vehicleCategoryalfa":data.vehicleCategoryAlpha.toLocaleUpperCase()

//       }

//       axios.post("http://3.26.39.12:4000/trainning/addTraining", body)
//           .then((response) => {
//               console.log(response.data);
//               if (response.data.status === "success") {
//                   showAlert("Vehicle Category added successfully.", "success")
//                   setIsSubmit(false)
//                   setData({
//                       vehicleCategory: "",
//                       status: "",
//                       vehicleCategoryCode: "",
//                       vehicleCategoryAlpha: ""
//                   })
//                   setTimeout(() => {
//                       history.push('/vehicleCategory')

//                   }, 2000);

//               } 
//           }).catch((error)=>{
//               console.log("The Error",error)
//           })
  
// }

console.log("The Roles",roles)
  return (
    <>
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
                      Add New Training{' '}
                      <span className="setting-ico" onClick={handleShow}>
                        <img src="../img/setting-ico.png" alt="" />
                      </span>
                    </h1>
                  </header>
                    {topErrorMessage && <p className="alert alert-danger">{topErrorMessage}</p>} 
                    {topSuccessMessage && <p className="alert alert-success">{topSuccessMessage}</p>}
                  <div className="training-form">
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Training Name</Form.Label>
<<<<<<< HEAD
                          <Form.Control 
                            type="text" 
                            name="training_name" 
                            onChange={setField}
                            isInvalid={!!errors.training_name}
                            />
                          <Form.Control.Feedback type="invalid">
                            {errors.training_name}
                          </Form.Control.Feedback>
=======
                          <Form.Control
                            type="text"
                            name="title"
                            onChange={handleTrainingData}
                          />
>>>>>>> origin/master
                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Training Category</Form.Label>
                          <Select
                            closeMenuOnSelect={true}
                            components={animatedComponents}
                            options={trainingCategory}
                            onChange={(event) =>
                              setTrainingData((prevState) => ({
                                ...prevState,
                                training_category: event.value,
                              }))
                            }
                          />
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Training Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="training_description"
                            rows={3}
<<<<<<< HEAD
                            onChange={setField}
                            isInvalid={!!errors.training_description}
                            />
                          <Form.Control.Feedback type="invalid">
                            {errors.training_description}
                          </Form.Control.Feedback>
=======
                            onChange={handleTrainingData}
                          />
>>>>>>> origin/master
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group className="relative">
                          <Form.Label>Time required to complete</Form.Label>
                          <Select
<<<<<<< HEAD
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              options={timereq}
                              onChange={handleTime}
                              name="select_hour"
                              isInvalid={!!errors.select_hour}
                            />
                            <span className="rtag">hours</span>
=======
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            options={timereq}
                            onChange={(event) =>
                              setTrainingData((prevState) => ({
                                ...prevState,
                                time_required_to_complete:
                                  event.value + ' hr',
                              }))
                            }
                          />
                          <span className="rtag">hours</span>
>>>>>>> origin/master
                        </Form.Group>
                        <Form.Control.Feedback type="invalid">
                            {errors.select_hour}
                          </Form.Control.Feedback>
                      </Col>
                    </Row>
                    <Row>
       
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Cover Image :</Form.Label>
<<<<<<< HEAD
                          <DropAllFile 
                            count={count}
                            num="1"
                            setCount={(acceptedFiles) => setCount(prevState => ({
                              ...prevState,
                              file1: acceptedFiles
                            }))}
                            multiFiles={multiFiles}
                            setMultiFiles={setMultiFiles} />
                            {/* <img url={count.file1.path}/> */}
                            {console.log("The count file",count.file1)}
                            {count.file1 ?  null:<p>{file1error}</p> }
                        </Form.Group>
                      </Col>
                      
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Video Tutorial Here :</Form.Label>
                          <DropAllFile
                            count={count}
                            num="1"
                            setCount={(acceptedFiles) => setCount(prevState => ({
                              ...prevState,
                              file2: acceptedFiles
                            }))} 
                            name="drop"
                            />
                            {count.file2 ? null : <p>{file2error}</p>}
                          
=======
                          <DropOneFile
                            imageUploaded={trainingMedia.cover_image}
                            onChange={(data) =>
                              setTrainingMedia((prevState) => ({
                                ...prevState,
                                cover_image: data,
                              }))
                            }
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Video Tutorial Here :</Form.Label>
                          <DropOneFile
                            onChange={(data) =>
                              setTrainingMedia((prevState) => ({
                                ...prevState,
                                video_tutorial: data,
                              }))
                            }
                          />
>>>>>>> origin/master
                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Related Files :</Form.Label>
                          <DropAllFile
<<<<<<< HEAD
                            count={count}
                            num="2"
                            setCount={(acceptedFiles) => setCount(prevState => ({
                              ...prevState,
                              file3: acceptedFiles
                            }))} />
                            {count.file3 ? null : <p>{file3error}</p>}

=======
                            onChange={(data) =>
                              setTrainingMedia((prevState) => ({
                                ...prevState,
                                related_files: [...data],
                              }))
                            }
                          />
>>>>>>> origin/master
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <div className="cta text-center mt-5 mb-5">
<<<<<<< HEAD
                          <Button variant="outline" className="me-3" type="submit">Preview</Button>
                          <Button variant="primary" type="submit" onClick={onSubmit}>Save</Button>
=======
                          <Button
                            variant="outline"
                            className="me-3"
                            type="submit"
                          >
                            Preview
                          </Button>
                          <Button
                            variant="primary"
                            type="submit"
                            onClick={handleDataSubmit}
                          >
                            Save
                          </Button>
>>>>>>> origin/master
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

      <Modal
        className="training-modal"
        size="lg"
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <img src="../img/setting-ico.png" alt="" /> Training Settings
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settings-content">
            <Row>
              <Col lg={3} sm={6}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
<<<<<<< HEAD
                  <Form.Control  
                    type="date" 
                    name="start_date"
                    onChange={setField}  
                    isInvalid={!!errors.start_date}
                    />
                    <Form.Control.Feedback type="invalid">
                          {errors.start_date}
                     </Form.Control.Feedback>
=======
                  <Form.Control
                    type="date"
                    name="start_date"
                    onChange={handleTrainingSettings}
                  />
>>>>>>> origin/master
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-sm-0">
                <Form.Group>
                  <Form.Label>Start Time</Form.Label>
<<<<<<< HEAD
                  <Form.Control 
                     type="time" 
                     name="start_time" 
                     onChange={setField}  
                     isInvalid={!!errors.start_time} 
                     />
                      <Form.Control.Feedback type="invalid">
                          {errors.start_time}
                     </Form.Control.Feedback>
=======
                  <Form.Control
                    type="time"
                    name="start_time"
                    onChange={handleTrainingSettings}
                  />
>>>>>>> origin/master
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
<<<<<<< HEAD
                    type="date" 
                    name="end_date" 
                    onChange={setField}  
                    />
=======
                    type="date"
                    name="end_date"
                    onChange={handleTrainingSettings}
                  />
>>>>>>> origin/master
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                <Form.Group>
                  <Form.Label>End Time</Form.Label>
<<<<<<< HEAD
                  <Form.Control 
                    type="time"
                    name="end_time"
                    onChange={setField}   
                    />
=======
                  <Form.Control
                    type="time"
                    name="end_time"
                    onChange={handleTrainingSettings}
                  />
>>>>>>> origin/master
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label>Applicable to all users</Form.Label>
                  <div className="new-form-radio">
                    <div className="new-form-radio-box">
                      <label htmlFor="yes1">
                        <input
                          type="radio"
                          value="Y"
                          name="roles"
                          id="yes1"
<<<<<<< HEAD
                          defaultChecked
                          onChange={setField}
=======
                          onChange={(event) => {
                            setTrainingData((prevState) => ({
                              ...prevState,
                              is_applicable_to_all: true,
                            }));
                            setHideSelect(true);
                          }}
>>>>>>> origin/master
                        />
                        <span className="radio-round"></span>
                        <p>Yes</p>
                      </label>
                    </div>
                    <div className="new-form-radio-box">
                      <label htmlFor="no1">
                        <input
                          type="radio"
                          value="N"
                          name="roles"
                          id="no1"
<<<<<<< HEAD
                          onChange={setField}
=======
                          onChange={(event) => {
                            setTrainingData((prevState) => ({
                              ...prevState,
                              is_applicable_to_all: false,
                            }));
                            setHideSelect(false);
                          }}
>>>>>>> origin/master
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
              
                </Form.Group>
              </Col>
<<<<<<< HEAD
             {form.roles === "Y" ? null : (
                <Col lg={9} md={6}  className="mt-3 mt-md-0">
                <Form.Group>
=======
              <Col lg={9} md={6} className="mt-3 mt-md-0">
                <Form.Group className={hideSelect ? 'd-none' : ''}>
>>>>>>> origin/master
                  <Form.Label>Select User Roles</Form.Label>
                  <Multiselect
                    placeholder="Select User Roles"
                    displayValue="key"
                    onChange={() => {console.log("Change")}}
                    className="multiselect-box default-arrow-select"
                    onKeyPressFn={function noRefCheck() {}}
                    onRemove={function noRefCheck(data) {
                      setRoles(data)
                    }}
                    onSearch={function noRefCheck() {}}
                    onSelect={function noRefCheck(data) {
<<<<<<< HEAD
                      setRoles(data)
                      console.log(roles)
                    }}
                    
                    options={[
                      {
                        value:"1",
                        name:"group1",
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
=======
                      setTrainingData((prevState) => ({
                        ...prevState,
                        roles: [...data.map((data) => data.cat)],
                      }));
                    }}
                    options={userRoles}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col lg={3} md={6}>
              </Col>
              <Col lg={9} md={6} className="mt-3 mt-md-0">
                <Form.Group className={hideSelect ? 'd-none' : ''}>
                  <Form.Label>Select User Names</Form.Label>
                  <Multiselect
                    placeholder={fetchedFranchiseeUsers ? "Select User Roles" : "No User Available"}
                    displayValue="key"
                    className="multiselect-box default-arrow-select"
                    onKeyPressFn={function noRefCheck() {}}
                    onRemove={function noRefCheck() {}}
                    onSearch={function noRefCheck() {}}
                    onSelect={function noRefCheck(data) {
                      setTrainingData((prevState) => ({
                        ...prevState,
                        users: [...data.map((data) => data.cat)],
                      }));
                    }}
                    options={fetchedFranchiseeUsers}
>>>>>>> origin/master
                  />
                 {roles ? null: <p>please choose roles</p>}
                  
                </Form.Group>
              </Col>
             )}
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="transparent" onClick={handleClose}>
            Cancel
          </Button>
<<<<<<< HEAD
          <Button variant="primary" onClick={handleClose}>
=======
          <Button variant="primary" onClick={handleSaveAndClose}>
>>>>>>> origin/master
            Save Settings
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddNewTraining;
