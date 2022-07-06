import React, { useState, useEffect } from "react";
// import path  from 'path';
import { Container, Col, Row, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import axios from "axios";
import { BASE_URL } from "../components/App";
import moment from 'moment';
import { useParams } from 'react-router-dom';

import videos from "../assets/video/Cute Panda.mp4"
import svideos from "../assets/video/d.mp4"
import pdf from "../assets/pdf/1652501632697.pdf"
import student from "../assets/img/student.jpg"
import VideoPop from "../components/VideoPop";


// const animatedComponents = makeAnimated();

const styles = {
  option: (styles, state) => ({
    ...styles,
    backgroundColor: state.isSelected ? '#E27235' : '',
  }),
};
const file = () =>{
  // var path = require('path');
var file = '/home/user/dir/file.txt';

// var filename = path.parse(file).base;
}

const training = [
  {
    newvideo :videos
  },
  {
    newvideo :svideos

  },
];

// console.log(training)
const TrainingDetail = () => {
  const { trainingId } = useParams();
  const [trainingDetails, setTrainingDetails] = useState(null);

  let videoURL = ""
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSaveAndClose = () => setShow(false);

  const [thepdf,setPdfSet] = useState("https://s3.us-west-1.amazonaws.com/mona-cip-dev/public/assets/.docs/Rohan%27sResume_2022-06-13_1655102409338.pdf")
  const [Trainingdata,setTrainingData] = useState("");
  const [TrainingFile,setTrainingFile] = useState([]);
  const [hideTrainingFinishButton, setHideTrainingFinishButton] = useState(false);
  const [trainingFinishedDate, setTrainingFinishedDate] = useState();
  
  const getTrainingDetails = async () => {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');

    const response = await axios.get(`${BASE_URL}/training/getTrainingById/${trainingId}/${user_id}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    

    if(response.status === 200 && response.data.status === "success") {
      const { all_trainings } = response.data;
      setTrainingDetails(all_trainings);
      setHideTrainingFinishButton(all_trainings.is_Training_completed);
    }
  }

  const handleFinishTraining = (event) => {
    updateFinishTraining();
  };

  const updateFinishTraining = async () => {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}/training/completeTraining/${trainingId}/${user_id}?training_status=finished`, {}, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    console.log('TRAINING FINISH STATUS:', response);
    if(response.status === 200 && response.data.status === "success") {
      setTrainingFinishedDate(response.data.finished_date);
      setHideTrainingFinishButton(true);
    }
  };

  const fetchTrainingFinishDate = async () => {
    const token = localStorage.getItem('token');
    console.log('TRAINING ID:', training)
    const response = await axios.get(`${BASE_URL}/training/get-finish-training-date/${trainingId}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if(response.status === 200 && response.data.status === "success" && response.data.is_training_finished === false) {
    } else {
      let { finished_date } = response.data;
      setTrainingFinishedDate(finished_date);
      setHideTrainingFinishButton(true);
    }
  };

  useEffect(() =>{
    getTrainingDetails()
    fetchTrainingFinishDate();
  }, [])

  trainingDetails && console.log('TRAINING ID:', trainingDetails);
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
                <TopHeader />
                {trainingDetails &&
                <div className="entry-container">
                  <header className="title-head">
                    <div className="traning-head">
                      <h1 className="title-sm mb-2">{trainingDetails.title}</h1>
                      <small class="d-block">Due Date: 06/29/2022</small>
                    </div>
                    <div className="othpanel">
                      <div className="extra-btn">
                        <Dropdown>
                          <Dropdown.Toggle id="extrabtn" className="ctaact">
                            <img src="../img/dot-ico.svg" alt="" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item href="#">Delete All</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </header>
                  <div className="traning-detail-sec">
                    <div className="thumb-vid">
                      <img 
                        src={trainingDetails.training_files[1].file}
                        alt="video thumbnail" />
                    </div>
                    <div className="created-by">
                      <h4 className="title">Created by:</h4>
                      <div className="createrimg">
                        <img src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?w=2000" alt="" />
                      </div>
                      <p>James Smith, <span>Co-ordinator</span></p>
                    </div>
                    <div className="training-cont mt-3 mb-5">
                      <p>{trainingDetails.description}</p>
                    </div>
                    
                    <Row>
                      <Col lg={5} md={6}>
                        <div className="video-tuto-sec mb-5">
                          <h3 className="title-sm">Video Tutorials</h3>
                          <div className="vid-col-sec">
                              {
                                trainingDetails.training_files.map((data,index) => (    
                                  <VideoPop 
                                    img ={data.thumbnail} 
                                    data ={data.file} 
                                    video ={videos} 
                                    fun={handleClose}/>
                                ))
                              }
                          </div>
                        </div>
                      </Col>
                      <Col lg={7} md={6}>
                        <div className="related-files-sec mb-5">  
                          <h3 className="title-sm">Related Files</h3>
                          <div className="column-list files-list two-col mb-5">
                            <div className="item">
                              <div className="pic"><a href=""><img src="../img/book-ico.png" alt="" /></a></div>
                              <div className="name"><a href="">document1.docx <span className="time">3 Hours</span></a></div>
                              <div className="cta-col">
                                <a href="">
                                  <img src="../img/removeIcon.svg" alt="" />
                                </a>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><a href=""><img src="../img/book-ico.png" alt="" /></a></div>
                              <div className="name"><a href="">document1.docx <span className="time">3 Hours</span></a></div>
                              <div className="cta-col">
                                <a href="">
                                  <img src="../img/removeIcon.svg" alt="" />
                                </a>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><a href=""><img src="../img/ppt-ico.png" alt="" /></a></div>
                              <div className="name"><a href="">presentation1.pptx <span className="time">3 Hours</span></a></div>
                              <div className="cta-col">
                                <a href="">
                                  <img src="../img/removeIcon.svg" alt="" />
                                </a>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><a href=""><img src="../img/ppt-ico.png" alt="" /></a></div>
                              <div className="name"><a href="">presentation1.pptx <span className="time">3 Hours</span></a></div>
                              <div className="cta-col">
                                <a href="">
                                  <img src="../img/removeIcon.svg" alt="" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="related-form-sec mb-5">  
                          <h3 className="title-sm">Related Form</h3>
                          <div className="column-list files-list three-col">
                            <div className="item">
                              <div className="pic"><a href=""><img src="../img/folder-ico.png" alt="" /></a></div>
                              <div className="name"><a href="">Survey 1</a></div>
                              <div className="cta-col">
                                <Dropdown>
                                  <Dropdown.Toggle variant="transparent" id="ctacol">
                                    <img src="../img/dot-ico.svg" alt=""/>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><a href=""><img src="../img/folder-ico.png" alt="" /></a></div>
                              <div className="name"><a href="">Survey 1</a></div>
                              <div className="cta-col">
                                <Dropdown>
                                  <Dropdown.Toggle variant="transparent" id="ctacol">
                                    <img src="../img/dot-ico.svg" alt=""/>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><a href=""><img src="../img/folder-ico.png" alt="" /></a></div>
                              <div className="name"><a href="">Survey 1</a></div>
                              <div className="cta-col">
                                <Dropdown>
                                  <Dropdown.Toggle variant="transparent" id="ctacol">
                                    <img src="../img/dot-ico.svg" alt=""/>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><a href=""><img src="../img/folder-ico.png" alt="" /></a></div>
                              <div className="name"><a href="">Survey 1</a></div>
                              <div className="cta-col">
                                <Dropdown>
                                  <Dropdown.Toggle variant="transparent" id="ctacol">
                                    <img src="../img/dot-ico.svg" alt=""/>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><a href=""><img src="../img/folder-ico.png" alt="" /></a></div>
                              <div className="name"><a href="">Survey 1</a></div>
                              <div className="cta-col">
                                <Dropdown>
                                  <Dropdown.Toggle variant="transparent" id="ctacol">
                                    <img src="../img/dot-ico.svg" alt=""/>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <div className="item">
                              <div className="pic"><a href=""><img src="../img/folder-ico.png" alt="" /></a></div>
                              <div className="name"><a href="">Survey 1</a></div>
                              <div className="cta-col">
                                <Dropdown>
                                  <Dropdown.Toggle variant="transparent" id="ctacol">
                                    <img src="../img/dot-ico.svg" alt=""/>
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
                      <Col md={12}>
                        <div className="training-participants-sec mb-5">  
                          <h3 className="title-sm">Training Participants:</h3>
                          <div className="column-list files-list three-col">
                            <div className="item">
                              <div className="userpic"><a href=""><img src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg" alt="" /></a></div>
                              <div className="name"><a href="">Mark Ruffalo <span class="time">Parent</span></a></div>
                              <div className="completed-col">
                                Completed on <span class="date">20-06-2022</span>
                              </div>
                            </div>
                            <div className="item">
                              <div className="userpic"><a href=""><img src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg" alt="" /></a></div>
                              <div className="name"><a href="">Mark Ruffalo <span class="time">Parent</span></a></div>
                              <div className="completed-col">
                                Completed on <span class="date">20-06-2022</span>
                              </div>
                            </div>
                            <div className="item">
                              <div className="userpic"><a href=""><img src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg" alt="" /></a></div>
                              <div className="name"><a href="">Mark Ruffalo <span class="time">Parent</span></a></div>
                              <div className="completed-col">
                                Completed on <span class="date">20-06-2022</span>
                              </div>
                            </div>
                            <div className="item">
                              <div className="userpic"><a href=""><img src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg" alt="" /></a></div>
                              <div className="name"><a href="">Mark Ruffalo <span class="time">Parent</span></a></div>
                              <div className="completed-col">
                                Completed on <span class="date">20-06-2022</span>
                              </div>
                            </div>
                            <div className="item">
                              <div className="userpic"><a href=""><img src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg" alt="" /></a></div>
                              <div className="name"><a href="">Mark Ruffalo <span class="time">Parent</span></a></div>
                              <div className="completed-col">
                                Completed on <span class="date">20-06-2022</span>
                              </div>
                            </div>
                            <div className="item">
                              <div className="userpic"><a href=""><img src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg" alt="" /></a></div>
                              <div className="name"><a href="">Mark Ruffalo <span class="time">Parent</span></a></div>
                              <div className="completed-col">
                                Completed on <span class="date">20-06-2022</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <div className="complete-training text-center" style={{ marginBottom: "50px" }}>
                      { hideTrainingFinishButton
                        ? <p> You've finished this training on {moment(trainingFinishedDate).format(
                          'MMMM Do, YYYY'
                        )}</p>
                        : <p>
                            Please acknowledge by clicking below that you have
                            completed this training completely and can proceed
                            further.
                          </p>
                        
                      }
                      <button className={`btn btn-primary ${hideTrainingFinishButton ? "d-none" : ""}`} onClick={handleFinishTraining}>
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
    </>
  );
};

export default TrainingDetail;
