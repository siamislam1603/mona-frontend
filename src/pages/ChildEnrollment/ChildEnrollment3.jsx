import React, { useState, useEffect } from "react";
import { Button, Col, Row, Form, Table } from "react-bootstrap";
import axios from 'axios';
import { BASE_URL } from "../../components/App";
import { useParams } from 'react-router-dom';
import moment from "moment";

let nextstep = 4;
let current_step = 3;
let days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];


// HELPER FUNCTION TO CHECK ERRORS
function checkErrorsExist(errorObject) {
  let arr =  Object.values(errorObject);
  var filteredError = arr.filter(d => d.to !== null);
  return filteredError.length > 0;  
}

const ChildEnrollment3 = ({ nextStep, handleFormData, prevStep }) => {
  let { childId: paramsChildId, parentId: paramsParentId } = useParams();
  console.log('FORM NUMBER:=>>>>>>>>>>>>>>>>>>>>', 3);
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

  // ERRORS
  const [bookingHoursErrors, setBookingHoursErrors] = useState({});
  const [holidayHoursErrors, setHolidayHoursErrors] = useState({});

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

    let response = await axios.get(`${BASE_URL}/enrollment/child/${enrolledChildId}?parentId=${paramsParentId}`, {
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

    if(checkErrorsExist(bookingHoursErrors) === false && checkErrorsExist(holidayHoursErrors) === false) {
      if(formStepData > current_step) {
        console.log('UPDATING THE EXISTING DATA!');
        updateFormThreeData();
      } else {
        console.log('CREATING NEW DATA!')
        saveFormThreeData();
      }
    } else {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchChildDetailsAndPopulate();
  }, [])

  // agreedBookingHours && console.log('Agreed Hours:', agreedBookingHours);
  // agreedHolidayHours && console.log('Agreed Holiday Hours:', agreedHolidayHours);
  bookingHoursErrors && console.log('BOOKING HOURS ERROR:', checkErrorsExist(bookingHoursErrors));
  holidayHoursErrors && console.log('HOLIDAY HOURS ERROR:', checkErrorsExist(holidayHoursErrors));

  console.log('IS After:', moment(agreedBookingHours?.monday?.from, 'HH:mm').isAfter(moment(agreedBookingHours?.monday?.to, 'HH:mm')))
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
                          // className={bookingHoursErrors?.monday?.to ? "error-border" : ""}
                          type="time"
                          style={bookingHoursErrors?.monday?.to ? { border: "1px solid red", backgroundColor: '#FF634740',  } : {}}
                          value={agreedBookingHours?.monday?.to || ""}
                          onChange={(e) => {
                            if(moment(agreedBookingHours?.monday?.from, 'HH:mm').isAfter(moment(e.target.value, 'HH:mm'))) {
                              setBookingHoursErrors(prevState => ({
                                ...prevState,
                                monday: {
                                  to: "Time should be lesser than \"From\""
                                }
                              }))
                            } else {
                              setBookingHoursErrors(prevState => ({
                                ...prevState,
                                monday: {
                                  to: null
                                }
                              }))
                            }

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
                          style={bookingHoursErrors?.tuesday?.to ? { border: "1px solid red", backgroundColor: '#FF634740',  } : {}}
                          value={agreedBookingHours?.tuesday?.to || ""}
                          onChange={(e) => {
                            if(moment(agreedBookingHours?.tuesday?.from, 'HH:mm').isAfter(moment(e.target.value, 'HH:mm'))) {
                              setBookingHoursErrors(prevState => ({
                                ...prevState,
                                tuesday: {
                                  to: "Time should be lesser than \"From\""
                                }
                              }))
                            } else {
                              setBookingHoursErrors(prevState => ({
                                ...prevState,
                                tuesday: {
                                  to: null
                                }
                              }))
                            }

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
                          style={bookingHoursErrors?.wednesday?.to ? { border: "1px solid red", backgroundColor: '#FF634740',  } : {}}
                          value={agreedBookingHours?.wednesday?.to || ""}
                          onChange={(e) => {
                            if(moment(agreedBookingHours?.wednesday?.from, 'HH:mm').isAfter(moment(e.target.value, 'HH:mm'))) {
                              setBookingHoursErrors(prevState => ({
                                ...prevState,
                                wednesday: {
                                  to: "Time should be lesser than \"From\""
                                }
                              }))
                            } else {
                              setBookingHoursErrors(prevState => ({
                                ...prevState,
                                wednesday: {
                                  to: null
                                }
                              }))
                            }

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
                          style={bookingHoursErrors?.thursday?.to ? { border: "1px solid red", backgroundColor: '#FF634740',  } : {}}
                          value={agreedBookingHours?.thursday?.to || ""}
                          onChange={(e) => {
                            if(moment(agreedBookingHours?.thursday?.from, 'HH:mm').isAfter(moment(e.target.value, 'HH:mm'))) {
                              setBookingHoursErrors(prevState => ({
                                ...prevState,
                                thursday: {
                                  to: "Time should be lesser than \"From\""
                                }
                              }))
                            } else {
                              setBookingHoursErrors(prevState => ({
                                ...prevState,
                                thursday: {
                                  to: null
                                }
                              }))
                            }

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
                          style={bookingHoursErrors?.friday?.to ? { border: "1px solid red", backgroundColor: '#FF634740',  } : {}}
                          value={agreedBookingHours?.friday?.to || ""}
                          onChange={(e) => {
                            if(moment(agreedBookingHours?.friday?.from, 'HH:mm').isAfter(moment(e.target.value, 'HH:mm'))) {
                              setBookingHoursErrors(prevState => ({
                                ...prevState,
                                friday: {
                                  to: "Time should be lesser than \"From\""
                                }
                              }))
                            } else {
                              setBookingHoursErrors(prevState => ({
                                ...prevState,
                                friday: {
                                  to: null
                                }
                              }))
                            }

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
                          style={bookingHoursErrors?.saturday?.to ? { border: "1px solid red", backgroundColor: '#FF634740',  } : {}}
                          value={agreedBookingHours?.saturday?.to || ""}
                          onChange={(e) => {
                            if(moment(agreedBookingHours?.saturday?.from, 'HH:mm').isAfter(moment(e.target.value, 'HH:mm'))) {
                              setBookingHoursErrors(prevState => ({
                                ...prevState,
                                saturday: {
                                  to: "Time should be lesser than \"From\""
                                }
                              }))
                            } else {
                              setBookingHoursErrors(prevState => ({
                                ...prevState,
                                saturday: {
                                  to: null
                                }
                              }))
                            }

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
                          style={bookingHoursErrors?.sunday?.to ? { border: "1px solid red", backgroundColor: '#FF634740',  } : {}}
                          value={agreedBookingHours?.sunday?.to || ""}
                          onChange={(e) => {
                            if(moment(agreedBookingHours?.sunday?.from, 'HH:mm').isAfter(moment(e.target.value, 'HH:mm'))) {
                              setBookingHoursErrors(prevState => ({
                                ...prevState,
                                sunday: {
                                  to: "Time should be lesser than \"From\""
                                }
                              }))
                            } else {
                              setBookingHoursErrors(prevState => ({
                                ...prevState,
                                sunday: {
                                  to: null
                                }
                              }))
                            }

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
                              style={holidayHoursErrors?.monday?.to ? { border: "1px solid red", backgroundColor: '#FF634740',  } : {}}
                              onChange={(e) => {
                                if(moment(agreedHolidayHours?.monday?.from, 'HH:mm').isAfter(moment(e.target.value, 'HH:mm'))) {
                                  setHolidayHoursErrors(prevState => ({
                                    ...prevState,
                                    monday: {
                                      to: "Time should be lesser than \"From\""
                                    }
                                  }))
                                } else {
                                  setHolidayHoursErrors(prevState => ({
                                    ...prevState,
                                    monday: {
                                      to: null
                                    }
                                  }))
                                }
    
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
                              style={holidayHoursErrors?.tuesday?.to ? { border: "1px solid red", backgroundColor: '#FF634740',  } : {}}
                              onChange={(e) => {
                                if(moment(agreedHolidayHours?.tuesday?.from, 'HH:mm').isAfter(moment(e.target.value, 'HH:mm'))) {
                                  setHolidayHoursErrors(prevState => ({
                                    ...prevState,
                                    tuesday: {
                                      to: "Time should be lesser than \"From\""
                                    }
                                  }))
                                } else {
                                  setHolidayHoursErrors(prevState => ({
                                    ...prevState,
                                    tuesday: {
                                      to: null
                                    }
                                  }))
                                }

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
                              style={holidayHoursErrors?.wednesday?.to ? { border: "1px solid red", backgroundColor: '#FF634740',  } : {}}
                              onChange={(e) => {
                                if(moment(agreedHolidayHours?.wednesday?.from, 'HH:mm').isAfter(moment(e.target.value, 'HH:mm'))) {
                                  setHolidayHoursErrors(prevState => ({
                                    ...prevState,
                                    wednesday: {
                                      to: "Time should be lesser than \"From\""
                                    }
                                  }))
                                } else {
                                  setHolidayHoursErrors(prevState => ({
                                    ...prevState,
                                    wednesday: {
                                      to: null
                                    }
                                  }))
                                }

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
                              style={holidayHoursErrors?.thursday?.to ? { border: "1px solid red", backgroundColor: '#FF634740',  } : {}}
                              onChange={(e) => {
                                if(moment(agreedHolidayHours?.thursday?.from, 'HH:mm').isAfter(moment(e.target.value, 'HH:mm'))) {
                                  setHolidayHoursErrors(prevState => ({
                                    ...prevState,
                                    thursday: {
                                      to: "Time should be lesser than \"From\""
                                    }
                                  }))
                                } else {
                                  setHolidayHoursErrors(prevState => ({
                                    ...prevState,
                                    thursday: {
                                      to: null
                                    }
                                  }))
                                }

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
                              style={holidayHoursErrors?.friday?.to ? { border: "1px solid red", backgroundColor: '#FF634740',  } : {}}
                              onChange={(e) => {
                                if(moment(agreedHolidayHours?.friday?.from, 'HH:mm').isAfter(moment(e.target.value, 'HH:mm'))) {
                                  setHolidayHoursErrors(prevState => ({
                                    ...prevState,
                                    friday: {
                                      to: "Time should be lesser than \"From\""
                                    }
                                  }))
                                } else {
                                  setHolidayHoursErrors(prevState => ({
                                    ...prevState,
                                    friday: {
                                      to: null
                                    }
                                  }))
                                }

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
                              style={holidayHoursErrors?.saturday?.to ? { border: "1px solid red", backgroundColor: '#FF634740',  } : {}}
                              onChange={(e) => {
                                if(moment(agreedHolidayHours?.saturday?.from, 'HH:mm').isAfter(moment(e.target.value, 'HH:mm'))) {
                                  setHolidayHoursErrors(prevState => ({
                                    ...prevState,
                                    saturday: {
                                      to: "Time should be lesser than \"From\""
                                    }
                                  }))
                                } else {
                                  setHolidayHoursErrors(prevState => ({
                                    ...prevState,
                                    saturday: {
                                      to: null
                                    }
                                  }))
                                }

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
                              style={holidayHoursErrors?.sunday?.to ? { border: "1px solid red", backgroundColor: '#FF634740',  } : {}}
                              onChange={(e) => {
                                if(moment(agreedHolidayHours?.sunday?.from, 'HH:mm').isAfter(moment(e.target.value, 'HH:mm'))) {
                                  setHolidayHoursErrors(prevState => ({
                                    ...prevState,
                                    sunday: {
                                      to: "Time should be lesser than \"From\""
                                    }
                                  }))
                                } else {
                                  setHolidayHoursErrors(prevState => ({
                                    ...prevState,
                                    sunday: {
                                      to: null
                                    }
                                  }))
                                }

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
              type="submit">
              {loader === true ? (
                <>
                  <img
                  style={{ width: '24px' }}
                  src={'/img/mini_loader1.gif'}
                  alt=""
                  />
                    {
                      localStorage.getItem('user_role') === 'guardian'
                      ? "Saving..."
                      : "Submitting..."
                    }
                </>
              ) : (localStorage.getItem('user_role') === 'guardian' ? 'Next' : 'Submit')}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ChildEnrollment3;
