import React, { useState } from "react";
import { Button, Col, Row, Table, Form } from "react-bootstrap";
import { BASE_URL } from "../../components/App";
import axios from 'axios';
import { personValidation, personValidation2 } from "../../helpers/validation";
import { useEffect } from "react";

let nextstep = 5;
let step = 4;
let fields = ["name", "telephone", "address", "relationship_to_the_child"];


const ChildEnrollment4 = ({ nextStep, handleFormData, prevStep }) => {
  console.log('FORM NUMBER:=>>>>>>>>>>>>>>>>>>>>', 4);
  // REQUIRED STATES
  const [emergencyContactData, setEmergencyContactData] = useState({
    name: "",
    address: "",
    telephone: "",
    relationship_to_the_child: "",
    log: []
  });
  const [emergencyContactData2, setEmergencyContactData2] = useState({
    name: "",
    address: "",
    telephone: "",
    relationship_to_the_child: "",
    log: []
  });

  const [authorizedNomineeData, setAuthorizedNomineeData] = useState({
    name: "",
    address: "",
    telephone: "",
    relationship_to_the_child: "",
    log: []
  });
  const [authorizedNomineeData2, setAuthorizedNomineeData2] = useState({
    name: "",
    address: "",
    telephone: "",
    relationship_to_the_child: "",
    log: []
  });
  
  const [authorizedPersonData, setAuthorizedPersonData] = useState({
    name: "",
    address: "",
    telephone: "",
    relationship_to_the_child: "",
    log: []
  });
  const [authorizedPersonData2, setAuthorizedPersonData2] = useState({
    name: "",
    address: "",
    telephone: "",
    relationship_to_the_child: "",
    log: []
  });
  
  const [otherAuthorizedPersonData, setOtherAuthorizedPersonData] = useState({
    name: "",
    address: "",
    telephone: "",
    relationship_to_the_child: "",
    log: []
  });
  const [otherAuthorizedPersonData2, setOtherAuthorizedPersonData2] = useState({
    name: "",
    address: "",
    telephone: "",
    relationship_to_the_child: "",
    log: []
  });
  const [formStepData, setFormStepData] = useState(null);
  const [idList, setIdList] = useState({
    emergency_contact_id: null,
    authorized_nominee_id: null,
    auuhtorized_person_id: null,
    other_authorized_person_id: null,
  });

  // ERROR HANDLING STATES
  const [emergencyContactError, setEmergencyContactError] = useState(null);
  const [authorizedNomineeError, setAuthorizedNomineeError] = useState(null);
  const [authorizedPersonError, setAuthorizedPersonError] = useState(null);
  const [otherAuthorizedPersonError, setOtherAuthorizedPersonError] = useState(null);

  const [emergencyContactError2, setEmergencyContactError2] = useState(null);
  const [authorizedNomineeError2, setAuthorizedNomineeError2] = useState(null);
  const [authorizedPersonError2, setAuthorizedPersonError2] = useState(null);
  const [otherAuthorizedPersonError2, setOtherAuthorizedPersonError2] = useState(null);
  const [loader, setLoader] = useState(false);

  // FORM AHNDLING FUNCTIONS
  const handleEmergencyContact = (event) => {
    let { name, value } = event.target;
    setEmergencyContactData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleEmergencyContact2 = (event) => {
    let { name, value } = event.target;
    setEmergencyContactData2(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleAuthorizedNominee = (event) => {
    let { name, value } = event.target;
    setAuthorizedNomineeData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleAuthorizedNominee2 = (event) => {
    let { name, value } = event.target;
    setAuthorizedNomineeData2(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleAuthorizedPerson = (event) => {
    let { name, value } = event.target;
    setAuthorizedPersonData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleAuthorizedPerson2 = (event) => {
    let { name, value } = event.target;
    setAuthorizedPersonData2(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleOtherAuthorizedPerson = (event) => {
    let { name, value } = event.target;
    setOtherAuthorizedPersonData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }
  const handleOtherAuthorizedPerson2 = (event) => {
    let { name, value } = event.target;
    setOtherAuthorizedPersonData2(prevState => ({
      ...prevState,
      [name]: value
    }));
  }


  // UPDATING THE FORM FOUR DATA
  const updateFormFourData = async () => {
    setLoader(true);
    try {
      let token = localStorage.getItem('token');
      let response = await axios.patch(`${BASE_URL}/enrollment/emergency-contact/${idList.emergency_contact_id}`, {...emergencyContactData}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if(response.status === 201 && response.data.status === "success") {
        response = await axios.patch(`${BASE_URL}/enrollment/authorized-nominee/${idList.authorized_nominee_id}`, {...authorizedNomineeData}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if(response.status === 201 && response.data.status === "success") {
          response = await axios.patch(`${BASE_URL}/enrollment/authorized-person/${idList.auuhtorized_person_id}`, {...authorizedPersonData}, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
  
          if(response.status === 201 && response.data.status === "success") {
            response = await axios.patch(`${BASE_URL}/enrollment/other-authorized-person/${idList.other_authorized_person_id}`, {...otherAuthorizedPersonData}, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
    
            if(response.status === 201 && response.data.status === "success") {
              let changeCount = localStorage.getItem('change_count');

              if(emergencyContactData.log.length > 0)
                changeCount++;

              if(authorizedNomineeData.log.length > 0)
                changeCount++;
              
              if(authorizedPersonData.log.length > 0)
                changeCount++;

              if(otherAuthorizedPersonData.log.length > 0)
                changeCount++;
              
              localStorage.setItem('change_count', changeCount);
              setLoader(false);
              nextStep();
            }
          }
        }
      }
    } catch(error) {
      console.log(`ERROR: ${error.message}`);
    }
  }

  // SAVING THE FORM FOUR DATA
  const submitFormData = (e) => {
    e.preventDefault();
    let emergencyContactErrorObj = personValidation(emergencyContactData);
    let authorizedNomineeErrorObj = personValidation(authorizedNomineeData);
    let authorizedPersonErrorObj = personValidation(authorizedPersonData);
    let otherAuthorizedPersonErrorObj = personValidation(otherAuthorizedPersonData);

    let emergencyContactErrorObj2 = personValidation2(emergencyContactData2);
    let authorizedNomineeErrorObj2 = personValidation2(authorizedNomineeData2);
    let authorizedPersonErrorObj2 = personValidation2(authorizedPersonData2);
    let otherAuthorizedPersonErrorObj2 = personValidation2(otherAuthorizedPersonData2);

    if(Object.keys(emergencyContactErrorObj).length > 0 ||
       Object.keys(authorizedNomineeErrorObj).length > 0 ||
       Object.keys(authorizedPersonErrorObj).length > 0 ||
       Object.keys(otherAuthorizedPersonErrorObj).length > 0 ||
       Object.keys(emergencyContactErrorObj2).length > 0 ||
       Object.keys(authorizedNomineeErrorObj2).length > 0 ||
       Object.keys(authorizedPersonErrorObj2).length > 0 ||
       Object.keys(otherAuthorizedPersonErrorObj2).length > 0) {
        window.scrollTo(0, 0);
        setEmergencyContactError(emergencyContactErrorObj);
        setAuthorizedNomineeError(authorizedNomineeErrorObj);
        setAuthorizedPersonError(authorizedPersonErrorObj);
        setOtherAuthorizedPersonError(otherAuthorizedPersonErrorObj);
        setEmergencyContactError2(emergencyContactErrorObj2);
        setAuthorizedNomineeError2(authorizedNomineeErrorObj2);
        setAuthorizedPersonError2(authorizedPersonErrorObj2);
        setOtherAuthorizedPersonError2(otherAuthorizedPersonErrorObj2);
    } else {

      if(formStepData >= step) {
        // console.log('UPDATING THE EXISTING DATA!');
        updateFormFourData();
      } else {
        // console.log('CREATING NEW DATA!');
        saveFormFourData();
      }
    }
    // nextStep();
  };

  const saveFormFourData = async () => {
    setLoader(true);
    try {
      let childId = localStorage.getItem('enrolled_child_id');
      let token = localStorage.getItem('token');
      // SAVING EMERGENCY CONTACT
      let response = await axios.post(`${BASE_URL}/enrollment/emergency-contact`, {...emergencyContactData, childId}, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if(response.status === 201 && response.data.status === "success") {
        // SAVING AUTHORIZED NOMINEE
        response = await axios.post(`${BASE_URL}/enrollment/authorized-nominee`, {...authorizedNomineeData, childId}, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if(response.status === 201 && response.data.status === "success") {
          // SAVING AUTHORIZED PERSON
          response = await axios.post(`${BASE_URL}/enrollment/authorized-person`, {...authorizedPersonData, childId}, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })

          if(response.status === 201 && response.data.status === "success") {
           // SAVING OTHER AUTHORIZED PERSON
            response = await axios.post(`${BASE_URL}/enrollment/other-authorized-person`, {...otherAuthorizedPersonData, childId}, {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            });

            if(response.status === 201 && response.data.status === "success") {
              
              // UPDATING THE STEP VALUE INSIDE CHILD TABLE
              response = await axios.patch(`${BASE_URL}/enrollment/child/${childId}`, {form_step: nextstep}, {
                headers: {
                  "Authorization": `Bearer ${token}`
                }
              });

              if(response.status === 201 && response.data.status === "success") {
                setLoader(false);
                nextStep();
              }
            }
          }
        }
      }
    } catch(error) {

    }
  }

  // FETCHING ENROLLMENT DATA AND AUTO-POPULATING THE FIELDS
  const fetchChildDataAndPopulate = async () => {
    let enrolledChildId = localStorage.getItem('enrolled_child_id');
    let token = localStorage.getItem('token');

    let response = await axios.get(`${BASE_URL}/enrollment/child/${enrolledChildId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    console.log('RESPONSE:', response);

    if(response.status === 200 && response.data.status === 'success') {
      let { child } = response.data;
      // localStorage.setItem('enrolled_parent_id', child.parents[0].id);
      // console.log('CHILD DATA:', child);

      if(child.form_step > step) {
        
        // POPULATING EMERGENCY CONTACT DATA
        setEmergencyContactData(prevState => ({
          ...prevState,
          name: child.emergency_contacts[0].name,
          address: child.emergency_contacts[0].address,
          telephone: child.emergency_contacts[0].telephone,
          relationship_to_the_child: child.emergency_contacts[0].relationship_to_the_child
        }));
        setIdList(prevState => ({
          ...prevState,
          emergency_contact_id: child.emergency_contacts[0].id
        }));

        // POPULATING AUTHORIZED NOMINEE DATA
        setAuthorizedNomineeData(prevState => ({
          ...prevState,
          name: child.authorized_nominees[0].name,
          address: child.authorized_nominees[0].address,
          telephone: child.authorized_nominees[0].telephone,
          relationship_to_the_child: child.authorized_nominees[0].relationship_to_the_child
        }));
        setIdList(prevState => ({
          ...prevState,
          authorized_nominee_id: child.authorized_nominees[0].id
        }));

        // POPULATING AUTHORIZED PERSON DATA
        setAuthorizedPersonData(prevState => ({
          ...prevState,
          name: child.authorized_people[0].name,
          address: child.authorized_people[0].address,
          telephone: child.authorized_people[0].telephone,
          relationship_to_the_child: child.authorized_people[0].relationship_to_the_child
        }));
        setIdList(prevState => ({
          ...prevState,
          auuhtorized_person_id: child.authorized_people[0].id
        }));

        // POPULATING OTHER AUTHORIZED PERSON DATA
         setOtherAuthorizedPersonData(prevState => ({
          ...prevState,
          name: child.other_authorized_people[0].name,
          address: child.other_authorized_people[0].address,
          telephone: child.other_authorized_people[0].telephone,
          relationship_to_the_child: child.other_authorized_people[0].relationship_to_the_child
        }));
        setIdList(prevState => ({
          ...prevState,
          other_authorized_person_id: child.other_authorized_people[0].id
        }));
        
        setFormStepData(child.form_step);
      } 

    }
  };


  useEffect(() => {
    console.log('FETCHING CHILD DATA AND POPULATE!');
    window.scrollTo(0, 0);
    fetchChildDataAndPopulate();
  }, [localStorage.getItem('enrolled_child_id') !== null]);

  emergencyContactData2 && console.log('EMERGENCY CONTACT:', emergencyContactData2);
  authorizedNomineeData2 && console.log('AUTHORIZED NOMINEE:', authorizedNomineeData2);
  authorizedPersonData2 && console.log('AUTHORIZED PERSON:', authorizedPersonData2);
  otherAuthorizedPersonData2 && console.log('OTHER AUTHORIZED PERSON:', otherAuthorizedPersonData2);

  return (
    <>
      <div className="enrollment-form-sec error-sec">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <h2 className="title-xs mb-4">Emergency Contact: R160 (3) (b) (ii)</h2>

            <div className="grayback">
              <p>(This person is to be notified of an emergency involving the child if any parents of the child cannot be immediately contacted).</p>
              <Row>
                <Col md={6}>
                  <h2 className="title-xs">Contact: 1</h2>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Name *</Form.Label>
                    <Form.Control
                      name="name" 
                      type="text"
                      value={emergencyContactData?.name || ""}
                      onChange={(e) => {
                        handleEmergencyContact(e);
                        setEmergencyContactError(prevState => ({
                          ...prevState,
                          name: null
                        }));
                      }}
                      
                      onBlur={(e) => {
                        if(!emergencyContactData.log.includes("name")) {
                          setEmergencyContactData(prevState => ({
                            ...prevState,
                            log: [...emergencyContactData.log, "name"]
                          }));
                        }
                      }} />
                    { emergencyContactError?.name !== null && <span className="error">{emergencyContactError?.name}</span> }
                  </Form.Group>

                  <Form.Group className="mb-3 relative">
                    <Form.Label>Address *</Form.Label>
                    <Form.Control
                      name="address" 
                      as="textarea" 
                      value={emergencyContactData?.address || ""}
                      rows={3}
                      onChange={(e) => {
                        handleEmergencyContact(e);
                        setEmergencyContactError(prevState => ({
                          ...prevState,
                          address: null
                        }));
                      }}

                      onBlur={(e) => {
                        if(!emergencyContactData.log.includes("address")) {
                          setEmergencyContactData(prevState => ({
                            ...prevState,
                            log: [...emergencyContactData.log, "address"]
                          }));
                        }
                      }} />
                    { emergencyContactError?.address !== null && <span className="error">{emergencyContactError?.address}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Telephone *</Form.Label>
                    <Form.Control 
                      name="telephone"
                      maxLength={10}
                      value={emergencyContactData?.telephone || ""}
                      type="tel"
                      onChange={(e) => {
                        setEmergencyContactData(prevState => ({
                          ...prevState,
                          telephone: e.target.value
                        }));

                        setEmergencyContactError(prevState => ({
                          ...prevState,
                          telephone: null
                        }));
                      }}

                      onBlur={(e) => {
                        if(!emergencyContactData.log.includes("telephone")) {
                          setEmergencyContactData(prevState => ({
                            ...prevState,
                            log: [...emergencyContactData.log, "telephone"]
                          }));
                        }
                      }} />
                    { emergencyContactError?.telephone !== null && <span className="error">{emergencyContactError?.telephone}</span> }
                  </Form.Group>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Relationship To The Child *</Form.Label>
                    <Form.Control
                      name="relationship_to_the_child" 
                      type="text"
                      value={emergencyContactData?.relationship_to_the_child || ""}
                      onChange={(e) => {
                        handleEmergencyContact(e);
                        setEmergencyContactError(prevState => ({
                          ...prevState,
                          relationship_to_the_child: null
                        }));
                      }}

                      onBlur={(e) => {
                        if(!emergencyContactData.log.includes("relationship_to_the_child")) {
                          setEmergencyContactData(prevState => ({
                            ...prevState,
                            log: [...emergencyContactData.log, "relationship_to_the_child"]
                          }));
                        }
                      }} />
                    { emergencyContactError?.relationship_to_the_child !== null && <span className="error">{emergencyContactError?.relationship_to_the_child}</span> }
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <h2 className="title-xs">Contact: 2</h2>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" />
                    { emergencyContactError?.temp !== null && <span className="error">{emergencyContactError?.temp}</span> }
                  </Form.Group>

                  <Form.Group className="mb-3 relative">
                    <Form.Label>Address</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                    { emergencyContactError?.temp !== null && <span className="error">{emergencyContactError?.temp}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control 
                      type="tel"
                      maxLength={10}
                      name="telephone"
                      onChange={(e) => {
                        handleEmergencyContact2(e)
                      }} />
                    { emergencyContactError2?.telephone !== null && <span className="error">{emergencyContactError2?.telephone}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Relationship To The Child</Form.Label>
                    <Form.Control type="text" />
                    { emergencyContactError?.temp !== null && <span className="error">{emergencyContactError?.temp}</span> }
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <h3 className="title-xs mt-4 mb-4">Authorized nominee: R160 (3) (b) (iii)</h3>

            <div className="grayback">
              <p>(A person who has been given permission by a parents or family member to collect the child from Family Day Care).</p>
              <Row>
                <Col md={6}>
                  <h2 className="title-xs">Contact: 1</h2>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Name *</Form.Label>
                    <Form.Control
                      name="name" 
                      type="text"
                      value={authorizedNomineeData?.name || ""}
                      onChange={(e) => {
                        handleAuthorizedNominee(e);
                        setAuthorizedNomineeError(prevState => ({
                          ...prevState,
                          name: null
                        }));
                      }}

                      onBlur={(e) => {
                        if(!authorizedNomineeData.log.includes("name")) {
                          setAuthorizedNomineeData(prevState => ({
                            ...prevState,
                            log: [...authorizedNomineeData.log, "name"]
                          }));
                        }
                      }} />
                      { authorizedNomineeError?.name !== null && <span className="error">{authorizedNomineeError?.name}</span> }
                  </Form.Group>

                  <Form.Group className="mb-3 relative">
                    <Form.Label>Address *</Form.Label>
                    <Form.Control
                      name="address" 
                      as="textarea" 
                      value={authorizedNomineeData?.address || ""}
                      rows={3}
                      onChange={(e) => {
                        handleAuthorizedNominee(e);
                        setAuthorizedNomineeError(prevState => ({
                          ...prevState,
                          address: null
                        }));
                      }}

                      onBlur={(e) => {
                        if(!authorizedNomineeData.log.includes("address")) {
                          setAuthorizedNomineeData(prevState => ({
                            ...prevState,
                            log: [...authorizedNomineeData.log, "address"]
                          }));
                        }
                      }} />
                      { authorizedNomineeError?.address !== null && <span className="error">{authorizedNomineeError?.address}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Telephone *</Form.Label>
                    <Form.Control 
                      name="telephone"
                      type="tel"
                      maxLength={10}
                      value={authorizedNomineeData?.telephone || ""}
                      onChange={(e) => {
                        setAuthorizedNomineeData(prevState => ({
                          ...prevState,
                          telephone: e.target.value
                        }));

                        setAuthorizedNomineeError(prevState => ({
                          ...prevState,
                          telephone: null
                        }));
                      }}

                      onBlur={(e) => {
                        if(!authorizedNomineeData.log.includes("telephone")) {
                          setAuthorizedNomineeData(prevState => ({
                            ...prevState,
                            log: [...authorizedNomineeData.log, "telephone"]
                          }));
                        }
                      }} />
                      { authorizedNomineeError?.telephone !== null && <span className="error">{authorizedNomineeError?.telephone}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Relationship To The Child *</Form.Label>
                    <Form.Control
                      name="relationship_to_the_child" 
                      type="text"
                      value={authorizedNomineeData?.relationship_to_the_child || ""}
                      onChange={(e) => {
                        handleAuthorizedNominee(e);
                        setAuthorizedNomineeError(prevState => ({
                          ...prevState,
                          relationship_to_the_child: null
                        }));
                      }}

                      onBlur={(e) => {
                        if(!authorizedNomineeData.log.includes("relationship_to_the_child")) {
                          setAuthorizedNomineeData(prevState => ({
                            ...prevState,
                            log: [...authorizedNomineeData.log, "relationship_to_the_child"]
                          }));
                        }
                      }} />
                      { authorizedNomineeError?.relationship_to_the_child !== null && <span className="error">{authorizedNomineeError?.relationship_to_the_child}</span> }
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <h2 className="title-xs">Contact: 2</h2>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" />
                    { emergencyContactError?.temp !== null && <span className="error">{emergencyContactError?.temp}</span> }
                  </Form.Group>

                  <Form.Group className="mb-3 relative">
                    <Form.Label>Address</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                    { emergencyContactError?.temp !== null && <span className="error">{emergencyContactError?.temp}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control 
                      type="tel"
                      maxLength={10}
                      name="telephone"
                      onChange={(e) => {
                        handleAuthorizedNominee2(e)
                      }} />
                    { authorizedNomineeError2?.telephone !== null && <span className="error">{authorizedNomineeError2?.telephone}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Relationship To The Child</Form.Label>
                    <Form.Control type="text" />
                    { emergencyContactError?.temp !== null && <span className="error">{emergencyContactError?.temp}</span> }
                  </Form.Group>
                </Col>
              </Row>
            </div>

          </div>
          <div className="enrollment-form-column">
            <h2 className="title-xs mb-4 mt-4">Authorized person: R 160 (3) (b) (iv)</h2>

            <div className="grayback">
              <p>(A person who is authorized to consent to medical treatment of the child or to authorize the administration of medication to the child).</p>
              <Row>
                <Col md={6}>
                  <h2 className="title-xs">Contact: 1</h2>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Name *</Form.Label>
                    <Form.Control
                      name="name" 
                      type="text"
                      value={authorizedPersonData?.name || ""}
                      onChange={(e) => {
                        handleAuthorizedPerson(e);
                        setAuthorizedPersonError(prevState => ({
                          ...prevState,
                          name: null
                        }));
                      }}

                      onBlur={(e) => {
                        if(!authorizedPersonData.log.includes("name")) {
                          setAuthorizedPersonData(prevState => ({
                            ...prevState,
                            log: [...authorizedPersonData.log, "name"]
                          }));
                        }
                      }} />
                      { authorizedPersonError?.name !== null && <span className="error">{authorizedPersonError?.name}</span> }
                  </Form.Group>

                  <Form.Group className="mb-3 relative">
                    <Form.Label>Address *</Form.Label>
                    <Form.Control
                      name="address" 
                      as="textarea" 
                      value={authorizedPersonData?.address || ""}
                      rows={3}
                      onChange={(e) => {
                        handleAuthorizedPerson(e);
                        setAuthorizedPersonError(prevState => ({
                          ...prevState,
                          address: null
                        }));
                      }}

                      onBlur={(e) => {
                        if(!authorizedPersonData.log.includes("address")) {
                          setAuthorizedPersonData(prevState => ({
                            ...prevState,
                            log: [...authorizedPersonData.log, "address"]
                          }));
                        }
                      }} />
                      { authorizedPersonError?.address !== null && <span className="error">{authorizedPersonError?.address}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Telephone *</Form.Label>
                    <Form.Control 
                      name="telephone"
                      value={authorizedPersonData?.telephone || ""}
                      type="tel"
                      maxLength={10}
                      onChange={(e) => {
                        setAuthorizedPersonData(prevState => ({
                          ...prevState,
                          telephone: e.target.value
                        }));

                        setAuthorizedPersonError(prevState => ({
                          ...prevState,
                          telephone: null
                        }));
                      }}

                      onBlur={(e) => {
                        if(!authorizedPersonData.log.includes("telephone")) {
                          setAuthorizedPersonData(prevState => ({
                            ...prevState,
                            log: [...authorizedPersonData.log, "telephone"]
                          }));
                        }
                      }} />
                      { authorizedPersonError?.telephone !== null && <span className="error">{authorizedPersonError?.telephone}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Relationship To The Child *</Form.Label>
                    <Form.Control
                      name="relationship_to_the_child" 
                      type="text"
                      value={authorizedPersonData?.relationship_to_the_child || ""}
                      onChange={(e) => {
                        handleAuthorizedPerson(e);
                        setAuthorizedPersonError(prevState => ({
                          ...prevState,
                          relationship_to_the_child: null
                        }));
                      }}

                      onBlur={(e) => {
                        if(!authorizedPersonData.log.includes("relationship_to_the_child")) {
                          setAuthorizedPersonData(prevState => ({
                            ...prevState,
                            log: [...authorizedPersonData.log, "relationship_to_the_child"]
                          }));
                        }
                      }} />
                      { authorizedPersonError?.relationship_to_the_child !== null && <span className="error">{authorizedPersonError?.relationship_to_the_child}</span> }
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <h2 className="title-xs">Contact: 2</h2>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" />
                    { emergencyContactError?.temp !== null && <span className="error">{emergencyContactError?.temp}</span> }
                  </Form.Group>

                  <Form.Group className="mb-3 relative">
                    <Form.Label>Address</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                    { emergencyContactError?.temp !== null && <span className="error">{emergencyContactError?.temp}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control 
                      type="tel"
                      maxLength={10}
                      name="telephone"
                      onChange={(e) => {
                        handleAuthorizedPerson2(e)
                      }} />
                    { authorizedPersonError2?.telephone !== null && <span className="error">{authorizedPersonError2?.telephone}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Relationship To The Child</Form.Label>
                    <Form.Control type="text" />
                    { emergencyContactError?.temp !== null && <span className="error">{emergencyContactError?.temp}</span> }
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <h3 className="title-xs mt-4 mb-4">Other authorized person: R 160 (3) (b) (v)</h3>

            <div className="grayback">
              <p>(A person who is authorized to authorize an educator to take the child outside the education and care service premises).</p>
              <Row>
                <Col md={6}>
                  <h2 className="title-xs">Contact: 1</h2>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Name *</Form.Label>
                    <Form.Control
                      name="name" 
                      type="text"
                      value={otherAuthorizedPersonData?.name || ""}
                      onChange={(e) => {
                        handleOtherAuthorizedPerson(e);
                        setOtherAuthorizedPersonError(prevState => ({
                          ...prevState,
                          name: null
                        }));
                      }}

                      onBlur={(e) => {
                        if(!otherAuthorizedPersonData.log.includes("name")) {
                          setOtherAuthorizedPersonData(prevState => ({
                            ...prevState,
                            log: [...otherAuthorizedPersonData.log, "name"]
                          }));
                        }
                      }} />
                      { otherAuthorizedPersonError?.name !== null && <span className="error">{otherAuthorizedPersonError?.name}</span> }
                  </Form.Group>

                  <Form.Group className="mb-3 relative">
                    <Form.Label>Address *</Form.Label>
                    <Form.Control
                      name="address" 
                      as="textarea" 
                      value={otherAuthorizedPersonData?.address || ""}
                      rows={3}
                      onChange={(e) => {
                        handleOtherAuthorizedPerson(e);
                        setOtherAuthorizedPersonError(prevState => ({
                          ...prevState,
                          address: null
                        }));
                      }}

                      onBlur={(e) => {
                        if(!otherAuthorizedPersonData.log.includes("address")) {
                          setOtherAuthorizedPersonData(prevState => ({
                            ...prevState,
                            log: [...otherAuthorizedPersonData.log, "address"]
                          }));
                        }
                      }} />
                      { otherAuthorizedPersonError?.address !== null && <span className="error">{otherAuthorizedPersonError?.address}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Telephone *</Form.Label>
                    <Form.Control 
                      name="telephone"
                      value={otherAuthorizedPersonData?.telephone || ""}
                      type="tel"
                      maxLength={10}
                      onChange={(e) => {
                        setOtherAuthorizedPersonData(prevState => ({
                          ...prevState,
                          telephone: e.target.value
                        }));

                        setOtherAuthorizedPersonError(prevState => ({
                          ...prevState,
                          telephone: null
                        }));
                      }}

                      onBlur={(e) => {
                        if(!otherAuthorizedPersonData.log.includes("telephone")) {
                          setOtherAuthorizedPersonData(prevState => ({
                            ...prevState,
                            log: [...otherAuthorizedPersonData.log, "telephone"]
                          }));
                        }
                      }} />
                      { otherAuthorizedPersonError?.telephone !== null && <span className="error">{otherAuthorizedPersonError?.telephone}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Relationship To The Child *</Form.Label>
                    <Form.Control
                      name="relationship_to_the_child"
                      value={otherAuthorizedPersonData?.relationship_to_the_child || ""} 
                      type="text"
                      onChange={(e) => {
                        handleOtherAuthorizedPerson(e);
                        setOtherAuthorizedPersonError(prevState => ({
                          ...prevState,
                          relationship_to_the_child: null
                        }));
                      }}

                      onBlur={(e) => {
                        if(!otherAuthorizedPersonData.log.includes("relationship_to_the_child")) {
                          setOtherAuthorizedPersonData(prevState => ({
                            ...prevState,
                            log: [...otherAuthorizedPersonData.log, "relationship_to_the_child"]
                          }));
                        }
                      }} />
                      { otherAuthorizedPersonError?.relationship_to_the_child !== null && <span className="error">{otherAuthorizedPersonError?.relationship_to_the_child}</span> }
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <h2 className="title-xs">Contact: 2</h2>
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" />
                    { emergencyContactError?.temp !== null && <span className="error">{emergencyContactError?.temp}</span> }
                  </Form.Group>

                  <Form.Group className="mb-3 relative">
                    <Form.Label>Address</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                    { emergencyContactError?.temp !== null && <span className="error">{emergencyContactError?.temp}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control 
                      type="tel"
                      maxLength={10}
                      name="telephone"
                      onChange={(e) => {
                        handleOtherAuthorizedPerson2(e)
                      }} />
                    { otherAuthorizedPersonError2?.telephone !== null && <span className="error">{otherAuthorizedPersonError2?.telephone}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3 relative">
                    <Form.Label>Relationship To The Child</Form.Label>
                    <Form.Control type="text" />
                    { emergencyContactError?.temp !== null && <span className="error">{emergencyContactError?.temp}</span> }
                  </Form.Group>
                </Col>
              </Row>
            </div>

          </div>
          {/* <div className="cta text-center mt-5 mb-5">
            <Button variant="outline" type="submit" onClick={prevStep} className="me-3">Previous</Button>
            <Button variant="primary" type="submit">Next</Button>
          </div> */}
          <div className="cta text-center mt-5 mb-5">
            <Button variant="outline" type="submit" onClick={() => prevStep()} className="me-3">Go Back</Button>
            <Button 
              variant="primary" 
              type="submit">
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
    </>
  );
};

export default ChildEnrollment4;
