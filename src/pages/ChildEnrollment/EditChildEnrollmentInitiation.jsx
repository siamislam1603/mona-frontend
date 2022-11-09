import axios from "axios";
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import LeftNavbar from "../../components/LeftNavbar";
import TopHeader from "../../components/TopHeader";
import { useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import { BASE_URL } from "../../components/App";
import { enrollmentInitiationFormValidation } from '../../helpers/validation';

const EditChildEnrollmentInitiation = ({ nextStep, handleFormData }) => {
  let { childId: paramsChildId, parentId: paramsParentId } = useParams();

  const [formOneChildData, setFormOneChildData] = useState({
    fullname: "",
    family_name: "",
    dob: "",
    home_address: "",
    gender: "M",
    educator: [],
  });
  const [educatorData, setEducatorData] = useState(null);
  const [franchiseData, setFranchiseData] = useState(null);
  const [selectedFranchisee, setSelectedFranchisee] = useState();
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const [oldEducatorIDs, setOldEducatorIDs] = useState(null);

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

  const fetchEducatorList = async (franchise) => {
    console.log('FETCHING EDUCATORS:', franchise);
    const response = await axios.get(`${BASE_URL}/user-group/users/${franchise}`);
    if(response.status === 200 && response.data.status === "success") {
      let { users } = response.data;
      setEducatorData(users.map(user => ({
        id: user.id,
        value: user.fullname,
        label: `${user.fullname} (${user.email})`
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
    let response = await axios.get(`${BASE_URL}/auth/user/${paramsParentId}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if(response.status === 200 && response.data.status === "success") {
      let { user } = response.data;
      let { franchisee_id } = user;

      response = await axios.patch(`${BASE_URL}/enrollment/child/${paramsChildId}`, { ...formOneChildData, franchisee_id: franchisee_id  }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if(response.status === 201 && response.data.status === "success") {
        let removedEducators = oldEducatorIDs.filter(d => !formOneChildData.educator.includes(d));
        console.log('REMOVED EDUCATORS:', removedEducators);
        response = await axios.post(`${BASE_URL}/enrollment/child/assign-educators/${paramsChildId}`,{ educatorIds: formOneChildData?.educator, removedEducatorIds: removedEducators}, {
          headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.status === 201) {
            console.log('Updated Sucessfully!');
            window.location.href=`/children/${paramsParentId}`;
        }
      }
    }
  }

  const fetchAndPopulateChildData = async () => {
    let response = await axios.get(`${BASE_URL}/enrollment/child/${paramsChildId}?parentId=${paramsParentId}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    });

    console.log('FETCHED CHILD DATA:', response.data);
    if(response.status === 200 && (await response).data.status === "success") {
      let { child } = response.data;

      let { users, fullname, family_name, dob, home_address, sex, child_crn, name_of_school, school_status, start_date, has_special_needs, franchisee_id } = child;
      let educatorIds = users.map(d => d.id);

      console.log('USERS:', users);

      setFormOneChildData(prevState => ({
        ...prevState,
        fullname,
        family_name,
        dob,
        home_address,
        sex,
        child_crn,
        name_of_school,
        school_status,
        start_date,
        has_special_needs,
        franchisee_id,
        educator: [...educatorIds]
      }))

      setOldEducatorIDs([...educatorIds]);
    }
  }

  const submitFormData = (event) => {
    event.preventDefault();
    console.log('SUBMITTING FORM DATA');
    
    let errorObj = enrollmentInitiationFormValidation(formOneChildData);
    if (Object.keys(errorObj).length > 0) {
      setErrors(errorObj);
    } else {
      setLoader(true);
      initiateEnrollment();
    }
  }

  const initiateCancelEvent = () => {
    window.location.href=`/children/${paramsParentId}`;
  }

  useEffect(() => {
    console.log('FETCHING EDUCATOR LIST!');
    fetchEducatorList(formOneChildData?.franchisee_id);
  }, [formOneChildData?.franchisee_id])

  useEffect(() => {
    fetchAndPopulateChildData();
    fetchFranchiseList();
  }, []);
  

  oldEducatorIDs && console.log('EDUCATOR:', oldEducatorIDs);
  formOneChildData && console.log('FORM ONE CHILD DATA:', formOneChildData);
  errors && console.log('ERRORS:', errors);
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
                    <h1 className="title-lg">Child Enrolment Initiation Form</h1>
                  </header>
                  <div className="enrollment-form-sec error-sec my-5">
                    <Form onSubmit={submitFormData}>
                      <div className="enrollment-form-column">
                        <div className="grayback">
                          <h2 className="title-xs mb-2">Basic details about the child</h2>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3 relative">
                                <Form.Label>Child's First Name *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="fullname"
                                  disabled={localStorage.getItem('user_role') === "guardian"}
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
                                  maxLength={50}
                                  disabled={localStorage.getItem('user_role') === "guardian"}
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
                                  disabled={localStorage.getItem('user_role') === "guardian"}
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
                                  disabled={localStorage.getItem('user_role') === "guardian"}
                                  // max={new Date().toISOString().slice(0, 10)}
                                  // min={new Date().toISOString().slice(0, 10)}
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
                                    name="gender"
                                    id="malecheck"
                                    label="Male"
                                    disabled={localStorage.getItem('user_role') === "guardian"}
                                    checked={formOneChildData?.sex === "M"}
                                    defaultChecked
                                    onChange={(event) => setFormOneChildData(prevState => ({
                                      ...prevState,
                                      gender: "M"
                                    }))} />
                                  <Form.Check
                                    type="radio"
                                    name="gender"
                                    disabled={localStorage.getItem('user_role') === "guardian"}
                                    id="femalecheck"
                                    checked = {formOneChildData?.sex === "F"}
                                    label="Female"
                                    onChange={(event) => setFormOneChildData(prevState => ({
                                      ...prevState,
                                      gender: "F"
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
                                  style={{ resize: "none" }}
                                  disabled={localStorage.getItem('user_role') === "guardian"}
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
                            
                            <Col md={6}>
                              <Form.Group className="mb-3 relative">
                                <Form.Label>Select Franchise *</Form.Label>
                                <Select
                                  placeholder={"Select"}
                                  isDisabled={localStorage.getItem('user_role') !== 'franchisor_admin'}
                                  closeMenuOnSelect={true}
                                  value={franchiseData?.filter(d => parseInt(d.id) === parseInt(formOneChildData?.franchisee_id))}
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
                                {errors.educatorData !== null && <span className="error">{errors.educatorData}</span>}
                              </Form.Group>
                            </Col>
                            
                            <Col md={6}>
                              <Form.Group className="mb-3 relative">
                                <Form.Label>Select An Educator *</Form.Label>
                                <Select
                                  placeholder={"Select"}
                                  closeMenuOnSelect={true}
                                  isMulti
                                  isDisabled={localStorage.getItem('user_role') === 'guardian'}
                                  value={educatorData?.filter(d => formOneChildData?.educator.includes(d.id))}
                                  options={educatorData}
                                  onChange={(e) => {
                                    setFormOneChildData((prevState) => ({
                                      ...prevState,
                                      educator: [...e.map(e => e.id)]
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
                                    disabled={localStorage.getItem('user_role') === "guardian"}
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
                                    disabled={localStorage.getItem('user_role') === "guardian"}
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
                                    disabled={localStorage.getItem('user_role') === "guardian"}
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
                                    disabled={localStorage.getItem('user_role') === "guardian"}
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
                                    disabled={localStorage.getItem('user_role') === "guardian"}
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
                                  disabled={localStorage.getItem('user_role') === "guardian"}
                                  // ref={child_crn}
                                  value={formOneChildData.child_crn || ""}
                                  onChange={(e) => {
                                    handleChildData(e);
                                  }} />

                                  { errors?.child_crn !== null && <span className="error">{errors?.child_crn}</span> }
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>
                      </div>
                      <div className="cta text-center mt-5 mb-5">
                        <Button variant={localStorage.getItem('user_role') === "guardian" ? "primary" : "outline"} onClick={() => initiateCancelEvent()} className="me-3">{localStorage.getItem('user_role') === "guardian" ? "Back" : "Cancel"}</Button>
                        {localStorage.getItem('user_role') !== "guardian" && <Button variant="primary" type="submit">
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
                        </Button>}
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

export default EditChildEnrollmentInitiation;
