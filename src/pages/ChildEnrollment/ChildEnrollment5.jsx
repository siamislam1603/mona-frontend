import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { BASE_URL } from "../../components/App";
import axios from 'axios';
import { childDailyRoutineValidation } from '../../helpers/validation';

let nextstep = 6;
let step = 5;

const ChildEnrollment5 = ({ nextStep, prevStep }) => {

  const [childDailyRoutineData, setChildDailyRoutineData] = useState({
    sleep_time: "",
    bottle_time: "",
    toileting: "",
    routines: "",
    likes_dislikes: "",
    comforter: "",
    religion: "",
    dietary_requirement: "",
    allergy: "",
    comment: "",
  });
  const [agreement, setAgreement] = useState({
    photo_taken: true,
    dress_child: true,
    remind_child: true,
    provide_child: true,
    give_permission_for_sunscreen: true,
    assist_child: true
  });

  // ERROR HANDLING STATE
  const [childDailyRoutineError, setChildDailyRoutineError] = useState(null);

  const handleDailyRoutineData = (event) => {
    const { name, value } = event.target;
    setChildDailyRoutineData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFormFiveData = async () => {
    
    try {
      let childId = localStorage.getItem('enrolled_child_id');
      let token = localStorage.getItem('token');

      let response = await axios.post(`${BASE_URL}/enrollment/daily-routine`, { ...childDailyRoutineData, childId })

      console.log('DAILY ROUTINE RESPONSE:', response);
      if(response.status === 201 && response.data.status === "success") {
        response = await axios.patch(`${BASE_URL}/enrollment/child/${childId}`, agreement, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        console.log('CHILD UPDATION RESPONSE:', response);
        if(response.status === 201 && response.data.status === "success") {
          
          // UPDATING THE STEP VALUE INSIDE CHILD TABLE
          response = await axios.patch(`${BASE_URL}/enrollment/child/${childId}`, {form_step: nextstep}, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if(response.status === 201 && response.data.status === "success") {
            nextStep();
          }
        }
      }
    } catch (error) {
      console.log('ERROR: FORM FIVE =>', error);
    }
  };

  const submitFormData = (e) => {
    e.preventDefault();
    
    let childDailyRoutineErrorObj = childDailyRoutineValidation(childDailyRoutineData);
    if(Object.keys(childDailyRoutineErrorObj).length > 0) {
      setChildDailyRoutineError(childDailyRoutineErrorObj);
    } else {
      console.log('HANDLING FORM FIVE DATA');
      handleFormFiveData();
    }
  };

  childDailyRoutineData && console.log('DAILY ROUTINE DATA:', childDailyRoutineData);

  return (
    <>
      <div className="enrollment-form-sec mt-5">
        <Form onSubmit={submitFormData}>
          <div className="enrollment-form-column">
            <h2 className="title-xs mb-4">Photo</h2>

            <div className="grayback">
              <div className="single-col">
                <p>My child/children having their photo taken, while under care for their educational profiles</p>
                <Form.Group className="ms-auto">
                  <div className="btn-radio inline-col mb-0">
                    <Form.Check 
                      type="radio" 
                      name="photo" 
                      id="yesp" 
                      defaultChecked
                      label="Yes"
                      onChange={() => setAgreement(prevState => ({
                        ...prevState,
                        photo_taken: true
                      }))} />
                    <Form.Check 
                      type="radio" 
                      name="photo" 
                      id="nop" 
                      label="No"
                      onChange={() => setAgreement(prevState => ({
                        ...prevState,
                        photo_taken: true
                      }))} />
                  </div>
                </Form.Group>
              </div>
            </div>

            <h2 className="title-xs mt-4 mb-4">Getting to know you, your child and their daily routine</h2>

            <div className="grayback">
              <p>To help us deliver the best possible care to your child, please provide us with following information if applicable:</p>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sleep Time</Form.Label>
                    <Form.Control 
                      type="text"
                      name="sleep_time"
                      onChange={(e) => {
                        handleDailyRoutineData(e);
                        setChildDailyRoutineError(prevState => ({
                          ...prevState,
                          sleep_time: null
                        }));
                      }} />
                    { childDailyRoutineError?.sleep_time !== null && <span className="error">{childDailyRoutineError?.sleep_time}</span> }
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Bottle TIme/Breast Feeding Arrangements</Form.Label>
                    <Form.Control 
                      type="text"
                      name="bottle_time"
                      onChange={(e) => {
                        handleDailyRoutineData(e);
                        setChildDailyRoutineError(prevState => ({
                          ...prevState,
                          bottle_time: null
                        }));
                      }} />
                    { childDailyRoutineError?.bottle_time !== null && <span className="error">{childDailyRoutineError?.bottle_time}</span> }
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Toileting</Form.Label>
                    <Form.Control 
                      type="text"
                      name="toileting"
                      onChange={(e) => {
                        handleDailyRoutineData(e);
                        setChildDailyRoutineError(prevState => ({
                          ...prevState,
                          toileting: null
                        }));
                      }} />
                    { childDailyRoutineError?.toileting !== null && <span className="error">{childDailyRoutineError?.toileting}</span> }
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Routines</Form.Label>
                    <Form.Control 
                      type="text"
                      name="routines"
                      onChange={(e) => {
                        handleDailyRoutineData(e);
                        setChildDailyRoutineError(prevState => ({
                          ...prevState,
                          routines: null
                        }));
                      }} />
                    { childDailyRoutineError?.routines !== null && <span className="error">{childDailyRoutineError?.routines}</span> }
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Likes/ Dislikes</Form.Label>
                    <Form.Control 
                      type="text"
                      name="likes_dislikes"
                      onChange={(e) => {
                        handleDailyRoutineData(e);
                        setChildDailyRoutineError(prevState => ({
                          ...prevState,
                          likes_dislikes: null
                        }));
                      }} />
                    { childDailyRoutineError?.likes_dislikes !== null && <span className="error">{childDailyRoutineError?.likes_dislikes}</span> }
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Comforter</Form.Label>
                    <Form.Control 
                      type="text"
                      name="comforter"
                      onChange={(e) => {
                        handleDailyRoutineData(e);
                        setChildDailyRoutineError(prevState => ({
                          ...prevState,
                          comforter: null
                        }));
                      }} />
                    { childDailyRoutineError?.comforter !== null && <span className="error">{childDailyRoutineError?.comforter}</span> }
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Religion</Form.Label>
                    <Form.Control 
                      type="text"
                      name="religion"
                      onChange={(e) => {
                        handleDailyRoutineData(e);
                        setChildDailyRoutineError(prevState => ({
                          ...prevState,
                          religion: null
                        }));
                      }} />
                    { childDailyRoutineError?.religion !== null && <span className="error">{childDailyRoutineError?.religion}</span> }
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dietary Requirement</Form.Label>
                    <Form.Control 
                      type="text"
                      name="dietary_requirement"
                      onChange={(e) => {
                        handleDailyRoutineData(e);
                        setChildDailyRoutineError(prevState => ({
                          ...prevState,
                          dietary_requirement: null
                        }));
                      }} />
                    { childDailyRoutineError?.dietary_requirement !== null && <span className="error">{childDailyRoutineError?.dietary_requirement}</span> }
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Allergy</Form.Label>
                    <Form.Control 
                      type="text"
                      name="allergy"
                      onChange={(e) => {
                        handleDailyRoutineData(e);
                        setChildDailyRoutineError(prevState => ({
                          ...prevState,
                          allergy: null
                        }));
                      }} />
                    { childDailyRoutineError?.allergy !== null && <span className="error">{childDailyRoutineError?.allergy}</span> }
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control 
                      type="text"
                      name="comment"
                      onChange={(e) => {
                        handleDailyRoutineData(e);
                        setChildDailyRoutineError(prevState => ({
                          ...prevState,
                          comment: null
                        }));
                      }} />
                    { childDailyRoutineError?.comment !== null && <span className="error">{childDailyRoutineError?.comment}</span> }
                  </Form.Group>
                </Col>
              </Row>
            </div>

          </div>
          <div className="enrollment-form-column mt-4">
            <h2 className="title-xs mb-4">Sun Protection agreement and permission</h2>

            <div className="grayback">
              <p>I understand Mona FDC is a registered SunSmart Early Childhood Program member and follows SunSmart and Cancer Council Victoria recommendations to use a combination of sun protection measures (clothing, sunscreen, a hat, shade, and if practical, sunglasses) during the daily local sun protection times (whenever UV levels reach 3 or higher), typically from mid-August to the end of April in Victoria.</p>
              <p>I agree to help support this membership and help minimize my child’s potential risk of skin and eye damage and skin cancer by doing the following:</p>
              <p><strong>(Please tick all that apply)</strong></p>
              <Form.Group className="mb-3">
                <div className="btn-checkbox">
                  <Form.Check 
                    type="checkbox" 
                    id="dress"
                    checked={agreement.dress_child || false} 
                    label="Dress my child in cool clothing that covers as much skin as possible e.g. tops that cover the shoulders, arms and chest, has higher necklines or collars, and long shorts and skirts. I understand that singlet tops or shoestring dresses do not provide adequate sun protection and are best layered with a shirt or t-shirt."
                    onChange={() => setAgreement(prevState => ({
                      ...prevState,
                      dress_child: !agreement.dress_child
                    }))} />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="btn-checkbox">
                  <Form.Check 
                    type="checkbox" 
                    id="remind" 
                    checked={agreement.remind_child || false} 
                    label="Remind my child to bring and wear a sun-protective hat that shades the face, neck and ears (e.g. wide-brimmed, bucket or legionnaire hat). I understand that baseball / peak style caps do not provide adequate sun protection and are not appropriate for outdoor play."
                    onChange={() => setAgreement(prevState => ({
                      ...prevState,
                      remind_child: !agreement.remind_child
                    }))} />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="btn-checkbox">
                  <Form.Check 
                    type="checkbox" 
                    id="provide" 
                    checked={agreement.provide_child || false} 
                    label="Provide my child with appropriate close-fitting wrap-around sunglasses labelled AS:1067 to help protect their eyes."
                    onChange={() => setAgreement(prevState => ({
                      ...prevState,
                      provide_child: !agreement.provide_child
                    }))} />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="btn-checkbox">
                  <Form.Check 
                    type="checkbox" 
                    id="permission" 
                    checked={agreement.give_permission_for_sunscreen || false} 
                    label="Give permission for educWators/staff to apply SPF30 (or higher) broad-spectrum, water-resistant sunscreen supplied by the service to all exposed parts of my child’s skin including their face, neck, ears, arms and legs."
                    onChange={() => setAgreement(prevState => ({
                      ...prevState,
                      give_permission_for_sunscreen: !agreement.give_permission_for_sunscreen
                    }))} />
                </div>
              </Form.Group>
              <div className="text-center mb-3">OR</div>
              <Form.Group className="mb-3">
                <div className="btn-checkbox">
                  <Form.Check 
                    type="checkbox" 
                    id="gpermission" 
                    label="To give permission for educators/staff to apply SPF30 (or higher) broad-spectrum, water-resistant sunscreen (that I have supplied and labelled with my child/children’s name) to all exposed parts of my child’s skin including their face, neck, ears, arms and legs. I agree that this sunscreen will be kept at the service and it is my responsibility to make sure there is always an adequate supply available." />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="btn-checkbox">
                  <Form.Check 
                    type="checkbox" 
                    id="educators" 
                    checked={agreement.assist_child || false} 
                    label="To give permission for educators/staff to assist my child to develop independent, self-help skills by applying SPF30 (or higher) broad-spectrum, water-resistant sunscreen to all exposed parts of their own skin including their face, neck, ears, arms and legs. (Recommended from ages three and above) "
                    onChange={() => setAgreement(prevState => ({
                      ...prevState,
                      assist_child: !agreement.assist_child
                    }))} />
                </div>
              </Form.Group>
            </div>
          </div>
          <div className="cta text-center mt-5 mb-5">
            <Button variant="outline" type="submit" onClick={prevStep} className="me-3">Previous</Button>
            <Button variant="primary" type="submit">Next</Button>
          </div>
          {/* <div className="cta text-center mt-5 mb-5">
              <Button variant="outline" type="submit" onClick={prevStep} className="me-3">Previous</Button>
              <Button variant="primary" type="submit">Next</Button>
            </div> */}
        </Form>
        {/* <Form onSubmit={submitFormData}>

          
        </Form> */}
      </div>
    </>
  );
};

export default ChildEnrollment5;
