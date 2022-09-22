import React, { useState, useEffect } from "react";
import { Container, Col, Row, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import axios from "axios";
import { BASE_URL } from "../components/App";
// import { getVideoDurationInSeconds } from 'get-video-duration';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import VideoPop from "../components/VideoPop";
import { Modal } from "react-bootstrap";

const getRoleName = (role) => {
  const obj = {
    "franchisor_admin": "franchisor admin",
    "franchisee_admin": "franchisee admin"
  }

  return obj[role];
}

// function fetchVideoDuration(videoURL) {
//   getVideoDurationInSeconds(videoURL).then((duration) => {
//     console.log(duration)
//   });
// }

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
      console.log('SUCCESS TRAINING DETAIL');
      const { training } = response.data;
      setTrainingDetails(training);
    }// } else {
    //   localStorage.setItem('success_msg', 'Training Created Successfully!');
    //   // localStorage.setItem('active_tab', '/created-training');
    //   window.location.href = "/training";
    // }
  }

  const handleFinishTraining = (event) => {

    if(relatedForms === null || typeof relatedForms === "undefined") {
      updateFinishTraining();
    } else {
      setTimeout(() => {
        setShowSurveyForm(true);
      }, 0);
    }
  };

  const handleSurveyTransition = () => {
    console.log('handling survey transition!');
    // console.log('LINK:', `http://3.26.240.23:5000/form/dynamic/${relatedForms.form_name}`);
    window.location.href = `/form/dynamic/${relatedForms.form_name}?trainingId=${trainingId}`;
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
    }
  };

  const fetchTrainingFormDetails = async (id) => {
    const response = await axios.get(`${BASE_URL}/training/form/training/${id}`);

    console.log('TRAINING FORM RESPONSE:', response);
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


  useEffect(() => {
    if(localStorage.getItem('user_role') === 'guardian') {
      window.location.href=`/parents-dashboard`;
    }
  }, []);

  users && console.log('USERS:', users);
  
  trainingDetails && console.log('TRAINING DETAILS:', trainingDetails);
  console.log('IS BUTTON VISIBLE:', hideTrainingFinishButton);
  // console.log('VIDEO URL:', fetchVideoDuration('https://www.youtube.com/watch?v=wi5h46V6NQM'));
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
                        {
                          trainingDetails?.end_date &&

                          <small className="d-block">Due Date: {moment(trainingDetails.end_date).format('DD/MM/YYYY')}</small>
                        }
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
                        {
                              trainingDetails?.training_files.map(d => d.fileType === ".mp4").includes(true) &&
                        <Col lg={5} md={6}>
                          <div className="video-tuto-sec mb-5">
                              <>
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
                              </>
                          </div>
                        </Col>
                        }
                        <Col lg={7} md={6}>
                          <div className="related-files-sec mb-5">
                            {
                              trainingDetails?.training_files.map(d => d.fileType !== ".mp4").includes(true) &&
                              <>
                                <h3 className="title-sm">Related Files</h3>
                                <div className="column-list files-list two-col mb-5">
                                  {
                                    trainingDetails.training_files.map((data, index) => data.fileType !== '.mp4' && (
                                      <div className="item">
                                        <div className="pic"><a href="">
                                          <img src="../img/book-ico.png" alt="" /></a>
                                        </div>
                                        <div className="name">
                                          <a href={data.file} target="_blank" rel="noreferrer">
                                            {`document${index - 1}${data.fileType}`} <span className="time">{trainingDetails.completion_time}</span>
                                          </a>
                                        </div>
                                        {/* <div className="cta-col">
                                          <a href="">
                                            <img src="../img/removeIcon.svg" alt="" />
                                          </a>
                                        </div> */}
                                      </div>
                                    ))
                                  }
                                </div>
                              </>
                            }
                          </div>
                        </Col>

                        {
                          users &&
                          <Col md={12}>
                            <div className="training-participants-sec mb-5">
                              <h3 className="title-sm">Training Participants</h3>
                              <div className="column-list files-list three-col">
                                {
                                  users.map(user => {
                                    return (
                                      <div className="item">
                                        <div className="userpic"><a href=""><img src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg" alt="" /></a></div>
                                        <div className="name"><a href="">{user.name} <span className="time">{user.role.split("_").map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(" ")}</span></a></div>
                                        <div className="completed-col">
                                          Completed on <span className="date">{moment(user.finish_date).format('DD/MM/YYYY')}</span>
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
                        { 
                          (localStorage.getItem('user_role') === 'franchisor_admin' || localStorage.getItem('user_role') === 'franchisee_admin') 
                          ?
                            (
                              parseInt(localStorage.getItem('user_id')) === parseInt(trainingDetails?.addedBy) 
                              ?
                                (
                                  <p style={{ marginBottom: 0 }}>
                                    This training was created by you on {moment(trainingDetails.createdAt).format('DD/MM/YYYY')}.
                                  </p>
                                )
                              :
                              (
                                (localStorage.getItem('user_role') === 'franchisor_admin') && localStorage.getItem('user_id') !== parseInt(trainingDetails?.addedBy)
                                ? <>This training was created by a {getRoleName(trainingDetails?.user_data.role)} on {moment(trainingDetails.createdAt).format('DD/MM/YYYY')}</>
                                :<>
                                  {hideTrainingFinishButton === true
                                    ? <p> You've finished this training on {moment(trainingFinishedDate).format(
                                      'MMMM Do, YYYY'
                                    )}</p>
                                    : <p>
                                      Please acknowledge that you have completed this training in its entirety by clicking below.
                                    </p>
  
                                  }
                                  <button className={`btn btn-primary ${hideTrainingFinishButton === true ? "d-none" : ""}`} onClick={handleFinishTraining}>
                                    Yes, I have completed the training
                                  </button>
                                </>
                              )
                            )
                          :
                            (
                              <>
                                {hideTrainingFinishButton === true
                                  ? <p> You've finished this training on {moment(trainingFinishedDate).format(
                                    'MMMM Do, YYYY'
                                  )}</p>
                                  : <p>
                                    Please acknowledge that you have completed this training in its entirety by clicking below.
                                  </p>

                                }
                                <button className={`btn btn-primary ${hideTrainingFinishButton === true ? "d-none" : ""}`} onClick={handleFinishTraining}>
                                  Yes, I have completed the training
                                </button>
                              </>
                            )
                        }
                      </div>

                      {
                          relatedForms &&
                          <Col md={12}>
                            <div className="related-form-sec mb-5">
                              <h3 className="title-sm">Training Assessment Form</h3>
                              <div className="column-list files-list three-col">
                                <div className="item">
                                  <div className="pic"><a><img src="../img/folder-ico.png" alt="" /></a></div>
                                  <div className="name"><a>{relatedForms.form_name}</a></div>
                                  <div className="cta-col">
                                    {/* <Dropdown>
                                      <Dropdown.Toggle variant="transparent" id="ctacol">
                                        <img src="../img/dot-ico.svg" alt="" />
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        {/* <Dropdown.Item href="#">Delete</Dropdown.Item> */}
                                      {/* </Dropdown.Menu> */}
                                    {/* </Dropdown> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                        }
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
          show={showSurveyForm}
          onHide={() => setShowSurveyForm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Proceed to your assessment</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div>
              <p>You've finished this training successfully.</p>
              <p>Click <strong>Next</strong> to continue to the assessment.</p>
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
