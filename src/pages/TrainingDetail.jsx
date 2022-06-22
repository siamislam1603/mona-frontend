import React, { useState, useEffect } from "react";
// import path  from 'path';
import { Button, Col, Container, Row, Form, Dropdown,Modal } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import axios from "axios";
import { BASE_URL } from "../components/App";
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { PlayerSdk } from '@api.video/player-sdk'

import makeAnimated from 'react-select/animated';
import videos from "../assets/video/Cute Panda.mp4"
import svideos from "../assets/video/d.mp4"
import pdf from "../assets/pdf/1652501632697.pdf"
import student from "../assets/img/student.jpg"
import VideoPop from "../components/VideoPop";


const animatedComponents = makeAnimated();




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
  let videoURL = ""
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSaveAndClose = () => setShow(false);


  const [thepdf,setPdfSet] = useState("https://s3.us-west-1.amazonaws.com/mona-cip-dev/public/assets/.docs/Rohan%27sResume_2022-06-13_1655102409338.pdf")
  const [Trainingdata,setTrainingData] = useState("");
  const [TrainingFile,setTrainingFile] = useState([]);
  const [TrainingComplete,setTrainingComplete] = useState(" ")
  
  const getTrainingDetail = async() =>{
    console.log("The comments")
    console.log("The token", localStorage.getItem("token"))
    const userID =   localStorage.getItem('user_id');
    // let response = await axios.get("http://localhost:4000/training/getTrainingById/3");
    let response = await axios.get(`http://localhost:4000/training/getTrainingById/4/${userID}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    });
    console.log("The response",response.data)
    // const filename = response.headers['content-disposition'].split('filename=')[1];
    // console.log("Fike name", filename)

    if(response.status === 200){
      
      const {data} = response;
      const Thetrainingdata= data
      console.log("Traing data",Thetrainingdata)
      setTrainingData(Thetrainingdata)
      setTrainingFile(Thetrainingdata.training_files)
    }
}
  const TrainingMarkCompleted = async() =>{
    let response = await axios.post("http://localhost:4000/training/completeTraining/4/2?training_status=in_progress")
    console.log("Training mark completed", response)
    if(response.status === 200){
      setTrainingComplete(response.data)
      console.log(response.data)
    }
  }
// console.log("THe traing file name", TrainingFile)

const getUploadTime = (thedate) =>{
  console.log("getUploadTime funtion")
  var strSplitDate = String(thedate).split(' ')
  var date = new Date(strSplitDate[0]) 
  // console.log("The date",(new Date()-date/1000/31536000))
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = seconds / 31536000;                          
  if (interval > 1) {
      return Math.floor(interval) + " years";
   }
  interval = seconds / 2592000;
   if (interval > 1) {
    console.log(Math.floor(interval) + " months");
   }
   interval = seconds / 86400;
   if (interval > 1) {
     let day = Math.floor(interval) + " days";
      return day 
  }
  interval = seconds / 3600;
  if (interval > 1) {
     console.log(Math.floor(interval) + " hours");
  }
  interval = seconds / 60;
  if (interval > 1) {
     console.log(Math.floor(interval) + " minutes");
  }
  // return Math.floor(seconds) + " seconds";
                          
}

  useEffect(() =>{
    getTrainingDetail()
    // playVideo()
    },[])
  console.log("The training file",TrainingFile[1])
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
                <div className="entry-container">
                  <header className="title-head">
                    <h1 className="title-sm">{Trainingdata.title}</h1>
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
                      {/* {TrainingFile.map((user) => (
                        user.fileType === ".mp4" && 
                        <iframe src={user.file} width={500} height={500} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture full"></iframe>                  
                      ))} */}
                      {/* {showVideo()} */}
                        {/* <div id="target"></div> */}
                     
     
                   <div>
             </div>
                    </div>
                    <div className="training-cont mt-3 mb-5">
                      {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis a sagittis varius vel, est quam quam. Orci blandit ac eleifend mi cursus velit pellentesque. Sodales iaculis netus ipsum facilisis suspendisse dolor. Sed sed neque enim tellus in tristique. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis a sagittis varius vel, est quam quam.</p> */}
                      <p>{Trainingdata.description}</p>
                    </div>
                    {/* <iframe src="mypage.html" style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"></iframe> */}
                  
                    {/* <iframe src="https://embed.api.video/vod/vi54sj9dAakOHJXKrUycCQZp"  title="dsk " allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" width="1280" height="720" frameborder="0"></iframe> */}
                   <div style={{display:"flex"}}>

                    <div>
                    <h2 className="title-sm">Video Tutorial</h2>            
                    {
                      
                         TrainingFile.map((data,index) => 
                          {
                            const thedate =  getUploadTime(data.createdAt)
                            return(  
                              data.fileType === ".mp4" &&
                              // <iframe src={videos}  width={500} height={500} frameborder="0"  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture  object-fit: contain;" allowFullScreen ></iframe>
                              // <img  key={index} src={student} alt="" onClick={handleShow}  />
                              <VideoPop img ={student} data ={data} video ={videos} time = {thedate}/>
                           )
                          }
                         
                        )
                      }
                    
                    </div>
                  <div>
                  <h2 className="title-sm">Related Files</h2>
                  <div className="column-list files-list three-col mb-5">  
                      {TrainingFile.map((user) => (
                        user.fileType === ".pdf" && 
                        <div className="item">
                        <a href={user.file} download={user.file}> 
                          <div className="pic"><img src="../img/book-ico.png" alt=""/></div>
                         <div className="name">{user.file.split("/").pop()} <span className="time">3 Hours</span></div>
                       </a>
                       </div>              
                      ))}
                    
                    </div>
                  </div>
                 
                      
                      {/* Exprement  */}
                     
                  
                    </div>  
                  
                    {/* Exprenment end */}


                    {/* <div className="column-list files-list three-col mb-5">
                    

                      <div className="item">
                       <a href={thepdf} download="My_File.pdf"> 
                         <div className="pic"><img src="../img/book-ico.png" alt=""/></div>
                        <div className="name">document1.docx <span className="time">3 Hours</span></div>
                      </a>

                        <div className="cta-col">
                          <a href="">
                            <img src="../img/removeIcon.svg" alt="" />
                          </a>
                        </div>
                      </div>
                      <div className="item">
                        <div className="pic">
                          <img src="../img/ppt-ico.png" alt="" />
                        </div>
                        <div className="name">
                          presentation1.pptx{' '}
                          <span className="time">3 Hours</span>
                        </div>
                        <div className="cta-col">
                          <a href="">
                            <img src="../img/removeIcon.svg" alt="" />
                          </a>
                        </div>
                      </div>
                    </div> */}

                    <div className="complete-training text-center">
                      <p>
                        Please acknowledge by clicking below that you have
                        completed this training completely and can proceed
                        further.
                      </p>
                      {/* <a href="" className="btn btn-primary" onClick={TrainingMarkCompleted}>
                        Yes, I have completed the training
                      </a> */}
                      <Link to="#" onClick={TrainingMarkCompleted}>

                      {TrainingComplete =="training marked as completed!"? "Success,You have completed this training": "Yes, I have completed the training"  } 
                       </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
        {/* <VideoPop
          
        /> */}

         {/* <Modal
        className="training-modal"
        size="lg"
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settings-content">
            <Row>
            <iframe width={200} height={200} src={videos} title="YouTube video player" frameborder="0"  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              
            </Row>   
          </div>
        </Modal.Body>
      </Modal>  */}
      </div>
    </>
  );
};

export default TrainingDetail;
