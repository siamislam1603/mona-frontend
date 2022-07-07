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
    const response = await axios.get(`${BASE_URL}/training?category_id=${filter.category_id}&search=${filter.search}`, {
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
  }, [filter]);

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
                    <img src={training.coverImage} alt=""/>
                    <span className="lthumb">
                      <img src="../img/logo-thumb.png" alt=""/>
                    </span>
                  </a>
                </div>
                <div className="fixcol">
                  <div className="icopic"><img src="../img/traning-audio-ico1.png" alt=""/></div>
                  <div className="iconame"><a href={`/training-detail/${training.id}`}>{training.title}</a> <span className="time">{training.completion_time}</span></div>
                  <div className="cta-col">
                    <Dropdown>
                      <Dropdown.Toggle variant="transparent" id="ctacol">
                        <img src="../img/dot-ico.svg" alt=""/>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#">Delete</Dropdown.Item>
                        <Dropdown.Item href={`/edit-training/${training.id}`}>Edit</Dropdown.Item>
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
                className="item mt-3 mb-3">
                <div className="pic">
                  <a href={`/training-detail/${training.id}`}>
                    <img src={training.coverImage} alt=""/>
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
                <div className="created-by">
                  <h4 className="title">Created by:</h4>
                  <div className="createrimg">
                    <img src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?w=2000" alt="" />
                  </div>
                  <p>{training.user.fullname}, <span>{training.user.role.split("_").map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(" ")}</span></p>
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
