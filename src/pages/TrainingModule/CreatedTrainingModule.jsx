import React, { useState, useEffect } from "react";
import { Col, Row, Dropdown } from "react-bootstrap";
import { BASE_URL } from "../../components/App";
import axios from "axios";

const CreatedTraining = ({ filter }) => {
  const [myTrainingData, setMyTrainingData] = useState();
  const [otherTrainingData, setOtherTrainingData] = useState();

  const fetchCreatedTrainings = async () => {
    let user_id = localStorage.getItem('user_id');
    let token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/training`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if(response.status === 200 && response.data.status === "success") {
      const { createdTrainingList } = response.data;
      let myTrainings = createdTrainingList.filter(training => training.addedBy === parseInt(user_id));
      let otherTrainings = createdTrainingList.filter(training => training.addedBy !== parseInt(user_id));

      setMyTrainingData(myTrainings);
      setOtherTrainingData(otherTrainings);
    }
  };

  useEffect(() => {
    fetchCreatedTrainings();
  }, []);

  myTrainingData && console.log('MY TRAINING DATA:', myTrainingData);
  otherTrainingData && console.log('OTHER TRAINING DATA:', otherTrainingData);

  return (
    <>
      <div id="main">
        <div className="training-column">
          <Row style={{ marginBottom: '40px' }}>
            {myTrainingData?.length > 0 && <h1>Created by me</h1>}
            {myTrainingData?.map((training) => {
            return(
            <Col lg={4} md={6} key={training.id}>
              <div className="item mt-3 mb-3">
                <div className="pic">
                  <a href={`/training-detail/${training.id}`}>
                    <img src={training.training_files[0]?.thumbnail} alt=""/>
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

          <Row>
            {
              otherTrainingData?.length > 0 && <h1 style={{ marginBottom: '25px' }}>Created by others</h1>
            }
            {otherTrainingData?.map((training) => {
            return(
            <Col lg={4} md={6} key={training.id}>
              <div 
                className="item mt-3 mb-3" 
                style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                <div className="pic">
                  <a href={`/training-detail/${training.id}`}>
                    <img src={training.training_files[0]?.thumbnail} alt=""/>
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

              <div 
                className="created-by" 
                style={{ 
                    backgroundColor: "#f7f7f7",
                    borderTop: "3px solid #e5e5e5",
                    marginTop: "-15px",
                    padding: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <div style={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center" 
                }}>
                  <h4 style={{ 
                      fontWeight: 'bold', 
                      fontSize: "14px", 
                      color: "#b6b6b6",
                      marginRight: "5px"  
                  }}>Created by:</h4>
                  <div 
                    className="img"
                    style={{ width: "50px", height: "50px", borderRadius: "50%", overflow: "hidden" }}>
                    <img
                      style={{ overflow: "hidden", width: "50px", height: "50px" }}
                      src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?w=2000" 
                      alt="person smiling" />
                  </div>
                  
                  <p style={{ marginRight: "5px" }}>James Smith,</p>
                  <p style={{ color: "#c7c7c7", fontSize: "12px" }}>Co-ordinator</p>
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
