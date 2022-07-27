import React, { useState } from "react";
import { Button, Col, Row, Table, Form } from "react-bootstrap";
import { BASE_URL } from "../../components/App";
import axios from 'axios';
import { personValidation } from "../../helpers/validation";

let nextstep = 5;
let step = 4;

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
      saveFormFourData(); 
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

  emergencyContactData && console.log('EMEGENCY CONTACT:', emergencyContactData);
  authorizedNomineeData && console.log('AUTHORIZED NOMINEE DATA:', authorizedNomineeData);
  authorizedPersonData && console.log('AUTHORIZED PERSON DATA:', authorizedPersonData);
  otherAuthorizedPersonData && console.log('OTHER AUTHORIZED PERSON DATA:', otherAuthorizedPersonData);

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
