import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Col, Row, Form, Modal } from "react-bootstrap";
import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
import { BASE_URL } from "../../components/App";
import { childFormValidator, parentFormValidator  } from "../../helpers/enrollmentValidation";

let step = 1;

const ChildEnrollment1 = ({ nextStep, handleFormData }) => {
  // STATE TO HANDLE CHILD DATA
  const [formOneChildData, setFormOneChildData] = useState({
    fullname: "",
    family_name: "",
    usually_called: "",
    dob: "",
    home_address: "",
    language: "",
    country_of_birth: "",
    gender: "M",
    child_origin: "NATSI",
    development_delay: false,
    another_service: false,
    school_status: "no-school"
  });

  // STATE TO HANDLE PARENT DATA
  const [formOneParentData, setFormOneParentData] = useState({
    relation_type: "parent",
    family_name: "",
    given_name: "",
    dob: "",
    address_as_per_child: "",
    telephone: "",
    email: "",
    place_of_birth: "",
    ethnicity: "",
    primary_language: "",
    occupation: "",
    child_live_with_this_parent: false
  });
  const [occupationData, setOccupationData] = useState(null);
  const [ethnicityData, setEthnicityData] = useState(null);
  const [languageData, setLanguageData] = useState(null);
  const [countryData, setCountryData] = useState(null);

  // ERROR HANDLING STATE
  const [childFormErrors, setChildFormErrors] = useState(null);
  const [parentFormErrors, setParentFormErrors] = useState(null);

  // MODAL DIALOG STATES
  const [showSubmissionSuccessModal, setShowSubmissionSuccessModal] = useState(false);


  const saveFormOneData = async (childData, parentData) => {
    console.log('PARENT DATA:', parentData);
    let token = localStorage.getItem('token');
    let response = await axios.post(`${BASE_URL}/enrollment/child`, { ...childData, step }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    console.log('CHILD RESPONSE:', response);
    if(response.status === 201 && response.data.status === "success") {
      const { id: childId } = response.data.child;
      // console.log('Child Id:', childId);
      // CREATING PARENT AND ASSOCIATING HIM WITH THE CHILD
      response = await axios.post(`${BASE_URL}/enrollment/parent/`, {...parentData, childId}, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      console.log('PARENT RESPONSE:', response);
      if(response.status === 201 && response.data.status === "success") {
        nextStep();
      }
    }
  };

  const handleChildData = event => {
    const { name, value } = event.target;
    setFormOneChildData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleParentData = event => {
    const { name, value } = event.target;
    setFormOneParentData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const submitFormData = (e) => {
    e.preventDefault();
    nextStep();
    // let errorChild = childFormValidator(formOneChildData);
    // let errorParent = parentFormValidator(formOneParentData);

    // if(Object.keys(errorChild).length > 0 || Object.keys(errorParent).length > 0) {
    //   setChildFormErrors(errorChild);
    //   setParentFormErrors(errorParent);
    // } else {
    //   saveFormOneData(formOneChildData, formOneParentData);
    //   // nextStep();
    // }
  };

  // FETCHING THE REQUIRED DATA FROM APIs HERE
  const fetchOccupationData = async () => {
    let response = await axios.get(`${BASE_URL}/api/occupation`);

    if(response.status === 200 && response.data.status === "success") {
      setOccupationData(response.data.occupationData.map(data => ({
        id: data.id,
        value: data.name,
        label: data.name.charAt(0).toUpperCase() + data.name.slice(1)
      })));
    }
  };

  const fetchEthnicityData = async () => {
    let response = await axios.get(`${BASE_URL}/api/ethnicity`);

    if(response.status === 200 && response.data.status === "success") {
      setEthnicityData(response.data.ethnicityData.map(data => ({
        id: data.id,
        value: data.name,
        label: data.name.charAt(0).toUpperCase() + data.name.slice(1)
      })));
    }
  };

  const fetchLanguageData = async () => {
    let response = await axios.get(`${BASE_URL}/api/languages`);

    if(response.status === 200 && response.data.status === "success") {
      setLanguageData(response.data.languageList.map(data => ({
        id: data.id,
        value: data.name,
        label: data.name.charAt(0).toUpperCase() + data.name.slice(1)
      })));
    }
  };

  const fetchCountryData = async () => {
    let response = await axios.get(`${BASE_URL}/api/country-data`);

    if(response.status === 200 && response.data.status === "success") {
      setCountryData(response.data.countryDataList.map(data => ({
        id: data.id,
        value: data.name,
        label: data.name
      })));
    }
  };

  useEffect(() => {
    fetchOccupationData();
    fetchEthnicityData();
    fetchLanguageData();
    fetchCountryData();
  }, []);

  return (
    <>
      <div className="enrollment-form-sec my-5">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <div className="grayback">
              <h2 className="title-xs mb-2">Information about the child</h2>
              <p className="form_info mb-4">A parent or guardian who has lawful authority in relation to the child must complete this form. Licensed children’s services may use this form to collect the child’s enrolment information as required in the Children’s Service’s Regulations 2017 and education and care services national law act 2010. Based on these regulations, parents are not required to fill questions marked with an asterisk, however, it will be highly important for the service to have those details.</p>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Child’s Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullname"
                      placeholder="Child’s Full Name"
                      value={formOneChildData.fullname || ""}
                      onChange={(e) => {
                        handleChildData(e);
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          fullname: null
                        }))
                      }} />
                    { childFormErrors?.fullname !== null && <span className="error">{childFormErrors?.fullname}</span> }
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Family Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Family Name"
                      name="family_name"
                      value={formOneChildData.family_name || ""}
                      onChange={(e) => {
                        handleChildData(e);
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          family_name: null
                        }))
                      }} />
                    { childFormErrors?.family_name !== null && <span className="error">{childFormErrors?.family_name}</span> }
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>*Usually Called</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Usually Called"
                      name="usually_called"
                      value={formOneChildData.usually_called || ""}
                      onChange={(e) => {
                        handleChildData(e);
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          usually_called: null
                        }))
                      }} />
                    { childFormErrors?.usually_called !== null && <span className="error">{childFormErrors?.usually_called}</span> }
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date Of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder=""
                      name="dob"
                      value={formOneChildData.dob || ""}
                      onChange={(e) => {
                        handleChildData(e);
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          dob: null
                        }))
                      }} />
                    { childFormErrors?.dob !== null && <span className="error">{childFormErrors?.dob}</span> }
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <div className="btn-radio inline-col">
                      <Form.Label>Sex</Form.Label>
                      <Form.Check
                        type="radio"
                        name="gender"
                        id="malecheck"
                        label="Male"
                        defaultChecked
                        onChange={(event) => setFormOneChildData(prevState => ({
                          ...prevState,
                          gender: "M"
                        }))} />
                      <Form.Check
                        type="radio"
                        name="gender"
                        id="femalecheck"
                        label="Female"
                        onChange={(event) => setFormOneChildData(prevState => ({
                          ...prevState,
                          gender: "F"
                        }))} />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Home Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Some text here for the label"
                      name="home_address"
                      value={formOneChildData.home_address || ""}
                      onChange={(e) => {
                        handleChildData(e);
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          home_address: null
                        }))
                      }} />
                    { childFormErrors?.home_address !== null && <span className="error">{childFormErrors?.home_address}</span> }
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Language spoken in the home</Form.Label>
                    <Select
                      placeholder="Select"
                      closeMenuOnSelect={true}
                      options={languageData}
                      onChange={(e) => {
                        setFormOneChildData((prevState) => ({
                          ...prevState,
                          language: e.value,
                        }));
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          language: null
                        }));
                      }}
                    />
                    { childFormErrors?.language !== null && <span className="error">{childFormErrors?.language}</span> }
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Country Of Birth</Form.Label>
                    <Select
                      placeholder="Select"
                      closeMenuOnSelect={true}
                      options={countryData}
                      onChange={(e) => {
                        setFormOneChildData((prevState) => ({
                          ...prevState,
                          country_of_birth: e.value,
                        }));
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          country_of_birth: null
                        }));
                      }}
                    />
                    { childFormErrors?.country_of_birth !== null && <span className="error">{childFormErrors?.country_of_birth}</span> }
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>*Is the child of Aboriginal and/or Torres Strait Islander origin?</Form.Label>
                    <div className="btn-radio two-col">
                      <Form.Check
                        type="radio"
                        name="aboriginaltorres"
                        id="noaboriginaltorres"
                        defaultChecked
                        label="No, not Aboriginal or Torres Straight Islander"
                        onChange={(event) => setFormOneChildData(prevState => ({
                          ...prevState,
                          child_origin: "NATSI"
                        }))} />

                      <Form.Check
                        type="radio"
                        name="aboriginaltorres"
                        id="yesaboriginal"
                        label="Yes, Aboriginal"
                        onChange={(event) => setFormOneChildData(prevState => ({
                          ...prevState,
                          child_origin: "A"
                        }))} />
                      <Form.Check
                        type="radio"
                        name="aboriginaltorres"
                        id="yesaboriginaltorres"
                        label="Yes, Aboriginal and Torres Straight Islander"
                        onChange={(event) => setFormOneChildData(prevState => ({
                          ...prevState,
                          child_origin: "YATSI"
                        }))} />
                      <Form.Check
                        type="radio"
                        name="aboriginaltorres"
                        id="yestorres"
                        label="Yes, Torres Straight Islander"
                        onChange={(event) => setFormOneChildData(prevState => ({
                          ...prevState,
                          child_origin: "TSI"
                        }))} />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>*Does the child have a developmental delay or disability including intellectual, sensory or physical impairment?</Form.Label>
                    <div className="btn-radio inline-col">
                      <Form.Check
                        type="radio"
                        name="disability"
                        id="yesc"
                        className="ps-0"
                        label="Yes"
                        onChange={(event) => setFormOneChildData(prevState => ({
                          ...prevState,
                          development_delay: true
                        }))} />
                      <Form.Check
                        type="radio"
                        name="disability"
                        id="noc"
                        label="No"
                        defaultChecked
                        onChange={(event) => setFormOneChildData(prevState => ({
                          ...prevState,
                          development_delay: false,
                          child_medicare_no: null,
                          child_crn: null,
                          parent_crn_1: null,
                          parent_crn_2: null
                        }))} />
                    </div>
                    <Form.Text className="text-muted">
                      if ‘Yes’ please provide information (Inclusion Support Form if applicable)
                    </Form.Text>
                  </Form.Group>
                </Col>
                {
                  formOneChildData.development_delay &&
                  <>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Child Medical No.</Form.Label>
                        <Form.Control
                          type="text"
                          name="child_medicare_no"
                          value={formOneChildData.child_medicare_no || ""}
                          onChange={handleChildData} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Child CRN</Form.Label>
                        <Form.Control
                          type="text"
                          name="child_crn"
                          value={formOneChildData.child_crn || ""}
                          onChange={handleChildData} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Parents CRN 1</Form.Label>
                        <Form.Control
                          type="text"
                          name="parent_crn_1"
                          value={formOneChildData.parent_crn_1 || ""}
                          onChange={handleChildData} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Parents CRN 2</Form.Label>
                        <Form.Control
                          type="text"
                          name="parent_crn_2"
                          value={formOneChildData.parent_crn_2 || ""}
                          onChange={handleChildData} />
                      </Form.Group>
                    </Col>
                  </>
                }
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Is the child using another service?</Form.Label>
                    <div className="btn-radio inline-col">
                      <Form.Check
                        type="radio"
                        name="anotherser"
                        id="yess"
                        className="ps-0"
                        label="Yes"
                        onChange={(event) => setFormOneChildData(prevState => ({
                          ...prevState,
                          another_service: true
                        }))} />
                      <Form.Check
                        type="radio"
                        name="anotherser"
                        id="nos"
                        defaultChecked
                        label="No"
                        onChange={(event) => setFormOneChildData(prevState => ({
                          ...prevState,
                          another_service: false
                        }))} />
                    </div>
                    <Form.Text className="text-muted">
                      If you answered YES please specify day and hours at other service.
                    </Form.Text>
                  </Form.Group>
                </Col>
                {
                  formOneChildData.another_service &&
                  <>
                    <Col xl={3} lg={4} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Monday</Form.Label>
                        <Form.Control type="number" />
                      </Form.Group>
                    </Col>
                    <Col xl={3} lg={4} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tuesday</Form.Label>
                        <Form.Control type="number" />
                      </Form.Group>
                    </Col>
                    <Col xl={3} lg={4} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Wednesday</Form.Label>
                        <Form.Control type="number" />
                      </Form.Group>
                    </Col>
                    <Col xl={3} lg={4} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Thrusday</Form.Label>
                        <Form.Control type="number" />
                      </Form.Group>
                    </Col>
                    <Col xl={3} lg={4} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Friday</Form.Label>
                        <Form.Control type="number" />
                      </Form.Group>
                    </Col>
                  </>
                }
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <div className="btn-radio inline-col">
                      <Form.Label>School Status :</Form.Label>
                      <Form.Check
                        type="radio"
                        name="school"
                        id="atschool"
                        label="At School"
                        onChange={(event) => setFormOneChildData(prevState => ({
                          ...prevState,
                          school_status: "at-school"
                        }))} />
                      <Form.Check
                        type="radio"
                        name="school"
                        id="nonschool"
                        defaultChecked
                        label="Non School"
                        onChange={(event) => setFormOneChildData(prevState => ({
                          ...prevState,
                          school_status: "no-school"
                        }))} />
                    </div>
                  </Form.Group>
                </Col>
                {
                  formOneChildData.school_status === 'at-school' &&
                  <>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="py-3"> if at School, Date first went to School :</Form.Label>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control type="date" placeholder="" name="dob" />
                      </Form.Group>
                    </Col>
                    <Col md={2}>

                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="py-3">if at School, Name and address of School</Form.Label>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control type="date" placeholder="" name="dob" />
                      </Form.Group>
                    </Col>
                    <Col md={2}>

                    </Col>
                  </>
                }
                {/* <Col md={12} className="">
                  <Form.Group className="mb-3">
                    <Form.Label>Name of the school</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address of the school</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="school_address" />
                  </Form.Group>
                </Col> */}
              </Row>
            </div>
          </div>
          <div className="enrollment-form-sec mt-5">
            <Form onSubmit={submitFormData}>
              <div className="enrollment-form-column">
                <h2 className="title-xs mb-3">Information about the child’s parents or guardians</h2>
                <div className="grayback">
                  <Row>
                    <Col md={6}>
                      <div className="parent_fields">
                        <Form.Group className="mb-3">
                          <div className="btn-radio inline-col">
                            <Form.Check 
                              type="radio" 
                              name="information1" 
                              id="parent1" 
                              className="ps-0" 
                              label="Parent" 
                              defaultChecked
                              onChange={(event) => setFormOneParentData(prevState => ({
                                ...prevState,
                                relation_type: "parent"
                              }))} />
                            <Form.Check 
                              type="radio" 
                              name="information1" 
                              id="guardian1" 
                              label="Guardian"
                              onChange={(event) => setFormOneParentData(prevState => ({
                                ...prevState,
                                relation_type: "guardian"
                              }))} />
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Family Name</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="Family Name"
                            name="family_name"
                            value={formOneParentData.family_name || ""}
                            onChange={(e) => {
                              handleParentData(e);
                              setParentFormErrors(prevState => ({
                                ...prevState,
                                family_name: null
                              }));
                            }} 
                          />
                          { parentFormErrors?.family_name !== null && <span className="error">{parentFormErrors?.family_name}</span> }
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Given Name</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="Given Name"
                            name="given_name"
                            value={formOneParentData.given_name || ""}
                            onChange={(e) => {
                              handleParentData(e);
                              setParentFormErrors(prevState => ({
                                ...prevState,
                                given_name: null
                              }));
                            }} 
                          />
                          { parentFormErrors?.given_name !== null && <span className="error">{parentFormErrors?.given_name}</span> }
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Date Of Birth</Form.Label>
                          <Form.Control 
                            type="date" 
                            placeholder="" 
                            name="dob"
                            onChange={(e) => {
                              handleParentData(e);
                              setParentFormErrors(prevState => ({
                                ...prevState,
                                dob: null
                              }));
                            }} 
                          />
                          { parentFormErrors?.dob !== null && <span className="error">{parentFormErrors?.dob}</span> }
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Address As Per Child</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            rows={3} 
                            placeholder="Address As Per Child"
                            name="address_as_per_child"
                            value={formOneParentData.address_as_per_child || ""}
                            onChange={(e) => {
                              handleParentData(e);
                              setParentFormErrors(prevState => ({
                                ...prevState,
                                address_as_per_child: null
                              }));
                            }} 
                          />
                          { parentFormErrors?.address_as_per_child !== null && <span className="error">{parentFormErrors?.address_as_per_child}</span> }
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Telephone</Form.Label>
                          <Form.Control 
                            type="tel" 
                            placeholder="+3375005467"
                            name="telephone"
                            onChange={(e) => {
                              handleParentData(e);
                              setParentFormErrors(prevState => ({
                                ...prevState,
                                telephone: null
                              }));
                            }} 
                          />
                          { parentFormErrors?.telephone !== null && <span className="error">{parentFormErrors?.telephone}</span> }
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control 
                            type="email" 
                            placeholder="Email Address"
                            name="email"
                            onChange={(e) => {
                              handleParentData(e);
                              setParentFormErrors(prevState => ({
                                ...prevState,
                                email: null
                              }));
                            }} 
                          />
                          { parentFormErrors?.email !== null && <span className="error">{parentFormErrors?.email}</span> }
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <div className="btn-radio inline-col">
                            <Form.Label>Child live with this parent/guardian?</Form.Label>
                            <Form.Check 
                              type="radio" 
                              name="live1" 
                              id="Yesp" 
                              label="Yes" 
                              defaultChecked
                              onChange={(event) => setFormOneParentData(prevState => ({
                                ...prevState,
                                child_live_with_this_parent: true
                              }))} />
                            <Form.Check 
                              type="radio" 
                              name="live1" 
                              id="nop" 
                              label="No"
                              onChange={(event) => setFormOneParentData(prevState => ({
                                ...prevState,
                                child_live_with_this_parent: false
                              }))} />
                          </div>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Place Of Birth</Form.Label>
                          <Select
                            placeholder="Select"
                            closeMenuOnSelect={true}
                            options={countryData}
                            name="place_of_birth"
                            onChange={(e) => {
                              setFormOneParentData((prevState) => ({
                                ...prevState,
                                place_of_birth: e.value,
                              }));
                              setParentFormErrors(prevState => ({
                                ...prevState,
                                place_of_birth: null
                              }));
                            }}
                          />
                          { parentFormErrors?.place_of_birth !== null && <span className="error">{parentFormErrors?.place_of_birth}</span> }
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Ethnicity</Form.Label>
                          <Select
                            placeholder="Select"
                            closeMenuOnSelect={true}
                            options={ethnicityData}
                            name="ethinicity"
                            onChange={(e) => {
                              setFormOneParentData((prevState) => ({
                                ...prevState,
                                ethnicity: e.value,
                              }));
                              
                              setParentFormErrors(prevState => ({
                                ...prevState,
                                ethnicity: null
                              }));
                            }}
                          />
                          { parentFormErrors?.ethnicity !== null && <span className="error">{parentFormErrors?.ethnicity}</span> }
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Primary Language</Form.Label>
                          <Select
                            placeholder="Select"
                            closeMenuOnSelect={true}
                            options={languageData}
                            name="primary_language"
                            onChange={(e) => {
                              setFormOneParentData((prevState) => ({
                                ...prevState,
                                primary_language: e.value,
                              }));
                              setParentFormErrors(prevState => ({
                                ...prevState,
                                primary_language: null
                              }));
                            }}
                          />
                          { parentFormErrors?.primary_language !== null && <span className="error">{parentFormErrors?.primary_language}</span> }
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Occupation</Form.Label>
                          <Select
                            placeholder="Select"
                            closeMenuOnSelect={true}
                            options={occupationData}
                            name="occupation"
                            onChange={(e) => {
                              setFormOneParentData((prevState) => ({
                                ...prevState,
                                occupation: e.value,
                              }));
                              setParentFormErrors(prevState => ({
                                ...prevState,
                                occupation: null
                              }));
                            }}
                          />
                          { parentFormErrors?.occupation !== null && <span className="error">{parentFormErrors?.occupation}</span> }
                        </Form.Group>

                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="parent_fields">
                        <Form.Group className="mb-3">
                          <div className="btn-radio inline-col">
                            <Form.Check type="radio" name="information2" id="parent2" className="ps-0" label="Parent" />
                            <Form.Check type="radio" name="information2" id="guardian2" label="Guardian" defaultChecked />
                          </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Family Name</Form.Label>
                          <Form.Control type="text" placeholder="Family Name" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Given Name</Form.Label>
                          <Form.Control type="text" placeholder="Given Name" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Date Of Birth</Form.Label>
                          <Form.Control type="date" placeholder="" name="dob" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Address As Per Child</Form.Label>
                          <Form.Control as="textarea" rows={3} placeholder="Address As Per Child" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Telephone</Form.Label>
                          <Form.Control type="tel" placeholder="+3375005467" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control type="email" placeholder="Email Address" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <div className="btn-radio inline-col">
                            <Form.Label>Child live with this parent/guardian?</Form.Label>
                            <Form.Check type="radio" name="live1" id="Yesp" label="Yes" defaultChecked />
                            <Form.Check type="radio" name="live1" id="nop" label="No" />
                          </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Place Of Birth</Form.Label>
                          <Select
                            placeholder="Select"
                            closeMenuOnSelect={true}
                            options={countryData}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Ethnicity</Form.Label>
                          <Select
                            placeholder="Select"
                            closeMenuOnSelect={true}
                            options={ethnicityData}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Primary Language</Form.Label>
                          <Select
                            placeholder="Select"
                            closeMenuOnSelect={true}
                            options={languageData}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Occupation</Form.Label>
                          <Select
                            placeholder="Select"
                            closeMenuOnSelect={true}
                            options={occupationData}
                          />
                        </Form.Group>

                      </div>
                    </Col>
                  </Row>
                </div>

              </div>
              {/* <div className="cta text-center mt-5 mb-5">
            <Button variant="outline" type="submit" onChange={prevStep} className="me-3">Previous</Button>
            <Button variant="primary" type="submit">Next</Button>
          </div> */}
            </Form>
          </div>
          <div className="cta text-center mt-5 mb-5">
            <Button variant="primary" type="submit">Next</Button>
          </div>
        </Form>
      </div>
      {
        <Modal 
          show={showSubmissionSuccessModal}
          onHide={() => setShowSubmissionSuccessModal(false)}>
          <Modal.Header>
            <Modal.Title>
              Success
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            <p>Form {step} submitted successfully!</p>
          </Modal.Body>

          <Modal.Footer>

          </Modal.Footer>
        </Modal>
      }
    </>
  );
};

export default ChildEnrollment1;
