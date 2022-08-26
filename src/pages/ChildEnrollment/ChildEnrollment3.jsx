import React, { useState, useEffect } from "react";
import { Button, Col, Row, Form, Table } from "react-bootstrap";
import axios from 'axios';
import { BASE_URL } from "../../components/App";

let nextstep = 4;
let current_step = 3;
let days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const ChildEnrollment3 = ({ nextStep, handleFormData, prevStep }) => {
  const [agreedBookingHours, setAgreedBookingHours] = useState({
    // monday: {from: "", to: ""},
    // tuesday: {from: "", to: ""},
    // wednesday: {from: "", to: ""},
    // thursday: {from: "", to: ""},
    // friday: {from: "", to: ""},
    // saturday: {from: "", to: ""},
    // sunday: {from: "", to: ""}
    log: []
  });
  const [agreedHolidayHours, setAgreedHolidayHours] = useState({
    // monday: {from: "", to: ""},
    // tuesday: {from: "", to: ""},
    // wednesday: {from: "", to: ""},
    // thursday: {from: "", to: ""},
    // friday: {from: "", to: ""},
    // saturday: {from: "", to: ""},
    // sunday: {from: "", to: ""}
    log: []
  });
  const [formStepData, setFormStepData] = useState(current_step);
  const [idList, setIdList] = useState({});
  const [loader, setLoader] = useState(false);

  const updateFormThreeData = async () => {
    setLoader(true);
    console.log('UPDATING THE EXISTING DATA');
    let token = localStorage.getItem('token');
    let response = await axios.patch(`${BASE_URL}/enrollment/holiday-hours/${idList.holiday_hours_id}`, { ...agreedHolidayHours }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if(response.status === 201 && response.data.status === "success") {
      response = await axios.patch(`${BASE_URL}/enrollment/booking-hours/${idList.booking_hours_id}`, { ...agreedBookingHours }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if(response.status === 201 && response.data.status === "success") {
        let changeCount = localStorage.getItem('change_count');

        if(agreedBookingHours.log.length > 0)
          changeCount++;

        if(agreedHolidayHours.log.length > 0)
          changeCount++;
        
        localStorage.setItem('change_count', changeCount);
        setLoader(false);
        nextStep();
      }
    }
  };

  const saveFormThreeData = async () => {
    setLoader(true);
    console.log('SAVING FORM THREE DATA');
    let enrolledChildId = localStorage.getItem('enrolled_child_id');
    let token = localStorage.getItem('token');
    let response = await axios.post(`${BASE_URL}/enrollment/holiday-hours`, { ...agreedHolidayHours, childId: enrolledChildId }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if(response.status === 201 && response.data.status === "success") {
      response = await axios.post(`${BASE_URL}/enrollment/booking-hours`, { ...agreedBookingHours, childId: enrolledChildId }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if(response.status === 201 && response.data.status === "success") {
        response = await axios.patch(`${BASE_URL}/enrollment/child/${enrolledChildId}`, {form_step: nextstep}, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if(response.status === 201 && response.data.status === "success") {
          setLoader(false);
          nextStep();
        }
      }
    }
  };

  const fetchChildDetailsAndPopulate = async () => {
    let enrolledChildId = localStorage.getItem('enrolled_child_id');
    let token = localStorage.getItem('token');

    let response = await axios.get(`${BASE_URL}/enrollment/child/${enrolledChildId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if(response.status === 200 && response.data.status === 'success') {
      let { child } = response.data;
      let { agreed_booking_hour: b_hour, agreed_holiday_hour: h_hour } = child;

      if(child.form_step > current_step) {
        for(let [key, value] of Object.entries(b_hour)) {
          if(days.includes(key)) {
            setAgreedBookingHours(prevState => ({
              ...prevState,
              [key]: {...value}
            }));
          }
        }
        setIdList(prevState => ({
          ...prevState,
          booking_hours_id: b_hour.id
        }));

        for(let [key, value] of Object.entries(h_hour)) {
          if(days.includes(key)) {
            setAgreedHolidayHours(prevState => ({
              ...prevState,
              [key]: {...value}
            }));
          }
        }
        setIdList(prevState => ({
          ...prevState,
          holiday_hours_id: h_hour.id
        }));

        setFormStepData(child.form_step);
      }
    }
  };

  const submitFormData = (e) => {
    e.preventDefault();
    if(formStepData > current_step) {
      console.log('UPDATING THE EXISTING DATA!');
      updateFormThreeData();
    } else {
      console.log('CREATING NEW DATA!')
      saveFormThreeData();
    }
  };

  useEffect(() => {
    fetchChildDetailsAndPopulate();
  }, [])

  agreedBookingHours && console.log('Agreed Hours:', agreedBookingHours);
  agreedHolidayHours && console.log('Agreed Holiday Hours:', agreedHolidayHours);
  return (
    <>
      <div className="enrollment-form-sec error-sec">
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
                          // value={agreedBookingHours?.monday || ""}
                          value={agreedBookingHours?.monday?.from || ""}
                          onChange={(e) => {
                            setAgreedBookingHours(prevState => ({
                              ...prevState,
                              monday: {...agreedBookingHours?.monday, from: e.target.value}
                            }));

                            if(!agreedBookingHours.log.includes("monday")) {
                              setAgreedBookingHours(prevState => ({
                                ...prevState,
                                log: [...agreedBookingHours.log, "monday"]
                              }))
                            }
                          }} />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          value={agreedBookingHours?.monday?.to || ""}
                          onChange={(e) => {
                            setAgreedBookingHours(prevState => ({
                              ...prevState,
                              monday: {...agreedBookingHours?.monday, to: e.target.value}
                            }));

                            if(!agreedBookingHours.log.includes("monday")) {
                              setAgreedBookingHours(prevState => ({
                                ...prevState,
                                log: [...agreedBookingHours.log, "monday"]
                              }))
                            }
                          }} />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Tuesday</td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          value={agreedBookingHours?.tuesday?.from || ""}
                          onChange={(e) => {
                            setAgreedBookingHours(prevState => ({
                              ...prevState,
                              tuesday: {...agreedBookingHours?.tuesday, from: e.target.value}
                            }));

                            if(!agreedBookingHours.log.includes("tuesday")) {
                              setAgreedBookingHours(prevState => ({
                                ...prevState,
                                log: [...agreedBookingHours.log, "tuesday"]
                              }))
                            }
                          }} />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          value={agreedBookingHours?.tuesday?.to || ""}
                          onChange={(e) => {
                            setAgreedBookingHours(prevState => ({
                              ...prevState,
                              tuesday: {...agreedBookingHours?.tuesday, to: e.target.value}
                            }));

                            if(!agreedBookingHours.log.includes("tuesday")) {
                              setAgreedBookingHours(prevState => ({
                                ...prevState,
                                log: [...agreedBookingHours.log, "tuesday"]
                              }))
                            }
                          }} />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Wednesday</td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          value={agreedBookingHours?.wednesday?.from || ""}
                          onChange={(e) => {
                            setAgreedBookingHours(prevState => ({
                              ...prevState,
                              wednesday: {...agreedBookingHours?.wednesday, from: e.target.value}
                            }));

                            if(!agreedBookingHours.log.includes("wednesday")) {
                              setAgreedBookingHours(prevState => ({
                                ...prevState,
                                log: [...agreedBookingHours.log, "wednesday"]
                              }))
                            }
                          }} />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          value={agreedBookingHours?.wednesday?.to || ""}
                          onChange={(e) => {
                            setAgreedBookingHours(prevState => ({
                              ...prevState,
                              wednesday: {...agreedBookingHours?.wednesday, to: e.target.value}
                            }));

                            if(!agreedBookingHours.log.includes("wednesday")) {
                              setAgreedBookingHours(prevState => ({
                                ...prevState,
                                log: [...agreedBookingHours.log, "wednesday"]
                              }))
                            }
                          }} />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Thursday</td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          value={agreedBookingHours?.thursday?.from || ""}
                          onChange={(e) => {
                            setAgreedBookingHours(prevState => ({
                              ...prevState,
                              thursday: {...agreedBookingHours?.thursday, from: e.target.value}
                            }));

                            if(!agreedBookingHours.log.includes("thursday")) {
                              setAgreedBookingHours(prevState => ({
                                ...prevState,
                                log: [...agreedBookingHours.log, "thursday"]
                              }))
                            }
                          }} />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          value={agreedBookingHours?.thursday?.to || ""}
                          onChange={(e) => {
                            setAgreedBookingHours(prevState => ({
                              ...prevState,
                              thursday: {...agreedBookingHours?.thursday, to: e.target.value}
                            }));

                            if(!agreedBookingHours.log.includes("thursday")) {
                              setAgreedBookingHours(prevState => ({
                                ...prevState,
                                log: [...agreedBookingHours.log, "thursday"]
                              }))
                            }
                          }} />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Friday</td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          value={agreedBookingHours?.friday?.from || ""}
                          onChange={(e) => {
                            setAgreedBookingHours(prevState => ({
                              ...prevState,
                              friday: {...agreedBookingHours?.friday, from: e.target.value}
                            }));

                            if(!agreedBookingHours.log.includes("friday")) {
                              setAgreedBookingHours(prevState => ({
                                ...prevState,
                                log: [...agreedBookingHours.log, "friday"]
                              }))
                            }
                          }} />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          value={agreedBookingHours?.friday?.to || ""}
                          onChange={(e) => {
                            setAgreedBookingHours(prevState => ({
                              ...prevState,
                              friday: {...agreedBookingHours?.friday, to: e.target.value}
                            }));

                            if(!agreedBookingHours.log.includes("friday")) {
                              setAgreedBookingHours(prevState => ({
                                ...prevState,
                                log: [...agreedBookingHours.log, "friday"]
                              }))
                            }
                          }} />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Saturday</td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          value={agreedBookingHours?.saturday?.from || ""}
                          onChange={(e) => {
                            setAgreedBookingHours(prevState => ({
                              ...prevState,
                              saturday: {...agreedBookingHours?.saturday, from: e.target.value}
                            }));

                            if(!agreedBookingHours.log.includes("saturday")) {
                              setAgreedBookingHours(prevState => ({
                                ...prevState,
                                log: [...agreedBookingHours.log, "saturday"]
                              }))
                            }
                          }} />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          value={agreedBookingHours?.saturday?.to || ""}
                          onChange={(e) => {
                            setAgreedBookingHours(prevState => ({
                              ...prevState,
                              saturday: {...agreedBookingHours?.saturday, to: e.target.value}
                            }));

                            if(!agreedBookingHours.log.includes("saturday")) {
                              setAgreedBookingHours(prevState => ({
                                ...prevState,
                                log: [...agreedBookingHours.log, "saturday"]
                              }))
                            }
                          }} />
                      </Form.Group>
                    </td>
                  </tr>
                  <tr>
                    <td>Sunday</td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          value={agreedBookingHours?.sunday?.from || ""}
                          onChange={(e) => {
                            setAgreedBookingHours(prevState => ({
                              ...prevState,
                              sunday: {...agreedBookingHours?.sunday, from: e.target.value}
                            }));

                            if(!agreedBookingHours.log.includes("sunday")) {
                              setAgreedBookingHours(prevState => ({
                                ...prevState,
                                log: [...agreedBookingHours.log, "sunday"]
                              }))
                            }
                          }} />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control 
                          type="time"
                          value={agreedBookingHours?.sunday?.to || ""}
                          onChange={(e) => {
                            setAgreedBookingHours(prevState => ({
                              ...prevState,
                              sunday: {...agreedBookingHours?.sunday, to: e.target.value}
                            }));

                            if(!agreedBookingHours.log.includes("sunday")) {
                              setAgreedBookingHours(prevState => ({
                                ...prevState,
                                log: [...agreedBookingHours.log, "sunday"]
                              }))
                            }
                          }} />
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
                              value={agreedHolidayHours?.monday?.from || ""}
                              onChange={(e) => {
                                setAgreedHolidayHours(prevState => ({
                                  ...prevState,
                                  monday: {...agreedHolidayHours?.monday, from: e.target.value}
                                }));

                                if(!agreedHolidayHours.log.includes("monday")) {
                                  setAgreedHolidayHours(prevState => ({
                                    ...prevState,
                                    log: [...agreedHolidayHours.log, "monday"]
                                  }))
                                }
                              }} />
                          </Form.Group>
                        </td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              value={agreedHolidayHours?.monday?.to || ""}
                              onChange={(e) => {
                                setAgreedHolidayHours(prevState => ({
                                  ...prevState,
                                  monday: {...agreedHolidayHours?.monday, to: e.target.value}
                                }));

                                if(!agreedHolidayHours.log.includes("monday")) {
                                  setAgreedHolidayHours(prevState => ({
                                    ...prevState,
                                    log: [...agreedHolidayHours.log, "monday"]
                                  }))
                                }
                              }} />
                          </Form.Group>
                        </td>
                      </tr>
                      <tr>
                        <td>Tuesday</td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              value={agreedHolidayHours?.tuesday?.from || ""}
                              onChange={(e) => {
                                setAgreedHolidayHours(prevState => ({
                                  ...prevState,
                                  tuesday: {...agreedHolidayHours?.tuesday, from: e.target.value}
                                }));

                                if(!agreedHolidayHours.log.includes("tuesday")) {
                                  setAgreedHolidayHours(prevState => ({
                                    ...prevState,
                                    log: [...agreedHolidayHours.log, "tuesday"]
                                  }))
                                }
                              }} />
                          </Form.Group>
                        </td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              value={agreedHolidayHours?.tuesday?.to || ""}
                              onChange={(e) => {
                                setAgreedHolidayHours(prevState => ({
                                  ...prevState,
                                  tuesday: {...agreedHolidayHours?.tuesday, to: e.target.value}
                                }));

                                if(!agreedHolidayHours.log.includes("tuesday")) {
                                  setAgreedHolidayHours(prevState => ({
                                    ...prevState,
                                    log: [...agreedHolidayHours.log, "tuesday"]
                                  }))
                                }
                              }} />
                          </Form.Group>
                        </td>
                      </tr>
                      <tr>
                        <td>Wednesday</td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              value={agreedHolidayHours?.wednesday?.from || ""}
                              onChange={(e) => {
                                setAgreedHolidayHours(prevState => ({
                                  ...prevState,
                                  wednesday: {...agreedHolidayHours?.wednesday, from: e.target.value}
                                }));

                                if(!agreedHolidayHours.log.includes("wednesday")) {
                                  setAgreedHolidayHours(prevState => ({
                                    ...prevState,
                                    log: [...agreedHolidayHours.log, "wednesday"]
                                  }))
                                }
                              }} />
                          </Form.Group>
                        </td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              value={agreedHolidayHours?.wednesday?.to || ""}
                              onChange={(e) => {
                                setAgreedHolidayHours(prevState => ({
                                  ...prevState,
                                  wednesday: {...agreedHolidayHours?.wednesday, to: e.target.value}
                                }));

                                if(!agreedHolidayHours.log.includes("wednesday")) {
                                  setAgreedHolidayHours(prevState => ({
                                    ...prevState,
                                    log: [...agreedHolidayHours.log, "wednesday"]
                                  }))
                                }
                              }} />
                          </Form.Group>
                        </td>
                      </tr>
                      <tr>
                        <td>Thursday</td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              value={agreedHolidayHours?.thursday?.from || ""}
                              onChange={(e) => {
                                setAgreedHolidayHours(prevState => ({
                                  ...prevState,
                                  thursday: {...agreedHolidayHours?.thursday, from: e.target.value}
                                }));

                                if(!agreedHolidayHours.log.includes("thursday")) {
                                  setAgreedHolidayHours(prevState => ({
                                    ...prevState,
                                    log: [...agreedHolidayHours.log, "thursday"]
                                  }))
                                }
                              }} />
                          </Form.Group>
                        </td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              value={agreedHolidayHours?.thursday?.to || ""}
                              onChange={(e) => {
                                setAgreedHolidayHours(prevState => ({
                                  ...prevState,
                                  thursday: {...agreedHolidayHours?.thursday, to: e.target.value}
                                }));

                                if(!agreedHolidayHours.log.includes("thursday")) {
                                  setAgreedHolidayHours(prevState => ({
                                    ...prevState,
                                    log: [...agreedHolidayHours.log, "thursday"]
                                  }))
                                }
                              }} />
                          </Form.Group>
                        </td>
                      </tr>
                      <tr>
                        <td>Friday</td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              value={agreedHolidayHours?.friday?.from || ""}
                              onChange={(e) => {
                                setAgreedHolidayHours(prevState => ({
                                  ...prevState,
                                  friday: {...agreedHolidayHours?.friday, from: e.target.value}
                                }));

                                if(!agreedHolidayHours.log.includes("friday")) {
                                  setAgreedHolidayHours(prevState => ({
                                    ...prevState,
                                    log: [...agreedHolidayHours.log, "friday"]
                                  }))
                                }
                              }} />
                          </Form.Group>
                        </td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              value={agreedHolidayHours?.friday?.to || ""}
                              onChange={(e) => {
                                setAgreedHolidayHours(prevState => ({
                                  ...prevState,
                                  friday: {...agreedHolidayHours?.friday, to: e.target.value}
                                }));

                                if(!agreedHolidayHours.log.includes("friday")) {
                                  setAgreedHolidayHours(prevState => ({
                                    ...prevState,
                                    log: [...agreedHolidayHours.log, "friday"]
                                  }))
                                }
                              }} />
                          </Form.Group>
                        </td>
                      </tr>
                      <tr>
                        <td>Saturday</td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              value={agreedHolidayHours?.saturday?.from || ""}
                              onChange={(e) => {
                                setAgreedHolidayHours(prevState => ({
                                  ...prevState,
                                  saturday: {...agreedHolidayHours?.saturday, from: e.target.value}
                                }));

                                if(!agreedHolidayHours.log.includes("saturday")) {
                                  setAgreedHolidayHours(prevState => ({
                                    ...prevState,
                                    log: [...agreedHolidayHours.log, "saturday"]
                                  }))
                                }
                              }} />
                          </Form.Group>
                        </td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              value={agreedHolidayHours?.saturday?.to || ""}
                              onChange={(e) => {
                                setAgreedHolidayHours(prevState => ({
                                  ...prevState,
                                  saturday: {...agreedHolidayHours?.saturday, to: e.target.value}
                                }));

                                if(!agreedHolidayHours.log.includes("saturday")) {
                                  setAgreedHolidayHours(prevState => ({
                                    ...prevState,
                                    log: [...agreedHolidayHours.log, "saturday"]
                                  }))
                                }
                              }} />
                          </Form.Group>
                        </td>
                      </tr>
                      <tr>
                        <td>Sunday</td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              value={agreedHolidayHours?.sunday?.from || ""}
                              onChange={(e) => {
                                setAgreedHolidayHours(prevState => ({
                                  ...prevState,
                                  sunday: {...agreedHolidayHours?.sunday, from: e.target.value}
                                }));

                                if(!agreedHolidayHours.log.includes("sunday")) {
                                  setAgreedHolidayHours(prevState => ({
                                    ...prevState,
                                    log: [...agreedHolidayHours.log, "sunday"]
                                  }))
                                }
                              }} />
                          </Form.Group>
                        </td>
                        <td>
                          <Form.Group>
                            <Form.Control 
                              type="time"
                              value={agreedHolidayHours?.sunday?.to || ""}
                              onChange={(e) => {
                                setAgreedHolidayHours(prevState => ({
                                  ...prevState,
                                  sunday: {...agreedHolidayHours?.sunday, to: e.target.value}
                                }));

                                if(!agreedHolidayHours.log.includes("sunday")) {
                                  setAgreedHolidayHours(prevState => ({
                                    ...prevState,
                                    log: [...agreedHolidayHours.log, "sunday"]
                                  }))
                                }
                              }} />
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
            <Button variant="outline" type="submit" onClick={() => prevStep()} className="me-3">Go Back</Button>
            <Button 
              variant="primary" 
              disabled={loader ? true : false}
              type="submit">
              {loader === true ? (
                <>
                  <img
                  style={{ width: '24px' }}
                  src={'/img/mini_loader1.gif'}
                  alt=""
                  />
                    Submitting...
                </>
              ) : (
              'Submit')}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ChildEnrollment3;
