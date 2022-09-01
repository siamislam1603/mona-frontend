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

const ChildEnrollmentInitiation = ({ nextStep, handleFormData }) => {
  let { parentId } = useParams();

  const [formOneChildData, setFormOneChildData] = useState({
    fullname: "",
    dob: "",
    home_address: "",
    gender: "M",
    educator: []
  });
  const [educatorData, setEducatorData] = useState(null);
  const [selectedFranchisee, setSelectedFranchisee] = useState();
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchEducatorList = async () => {
    const response = await axios.get(`${BASE_URL}/user-group/users/${typeof selectedFranchisee === 'undefined' ? 'all' : selectedFranchisee}`);
    console.log('RESPONSE EDUCATOR DATA:', response);
    if(response.status === 200 && response.data.status === "success") {
      let { users } = response.data;
      setEducatorData(users.map(user => ({
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
    let response = await axios.post(`${BASE_URL}/enrollment/child`, { ...formOneChildData, franchisee_id: localStorage.getItem('franchisee_id') }, {
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
          setLoader(false);
          window.location.href = `/children/${parentId}`;
        }
      }
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

  useEffect(() => {
    console.log('FETCHING EDUCATOR LIST!');
    fetchEducatorList();
  }, [selectedFranchisee])
  
  formOneChildData && console.log('CHILD DATA:', formOneChildData);
  educatorData && console.log('EDUCATOR DATA:', educatorData);
  selectedFranchisee && console.log('SELECTED FRANCHISEE:', selectedFranchisee);
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
                          <p className="form_info mb-4">A parent or guardian who has lawful authority in relation to the child must complete this form. Licensed children’s services may use this form to collect the child’s enrolment information as required in the Children’s Service’s Regulations 2017 and education and care services national law act 2010. Based on these regulations, parents are not required to fill questions marked with an asterisk, however, it will be highly important for the service to have those details.</p>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3 relative">
                                <Form.Label>Child's First Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="fullname"
                                  placeholder="Child’s Full Name"
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
                                <Form.Label>Date Of Birth</Form.Label>
                                <Form.Control
                                  type="date"
                                  placeholder=""
                                  name="dob"
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
                            <Col md={12}>
                              <Form.Group className="mb-3 relative">
                                <div className="btn-radio inline-col">
                                  <Form.Label>Sex</Form.Label>
                                  <Form.Check
                                    type="radio"
                                    name="gender"
                                    id="malecheck"
                                    label="Male"
                                    checked={formOneChildData?.gender === "M"}
                                    defaultChecked
                                    onChange={(event) => setFormOneChildData(prevState => ({
                                      ...prevState,
                                      gender: "M"
                                    }))} />
                                  <Form.Check
                                    type="radio"
                                    name="gender"
                                    id="femalecheck"
                                    checked = {formOneChildData?.gender === "F"}
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
                                <Form.Label>Home Address</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={3}
                                  placeholder="Home Address"
                                  name="home_address"
                                  value={formOneChildData?.home_address || ""}
                                  onChange={(e) => {
                                    handleChildData(e);
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
                                <Form.Label>Select an Educator:</Form.Label>
                                <Select
                                  placeholder={formOneChildData?.language || "Select"}
                                  closeMenuOnSelect={true}
                                  isMulti
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
                          </Row>
                        </div>
                      </div>
                      <div className="cta text-center mt-5 mb-5">
                        <Button variant="primary" disabled={loader ? true : false} type="submit">
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
