import React, { useState } from "react";
import { Button, Col, Row, Form, Table } from "react-bootstrap";
import { healthInformationFormValidator } from '../../helpers/enrollmentValidation';

const ChildEnrollment2 = ({ nextStep, handleFormData, prevStep }) => {

  const [healthInformation, setHealthInformation] = useState({
    medical_service: "",
    telephone: "",
    medical_service_address: "",
    maternal_and_child_health_centre: "",
    has_health_record: false
  });

  // ERROR HANDLING STATES
  const [healthInfoFormErrors, setHealthInfoFormErrors] = useState(null);

  const submitFormData = (e) => {
    e.preventDefault();
    
    // const errors = healthInformationFormValidator(healthInformation);
    // if(Object.keys(errors).length > 0) {
    //   setHealthInfoFormErrors(errors);
    // } else {

    // }
    nextStep();
  };

  return (
    <>
      <div className="enrollment-form-sec">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <h2 className="title-xs mb-4">Court orders relating to the child R 160 (C)</h2>
            <div className="grayback mb-4">
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Are there any court orders relating to the powers, duties, responsibilities or authorities of any person in relation to the child or access to the child?</Form.Label>
                    <div className="btn-radio inline-col">
                      <Form.Check type="radio" name="powers" id="yesd" className="ps-0" label="Yes" />
                      <Form.Check type="radio" name="powers" id="nod" label="No" />
                    </div>
                    <Form.Text className="text-muted">
                      if ‘Yes’ please provide to the service for sighting.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Please describe these changes and provide the contact details of any person given these powers: </Form.Label>
                    <Form.Control as="textarea" rows={3} />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Please note:
                    </Form.Label>
                    <p>1.	Bring the original court order/s for staff to see and a copy to attach to this enrolment form;
                    </p>
                    <p>2. If these orders:
                      <p>a)	change the powers of a parent/guardian to:
                      </p>
                      <ul>
                        <li>authorise the taking of the child outside the service by a staff member of the service;
                        </li>
                        <li>in the case of a family day care service, the taking of the child outside the family day educator’s residence or family day care venue by a
                          family day educator,
                        </li>
                        <li>consent to the medical treatment of the child;
                        </li>
                        <li>request or permit the administration of medication to the child;
                        </li>
                        <li>collect the child from the service or family day care, AND/OR
                        </li>
                      </ul>
                      <p>b)	give these powers to someone else</p>
                    </p>
                  </Form.Group>
                </Col>
              </Row>
            </div>
            {/* <ChildEnrollment3 /> */}
          </div>
          {/* <div className="cta text-center mt-5 mb-5">
            <Button variant="outline" type="submit" onClick={prevStep} className="me-3">Previous</Button>
            <Button variant="primary" type="submit">Next</Button>
          </div> */}
        </Form>
        <div className="enrollment-form-sec">
          <Form onSubmit={submitFormData}>
            <div className="enrollment-form-column">
              <h2 className="title-xs mb-4">Child’s health information R 162 (b)</h2>
              <div className="grayback">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Doctor’s Name/Medical Service</Form.Label>
                      <Form.Control 
                        type="text"
                        name="medical_service"
                        value={healthInformation.medical_service || ""}
                        onChange={(e) => {
                          setHealthInformation(prevState => ({
                            ...prevState,
                            medical_service: e.target.value 
                          }));

                          setHealthInfoFormErrors(prevState => ({
                            ...prevState,
                            medical_service: null
                          }));
                        }} 
                      />
                      { healthInfoFormErrors?.medical_service !== null && <span className="error">{healthInfoFormErrors?.medical_service}</span> }
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Telephone</Form.Label>
                      <Form.Control 
                        type="tel"
                        name="telephone"
                        value={healthInformation.telephone || ""}
                        onChange={(e) => {
                          setHealthInformation(prevState => ({
                          ...prevState,
                          telephone: e.target.value 
                        }));

                        setHealthInfoFormErrors(prevState => ({
                          ...prevState,
                          telephone: null
                        }));
                      }} 
                    />
                    { healthInfoFormErrors?.telephone !== null && <span className="error">{healthInfoFormErrors?.telephone}</span> }
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Doctor’s Address/Medical Service</Form.Label>
                      <Form.Control 
                        type="text"
                        name="medical_service_address"
                        value={healthInformation.medical_service_address || ""}
                        onChange={(e) => {
                          setHealthInformation(prevState => ({
                            ...prevState,
                            medical_service_address: e.target.value 
                          }));

                          setHealthInfoFormErrors(prevState => ({
                            ...prevState,
                            medical_service_address: null
                          }));
                      }} 
                    />
                    { healthInfoFormErrors?.medical_service_address !== null && <span className="error">{healthInfoFormErrors?.medical_service_address}</span> }
                    </Form.Group>
                  </Col>
                  
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Maternal And Child Health Centre</Form.Label>
                      <Form.Control 
                        type="text"
                        name="maternal_and_child_health_centre"
                        value={healthInformation.maternal_and_child_health_centre || ""}
                        onChange={(e) => { 
                          setHealthInformation(prevState => ({
                            ...prevState,
                            maternal_and_child_health_centre: e.target.value 
                          }));

                          setHealthInfoFormErrors(prevState => ({
                            ...prevState,
                            maternal_and_child_health_centre: null
                          }));
                        }} 
                      />
                      { healthInfoFormErrors?.maternal_and_child_health_centre !== null && <span className="error">{healthInfoFormErrors?.maternal_and_child_health_centre}</span> }
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Does your child have a child health record?</Form.Label>
                      <div className="btn-radio inline-col">
                        <Form.Check 
                          type="radio" 
                          name="health" 
                          id="yes" 
                          className="ps-0" 
                          label="Yes"
                          onChange={() => setHealthInformation(prevState => ({
                            ...prevState,
                            has_health_record: true
                          }))} />
                        <Form.Check 
                          type="radio" 
                          name="health" 
                          id="no" 
                          label="No"
                          defaultChecked
                          onChange={() => setHealthInformation(prevState => ({
                            ...prevState,
                            has_health_record: false
                          }))} />
                      </div>
                      <Form.Text className="text-muted">
                        if ‘Yes’ please provide to the service for sighting.
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  {
                    healthInformation.has_health_record &&
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Name and position of person at the service who has sighted the child’s health record</Form.Label>
                        <Row>
                          <Col md={4}>
                            <div className="mb-3">
                              <Form.Label>Name</Form.Label>
                              <Form.Control type="text" />
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="mb-3">
                              <Form.Label>Signature & Date</Form.Label>
                              <Form.Control type="text" />
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="mb-3">
                              <Form.Label>&nbsp;</Form.Label>
                              <Form.Control type="date" placeholder="" name="dob" />
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="mb-3">
                              <Form.Label>Position</Form.Label>
                              <Form.Control type="text" />
                            </div>
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                  }
                </Row>
              </div>

              <h2 className="title-xs mt-4 mb-4">Child’s immunization record R 162 (F)</h2>

              <div className="grayback">
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Has the child been immunized?</Form.Label>
                      <div className="btn-radio inline-col">
                        <Form.Check type="radio" name="immunized" id="yesi" className="ps-0" label="Yes" />
                        <Form.Check type="radio" name="immunized" id="noi" label="No" />
                      </div>
                      <Form.Text className="text-muted">
                        if ‘Yes’ please provide the details.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>
            {/* <div className="cta text-center mt-5 mb-5">
              <Button variant="outline" type="submit" onClick={prevStep} className="me-3">Previous</Button>
              <Button variant="primary" type="submit">Next</Button>
            </div> */}
          </Form>
        </div>
        <div className="enrollment-form-sec">
          <Form onSubmit={submitFormData}>
            <div className="enrollment-form-column">
              <h2 className="title-xs mb-4">Information about the child</h2>

              <div className="grayback">
                <p>A parent or guardian who has lawful authority in relation to the child must complete this form. Licensed children’s services may use this form to collect the child’s enrolment information as required in the Children’s Service’s Regulations 2017 and education and care services national law act 2010. Based on these regulations, parents are not required to fill questions marked with an asterisk, however, it will be highly important for the service to have those details.</p>
              </div>

              {/* <h2 className="title-xs mt-4 mb-4">Court orders relating to the child</h2> */}

              {/* <div className="grayback">
                <ol>
                  <li>Bring the original court order/s for staff to see and a copy to attach to this enrolment form;</li>
                  <li>If these orders:<br />
                    a)	change the powers of a parent/guardian to: <br />
                    • authorise the taking of the child outside the service by a staff member of the service; <br />
                    • in the case of a family day care service, the taking of the child outside the family day educator&rsquo;s residence or family day care venue by a family day educator, <br />
                    • consent to the medical treatment of the child; <br />
                    • request or permit the administration of medication to the child; <br />
                    • collect the child from the service or family day care, AND/OR <br />
                    b)	give these powers to someone else</li>
                </ol>
              </div> */}

              <h2 className="title-xs mt-4 mb-4">Child’s Immunisation Record</h2>

              <div className="grayback">
                <Table responsive="md" className="text-left">
                  <thead>
                    <tr>
                      <th align="left">Immunisation <br /><small>(Valid from March 2008)</small></th>
                      <th align="center">Birth</th>
                      <th align="center">2 Months</th>
                      <th align="center">4 Months</th>
                      <th align="center">6 Months</th>
                      <th align="center">12 Months</th>
                      <th align="center">18 Months</th>
                      <th align="center">4 Years</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td align="left">Hepatitis B</td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="b1" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="b2" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="b3" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="b4" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="b5" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="b6" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="b7" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                    </tr>
                    <tr>
                      <td align="left">Diphtheria, tetanus and acellular pertussis (DTPa)</td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="d1" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="d2" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="d3" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="d4" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="d5" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="d6" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="d7" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                    </tr>
                    <tr>
                      <td align="left">Haemophilus influenza (Type B)</td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="h1" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="h2" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="h3" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="h4" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="h5" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="h6" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="h7" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                    </tr>
                    <tr>
                      <td align="left">Inactivated poliomyelitis (IPV)</td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="p1" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="p2" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="p3" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="p4" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="p5" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="p6" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="p7" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                    </tr>
                    <tr>
                      <td align="left">Pneumococcal Conjugate (7vPVC)</td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="c1" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="c2" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="c3" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="c4" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="c5" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="c6" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="c7" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                    </tr>
                    <tr>
                      <td align="left">Rotavirus</td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="r1" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="r2" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="r3" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="r4" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="r5" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="r6" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="r7" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                    </tr>
                    <tr>
                      <td align="left">Measules, mumps an rubella (MMR)</td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="m1" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="m2" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="m3" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="m4" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="m5" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="m6" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="m7" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                    </tr>
                    <tr>
                      <td align="left">Meningococcal C</td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="me1" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="me2" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="me3" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="me4" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="me5" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="me6" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="me7" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                    </tr>
                    <tr>
                      <td align="left">Varicella (VZC)</td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="v1" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="v2" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="v3" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="v4" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="v5" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="v6" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                      <td align="center">
                        <Form.Group>
                          <div className="btn-checkbox">
                            <Form.Check type="checkbox" id="v7" label="&nbsp;" />
                          </div>
                        </Form.Group>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="8">
                        Additional immunizations for Aboriginals and Torres Strait Islander Children (If required)
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              {/* <h3 className="title-xs mt-4 mb-4">Please tick the type of care you require</h3>

              <div className="grayback">
                <p>I understand that once I have booked my child/children with my educator, the above hours and days become my agreed hours during school term and/or school holidays. I understand that I will be charged for these hours whether my child attends or not.</p>
                <p>I understand that if my educator has time off or becomes sick, there will be an alternative educator ready for standby.</p>
              </div> */}

              {/* <h3 className="title-xs mt-4 mb-4">I understand and have read the following</h3>

              <div className="grayback">
                <p>Child care subsidy will be paid for a child up to age 12 years. Should a family with a child age 12+ need care and willing to claim subsidy, the family must meet certain eligibility requirement. The requirements include but not limited to: child with disability, supporting letter from health professional, letter from parents/guardian that they cannot leave their child unsupervised. Claiming subsidy doesn’t necessary mean that the child is entitled to receive benefit, however, the parent/guardian are responsible for the account should Centre Link reject the application to pay subsidy. </p>
              </div> */}

              {/* <h3 className="title-xs mt-4 mb-4">Consent for nominated assistant</h3>

              <div className="grayback">
                <p>The assistant has working with children card and First Aid qualifications & is approved by this office.</p>
              </div>

              <h4 className="title-xs mt-4 mb-4">Authorize the educator and proprietor of family day care to take the child on regular outings </h4>

              <div className="grayback">
                <p>Children will have excursion / regular outing consent form signed by parents and/or guardian.</p>
              </div> */}
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
                  {/* <div className="cta text-center mt-5 mb-5">
                    <Button variant="outline" type="submit" onClick={prevStep} className="me-3">Previous</Button>
                    <Button variant="primary" type="submit">Next</Button>
                  </div> */}
                </Form>
              </div>
            </div>
            <h2 className="title-xs mb-4">Medication Permission</h2>

            <div className="grayback">
              <p>I give consent for the educator, assistant, approved provider, nominated supervisor & coordinator to administer prescribed Medication when needed. I understand that unless all the information required on the medication form is not completed or signed the medication will not be given to my child.  I understand my educator will contact me immediately if medication such as Panadol is required.</p>
              <Form.Group className="mb-3">
                <div className="btn-checkbox">
                  <Form.Check type="checkbox" id="accept" label="I have read and accept all the above points." />
                </div>
              </Form.Group>
            </div>
            <div className="cta text-center mt-5 mb-5">
              <Button variant="outline" type="submit" onClick={prevStep} className="me-3">Previous</Button>
              <Button variant="primary" type="submit">Next</Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ChildEnrollment2;
