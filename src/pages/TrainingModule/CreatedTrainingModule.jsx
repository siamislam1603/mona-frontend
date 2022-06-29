import React, { useState, useEffect } from "react";
import { Col, Row, Dropdown } from "react-bootstrap";
import { BASE_URL } from "../../components/App";
import axios from "axios";

const CreatedTraining = () => {
  console.log('INSIDE CREATED TRAINING MODULE');
  const [createdTrainingData, setCreatedTrainingData] = useState();

  const fetchCreatedTrainings = async () => {
    let user_id = localStorage.getItem('user_id');
    let token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/training/assigeedTraining/${user_id}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if(response.status === 200 && response.data.status === "success") {
      const { training } = response.data;
      setCreatedTrainingData(training);
    }
  };

  const handleTrainingSelect = () => {

  }

  useEffect(() => {
    fetchCreatedTrainings();
  }, []);

  createdTrainingData && console.log('DATA:', createdTrainingData);

  return (
    <>
      <div id="main">
        <div className="training-column">
          <Row>
          {createdTrainingData?.map((training) => {
            return(
            <Col lg={4} md={6} key={training.id}>
              <div className="item mt-3 mb-3">
                <div className="pic">
                  <a href={`/training-detail/${training.id}`} onClick={handleTrainingSelect}>
                    <img src={training.training_files[0].thumbnail} alt=""/>
                    <span className="lthumb">
                      <img src="../img/logo-thumb.png" alt=""/>
                    </span>
                  </a>
                </div>
                <div className="fixcol">
                  <div className="icopic"><img src="../img/traning-audio-ico1.png" alt=""/></div>
                  <div className="iconame"><a href="/training-detail">{training.title}</a> <span className="time">{training.completion_time}</span></div>
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
            </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </>
  );
};

export default CreatedTraining;
