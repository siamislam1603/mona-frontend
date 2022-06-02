import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";

const ChildEnrollment10 = ({ nextStep, handleFormData, prevStep }) => {
    const submitFormData = (e) => {
      e.preventDefault();
        nextStep();
    };
  
  return (
    <>
      <div className="enrollment-form-sec">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <h2 className="title-xs mb-4">Chid’s Medical Information</h2>
            
            <div className="grayback">
              <div className="single-col">
                <p>Does your child have any special needs?</p>
                <Form.Group className="ms-auto">
                  <div className="btn-radio inline-col mb-0">
                    <Form.Check type="radio" name="photo" id="yesp" label="Yes" />
                    <Form.Check type="radio" name="photo" id="nop" label="No" />
                  </div>
                </Form.Group>
              </div>
              <Form.Text className="text-muted mb-3 d-block">
                if ‘Yes’ please provide details of any special needs,
              </Form.Text>
              <Form.Group className="mb-3">
                <Form.Label>Details of any special needs, early intervention service and any management procedure to be followed with respect to the special need.</Form.Label>
                <Form.Control as="textarea" rows={3} />
              </Form.Group>
              <div className="single-col mb-3">
                <p>Inclusion Support Form (If applicable)</p>
                <Form.Group className="ms-auto">
                  <div className="btn-radio inline-col mb-0">
                    <Form.Check type="radio" name="support" id="yess" label="Yes" />
                    <Form.Check type="radio" name="support" id="nos" label="No" />
                  </div>
                </Form.Group>
              </div>
              <div className="single-col mb-3">
                <p>Does Your Child have any senstivity</p>
                <Form.Group className="ms-auto">
                  <div className="btn-radio inline-col mb-0">
                    <Form.Check type="radio" name="senstivity" id="yesa" label="Yes" />
                    <Form.Check type="radio" name="senstivity" id="noa" label="No" />
                  </div>
                </Form.Group>
              </div>
              <Form.Group className="mb-3">
                <Form.Label>If yes, please provide details of any allergies and any management procedure to be followed with respect to the allergy</Form.Label>
                <Form.Control as="textarea" rows={3} />
              </Form.Group>
              <div className="single-col mb-3">
                <p>Inclusion Support Form (If applicable)</p>
                <Form.Group className="ms-auto">
                  <div className="btn-radio inline-col mb-0">
                    <Form.Check type="radio" name="applicable" id="yesd" label="Yes" />
                    <Form.Check type="radio" name="applicable" id="nod" label="No" />
                  </div>
                </Form.Group>
              </div>
              <div className="single-col mb-3">
                <p>Does your child have an auto injection device (e.g. EpiPen®)?</p>
                <Form.Group className="ms-auto">
                  <div className="btn-radio inline-col mb-0">
                    <Form.Check type="radio" name="injection" id="yesi" label="Yes" />
                    <Form.Check type="radio" name="injection" id="noi" label="No" />
                  </div>
                </Form.Group>
              </div>
              <div className="single-col mb-3">
                <p>If yes, has the anaphylaxis medical management plan been provided to the service</p>
                <Form.Group className="ms-auto">
                  <div className="btn-radio inline-col mb-0">
                    <Form.Check type="radio" name="service" id="yesm" label="Yes" />
                    <Form.Check type="radio" name="service" id="nom" label="No" />
                  </div>
                </Form.Group>
              </div>
              <div className="single-col mb-3">
                <p>Has a risk management plan been completed by the service in consultation with you</p>
                <Form.Group className="ms-auto">
                  <div className="btn-radio inline-col mb-0">
                    <Form.Check type="radio" name="management" id="yese" label="Yes" />
                    <Form.Check type="radio" name="management" id="noe" label="No" />
                  </div>
                </Form.Group>
              </div>
              <p className="mb-3">In case of anaphylaxis, you are required to provide the service with an individual medical management plan for your child signed by the medical practitioner. This will be attached to your child’s enrolment form. More information is available at <a href="www.education.vic.gov.au/anaphyaxis">www.education.vic.gov.au/anaphyaxis</a>.</p>
              <div className="single-col mb-3">
                <p>Does your child have any other medical conditions? (e.g. asthma, epilepsy, and diabetes, etc. that are relevant to the care of your child)</p>
                <Form.Group className="ms-auto">
                  <div className="btn-radio inline-col mb-0">
                    <Form.Check type="radio" name="conditions" id="yest" label="Yes" />
                    <Form.Check type="radio" name="conditions" id="not" label="No" />
                  </div>
                </Form.Group>
              </div>
              <Form.Group className="mb-3">
                <Form.Label>*If yes please provide details of any medical condition and any management procedure to be followed with respect to the medical condition</Form.Label>
                <Form.Control as="textarea" rows={3} />
              </Form.Group>
              <div className="single-col mb-3">
                <p>Does the child have any dietary restrictions?</p>
                <Form.Group className="ms-auto">
                  <div className="btn-radio inline-col mb-0">
                    <Form.Check type="radio" name="dietary" id="yesh" label="Yes" />
                    <Form.Check type="radio" name="dietary" id="noh" label="No" />
                  </div>
                </Form.Group>
              </div>
              <Form.Group className="mb-3">
                <Form.Label>If yes, the following restrictions apply: </Form.Label>
                <Form.Control as="textarea" rows={3} />
              </Form.Group>
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

export default ChildEnrollment10;
