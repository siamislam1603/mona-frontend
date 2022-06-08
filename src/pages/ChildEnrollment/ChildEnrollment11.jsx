import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";

const ChildEnrollment11 = ({ nextStep, handleFormData, prevStep }) => {
    const submitFormData = (e) => {
      e.preventDefault();
        nextStep();
    };
  
  return (
    <>
      <div className="enrollment-form-sec">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <h2 className="title-xs mb-4">Sun Protection agreement and permission</h2>
            
            <div className="grayback">
              <p>I understand Mona FDC is a registered SunSmart Early Childhood Program member and follows SunSmart and Cancer Council Victoria recommendations to use a combination of sun protection measures (clothing, sunscreen, a hat, shade, and if practical, sunglasses) during the daily local sun protection times (whenever UV levels reach 3 or higher), typically from mid-August to the end of April in Victoria.</p>
              <p>I agree to help support this membership and help minimize my child’s potential risk of skin and eye damage and skin cancer by doing the following:</p>
              <p><strong>(Please tick all that apply)</strong></p>
              <Form.Group className="mb-3">
                <div className="btn-checkbox">
                  <Form.Check type="checkbox" id="dress" label="Dress my child in cool clothing that covers as much skin as possible e.g. tops that cover the shoulders, arms and chest, has higher necklines or collars, and long shorts and skirts. I understand that singlet tops or shoestring dresses do not provide adequate sun protection and are best layered with a shirt or t-shirt." />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="btn-checkbox">
                  <Form.Check type="checkbox" id="remind" label="Remind my child to bring and wear a sun-protective hat that shades the face, neck and ears (e.g. wide-brimmed, bucket or legionnaire hat). I understand that baseball / peak style caps do not provide adequate sun protection and are not appropriate for outdoor play." />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="btn-checkbox">
                  <Form.Check type="checkbox" id="provide" label="Provide my child with appropriate close-fitting wrap-around sunglasses labelled AS:1067 to help protect their eyes." />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="btn-checkbox">
                  <Form.Check type="checkbox" id="permission" label="Give permission for educators/staff to apply SPF30 (or higher) broad-spectrum, water-resistant sunscreen supplied by the service to all exposed parts of my child’s skin including their face, neck, ears, arms and legs." />
                </div>
              </Form.Group>
              <div className="text-center mb-3">OR</div>
              <Form.Group className="mb-3">
                <div className="btn-checkbox">
                  <Form.Check type="checkbox" id="gpermission" label="To give permission for educators/staff to apply SPF30 (or higher) broad-spectrum, water-resistant sunscreen (that I have supplied and labelled with my child/children’s name) to all exposed parts of my child’s skin including their face, neck, ears, arms and legs. I agree that this sunscreen will be kept at the service and it is my responsibility to make sure there is always an adequate supply available." />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="btn-checkbox">
                  <Form.Check type="checkbox" id="educators" label="To give permission for educators/staff to assist my child to develop independent, self-help skills by applying SPF30 (or higher) broad-spectrum, water-resistant sunscreen to all exposed parts of their own skin including their face, neck, ears, arms and legs. (Recommended from ages three and above) " />
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

export default ChildEnrollment11;