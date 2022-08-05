import React, { useState, useEffect } from "react";
import { Col, Row, Dropdown } from "react-bootstrap";
import { BASE_URL } from "../../components/App";
import axios from "axios";

const CompleteTraining = ({ filter }) => {
  const [completedTrainingData, setCompletedTrainingData] = useState([]);

  const fetchCompletedTrainingData = async () => {
    console.log('INSIDE COMPLETE TRAINING MODULE');
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/training/${user_id}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    console.log('RESPONSE DATA:', response);
    if(response.status === 200 && response.data.status === "success") {
      const { response: trainingList } = response.data;
      setCompletedTrainingData(trainingList);
    }
  };  

  useEffect(() => {
    fetchCompletedTrainingData();
  }, []);

  completedTrainingData && console.log('COMPLETED TRAINING:', completedTrainingData);

  return (
    <>
      <div id="main">
        <div className="training-column">
          <Row>
          {completedTrainingData?.map((item) => {
            return(
            <Col lg={4} md={6} key={item.id}>
              <div className="item mt-3 mb-3">
                <div className="pic"><a href={`/training-detail/${item.training.id}`}><img src={`${item.training.coverImage}`} alt=""/> <span className="lthumb"><img src="../img/logo-thumb.png" alt=""/></span></a></div>
                <div className="fixcol">
                  <div className="icopic"><img src="../img/traning-audio-ico1.png" alt=""/></div>
                  <div className="iconame">
                    <a href="/training-detail">{item.training.title}</a>
                    <div className="datecol">
                      <span className="red-date">Due Date:</span>
                      <span className="time">{ item.completion_time }</span>
                    </div>
                  </div>
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

export default CompleteTraining;
