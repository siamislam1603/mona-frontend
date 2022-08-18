import React, { useState, useEffect } from "react";
import { Container, Col, Row, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import axios from "axios";
import { BASE_URL, FRONT_BASE_URL } from "../components/App";
import moment from 'moment';
import { useParams } from 'react-router-dom';
import VideoPop from "../components/VideoPop";
import { Modal } from "react-bootstrap";


const TrainingDetail = () => {
  const { trainingId } = useParams();
  const [trainingDetails, setTrainingDetails] = useState(null);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSaveAndClose = () => setShow(false);

  const [hideTrainingFinishButton, setHideTrainingFinishButton] = useState(false);
  const [trainingFinishedDate, setTrainingFinishedDate] = useState(null);
  const [users, setUsers] = useState();
  const [relatedForms, setRelatedForms] = useState();
  const [showSurveyForm, setShowSurveyForm] = useState(false);

  // GETTING THE TRAINING DETAILS
  const getTrainingDetails = async () => {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');

    const response = await axios.get(`${BASE_URL}/training/getTrainingById/${trainingId}/${user_id}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    console.log("The response", response)

    if (response.status === 200 && response.data.status === "success") {
      const { training } = response.data;
      setTrainingDetails(training);
    }
  }

  const handleFinishTraining = (event) => {
    updateFinishTraining();
  };

  const handleSurveyTransition = () => {
    console.log('handling survey transition!');
    // console.log('LINK:', `http://3.26.240.23:5000/form/dynamic/${relatedForms.form_name}`);
    window.location.href = `http://3.26.240.23:5000/form/dynamic/${relatedForms.form_name}`;
  }

  // FETCHING THE LIST OF USERS WHO FINISHED THIS TRAINING
  const fetchUsersWithFinishTraining = async () => {
    let token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/training/completed-training-user-list/${trainingId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.status === "success") {
      let { userObj } = response.data;
      setUsers(userObj.map(user => ({
        id: user.id,
        name: user.fullname,
        role: user.role,
        finish_date: user.finish_date
      })));
    }
  }

  // MARKING THE TRAINING AS FINISHED
  const updateFinishTraining = async () => {
    console.log('UPDATING FINISH TRAINING');
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}/training/completeTraining/${trainingId}/${user_id}?training_status=finished`, {}, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (response.status === 200 && response.data.status === "success") {
      setTrainingFinishedDate(response.data.finished_date);
      setHideTrainingFinishButton(true);
      setTimeout(() => {
        setShowSurveyForm(true);
      }, 2000);
    }
  };

  const fetchTrainingFormDetails = async (id) => {
    const response = await axios.get(`${BASE_URL}/training/form/training/${id}`);

    if(response.status === 200 && response.data.status === "success") {
      let { formData } = response.data;
      setRelatedForms(formData);
    }
  };

  // FETCHING THE DATE ON WHICH THIS PARTICULAR TRAINING WAS FINISHED!
  const fetchTrainingFinishDate = async () => {
    console.log('FETCHING TRAINING FINISH DATE');
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/training/get-finish-training-date/${trainingId}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });


    if (response.status === 200 && response.data.status === "hidden") {
      setHideTrainingFinishButton(false);
    } else if (response.status === 200 && response.data.status === "success") {
      let { finished_date } = response.data;
      setTrainingFinishedDate(finished_date);
      setHideTrainingFinishButton(true);
    }
  };

  useEffect(() => {
    getTrainingDetails();
    fetchTrainingFinishDate();
    fetchUsersWithFinishTraining();
  }, []);

  useEffect(() => {
    if(trainingDetails?.training_form_id)
      fetchTrainingFormDetails(trainingDetails?.training_form_id);
  }, [trainingDetails])

  trainingDetails && console.log('TRAINING DETAILS:', trainingDetails);
  relatedForms && console.log('RELATED FORMS:', relatedForms);
  return (
    <>
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
                <TopHeader
                  selectedFranchisee={selectedFranchisee}
                  setSelectedFranchisee={setSelectedFranchisee} />
                {trainingDetails &&
                  <div className="entry-container">
                    <header className="title-head">
                      <div className="traning-head">
                        <h1 className="title-sm mb-2">{trainingDetails.title}</h1>
                        <small class="d-block">Due Date: {trainingDetails?.end_date === null ? "None" : moment(trainingDetails.end_date).format('DD/MM/YYYY')}</small>
                      </div>
                      <div className="othpanel">
                        <div className="extra-btn">
                          {/* <Dropdown>
                          <Dropdown.Toggle id="extrabtn" className="ctaact">
                            <img src="../img/dot-ico.svg" alt="" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item href="#">Delete All</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown> */}
                        </div>
                      </div>
                    </header>
                    <div className="traning-detail-sec">
                      <div className="thumb-vid">
                        <img
                          src={trainingDetails.coverImage}
                          alt="video thumbnail" />
                      </div>
                      <div className="created-by">
                        <h4 className="title">Created by:</h4>
                        <div className="createrimg">
                          <img src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?w=2000" alt="" />
                        </div>
                        <p>{trainingDetails.user_data.fullname}, <span>{trainingDetails.user_data.role.split("_").map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(" ")}</span></p>
                      </div>
                      <div className="training-cont mt-3 mb-5">
                        <p>{trainingDetails.description}</p>
                      </div>

                      <Row>
                        <Col lg={5} md={6}>
                          <div className="video-tuto-sec mb-5">
                            <h3 className="title-sm">Video Tutorials</h3>
                            <div className="vid-col-sec">
                              {console.log(trainingDetails, "trainingDetails")}
                              {
                                trainingDetails.training_files.map((data, index) =>
                                  data.fileType === '.mp4' &&
                                  (
                                    <VideoPop
                                      data={data}
                                      title={`Training Video ${index + 1}`}
                                      duration={trainingDetails.completion_time}
                                      fun={handleClose} />
                                  )
                                )
                              }
                            </div>
                          </div>
                        </Col>
                        <Col lg={7} md={6}>
                          <div className="related-files-sec mb-5">
                            <h3 className="title-sm">Related Files</h3>
                            <div className="column-list files-list two-col mb-5">
                              {
                                trainingDetails.training_files.map((data, index) => data.fileType !== '.mp4' && (
                                  <div className="item">
                                    <div className="pic"><a href="">
                                      <img src="../img/book-ico.png" alt="" /></a>
                                    </div>
                                    <div className="name">
                                      <a href={data.file}>
                                        {`document${index - 1}${data.fileType}`} <span className="time">{trainingDetails.completion_time}</span>
                                      </a>
                                    </div>
                                    <div className="cta-col">
                                      <a href="">
                                        <img src="../img/removeIcon.svg" alt="" />
                                      </a>
                                    </div>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        </Col>

                        {
                          relatedForms &&
                          <Col md={12}>
                            <div className="related-form-sec mb-5">
                              <h3 className="title-sm">Related Form</h3>
                              <div className="column-list files-list three-col">
                                <div className="item">
                                  <div className="pic"><a href=""><img src="../img/folder-ico.png" alt="" /></a></div>
                                  <div className="name"><a href="">{relatedForms.form_name}</a></div>
                                  <div className="cta-col">
                                    <Dropdown>
                                      <Dropdown.Toggle variant="transparent" id="ctacol">
                                        <img src="../img/dot-ico.svg" alt="" />
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        <Dropdown.Item href="#">Delete</Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                        }

                        {
                          users &&
                          <Col md={12}>
                            <div className="training-participants-sec mb-5">
                              <h3 className="title-sm">Training Participants:</h3>
                              <div className="column-list files-list three-col">
                                {
                                  users.map(user => {
                                    return (
                                      <div className="item">
                                        <div className="userpic"><a href=""><img src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg" alt="" /></a></div>
                                        <div className="name"><a href="">{user.name} <span class="time">{user.role}</span></a></div>
                                        <div className="completed-col">
                                          Completed on <span class="date">{moment(user.finish_date).format('MM/DD/YYYY')}</span>
                                        </div>
                                      </div>
                                    );
                                  })
                                }
                              </div>
                            </div>
                          </Col>
                        }
                      </Row>

                      <div className="complete-training text-center" style={{ marginBottom: "50px" }}>
                        {hideTrainingFinishButton === true
                          ? <p> You've finished this training on {moment(trainingFinishedDate).format(
                            'MMMM Do, YYYY'
                          )}</p>
                          : <p>
                            Please acknowledge by clicking below that you have
                            completed this training completely and can proceed
                            further.
                          </p>

                        }
                        <button className={`btn btn-primary ${hideTrainingFinishButton === true ? "d-none" : ""}`} onClick={handleFinishTraining}>
                          Yes, I have completed the training
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </Container>
        </section>
      </div>

      {
        <Modal 
          show={showSurveyForm}>
          <Modal.Header>
            <Modal.Title>Congratuations!</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div>
              <p>You've finished this training successfully.</p>
              <p>Click on <strong>Next</strong> to fill the survey form.</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button 
              className="modal-button"
              onClick={() => handleSurveyTransition()}>Next</button>
          </Modal.Footer>
        </Modal>
      }
    </>
  );
};

export default TrainingDetail;
