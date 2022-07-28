import React, { useState } from "react";
import { Button, Col, Row, Form, Table } from "react-bootstrap";

let nextstep = 8;
let step = 7;

const ChildEnrollment7 = ({ nextStep, handleFormData, prevStep }) => {
  const submitFormData = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <>
      <div className="enrollment-form-sec">
        <Form onSubmit={submitFormData}>
          <h2 className="title-xs mb-4">Information about the child</h2>

          <div className="grayback">
            <p>A parent or guardian who has lawful authority in relation to the child must complete this form. Licensed children’s services may use this form to collect the child’s enrolment information as required in the Children’s Service’s Regulations 2017 and education and care services national law act 2010. Based on these regulations, parents are not required to fill questions marked with an asterisk, however, it will be highly important for the service to have those details.</p>
          </div>
          <h2 className="title-xs mt-4 mb-4">Court orders relating to the child</h2>

          <div className="grayback">
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
          </div>
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
          <h2 className="title-xs mb-4 mt-4">Please tick the type of care you require <small>(Agreed Booking Hours)</small></h2>
          <div className="grayback">
            I understand that once I have booked my child/children with my educator, the above hours and days become my agreed hours during school term and/or school holidays.  I understand that I will be charged for these hours whether my child attends or not.

            I understand that if my educator has time off or becomes sick, there will be an alternative educator ready for standby.
          </div>
          <h3 className="title-xs mt-4 mb-4">I understand and have read the following</h3>

          <div className="grayback">
            <p>Child care subsidy will be paid for a child up to age 12 years. Should a family with a child age 12+ need care and willing to claim subsidy, the family must meet certain eligibility requirement. The requirements include but not limited to: child with disability, supporting letter from health professional, letter from parents/guardian that they cannot leave their child unsupervised. Claiming subsidy doesn’t necessary mean that the child is entitled to receive benefit, however, the parent/guardian are responsible for the account should Centre Link reject the application to pay subsidy. </p>
          </div>
          <h3 className="title-xs mt-4 mb-4">Consent for nominated assistant</h3>

          <div className="grayback">
            <p>The assistant has working with children card and First Aid qualifications & is approved by this office.  </p>
          </div>
          <h3 className="title-xs mt-4 mb-4">Authorize the educator and proprietor of family day care to take the child on regular outings </h3>

          <div className="grayback">
            <p>Children will have excursion / regular outing consent form signed by parents and/or guardian. </p>
          </div>
          {/* <div className="enrollment-form-column">
            <h2 className="title-xs mb-4">Authorized person: R 160 (3) (b) (iv)</h2>
            
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

export default ChildEnrollment7;
