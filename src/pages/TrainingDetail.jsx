import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Form, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import axios from "axios";
import { BASE_URL_LOCAL } from "../components/App";

import { Link } from 'react-router-dom';
import Select from 'react-select';

import makeAnimated from 'react-select/animated';
import videos from "../assets/video/Cute Panda.mp4"
import pdf from "../assets/pdf/1652501632697.pdf"
const animatedComponents = makeAnimated();
const styles = {
  option: (styles, state) => ({
    ...styles,
    backgroundColor: state.isSelected ? "#E27235" : "",
  }),
};

const training = [
  {
    value: "sydney",
    label: "Sydney",
  },
  {
    value: "melbourne",
    label: "Melbourne",
  },
];

const TrainingDetail = () => {
  const [thepdf,setPdfSet] = useState("https://s3.us-west-1.amazonaws.com/mona-cip-dev/public/assets/.docs/Rohan%27sResume_2022-06-13_1655102409338.pdf")
  const [Trainingdata,setTrainingData] = useState("");
  const [TrainingFile,setTrainingFile] = useState("");
  const getTrainingDetail = async() =>{
    console.log("The comments")
    // let response = await axios.get("http://localhost:4000/training/getTrainingById/3");
    let response = await axios.get(`${BASE_URL_LOCAL}/training/getTrainingById/4`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('auth-token')
      }
    });
    console.log("The response",response)
    if(response.status === 200){
      
      const {data} = response;
      const Thetrainingdata= data.data
      console.log("Traing data",Thetrainingdata)
      setTrainingData(Thetrainingdata.all_trainings)
      setTrainingFile(Thetrainingdata.all_trainings.training_files)
    }
}
const Extension = () =>{
  let extensionforimage = TrainingFile[1].file.split(".").pop()
  console.log("The xtension imag", extensionforimage)
}
  useEffect(() =>{
    getTrainingDetail();
  },[])


  // useEffect(() =>{
  //   Extension();

  // },[])
  // console.log("The training file",TrainingFile)
  return (
    <>
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar/>
              </aside>
              <div className="sec-column">
                <TopHeader/>
                <div className="entry-container">
                  <header className="title-head">
                    <h1 className="title-sm">{Trainingdata.title}</h1>
                    <div className="othpanel">
                      <div className="extra-btn">
                        <Dropdown>
                          <Dropdown.Toggle id="extrabtn" className="ctaact">
                            <img src="../img/dot-ico.svg" alt=""/>
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
               
                      {/* <iframe src={require('../assets/video/Cute Panda.mp4')} width={500} height={500} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture full"></iframe> */}
                      {/* https://embed.api.video/vod/vi3ekOlY5K0AwN9GaM9LVsFF */}
                      <iframe src={"https://embed.api.video/vod/vi1aq7fUZf8jiBoi2WhwrhEM"} width={500} height={500} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture full"></iframe>

                    </div>
                    <div className="training-cont mt-3 mb-5">
                      {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis a sagittis varius vel, est quam quam. Orci blandit ac eleifend mi cursus velit pellentesque. Sodales iaculis netus ipsum facilisis suspendisse dolor. Sed sed neque enim tellus in tristique. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis a sagittis varius vel, est quam quam.</p> */}
                      <p>{Trainingdata.description}</p>
                    </div>
                    
                    <h2 className="title-sm">Related Files</h2>
                    <div className="column-list files-list three-col mb-5">
                    

                      <div className="item">

                      {/* <iframe src={require("../assets/pdf/1652501632697.pdf")} /> */}
                    <a href={thepdf} download="My_File.pdf"> 

                        <div className="pic"><img src="../img/book-ico.png" alt=""/></div>

                        <div className="name">document1.docx <span className="time">3 Hours</span></div>
                      </a>

                        <div className="cta-col">
                          <a href=""><img src="../img/removeIcon.svg" alt=""/></a>
                        </div>

                      </div>
                      <div className="item">
                        <div className="pic"><img src="../img/ppt-ico.png" alt=""/></div>
                        <div className="name">presentation1.pptx <span className="time">3 Hours</span></div>
                        <div className="cta-col">
                          <a href=""><img src="../img/removeIcon.svg" alt=""/></a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="complete-training text-center">
                      <p>Please acknowledge by clicking below that you have completed this training completely and can proceed further.</p>
                      <a href="" className="btn btn-primary">Yes, I have completed the training</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default TrainingDetail;
