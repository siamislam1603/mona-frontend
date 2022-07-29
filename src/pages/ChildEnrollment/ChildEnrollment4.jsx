import React, { useState } from "react";
import { Button, Col, Row, Table, Form } from "react-bootstrap";
import { BASE_URL } from "../../components/App";
import axios from 'axios';
import { personValidation } from "../../helpers/validation";
import { useEffect } from "react";

let nextstep = 5;
let step = 4;
let fields = ["name", "telephone", "address", "relationship_to_the_child"];
const ChildEnrollment4 = ({ nextStep, handleFormData, prevStep }) => {

  // REQUIRED STATES
  const [emergencyContactData, setEmergencyContactData] = useState({
    name: "",
    address: "",
    telephone: "",
    relationship_to_the_child: ""
  });

  const [authorizedNomineeData, setAuthorizedNomineeData] = useState({
    name: "",
    address: "",
    telephone: "",
    relationship_to_the_child: ""
  });
  
  const [authorizedPersonData, setAuthorizedPersonData] = useState({
    name: "",
    address: "",
    telephone: "",
    relationship_to_the_child: ""
  });
  
  const [otherAuthorizedPersonData, setOtherAuthorizedPersonData] = useState({
    name: "",
    address: "",
    telephone: "",
    relationship_to_the_child: ""
  });
  const [formStepData, setFormStepData] = useState(null);
  const [idList, setIdList] = useState({
    emergency_contact_id: null,
    authorized_nominee_id: null,
    auuhtorized_person_id: null,
    other_authorized_person_id: null
  });

  // ERROR HANDLING STATES
  const [emergencyContactError, setEmergencyContactError] = useState(null);
  const [authorizedNomineeError, setAuthorizedNomineeError] = useState(null);
  const [authorizedPersonError, setAuthorizedPersonError] = useState(null);
  const [otherAuthorizedPersonError, setOtherAuthorizedPersonError] = useState(null);

  // FORM AHNDLING FUNCTIONS
  const handleEmergencyContact = (event) => {
    let { name, value } = event.target;
    setEmergencyContactData(prevState => ({
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

  const handleAuthorizedPerson = (event) => {
    let { name, value } = event.target;
    setAuthorizedPersonData(prevState => ({
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


  // UPDATING THE FORM FOUR DATA
  const updateFormFourData = async () => {
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

    if(Object.keys(emergencyContactErrorObj).length > 0 ||
       Object.keys(authorizedNomineeErrorObj).length > 0 ||
       Object.keys(authorizedPersonErrorObj).length > 0 ||
       Object.keys(otherAuthorizedPersonErrorObj).length > 0) {
        setEmergencyContactError(emergencyContactErrorObj);
        setAuthorizedNomineeError(authorizedNomineeErrorObj);
        setAuthorizedPersonError(authorizedPersonErrorObj);
        setOtherAuthorizedPersonError(otherAuthorizedPersonErrorObj);
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
      localStorage.setItem('enrolled_parent_id', child.parents[0].id);
      console.log('CHILD DATA:', child);

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
    fetchChildDataAndPopulate();
  }, [localStorage.getItem('enrolled_child_id') !== null]);

  return (
    <>
      <div className="enrollment-form-sec">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <h2 className="title-xs mb-4">Emergency Contact: R160 (3) (b) (ii)</h2>

            <div className="grayback">
              <p>(This person is to be notified of an emergency involving the child if any parents of the child cannot be immediately contacted).</p>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
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
                      }} />
                    { emergencyContactError?.name !== null && <span className="error">{emergencyContactError?.name}</span> }
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
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
                      }} />
                    { emergencyContactError?.address !== null && <span className="error">{emergencyContactError?.address}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control 
                      name="telephone"
                      value={emergencyContactData?.telephone || ""}
                      type="tel"
                      onChange={(e) => {
                        handleEmergencyContact(e);
                        setEmergencyContactError(prevState => ({
                          ...prevState,
                          telephone: null
                        }));
                      }} />
                    { emergencyContactError?.telephone !== null && <span className="error">{emergencyContactError?.telephone}</span> }
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Relationship To The Child</Form.Label>
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
                      }} />
                    { emergencyContactError?.relationship_to_the_child !== null && <span className="error">{emergencyContactError?.relationship_to_the_child}</span> }
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control type="tel" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Relationship To The Child</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <h3 className="title-xs mt-4 mb-4">Authorized nominee: R160 (3) (b) (iii)</h3>

            <div className="grayback">
              <p>(A person who has been given permission by a parents or family member to collect the child from Family Day Care).</p>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
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
                      }} />
                      { authorizedNomineeError?.name !== null && <span className="error">{authorizedNomineeError?.name}</span> }
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
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
                      }} />
                      { authorizedNomineeError?.address !== null && <span className="error">{authorizedNomineeError?.address}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control 
                      name="telephone"
                      type="tel"
                      value={authorizedNomineeData?.telephone || ""}
                      onChange={(e) => {
                        handleAuthorizedNominee(e);
                        setAuthorizedNomineeError(prevState => ({
                          ...prevState,
                          telephone: null
                        }));
                      }} />
                      { authorizedNomineeError?.telephone !== null && <span className="error">{authorizedNomineeError?.telephone}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Relationship To The Child</Form.Label>
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
                      }} />
                      { authorizedNomineeError?.relationship_to_the_child !== null && <span className="error">{authorizedNomineeError?.relationship_to_the_child}</span> }
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control type="tel" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Relationship To The Child</Form.Label>
                    <Form.Control type="text" />
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
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
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
                      }} />
                      { authorizedPersonError?.name !== null && <span className="error">{authorizedPersonError?.name}</span> }
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
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
                      }} />
                      { authorizedPersonError?.address !== null && <span className="error">{authorizedPersonError?.address}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control 
                      name="telephone"
                      value={authorizedPersonData?.telephone || ""}
                      type="tel"
                      onChange={(e) => {
                        handleAuthorizedPerson(e);
                        setAuthorizedPersonError(prevState => ({
                          ...prevState,
                          telephone: null
                        }));
                      }} />
                      { authorizedPersonError?.telephone !== null && <span className="error">{authorizedPersonError?.telephone}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Relationship To The Child</Form.Label>
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
                      }} />
                      { authorizedPersonError?.relationship_to_the_child !== null && <span className="error">{authorizedPersonError?.relationship_to_the_child}</span> }
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control type="tel" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Relationship To The Child</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <h3 className="title-xs mt-4 mb-4">Other authorized person: R 160 (3) (b) (v)</h3>

            <div className="grayback">
              <p>(A person who is authorized to authorize an educator to take the child outside the education and care service premises).</p>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
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
                      }} />
                      { otherAuthorizedPersonError?.name !== null && <span className="error">{otherAuthorizedPersonError?.name}</span> }
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
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
                      }} />
                      { otherAuthorizedPersonError?.address !== null && <span className="error">{otherAuthorizedPersonError?.address}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control 
                      name="telephone"
                      value={otherAuthorizedPersonData?.telephone || ""}
                      type="tel"
                      onChange={(e) => {
                        handleOtherAuthorizedPerson(e);
                        setOtherAuthorizedPersonError(prevState => ({
                          ...prevState,
                          telephone: null
                        }));
                      }} />
                      { otherAuthorizedPersonError?.telephone !== null && <span className="error">{otherAuthorizedPersonError?.telephone}</span> }
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Relationship To The Child</Form.Label>
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
                      }} />
                      { otherAuthorizedPersonError?.relationship_to_the_child !== null && <span className="error">{otherAuthorizedPersonError?.relationship_to_the_child}</span> }
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Telephone</Form.Label>
                    <Form.Control type="tel" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Relationship To The Child</Form.Label>
                    <Form.Control type="text" />
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
            <Button variant="outline" type="submit" onClick={() => prevStep()} className="me-3">Previous</Button>
            <Button variant="primary" type="submit">Next</Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ChildEnrollment4;
