
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Col, Container, Button, Form } from "react-bootstrap";

import TopHeader from "../../components/TopHeader";
import { useParams } from 'react-router-dom';
import LeftNavbar from "../../components/LeftNavbar";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../components/App';
import { useEffect } from "react";
import axios from "axios";
import { slice } from 'lodash';
import moment from "moment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TrainingNonParticipant = ({filter, selectedFranchisee}) => {
  const { trainingId } = useParams();
  const navigate = useNavigate();
  // toast.configure();

  // STATES
  const [participants, setParticipants] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false)
  const [index, setIndex] = useState(9)
  let initialUsers = slice(participants, 0, index)
  const [search, setSearch] = useState("");

  const fetchParticipants = async () => {
    try {
      let token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/training/completed-training-user-list/${trainingId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 200 && response.data.status === "success") {
        let { userObj } = response.data;
        
        console.log('USER OBJECT:', userObj);
        console.log('USER OBJ COUNT:', userObj.length);

        setParticipants(userObj.map(user => ({
          id: user.id,
          name: user.fullname,
          role: user.role,
          finish_date: user.finish_date
        })))
      }
    } catch(error) {
    }
  };

  const loadMore = () => {
    setIndex(index + 5)
    console.log(index)
    if (index >= participants.length) {
      setIsCompleted(true)
    } else {
      setIsCompleted(false)
    }
  }

  useEffect(() => {
    console.log('FETCHING PARTICIPANTS');
    fetchParticipants();
  }, []);

  useEffect(() => {
    if(search) {
      let searchedParticipants = participants.filter(d => d.name.includes(search));
      setParticipants(searchedParticipants);
    } else {
      fetchParticipants();
    }
  }, [search]);
  
  return (
    <>
      <ToastContainer />
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
                    <div className="data-search d-md-flex w-100">
                      <h1 className="title-lg mb-0">
                        <Button className="me-3"
                              onClick={() => {
                                navigate('/training');
                              }}
                            >
                          <img src="../../img/back-arrow.svg" />
                        </Button>
                        Training Participants Attended
                      </h1> 
                      <Form.Group
                        className="ms-auto relative"
                        style={{ marginRight: '2.3rem' }}
                      >
                        <div className="user-search">
                          <img
                            src="../img/search-icon-light.svg"
                            alt=""
                          />
                        </div>
                        <Form.Control
                          className="searchBox"
                          type="text"
                          placeholder="Search"
                          onChange={(e) => {
                            setSearch(e.target.value);
                          }}
                        />
                      </Form.Group>
                    </div>
                  </header> 
                  {
                    initialUsers &&
                    <Col md={12}>
                      <div className="training-participants-sec mb-5" style={{ marginTop: "2.5rem" }}>
                        <div className="column-list files-list three-col">
                          {
                            initialUsers.map(user => {
                              return (
                                <div className="item">
                                  <div className="userpic"><a><img src={user.profilePic || "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg"} alt="" /></a></div>
                                  <div className="name"><a>{user.name} <span className="time">{user.role.split("_").map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(" ")}</span></a></div>
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

                  {
                    search === "" &&
                    <div style={{ justifyContent: 'center', display: initialUsers.length > 0 ? "flex": "none" }}>
                      {isCompleted ? (
                        <button 
                          type="button" 
                          onClick={loadMore} 
                          className="btn btn-primary invisible">
                            That's It
                        </button>
                      ) : (
                        <button 
                          onClick={loadMore} 
                          type="button" 
                          className="btn btn-primary">
                          Load More
                        </button>
                      )}
                    </div>
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

export default TrainingNonParticipant;
