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
            <h2 className="title-xs mb-4">Please tick the type of care you require <small>(Agreed Booking Hours)</small></h2>
            
            <div className="grayback">
              <Table responsive="md">
                <thead>
                  <tr>
                    <th>WEEKDAYS</th>
                    <th>AM</th>
                    <th>AM</th>
                    <th>PM</th>
                    <th>PM</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Monday</td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Tuesday</td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Wednesday</td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Thursday</td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Friday</td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Saturday</td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Sunday</td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
            
            <h3 className="title-xs mt-4 mb-4">School Holidays Agreed Booking Hours</h3>
            
            <Row>
              <Col md={7}>
                <div className="grayback">
              <Table responsive="md">
                <thead>
                  <tr>
                    <th>WEEKDAYS</th>
                    <th>AM</th>
                    <th>PM</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Monday</td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Tuesday</td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Wednesday</td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Thursday</td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Friday</td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Saturday</td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Sunday</td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control type="time" />
                      </Form.Group>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
              </Col>
            </Row>
            
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

export default ChildEnrollment4;
