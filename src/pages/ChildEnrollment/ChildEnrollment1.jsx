
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Col, Row, Form, Modal } from "react-bootstrap";
import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
import { BASE_URL } from "../../components/App";
import { childFormValidator, parentFormValidator  } from "../../helpers/enrollmentValidation";
import { useParams } from 'react-router-dom';

let nextstep = 2;
let step = 1;
let telDigitCount = 0;

var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

// let countryData = [
//   {
//     id: 1,
//     value: "Australia",
//     label: "Australia"
//   }
// ]

const ChildEnrollment1 = ({ nextStep, handleFormData }) => {
  console.log('FORM NUMBER:=>>>>>>>>>>>>>>>>>>>>', 1);
  let { childId: paramsChildId } = useParams();
  // STATE TO HANDLE CHILD DATA
  const [formOneChildData, setFormOneChildData] = useState({
    fullname: "",
    family_name: "",
    usually_called: "",
    dob: "",
    home_address: "",
    language: "",
    country_of_birth: "",
    child_medical_no: "",
    child_crn: "",
    parent_crn_1: "",
    parent_crn_2: "",
    gender: "M",
    address_of_school: "",
    name_of_school: "",
    date_first_went_to_school: "",
    child_origin: "NATSI",
    developmental_delay: false,
    another_service: false,
    school_status: "no-school",
    log: []
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
    child_live_with_this_parent: false,
    log: []
  });
  const [occupationData, setOccupationData] = useState(null);
  const [ethnicityData, setEthnicityData] = useState(null);
  const [languageData, setLanguageData] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [formStepData, setFormStepData] = useState(step);

  // const [parentUserDetailFromEngagebay, setParentUserDetailFromEngagebay] = useState();

  // ERROR HANDLING STATE
  const [childFormErrors, setChildFormErrors] = useState(null);
  const [parentFormErrors, setParentFormErrors] = useState(null);

  // MODAL DIALOG STATES
  const [showSubmissionSuccessModal, setShowSubmissionSuccessModal] = useState(false);
  const [showConsentCommentDialog, setShowConsentCommentDialog] = useState(false);
  const [loader, setLoader] = useState(false);

  // FUNCTION TO UPDATE THIS FORM DATA
  const updateFormOneData = async (childData, parentData) => {
    setLoader(true);
    console.log('UPDATING FORM ONE DATA!');
    let token = localStorage.getItem('token');
    let childId = localStorage.getItem('enrolled_child_id')
    let parentId = localStorage.getItem('enrolled_parent_id');

    // UPDATING CHILD DETAIL
    let response;
    if(formStepData > step) {
      response = await axios.patch(`${BASE_URL}/enrollment/child/${childId}`, { ...childData }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    } else {
      response = await axios.patch(`${BASE_URL}/enrollment/child/${childId}`, { ...childData, form_step:  nextstep, isChildEnrolled: 1 }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    }

    if(response.status === 201 && response.data.status === "success") {
      // UPDATIN PARENT DETAIL
      console.log('PARENT DATA BEFORE UPDATION:', parentData);
      response = await axios.patch(`${BASE_URL}/enrollment/parent/${parentId}`, {...parentData}, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if(response.status === 201 && response.data.status === "success") {
        let user_id = localStorage.getItem('user_id');
        response = await axios.patch(`${BASE_URL}/auth/user/update/${user_id}`);

        if(response.status === 201 && response.data.status === "success") {

          let changeCount = 0;
          if(formOneChildData.log.length > 0)
            changeCount++;

          if(formOneParentData.log.length > 0)
            changeCount++;

          localStorage.setItem('change_count', changeCount);

          setLoader(false);
          nextStep();
        }
      }
    }

  };

  // FUNCTION TO SAVE THIS FORM DATA
  // const saveFormOneData = async (childData, parentData) => {
  //   console.log('PARENT DATA:', parentData);
  //   let token = localStorage.getItem('token');
  //   let response = await axios.post(`${BASE_URL}/enrollment/child`, { ...childData, nextstep }, {
  //     headers: {
  //       "Authorization": `Bearer ${token}`
  //     }
  //   });

  //   if(response.status === 201 && response.data.status === "success") {
  //     const { id: childId } = response.data.child;

  //     // SAVING CHILD ID TO LOCAL STORAGE FOR FURTHER USE
  //     localStorage.setItem('enrolled_child_id', childId);

  //     // SAVING PARENT DETAIL
  //     let user_id = localStorage.getItem('user_id');
  //     response = await axios.post(`${BASE_URL}/enrollment/parent/`, {...parentData, childId, user_parent_id: user_id}, {
  //       headers: {
  //         "Authorization": `Bearer ${token}`
  //       }
  //     });

  //     console.log('PARENT RESPONSE:', response);
  //     if(response.status === 201 && response.data.status === "success") {
  //       let { parent } = response.data;
  //       localStorage.setItem('enrolled_parent_id', parent.id);

  //       // HIDING THE DIALOG BOX FROM DASHBOARD
  //       let user_id = localStorage.getItem('user_id');
  //       response = await axios.patch(`${BASE_URL}/auth/user/update/${user_id}`);

  //       if(response.status === 201 && response.data.status === "success") {
  //         nextStep();
  //       }
  //     }
  //   }
  // };

  const handleChildData = event => {
    const { name, value } = event.target;

    setFormOneChildData(prevState => ({
      ...prevState,
      [name]: value,
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
    let errorChild = childFormValidator(formOneChildData);
    let errorParent = parentFormValidator(formOneParentData);

    if(Object.keys(errorChild).length > 0 || Object.keys(errorParent).length > 0) {
      setChildFormErrors(errorChild);
      setParentFormErrors(errorParent);
    } else {
      setLoader(true);
      updateFormOneData(formOneChildData, formOneParentData);
      // if(formStepData > step) {
      //   console.log('UPDATING THE EXISTING DATA!');
      //   updateFormOneData(formOneChildData, formOneParentData);
      // } else {
      //   console.log('CREATING NEW DATA!')
      //   saveFormOneData(formOneChildData, formOneParentData);
      // }
    }
    // nextStep();
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

  const fetchChildDataAndPopulate = async () => {
    console.log('FETCHING CHILD DATA AND POPULATE!');
    let enrolledChildId = paramsChildId;
    console.log('Enrolled child id:', paramsChildId);
    let token = localStorage.getItem('token');

    let response = await axios.get(`${BASE_URL}/enrollment/child/${enrolledChildId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if(response.status === 200 && response.data.status === 'success') {
      let { child } = response.data;
      let { parent } = response.data;
      
      console.log('FETCHED CHILD DATA:', child);
      console.log('FETCHED PARENT DATA:', parent);

      setFormOneChildData(prevState => ({
        ...prevState,
        fullname: child?.fullname,
        family_name: child?.family_name,
        usually_called: child?.usually_called,
        dob: child?.dob,
        home_address: child?.home_address,
        language: child?.language,
        country_of_birth: child?.country_of_birth,
        gender: child?.sex,
        child_origin: child?.child_origin,
        developmental_delay: child?.developmental_delay,
        another_service: child?.using_another_service,
        school_status: child?.school_status,
        child_medical_no: child?.child_medical_no,
        child_crn: child?.child_crn,
        parent_crn_1: child?.parent_crn_1,
        parent_crn_2: child?.parent_crn_2,
        date_first_went_to_school: child?.date_first_went_to_school,
        name_of_school: child?.name_of_school,
        address_of_school: child?.address_of_school
      }));

      setFormOneParentData(prevState => ({
        ...prevState,
        family_name: child?.parents[0].family_name || parent.fullname?.split(" ")[0],
        given_name: child?.parents[0].given_name || parent.fullname?.split(" ")?.slice(1).join(" "),
        relation_type: child?.parents[0].relation_type,
        address_as_per_child: child?.parents[0].address_as_per_child || parent.address,
        telephone: child?.parents[0].telephone || parent.telephone,
        email: child?.parents[0].email || parent.email,
        dob: child?.parents[0].dob,
        child_live_with_this_parent: child?.parents[0].child_live_with_this_parent,
        place_of_birth: child?.parents[0].place_of_birth,
        ethnicity: child?.parents[0].ethnicity,
        primary_language: child?.parents[0].primary_language,
        occupation: child?.parents[0].occupation
      }));

      setFormStepData(child.form_step);
    }
  };

  useEffect(() => {
    fetchOccupationData();
    fetchEthnicityData();
    fetchLanguageData();
    fetchCountryData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchChildDataAndPopulate();
  }, []);

  // useEffect(() => {
  //   console.log("checking useEffect!")
  //   if(localStorage.getItem('has_given_consent') !== null) {
  //     setShowConsentCommentDialog(true);
  //   }
  // }, [])

  // formStepData && console.log('You\'re on step:', formStepData);
  formOneParentData && console.log('FORM ONE PARENT DATA:', formOneParentData);
  formOneChildData && console.log('FORM ONE CHILD DATA:', formOneChildData);
  // console.log('IS PRESENT?', localStorage.getItem('enrolled_parent_id') !== null);
  return (
    <>
      <div className="enrollment-form-sec error-sec my-5">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <div className="grayback">
              <h2 className="title-xs mb-2">Information about the child</h2>
              <p className="form_info mb-4">A parent or guardian who ns lawful authority in relation to the child must complete this form. Licensed children’s services may use this form to collect the child’s enrolment information as required in the Children’s Service’s Regulations 2017 and education and care services national law act 2010. Based on these regulations, parents are not required to fill questions marked with an asterisk, however, it will be highly important for the service to have those details.</p>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Child’s First Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullname"
                      maxLength={50}
                      placeholder="Child’s Full Name"
                      value={formOneChildData?.fullname || ""}
                      onChange={(e) => {
                        // if(isNaN(e.target.value.charAt(e.target.value.length - 1)) === true) {
                        setFormOneChildData(prevState => ({
                          ...prevState,
                          fullname: e.target.value
                        }));
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          fullname: null,
                        })) 
                        // } else {
                        //   setFormOneChildData(prevState => ({
                        //     ...prevState,
                        //     fullname: e.target.value.slice(0, -1)
                        //   }));
                        // }
                      }}
                      onBlur={(e) => {
                        if(!formOneChildData.log.includes("fullname")) {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            log: [...formOneChildData.log, "fullname"]
                          }));
                        }
                      }} />
                    { childFormErrors?.fullname !== null && <span className="error">{childFormErrors?.fullname}</span> }
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Family Name *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Family Name"
                      minLenth={3}
                      maxLength={50}
                      name="family_name"
                      value={formOneChildData?.family_name || ""}
                      onChange={(e) => {
                        // if(isNaN(e.target.value.charAt(e.target.value.length - 1)) === true) {
                        setFormOneChildData(prevState => ({
                          ...prevState,
                          family_name: e.target.value
                        }));
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          family_name: null,
                        })) 
                        // } else {
                        //   setFormOneChildData(prevState => ({
                        //     ...prevState,
                        //     family_name: e.target.value.slice(0, -1)
                        //   }));
                        // }
                      }}
                      onBlur={(e) => {
                        if(!formOneChildData.log.includes("family_name")) {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            log: [...formOneChildData.log, "family_name"]
                          }));
                        }
                      }} />
                    { childFormErrors?.family_name !== null && <span className="error">{childFormErrors?.family_name}</span> }
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Nickname</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nickname"
                      minLenth={3}
                      maxLength={50}
                      name="usually_called"
                      value={formOneChildData?.usually_called || ""}
                      onChange={(e) => {
                        // if(isNaN(e.target.value.charAt(e.target.value.length - 1)) === true) {
                        setFormOneChildData(prevState => ({
                          ...prevState,
                          usually_called: e.target.value
                        }));
                        // } else {
                        //   setFormOneChildData(prevState => ({
                        //     ...prevState,
                        //     usually_called: e.target.value.slice(0, -1)
                        //   }));
                        // }
                      }}
                      onBlur={(e) => {
                        if(!formOneChildData.log.includes("usually_called")) {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            log: [...formOneChildData.log, "usually_called"]
                          }));
                        }
                      }} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Date Of Birth *</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder=""
                      name="dob"
                      max={new Date().toISOString().slice(0, 10)}
                      value={formOneChildData?.dob || ""}
                      onChange={(e) => {
                        handleChildData(e);
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          dob: null
                        }))
                      }}
                      onBlur={(e) => {
                        if(!formOneChildData.log.includes("dob")) {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            log: [...formOneChildData.log, "dob"]
                          }));
                        }
                      }} />
                    { childFormErrors?.dob !== null && <span className="error">{childFormErrors?.dob}</span> }
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
                        onChange={(event) => {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            gender: "M"
                          }));
                          if(!formOneChildData.log.includes("gender")) {
                            setFormOneChildData(prevState => ({
                              ...prevState,
                              log: [...formOneChildData.log, "gender"]
                            }));
                          }
                        }} />
                      <Form.Check
                        type="radio"
                        name="gender"
                        id="femalecheck"
                        checked = {formOneChildData?.gender === "F"}
                        label="Female"
                        onChange={(event) => {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            gender: "F"
                          }));
                          if(!formOneChildData.log.includes("gender")) {
                            setFormOneChildData(prevState => ({
                              ...prevState,
                              log: [...formOneChildData.log, "gender"]
                            }));
                          }
                        }} />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Home Address *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Home Address"
                      name="home_address"
                      value={formOneChildData?.home_address || ""}
                      onChange={(e) => {
                        handleChildData(e);
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          home_address: null
                        }))
                      }}
                      onBlur={(e) => {
                        if(!formOneChildData.log.includes("home_address")) {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            log: [...formOneChildData.log, "home_address"]
                          }));
                        }
                      }} />
                    { childFormErrors?.home_address !== null && <span className="error">{childFormErrors?.home_address}</span> }
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Language spoken at home *</Form.Label>
                    <Select
                      placeholder={formOneChildData?.language || "Select"}
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

                        if(!formOneChildData.log.includes("language")) {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            log: [...formOneChildData.log, "language"]
                          }));
                        }
                      }}
                    />
                    { childFormErrors?.language !== null && <span className="error">{childFormErrors?.language}</span> }
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Country Of Birth *</Form.Label>
                    <Select
                      placeholder={formOneChildData?.country_of_birth || "Select"}
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
                        if(!formOneChildData.log.includes("country_of_birth")) {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            log: [...formOneChildData.log, "country_of_birth"]
                          }));
                        }
                      }}
                    />
                    { childFormErrors?.country_of_birth !== null && <span className="error">{childFormErrors?.country_of_birth}</span> }
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Is the child of Aboriginal and/or Torres Strait Islander origin?</Form.Label>
                    <div className="btn-radio two-col">
                      <Form.Check
                        type="radio"
                        name="aboriginaltorres"
                        id="noaboriginaltorres"
                        checked={formOneChildData?.child_origin.toUpperCase() === "NATSI"}
                        defaultChecked
                        label="No, not Aboriginal or Torres Straight Islander"
                        onChange={(event) => {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            child_origin: "NATSI"
                          }));

                          if(!formOneChildData.log.includes("child_origin")) {
                            setFormOneChildData(prevState => ({
                              ...prevState,
                              log: [...formOneChildData.log, "child_origin"]
                            }));
                          }
                        }} />

                      <Form.Check
                        type="radio"
                        name="aboriginaltorres"
                        id="yesaboriginal"
                        checked={formOneChildData?.child_origin.toUpperCase() === "A"}
                        label="Yes, Aboriginal"
                        onChange={(event) => {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            child_origin: "A"
                          }));

                          if(!formOneChildData.log.includes("child_origin")) {
                            setFormOneChildData(prevState => ({
                              ...prevState,
                              log: [...formOneChildData.log, "child_origin"]
                            }));
                          }
                        }} />
                      <Form.Check
                        type="radio"
                        name="aboriginaltorres"
                        id="yesaboriginaltorres"
                        checked={formOneChildData?.child_origin.toUpperCase() === "YATSI"}
                        label="Yes, Aboriginal and Torres Straight Islander"
                        onChange={(event) => {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            child_origin: "YATSI"
                          }));
                          if(!formOneChildData.log.includes("child_origin")) {
                            setFormOneChildData(prevState => ({
                              ...prevState,
                              log: [...formOneChildData.log, "child_origin"]
                            }));
                          }
                        }} />
                      <Form.Check
                        type="radio"
                        name="aboriginaltorres"
                        id="yestorres"
                        checked={formOneChildData?.child_origin?.toUpperCase() === "TSI"}
                        label="Yes, Torres Straight Islander"
                        onChange={(event) => {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            child_origin: "TSI"
                          }));
                          if(!formOneChildData.log.includes("child_origin")) {
                            setFormOneChildData(prevState => ({
                              ...prevState,
                              log: [...formOneChildData.log, "child_origin"]
                            }));
                          }
                        }} />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Does the child have a developmental delay or disability including intellectual, sensory or physical impairment?</Form.Label>
                    <div className="btn-radio inline-col">
                      <Form.Check
                        type="radio"
                        name="disability"
                        id="yesc"
                        className="ps-0"
                        checked={formOneChildData?.developmental_delay === true}
                        label="Yes"
                        onChange={(event) => {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            developmental_delay: true
                          }));

                          if(!formOneChildData.log.includes("developmental_delay")) {
                            setFormOneChildData(prevState => ({
                              ...prevState,
                              log: [...formOneChildData.log, "developmental_delay"]
                            }));
                          }
                        }} />
                      <Form.Check
                        type="radio"
                        name="disability"
                        id="noc"
                        label="No"
                        checked={formOneChildData?.developmental_delay === false}
                        defaultChecked
                        onChange={(event) => {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            developmental_delay: false,
                            child_medical_no: null,
                            child_crn: null,
                            parent_crn_1: null,
                            parent_crn_2: null
                          }));
                          if(!formOneChildData.log.includes("developmental_delay")) {
                            setFormOneChildData(prevState => ({
                              ...prevState,
                              log: [...formOneChildData.log, "developmental_delay"]
                            }));
                          }
                        }} />
                    </div>
                    <Form.Text className="text-muted">
                      if ‘Yes’ please provide information (Inclusion Support Form if applicable)
                    </Form.Text>
                  </Form.Group>
                </Col>
                {
                  formOneChildData.developmental_delay &&
                  <>
                    <Col md={6}>
                      <Form.Group className="mb-3 relative">
                        <Form.Label>Child Medical No. *</Form.Label>
                        <Form.Control
                          type="text"
                          name="child_medical_no"
                          placeholder="Child Medical No."
                          value={formOneChildData.child_medical_no || ""}
                          onChange={(e) => {
                            handleChildData(e);
                          }} 
                          onBlur={(e) => {
                            if(!formOneChildData.log.includes("child_medical_no")) {
                              setFormOneChildData(prevState => ({
                                ...prevState,
                                log: [...formOneChildData.log, "child_medical_no"]
                              }));
                            }
                          }} />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3 relative">
                        <Form.Label>Child CRN *</Form.Label>
                        <Form.Control
                          type="text"
                          name="child_crn"
                          placeholder="Child CRN"
                          value={formOneChildData.child_crn || ""}
                          onChange={(e) => {
                            handleChildData(e);
                          }} 
                          onBlur={(e) => {
                            if(!formOneChildData.log.includes("child_crn")) {
                              setFormOneChildData(prevState => ({
                                ...prevState,
                                log: [...formOneChildData.log, "child_crn"]
                              }));
                            }
                          }} />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3 relative">
                        <Form.Label>Parents CRN 1 *</Form.Label>
                        <Form.Control
                          type="text"
                          name="parent_crn_1"
                          placeholder="Parent CRN I"
                          value={formOneChildData.parent_crn_1 || ""}
                          onChange={(e) => {
                            handleChildData(e);
                          }} 
                          onBlur={(e) => {
                            if(!formOneChildData.log.includes("parent_crn_1")) {
                              setFormOneChildData(prevState => ({
                                ...prevState,
                                log: [...formOneChildData.log, "parent_crn_1"]
                              }));
                            }
                          }} />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Parents CRN 2 *</Form.Label>
                        <Form.Control
                          type="text"
                          name="parent_crn_2"
                          placeholder="Parent CRN II"
                          value={formOneChildData.parent_crn_2 || ""}
                          onChange={(e) => {
                            handleChildData(e);
                          }} 
                          onBlur={(e) => {
                            if(!formOneChildData.log.includes("parent_crn_2")) {
                              setFormOneChildData(prevState => ({
                                ...prevState,
                                log: [...formOneChildData.log, "parent_crn_2"]
                              }));
                            }
                          }} />
                      </Form.Group>
                    </Col>
                  </>
                }
                <Col md={12}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Is the child using another service?</Form.Label>
                    <div className="btn-radio inline-col">
                      <Form.Check
                        type="radio"
                        name="anotherser"
                        id="yess"
                        checked={formOneChildData?.another_service === true}
                        className="ps-0"
                        label="Yes"
                        onChange={(event) => {
                          setFormOneChildData(prevState => ({
                          ...prevState,
                          another_service: true
                          }));

                          if(!formOneChildData.log.includes("another_service")) {
                            setFormOneChildData(prevState => ({
                              ...prevState,
                              log: [...formOneChildData.log, "another_service"]
                            }));
                          }
                        }} />
                      <Form.Check
                        type="radio"
                        name="anotherser"
                        id="nos"
                        defaultChecked
                        checked={formOneChildData?.another_service === false}
                        label="No"
                        onChange={(event) => {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            another_service: false
                          }));

                          if(!formOneChildData.log.includes("another_service")) {
                            setFormOneChildData(prevState => ({
                              ...prevState,
                              log: [...formOneChildData.log, "another_service"]
                            }));
                          }
                        }} />
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
                      <Form.Group className="mb-3 relative">
                        <Form.Label>Monday</Form.Label>
                        <Form.Control type="number" />
                      </Form.Group>
                    </Col>
                    <Col xl={3} lg={4} md={6}>
                      <Form.Group className="mb-3 relative">
                        <Form.Label>Tuesday</Form.Label>
                        <Form.Control type="number" />
                      </Form.Group>
                    </Col>
                    <Col xl={3} lg={4} md={6}>
                      <Form.Group className="mb-3 relative">
                        <Form.Label>Wednesday</Form.Label>
                        <Form.Control type="number" />
                      </Form.Group>
                    </Col>
                    <Col xl={3} lg={4} md={6}>
                      <Form.Group className="mb-3 relative">
                        <Form.Label>Thrusday</Form.Label>
                        <Form.Control type="number" />
                      </Form.Group>
                    </Col>
                    <Col xl={3} lg={4} md={6}>
                      <Form.Group className="mb-3 relative">
                        <Form.Label>Friday</Form.Label>
                        <Form.Control type="number" />
                      </Form.Group>
                    </Col>
                  </>
                }
                <Col md={12}>
                  <Form.Group className="mb-3 relative">
                    <div className="btn-radio inline-col">
                      <Form.Label>School Status :</Form.Label>
                      <Form.Check
                        type="radio"
                        name="school"
                        id="atschool"
                        checked={formOneChildData?.school_status === "at-school"}
                        label="At School"
                        onChange={(event) => {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            school_status: "at-school"
                          }));
                          if(!formOneChildData.log.includes("school_status")) {
                            setFormOneChildData(prevState => ({
                              ...prevState,
                              log: [...formOneChildData.log, "school_status"]
                            }));
                          }
                        }} />
                      <Form.Check
                        type="radio"
                        name="school"
                        id="nonschool"
                        defaultChecked
                        checked={formOneChildData?.school_status === "no-school"}
                        label="Non School"
                        onChange={(event) => {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            school_status: "no-school",
                            date_first_went_to_school: null,
                            name_of_school: null,
                            address_of_school: null
                          }));

                          if(!formOneChildData.log.includes("school_status")) {
                            setFormOneChildData(prevState => ({
                              ...prevState,
                              log: [...formOneChildData.log, "school_status"]
                            }));
                          }
                        }} />
                    </div>
                  </Form.Group>
                </Col>
                {
                  formOneChildData.school_status === 'at-school' &&
                  <>
                    <Col md={4}>
                      <Form.Group className="mb-3 relative">
                        <Form.Label className="py-3"> Date first went to School : *</Form.Label>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3 relative">
                        <Form.Control 
                          type="date"
                          placeholder="" 
                          name="date_first_went_to_school"
                          max={new Date().toISOString().slice(0, 10)}
                          value={formOneChildData?.date_first_went_to_school || ""}
                          onChange={(e) => {
                            handleChildData(e);
                          }} 
                          onBlur={(e) => {
                            if(!formOneChildData.log.includes("date_first_went_to_school")) {
                              setFormOneChildData(prevState => ({
                                ...prevState,
                                log: [...formOneChildData.log, "date_first_went_to_school"]
                              }));
                            }
                          }} />
                      </Form.Group>
                    </Col>
                    <Col md={2}>

                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3 relative">
                        <Form.Label className="py-3">Name and address of School *</Form.Label>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3 relative">
                        <Form.Control 
                          type="text" 
                          name="name_of_school"
                          placeholder="Name of School"
                          value={formOneChildData?.name_of_school || ""}
                          onChange={(e) => {
                            handleChildData(e);
                          }} 
                          onBlur={(e) => {
                            if(!formOneChildData.log.includes("name_of_school")) {
                              setFormOneChildData(prevState => ({
                                ...prevState,
                                log: [...formOneChildData.log, "name_of_school"]
                              }));
                            }
                          }} />
                      </Form.Group>

                      <Form.Group className="mb-3 relative">
                        <Form.Control 
                          type="text" 
                          placeholder="Address of School" 
                          name="address_of_school"
                          value={formOneChildData?.address_of_school || ""}
                          onChange={(e) => {
                            handleChildData(e);
                          }} 
                          onBlur={(e) => {
                            if(!formOneChildData.log.includes("address_of_school")) {
                              setFormOneChildData(prevState => ({
                                ...prevState,
                                log: [...formOneChildData.log, "address_of_school"]
                              }));
                            }
                          }} />
                      </Form.Group>
                    </Col>
                    <Col md={2}>

                    </Col>
                  </>
                }
                {/* <Col md={12} className="">
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Name of the school</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3 relative">
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
          <div className="enrollment-form-sec mt-3">
            <Form onSubmit={submitFormData}>
              <div className="enrollment-form-column">
                <h2 className="title-xs">Information about the child’s parents or guardians</h2>
                <div className="grayback">
                  <Row>
                    <Col md={12}>
                      <div className="parent_fields">
                        <Form.Group className="mb-3 relative">
                          <div className="btn-radio inline-col">
                            <Form.Check 
                              type="radio" 
                              name="information1" 
                              id="parent1" 
                              className="ps-0" 
                              label="Parent" 
                              checked={formOneParentData?.relation_type === "parent"}
                              defaultChecked
                              onChange={(event) => {
                                setFormOneParentData(prevState => ({
                                  ...prevState,
                                  relation_type: "parent"
                                }))

                                if(!formOneParentData.log.includes("relation_type")) {
                                  setFormOneParentData(prevState => ({
                                    ...prevState,
                                    log: [...formOneParentData.log, "relation_type"]
                                  }));
                                }
                              }} />
                            <Form.Check 
                              type="radio" 
                              name="information1" 
                              id="guardian1" 
                              label="Guardian"
                              checked={formOneParentData?.relation_type === "guardian"}
                              onChange={(event) => {
                                setFormOneParentData(prevState => ({
                                  ...prevState,
                                  relation_type: "guardian"
                                }));

                                if(!formOneParentData.log.includes("relation_type")) {
                                  setFormOneParentData(prevState => ({
                                    ...prevState,
                                    log: [...formOneParentData.log, "relation_type"]
                                  }));
                                }
                              }} />
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-3 relative">
                          <Form.Label>First Name *</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="First Name"
                            name="family_name"
                            minLenth={3}
                            maxLength={50}
                            value={formOneParentData.family_name ||  ""}
                            onChange={(e) => {
                              // if(isNaN(e.target.value.charAt(e.target.value.length - 1)) === true) {
                              setFormOneParentData(prevState => ({
                                ...prevState,
                                family_name: e.target.value
                              }));
                              setParentFormErrors(prevState => ({
                                ...prevState,
                                family_name: null,
                              })) 
                              // } else {
                              //   setFormOneParentData(prevState => ({
                              //     ...prevState,
                              //     family_name: e.target.value.slice(0, -1)
                              //   }));
                              // }
                            }}

                            onBlur={(e) => {
                              if(!formOneParentData.log.includes("family_name")) {
                                setFormOneParentData(prevState => ({
                                  ...prevState,
                                  log: [...formOneParentData.log, "family_name"]
                                }));
                              }
                            }}
                          />
                          { parentFormErrors?.family_name !== null && <span className="error">{parentFormErrors?.family_name}</span> }
                        </Form.Group>
                        
                        <Form.Group className="mb-3 relative">
                          <Form.Label>Last Name *</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="Last Name"
                            name="given_name"
                            minLenth={3}
                            maxLength={50}
                            value={formOneParentData.given_name || ""}
                            onChange={(e) => {
                              // if(isNaN(e.target.value.charAt(e.target.value.length - 1)) === true) {
                              setFormOneParentData(prevState => ({
                                ...prevState,
                                given_name: e.target.value
                              }));
                              setParentFormErrors(prevState => ({
                                ...prevState,
                                given_name: null,
                              })) 
                              // } else {
                              //   setFormOneParentData(prevState => ({
                              //     ...prevState,
                              //     given_name: e.target.value.slice(0, -1)
                              //   }));
                              // }
                            }}
                            onBlur={(e) => {
                              if(!formOneParentData.log.includes("given_name")) {
                                setFormOneParentData(prevState => ({
                                  ...prevState,
                                  log: [...formOneParentData.log, "given_name"]
                                }));
                              }
                            }} 
                          />
                          { parentFormErrors?.given_name !== null && <span className="error">{parentFormErrors?.given_name}</span> }
                        </Form.Group>
                        
                        <Form.Group className="mb-3 relative">
                          <Form.Label>Date Of Birth *</Form.Label>
                          <Form.Control 
                            type="date" 
                            placeholder="" 
                            name="dob"
                            max={new Date().toISOString().slice(0, 10)}
                            value={formOneParentData?.dob || ""}
                            onChange={(e) => {
                              handleParentData(e);
                              setParentFormErrors(prevState => ({
                                ...prevState,
                                dob: null
                              }));
                            }} 
                            onBlur={(e) => {
                              if(!formOneParentData.log.includes("dob")) {
                                setFormOneParentData(prevState => ({
                                  ...prevState,
                                  log: [...formOneParentData.log, "dob"]
                                }));
                              }
                            }}
                          />
                          { parentFormErrors?.dob !== null && <span className="error">{parentFormErrors?.dob}</span> }
                        </Form.Group>
                        
                        <Form.Group className="mb-3 relative">
                          <Form.Label>Address *</Form.Label>
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
                            onBlur={(e) => {
                              if(!formOneParentData.log.includes("address_as_per_child")) {
                                setFormOneParentData(prevState => ({
                                  ...prevState,
                                  log: [...formOneParentData.log, "address_as_per_child"]
                                }));
                              }
                            }}
                          />
                          { parentFormErrors?.address_as_per_child !== null && <span className="error">{parentFormErrors?.address_as_per_child}</span> }
                        </Form.Group>
                        
                        <Form.Group className="mb-3 relative">
                          <Form.Label>Telephone *</Form.Label>
                          <Form.Control 
                            type="tel" 
                            placeholder="3375005467"
                            name="telephone"
                            value={formOneParentData?.telephone || ""}
                            onChange={(e) => {
                              if(isNaN(e.target.value.charAt(e.target.value.length - 1)) === true) {
                                setFormOneParentData(prevState => ({
                                  ...prevState,
                                  telephone: e.target.value.slice(0, -1)
                                }));
                              } else {
                                setFormOneParentData(prevState => ({
                                  ...prevState,
                                  telephone: e.target.value
                                }));
                              }
                              setParentFormErrors(prevState => ({
                                ...prevState,
                                telephone: null
                              }));
                            }}
                            onBlur={(e) => {
                              if(!formOneParentData.log.includes("telephone")) {
                                setFormOneParentData(prevState => ({
                                  ...prevState,
                                  log: [...formOneParentData.log, "telephone"]
                                }));
                              }
                            }} 
                          />
                          { parentFormErrors?.telephone !== null && <span className="error">{parentFormErrors?.telephone}</span> }
                        </Form.Group>
                        
                        <Form.Group className="mb-3 relative">
                          <Form.Label>Email Address *</Form.Label>
                          <Form.Control 
                            type="email" 
                            placeholder="Email Address"
                            value={formOneParentData?.email || ""}
                            name="email"
                            onChange={(e) => {
                              handleParentData(e);
                              setParentFormErrors(prevState => ({
                                ...prevState,
                                email: null
                              }));
                            }} 
                            onBlur={(e) => {
                              if(!formOneParentData.log.includes("email")) {
                                setFormOneParentData(prevState => ({
                                  ...prevState,
                                  log: [...formOneParentData.log, "email"]
                                }));
                              }
                            }}
                          />
                          { parentFormErrors?.email !== null && <span className="error">{parentFormErrors?.email}</span> }
                        </Form.Group>
                        
                        <Form.Group className="mb-3 relative">
                          <div className="btn-radio inline-col">
                            <Form.Label>Child live with this parent/guardian?</Form.Label>
                            <Form.Check 
                              type="radio" 
                              name="live1" 
                              id="Yesp" 
                              label="Yes" 
                              checked={formOneParentData?.child_live_with_this_parent === true}
                              defaultChecked
                              onChange={(event) => {
                                setFormOneParentData(prevState => ({
                                  ...prevState,
                                  child_live_with_this_parent: true
                                }));

                                if(!formOneParentData.log.includes("child_live_with_this_parent")) {
                                  setFormOneParentData(prevState => ({
                                    ...prevState,
                                    log: [...formOneParentData.log, "child_live_with_this_parent"]
                                  }));
                                }
                              }} />
                            <Form.Check 
                              type="radio" 
                              name="live1" 
                              id="nop" 
                              label="No"
                              checked={formOneParentData?.child_live_with_this_parent === false}
                              onChange={(event) => {
                                setFormOneParentData(prevState => ({
                                  ...prevState,
                                  child_live_with_this_parent: false
                                }));
                                if(!formOneParentData.log.includes("child_live_with_this_parent")) {
                                  setFormOneParentData(prevState => ({
                                    ...prevState,
                                    log: [...formOneParentData.log, "child_live_with_this_parent"]
                                  }));
                                }
                              }} />
                          </div>
                        </Form.Group>
                        
                        <Form.Group className="mb-3 relative">
                          <Form.Label>Place Of Birth *</Form.Label>
                          <Select
                            placeholder={formOneParentData?.place_of_birth || "Select"}
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
                              if(!formOneParentData.log.includes("place_of_birth")) {
                                setFormOneParentData(prevState => ({
                                  ...prevState,
                                  log: [...formOneParentData.log, "place_of_birth"]
                                }));
                              }
                            }}
                          />
                          { parentFormErrors?.place_of_birth !== null && <span className="error">{parentFormErrors?.place_of_birth}</span> }
                        </Form.Group>
                        
                        <Form.Group className="mb-3 relative">
                          <Form.Label>Ethnicity *</Form.Label>
                          <Select
                             placeholder={formOneParentData?.ethnicity || "Select"}
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

                              if(!formOneParentData.log.includes("ethnicity")) {
                                setFormOneParentData(prevState => ({
                                  ...prevState,
                                  log: [...formOneParentData.log, "ethnicity"]
                                }));
                              }
                            }}
                          />
                          { parentFormErrors?.ethnicity !== null && <span className="error">{parentFormErrors?.ethnicity}</span> }
                        </Form.Group>

                        <Form.Group className="mb-3 relative">
                          <Form.Label>Primary Language *</Form.Label>
                          <Select
                            placeholder={formOneParentData?.primary_language || "Select"}
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

                              if(!formOneParentData.log.includes("primary_language")) {
                                setFormOneParentData(prevState => ({
                                  ...prevState,
                                  log: [...formOneParentData.log, "primary_language"]
                                }));
                              }
                            }}
                          />
                          { parentFormErrors?.primary_language !== null && <span className="error">{parentFormErrors?.primary_language}</span> }
                        </Form.Group>
                        
                        <Form.Group className="mb-3 relative">
                          <Form.Label>Occupation *</Form.Label>
                          <Select
                            placeholder={formOneParentData?.occupation || "Select"}
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

                              if(!formOneParentData.log.includes("occupation")) {
                                setFormOneParentData(prevState => ({
                                  ...prevState,
                                  log: [...formOneParentData.log, "occupation"]
                                }));
                              }
                            }}
                          />
                          { parentFormErrors?.occupation !== null && <span className="error">{parentFormErrors?.occupation}</span> }
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
          <Button variant="primary" disabled={loader ? true : false} type="submit">
            {loader === true ? (
              <>
                <img
                style={{ width: '24px' }}
                src={'/img/mini_loader1.gif'}
                alt=""
                />
                  {
                    localStorage.getItem('user_role') === 'guardian'
                    ? "Saving..."
                    : "Submitting..."
                  }
              </>
            ) : (localStorage.getItem('user_role') === 'guardian' ? 'Next' : 'Submit')}
          </Button>
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
      {
        <Modal
          show={showConsentCommentDialog}
          onHide={() => setShowConsentCommentDialog(false)}>
            <Modal.Header>
              <Modal.Title>Consent Request!</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>Verify the changes made by Co-ordinator.</p>
              <p>Co-ordinator comment:</p>
              <p>"{localStorage.getItem('consent_comment')}"</p>
            </Modal.Body>

            <Modal.Footer>
              <button 
                className="modal-button"
                onClick={() => setShowConsentCommentDialog(false)}>Ok</button>
            </Modal.Footer>
        </Modal>
      }
    </>
  );
};

export default ChildEnrollment1;

