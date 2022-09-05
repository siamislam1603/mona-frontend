import axios from "axios";
import { assignIn } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Col, Row, Form, Modal } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { BASE_URL } from "../../components/App";
import UserSignature from "../InputFields/UserSignature";

const ChildEnrollment8 = ({ nextStep, handleFormData, prevStep }) => {

  let { childId, parentId } = useParams();

  // STATES
  const [officeUseData, setOfficeUseData] = useState({
    sighted_by: "",
    signature: "",
    date: "",
    percentage: "",
    eligible_hours: ""
  });
  const[showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const[formSubmissionSuccessDialog, setFormSubmissionSuccessDialog] = useState(false);
  const [loader, setLoader] = useState(false);


  // UPDATING THE DATA INSIDE TABLE
  const updateOfficeUseFormData = async () => {
    let response = await axios.patch(`${BASE_URL}/enrollment/office-use-only/update-data/${localStorage.getItem('user_id')}`, {
      date: officeUseData?.date,
      percentage: officeUseData?.percentage,
      eligible_hours: officeUseData?.eligible_hours
    }, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    });

    if(response.status === 201 && response.data.status === "success") {
      setLoader(false);
      // REST OF THE CODE COMES HERE...
      setFormSubmissionSuccessDialog(true);
    }
  }

  // REDIRECTION AFTER SUCCESSFUL SUBMISSION OF FORM
  const handleSubmissionRedirection = () => {
    window.location.href=`/children/${localStorage.getItem('enrolled_parent_id')}`;
  }

  const handleSubmitForm = (e) => {
    e.preventDefault();
    setLoader(true);
    updateOfficeUseFormData();
  };

  // CREATING AN EMPTY RECORD IF NOT ALREADY EXISTS
  const createEmptyRecord = async () => {
    let user_id = localStorage.getItem('user_id');
    const response = await axios.post(`${BASE_URL}/enrollment/office-use-only/empty-record/${user_id}`);

    if(response.status === 200 && response.data.status === "success") {
      let { data } = response.data;
      setOfficeUseData(data);
    } else if(response.status === 201 && response.data.status === "success") {
      let { data } = response.data;
      setOfficeUseData(data);
    }
  }


  // SAVING THE SIGNATURE IMAGE
  const saveSignatureImage = async () => {
    let data = new FormData();

    if(signatureImage) {
      setShowSignatureDialog(false);
      console.log('Saving Signature Image!');
      const blob = await fetch(signatureImage).then((res) => res.blob());
      console.log('BLOB:', blob);
      data.append('image', blob);
    }

    let response = await axios.patch(`${BASE_URL}/enrollment/office-use-only/signature/${localStorage.getItem('user_id')}`, data);

    console.log('SIGNATURE RESPONSE:', response);
    if(response.status === 201 && response.data.status === "success") {
      let { signature: signatureURL } = response.data;
      setOfficeUseData(prevState => ({
        ...prevState,
        signature: signatureURL
      }));
    }
  }

  useEffect(() => {
    // setShowSignatureDialog(false);
    saveSignatureImage();
  }, [signatureImage])

  useEffect(() => {
    createEmptyRecord();
  }, []);

  return (
    <>
      <div className="enrollment-form-sec error-sec">
        <Form>
          <div className="whiteback mt-4">
            <h4 className="title-xs mb-3 text-center">For Office Use Only</h4>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3 relative">
                  <Form.Label>Documents sighted by</Form.Label>
                  <Form.Control 
                    type="text"
                    name="sighted_by"
                    placeholder="Sighted By"
                    disabled={true}
                    value={officeUseData?.sighted_by || ""}
                    onChange={(e) => {
                      setOfficeUseData(prevState => ({
                        ...prevState,
                        sighted_by: e.target.value
                      }))
                    }} />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 relative">
                  <Form.Label>Signature</Form.Label>
                  {
                    <p onClick={() => setShowSignatureDialog(true)} style={{ cursor: "pointer" }}><strong style={{ color: "#AA0061" }}>Click Here</strong> to sign the office-use form!</p>
                  }
                  {
                    officeUseData?.signature &&
                    <img src={officeUseData?.signature} alt="parent signature" style={{ width: "80px", height: "80px" }} />
                  }
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3 relative">
                  <Form.Label>Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    disabled={true}
                    min={new Date().toISOString().slice(0, 10)}
                    value={moment(officeUseData?.date).format('YYYY-MM-DD')} 
                    name="dob"
                    onChange={(e) => {
                      setOfficeUseData(prevState => ({
                        ...prevState,
                        date: e.target.value
                      }))
                    }} />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3 relative">
                  <Form.Label>Percentage</Form.Label>
                  <Form.Control 
                    type="text"
                    name="percentage"
                    placeholder="Percentage"
                    value={officeUseData?.percentage || ""}
                    onChange={(e) => {
                      setOfficeUseData(prevState => ({
                        ...prevState,
                        percentage: e.target.value
                      }))
                    }} />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3 relative">
                  <Form.Label>Eligible Hours</Form.Label>
                  <Form.Control 
                    type="text"
                    name="eligible_hours"
                    placeholder="Eligible Hours"
                    value={officeUseData?.eligible_hours || ""}
                    onChange={(e) => {
                      setOfficeUseData(prevState => ({
                        ...prevState,
                        eligible_hours: e.target.value
                      }));
                    }} />
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="cta text-center mt-5 mb-5">
            <Button variant="outline" type="submit" onClick={prevStep} className="me-3">Previous</Button>
            <Button variant="primary" onClick={handleSubmitForm} type="submit">
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
      </div >

      {
        <Modal
          size="lg"
          show={showSignatureDialog}
          onHide={() => setShowSignatureDialog(false)}>
          <Modal.Header>
            <Modal.Title>Consent Signature</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Row>
              <UserSignature
                field_label="Signature:"
                onChange={setSignatureImage}
                setShowSignatureDialog={setShowSignatureDialog} />
            </Row>
          </Modal.Body>
        </Modal>
      }

      <Modal
        show={formSubmissionSuccessDialog}>
        {/* onHide={() => setFormSubmissionSuccessDialog(false)}> */}
        <Modal.Header>
          <Modal.Title className="modal-title">Congratulations!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="modal-paragraph">Form Submitted Successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="modal-button"
            onClick={() => handleSubmissionRedirection()}>Okay</button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChildEnrollment8;
