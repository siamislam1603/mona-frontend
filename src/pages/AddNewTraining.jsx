import React, { useState } from "react";
import { Button, Col, Container, Row, Form, Modal } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link } from 'react-router-dom';
import axios from "axios";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Multiselect from "multiselect-react-dropdown";
import DropAllFile from "../components/DragDrop";

const animatedComponents = makeAnimated();

const training = [
  {
    value: "by-companies",
    label: "By Companies",
  },
  {
    value: "by-round",
    label: "By Round",
  },
];

const timereq = [
  {
    value: "3",
    label: "3",
  },
  {
    value: "5",
    label: "5",
  },
];
const AddNewTraining = () => {

const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);
const [multiFiles, setMultiFiles] = useState();

const [form, setForm] = useState({roles:"Y"});
const [errors, setErrors] = useState({});

const [count, setCount] = useState({});
const [therror, settheerror] = useState();
const [roles,setRoles] = useState();
const [file1error,setFile1error] = useState();
const [file2error,setFile2error] = useState();
const [file3error,setFil32error] = useState();






// count [settingErrors,setSettingErrors] = useState();


const setField = e => {
  console.log("e.traget",e.target)
  const { name: field, value } = e.target;
  console.log("The value",value,field)
  setForm({ ...form, [field]: value });

  console.log("form ---->", form);
  if (!!errors[field]) {
    setErrors({
      ...errors,
      [field]: null,
    });
  }
};
const handleTime = e =>{
  // console.log("EVENT",e)
  const {value} = e 
  setForm(prevState => ({
    ...prevState,
    time_required:value
  }))
}
const checkValidation =() =>{
  let newErrors = {};
  let{training_name,training_description,select_hour,drop,start_date, start_time,roles} = form;
  // console.log("THe drop",drop)
  if(!training_name){
    newErrors.training_name="Training Name required"
  }
  if(!training_description) {
    newErrors.training_description = "Training descritpion required"
  }
  // if(!select_hour){
  //   newErrors.select_hour = "Hour Required"
  // }
  if(!start_date){
      newErrors.start_date = "Start date is required"
      settheerror("Setting required")
  }
  if(!start_time) {
     newErrors.start_time = "Start time is required"
     settheerror("Setting required")
  }
  if(!roles){
      console.log("Roles is empyt")
  }
  if(count.file1 ){
    if(count.file1.length>1){
      
    }

  }
  if(!count.file1){
    console.log("Count.file1 is empty",count.file1)
    setFile1error("Please upload cover image")
  }
  if(!count.file2) {
    setFile2error("Please upload video tutorial")
  }
  if(!count.file3) {
    setFil32error("Please upload ")
  }

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
                <LeftNavbar/>
              </aside>
              <div className="sec-column">
                <TopHeader/>
                <div className="entry-container">
                  <header className="title-head">
                    <h1 className="title-lg">Add New Training 
                      <span className="setting-ico" onClick={handleShow}> <img src="../img/setting-ico.png" alt=""/></span>
                      <p>{therror}</p>
                    </h1>
                  </header>
            
                  
                  <div className="training-form">
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Training Name</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="training_name" 
                            onChange={setField}
                            isInvalid={!!errors.training_name}
                            />
                          <Form.Control.Feedback type="invalid">
                            {errors.training_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Training Category</Form.Label>
                          <Select
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              isMulti
                              options={training}
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
                            onChange={setField}
                            isInvalid={!!errors.training_description}
                            />
                          <Form.Control.Feedback type="invalid">
                            {errors.training_description}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group className="relative">
                          <Form.Label>Time required to complete</Form.Label>
                          <Select
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              options={timereq}
                              onChange={handleTime}
                              name="select_hour"
                              isInvalid={!!errors.select_hour}
                            />
                            <span className="rtag">hours</span>
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
                          
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Related Files :</Form.Label>
                          <DropAllFile
                            count={count}
                            num="2"
                            setCount={(acceptedFiles) => setCount(prevState => ({
                              ...prevState,
                              file3: acceptedFiles
                            }))} />
                            {count.file3 ? null : <p>{file3error}</p>}

                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <div className="cta text-center mt-5 mb-5">
                          <Button variant="outline" className="me-3" type="submit">Preview</Button>
                          <Button variant="primary" type="submit" onClick={onSubmit}>Save</Button>
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
          <Modal.Title><img src="../img/setting-ico.png" alt=""/> Training Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settings-content">
            <Row>
              <Col lg={3} sm={6}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control  
                    type="date" 
                    name="start_date"
                    onChange={setField}  
                    isInvalid={!!errors.start_date}
                    />
                    <Form.Control.Feedback type="invalid">
                          {errors.start_date}
                     </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-sm-0">
                <Form.Group>
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control 
                     type="time" 
                     name="start_time" 
                     onChange={setField}  
                     isInvalid={!!errors.start_time} 
                     />
                      <Form.Control.Feedback type="invalid">
                          {errors.start_time}
                     </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date" 
                    name="end_date" 
                    onChange={setField}  
                    />
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                <Form.Group>
                  <Form.Label>End Time</Form.Label>
                  <Form.Control 
                    type="time"
                    name="end_time"
                    onChange={setField}   
                    />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label>Applicable to all users</Form.Label>
                  <div className="new-form-radio">
                    <div className="new-form-radio-box">
                      <label for="yes1">
                        <input
                          type="radio"
                          value="Y"
                          name="roles"
                          id="yes1"
                          defaultChecked
                          onChange={setField}
                        />
                        <span className="radio-round"></span>
                        <p>Yes</p>
                      </label>
                    </div>
                    <div className="new-form-radio-box">
                      <label for="no1">
                        <input
                          type="radio"
                          value="N"
                          name="roles"
                          id="no1"
                          onChange={setField}
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
              
                </Form.Group>
              </Col>
             {form.roles === "Y" ? null : (
                <Col lg={9} md={6}  className="mt-3 mt-md-0">
                <Form.Group>
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
          <Button variant="primary" onClick={handleClose}>
            Save Settings
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddNewTraining;
