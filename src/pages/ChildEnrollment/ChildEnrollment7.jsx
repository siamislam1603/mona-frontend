import React, { useState, useEffect } from "react";
import { Button, Col, Row, Form, Modal } from "react-bootstrap";
import axios from 'axios';
import { BASE_URL } from '../../components/App';
import moment from 'moment';
import Select from 'react-select';
import UserSignature from '../InputFields/ConsentSignature';


let nextstep = 8;
let step = 7;

// const ChildEnrollment6 = ({ nextStep, handleFormData, prevStep }) => {
//   const submitFormData = (e) => {
//     e.preventDefault();
//     nextStep();
//   };

const ChildEnrollment6 = ({ nextStep, handleFormData, prevStep }) => {

  const [educatorData, setEducatorData] = useState(null);
  const [userSelectedEducators, setUserSelectedEducators] = useState(null);
  const [consentData, setConsentData] = useState({
    parent_name: "",
    signature: "",
    consent_date: ""
  });
  const [parentConsentData, setParentConsentData] = useState({
    asked_for_consent: false,
    comment: ""
  });
  const [consentDetail, setConsentDetail] = useState(null);
  const [formStepData, setFormStepData] = useState(step);
  const [formStatus, setFormStatus] = useState('submission');
  const [formSubmissionSuccessDialog, setFormSubmissionSuccessDialog] = useState(false);
  const [userConsentFormDialog, setUserConsentFormDialog] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [fetchedSignatureImage, setFetchedSignatureImage] = useState(null);

  const fetchEducatorList = async () => {
    const response = await axios.get(`${BASE_URL}/user-group/users/educator`);

    if(response.status === 200 && response.data.status === "success") {
      let { users } = response.data;
      setEducatorData(users.map(user => ({
        id: user.id,
        value: user.fullname,
        label: user.fullname
      })));
    }
  };

  const fetchChildDataAndPopulate = async () => {
    let token = localStorage.getItem('token');
    let enrolledChildId = localStorage.getItem('enrolled_child_id');
    let response = await axios.get(`${BASE_URL}/enrollment/child/${enrolledChildId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if(response.status === 200 && response.data.status === "success") {
      let { child } = response.data;
      let educators = child.users.map(e => e.id);
      let { parents } = child;
      let { consent } = response.data;

      setUserSelectedEducators(educators);
      setFetchedSignatureImage(parents[0].signature);
      setConsentData(prevState => ({
        ...prevState,
        parent_name: parents[0].family_name,
        consent_date: moment(parents[0].consent_date).format('YYYY-MM-DD')
      }));
      setConsentDetail(consent.map(c => ({
        id: c.id,
        educator_id: c.educator,
        consent_given: c.consent_given
      })));
      setFormStepData(child.form_step);
    };
  }

  // UPDATING FORM SEVEN DATA;
  const updateFormSevenData = async () => {
    let token = localStorage.getItem('token');
    let parentId = localStorage.getItem('enrolled_parent_id');
    let childId = localStorage.getItem('enrolled_child_id');
    let response = await axios.patch(`${BASE_URL}/enrollment/parent/${parentId}`, {...consentData}, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    if(response.status === 201 && response.data.status === "success") {
      response = await axios.patch(`${BASE_URL}/enrollment/educator-consent/${childId}`, {
        consentPayload: consentDetail
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if(response.status === 201 && response.data.status === "success") {
        if(!(formStepData > step)) {
          console.log('CONDITION FULLFULLED!');
          response = await axios.patch(`${BASE_URL}/enrollment/child/${childId}`, { form_step:  nextstep }, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
  
          if(response.status === 201 && response.data.status === "success") {
            // nextStep();
            setFormSubmissionSuccessDialog(true);
          }
        }
        
        if(localStorage.getItem('user_role') === 'coordinator' && localStorage.getItem('change_count') > 0) {
          setUserConsentFormDialog(true);
        }

        setFormSubmissionSuccessDialog(true);
      }
    }
  };

  const handleDataSubmit = event => {
    event.preventDefault();
    updateFormSevenData();
  }

  const handleParentConsentSubmission = async () => {
    let response = await axios.post(`${BASE_URL}/enrollment/parent-consent/`, {
      ...parentConsentData,
      consent_initiator_id: localStorage.getItem('user_id'),
      consent_recipient_id: localStorage.getItem('enrolled_parent_id'),
      child_id: localStorage.getItem('enrolled_child_id'),
    }, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });

    console.log('RESPONSE CONSENT:', response);
    if(response.status === 201 && response.data.status === "success") {
      let { parentConsentObject } = response.data;
      console.log('PARENT CONSENT OBJECT!', parentConsentObject);
      localStorage.setItem('has_given_consent', parentConsentObject.has_given_consent);
      localStorage.setItem('consent_child_id', parentConsentObject.child_id);

      response = await axios.post(`${BASE_URL}/enrollment/send-notification/consent-mail/${localStorage.getItem('enrolled_parent_id')}/${localStorage.getItem('enrolled_child_id')}`, { userId: localStorage.getItem('user_id'), franchisee_id: localStorage.getItem('franchisee_id') });

      console.log('CONSENT MAIL RESPONSE', response);
      if(response.status === 201 && response.data.status === "success") {
        console.log('CLOSING THE DIALOG!');
        setUserConsentFormDialog(false);
        localStorage.removeItem('change_count');
        setFormSubmissionSuccessDialog(true);
      }
    }
  };

  const handleConsentUpdation = (consentId, consent_given) => {
    let updatedData = consentDetail.map(c => {
      if(c.id === consentId) {
        return {
          id: c.id,
          educator_id: c.educator_id,
          consent_given: !consent_given
        }
      }
      return c;
    });

    setConsentDetail(updatedData);
  };

  const handleSubmissionRedirection = async () => {
    console.log('UPDATING THE ENROLLMENT STATE!');
    let enrolledChildId = localStorage.getItem('enrolled_child_id');
    let token = localStorage.getItem('token');
    let response = await axios.patch(`${BASE_URL}/enrollment/child/${enrolledChildId}`, { isChildEnrolled: 1 }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if(response.status === 201 && response.data.status === "success" && localStorage.getItem('user_role') === 'guardian') {
      response = await axios.post(`${BASE_URL}/enrollment/send-notification/mailer/${localStorage.getItem('enrolled_parent_id')}/${localStorage.getItem('enrolled_child_id')}`, { userId: localStorage.getItem('user_id'), franchisee_id: localStorage.getItem('franchisee_id')});

      if(response.status === 201 && response.data.status === "success") {

        if(localStorage.getItem('asked_for_consent') !== null) {
          response = await axios.patch(`${BASE_URL}/enrollment/parent-consent/${localStorage.getItem('enrolled_parent_id')}`, { childId: localStorage.getItem('enrolled_child_id') }, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
          });
  
          if(response.status === 201 && response.data.status === "success") {
            localStorage.removeItem('asked_for_consent');
            localStorage.removeItem('consent_comment');
            localStorage.removeItem('has_given_consent');
            let parent_id = localStorage.getItem('enrolled_parent_id');
            window.location.href=`http://3.26.240.23:5000/children/${parent_id}`;
          }
        } else {
          let parent_id = localStorage.getItem('enrolled_parent_id');
          window.location.href=`http://3.26.240.23:5000/children/${parent_id}`;
        }
      }
    } else if(response.status === 201 && response.data.status === "success") {
      if(localStorage.getItem('asked_for_consent') !== null) {
        response = await axios.patch(`${BASE_URL}/enrollment/parent-consent/${localStorage.getItem('enrolled_parent_id')}`, { childId: localStorage.getItem('enrolled_child_id') }, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });

        if(response.status === 201 && response.data.status === "success") {
          localStorage.removeItem('asked_for_consent');
          localStorage.removeItem('consent_comment');
          localStorage.removeItem('has_given_consent');
          let parent_id = localStorage.getItem('enrolled_parent_id');
          window.location.href=`http://3.26.240.23:5000/children/${parent_id}`;
        }
      } else {
        let parent_id = localStorage.getItem('enrolled_parent_id');
        window.location.href=`http://3.26.240.23:5000/children/${parent_id}`;
      }
    }
  }

  const saveSignatureImage = async () => {
    let data = new FormData();

    if(signatureImage) {
      setShowSignatureDialog(false);
      console.log('Saving Signature Image!');
      const blob = await fetch(signatureImage).then((res) => res.blob());
      console.log('BLOB:', blob);
      data.append('image', blob);
    }

    let response = await axios.put(`${BASE_URL}/enrollment/signature/${localStorage.getItem('enrolled_parent_id')}`, data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });

    if(response.status === 200 && response.data.status === "success") {
      console.log('SIGNATURE UPLOADED SUCCESSFULLY!');
      fetchChildDataAndPopulate();
    }
  }
      
  // const handleSignatureDialog = async (signURI) => {
  //   setSignatureImage(signURI);
  //   setShowSignatureDialog(false);
    
  // }

  useEffect(() => {
    saveSignatureImage();
  }, [signatureImage])

  // useEffect(() => {
  //   let parent_id = localStorage.getItem('user_id');
  //   window.location.href=`http://localhost:5000/children/${parent_id}`;
  // }, []);

  useEffect(() => {
    fetchEducatorList();
  }, []);

  useEffect(() => {
    fetchChildDataAndPopulate();
  }, [])

  // consentData && console.log('Consent Data:', consentData);
  // consentDetail && console.log('CONSENT DETAIL:', consentDetail);
  // parentConsentData && console.log('PARENT CONSENT DATA:', parentConsentData);
  // signatureImage && console.log('SIGNATURE IMAGE:', signatureImage);
  return (
    <>
      <div className="enrollment-form-sec">
        <Form onSubmit={handleDataSubmit}>
          <h2 className="title-xs mt-4 mb-4">Consent for educator and nominated assistant R 144</h2>

          {
            consentDetail && consentDetail.map(consent => {
              return (
                <div className="grayback" style={{ marginBottom: "1rem" }}>
                  <Col>
                    <Form.Group className="mb-3 single-field">
                      <Form.Label>Give consent to the educator</Form.Label>
                      <Select
                        placeholder="Which Franchisee?"
                        closeMenuOnSelect={false}
                        isMulti
                        isDisabled={true}
                        value={educatorData?.filter(d => parseInt(d.id) === parseInt(consent.educator_id))}
                        options={educatorData}
                      />
                    </Form.Group>
                  </Col>
                  <Form.Group className="mb-3 single-field">
                    <Form.Label>to provide care and education to my child.; and nominated assistant/s</Form.Label>
                    <Form.Control
                      type="text"
                      name="to_provide_care_and_education_to_my_child"
                      // onChange={}
                    />
                  </Form.Group>
                  <p>to support the educator in transporting my child to and from regular outings or excursion, providing care while educator has an appointment for the period of less than 4 hours, or in an emergency where the educator needs medical attention. Assistant may also provide support to the educator while the educator is providing care for my child.</p>

                  <Form.Group>
                    <div className="btn-checkbox" style={{padding: 0, margin: 0}}>
                      <Form.Check 
                        type="checkbox" 
                        id={`accept_${consent.id}`} 
                        checked={consent.consent_given === true}
                        label="I consent to the above educator."
                        onChange={() => handleConsentUpdation(consent.id, consent.consent_given)} />
                    </div>
                  </Form.Group>
                </div>
              )
              })
          }

          <h3 className="title-xs mt-4 mb-4">Authorization by Parents / Authorized person for the Approved Provider, Nomminated Supervisor or Educator</h3>

          <div className="grayback">
            <p>Agree to collect or arrange for collection of the child referred to in this enrolment form, if she/he becomes unwell at the service; Understand that this office will contact the Human Service/Child Protection Service in cases of emergency where no individuals nominated and I can’t be notified;  Consent to the proprietor of the family day care service, nominated supervisor or educator to seek medical treatment for the child from a registered medical practitioner, hospital or ambulance service, and transportation of the child by an ambulance service (R 161).</p>
            <p>Authorize the educator and proprietor of family day care to take the child on regular outings (R 102).</p>
          </div>

          <h3 className="title-xs mt-4 mb-4">Authorization by parents/guardian</h3>

          <div className="grayback">
            <Form.Group className="mb-3 single-field">
              <Form.Label>I,</Form.Label>
              <Form.Control
                type="text"
                name="parent_name"
                value={consentData?.parent_name || ""}
                disabled={true}
                onChange={(e) => setConsentData(prevState => ({
                  ...prevState,
                  parent_name: e.target.value
                }))}
              />
            </Form.Group>
            <p>a person with full authority of the child referred to in this enrolment form; <br />Declare that the information in this enrolment form is true and correct and undertake to immediately inform the children service in the event of any change to this information;</p>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Signature</Form.Label>
                  {
                    (localStorage.getItem('user_role') === 'guardian' && (localStorage.getItem('user_id') === localStorage.getItem('enrolled_parent_id'))) &&
                    <p onClick={() => setShowSignatureDialog(true)} style={{ cursor: "pointer" }}><strong style={{ color: "#AA0061" }}>Click Here</strong> to sign the consent form!</p>
                  }
                  {
                    // fetchedSignatureImage &&
                    <img src={fetchedSignatureImage} alt="parent signature" style={{ width: "80px", height: "80px" }} />
                  }
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    placeholder="" 
                    name="consent_date"
                    value={consentData?.consent_date || ""}
                    onChange={(e) => setConsentData(prevState => ({
                      ...prevState,
                      consent_date: e.target.value
                    }))}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
          <div className="cta text-center mt-5 mb-5">
            <Button variant="outline" type="submit" onClick={prevStep} className="me-3">Previous</Button>
            <Button variant="primary" type="submit" onClick={handleDataSubmit}>Next</Button>
          </div>
        </Form>
      </div>

      <Modal
        show={formSubmissionSuccessDialog}>
        {/* onHide={() => setFormSubmissionSuccessDialog(false)}> */}
        <Modal.Header>
          <Modal.Title className="modal-title">Congratulations!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="modal-paragraph">Form Submitted Successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="modal-button"
            onClick={() => handleSubmissionRedirection()}>Okay</button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={userConsentFormDialog}
        size="lg">
          <Modal.Header>
            <Modal.Title>Parent Consent Form</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div>
              <Form.Group>
                <div className="btn-checkbox" style={{padding: 0, margin: 0, width: "100%"}}>
                  <Form.Check 
                    type="checkbox" 
                    style={{ padding: "0px", margin: "0px 0px 20px 0px" }}
                    id={`accept_consent_1`} 
                    checked={parentConsentData.asked_for_consent === true}
                    label="Parent/Guardian's consent required"
                    onChange={() => setParentConsentData(prevState => ({
                      ...prevState,
                      asked_for_consent: !parentConsentData.asked_for_consent
                    }))} 
                  />

                  <div className="comment-box" style={{  width: "100%" }}>
                    <p><strong>Add Comment</strong></p>
                    <Form.Control
                      name="your comment here" 
                      as="textarea" 
                      style={{width: "100%"}}
                      value={parentConsentData?.comment || ""}
                      rows={10}
                      onChange={(e) => setParentConsentData(prevState => ({
                        ...prevState,
                        comment: e.target.value
                      }))} />
                  </div> 
                  <p>* You've done {localStorage.getItem('change_count')} {localStorage.getItem('change_count') > 1 ? "changes" : "change"} in this form!</p>
                </div>
              </Form.Group>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button 
              className="modal-button"
              onClick={() => handleParentConsentSubmission()}>Ask For Consent</button>
          </Modal.Footer>
      </Modal>

      {
            <Modal
              size="lg"
              show={showSignatureDialog}
              onHide={() => setShowSignatureDialog(false)}>
              <Modal.Header>
                <Modal.Title>Consent Signature</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Row>
                  <UserSignature
                    field_label="Signature:"
                    // handleSignatureDialog={handleSignatureDialog}
                    onChange={setSignatureImage} />
                </Row>
              </Modal.Body>

              {/* <Modal.Footer style={{ alignItems: 'center', justifyContent: 'center', padding: "45px 60px" }}>
              <div class="text-center"> */}
                {/* <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ borderRadius: '5px', backgroundColor: '#3E5D58', padding: "8px 18px" }}onClick={() => handleSignatureDialog()}>Submit</button> */}
              {/* </div>
              </Modal.Footer> */}
            </Modal>
          }
    </>
  );
};

export default ChildEnrollment6;
