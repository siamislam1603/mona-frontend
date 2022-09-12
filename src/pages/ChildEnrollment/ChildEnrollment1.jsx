
import axios from "axios";
import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { Button, Col, Row, Form, Modal } from "react-bootstrap";
import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
import { BASE_URL } from "../../components/App";
import { childFormValidator, parentFormValidator  } from "../../helpers/enrollmentValidation";
import { useParams } from 'react-router-dom';
import DragDropMultiple from '../../components/DragDropMultiple';
import { isEmpty } from "lodash";

let nextstep = 2;
let step = 1;

// HELPER FUNCTION
function isNullEmpty(obj) {
  let arr = [];

  for(let val of Object.values(obj)) {
    if(val)
      arr.push(val);
  }

  console.log('ARRAY LENGTH:', arr.length);
  if(arr.length === 0)
    return true;

  return false;
}

const ChildEnrollment1 = ({ nextStep, handleFormData }) => {
  let { childId: paramsChildId, parentId: paramsParentId } = useParams();
  let errorChild = {};
  let errorParent = {};

  // USING REFs
  const fullname = useRef(null);
  const family_name = useRef(null);
  const usually_called = useRef(null);
  const home_address = useRef(null);
  const child_medical_no = useRef(null);
  const child_crn = useRef(null);
  const parent_crn_1 = useRef(null);
  const parent_crn_2 = useRef(null);

  const parent_family_name = useRef(null);
  const given_name = useRef(null);
  const telephone = useRef(null); 
  const email = useRef(null); 
  const place_of_birth = useRef(null); 
  const ethnicity = useRef(null);
  const primary_language = useRef(null); 
  const occupation = useRef(null); 

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
    parent_family_name: "",
    given_name: "",
    dob: "",
    address_as_per_child: "",
    telephone: "",
    email: "",
    place_of_birth: "",
    ethnicity: "",
    primary_language: "",
    occupation: "",
    address_similar_to_child: false,
    child_live_with_this_parent: false,
    log: []
  });
  const [occupationData, setOccupationData] = useState(null);
  const [ethnicityData, setEthnicityData] = useState(null);
  const [languageData, setLanguageData] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [formStepData, setFormStepData] = useState(step);
  const [inclusionSupportForm, setInclusionSupportForm] = useState(null);
  const [supportFormDetails, setSupportFormDetails] = useState(null);
  const [childFiles, setChildFiles] = useState(null);

  // const [parentUserDetailFromEngagebay, setParentUserDetailFromEngagebay] = useState();

  // ERROR HANDLING STATE
  const [childFormErrors, setChildFormErrors] = useState(null);
  const [parentFormErrors, setParentFormErrors] = useState(null);

  // MODAL DIALOG STATES
  const [showSubmissionSuccessModal, setShowSubmissionSuccessModal] = useState(false);
  const [showConsentCommentDialog, setShowConsentCommentDialog] = useState(false);
  const [supportFormDeleteMessage, setSupportFormDeleteMessage] = useState(null);
  const [loader, setLoader] = useState(false);

  // FUNCTION TO UPDATE THIS FORM DATA
  const updateFormOneData = async (childData, parentData) => {
    setLoader(true);
    let token = localStorage.getItem('token');
    let childId = localStorage.getItem('enrolled_child_id')
    let parentId = localStorage.getItem('enrolled_parent_id');

    // UPDATING CHILD DETAIL
    let response;
    if(formStepData > step) {
      response = await axios.patch(`${BASE_URL}/enrollment/child/${paramsChildId}`, { ...childData }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    } else {
      response = await axios.patch(`${BASE_URL}/enrollment/child/${paramsChildId}`, { ...childData, form_step:  nextstep, isChildEnrolled: 1 }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    }

    if(response.status === 201 && response.data.status === "success") {
      // UPDATIN PARENT DETAIL
      response = await axios.patch(`${BASE_URL}/enrollment/parent/${paramsParentId}`, {...parentData}, {
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

  // AUTOFOCUS FUNCTIONS
  const setAutoFocusForChild = (errorObj) => {
    let errArray = Object.keys(errorObj);
    console.log('ERROR ARRAY CHILD:', errArray);

    if(errArray.includes('fullname')) {
      fullname?.current?.focus();
    } else if(errArray.includes('family_name')) {
      family_name?.current?.focus();
    } else if(errArray.includes('usually_called')) {
      usually_called?.current?.focus();
    } else if(errArray.includes('home_address')) {
      home_address?.current?.focus();
    } else if(errArray.includes('child_medical_no')) {
      child_medical_no?.current?.focus();
    } else if(errArray.includes('child_crn')) {
      child_crn?.current?.focus();
    } else if(errArray.includes('parent_crn_1')) {
      parent_crn_1?.current?.focus();
    } else if(errArray.includes('parent_crn_2')) {
      parent_crn_2?.current?.focus();
    }
  };

  const setAutoFocusForParent = (errorObj) => {
    let errArray = Object.keys(errorObj);

    if(errArray.includes("parent_family_name")) {
      parent_family_name?.current?.focus();
    } else if(errArray.includes("given_name")) {
      given_name?.current?.focus();
    } else if(errArray.includes("telephone")) {
      telephone?.current?.focus();
    } else if(errArray.includes("email")) {
      email?.current?.focus();
    }
  }

  const submitFormData = (e) => {
    e.preventDefault();
    errorChild = childFormValidator(formOneChildData, supportFormDetails);
    errorParent = parentFormValidator(formOneParentData);

    if(Object.keys(errorChild).length > 0 || Object.keys(errorParent).length > 0) {
      // window.scrollTo(0, 0);
      setChildFormErrors(errorChild);
      setParentFormErrors(errorParent);

      setAutoFocusForChild(errorChild);
      
      if(Object.keys(errorChild).length === 0) {
        setAutoFocusForParent(errorParent);
      }

    } else {
      setLoader(true);
      updateFormOneData(formOneChildData, formOneParentData);
    }
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
    let enrolledChildId = paramsChildId;
    let token = localStorage.getItem('token');

    let response = await axios.get(`${BASE_URL}/enrollment/child/${enrolledChildId}?parentId=${paramsParentId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if(response.status === 200 && response.data.status === 'success') {
      let { child } = response.data;
      let { parent } = response.data;

      let parentData = child.parents.filter(p => parseInt(p.user_parent_id) === parseInt(paramsParentId));

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
        parent_family_name: parentData[0]?.parent_family_name || parent.fullname?.split(" ")[0],
        given_name: parentData[0]?.given_name || parent.fullname?.split(" ")?.slice(1).join(" "),
        relation_type: parentData[0]?.relation_type,
        address_as_per_child: parentData[0]?.address_as_per_child || parent.address,
        telephone: parentData[0]?.telephone || parent.telephone,
        email: parentData[0]?.email || parent.email,
        dob: parentData[0]?.dob,
        child_live_with_this_parent: parentData[0]?.child_live_with_this_parent,
        place_of_birth: parentData[0]?.place_of_birth,
        ethnicity: parentData[0]?.ethnicity,
        primary_language: parentData[0]?.primary_language,
        occupation: parentData[0]?.occupation.charAt(0).toUpperCase() + parentData[0]?.occupation.slice(1),
        address_similar_to_child: parentData[0]?.address_similar_to_child
      }));

      setFormStepData(child.form_step);

      populateChildFiles();
    }
  };

  const populateChildFiles = async () => {
    let response = await axios.get(`${BASE_URL}/enrollment/child/get-child-files/${paramsChildId}/${paramsParentId}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    });

    if(response.status === 200 && response.data.status === "success") {
      let { childFiles } = response.data;
      setSupportFormDetails(...childFiles.filter(f => f.category === "physical-impairment"));
    } else {
      console.log('NO CHILD FILES ATTACHED FOR THIS FORM');
    }
  }


  // GIVING CONSENT FOR CHANGE
  const giveConsentForChanges = async () => {
    const response = await axios.patch(`${BASE_URL}/enrollment/parent-consent/${paramsParentId}`, { childId: paramsChildId }, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    });

    if(response.status === 201 && response.data.status === "success") {
      console.log('Consent given successfully!');
      setShowConsentCommentDialog(false);
    }
  }

  const handleChildFileDelete = async (fileId) => {
    console.log('Delete file:', fileId)
    const response = await axios.delete(`${BASE_URL}/enrollment/child/file-delete/${fileId}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    });

    if(response.status === 201 && response.data.status === 'success') {
      setSupportFormDeleteMessage("Support form deleted successfully.");
    }
  }

  // UPLOADING SUPPORT FORM
  const uploadSupportForm = async () => {
    let data = new FormData();
    data.append('images', inclusionSupportForm[0]);
    data.append('category', 'physical-impairment');

    let response = await axios.patch(`${BASE_URL}/enrollment/child/file-upload/${paramsChildId}/${paramsParentId}`, data, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    });

    console.log('FILE UPLOAD RESPONSE:', response);
    if(response.status === 201 && response.data.status === 'success') {
      console.log('INSIDE RESPONSE');
      let { supportForm } = response.data;
      setInclusionSupportForm(null);
      setSupportFormDetails(supportForm);
    }
  }

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

  useEffect(() => {
    if(formOneParentData?.address_similar_to_child === true) {
      setFormOneParentData(prevState => ({
        ...prevState,
        address_as_per_child: formOneChildData?.home_address
      }));
    }
  }, [formOneParentData?.address_similar_to_child])

  useEffect(() => {
    if(localStorage.getItem('has_given_consent') === 'null') {
      setShowConsentCommentDialog(true);
    }
  }, [])

  useEffect(() => {
    if(inclusionSupportForm) {
      uploadSupportForm();
    }
  }, [inclusionSupportForm]);

  useEffect(() => {
    if(supportFormDeleteMessage) {
      setSupportFormDetails(null);
      setTimeout(() => {
        setSupportFormDeleteMessage(null);
      }, 3000); 
    }

  }, [supportFormDeleteMessage]);

  useEffect(() => {
    setChildFormErrors(prevState => ({
      ...prevState,
      supportForm: null
    }));
  }, [supportFormDetails])
  // useEffect(() => {
  //   if(childFormErrors) {
  //     let refName = Object.keys(childFormErrors)[0];
      
  //     if(childFormErrors[`${refName}`] !== null)
  //       focusOnChildErrors(refName);
  //   }
  // }, [childFormErrors]);

  // useEffect(() => {
    
  //   if((childFormErrors === null || Object.keys(childFormErrors).length === 0) && parentFormErrors !== null) {
  //     console.log('CHILD ERROR OBJECT EMPTY')
  //     let refName = Object.keys(parentFormErrors)[0];
      
  //     if(parentFormErrors[`${refName}`] !== null)
  //       focusOnParentErrors(refName);
  //   }
  // }, [parentFormErrors])

  childFormErrors && console.log('CHILD FOR ERRORS:', childFormErrors);
  inclusionSupportForm && console.log('SUPPORT FORM:', inclusionSupportForm);
  return (
    <>
    {
        supportFormDeleteMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{supportFormDeleteMessage}</p>
      }
      <div className="enrollment-form-sec error-sec my-5">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <div className="grayback">
              <h2 className="title-xs mb-2">Information about the child</h2>
              <p className="form_info mb-4">A parent or guardian who has a lawful authority in relation to the child must complete this form. Licensed children’s services may use this form to collect the child’s enrolment information as required in the Children’s Service’s Regulations 2017 and education and care services national law act 2010. Based on these regulations, parents are not required to fill questions marked with an asterisk, however, it will be highly important for the service to have those details.</p>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Child's First Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullname"
                      ref={fullname}
                      // style={childFormErrors?.fullname ? { border: "1px solid tomato", backgroundColor: "#FF634750" } : {}}
                      maxLength={50}
                      value={formOneChildData?.fullname || ""}
                      onChange={(e) => {
                        setFormOneChildData(prevState => ({
                          ...prevState,
                          fullname: e.target.value
                        })); 
                      }}
                      onBlur={(e) => {
                        if(!formOneChildData.log.includes("fullname")) {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            log: [...formOneChildData.log, "fullname"]
                          }));
                        }
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          fullname: null,
                        }))
                      }} />
                    { childFormErrors?.fullname !== null && <span className="error">{childFormErrors?.fullname}</span> }
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Child's Family Name *</Form.Label>
                    <Form.Control
                      type="text"
                      ref={family_name}
                      // style={childFormErrors?.family_name ? { border: "1px solid tomato", backgroundColor: "#FF634750" } : {}}
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
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          family_name: null,
                        })) 
                      }} />
                    { childFormErrors?.family_name !== null && <span className="error">{childFormErrors?.family_name}</span> }
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Nickname</Form.Label>
                    <Form.Control
                      type="text"
                      minLenth={3}
                      maxLength={50}
                      ref={usually_called}
                      name="usually_called"
                      value={formOneChildData?.usually_called || ""}
                      onChange={(e) => {
                        // if(isNaN(e.target.value.charAt(e.target.value.length - 1)) === true) {
                        setFormOneChildData(prevState => ({
                          ...prevState,
                          usually_called: e.target.value
                        }));
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          usually_called: null,
                        })) 
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
                      { childFormErrors?.usually_called !== null && <span className="error">{childFormErrors?.usually_called}</span> }
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Date Of Birth *</Form.Label>
                    <Form.Control
                      type="date"
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
                      ref={home_address}
                      name="home_address"
                      value={formOneChildData?.home_address || ""}
                      onChange={(e) => {
                        handleChildData(e);
                      }}
                      onBlur={(e) => {
                        if(!formOneChildData.log.includes("home_address")) {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            log: [...formOneChildData.log, "home_address"]
                          }));
                        }
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          home_address: null
                        }))
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
                      // style={childFormErrors?.language ? { border: "1px solid tomato", backgroundColor: "#FF634750" } : {}} 
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
                    
                    {
                      formOneChildData?.developmental_delay &&
                      <>
                        <Form.Group className="col-md-6 mb-3 mt-3">
                          <Form.Label>Upload Support Form</Form.Label>
                          <DragDropMultiple 
                            module="child-enrollment"
                            fileLimit={1}
                            supportFormDetails={supportFormDetails}
                            onSave={setInclusionSupportForm} />
                          <small className="fileinput">(Upload 1 file)</small>
                        </Form.Group>
                        { childFormErrors?.supportForm !== null && <span className="error">{childFormErrors?.supportForm}</span> }
                        {
                          supportFormDetails &&
                          (
                            <div>
                              <a href={supportFormDetails?.file}><p>{supportFormDetails?.fileName || supportFormDetails?.originalName}</p></a>
                              <img
                                onClick={() => handleChildFileDelete(supportFormDetails?.id)}
                                // className="file-remove"
                                style={{ width: "25px", height: "auto", cursor: "pointer" }}
                                src="https://cdn4.iconfinder.com/data/icons/linecon/512/delete-512.png"
                                alt="" />
                            </div>
                          )
                        }
                      </>
                    }
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Child Medicare No. *</Form.Label>
                    <Form.Control
                      type="text"
                      name="child_medical_no"
                      ref={child_medical_no}
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
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          child_medical_no: null,
                        })) 
                      }} />

                      { childFormErrors?.child_medical_no !== null && <span className="error">{childFormErrors?.child_medical_no}</span> }
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Child CRN *</Form.Label>
                    <Form.Control
                      type="text"
                      name="child_crn"
                      ref={child_crn}
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
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          child_crn: null,
                        })) 
                      }} />

                      { childFormErrors?.child_crn !== null && <span className="error">{childFormErrors?.child_crn}</span> }
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Parents CRN 1 *</Form.Label>
                    <Form.Control
                      type="text"
                      name="parent_crn_1"
                      REF={parent_crn_1}
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
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          parent_crn_1: null,
                        })) 
                      }} />

                      { childFormErrors?.parent_crn_1 !== null && <span className="error">{childFormErrors?.parent_crn_1}</span> }
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Parents CRN 2 *</Form.Label>
                    <Form.Control
                      type="text"
                      name="parent_crn_2"
                      ref={parent_crn_2}
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
                        setChildFormErrors(prevState => ({
                          ...prevState,
                          parent_crn_2: null,
                        })) 
                      }} />

                      { childFormErrors?.parent_crn_2 !== null && <span className="error">{childFormErrors?.parent_crn_2}</span> }
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Is the child using another service?</Form.Label>
                    <div className="btn-radio inline-col">
                      <Form.Check
                        type="radio"
                        name="another_service"
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
                      If you answered YES please specify name, day and hours at other service.
                    </Form.Text>
                  </Form.Group>
                </Col>
                {
                  formOneChildData.another_service &&
                  <>
                    <Form.Group className="mb-3 relative">
                      <Form.Label>Name of the Service</Form.Label>
                      <Form.Control
                        type="text"
                        minLenth={3}
                        maxLength={50}
                        name="name_of_the_service"
                        value={formOneChildData?.name_of_the_service || ""}
                        onChange={(e) => {
                          setFormOneChildData(prevState => ({
                            ...prevState,
                            name_of_the_service: e.target.value
                          })); 
                        }} />
                    </Form.Group>

                    <Form.Group className="mb-3 relative">
                      <Form.Label>Day & Hours at the Service</Form.Label>
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
                      
                      <Col xl={3} lg={4} md={6}>
                        <Form.Group className="mb-3 relative">
                          <Form.Label>Saturday</Form.Label>
                          <Form.Control type="number" />
                        </Form.Group>
                      </Col>

                      <Col xl={3} lg={4} md={6}>
                        <Form.Group className="mb-3 relative">
                          <Form.Label>Sunday</Form.Label>
                          <Form.Control type="number" />
                        </Form.Group>
                      </Col>
                    </Form.Group>
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
                <h2 className="title-xs">Information about the child's parents or guardians</h2>
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
                            name="parent_family_name"
                            minLenth={3}
                            ref={parent_family_name}
                            maxLength={50}
                            value={formOneParentData.parent_family_name ||  ""}
                            onChange={(e) => {
                              // if(isNaN(e.target.value.charAt(e.target.value.length - 1)) === true) {
                              setFormOneParentData(prevState => ({
                                ...prevState,
                                parent_family_name: e.target.value
                              }));
                              setParentFormErrors(prevState => ({
                                ...prevState,
                                parent_family_name: null,
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
                          { parentFormErrors?.parent_family_name !== null && <span className="error">{parentFormErrors?.parent_family_name}</span> }
                        </Form.Group>
                        
                        <Form.Group className="mb-3 relative">
                          <Form.Label>Last Name *</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="given_name"
                            ref={given_name}
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
                          <div className="btn-checkbox">
                            <Form.Check
                              type="checkbox"
                              id="update"
                              checked={formOneParentData?.address_similar_to_child}
                              label="Address as per child"
                              onChange={(e) => {
                                setFormOneParentData(prevState => ({
                                  ...prevState,
                                  address_similar_to_child: !formOneParentData?.address_similar_to_child,
                                }))
                              }} />
                          </div>
                          <Form.Control 
                            as="textarea" 
                            rows={3} 
                            name="address_as_per_child"
                            disabled={formOneParentData?.address_similar_to_child === true}
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
                            // style={parentFormErrors?.telephone ? { border: "1px solid tomato", backgroundColor: "#FF634750" } : {}}
                            autoFocus={parentFormErrors?.telephone ? true : false}
                            name="telephone"
                            maxLength={20}
                            ref={telephone}
                            value={formOneParentData?.telephone || ""}
                            onChange={(e) => {
                              handleParentData(e);
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
                            value={formOneParentData?.email || ""}
                            name="email"
                            ref={email}
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
                            ref={place_of_birth}
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
                            ref={ethnicity}
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
                            ref={primary_language}
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
                            ref={occupation}
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
          <Button variant="primary" type="submit">
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
                onClick={() => giveConsentForChanges()}>Ok</button>
            </Modal.Footer>
        </Modal>
      }
    </>
  );
};

export default ChildEnrollment1;

