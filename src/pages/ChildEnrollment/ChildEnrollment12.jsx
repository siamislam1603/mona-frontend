import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";

const ChildEnrollment12 = ({ nextStep, handleFormData, prevStep }) => {
    const submitFormData = (e) => {
      e.preventDefault();
        nextStep();
    };
  
  return (
    <>
      <div className="enrollment-form-sec">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <h2 className="title-xs mb-4">Medication Permission</h2>
            
            <div className="grayback">
              <p>I give consent for the educator, assistant, approved provider, nominated supervisor & coordinator to administer prescribed Medication when needed. I understand that unless all the information required on the medication form is not completed or signed the medication will not be given to my child.  I understand my educator will contact me immediately if medication such as Panadol is required.</p>
              <Form.Group className="mb-3">
                <div className="btn-checkbox">
                  <Form.Check type="checkbox" id="accept" label="I have read and accept all the above points." />
                </div>
              </Form.Group>
            </div>
            
            <h2 className="title-xs mt-4 mb-4">Consent for educator and nominated assistant R 144</h2>
            
            <div className="grayback">
              <Form.Group className="mb-3 single-field">
                <Form.Label>Give consent to the educator</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
              <Form.Group className="mb-3 single-field">
                <Form.Label>to provide care and education to my child.; and nominated assistant/s</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
              <p>to support the educator in transporting my child to and from regular outings or excursion, providing care while educator has an appointment for the period of less than 4 hours, or in an emergency where the educator needs medical attention. Assistant may also provide support to the educator while the educator is providing care for my child.</p>
            </div>
            
            <h3 className="title-xs mt-4 mb-4">Authorization by Parents / Authorized person for the Approved Provider, Nomminated Supervisor or Educator</h3>
            
            <div className="grayback">
              <p>Agree to collect or arrange for collection of the child referred to in this enrolment form, if she/he becomes unwell at the service; Understand that this office will contact the Human Service/Child Protection Service in cases of emergency where no individuals nominated and I can’t be notified;  Consent to the proprietor of the family day care service, nominated supervisor or educator to seek medical treatment for the child from a registered medical practitioner, hospital or ambulance service, and transportation of the child by an ambulance service (R 161).</p>
              <p>Authorize the educator and proprietor of family day care to take the child on regular outings (R 102).</p>
            </div>
            
            <h3 className="title-xs mt-4 mb-4">Authorization by parents/guardian</h3>
            
            <div className="grayback">
              <Form.Group className="mb-3 single-field">
                <Form.Label>I,</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
              <p>a person with full authority of the child referred to in this enrolmet form; <br/>Declare that the information in this enrolment form is true and correct and undertake to immediately inform the children service in the event of any change to this information;</p>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Signature</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" placeholder="" name="dob" />
                  </Form.Group>
                </Col>
              </Row>
            </div>
            
            <div className="whiteback mt-4">
              <h4 className="title-xs mb-3 text-center">For Office Use Only</h4>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Documents sighted by</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Signature</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" placeholder="" name="dob" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Percentage</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Eligible Hours</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>
          <div className="cta text-center mt-5 mb-5">
            <Button variant="outline" type="submit" onClick={prevStep} className="me-3">Previous</Button>
            <Button variant="primary" type="submit">Next</Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ChildEnrollment12;
