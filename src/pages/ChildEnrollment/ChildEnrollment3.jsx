import React, { useState } from "react";
import { Button, Col, Row, Form, Table } from "react-bootstrap";
import axios from 'axios';
import { BASE_URL } from "../../components/App";
import { useEffect } from "react";

let nextstep = 4;
let step = 3;

const ChildEnrollment3 = ({ nextStep, handleFormData, prevStep }) => {
  const [agreedBookingHours, setAgreedBookingHours] = useState({});
  const [agreedHolidayHours, setAgreedHolidayHours] = useState({});
  // const [hasEmergencyContact, setHasEmergencyContact] = useState(false);

  // const saveFormThreeData = async () => {
  //   let childId = localStorage.getItem('enrolled_child_id')
  //   let token = localStorage.getItem('token');
  //   let response = await axios.patch(`${BASE_URL}/enrollment/child/${childId}`, { form_step: nextstep }, {
  //     headers: {
  //       "Authorization": `Bearer ${token}`
  //     }
  //   });

  //   if(response.status === 201 && response.data.status === "success") {
  //     nextStep();
  //   }
  // };

  // const updateFormThreeData = async () => {
  //   nextStep();
  // }

  // const fetchChildDetailsAndPopulate = async () => {
  //   let enrolledChildId = localStorage.getItem('enrolled_child_id');
  //   let token = localStorage.getItem('token');

  //   let response = await axios.get(`${BASE_URL}/enrollment/child/${enrolledChildId}`, {
  //     headers: {
  //       "Authorization": `Bearer ${token}`
  //     }
  //   });

  //   if(response.status === 200 && response.data.status === 'success') {
  //     let { child } = response.data;

  //     if(child?.emergency_contacts) {
  //       setHasEmergencyContact(true);
  //     } 
  //   }
  // };

  const submitFormData = (e) => {
    e.preventDefault();

    // if(hasEmergencyContact) {
    //   updateFormThreeData()  
    // } else {
    //   saveFormThreeData();
    // }
  };

  // useEffect(() => {
  //   fetchChildDetailsAndPopulate();
  // }, [])

  agreedBookingHours && console.log('Agreed Hours:', agreedBookingHours);
  return (
    <>
      <div className="enrollment-form-sec">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <h2 className="title-xs mb-4">Please tick the type of care you require <small>(Agreed Booking Hours)</small></h2>
            <div className="grayback">
              <p>I understand that once I have booked my child/children with my educator, the above hours and days become my agreed hours during school term and/or school holidays.  I understand that I will be charged for these hours whether my child attends or not.
              </p>
              <p>I understand that if my educator has time off or becomes sick, there will be an alternative educator ready for standby.
              </p>
              <Table responsive="md">
                <thead>
                  <tr>
                    <th>WEEKDAYS</th>
                    <th>FROM</th>
                    <th>TO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Monday</td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          onChange={(e) => setAgreedBookingHours(prevState => ({
                            ...prevState,
                            monday: {...agreedBookingHours?.monday, from: e.target.value}
                          }))} />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          onChange={(e) => setAgreedBookingHours(prevState => ({
                            ...prevState,
                            monday: {...agreedBookingHours?.monday, to: e.target.value}
                          }))} />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Tuesday</td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          onChange={(e) => setAgreedBookingHours(prevState => ({
                            ...prevState,
                            tuesday: {...agreedBookingHours?.tuesday, from: e.target.value}
                          }))} />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          onChange={(e) => setAgreedBookingHours(prevState => ({
                            ...prevState,
                            tuesday: {...agreedBookingHours?.tuesday, to: e.target.value}
                          }))} />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Wednesday</td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          onChange={(e) => setAgreedBookingHours(prevState => ({
                            ...prevState,
                            wednesday: {...agreedBookingHours?.wednesday, from: e.target.value}
                          }))} />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          onChange={(e) => setAgreedBookingHours(prevState => ({
                            ...prevState,
                            wednesday: {...agreedBookingHours?.wednesday, to: e.target.value}
                          }))} />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Thursday</td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          onChange={(e) => setAgreedBookingHours(prevState => ({
                            ...prevState,
                            thursday: {...agreedBookingHours?.thursday, from: e.target.value}
                          }))} />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          onChange={(e) => setAgreedBookingHours(prevState => ({
                            ...prevState,
                            thursday: {...agreedBookingHours?.thursday, to: e.target.value}
                          }))} />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Friday</td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          onChange={(e) => setAgreedBookingHours(prevState => ({
                            ...prevState,
                            friday: {...agreedBookingHours?.friday, from: e.target.value}
                          }))} />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          onChange={(e) => setAgreedBookingHours(prevState => ({
                            ...prevState,
                            friday: {...agreedBookingHours?.friday, to: e.target.value}
                          }))} />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Saturday</td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          onChange={(e) => setAgreedBookingHours(prevState => ({
                            ...prevState,
                            saturday: {...agreedBookingHours?.saturday, from: e.target.value}
                          }))} />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          onChange={(e) => setAgreedBookingHours(prevState => ({
                            ...prevState,
                            saturday: {...agreedBookingHours?.saturday, to: e.target.value}
                          }))} />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Sunday</td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          onChange={(e) => setAgreedBookingHours(prevState => ({
                            ...prevState,
                            sunday: {...agreedBookingHours?.sunday, from: e.target.value}
                          }))} />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          onChange={(e) => setAgreedBookingHours(prevState => ({
                            ...prevState,
                            sunday: {...agreedBookingHours?.sunday, to: e.target.value}
                          }))} />
                      </Form.Group>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>

            <h3 className="title-xs mt-4 mb-4">School Holidays Agreed Booking Hours</h3>

            <Row>
              <Col md={12}>
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
                            <Form.Control 
                              type="time"
                              onChange={(e) => setAgreedHolidayHours(prevState => ({
                                ...prevState,
                                monday: {...agreedHolidayHours?.monday, from: e.target.value}
                              }))} />
                          </Form.Group>
                        </td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              onChange={(e) => setAgreedHolidayHours(prevState => ({
                                ...prevState,
                                monday: {...agreedHolidayHours?.monday, to: e.target.value}
                              }))} />
                          </Form.Group>
                        </td>
                      </tr>
                      <tr>
                        <td>Tuesday</td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              onChange={(e) => setAgreedHolidayHours(prevState => ({
                                ...prevState,
                                monday: {...agreedHolidayHours?.monday, from: e.target.value}
                              }))} />
                          </Form.Group>
                        </td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              onChange={(e) => setAgreedHolidayHours(prevState => ({
                                ...prevState,
                                monday: {...agreedHolidayHours?.monday, to: e.target.value}
                              }))} />
                          </Form.Group>
                        </td>
                      </tr>
                      <tr>
                        <td>Wednesday</td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              onChange={(e) => setAgreedHolidayHours(prevState => ({
                                ...prevState,
                                monday: {...agreedHolidayHours?.monday, from: e.target.value}
                              }))} />
                          </Form.Group>
                        </td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              onChange={(e) => setAgreedHolidayHours(prevState => ({
                                ...prevState,
                                monday: {...agreedHolidayHours?.monday, to: e.target.value}
                              }))} />
                          </Form.Group>
                        </td>
                      </tr>
                      <tr>
                        <td>Thursday</td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              onChange={(e) => setAgreedHolidayHours(prevState => ({
                                ...prevState,
                                monday: {...agreedHolidayHours?.monday, from: e.target.value}
                              }))} />
                          </Form.Group>
                        </td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              onChange={(e) => setAgreedHolidayHours(prevState => ({
                                ...prevState,
                                monday: {...agreedHolidayHours?.monday, to: e.target.value}
                              }))} />
                          </Form.Group>
                        </td>
                      </tr>
                      <tr>
                        <td>Friday</td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              onChange={(e) => setAgreedHolidayHours(prevState => ({
                                ...prevState,
                                monday: {...agreedHolidayHours?.monday, from: e.target.value}
                              }))} />
                          </Form.Group>
                        </td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              onChange={(e) => setAgreedHolidayHours(prevState => ({
                                ...prevState,
                                monday: {...agreedHolidayHours?.monday, to: e.target.value}
                              }))} />
                          </Form.Group>
                        </td>
                      </tr>
                      <tr>
                        <td>Saturday</td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              onChange={(e) => setAgreedHolidayHours(prevState => ({
                                ...prevState,
                                monday: {...agreedHolidayHours?.monday, from: e.target.value}
                              }))} />
                          </Form.Group>
                        </td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              onChange={(e) => setAgreedHolidayHours(prevState => ({
                                ...prevState,
                                monday: {...agreedHolidayHours?.monday, to: e.target.value}
                              }))} />
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
            <Button variant="outline" type="submit" onClick={() => prevStep()} className="me-3">Previous</Button>
            <Button variant="primary" type="submit">Next</Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ChildEnrollment3;
