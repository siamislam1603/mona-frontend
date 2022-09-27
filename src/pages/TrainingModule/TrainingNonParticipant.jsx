
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
import { FullLoader } from "../../components/Loader";
import moment from "moment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TrainingCreatedByOther = ({filter, selectedFranchisee}) => {
  const { trainingId } = useParams();
  const navigate = useNavigate();
  // toast.configure();

  // STATES
  const [nonParticipants, setNonParticipants] = useState(null);
  const [resultCount, setResultCount] = useState(0);
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);
  const [totalLoadedNonParticipants, setTotalLoadedNonParticipants] = useState(0);
  const [totalNonParticipantCount, setTotalNonParticipantCount] = useState(0);
  const [paginationProps, setPaginationProps] = useState({
    limit: 10,
    offset: 0,
    search: ""
  })

  const fetchNonParticipants = async () => {
    try {
      let { limit, offset, search } = paginationProps;
      let token = localStorage.getItem('token');
      let userId = localStorage.getItem('user_id');

      let response = await axios.get(`${BASE_URL}/training/trainingNotCompleted/${trainingId}/${userId}?limit=${search ? "" : limit}&offset=${search ? "" : offset}&search=${search}`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      console.log('RESPONSE NON PARTICIPANTS:', response);
      if(response.status === 200 && response.data.status === "success") {
        let { finalResponse } = response.data;

        if(finalResponse && finalResponse?.length){
          setTotalLoadedNonParticipants(totalLoadedNonParticipants + finalResponse.length);
        }
        setTotalNonParticipantCount(finalResponse.length);
        
        setfullLoaderStatus(false)
        setNonParticipants(finalResponse);
      }
    } catch(error) {
      setfullLoaderStatus(false)
    }
  };

  const fetchNonParticipantCount = async () => {
    try {
      let token = localStorage.getItem('token');
      let userId = localStorage.getItem('user_id');

      let response = await axios.get(`${BASE_URL}/training/trainingNotCompleted/${trainingId}/${userId}?limit=&offset=&search=`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      console.log('COUNT RESPONSE:', response);
      if(response.status === 200 && response.data.status === "success") {
        let { finalResponse } = response.data;
        setResultCount(finalResponse.length);
      }
    } catch(error) {
      setfullLoaderStatus(false)
    }
  };

  useEffect(() => {
    fetchNonParticipants();
    fetchNonParticipantCount();
  }, []);

  const handelLoadMore = (e) => {
    e.preventDefault()
    LoadMoreALl()
  }

  const LoadMoreALl = async (e) => {
    let { limit, search } = paginationProps;
    let token = localStorage.getItem('token');
    let userId = localStorage.getItem('user_id');
    const response = await axios.get(`${BASE_URL}/training/trainingNotCompleted/${trainingId}/${userId}?offset=${totalLoadedNonParticipants}&limit=${limit}&search=${search}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    
    if(response.status === 200 && response.data.status === "success") {
      let { finalResponse } = response.data;
      if(finalResponse && finalResponse?.length){
        setTotalLoadedNonParticipants(totalLoadedNonParticipants + finalResponse.length);
        setNonParticipants(prevState => ([
          ...prevState,
          ...finalResponse
        ]));
      } else {
        toast.success('No more results.', {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    }
  }

  useEffect(() => {
    // setNonParticipants(null);
    if(paginationProps?.search === "") {
      setTotalLoadedNonParticipants(0);
      setTotalNonParticipantCount(0);
    }
    fetchNonParticipants();
  }, [paginationProps?.search])
  

  console.log('TOTAL LOADED NON PARTICIPANTS:', totalLoadedNonParticipants);
  console.log('TOTAL LOADED NON PARTICIPANT COUNT:', totalNonParticipantCount);
  resultCount && console.log('RESULT COUNT:', resultCount);
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
                <FullLoader loading={fullLoaderStatus} />
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
                        Training Participants Not Attended
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
                            setPaginationProps(prevState => ({
                              ...prevState,
                              search: e.target.value
                            }))
                          }}
                        />
                      </Form.Group>
                    </div>
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
                  {
                    paginationProps?.search === '' ?
                    totalLoadedNonParticipants < resultCount ? (
                      <>
                        <br></br>
                        <div class="text-center">
                          <button 
                            type="button" 
                            onClick={handelLoadMore} 
                            className="btn btn-primary">
                              Load More
                          </button>
                        </div>
                      </>
                      ) :''
                      : ''
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
