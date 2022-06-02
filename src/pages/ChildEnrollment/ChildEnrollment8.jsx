import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";

const ChildEnrollment8 = ({ nextStep, handleFormData, prevStep }) => {
    const submitFormData = (e) => {
      e.preventDefault();
        nextStep();
    };
  
  return (
    <>
      <div className="enrollment-form-sec">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <h2 className="title-xs mb-4">I understand and have read the following:</h2>
            
            <div className="grayback">
              <ol>
                <li>I understand that once I have booked my child/children with my educator, the above hours and days become my agreed    hours during school term and/or school holidays.</li>
                <li>I understand that I will be charged for these hours whether my child attends or not.</li>
                <li>I understand that if my educator has time off or becomes sick that there will be an alternative educator ready for standby.</li>
                <li>Exclude my child from care for the recommended time period if he/she has an infectious illness.</li>
                <li>Advice Mona Family Day Care of any changes to my family circumstances such as address, contact phone number, agreed booking hours, children are ceasing care, employment, study hours, travel plan (notification for absence) and children are changing schools.</li>
                <li>Abide by Mona Family Day Care Parents Handbook. (A copy of the updated Mona Family Day Care Parents Handbook book is available at the Coordination Unit office or Family Day Care Educator’s residence).</li>
                <li>Take financial responsibility (see over page) and contact the Centrelink or Family Assistance Office if my family circumstances change.</li>
                <li>Contact the Family Day Care Educator at least half an hour before the agreed booking time if my child will not be attending care.</li>
                <li>Contact the Family Day Care Educator, if I am unable to collect my child/ at the agreed booking time and pay the additional cost at casual rate if the Family Day Care Educator continues to care my child.</li>
                <li>Give the office and educator two weeks- notice or 2 weeks’ childcare fees should the need for terminating of child enrolment arise.</li>
                <li>I understand that it is my responsibility as the parent to notify the office immediately when individuals other than the educators or the nominated assistants is in contact with, pickup or drop off my children to and from school / home.</li>
                <li>I understand that I am not entitled to receive childcare subsidy for my own children’s session of care, if on that same day, I as FDC educator provide care for an approved FDC service.</li>
              </ol>
              <Form.Group className="mb-3">
                <div className="btn-checkbox">
                  <Form.Check type="checkbox" id="accept" label="I have read and accept all the above points." />
                </div>
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

export default ChildEnrollment8;
