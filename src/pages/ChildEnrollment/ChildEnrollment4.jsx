import React, { useState } from "react";
import { Button, Col, Row, Table, Form } from "react-bootstrap";

const ChildEnrollment4 = ({ nextStep, handleFormData, prevStep }) => {
  const submitFormData = (e) => {
    e.preventDefault();
    nextStep();
  };

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
            <Button variant="outline" type="submit" onClick={prevStep} className="me-3">Previous</Button>
            <Button variant="primary" type="submit">Next</Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ChildEnrollment4;
