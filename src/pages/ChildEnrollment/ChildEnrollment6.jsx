import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import axios from 'axios';
import { BASE_URL } from '../../components/App';



let nextstep = 7;
let step = 6;

// const ChildEnrollment6 = ({ nextStep, handleFormData, prevStep }) => {
//   const submitFormData = (e) => {
//     e.preventDefault();
//     nextStep();
//   };

  const ChildEnrollment6 = ({prevStep}) => {

  const [concentData, setConcentData] = useState({ 
    give_consent_to_the_educator: "",
    to_provide_care_and_education_to_my_child: "",
    i: "",
    signature: "",
    date: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState({user_roles: []});



  const createConcentForm = async (data) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${BASE_URL}/concent/addConcent`, data, {
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    console.log(response);
    console.log("jjjjjjjjjjjjjjjjjjjj");
  
    if(response.status === 200 && response.data.status === "success") {
      console.log("datasaved");
    }
  }

  // const handleInputChange = event => {
  //   const {name, value} = event.target;
  //   setConcentData({...concentData, [name]:value});
  // }

  const handleInputChange = (field, value) => {
    setConcentData({ ...concentData, [field]: value });
    if (!!error[field]) {
      setError({
        ...error,
        [field]: null,
      });
    }
  };

  const handleDataSubmit = event => {
    event.preventDefault();
      if(concentData) {
        let data = new FormData();
  
        for(let [ key, values ] of Object.entries(concentData)) {
          data.append(`${key}`, values)
        }
      createConcentForm(data);
      console.log("The data",data)
      }
    }
      


    // var data = {
    //   give_consent_to_the_educator: concentData.give_consent_to_the_educator,
    //   to_provide_care_and_education_to_my_child: concentData.to_provide_care_and_education_to_my_child,
    //   i: concentData.i,
    //   signature: concentData.signature,
    //   dob: concentData.dob,
    // };
      
      // const response = await axios.post(
      //   `${BASE_URL}/concent/addConcent`, data, {
      //     headers: {
      //       "Authorization": "Bearer " + token
      //     }
      //   }
      // );
  //     setSubmitted(true);
  //     console.log(response.data);
  // }
  // const newConcent = () => {
  //   setConcentData();
  //   setSubmitted(false);
  // }
  return (
    <>
      <div className="enrollment-form-sec">
        <Form onSubmit={handleDataSubmit}>
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
          <h2 className="title-xs mt-4 mb-4">Consent for educator and nominated assistant R 144</h2>

          <div className="grayback">
            <Form.Group className="mb-3 single-field">
              <Form.Label>Give consent to the educator</Form.Label>
              <Form.Control
                            type="text"
                            name="give_consent_to_the_educator"
                            // value={concentData.give_consent_to_the_educator}
                            onChange={ handleInputChange
                              // (e) => {
                              // handleInputChange(e);
                              // setErrors(prevState => ({
                              //   ...prevState,
                              //   give_consent_to_the_educator: null
                              // }));
                            // }
                          }
                          />
                          { error.give_consent_to_the_educator !== null && <span className="error">{error.give_consent_to_the_educator}</span> }
            </Form.Group>
            <Form.Group className="mb-3 single-field">
              <Form.Label>to provide care and education to my child.; and nominated assistant/s</Form.Label>
              <Form.Control
                            type="text"
                            name="to_provide_care_and_education_to_my_child"
                            // value={concentData.to_provide_care_and_education_to_my_child}
                            onChange={ handleInputChange
                              // (e) => {
                              // handleConcentData(e);
                            //   setErrors(prevState => ({
                            //     ...prevState,
                            //     to_provide_care_and_education_to_my_child: null
                            //   }));
                            // }
                          }
                          />
                           { error.to_provide_care_and_education_to_my_child !== null && <span className="error">{error.to_provide_care_and_education_to_my_child}</span> }
            </Form.Group>
            <p>to support the educator in transporting my child to and from regular outings or excursion, providing care while educator has an appointment for the period of less than 4 hours, or in an emergency where the educator needs medical attention. Assistant may also provide support to the educator while the educator is providing care for my child.</p>
          </div>
          <h3 className="title-xs mt-4 mb-4">Authorization by Parents / Authorized person for the Approved Provider, Nomminated Supervisor or Educator</h3>

          <div className="grayback">
            <p>Agree to collect or arrange for collection of the child referred to in this enrolment form, if she/he becomes unwell at the service; Understand that this office will contact the Human Service/Child Protection Service in cases of emergency where no individuals nominated and I can’t be notified;  Consent to the proprietor of the family day care service, nominated supervisor or educator to seek medical treatment for the child from a registered medical practitioner, hospital or ambulance service, and transportation of the child by an ambulance service (R 161).</p>
            <p>Authorize the educator and proprietor of family day care to take the child on regular outings (R 102).</p>
          </div>

          <h3 className="title-xs mt-4 mb-4">Authorization by parents/guardian</h3>

          <div className="grayback">
            <Form.Group className="mb-3 single-field">
              <Form.Label>I,</Form.Label>
              <Form.Control
                            type="text"
                            name="i"
                            // value={concentData.i}
                            onChange={ handleInputChange
                            //   (e) => {
                            //   handleConcentData(e);
                            //   setErrors(prevState => ({
                            //     ...prevState,
                            //     i: null
                            //   }));
                            // }
                          }
                          />
                          { error.i !== null && <span className="error">{error.i}</span> }
            </Form.Group>
            <p>a person with full authority of the child referred to in this enrolmet form; <br />Declare that the information in this enrolment form is true and correct and undertake to immediately inform the children service in the event of any change to this information;</p>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Signature</Form.Label>
                  <Form.Control
                            type="text"
                            name="signature"
                            // value={concentData.signature}
                            onChange={ handleInputChange
                            //   (e) => {
                            //   handleConcentData(e);
                            //   setErrors(prevState => ({
                            //     ...prevState,
                            //     signature: null
                            //   }));
                            // }
                          }
                          />
                          { error.signature !== null && <span className="error">{error.signature}</span> }
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" placeholder="" name="dob"
                  // value={concentData.dob} 
                  onChange={ handleInputChange
                  //   (e) => {
                  //   handleConcentData(e);
                  //   setErrors(prevState => ({
                  //     ...prevState,
                  //     dob: null
                  //   }));
                  // }
                }
                  />
                  { error.dob !== null && <span className="error">{error.dob}</span> }
                </Form.Group>
              </Col>
            </Row>
          </div>
          <div className="cta text-center mt-5 mb-5">
            <Button variant="outline" type="submit" onClick={prevStep} className="me-3">Previous</Button>
            <Button variant="primary" type="submit" onClick={handleDataSubmit}>Next</Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ChildEnrollment6;
