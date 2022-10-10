import axios from "axios";
import React, { useState, useRef } from "react";
import { Container } from "react-bootstrap";
import LeftNavbar from "../../components/LeftNavbar";
import TopHeader from "../../components/TopHeader";
import { useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import { BASE_URL } from "../../components/App";
import { enrollmentInitiationFormValidation } from '../../helpers/validation';
import { useNavigate } from 'react-router-dom';

const ChildEnrollmentInitiation = ({ nextStep, handleFormData }) => {
  let { parentId } = useParams();
  const navigate = useNavigate();


  // REFS
  let fullname = useRef(null);
  let family_name = useRef(null);
  let dob = useRef(null);
  let start_date = useRef(null);
  let home_address = useRef(null);
  let child_crn = useRef(null);
  let name_of_school = useRef(null);
  let educator = useRef(null);
  let franchise = useRef(null);
  
  const [selectedFranchisee, setSelectedFranchisee] = useState();
  const [formOneChildData, setFormOneChildData] = useState({
    fullname: "",
    family_name: "",
    dob: "",
    start_date: "",
    sex: "M",
    home_address: "",
    child_crn: "",
    school_status: "N",
    name_of_school: "",
    has_special_needs: 0,
    educator: [],
    franchisee_id: null 
  });
  const [educatorData, setEducatorData] = useState(null);
  const [franchiseData, setFranchiseData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchEducatorList = async (franchise) => {
    // console.log('FETCHING EDUCATOR LIST', franchise);
    const response = await axios.get(`${BASE_URL}/user-group/users/${franchise}`);
    // console.log('RESPONSE EDUCATOR DATA:', response);
    if(response.status === 200 && response.data.status === "success") {
      let { users } = response.data;
      // console.log('USERS:', users);
      setEducatorData(users?.map(user => ({
        id: user.id,
        value: user.fullname,
        label: user.fullname
      })));
    }
  };

  const handleChildData = (event) => {
    event.preventDefault();
    let { name, value } = event.target;
    setFormOneChildData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const initiateEnrollment = async () => {
    let token = localStorage.getItem('token');
    let response = await axios.get(`${BASE_URL}/auth/user/${parentId}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if(response.status === 200 && response.data.status === "success") {
      let { user } = response.data;
      let { franchisee_id } = user;

      response = await axios.post(`${BASE_URL}/enrollment/child`, { ...formOneChildData }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      if(response.status === 201 && response.data.status === "success") {
        let { child } = response.data;
        // SAVING PARENT DETAIL
        response = await axios.post(`${BASE_URL}/enrollment/parent/`, {user_parent_id: parentId, childId: child.id}, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
  
        if(response.status === 201 && response.data.status === "success") {
          response = await axios.post(`${BASE_URL}/enrollment/child/assign-educators/${child.id}`, { educatorIds: formOneChildData.educator }, {
            headers: {
              "Authorization": `Bearer ${token}`
            }     
          }); 
          if(response.status === 201 && response.data.status === "success") {
            response = await axios.patch(`${BASE_URL}/auth/user/update/${parentId}`);
  
            if(response.status === 201 && response.data.status === "success") {
              setLoader(false);
              // window.location.href = `/children/${parentId}`;
              navigate(`/children/${parentId}`, { state: { franchisee_id: formOneChildData.franchisee_id } })
            }
          }
        }
      }
    }
  }

  const setAutoFocus = (errObj) => {
    let errArray = Object.keys(errObj);

    if(errArray.includes('fullname')) {
      fullname?.current?.focus();
    } else if(errArray?.includes('family_name')) {
      family_name?.current?.focus();
    } else if(errArray?.includes('dob')) {
      dob?.current?.focus();
    } else if(errArray?.includes('start_date')) {
      start_date?.current?.focus();
    } else if(errArray?.includes('home_address')) {
      home_address?.current?.focus();
    } else if(errArray?.includes('franchiseData')) {
      franchise?.current?.focus();
    } else if(errArray?.includes('educatorData')) {
      educator?.current?.focus();
    } else if(errArray?.includes('child_crn')) {
      child_crn?.current?.focus();
    } else if(errArray?.includes('name_of_school')) {
      name_of_school?.current?.focus();
    } 
  }

  const fetchFranchiseList = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/role/franchisee`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if(response.status === 200 && response.data.status === "success") {
      let { franchiseeList } = response.data;
      setFranchiseData(franchiseeList.map(franchisee => ({
        id: franchisee.id,
        value: franchisee.franchisee_name,
        label: franchisee.franchisee_name
      })));  
    }
  }

  const submitFormData = (event) => {
    event.preventDefault();
    console.log('SUBMITTING FORM DATA');
    
    let errorObj = enrollmentInitiationFormValidation(formOneChildData);
    if (Object.keys(errorObj).length > 0) {
      setErrors(errorObj);
      setAutoFocus(errorObj)
    } else {
      setLoader(true);
      initiateEnrollment();
    }
  }

  const initiateCancelEvent = () => {
    window.location.href=`/children/${parentId}`;
  }

  useEffect(() => {
    console.log('FETCHING EDUCATOR LIST!');
    fetchEducatorList(formOneChildData?.franchisee_id);
  }, [formOneChildData?.franchisee_id])

  useEffect(() => {
    fetchFranchiseList();
  }, [])

  useEffect(() => {
    if(localStorage.getItem('user_role') !== 'franchisor_admin') {
      setFormOneChildData(prevState => ({
        ...prevState,
        franchisee_id: selectedFranchisee
      }));
    }
  }, [selectedFranchisee]);
  
  formOneChildData && console.log('CHILD DATA:', formOneChildData);
  errors && console.log('Errors:', errors);
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
                <TopHeader 
                  setSelectedFranchisee={setSelectedFranchisee}/>
                <div className="entry-container">
                  <header className="title-head">
                    <h1 className="title-lg">Child Enrolment Form</h1>
                  </header>
                  <div className="enrollment-form-sec error-sec my-5">
                    <Form onSubmit={submitFormData}>
                      <div className="enrollment-form-column">
                        <div className="grayback">
                          <h2 className="title-xs mb-2">Basic details about the child</h2>
                          {/* <p className="form_info mb-4">A parent or guardian who has lawful authority in relation to the child must complete this form. Licensed children’s services may use this form to collect the child’s enrolment information as required in the Children’s Service’s Regulations 2017 and education and care services national law act 2010. Based on these regulations, parents are not required to fill questions marked with an asterisk, however, it will be highly important for the service to have those details.</p> */}
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3 relative">

                                <Form.Label>Child's First Name *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="fullname"
                                  ref={fullname}
                                  value={formOneChildData?.fullname || ""}
                                  onChange={(e) => {
                                    handleChildData(e);
                                    setErrors(prevState => ({
                                      ...prevState,
                                      fullname: null
                                    }))
                                  }} />
                                  {errors.fullname !== null && <span className="error">{errors.fullname}</span>}
                              </Form.Group>
                            </Col>
                            
                            <Col md={6}>
                              <Form.Group className="mb-3 relative">
                                <Form.Label>Child's Family Name *</Form.Label>
                                <Form.Control
                                  type="text"
                                  minLenth={3}
                                  ref={family_name}
                                  maxLength={50}
                                  name="family_name"
                                  value={formOneChildData?.family_name || ""}
                                  onChange={(e) => {
                                    // if(isNaN(e.target.value.charAt(e.target.value.length - 1)) === true) {
                                    setFormOneChildData(prevState => ({
                                      ...prevState,
                                      family_name: e.target.value
                                    }));
                                    setErrors(prevState => ({
                                      ...prevState,
                                      family_name: null,
                                    }))
                                  }} />
                                { errors?.family_name !== null && <span className="error">{errors?.family_name}</span> }
                              </Form.Group>
                            </Col>

                            <Col md={6}>
                              <Form.Group className="mb-3 relative">
                                <Form.Label>Date Of Birth *</Form.Label>
                                <Form.Control
                                  type="date"
                                  name="dob"
                                  ref={dob}
                                  max={new Date().toISOString().slice(0, 10)}
                                  value={formOneChildData?.dob || ""}
                                  onChange={(e) => {
                                    handleChildData(e);
                                    setErrors(prevState => ({
                                      ...prevState,
                                      dob: null
                                    }))
                                  }} />
                                  {errors.dob !== null && <span className="error">{errors.dob}</span>}
                              </Form.Group>
                            </Col>

                            <Col md={6}>
                              <Form.Group className="mb-3 relative">
                                <Form.Label>Start Date *</Form.Label>
                                <Form.Control
                                  type="date"
                                  name="start_date"
                                  ref={start_date}
                                  // max={new Date().toISOString().slice(0, 10)}
                                  value={formOneChildData?.start_date || ""}
                                  onChange={(e) => {
                                    handleChildData(e);
                                    setErrors(prevState => ({
                                      ...prevState,
                                      start_date: null
                                    }))
                                  }} />
                                  {errors.start_date !== null && <span className="error">{errors.start_date}</span>}
                              </Form.Group>
                            </Col>

                            <Col md={12}>
                              <Form.Group className="mb-3 relative">
                                <div className="btn-radio inline-col">
                                  <Form.Label>Sex *</Form.Label>
                                  <Form.Check
                                    type="radio"
                                    name="sex"
                                    id="malecheck"
                                    label="Male"
                                    checked={formOneChildData?.sex === "M"}
                                    defaultChecked
                                    onChange={(event) => setFormOneChildData(prevState => ({
                                      ...prevState,
                                      sex: "M"
                                    }))} />
                                  <Form.Check
                                    type="radio"
                                    name="sex"
                                    id="femalecheck"
                                    checked = {formOneChildData?.sex === "F"}
                                    label="Female"
                                    onChange={(event) => setFormOneChildData(prevState => ({
                                      ...prevState,
                                      sex: "F"
                                    }))} />
                                </div>
                              </Form.Group>
                            </Col>
                            <Col md={12}>
                              <Form.Group className="mb-3 relative">
                                <Form.Label>Home Address *</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={3}
                                  ref={home_address}
                                  value={formOneChildData?.home_address || ""}
                                  onChange={(e) => {
                                    setFormOneChildData(prevState => ({
                                      ...prevState,
                                      home_address: e.target.value
                                    }));
                                    setErrors(prevState => ({
                                      ...prevState,
                                      home_address: null
                                    }))
                                  }} />
                                  {errors.home_address !== null && <span className="error">{errors.home_address}</span>}
                              </Form.Group>
                            </Col>
                            
                            {
                              localStorage.getItem('user_role') === 'franchisor_admin' ?
                              <Col md={6}>
                                <Form.Group className="mb-3 relative">
                                  <Form.Label>Select Franchise *</Form.Label>
                                  <Select
                                    placeholder={"Select"}
                                    closeMenuOnSelect={true}
                                    ref={franchise}
                                    options={franchiseData}
                                    onChange={(e) => {
                                      setFormOneChildData((prevState) => ({
                                        ...prevState,
                                        franchisee_id: e.id
                                      }));

                                      setErrors(prevState => ({
                                        ...prevState,
                                        franchiseData: null
                                      }))
                                    }}
                                  />
                                  {errors.franchiseData !== null && <span className="error">{errors.franchiseData}</span>}
                                </Form.Group>
                              </Col> :
                              <Col md={6}>
                                <Form.Group className="mb-3 relative">
                                  <Form.Label>Select Franchise *</Form.Label>
                                  <Select
                                    placeholder={franchiseData?.filter(d => parseInt(d.id) === parseInt(selectedFranchisee))[0]?.label}
                                    closeMenuOnSelect={true}
                                    isDisabled={true}
                                    ref={franchise}
                                    options={franchiseData}
                                  />
                                  {errors.franchiseData !== null && <span className="error">{errors.franchiseData}</span>}
                                </Form.Group>
                              </Col>
                            }

                            <Col md={6}>
                              <Form.Group className="mb-3 relative">
                                <Form.Label>Select An Educator *</Form.Label>
                                <Select
                                  placeholder={formOneChildData?.language || "Select"}
                                  closeMenuOnSelect={true}
                                  isMulti
                                  ref={educator}
                                  options={educatorData}
                                  onChange={(e) => {
                                    setFormOneChildData((prevState) => ({
                                      ...prevState,
                                      educator: [...e?.map(e => e.id)]
                                    }));

                                    setErrors(prevState => ({
                                      ...prevState,
                                      educatorData: null
                                    }))
                                  }}
                                />
                                {errors.educatorData !== null && <span className="error">{errors.educatorData}</span>}
                              </Form.Group>
                            </Col>

                            <Col md={6}>
                              <Form.Group className="mb-3 relative">
                                <div className="btn-radio inline-col">
                                  <Form.Label>Does your child have special needs? *</Form.Label>
                                  <Form.Check
                                    type="radio"
                                    name="has_special_needs"
                                    id="specialneedsyes"
                                    label="Yes"
                                    checked={formOneChildData?.has_special_needs === 1}
                                    defaultChecked
                                    onChange={(event) => setFormOneChildData(prevState => ({
                                      ...prevState,
                                      has_special_needs: 1
                                    }))} />
                                  <Form.Check
                                    type="radio"
                                    name="has_special_needs"
                                    id="specialneedsno"
                                    checked = {formOneChildData?.has_special_needs === 0}
                                    label="No"
                                    onChange={(event) => setFormOneChildData(prevState => ({
                                      ...prevState,
                                      has_special_needs: 0
                                    }))} />
                                </div>
                              </Form.Group>
                            </Col>

                            <Col md={6}>
                              <Form.Group className="mb-3 relative">
                                <div className="btn-radio inline-col">
                                  <Form.Label>School Status *</Form.Label>
                                  <Form.Check
                                    type="radio"
                                    name="school_status"
                                    id="statuscheckyes"
                                    label="Yes"
                                    checked={formOneChildData?.school_status === "Y"}
                                    defaultChecked
                                    onChange={(event) => setFormOneChildData(prevState => ({
                                      ...prevState,
                                      school_status: "Y"
                                    }))} />
                                  <Form.Check
                                    type="radio"
                                    name="school_status"
                                    id="statuscheckno"
                                    checked = {formOneChildData?.school_status === "N"}
                                    label="No"
                                    onChange={(event) => setFormOneChildData(prevState => ({
                                      ...prevState,
                                      school_status: "N"
                                    }))} />
                                </div>
                              </Form.Group>
                            </Col>

                            { 
                              formOneChildData?.school_status === "Y" &&
                              <Col md={6}>
                                <Form.Group className="mb-3 relative">
                                  <Form.Label>School Name *</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="name_of_school"
                                    ref={name_of_school}
                                    value={formOneChildData?.name_of_school || ""}
                                    onChange={(e) => {
                                      handleChildData(e);
                                      setErrors(prevState => ({
                                        ...prevState,
                                        name_of_school: null
                                      }))
                                    }} />
                                    {errors.name_of_school !== null && <span className="error">{errors.name_of_school}</span>}
                                </Form.Group>
                              </Col>
                            }

                            <Col md={6}>
                              <Form.Group className="mb-3 relative">
                                <Form.Label>Child CRN *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="child_crn"
                                  ref={child_crn}
                                  // ref={child_crn}
                                  value={formOneChildData.child_crn || ""}
                                  onChange={(e) => {
                                    handleChildData(e);
                                    setErrors(prevState => ({
                                      ...prevState,
                                      child_crn: null
                                    }))
                                  }} />

                                  { errors?.child_crn !== null && <span className="error">{errors?.child_crn}</span> }
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>
                      </div>
                      <div className="cta text-center mt-5 mb-5">
                        <Button variant="outline" onClick={() => initiateCancelEvent()} className="me-3">Cancel</Button>
                        <Button variant="primary" type="submit">
                          {loader === true ? (
                            <>
                              <img
                              style={{ width: '24px' }}
                              src={'/img/mini_loader1.gif'}
                              alt=""
                              />
                                Submitting...
                            </>
                          ) : (
                          'Submit')}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default ChildEnrollmentInitiation;
