import React, { useState } from "react";
import { Button, Col, Row, Form, Table, Modal } from "react-bootstrap";
import axios from 'axios';
import { healthInformationFormValidator } from '../../helpers/enrollmentValidation';
import { BASE_URL } from "../../components/App";
import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import { faListSquares } from "@fortawesome/free-solid-svg-icons";
import UserSignature from "../InputFields/UserSignature";
import DragDropMultiple from '../../components/DragDropMultiple';

let nextstep = 3;
let step = 2;
let disease_name = [
  "hepatitis_b",
  "diptheria",
  "haemophilus",
  "inactivated_poliomyelitis",
  "pneumococcal_conjugate",
  "rotavirus",
  "measules",
  "meningococcal_c",
  "varicella"
];
const ChildEnrollment2 = ({ nextStep, handleFormData, prevStep }) => {
  let { childId: paramsChildId, parentId: paramsParentId } = useParams();

  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const [healthInformation, setHealthInformation] = useState({
    medical_service: "",
    telephone: "",
    medical_service_address: "",
    maternal_and_child_health_centre: "",
  });

  // ERROR HANDLING STATES
  const [healthInfoFormErrors, setHealthInfoFormErrors] = useState(null);
  const [childImmunisationRecord, setChildImmunisationRecord] = useState({
    hepatitis_b: [],
    diptheria: [],
    haemophilus: [],
    inactivated_poliomyelitis: [],
    pneumococcal_conjugate: [],
    rotavirus: [],
    measules: [],
    meningococcal_c: [],
    varicella: [],
    log: []
  });
  const [childDetails, setChildDetails] = useState({
    has_health_record: false,
    has_been_immunized: false,
    has_court_orders: false,
    changes_described: "",
    name_of_record_viewer: "",
    signature_of_record_viewer: "",
    date_of_record_viewing: null,
    position_of_record_viewer: "",
    log: []
  });
  const [childMedicalInformation, setChildMedicalInformation] = useState({
    has_special_needs: false,
    special_need_details: "",
    inclusion_support_form_of_special_needs: false,
    has_sensitivity: false,
    details_of_allergies: "",
    inclusion_support_form_of_allergies: false,
    has_autoinjection_device: false,
    has_anaphylaxis_medical_plan_been_provided: false,
    risk_management_plan_completed: false,
    any_other_medical_condition: false,
    detail_of_other_condition: "",
    has_dietary_restrictions: false,
    details_of_restrictions: "",
    log: []
  });
  const [parentData, setParentData] = useState({
    i_give_medication_permission: false,
    log: []
  });
  const [formStepData, setFormStepData] = useState(null);
  const [idList, setIdList] = useState({
    health_information_id: null,
    medical_information_id: null,
    immunisation_record_id: null
  });
  const [loader, setLoader] = useState(false);
  const [immunisationRecordDetails, setImmunisationRecordDetails] = useState(null);
  const [immunisationRecord, setImmunisationRecord] = useState(null);
  const [courtOrders, setCourtOrders] = useState(null);
  const [courtOrderDetails, setCourtOrderDetails] = useState(null);

  const [immunisationRecordDeleteMessage, setImmunisationRecordDeleteMessage] = useState(null);
  const [courtOrdersDeleteMessage, setCourtOrdersDeleteMessage] = useState(null);

  // UPDATEING FORM TWO DATA
  const updateFormTwoData = async () => {
    setLoader(true);
    // let childId = localStorage.getItem('enrolled_child_id');
    let token = localStorage.getItem('token');
    // SENDING HEALTH INFORMATION REQUEST
    let response = await axios.patch(`${BASE_URL}/enrollment/health-information/${idList.health_information_id}`, { ...healthInformation }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status === 201 && response.data.status === "success") {
      response = await axios.patch(`${BASE_URL}/enrollment/medical-information/${idList.medical_information_id}`, { ...childMedicalInformation }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 201 && response.data.status === "success") {
        response = await axios.patch(`${BASE_URL}/enrollment/immunisation-record/${idList.immunisation_record_id}`, { ...childImmunisationRecord }, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.status === 201 && response.data.status === "success") {

          // UPDATING CHILD DETAILS
          response = await axios.patch(`${BASE_URL}/enrollment/child/${paramsChildId}`, { ...childDetails }, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (response.status === 201 && response.data.status === "success") {
            // let parentId = localStorage.getItem('enrolled_parent_id') || localStorage.getItem('user_id');

            response = await axios.patch(`${BASE_URL}/enrollment/parent/${paramsParentId}`, { ...parentData }, {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            });

            if (response.status === 201 && response.data.status === "success") {

              let changeCount = localStorage.getItem('change_count');

              if (childImmunisationRecord.log.length > 0)
                changeCount++;

              if (childDetails.log.length > 0)
                changeCount++;

              if (childMedicalInformation.log.length > 0)
                changeCount++;

              if (parentData.log.length > 0)
                changeCount++;

              localStorage.setItem('change_count', changeCount);

              setLoader(false);
              nextStep();
            }
          }
        }
      }
    }
  };

  // FUNCTIONS
  const saveFormTwoData = async () => {
    setLoader(true);
    let childId = localStorage.getItem('enrolled_child_id');
    let token = localStorage.getItem('token');
    // SENDING HEALTH INFORMATION REQUEST
    let response = await axios.post(`${BASE_URL}/enrollment/health-information`, { ...healthInformation, childId }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status === 201 && response.data.status === "success") {
      // SENDING MEDICAL INFORMATION REQUEST
      response = await axios.post(`${BASE_URL}/enrollment/medical-information`, { ...childMedicalInformation, childId }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 201 && response.data.status === "success") {

        // SENDING IMMUNISATION RECORD REQUEST  
        response = await axios.post(`${BASE_URL}/enrollment/immunisation-record`, { ...childImmunisationRecord, childId }, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.status === 201 && response.data.status === "success") {

          // UPDATING CHILD DETAILS
          response = await axios.patch(`${BASE_URL}/enrollment/child/${paramsChildId}`, { ...childDetails }, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          // UPDATING PARENT PERMISSION
          if (response.status === 201 && response.data.status === "success") {
            // let parentId = localStorage.getItem('user_id');
            response = await axios.patch(`${BASE_URL}/enrollment/parent/${paramsParentId}`, { ...parentData }, {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            });

            if (response.status === 201 && response.data.status === "success") {
              response = await axios.patch(`${BASE_URL}/enrollment/child/${childId}`, { form_step: nextstep }, {
                headers: {
                  "Authorization": `Bearer ${token}`
                }
              });

              if (response.status === 201 && response.data.status === "success") {
                setLoader(false);
                nextStep();
              }
            }
          }
        }
      }

    }
  };

  const fetchChildDataAndPopulate = async () => {
    let enrolledChildId = localStorage.getItem('enrolled_child_id');
    let token = localStorage.getItem('token');

    let response = await axios.get(`${BASE_URL}/enrollment/child/${enrolledChildId}?parentId=${paramsParentId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    console.log('RESPONSE:', response);

    if (response.status === 200 && response.data.status === 'success') {
      let { child } = response.data;
      localStorage.setItem('enrolled_parent_id', child.parents[0].id);
      if (paramsParentId) {
        localStorage.setItem('enrolled_parent_id', paramsParentId);
      }

      console.log('CHILD DATA:', child);

      if (child.form_step > step) {
        // POPULATING CHILD HEALTH INFORMATION STATE
        let { child_health_information: healthInfo } = child;
        setHealthInformation(prevState => ({
          ...prevState,
          medical_service: healthInfo?.medical_service,
          telephone: healthInfo?.telephone,
          medical_service_address: healthInfo?.medical_service_address,
          maternal_and_child_health_centre: healthInfo?.maternal_and_child_health_centre,
        }));
        setIdList(prevState => ({
          ...prevState,
          health_information_id: healthInfo.id
        }));

        // SETTING CHILD DETAILS
        setChildDetails(prevState => ({
          ...prevState,
          has_health_record: child.has_health_record,
          has_been_immunized: child.has_been_immunized,
          has_court_orders: child.has_court_orders,
          changes_described: child.changes_described,
          name_of_record_viewer: child.name_of_record_viewer,
          signature_of_record_viewer: child.signature_of_record_viewer,
          date_of_record_viewing: child.date_of_record_viewing,
          position_of_record_viewer: child.position_of_record_viewer,
        }));

        // SETTING CHILD IMMUNISATION RECORD
        let { child_immunisation_record: irecord } = child;
        for (let [key, value] of Object.entries(irecord)) {
          if (disease_name.includes(key + "")) {
            setChildImmunisationRecord(prevState => ({
              ...prevState,
              [key]: value
            }));
          }
        }
        setIdList(prevState => ({
          ...prevState,
          immunisation_record_id: irecord.id
        }));

        // SETTING CHILD MEDICAL INFORMATION
        let { child_medical_information: medinfo } = child;
        setChildMedicalInformation(prevState => ({
          ...prevState,
          has_special_needs: medinfo.has_special_needs,
          special_need_details: medinfo.special_need_details,
          inclusion_support_form_of_special_needs: medinfo.inclusion_support_form_of_special_nee,
          has_sensitivity: medinfo.has_sensitivity,
          details_of_allergies: medinfo.details_of_allergies,
          inclusion_support_form_of_allergies: medinfo.inclusion_support_form_of_allergies,
          has_autoinjeciton_device: medinfo.has_autoinjeciton_device,
          has_anaphylaxis_medical_plan_been_provided: medinfo.has_anaphylaxis_medical_plan_been_pro,
          risk_management_plan_completed: medinfo.risk_management_plan_completed,
          any_other_medical_condition: medinfo.any_other_medical_condition,
          detail_of_other_condition: medinfo.detail_of_other_condition,
          has_dietary_restrictions: medinfo.has_dietary_restrictions,
          details_of_restrictions: medinfo.details_of_restrictions,
        }));
        setIdList(prevState => ({
          ...prevState,
          medical_information_id: medinfo.id
        }));

        setParentData(prevState => ({
          ...prevState,
          i_give_medication_permission: child.parents[0].i_give_medication_permission
        }));
        setFormStepData(child.form_step);
      }


    }
  };

  const submitFormData = (e) => {
    e.preventDefault();

    const errors = healthInformationFormValidator(healthInformation, parentData?.i_give_medication_permission);
    if (Object.keys(errors).length > 0) {
      window.scrollTo(0, 0);
      setHealthInfoFormErrors(errors);
    } else {
      if (formStepData && formStepData > step) {
        console.log('UPDATING THE EXISTING DATA!');
        updateFormTwoData();
      } else {
        console.log('CREATING NEW DATA!')
        saveFormTwoData();
      }
    
    setLoader(true);}
    // nextStep();
  };

  // SAVING THE SIGNATURE IMAGE
  const saveSignatureImage = async () => {
    let data = new FormData();

    if(signatureImage) {
      setShowSignatureDialog(false);
      console.log('Saving Signature Image!');
      const blob = await fetch(signatureImage).then((res) => res.blob());
      data.append('image', blob);
    }

    let response = await axios.patch(`${BASE_URL}/enrollment/record-viewer/signature/${paramsChildId}`, data);

    console.log('SIGNATURE RESPONSE:', response);
    if(response.status === 201 && response.data.status === "success") {
      let { signature_of_record_viewer: signatureURL } = response.data;
      setChildDetails(prevState => ({
        ...prevState,
        signature_of_record_viewer: signatureURL
      }));
    }
  }

  // IMMUNISATION RECORD
  const handleChildFileDelete = async (fileId) => {
    console.log('Delete file:', fileId)
    const response = await axios.delete(`${BASE_URL}/enrollment/child/file-delete/${fileId}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    });

    if(response.status === 201 && response.data.status === 'success') {
      let { token } = response.data;
      
      if(token === 'immunisation-record') {
        setImmunisationRecordDeleteMessage("Immunisation record deleted successfully.");
      } else {
        setCourtOrdersDeleteMessage("Court order deleted successfully.")
      }
    }
  }

  // UPLOADING SUPPORT FORM
  const uploadImmunisationRecord = async () => {
    let data = new FormData();
    data.append('images', immunisationRecord[0]);
    data.append('category', 'immunisation-record');

    let response = await axios.patch(`${BASE_URL}/enrollment/child/file-upload/${paramsChildId}/${paramsParentId}`, data, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    });

    console.log('FILE UPLOAD RESPONSE:', response);
    if(response.status === 201 && response.data.status === 'success') {
      console.log('INSIDE RESPONSE');
      let { supportForm } = response.data;
      setImmunisationRecord(null);
      setImmunisationRecordDetails(supportForm);
    }
  }

  // COURT ORDERS
  // IMMUNISATION RECORD

  // UPLOADING SUPPORT FORM
  const uploadCourtOrders = async () => {
    let data = new FormData();

    courtOrders.forEach(order => {
      data.append('images', order);
    });
    data.append('category', 'court-order');

    let response = await axios.patch(`${BASE_URL}/enrollment/child/file-upload/${paramsChildId}/${paramsParentId}`, data, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    });

    console.log('FILE UPLOAD RESPONSE:', response);
    if(response.status === 201 && response.data.status === 'success') {
      console.log('INSIDE RESPONSE');
      let { supportForm } = response.data;
      setCourtOrders(null);
      setCourtOrderDetails(supportForm);
    }
  }

  useEffect(() => {
    // setShowSignatureDialog(false);
    saveSignatureImage();
  }, [signatureImage])


  useEffect(() => {
    console.log('FETCHING CHILD DATA AND POPULATE!');
    window.scrollTo(0, 0);
    fetchChildDataAndPopulate();
  }, [localStorage.getItem('enrolled_child_id') !== null]);


  // IMMUNISATION RECORD UPLOAD
  useEffect(() => {
    if(immunisationRecord) {
      uploadImmunisationRecord();
    }
  }, [immunisationRecord]);

  useEffect(() => {
    if(immunisationRecordDeleteMessage) {
      setImmunisationRecordDetails(null);
      setTimeout(() => {
        setImmunisationRecordDeleteMessage(null);
      }, 3000); 
    }

  }, [immunisationRecordDeleteMessage])
  
  // COURT ORDERS 
  // useEffect(() => {
  //   if(courtOrders) {
  //     uploadCourtOrders();
  //   }
  // }, [courtOrders]);

  // useEffect(() => {
  //   if(courtOrdersDeleteMessage) {
  //     setCourtOrderDetails(null);
  //     setTimeout(() => {
  //       setCourtOrdersDeleteMessage(null);
  //     }, 3000); 
  //   }

  // }, [courtOrdersDeleteMessage])


  return (
    <>
      {
        immunisationRecordDeleteMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{immunisationRecordDeleteMessage}</p>
      }
      {/* {
        courtOrdersDeleteMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{courtOrdersDeleteMessage}</p>
      } */}
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
                      <Form.Check
                        type="radio"
                        name="powers"
                        id="yesd"
                        className="ps-0"
                        label="Yes"
                        checked={childDetails?.has_court_orders === true}
                        onChange={() => {
                          setChildDetails(prevState => ({
                            ...prevState,
                            has_court_orders: true
                          }));
                          if (!childDetails.log.includes("has_court_orders")) {
                            setChildDetails(prevState => ({
                              ...prevState,
                              log: [...childDetails.log, "has_court_orders"]
                            }));
                          }
                        }} />
                      <Form.Check
                        type="radio"
                        name="powers"
                        id="nod"
                        defaultChecked
                        checked={childDetails?.has_court_orders === false}
                        label="No"
                        onChange={() => {
                          setChildDetails(prevState => ({
                            ...prevState,
                            has_court_orders: false,
                            changes_described: ""
                          }))
                          if (!childDetails.log.includes("has_court_orders")) {
                            setChildDetails(prevState => ({
                              ...prevState,
                              log: [...childDetails.log, "has_court_orders"]
                            }));
                          } else {
                            setChildDetails(prevState => ({
                              ...prevState,
                              log: childDetails.log.filter(d => d !== "changes_described")
                            }));
                          }
                        }} />
                    </div>
                    <Form.Text className="text-muted">
                      if ‘Yes’ please provide to the service for sighting.
                    </Form.Text>
                  </Form.Group>
                </Col>
                {
                  childDetails.has_court_orders &&
                  <>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Please describe these changes and provide the contact details of any person given these powers: </Form.Label>
                        <Form.Control
                          as="textarea"
                          style={{ resize: "none" }} 
                          rows={3}
                          value={childDetails?.changes_described || ""}
                          name="changes_described"
                          onChange={(e) => setChildDetails(prevState => ({
                            ...prevState,
                            [e.target.name]: e.target.value
                          }))}
                          onBlur={(e) => {
                            if (!childDetails.log.includes("changes_described")) {
                              setChildDetails(prevState => ({
                                ...prevState,
                                log: [...childDetails.log, "changes_described"]
                              }));
                            }
                          }} />
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
                        {/* <>
                          <Form.Group className="col-md-6 mb-3 mt-3">
                            <Form.Label>Attach any Court Orders, Parenting Orders and/or Parenting Plans that are in place</Form.Label>
                            <DragDropMultiple 
                              module="court-orders"
                              fileLimit={2}
                              supportFormDetails={courtOrderDetails}
                              onSave={setCourtOrders} />
                            <small className="fileinput" style={{ width: '95px', textAlign: 'center' }}>(Upload 1 file)</small>
                          </Form.Group>
                          {
                            immunisationRecordDetails &&
                            (
                              <div>
                                <a href={immunisationRecordDetails?.file}><p>{immunisationRecordDetails?.originalName}</p></a>
                                <img
                                  onClick={() => handleChildFileDelete(immunisationRecordDetails?.id)}
                                  // className="file-remove"
                                  style={{ width: "25px", height: "auto", cursor: "pointer" }}
                                  src="https://cdn4.iconfinder.com/data/icons/linecon/512/delete-512.png"
                                  alt="" />
                              </div>
                            )
                          }
                        </> */}
                      </Form.Group>
                    </Col>
                  </>
                }
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
              <h2 className="title-xs mb-4">Child's health information R 162 (b)</h2>
              <div className="grayback">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Doctor's Name/Medical Service *</Form.Label>
                      <Form.Control
                        type="text"
                        name="medical_service"
                        value={healthInformation?.medical_service || ""}
                        onChange={(e) => {
                          setHealthInformation(prevState => ({
                            ...prevState,
                            medical_service: e.target.value
                          }))

                          setHealthInfoFormErrors(prevState => ({
                            ...prevState,
                            medical_service: null
                          }));
                        }}
                        onBlur={(e) => {
                          if (!childDetails.log.includes("medical_service")) {
                            setChildDetails(prevState => ({
                              ...prevState,
                              log: [...childDetails.log, "medical_service"]
                            }));
                          }
                        }} />
                      {healthInfoFormErrors?.medical_service !== null && <span className="error">{healthInfoFormErrors?.medical_service}</span>}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Telephone *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telephone"
                        maxLength={20}
                        value={healthInformation?.telephone || ""}
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
                        onBlur={(e) => {
                          if (!childDetails.log.includes("telephone")) {
                            setChildDetails(prevState => ({
                              ...prevState,
                              log: [...childDetails.log, "telephone"]
                            }));
                          }
                        }} />
                      {healthInfoFormErrors?.telephone !== null && <span className="error">{healthInfoFormErrors?.telephone}</span>}
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Doctor’s Address/Medical Service *</Form.Label>
                      <Form.Control
                        type="text"
                        name="medical_service_address"
                        value={healthInformation?.medical_service_address || ""}
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
                        onBlur={(e) => {
                          if (!childDetails.log.includes("medical_service_address")) {
                            setChildDetails(prevState => ({
                              ...prevState,
                              log: [...childDetails.log, "medical_service_address"]
                            }));
                          }
                        }} />
                      {healthInfoFormErrors?.medical_service_address !== null && <span className="error">{healthInfoFormErrors?.medical_service_address}</span>}
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Maternal And Child Health Centre *</Form.Label>
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
                        onBlur={(e) => {
                          if (!childDetails.log.includes("maternal_and_child_health_centre")) {
                            setChildDetails(prevState => ({
                              ...prevState,
                              log: [...childDetails.log, "maternal_and_child_health_centre"]
                            }));
                          }
                        }} />
                      {healthInfoFormErrors?.maternal_and_child_health_centre !== null && <span className="error">{healthInfoFormErrors?.maternal_and_child_health_centre}</span>}
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
                          checked={childDetails?.has_health_record === true}
                          label="Yes"
                          onChange={() => {
                            setChildDetails(prevState => ({
                              ...prevState,
                              has_health_record: true
                            }));

                            if (!childDetails.log.includes("has_health_record")) {
                              setChildDetails(prevState => ({
                                ...prevState,
                                log: [...childDetails.log, "has_health_record"]
                              }));
                            }
                          }} />
                        <Form.Check
                          type="radio"
                          name="health"
                          id="no"
                          label="No"
                          checked={childDetails?.has_health_record === false}
                          defaultChecked
                          onChange={() => {
                            setChildDetails(prevState => ({
                              ...prevState,
                              has_health_record: false,
                              name_of_record_viewer: "",
                              date_of_record_viewing: "",
                              position_of_record_viewer: ""
                            }));

                            if (!childDetails.log.includes("has_health_record")) {
                              setChildDetails(prevState => ({
                                ...prevState,
                                log: [...childDetails.log, "has_health_record"]
                              }));
                            }
                          }} />
                      </div>
                      <Form.Text className="text-muted">
                        if ‘Yes’ please provide to the service for sighting.
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  {
                    childDetails.has_health_record &&
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Name and position of person at the service who has sighted the child’s health record</Form.Label>
                        <Row>
                          <Col md={6}>
                            <div className="mb-3">
                              <Form.Label>Name</Form.Label>
                              <Form.Control 
                                type="text"
                                name="name_of_record_viewer"
                                value={childDetails?.name_of_record_viewer || ""}
                                onChange={(e) => {
                                  setChildDetails(prevState => ({
                                    ...prevState,
                                    name_of_record_viewer: e.target.value
                                  }))
                                }} />
                            </div>
                          </Col>

                          <Col md={6}>
                            <div className="mb-3">
                              <Form.Label>Signature</Form.Label>
                              {
                                <p onClick={() => setShowSignatureDialog(true)} style={{ cursor: "pointer" }}><strong style={{ color: "#AA0061", fontSize: "1rem" }}>Click Here</strong> to sign</p>
                              }
                              {
                                childDetails?.signature_of_record_viewer &&
                                <img src={childDetails?.signature_of_record_viewer} alt="parent signature" style={{ width: "80px", height: "80px" }} />
                              }
                            </div>
                          </Col>
                          
                          <Col md={6}>
                            <div className="mb-3">
                              <Form.Label>Date</Form.Label>
                              <Form.Control 
                                type="date" 
                                placeholder=""
                                value={childDetails?.date_of_record_viewing || ""}
                                name="date_of_record_viewing"
                                onChange={(e) => {
                                  setChildDetails(prevState => ({
                                    ...prevState,
                                    date_of_record_viewing: e.target.value
                                  }))
                                }} />
                            </div>
                          </Col>
                          
                          <Col md={6}>
                            <div className="mb-3">
                              <Form.Label>Position</Form.Label>
                              <Form.Control 
                                type="text"
                                value={childDetails?.position_of_record_viewer || ""}
                                name="position_of_record_viewer"
                                onChange={(e) => {
                                  setChildDetails(prevState => ({
                                    ...prevState,
                                    position_of_record_viewer: e.target.value
                                  }))
                                }} />
                            </div>
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                  }
                </Row>
              </div>
              <h2 className="title-xs mt-4 mb-4">Child's immunisation record R 162 (F)</h2>
              <div className="grayback">
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Has the child been immunised?</Form.Label>
                      <div className="btn-radio inline-col">
                        <Form.Check
                          type="radio"
                          name="immunized"
                          id="yesi"
                          checked={childDetails?.has_been_immunized === true}
                          className="ps-0"
                          label="Yes"
                          onChange={() => {
                            setChildDetails(prevState => ({
                              ...prevState,
                              has_been_immunized: true
                            }));

                            if (!childDetails.log.includes("has_been_immunized")) {
                              setChildDetails(prevState => ({
                                ...prevState,
                                log: [...childDetails.log, "has_been_immunized"]
                              }));
                            }
                          }} />
                        <Form.Check
                          type="radio"
                          name="immunized"
                          id="noi"
                          label="No"
                          checked={childDetails?.has_been_immunized === false}
                          defaultChecked
                          onChange={() => {
                            setChildDetails(prevState => ({
                              ...prevState,
                              has_been_immunized: false
                            }));

                            if (!childDetails.log.includes("has_been_immunized")) {
                              setChildDetails(prevState => ({
                                ...prevState,
                                log: [...childDetails.log, "has_been_immunized"]
                              }));
                            }
                          }} />
                      </div>
                      <Form.Text className="text-muted">
                        if 'Yes' please provide the details.
                      </Form.Text>

                      {
                        childDetails.has_been_immunized &&
                        <>
                          <Form.Group className="col-md-6 mb-3 mt-3">
                            <Form.Label>Please attach your child's immunisation records</Form.Label>
                            <DragDropMultiple 
                              module="child-enrollment"
                              fileLimit={1}
                              supportFormDetails={immunisationRecordDetails}
                              onSave={setImmunisationRecord} />
                            <small className="fileinput" style={{ width: '95px', textAlign: 'center' }}>(Upload 1 file)</small>
                          </Form.Group>
                          {
                            immunisationRecordDetails &&
                            (
                              <div>
                                <a href={immunisationRecordDetails?.file}><p>{immunisationRecordDetails?.originalName}</p></a>
                                <img
                                  onClick={() => handleChildFileDelete(immunisationRecordDetails?.id)}
                                  // className="file-remove"
                                  style={{ width: "25px", height: "auto", cursor: "pointer" }}
                                  src="https://cdn4.iconfinder.com/data/icons/linecon/512/delete-512.png"
                                  alt="" />
                              </div>
                            )
                          }
                        </>
                      }
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
              {
                childDetails.has_been_immunized &&
                <>
                  <h2 className="title-xs mb-4 mt-4">Information about the child</h2>
                  <div className="grayback">
                    <p>A parent or guardian who has lawful authority in relation to the child must comple ’s enrolment information as required in the Children’s Service’s Regulations 2017 and education and care services national law act 2010. Based on these regulations, parents are not required to fill questions marked with an asterisk, however, it will be highly important for the service to have those details.</p>
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

                  <h2 className="title-xs mt-4 mb-4">Child's Immunisation Record</h2>

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
                                <Form.Check
                                  name="hepatitis_b"
                                  type="checkbox"
                                  val="1"
                                  checked={childImmunisationRecord?.hepatitis_b.includes("1")}
                                  id="hepatitis_b1"
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      hepatitis_b: childImmunisationRecord?.hepatitis_b.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.hepatitis_b.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.hepatitis_b, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("hepatitis_b")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "hepatitis_b"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="hepatitis_b"
                                  type="checkbox"
                                  id="hepatitis_b2"
                                  val="2"
                                  checked={childImmunisationRecord?.hepatitis_b.includes("2")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      hepatitis_b: childImmunisationRecord?.hepatitis_b.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.hepatitis_b.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.hepatitis_b, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("hepatitis_b")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "hepatitis_b"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="hepatitis_b"
                                  type="checkbox"
                                  id="hepatitis_b3"
                                  val="3"
                                  checked={childImmunisationRecord?.hepatitis_b.includes("3")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      hepatitis_b: childImmunisationRecord?.hepatitis_b.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.hepatitis_b.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.hepatitis_b, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("hepatitis_b")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "hepatitis_b"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="hepatitis_b"
                                  type="checkbox"
                                  id="hepatitis_b4"
                                  val="4"
                                  checked={childImmunisationRecord?.hepatitis_b.includes("4")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      hepatitis_b: childImmunisationRecord?.hepatitis_b.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.hepatitis_b.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.hepatitis_b, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("hepatitis_b")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "hepatitis_b"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="hepatitis_b"
                                  type="checkbox"
                                  id="hepatitis_b5"
                                  val="5"
                                  checked={childImmunisationRecord?.hepatitis_b.includes("5")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      hepatitis_b: childImmunisationRecord?.hepatitis_b.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.hepatitis_b.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.hepatitis_b, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("hepatitis_b")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "hepatitis_b"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="hepatitis_b"
                                  type="checkbox"
                                  id="hepatitis_b6"
                                  val="6"
                                  label="&nbsp;"
                                  checked={childImmunisationRecord?.hepatitis_b.includes("6")}
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      hepatitis_b: childImmunisationRecord?.hepatitis_b.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.hepatitis_b.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.hepatitis_b, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("hepatitis_b")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "hepatitis_b"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="hepatitis_b"
                                  type="checkbox"
                                  id="hepatitis_b7"
                                  val="7"
                                  checked={childImmunisationRecord?.hepatitis_b.includes("7")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      hepatitis_b: childImmunisationRecord?.hepatitis_b.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.hepatitis_b.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.hepatitis_b, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("hepatitis_b")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "hepatitis_b"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>
                        </tr>

                        <tr>
                          <td align="left">Diphtheria, tetanus and acellular pertussis (DTPa)</td>
                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="diptheria"
                                  type="checkbox"
                                  id="diptheria1"
                                  val="1"
                                  checked={childImmunisationRecord?.diptheria.includes("1")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      diptheria: childImmunisationRecord?.diptheria.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.diptheria.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.diptheria, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("diptheria")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "diptheria"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="diptheria"
                                  type="checkbox"
                                  id="diptheria2"
                                  checked={childImmunisationRecord?.diptheria.includes("2")}
                                  val="2"
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      diptheria: childImmunisationRecord?.diptheria.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.diptheria.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.diptheria, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("diptheria")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "diptheria"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="diptheria"
                                  type="checkbox"
                                  id="diptheria3"
                                  val="3"
                                  checked={childImmunisationRecord?.diptheria.includes("3")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      diptheria: childImmunisationRecord?.diptheria.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.diptheria.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.diptheria, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("diptheria")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "diptheria"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="diptheria"
                                  type="checkbox"
                                  id="diptheria4"
                                  val="4"
                                  checked={childImmunisationRecord?.diptheria.includes("4")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      diptheria: childImmunisationRecord?.diptheria.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.diptheria.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.diptheria, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("diptheria")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "diptheria"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="diptheria"
                                  type="checkbox"
                                  id="diptheria5"
                                  val="5"
                                  checked={childImmunisationRecord?.diptheria.includes("5")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      diptheria: childImmunisationRecord?.diptheria.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.diptheria.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.diptheria, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("diptheria")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "diptheria"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="diptheria"
                                  type="checkbox"
                                  id="diptheria6"
                                  val="6"
                                  checked={childImmunisationRecord?.diptheria.includes("6")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      diptheria: childImmunisationRecord?.diptheria.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.diptheria.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.diptheria, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("diptheria")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "diptheria"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="diptheria"
                                  type="checkbox"
                                  id="diptheria7"
                                  val="7"
                                  checked={childImmunisationRecord?.diptheria.includes("7")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      diptheria: childImmunisationRecord?.diptheria.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.diptheria.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.diptheria, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("diptheria")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "diptheria"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>
                        </tr>

                        <tr>
                          <td align="left">Haemophilus influenza (Type B)</td>
                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="haemophilus"
                                  type="checkbox"
                                  id="haemophilus1"
                                  val="1"
                                  checked={childImmunisationRecord?.haemophilus.includes("1")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      haemophilus: childImmunisationRecord?.haemophilus.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.haemophilus.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.haemophilus, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("haemophilus")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "haemophilus"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="haemophilus"
                                  type="checkbox"
                                  id="haemophilus2"
                                  val="2"
                                  checked={childImmunisationRecord?.haemophilus.includes("2")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      haemophilus: childImmunisationRecord?.haemophilus.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.haemophilus.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.haemophilus, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("haemophilus")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "haemophilus"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="haemophilus"
                                  type="checkbox"
                                  id="haemophilus3"
                                  val="3"
                                  checked={childImmunisationRecord?.haemophilus.includes("3")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      haemophilus: childImmunisationRecord?.haemophilus.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.haemophilus.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.haemophilus, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("haemophilus")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "haemophilus"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="haemophilus"
                                  type="checkbox"
                                  id="haemophilus4"
                                  val="4"
                                  checked={childImmunisationRecord?.haemophilus.includes("4")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      haemophilus: childImmunisationRecord?.haemophilus.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.haemophilus.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.haemophilus, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("haemophilus")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "haemophilus"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="haemophilus"
                                  type="checkbox"
                                  id="haemophilus5"
                                  val="5"
                                  checked={childImmunisationRecord?.haemophilus.includes("5")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      haemophilus: childImmunisationRecord?.haemophilus.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.haemophilus.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.haemophilus, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("haemophilus")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "haemophilus"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="haemophilus"
                                  type="checkbox"
                                  id="haemophilus6"
                                  val="6"
                                  checked={childImmunisationRecord?.haemophilus.includes("6")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      haemophilus: childImmunisationRecord?.haemophilus.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.haemophilus.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.haemophilus, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("haemophilus")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "haemophilus"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="haemophilus"
                                  type="checkbox"
                                  id="haemophilus7"
                                  val="7"
                                  checked={childImmunisationRecord?.haemophilus.includes("7")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      haemophilus: childImmunisationRecord?.haemophilus.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.haemophilus.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.haemophilus, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("haemophilus")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "haemophilus"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>
                        </tr>

                        <tr>
                          <td align="left">Inactivated poliomyelitis (IPV)</td>
                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="inactivated_poliomyelitis"
                                  type="checkbox"
                                  id="inactivated_poliomyelitis1"
                                  val="1"
                                  checked={childImmunisationRecord?.inactivated_poliomyelitis.includes("7")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      inactivated_poliomyelitis: childImmunisationRecord?.inactivated_poliomyelitis.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.inactivated_poliomyelitis.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.inactivated_poliomyelitis, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("inactivated_poliomyelitis")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "inactivated_poliomyelitis"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="inactivated_poliomyelitis"
                                  type="checkbox"
                                  id="inactivated_poliomyelitis2"
                                  val="2"
                                  checked={childImmunisationRecord?.inactivated_poliomyelitis.includes("2")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      inactivated_poliomyelitis: childImmunisationRecord?.inactivated_poliomyelitis.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.inactivated_poliomyelitis.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.inactivated_poliomyelitis, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("inactivated_poliomyelitis")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "inactivated_poliomyelitis"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="inactivated_poliomyelitis"
                                  type="checkbox"
                                  id="inactivated_poliomyelitis3"
                                  val="3"
                                  checked={childImmunisationRecord?.inactivated_poliomyelitis.includes("3")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      inactivated_poliomyelitis: childImmunisationRecord?.inactivated_poliomyelitis.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.inactivated_poliomyelitis.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.inactivated_poliomyelitis, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("inactivated_poliomyelitis")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "inactivated_poliomyelitis"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="inactivated_poliomyelitis"
                                  type="checkbox"
                                  id="inactivated_poliomyelitis4"
                                  val="4"
                                  checked={childImmunisationRecord?.inactivated_poliomyelitis.includes("4")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      inactivated_poliomyelitis: childImmunisationRecord?.inactivated_poliomyelitis.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.inactivated_poliomyelitis.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.inactivated_poliomyelitis, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("inactivated_poliomyelitis")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "inactivated_poliomyelitis"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="inactivated_poliomyelitis"
                                  type="checkbox"
                                  id="inactivated_poliomyelitis5"
                                  val="5"
                                  checked={childImmunisationRecord?.inactivated_poliomyelitis.includes("5")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      inactivated_poliomyelitis: childImmunisationRecord?.inactivated_poliomyelitis.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.inactivated_poliomyelitis.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.inactivated_poliomyelitis, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("inactivated_poliomyelitis")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "inactivated_poliomyelitis"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="inactivated_poliomyelitis"
                                  type="checkbox"
                                  id="inactivated_poliomyelitis6"
                                  val="6"
                                  checked={childImmunisationRecord?.inactivated_poliomyelitis.includes("6")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      inactivated_poliomyelitis: childImmunisationRecord?.inactivated_poliomyelitis.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.inactivated_poliomyelitis.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.inactivated_poliomyelitis, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("inactivated_poliomyelitis")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "inactivated_poliomyelitis"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="inactivated_poliomyelitis"
                                  type="checkbox"
                                  id="inactivated_poliomyelitis7"
                                  val="7"
                                  checked={childImmunisationRecord?.inactivated_poliomyelitis.includes("7")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      inactivated_poliomyelitis: childImmunisationRecord?.inactivated_poliomyelitis.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.inactivated_poliomyelitis.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.inactivated_poliomyelitis, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("inactivated_poliomyelitis")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "inactivated_poliomyelitis"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>
                        </tr>

                        <tr>
                          <td align="left">Pneumococcal Conjugate (7vPVC)</td>
                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="pneumococcal_conjugate"
                                  type="checkbox"
                                  id="pneumococcal_conjugate1"
                                  val="1"
                                  checked={childImmunisationRecord?.pneumococcal_conjugate.includes("1")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      pneumococcal_conjugate: childImmunisationRecord?.pneumococcal_conjugate.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.pneumococcal_conjugate.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.pneumococcal_conjugate, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("pneumococcal_conjugate")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "pneumococcal_conjugate"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="pneumococcal_conjugate"
                                  type="checkbox"
                                  id="pneumococcal_conjugate2"
                                  val="2"
                                  checked={childImmunisationRecord?.pneumococcal_conjugate.includes("2")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      pneumococcal_conjugate: childImmunisationRecord?.pneumococcal_conjugate.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.pneumococcal_conjugate.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.pneumococcal_conjugate, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("pneumococcal_conjugate")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "pneumococcal_conjugate"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="pneumococcal_conjugate"
                                  type="checkbox"
                                  id="pneumococcal_conjugate3"
                                  val="3"
                                  checked={childImmunisationRecord?.pneumococcal_conjugate.includes("3")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      pneumococcal_conjugate: childImmunisationRecord?.pneumococcal_conjugate.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.pneumococcal_conjugate.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.pneumococcal_conjugate, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("pneumococcal_conjugate")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "pneumococcal_conjugate"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="pneumococcal_conjugate"
                                  type="checkbox"
                                  id="pneumococcal_conjugate4"
                                  val="4"
                                  checked={childImmunisationRecord?.pneumococcal_conjugate.includes("4")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      pneumococcal_conjugate: childImmunisationRecord?.pneumococcal_conjugate.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.pneumococcal_conjugate.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.pneumococcal_conjugate, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("pneumococcal_conjugate")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "pneumococcal_conjugate"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="pneumococcal_conjugate"
                                  type="checkbox"
                                  id="pneumococcal_conjugate5"
                                  val="5"
                                  checked={childImmunisationRecord?.pneumococcal_conjugate.includes("5")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      pneumococcal_conjugate: childImmunisationRecord?.pneumococcal_conjugate.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.pneumococcal_conjugate.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.pneumococcal_conjugate, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("pneumococcal_conjugate")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "pneumococcal_conjugate"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="pneumococcal_conjugate"
                                  type="checkbox"
                                  id="pneumococcal_conjugate6"
                                  val="6"
                                  checked={childImmunisationRecord?.pneumococcal_conjugate.includes("6")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      pneumococcal_conjugate: childImmunisationRecord?.pneumococcal_conjugate.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.pneumococcal_conjugate.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.pneumococcal_conjugate, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("pneumococcal_conjugate")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "pneumococcal_conjugate"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="pneumococcal_conjugate"
                                  type="checkbox"
                                  id="pneumococcal_conjugate7"
                                  val="7"
                                  checked={childImmunisationRecord?.pneumococcal_conjugate.includes("7")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      pneumococcal_conjugate: childImmunisationRecord?.pneumococcal_conjugate.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.pneumococcal_conjugate.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.pneumococcal_conjugate, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("pneumococcal_conjugate")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "pneumococcal_conjugate"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>
                        </tr>

                        <tr>
                          <td align="left">Rotavirus</td>
                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="rotavirus"
                                  type="checkbox"
                                  id="rotavirus1"
                                  val="1"
                                  checked={childImmunisationRecord?.rotavirus.includes("1")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      rotavirus: childImmunisationRecord?.rotavirus.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.rotavirus.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.rotavirus, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("rotavirus")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "rotavirus"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="rotavirus"
                                  type="checkbox"
                                  id="rotavirus2"
                                  val="2"
                                  checked={childImmunisationRecord?.rotavirus.includes("2")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      rotavirus: childImmunisationRecord?.rotavirus.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.rotavirus.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.rotavirus, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("rotavirus")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "rotavirus"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="rotavirus"
                                  type="checkbox"
                                  id="rotavirus3"
                                  val="3"
                                  checked={childImmunisationRecord?.rotavirus.includes("3")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      rotavirus: childImmunisationRecord?.rotavirus.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.rotavirus.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.rotavirus, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("rotavirus")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "rotavirus"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="rotavirus"
                                  type="checkbox"
                                  id="rotavirus4"
                                  val="4"
                                  checked={childImmunisationRecord?.rotavirus.includes("4")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      rotavirus: childImmunisationRecord?.rotavirus.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.rotavirus.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.rotavirus, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("rotavirus")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "rotavirus"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="rotavirus"
                                  type="checkbox"
                                  id="rotavirus5"
                                  val="5"
                                  checked={childImmunisationRecord?.rotavirus.includes("5")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      rotavirus: childImmunisationRecord?.rotavirus.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.rotavirus.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.rotavirus, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("rotavirus")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "rotavirus"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="rotavirus"
                                  type="checkbox"
                                  id="rotavirus6"
                                  val="6"
                                  checked={childImmunisationRecord?.rotavirus.includes("6")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      rotavirus: childImmunisationRecord?.rotavirus.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.rotavirus.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.rotavirus, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("rotavirus")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "rotavirus"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="rotavirus"
                                  type="checkbox"
                                  id="rotavirus7"
                                  val="7"
                                  checked={childImmunisationRecord?.rotavirus.includes("7")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      rotavirus: childImmunisationRecord?.rotavirus.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.rotavirus.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.rotavirus, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("rotavirus")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "rotavirus"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>
                        </tr>

                        <tr>
                          <td align="left">Measules, mumps an rubella (MMR)</td>
                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="measules"
                                  type="checkbox"
                                  id="measules1"
                                  val="1"
                                  checked={childImmunisationRecord?.measules.includes("1")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      measules: childImmunisationRecord?.measules.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.measules.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.measules, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("measules")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "measules"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="measules"
                                  type="checkbox"
                                  id="measules2"
                                  val="2"
                                  checked={childImmunisationRecord?.measules.includes("2")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      measules: childImmunisationRecord?.measules.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.measules.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.measules, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("measules")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "measules"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="measules"
                                  type="checkbox"
                                  id="measules3"
                                  val="3"
                                  checked={childImmunisationRecord?.measules.includes("3")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      measules: childImmunisationRecord?.measules.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.measules.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.measules, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("measules")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "measules"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="measules"
                                  type="checkbox"
                                  id="measules4"
                                  val="4"
                                  checked={childImmunisationRecord?.measules.includes("4")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      measules: childImmunisationRecord?.measules.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.measules.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.measules, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("measules")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "measules"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="measules"
                                  type="checkbox"
                                  id="measules5"
                                  val="5"
                                  checked={childImmunisationRecord?.measules.includes("5")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      measules: childImmunisationRecord?.measules.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.measules.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.measules, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("measules")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "measules"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="measules"
                                  type="checkbox"
                                  id="measules6"
                                  val="6"
                                  checked={childImmunisationRecord?.measules.includes("6")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      measules: childImmunisationRecord?.measules.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.measules.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.measules, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("measules")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "measules"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="measules"
                                  type="checkbox"
                                  id="measules7"
                                  val="7"
                                  checked={childImmunisationRecord?.measules.includes("7")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      measules: childImmunisationRecord?.measules.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.measules.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.measules, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("measules")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "measules"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>
                        </tr>

                        <tr>
                          <td align="left">Meningococcal C</td>
                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="meningococcal_c"
                                  type="checkbox"
                                  id="meningococcal_c1"
                                  val="1"
                                  checked={childImmunisationRecord?.meningococcal_c.includes("1")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      meningococcal_c: childImmunisationRecord?.meningococcal_c.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.meningococcal_c.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.meningococcal_c, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("meningococcal_c")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "meningococcal_c"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="meningococcal_c"
                                  type="checkbox"
                                  id="meningococcal_c2"
                                  val="2"
                                  checked={childImmunisationRecord?.meningococcal_c.includes("2")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      meningococcal_c: childImmunisationRecord?.meningococcal_c.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.meningococcal_c.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.meningococcal_c, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("meningococcal_c")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "meningococcal_c"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="meningococcal_c"
                                  type="checkbox"
                                  id="meningococcal_c3"
                                  val="3"
                                  checked={childImmunisationRecord?.meningococcal_c.includes("3")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      meningococcal_c: childImmunisationRecord?.meningococcal_c.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.meningococcal_c.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.meningococcal_c, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("meningococcal_c")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "meningococcal_c"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="meningococcal_c"
                                  type="checkbox"
                                  id="meningococcal_c4"
                                  val="4"
                                  checked={childImmunisationRecord?.meningococcal_c.includes("4")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      meningococcal_c: childImmunisationRecord?.meningococcal_c.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.meningococcal_c.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.meningococcal_c, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("meningococcal_c")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "meningococcal_c"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="meningococcal_c"
                                  type="checkbox"
                                  id="meningococcal_c5"
                                  val="5"
                                  checked={childImmunisationRecord?.meningococcal_c.includes("5")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      meningococcal_c: childImmunisationRecord?.meningococcal_c.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.meningococcal_c.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.meningococcal_c, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("meningococcal_c")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "meningococcal_c"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="meningococcal_c"
                                  type="checkbox"
                                  id="meningococcal_c6"
                                  val="6"
                                  checked={childImmunisationRecord?.meningococcal_c.includes("6")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      meningococcal_c: childImmunisationRecord?.meningococcal_c.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.meningococcal_c.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.meningococcal_c, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("meningococcal_c")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "meningococcal_c"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="meningococcal_c"
                                  type="checkbox"
                                  id="meningococcal_c7"
                                  val="7"
                                  checked={childImmunisationRecord?.meningococcal_c.includes("7")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      meningococcal_c: childImmunisationRecord?.meningococcal_c.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.meningococcal_c.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.meningococcal_c, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("meningococcal_c")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "meningococcal_c"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>
                        </tr>

                        <tr>
                          <td align="left">Varicella (VZC)</td>
                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="varicella"
                                  type="checkbox"
                                  id="varicella1"
                                  val="1"
                                  checked={childImmunisationRecord?.varicella.includes("1")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      varicella: childImmunisationRecord?.varicella.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.varicella.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.varicella, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("varicella")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "varicella"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="varicella"
                                  type="checkbox"
                                  id="varicella2"
                                  val="2"
                                  checked={childImmunisationRecord?.varicella.includes("2")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      varicella: childImmunisationRecord?.varicella.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.varicella.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.varicella, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("varicella")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "varicella"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="varicella"
                                  type="checkbox"
                                  id="varicella3"
                                  val="3"
                                  checked={childImmunisationRecord?.varicella.includes("3")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      varicella: childImmunisationRecord?.varicella.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.varicella.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.varicella, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("varicella")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "varicella"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="varicella"
                                  type="checkbox"
                                  id="varicella4"
                                  val="4"
                                  checked={childImmunisationRecord?.varicella.includes("4")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      varicella: childImmunisationRecord?.varicella.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.varicella.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.varicella, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("varicella")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "varicella"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="varicella"
                                  type="checkbox"
                                  id="varicella5"
                                  val="5"
                                  checked={childImmunisationRecord?.varicella.includes("5")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      varicella: childImmunisationRecord?.varicella.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.varicella.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.varicella, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("varicella")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "varicella"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="varicella"
                                  type="checkbox"
                                  id="varicella6"
                                  val="6"
                                  checked={childImmunisationRecord?.varicella.includes("6")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      varicella: childImmunisationRecord?.varicella.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.varicella.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.varicella, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("varicella")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "varicella"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>

                          <td align="center">
                            <Form.Group>
                              <div className="btn-checkbox">
                                <Form.Check
                                  name="varicella"
                                  type="checkbox"
                                  id="varicella7"
                                  val="7"
                                  checked={childImmunisationRecord?.varicella.includes("7")}
                                  label="&nbsp;"
                                  onChange={(e) => {
                                    setChildImmunisationRecord(prevState => ({
                                      ...prevState,
                                      varicella: childImmunisationRecord?.varicella.includes(e.target.getAttribute('val')) ? childImmunisationRecord?.varicella.filter(d => parseInt(d) !== parseInt(e.target.getAttribute('val'))) : [...childImmunisationRecord?.varicella, e.target.getAttribute('val')]
                                    }));

                                    if (!childImmunisationRecord.log.includes("varicella")) {
                                      setChildImmunisationRecord(prevState => ({
                                        ...prevState,
                                        log: [...childImmunisationRecord.log, "varicella"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </td>
                        </tr>

                        <tr>
                          <td colspan="8">
                            Additional immunisations for Aboriginals and Torres Strait Islander Children (If required)
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </>
              }

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
                    <h2 className="title-xs mb-4 mt-4">Child's Medicare Information</h2>
                    <div className="grayback">
                      <div className="single-col">
                        <p>Does your child have any special needs?</p>
                        <Form.Group className="ms-auto">
                          <div className="btn-radio inline-col mb-0">
                            <Form.Check
                              type="radio"
                              name="photo"
                              id="yesp"
                              label="Yes"
                              checked={childMedicalInformation?.has_special_needs === true}
                              onChange={() => {
                                setChildMedicalInformation(prevState => ({
                                  ...prevState,
                                  has_special_needs: true
                                }));

                                if (!childMedicalInformation.log.includes("has_special_needs")) {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: [...childMedicalInformation.log, "has_special_needs"]
                                  }));
                                }
                              }} />
                            <Form.Check
                              type="radio"
                              name="photo"
                              id="nop"
                              defaultChecked
                              checked={childMedicalInformation?.has_special_needs === false}
                              label="No"
                              onChange={() => {
                                setChildMedicalInformation(prevState => ({
                                  ...prevState,
                                  has_special_needs: false,
                                  special_need_details: "",
                                  inclusion_support_form_of_special_needs: false
                                }));

                                if (!childMedicalInformation.log.includes("has_special_needs")) {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: [...childMedicalInformation.log, "has_special_needs"]
                                  }));
                                } else {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: childMedicalInformation.log.filter(d => d !== "special_need_details" && d !== "inclusion_support_form_of_special_needs")
                                  }));
                                }
                              }} />
                          </div>
                        </Form.Group>
                      </div>

                      <Form.Text className="text-muted mb-3 d-block">
                        if ‘Yes’ please provide details of any special needs,
                      </Form.Text>
                      {
                        childMedicalInformation.has_special_needs &&
                        <>
                          <Form.Group className="mb-3">
                            <Form.Label>Details of any special needs, early intervention service and any management procedure to be followed with respect to the special need.</Form.Label>
                            <Form.Control
                              name="special_need_details"
                              as="textarea"
                              style={{ resize: "none" }} 
                              rows={3}
                              value={childMedicalInformation?.special_need_details}
                              onChange={(e) => setChildMedicalInformation(prevState => ({
                                ...prevState,
                                [e.target.name]: e.target.value
                              }))}
                              onBlur={(e) => {
                                if (!childMedicalInformation.log.includes("special_need_details")) {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: [...childMedicalInformation.log, "special_need_details"]
                                  }));
                                }
                              }} />
                          </Form.Group>
                          <div className="single-col mb-3">
                            <p>Inclusion Support Form (If applicable)</p>
                            <Form.Group className="ms-auto">
                              <div className="btn-radio inline-col mb-0">
                                <Form.Check
                                  type="radio"
                                  name="support"
                                  id="yesss"
                                  label="Yes"
                                  checked={childMedicalInformation?.inclusion_support_form_of_special_needs === true}
                                  onChange={() => {
                                    setChildMedicalInformation(prevState => ({
                                      ...prevState,
                                      inclusion_support_form_of_special_needs: true
                                    }));

                                    if (!childMedicalInformation.log.includes("inclusion_support_form_of_special_needs")) {
                                      setChildMedicalInformation(prevState => ({
                                        ...prevState,
                                        log: [...childMedicalInformation.log, "inclusion_support_form_of_special_needs"]
                                      }));
                                    }
                                  }} />
                                <Form.Check
                                  type="radio"
                                  name="support"
                                  id="noss"
                                  label="No"
                                  checked={childMedicalInformation?.inclusion_support_form_of_special_needs === false}
                                  defaultChecked
                                  onChange={() => {
                                    setChildMedicalInformation(prevState => ({
                                      ...prevState,
                                      inclusion_support_form_of_special_needs: false
                                    }));

                                    if (!childMedicalInformation.log.includes("inclusion_support_form_of_special_needs")) {
                                      setChildMedicalInformation(prevState => ({
                                        ...prevState,
                                        log: [...childMedicalInformation.log, "inclusion_support_form_of_special_needs"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </div>
                        </>
                      }

                      <div className="single-col mb-3">
                        <p>Does Your Child have any senstivity?</p>
                        <Form.Group className="ms-auto">
                          <div className="btn-radio inline-col mb-0">
                            <Form.Check
                              type="radio"
                              name="senstivity"
                              id="yesa"
                              label="Yes"
                              checked={childMedicalInformation?.has_sensitivity === true}
                              onChange={() => {
                                setChildMedicalInformation(prevState => ({
                                  ...prevState,
                                  has_sensitivity: true
                                }));

                                if (!childMedicalInformation.log.includes("has_sensitivity")) {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: [...childMedicalInformation.log, "has_sensitivity"]
                                  }));
                                }
                              }} />
                            <Form.Check
                              type="radio"
                              name="senstivity"
                              id="noa"
                              label="No"
                              checked={childMedicalInformation?.has_sensitivity === false}
                              defaultChecked
                              onChange={() => {
                                setChildMedicalInformation(prevState => ({
                                  ...prevState,
                                  has_sensitivity: false,
                                  details_of_allergies: "",
                                  inclusion_support_form_of_allergies: false
                                }));

                                if (!childMedicalInformation.log.includes("has_sensitivity")) {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: [...childMedicalInformation.log, "has_sensitivity"]
                                  }));
                                } else {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: childMedicalInformation.log.filter(d => d !== "details_of_allergies" && d !== "inclusion_support_form_of_allergies")
                                  }));
                                }
                              }} />
                          </div>
                        </Form.Group>
                      </div>
                      {
                        childMedicalInformation.has_sensitivity &&
                        <>
                          <Form.Group className="mb-3">
                            <Form.Label>If yes, please provide details of any allergies and any management procedure to be followed with respect to the allergy</Form.Label>
                            <Form.Control
                              name="details_of_allergies"
                              as="textarea"
                              style={{ resize: "none" }} 
                              value={childMedicalInformation?.details_of_allergies || ""}
                              rows={3}
                              onChange={(e) => {
                                setChildMedicalInformation(prevState => ({
                                  ...prevState,
                                  [e.target.name]: e.target.value
                                }));

                                if (!childMedicalInformation.log.includes("details_of_allergies")) {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: [...childMedicalInformation.log, "details_of_allergies"]
                                  }));
                                }
                              }} />
                          </Form.Group>
                          <div className="single-col mb-3">
                            <p>Inclusion Support Form (If applicable)</p>
                            <Form.Group className="ms-auto">
                              <div className="btn-radio inline-col mb-0">
                                <Form.Check
                                  type="radio"
                                  name="applicable"
                                  id="yesdd"
                                  label="Yes"
                                  checked={childMedicalInformation?.inclusion_support_form_of_allergies === true}
                                  onChange={() => {
                                    setChildMedicalInformation(prevState => ({
                                      ...prevState,
                                      inclusion_support_form_of_allergies: true
                                    }));

                                    if (!childMedicalInformation.log.includes("inclusion_support_form_of_allergies")) {
                                      setChildMedicalInformation(prevState => ({
                                        ...prevState,
                                        log: [...childMedicalInformation.log, "inclusion_support_form_of_allergies"]
                                      }));
                                    }
                                  }} />
                                <Form.Check
                                  type="radio"
                                  name="applicable"
                                  id="nodd"
                                  label="No"
                                  checked={childMedicalInformation?.inclusion_support_form_of_allergies === false}
                                  defaultChecked
                                  onChange={() => {
                                    setChildMedicalInformation(prevState => ({
                                      ...prevState,
                                      inclusion_support_form_of_allergies: false
                                    }));

                                    if (!childMedicalInformation.log.includes("inclusion_support_form_of_allergies")) {
                                      setChildMedicalInformation(prevState => ({
                                        ...prevState,
                                        log: [...childMedicalInformation.log, "inclusion_support_form_of_allergies"]
                                      }));
                                    }
                                  }} />
                              </div>
                            </Form.Group>
                          </div>
                        </>
                      }

                      <div className="single-col mb-3">
                        <p>Does your child have an auto injection device (e.g. EpiPen®)?</p>
                        <Form.Group className="ms-auto">
                          <div className="btn-radio inline-col mb-0">
                            <Form.Check
                              type="radio"
                              name="injection"
                              id="yesin"
                              label="Yes"
                              checked={childMedicalInformation?.has_autoinjection_device === true}
                              onChange={() => {
                                setChildMedicalInformation(prevState => ({
                                  ...prevState,
                                  has_autoinjection_device: true
                                }));

                                if (!childMedicalInformation.log.includes("has_autoinjection_device")) {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: [...childMedicalInformation.log, "has_autoinjection_device"]
                                  }));
                                }
                              }} />
                            <Form.Check
                              type="radio"
                              name="injection"
                              id="noin"
                              label="No"
                              checked={childMedicalInformation?.has_autoinjection_device === false || childMedicalInformation?.has_autoinjection_device === null}
                              defaultChecked
                              onChange={() => {
                                setChildMedicalInformation(prevState => ({
                                  ...prevState,
                                  has_autoinjection_device: false,
                                  has_anaphylaxis_medical_plan_been_provided: false
                                }));

                                if (!childMedicalInformation.log.includes("has_autoinjection_device")) {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: [...childMedicalInformation.log, "has_autoinjection_device"]
                                  }));
                                } else {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: childMedicalInformation.log.filter(d => d !== "has_anaphylaxis_medical_plan_been_provided")
                                  }));
                                }
                              }} />
                          </div>
                        </Form.Group>
                      </div>
                      {
                        childMedicalInformation.has_autoinjection_device &&
                        <div className="single-col mb-3">
                          <p>If yes, has the anaphylaxis medical management plan been provided to the service?</p>
                          <Form.Group className="ms-auto">
                            <div className="btn-radio inline-col mb-0">
                              <Form.Check
                                type="radio"
                                name="service"
                                id="yesm"
                                label="Yes"
                                checked={childMedicalInformation?.has_anaphylaxis_medical_plan_been_provided === true}
                                onChange={() => {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    has_anaphylaxis_medical_plan_been_provided: true
                                  }));

                                  if (!childMedicalInformation.log.includes("has_anaphylaxis_medical_plan_been_provided")) {
                                    setChildMedicalInformation(prevState => ({
                                      ...prevState,
                                      log: [...childMedicalInformation.log, "has_anaphylaxis_medical_plan_been_provided"]
                                    }));
                                  }
                                }} />
                              <Form.Check
                                type="radio"
                                name="service"
                                id="nom"
                                label="No"
                                checked={childMedicalInformation?.has_anaphylaxis_medical_plan_been_provided === false}
                                defaultChecked
                                onChange={() => {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    has_anaphylaxis_medical_plan_been_provided: false
                                  }));

                                  if (!childMedicalInformation.log.includes("has_anaphylaxis_medical_plan_been_provided")) {
                                    setChildMedicalInformation(prevState => ({
                                      ...prevState,
                                      log: [...childMedicalInformation.log, "has_anaphylaxis_medical_plan_been_provided"]
                                    }));
                                  }
                                }} />
                            </div>
                          </Form.Group>
                        </div>
                      }
                      <div className="single-col mb-3">
                        <p>Has a risk management plan been completed by the service in consultation with you?</p>
                        <Form.Group className="ms-auto">
                          <div className="btn-radio inline-col mb-0">
                            <Form.Check
                              type="radio"
                              name="management"
                              id="yese"
                              label="Yes"
                              checked={childMedicalInformation?.risk_management_plan_completed === true}
                              onChange={() => {
                                setChildMedicalInformation(prevState => ({
                                  ...prevState,
                                  risk_management_plan_completed: true
                                }));

                                if (!childMedicalInformation.log.includes("risk_management_plan_completed")) {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: [...childMedicalInformation.log, "risk_management_plan_completed"]
                                  }));
                                }
                              }} />
                            <Form.Check
                              type="radio"
                              name="management"
                              id="noe"
                              defaultChecked
                              label="No"
                              checked={childMedicalInformation?.risk_management_plan_completed === false || childMedicalInformation?.risk_management_plan_completed === null}
                              onChange={() => {
                                setChildMedicalInformation(prevState => ({
                                  ...prevState,
                                  risk_management_plan_completed: false
                                }));

                                if (!childMedicalInformation.log.includes("risk_management_plan_completed")) {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: [...childMedicalInformation.log, "risk_management_plan_completed"]
                                  }));
                                }
                              }} />
                          </div>
                        </Form.Group>
                      </div>
                      <p className="mb-3">In case of anaphylaxis, you are required to provide the service with an individual medical management plan for your child signed by the medical practitioner. This will be attached to your child’s enrolment form. More information is available at <a href="www.education.vic.gov.au/anaphyaxis">www.education.vic.gov.au/anaphyaxis</a>.</p>
                      <div className="single-col mb-3">
                        <p>Does your child have any other medical conditions? (e.g. asthma, epilepsy, and diabetes, etc. that are relevant to the care of your child)</p>
                        <Form.Group className="ms-auto">
                          <div className="btn-radio inline-col mb-0">
                            <Form.Check
                              type="radio"
                              name="conditions"
                              id="yest"
                              label="Yes"
                              checked={childMedicalInformation?.any_other_medical_condition === true}
                              onChange={() => {
                                setChildMedicalInformation(prevState => ({
                                  ...prevState,
                                  any_other_medical_condition: true
                                }));

                                if (!childMedicalInformation.log.includes("any_other_medical_condition")) {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: [...childMedicalInformation.log, "any_other_medical_condition"]
                                  }));
                                }
                              }} />
                            <Form.Check
                              type="radio"
                              name="conditions"
                              id="not"
                              label="No"
                              checked={childMedicalInformation?.any_other_medical_condition === false}
                              defaultChecked
                              onChange={() => {
                                setChildMedicalInformation(prevState => ({
                                  ...prevState,
                                  any_other_medical_condition: false,
                                  detail_of_other_condition: ""
                                }));

                                if (!childMedicalInformation.log.includes("any_other_medical_condition")) {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: [...childMedicalInformation.log, "any_other_medical_condition"]
                                  }));
                                } else {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: childMedicalInformation.log.filter(d => d !== "detail_of_other_condition")
                                  }));
                                }
                              }} />
                          </div>
                        </Form.Group>
                      </div>
                      {
                        childMedicalInformation.any_other_medical_condition &&
                        <Form.Group className="mb-3">
                          <Form.Label>*If yes please provide details of any medical condition and any management procedure to be followed with respect to the medical condition</Form.Label>
                          <Form.Control
                            name="detail_of_other_condition"
                            as="textarea"
                            style={{ resize: "none" }} 
                            rows={3}
                            value={childMedicalInformation?.detail_of_other_condition || ""}
                            onChange={(e) => {
                              setChildMedicalInformation(prevState => ({
                                ...prevState,
                                [e.target.name]: e.target.value
                              }));
                            }}

                            onBlur={(e) => {
                              if (!childMedicalInformation.log.includes("detail_of_other_condition")) {
                                setChildMedicalInformation(prevState => ({
                                  ...prevState,
                                  log: [...childMedicalInformation.log, "detail_of_other_condition"]
                                }));
                              }
                            }} />
                        </Form.Group>
                      }
                      <div className="single-col mb-3">
                        <p>Does the child have any dietary restrictions?</p>
                        <Form.Group className="ms-auto">
                          <div className="btn-radio inline-col mb-0">
                            <Form.Check
                              type="radio"
                              name="dietary"
                              id="yesh"
                              label="Yes"
                              checked={childMedicalInformation?.has_dietary_restrictions === true}
                              onChange={() => {
                                setChildMedicalInformation(prevState => ({
                                  ...prevState,
                                  has_dietary_restrictions: true
                                }));

                                if (!childMedicalInformation.log.includes("has_dietary_restrictions")) {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: [...childMedicalInformation.log, "has_dietary_restrictions"]
                                  }));
                                }
                              }} />
                            <Form.Check
                              type="radio"
                              name="dietary"
                              id="noh"
                              label="No"
                              checked={childMedicalInformation?.has_dietary_restrictions === false}
                              defaultChecked
                              onChange={() => {
                                setChildMedicalInformation(prevState => ({
                                  ...prevState,
                                  has_dietary_restrictions: false,
                                  details_of_restrictions: ""
                                }));

                                if (!childMedicalInformation.log.includes("has_dietary_restrictions")) {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: [...childMedicalInformation.log, "has_dietary_restrictions"]
                                  }));
                                } else {
                                  setChildMedicalInformation(prevState => ({
                                    ...prevState,
                                    log: childMedicalInformation.log.filter(d => d !== "details_of_restrictions")
                                  }));
                                }
                              }} />
                          </div>
                        </Form.Group>
                      </div>
                      {
                        childMedicalInformation.has_dietary_restrictions &&
                        <Form.Group className="mb-3">
                          <Form.Label>If yes, the following restrictions apply: </Form.Label>
                          <Form.Control
                            name="details_of_restrictions"
                            as="textarea"
                            style={{ resize: "none" }} 
                            rows={3}
                            value={childMedicalInformation?.details_of_restrictions || ""}
                            onChange={(e) => {
                              setChildMedicalInformation(prevState => ({
                                ...prevState,
                                [e.target.name]: e.target.value
                              }));
                            }}
                            onBlur={(e) => {
                              if (!childMedicalInformation.log.includes("details_of_restrictions")) {
                                setChildMedicalInformation(prevState => ({
                                  ...prevState,
                                  log: [...childMedicalInformation.log, "details_of_restrictions"]
                                }));
                              }
                            }} />
                        </Form.Group>
                      }
                    </div>

                  </div>
                  {/* <div className="cta text-center mt-5 mb-5">
                    <Button variant="outline" type="submit" onClick={prevStep} className="me-3">Previous</Button>
                    <Button variant="primary" type="submit">Next</Button>
                  </div> */}
                </Form>
              </div>
            </div>
            <h2 className="title-xs mb-4 mt-4">Medication Permission</h2>

            <div className="grayback">
              <p>I give consent for the educator, assistant, approved provider, nominated supervisor & coordinator to administer prescribed Medication when needed. I understand that unless all the information required on the medication form is not completed or signed the medication will not be given to my child.  I understand my educator will contact me immediately if medication such as Panadol is required.</p>
              <Form.Group className="mb-3">
                <div className="btn-checkbox">
                  <Form.Check
                    type="checkbox"
                    id="accept"
                    checked={parentData.i_give_medication_permission}
                    label="I have read and accept all the above points."
                    onChange={() => {
                      setParentData(prevState => ({
                        ...prevState,
                        i_give_medication_permission: !parentData.i_give_medication_permission,
                      }));

                      setHealthInfoFormErrors(prevState => ({
                        ...prevState,
                        i_give_medication_permission: null
                      }))

                      if (!parentData.log.includes("i_give_medication_permission")) {
                        setParentData(prevState => ({
                          ...prevState,
                          log: [...parentData.log, "i_give_medication_permission"]
                        }));
                      }
                    }} />
                </div>
                <br></br>
                {healthInfoFormErrors?.i_give_medication_permission !== null && <span className="error">{healthInfoFormErrors?.i_give_medication_permission}</span>}
              </Form.Group>
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
      </div>
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
    </>
  );
};

export default ChildEnrollment2;
