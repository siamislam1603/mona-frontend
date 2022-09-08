/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
// import { Button, Container, Form, Dropdown } from "react-bootstrap";
// import LeftNavbar from "../components/LeftNavbar";
import { Col, Row, Dropdown, Container,Modal, Form, Button } from "react-bootstrap";

import TopHeader from "../../components/TopHeader";
import { useLocation } from 'react-router-dom';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
// import { verifyPermission } from '../helpers/roleBasedAccess';
import { useEffect } from "react";

import axios from 'axios';
// import { FullLoader } from "../components/Loader";
import { BASE_URL } from "../../components/App";
import LeftNavbar from "../../components/LeftNavbar";
import { Link } from "react-router-dom";
import { FullLoader } from "../../components/Loader";

// const animatedComponents = makeAnimated();
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
const animatedComponents = makeAnimated();

const TrainingCreatedByOther = ({filter, selectedFranchisee}) => {
  let location = useLocation();
  const [otherTrainingData, setOtherTrainingData] = useState([]);
  const [applicableToAll, setApplicableToAll] = useState(false);
  const [franchiseeList, setFranchiseeList] = useState();
  const [showModal, setShowModal] = useState(false);
  const [saveTrainingId, setSaveTrainingId] = useState(null);
  const [sendToAllFranchisee, setSendToAllFranchisee] = useState("none");
  const [shareType, setShareType] = useState("roles");
  const [userList, setUserList] = useState();
  const [trainingDeleteMessage, setTrainingDeleteMessage] = useState('');
  const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState([]);
  const [page,setPage] = useState(5)
//   const [fullLoaderStatus, setfullLoaderStatus] = useState(true);

  const [formSettings, setFormSettings] = useState({
    assigned_roles: [],
    assigned_franchisee: [],
    assigned_users: []
  });
  const [successMessageToast, setSuccessMessageToast] = useState(null);
  const [myTrainingData, setMyTrainingData] = useState([]);
  const [search,setSearch]= useState()

  const [topSuccessMessage, setTopSuccessMessage] = useState(null);
  const [tabLinkPath, setTabLinkPath] = useState("/available-training");
  // const [selectedFranchisee, setSelectedFranchisee] = useState("Alphabet Kids, Sydney");
  const [trainingCategory, setTrainingCategory] = useState([]);
  const [filterData, setFilterData] = useState({
    category_id: null,
    search: ""
  });
  const [fullLoaderStatus, setfullLoaderStatus] = useState(false);


  const fetchTrainingCategories = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${BASE_URL}/training/get-training-categories`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    }
    );
   console.log("Response catrogy",response)
    if(response)
    //   setfullLoaderStatus(false)


    if (response.status === 200 && response.data.status === "success") {
      const { categoryList } = response.data;
      setTrainingCategory([
        {
          id: 0,
          value: 'select category',
          label: 'Select Category'
        },
        ...categoryList.map((data) => ({
          id: data.id,
          value: data.category_name,
          label: data.category_name,
        })),
      ]);

      console.log('TRAINING CATEGORY:', trainingCategory);
    }
  };

  const trainingCreatedByOther = async() =>{
   try {
    setfullLoaderStatus(true)
    let user_id = localStorage.getItem('user_id');
    let token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/training/trainingCreatedByOthers/?limit=&search=${filterData.search}&category_id=${filterData.category_id}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    console.log('Training created by OTHER',response)
    if(response.status===200 && response.data.status === "success"){
      const {searchedData} = response.data
      setfullLoaderStatus(false)

      setOtherTrainingData(searchedData)

      
    }
   } catch (error) {
        setfullLoaderStatus(false)
        setOtherTrainingData([])
   }

  }

  const handleTrainingDelete = async (trainingId) => {
    console.log('DELETING THE TRAINING!');
    let token = localStorage.getItem('token');
    let userId = localStorage.getItem('user_id');
    const response = await axios.delete(`${BASE_URL}/training/deleteTraining/${trainingId}/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    // HANDLING THE RESPONSE GENEREATED AFTER DELETING THE TRAINING
    if (response.status === 200 && response.data.status === "success") {
      setTrainingDeleteMessage(response.data.message);
    } else if (response.status === 200 && response.data.status === "fail") {
      setTrainingDeleteMessage(response.data.message);
    }
  }





  useEffect(() => {
  
    // trainingCreatedByMe()
    // CreatedByme()
    trainingCreatedByOther()
    fetchTrainingCategories()
    console.log("Traingin created")
  }, []);
  useEffect(() =>{
    trainingCreatedByOther() 
  },[filterData.search,filterData.category_id])

  console.log("TRAIING DATA",myTrainingData)

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
                  // setSelectedFranchisee={setSelectedFranchisee} 
                  />

                  <FullLoader loading={fullLoaderStatus} />
                <div className="entry-container">
                  <header className="title-head mb-3">
                    <h1 className="title-lg">Training Created by Other</h1>
                    
                    <div className="othpanel">
                      <div className="extra-btn">
                        <div className="data-search me-3">
                          <label for="search-bar" className="search-label">
                            <input
                              id="search-bar"
                              type="text"
                              className="form-control"
                              placeholder="Search"
                              value={filterData.search}
                              onChange={e => setFilterData(prevState => ({
                                ...prevState,
                                search: e.target.value
                              }))} />
                          </label>
                        </div>
                        {
                          localStorage.getItem('user_role') === 'stanley' &&
                          <Dropdown className="filtercol me-3">
                            <Dropdown.Toggle id="extrabtn" variant="btn-outline">
                              <i className="filter-ico"></i> Add Filters
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <header>Filter by:</header>
                              <div className="custom-radio btn-radio mb-2">
                                <label>Users:</label>
                                <Form.Group>
                                  <Form.Check
                                    inline
                                    label='Franchisee'
                                    value='franchisee'
                                    name="users"
                                    type="radio"
                                    id='one'
                                    onChange={e => setFilterData(prevState => ({
                                      ...prevState,
                                      user: e.target.value
                                    }))}
                                  />
                                </Form.Group>
                              </div>
                              <footer>
                                <Button variant="transparent" type="submit">Cancel</Button>
                                <Button variant="primary" type="submit">Apply</Button>
                              </footer>
                            </Dropdown.Menu>
                          </Dropdown>
                        }
                        

                      
                      </div>
                    </div>
                  </header>
                  <div className="training-cat d-md-flex align-items-center mb-3">
                    <div className="selectdropdown ms-auto d-flex align-items-center">
                      <Form.Group className="d-flex align-items-center" style={{ zIndex: "99" }}>
                        <Form.Label className="d-block me-2">Choose Category</Form.Label>
                        <Select
                          closeMenuOnSelect={true}
                          components={animatedComponents}
                          options={trainingCategory}
                          className="selectdropdown-col"
                          onChange={(e) => setFilterData(prevState => ({
                            ...prevState,
                            category_id: e.id === 0 ? null : e.id
                          }))}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="training-column">
                  {/* <h3 className="title-sm mb-0"><strong></strong></h3> */}

         
            
          <Row>
           
            {otherTrainingData?.map((training) => {
              return (
                <Col lg={4} md={6} key={training.id}>
                  <div
                    className="item mt-3 mb-3">
                    <div className="pic">
                      <a href={`/training-detail/${training.id}`}>
                        <img src={training.coverImage} alt="" />
                        <span className="lthumb">
                          <img src="../img/logo-thumb.png" alt="" />
                        </span>
                      </a>
                    </div>
                    <div className="fixcol">
                      <div className="icopic"><img src="../img/traning-audio-ico1.png" alt="" /></div>
                      <div className="iconame"><a href="/training-detail">{training.title}</a> <span className="time">{training.completion_time}</span></div>
                      <div className="cta-col">
                        <Dropdown>
                          <Dropdown.Toggle variant="transparent" id="ctacol">
                            <img src="../img/dot-ico.svg" alt="" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                          <Dropdown.Item onClick={() => {
                              if (window.confirm("Are you sure you want to delete this training?"))
                                handleTrainingDelete(training.id)
                            }}>Delete</Dropdown.Item>
                            <Dropdown.Item href={`/edit-training/${training.id}`}>Edit</Dropdown.Item>
                            <Dropdown.Item href="#" onClick={() => {
                              setSaveTrainingId(training.id);
                              setShowModal(true)
                            }}>Share</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                    <div className="created-by">
                      <h4 className="title">Created by:</h4>
                      <div className="createrimg">
                        <img src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?w=2000" alt="" />
                      </div>
                      <p>{training.user?.fullname}, <span>{training.user?.role.split("_").map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(" ")}</span></p>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
          {otherTrainingData?.length>0 || myTrainingData?.length>0 ?
          null
            :     
            fullLoaderStatus ? null :   <div className="text-center mb-5 mt-5">  <strong>No trainings available !</strong> </div>
          }
             {/* {

             }
              otherTrainingData?.length>0 && myTrainingData?.length>0 ? (
                null
              ):(
                  <div className="text-center mb-5 mt-5">  <strong>No trainings assigned to you!</strong> </div>
      
            } */}
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

export default TrainingCreatedByOther;
