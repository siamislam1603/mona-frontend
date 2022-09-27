
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
// import { Button, Container, Form, Dropdown } from "react-bootstrap";
// import LeftNavbar from "../components/LeftNavbar";
import { Col, Row, Dropdown, Container,Modal, Form, Button } from "react-bootstrap";

import TopHeader from "../../components/TopHeader";
import { useParams } from 'react-router-dom';
import LeftNavbar from "../../components/LeftNavbar";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../components/App';
import { useEffect } from "react";
import axios from "axios";
// import { Link } from "react-router-dom";
import moment from "moment";

const TrainingCreatedByOther = ({filter, selectedFranchisee}) => {
  const { trainingId } = useParams();
  const navigate = useNavigate();

  // STATES
  const [nonParticipants, setNonParticipants] = useState(null);

  const fetchNonParticipants = async () => {
    let token = localStorage.getItem('token');
    let response = await axios.get(`${BASE_URL}/training/trainingNotCompleted/${trainingId}/${localStorage.getItem('user_id')}?limit=`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    console.log('RESPONSE NON PARTICIPANTS:', response);
    if(response.status === 200 && response.data.status === "success") {
      let { finalResponse } = response.data;

      setNonParticipants(finalResponse);
    }
  };

  useEffect(() => {
    fetchNonParticipants();
  }, []);

  nonParticipants && console.log('NON PARTICIPANTS:', nonParticipants);
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
                  />
                <div className="entry-container">
                  <header className="title-head mynewForm-heading mb-3">
                    <Button className="me-3"
                          onClick={() => {
                            navigate('/training');
                          }}
                        >
                      <img src="../../img/back-arrow.svg" />
                    </Button>
                    <h1 className="title-lg mb-0">
                    Training Participants Not Attended
                    </h1> 
                  </header> 
                  {
                    nonParticipants &&
                    <Col md={12}>
                      <div className="training-participants-sec mb-5" style={{ marginTop: "2.5rem" }}>
                        <div className="column-list files-list three-col">
                          {
                            nonParticipants.map(user => {
                              return (
                                <div className="item">
                                  <div className="userpic"><a><img src={user.profilePic || "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg"} alt="" /></a></div>
                                  <div className="name"><a>{user.fullName} <span className="time">{user.role.split("_").map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(" ")}</span></a></div>
                                  <div className="completed-col">
                                    Assigned on <span className="date">{moment(user.finish_date).format('DD/MM/YYYY')}</span>
                                  </div>
                                </div>
                              );
                            })
                          }
                        </div>
                      </div>
                    </Col>
                  }                  
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default TrainingCreatedByOther;
