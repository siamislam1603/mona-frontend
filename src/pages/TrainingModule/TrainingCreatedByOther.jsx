
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
// import { Button, Container, Form, Dropdown } from "react-bootstrap";
// import LeftNavbar from "../components/LeftNavbar";
import Multiselect from 'multiselect-react-dropdown';
import { Col, Row, Dropdown, Container,Modal, Form, Button } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

import TopHeader from "../../components/TopHeader";
import { useLocation ,useNavigate} from 'react-router-dom';
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
import moment from "moment";

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
  const navigate = useNavigate();

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
  const [errorMessageToast, setErrorMessageToast] = useState(null);
  const [tabLinkPath, setTabLinkPath] = useState("/available-training");
  // const [selectedFranchisee, setSelectedFranchisee] = useState("Alphabet Kids, Sydney");
  const [trainingCategory, setTrainingCategory] = useState([]);
  const [filterData, setFilterData] = useState({
    category_id: 0,
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
          value: 'all categories',
          label: 'All Categories'
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

  const handleTrainingSharing = async () => {
    let token = localStorage.getItem('token');
    let user_id = localStorage.getItem('user_id')
    const response = await axios.post(`${BASE_URL}/share/${saveTrainingId}?titlePage=share`, {
      ...formSettings,
      shared_by: parseInt(user_id),
    }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status === 201 && response.data.status === "success") {
      let { msg: successMessage } = response.data;
      setSuccessMessageToast(successMessage);
      setSuccessMessageToast('Training re-shared successfully.');
    } else if(response.status === 200 && response.data.status === "fail") {
      let { msg: failureMessage } = response.data;
      setErrorMessageToast(failureMessage);
    }
  }

  const trainingCreatedByOther = async() =>{
   try {
    setfullLoaderStatus(true)
    let user_id = localStorage.getItem('user_id');
    let token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/training/trainingCreatedByOthers/?limit=${page}&search=${filterData.search}&category_id=${filterData.category_id}`, {
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


   // FETCH TRAINING DATA
   const fetchTrainingData = async (trainingId) => {
    console.log('TRAINING ID:', trainingId);
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/training/getTrainingByIdCreated/${trainingId}/${userId}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    console.log('RESPONSE EDIT TRAINING:', response);
    if (response.status === 200 && response.data.status === "success") {
      const { training } = response.data;
      console.log('TRAINING:', training);
      copyDataToStates(training);
    }
  };

  const copyDataToStates = (training) => {
    console.log('COPYING DATA TO STATES:');
    localStorage.getItem('user_role') === 'franchisor_admin'
      ? setFormSettings(prevState => ({
        ...prevState,
        assigned_users: training?.shares[0]?.assigned_users,
        assigned_roles: training?.shares[0]?.assigned_roles,
        assigned_franchisee: training?.shares[0]?.franchisee,
        applicable_to: training?.shares[0]?.applicable_to,
        send_to_all_franchisee: training?.shares[0]?.franchisee[0] === 'all' ? true : false,
      }))
      : setFormSettings(prevState => ({
        ...prevState,
        assigned_users: training?.shares[0]?.assigned_users,
        assigned_roles: training?.shares[0]?.assigned_roles.filter(d => d !== 'franchisee_admin'),
        assigned_franchisee: [selectedFranchisee],
        applicable_to: training?.shares[0]?.applicable_to,
        send_to_all_franchisee: false,
      }))

    localStorage.getItem('user_role') === 'franchisor_admin'
      ? fetchFranchiseeUsers(training?.shares[0]?.franchisee[0])
      : fetchFranchiseeUsers(selectedFranchisee);
  }

  const fetchFranchiseeUsers = async (franchisee_id) => {

    let f_id = localStorage.getItem('user_role') === 'franchisor_admin' ? franchisee_id : selectedFranchisee;
    console.log('F_ID_ID:', f_id);
    const response = await axios.post(`${BASE_URL}/auth/users/franchisees?franchiseeId=${f_id}`);
    if (response.status === 200 && response.data.status === "success") {
      const { users } = response.data;
      setFetchedFranchiseeUsers([
        ...users?.map((data) => ({
          id: data.id,
          cat: data.fullname.toLowerCase().split(" ").join("_"),
          key: data.fullname
        })),
      ]);
    }
    // }
  };


  useEffect(() => {
  
    // trainingCreatedByMe()
    // CreatedByme()
    trainingCreatedByOther()
    fetchTrainingCategories()
    console.log("Traingin created")
  }, []);
  useEffect(() =>{
    trainingCreatedByOther() 
  },[filterData.search,filterData.category_id,page,selectedFranchisee])

  useEffect(() => {
    if(formSettings?.assigned_franchisee?.length > 0) {
      fetchFranchiseeUsers(formSettings?.assigned_franchisee);
    } else {
      setFetchedFranchiseeUsers([]);
    }
  }, [formSettings?.assigned_franchisee])

  useEffect(() => {
    fetchTrainingData(saveTrainingId);
    console.log('SAVE TRAINING ID:', saveTrainingId);
  }, [saveTrainingId]);

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessageToast(null);
    }, 4000)
  }, [successMessageToast]);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessageToast(null);
    }, 4000);
  }, [errorMessageToast]);

  return (
    <>
      {successMessageToast && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{successMessageToast}</p>}
      {errorMessageToast && <p className="alert alert-danger" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{errorMessageToast}</p>}
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

                  {/* <FullLoader loading={fullLoaderStatus} /> */}
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
                      
                      Training created by others</h1>
                    
                    <div className="othpanel">
                      <div className="extra-btn">
                        <div className="data-search ">
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
                          value={trainingCategory.filter(d => d.id === filterData?.category_id)}
                          className="selectdropdown-col"
                          onChange={(e) => setFilterData(prevState => ({
                            ...prevState,
                            category_id: e.id === 0 ? null : e.id
                          }))}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <InfiniteScroll
                  style={{
                    overflow: "hidden"
                  }}
                        dataLength={otherTrainingData.length} //This is important field to render the next data
                        next={() => setPage(page+5)}
                        hasMore={true}
                        // loader={<h4>Loading...</h4>}
                        // endMessage={
                        //   <p style={{ textAlign: 'center' }}>
                        //     <b>Yay! You have seen it all</b>
                        //   </p>
                        // }
                       
                      >
                  <div className="training-column">

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
                      <div className="iconame"><a href="/training-detail">{training.title.length > 40 ? training.title.slice(0, 40) + "..." : training.title}</a>
                      <div className="datecol">
                        {
                          training.end_date !== null &&
                          <span className="red-date">Due Date:{' '}{moment(training.end_date).format('DD/MM/YYYY')}</span>
                        }
                        <span className="time">{training.completion_time} {training.completion_in}</span>
                      </div>
                      </div>
                      <div className="cta-col">
                        <Dropdown>
                          <Dropdown.Toggle variant="transparent" id="ctacol">
                            <img src="../img/dot-ico.svg" alt="" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item href={`/edit-training/${training.id}`}>Edit</Dropdown.Item>
                            <Dropdown.Item href="#" onClick={() => {
                              setSaveTrainingId(training.id);
                              setShowModal(true)
                            }}>Share</Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                              if (window.confirm("Are you sure you want to delete this training?"))
                                handleTrainingDelete(training.id)
                            }}>Delete</Dropdown.Item>
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
          </div>

          </InfiniteScroll>
          {fullLoaderStatus && 
                              <div className="text-center">
                              <img src="/img/loader.svg" style={{maxWidth:"100px"}} alt="Loader"></img>
                            </div>
                      }
                  {otherTrainingData?.length>0 || myTrainingData?.length>0 ?
                  null
                    :     
                    fullLoaderStatus ? null :   <div className="text-center mb-5 mt-5">  <strong>No training available</strong> </div>
                  }    
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
      {
        formSettings &&
        <>
          {
            localStorage.getItem('user_role') === 'franchisor_admin'
              ?
              (
                <Modal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  size="lg"
                  className="form-settings-modal"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered>
                  <Modal.Header closeButton>
                    <Modal.Title
                      id="contained-modal-title-vcenter"
                      className="modal-heading">
                      <img src="../../img/carbon_settings.svg" />
                      Form Settings
                    </Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <div className="form-settings-content">
                      <Row className="mt-4">
                        <Col lg={3} md={6}>
                          <Form.Group>
                            <Form.Label>Give access to all franchises</Form.Label>
                            <div className="new-form-radio d-block">
                              <div className="new-form-radio-box">
                                <label for="all">
                                  <input
                                    type="radio"
                                    checked={formSettings?.send_to_all_franchisee === true}
                                    name="send_to_all_franchisee"
                                    id="all"
                                    onChange={() => {
                                      setFormSettings(prevState => ({
                                        ...prevState,
                                        send_to_all_franchisee: true,
                                        assigned_franchisee: ['all']
                                      }));
                                    }}
                                  />
                                  <span className="radio-round"></span>
                                  <p>Yes</p>
                                </label>
                              </div>
                              <div className="new-form-radio-box m-0 mt-3">
                                <label for="none">
                                  <input
                                    type="radio"
                                    name="send_to_all_franchisee"
                                    checked={formSettings?.send_to_all_franchisee === false}
                                    id="none"
                                    onChange={() => {
                                      setFormSettings(prevState => ({
                                        ...prevState,
                                        send_to_all_franchisee: false,
                                        assigned_franchisee: []
                                      }));
                                    }}
                                  />
                                  <span className="radio-round"></span>
                                  <p>No</p>
                                </label>
                              </div>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg={9} md={12}>
                          <Form.Group>
                            <Form.Label>Select Franchise(s)</Form.Label>
                            <div className="select-with-plus">
                              <Multiselect
                                disable={formSettings?.send_to_all_franchisee === true}
                                placeholder={"Select"}
                                // singleSelect={true}
                                displayValue="key"
                                selectedValues={franchiseeList?.filter(d => formSettings?.assigned_franchisee?.includes(d.id + ''))}
                                className="multiselect-box default-arrow-select"
                                onKeyPressFn={function noRefCheck() { }}
                                onRemove={function noRefCheck(data) {
                                  setFormSettings((prevState) => ({
                                    ...prevState,
                                    assigned_franchisee: [...data.map(data => data.id + '')],
                                  }));
                                }}
                                onSearch={function noRefCheck() { }}
                                onSelect={function noRefCheck(data) {
                                  setFormSettings((prevState) => ({
                                    ...prevState,
                                    assigned_franchisee: [...data.map((data) => data.id + '')],
                                  }));
                                }}
                                options={franchiseeList}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className="mt-4">
                        <Col lg={3} md={6}>
                          <Form.Group>
                            <Form.Label>Accessible to</Form.Label>
                            <div className="new-form-radio d-block">
                              <div className="new-form-radio-box">
                                <label for="roles">
                                  <input
                                    type="radio"
                                    checked={formSettings?.applicable_to === 'roles'}
                                    name="accessible_to_role"
                                    id="roles"
                                    onChange={(event) => {
                                      setFormSettings((prevState) => ({
                                        ...prevState,
                                        applicable_to: 'roles',
                                      }));
                                    }}
                                  />
                                  <span className="radio-round"></span>
                                  <p>User Roles</p>
                                </label>
                              </div>
                              <div className="new-form-radio-box m-0 mt-3">
                                <label for="users">
                                  <input
                                    type="radio"
                                    name="accessible_to_role"
                                    checked={formSettings?.applicable_to === 'users'}
                                    id="users"
                                    onChange={(event) => {
                                      setFormSettings((prevState) => ({
                                        ...prevState,
                                        applicable_to: 'users',
                                      }));
                                    }}
                                  />
                                  <span className="radio-round"></span>
                                  <p>Specific Users</p>
                                </label>
                              </div>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg={9} md={12}>
                          {
                            formSettings?.applicable_to === "roles" ?
                              <>
                                <Form.Label className="d-block">Select User Roles</Form.Label>
                                <div className="btn-checkbox" style={{ display: "flex", flexDirection: "row" }}>
                                  <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox">
                                    <Form.Check
                                      type="checkbox"
                                      checked={formSettings?.assigned_roles?.includes("franchisee_admin")}
                                      label="Franchise Admin"
                                      onChange={() => {
                                        if (formSettings.assigned_roles.includes("franchisee_admin")) {
                                          let data = formSettings.assigned_roles.filter(t => t !== "franchisee_admin");
                                          setFormSettings(prevState => ({
                                            ...prevState,
                                            assigned_roles: [...data]
                                          }));
                                        }

                                        if (!formSettings.assigned_roles.includes("franchisee_admin"))
                                          setFormSettings(prevState => ({
                                            ...prevState,
                                            assigned_roles: [...formSettings.assigned_roles, "franchisee_admin"]
                                          }))
                                      }} />
                                  </Form.Group>

                                  <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox1">
                                    <Form.Check
                                      type="checkbox"
                                      checked={formSettings?.assigned_roles?.includes("coordinator")}
                                      label="Coordinator"
                                      onChange={() => {
                                        if (formSettings.assigned_roles.includes("coordinator")) {
                                          let data = formSettings.assigned_roles.filter(t => t !== "coordinator");
                                          setFormSettings(prevState => ({
                                            ...prevState,
                                            assigned_roles: [...data]
                                          }));
                                        }

                                        if (!formSettings.assigned_roles.includes("coordinator"))
                                          setFormSettings(prevState => ({
                                            ...prevState,
                                            assigned_roles: [...formSettings.assigned_roles, "coordinator"]
                                          }))
                                      }} />
                                  </Form.Group>

                                  <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox2">
                                    <Form.Check
                                      type="checkbox"
                                      label="Educator"
                                      checked={formSettings.assigned_roles.includes("educator")}
                                      onChange={() => {
                                        if (formSettings.assigned_roles.includes("educator")) {
                                          let data = formSettings.assigned_roles.filter(t => t !== "educator");
                                          setFormSettings(prevState => ({
                                            ...prevState,
                                            assigned_roles: [...data]
                                          }));
                                        }

                                        if (!formSettings.assigned_roles.includes("educator"))
                                          setFormSettings(prevState => ({
                                            ...prevState,
                                            assigned_roles: [...formSettings.assigned_roles, "educator"]
                                          }))
                                      }} />
                                  </Form.Group>

                                  <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox3">
                                    <Form.Check
                                      type="checkbox"
                                      label="All Roles"
                                      checked={formSettings.assigned_roles.length === 3}
                                      onChange={() => {

                                        if(formSettings?.assigned_roles?.length > 0) {
                                          setFormSettings(prevState => ({
                                            ...prevState,
                                            assigned_roles: ["franchisee_admin", "coordinator", "educator"]
                                          }));
                                        }

                                        if (formSettings.assigned_roles.includes("franchisee_admin")
                                          && formSettings.assigned_roles.includes("coordinator")
                                          && formSettings.assigned_roles.includes("educator")) {
                                          setFormSettings(prevState => ({
                                            ...prevState,
                                            assigned_roles: [],
                                          }));
                                        }

                                        if (!formSettings.assigned_roles.includes("franchisee_admin")
                                          && !formSettings.assigned_roles.includes("coordinator")
                                          && !formSettings.assigned_roles.includes("educator"))
                                          setFormSettings(prevState => ({
                                            ...prevState,
                                            assigned_roles: ["franchisee_admin", "coordinator", "educator"]
                                          })
                                          )
                                      }} />
                                  </Form.Group>
                                </div> </> :
                              <Form.Group>
                                <Form.Label>Select User</Form.Label>
                                <div className="select-with-plus">
                                  <Multiselect
                                    placeholder={"Select"}
                                    displayValue="key"
                                    className="multiselect-box default-arrow-select"
                                    selectedValues={fetchedFranchiseeUsers?.filter(d => formSettings?.assigned_users.includes(d.id + ""))}
                                    onKeyPressFn={function noRefCheck() { }}
                                    onRemove={function noRefCheck(data) {
                                      setFormSettings((prevState) => ({
                                        ...prevState,
                                        assigned_users: [...data.map(data => data.id)],
                                      }));
                                    }}
                                    onSearch={function noRefCheck() { }}
                                    onSelect={function noRefCheck(data) {
                                      setFormSettings((prevState) => ({
                                        ...prevState,
                                        assigned_users: [...data.map((data) => data.id)],
                                      }));
                                    }}
                                    options={fetchedFranchiseeUsers}
                                  />
                                </div>
                              </Form.Group>
                          }
                        </Col>
                      </Row>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="justify-content-center">
                    <Button className="back" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button
                      className="done"
                      onClick={() => {
                        setShowModal(false);
                        handleTrainingSharing();
                      }}>
                      Save Settings
                    </Button>
                  </Modal.Footer>
                </Modal>
              )
              :
              (
                <Modal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  size="lg"
                  className="form-settings-modal"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered>
                  <Modal.Header closeButton>
                    <Modal.Title
                      id="contained-modal-title-vcenter"
                      className="modal-heading">
                      <img src="../../img/carbon_settings.svg" />
                      Share Settings
                    </Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <div className="form-settings-content">
                      <Row className="mt-4">
                        <Col lg={3} md={6}>
                          <Form.Group>
                            <Form.Label>Accessible to</Form.Label>
                            <div className="new-form-radio d-block">
                              <div className="new-form-radio-box">
                                <label for="roles">
                                  <input
                                    type="radio"
                                    checked={formSettings?.applicable_to === 'roles'}
                                    name="accessible_to_role"
                                    id="roles"
                                    onChange={(event) => {
                                      setFormSettings((prevState) => ({
                                        ...prevState,
                                        applicable_to: 'roles',
                                      }));
                                    }}
                                  />
                                  <span className="radio-round"></span>
                                  <p>User Roles</p>
                                </label>
                              </div>
                              <div className="new-form-radio-box m-0 mt-3">
                                <label for="users">
                                  <input
                                    type="radio"
                                    name="accessible_to_role"
                                    checked={formSettings?.applicable_to === 'users'}
                                    id="users"
                                    onChange={(event) => {
                                      setFormSettings((prevState) => ({
                                        ...prevState,
                                        applicable_to: 'users',
                                      }));
                                    }}
                                  />
                                  <span className="radio-round"></span>
                                  <p>Specific Users</p>
                                </label>
                              </div>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg={9} md={12}>
                          {
                            formSettings?.applicable_to === "roles" ?
                              <>
                                <Form.Label className="d-block">Select User Roles</Form.Label>
                                <div className="btn-checkbox" style={{ display: "flex", flexDirection: "row" }}>

                                  {
                                    localStorage.getItem('user_role') === 'franchisee_admin' &&
                                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox1">
                                      <Form.Check
                                        type="checkbox"
                                        checked={formSettings?.assigned_roles?.includes("coordinator")}
                                        label="Coordinator"
                                        onChange={() => {
                                          if (formSettings.assigned_roles.includes("coordinator")) {
                                            let data = formSettings.assigned_roles.filter(t => t !== "coordinator");
                                            setFormSettings(prevState => ({
                                              ...prevState,
                                              assigned_roles: [...data]
                                            }));
                                          }

                                          if (!formSettings.assigned_roles.includes("coordinator"))
                                            setFormSettings(prevState => ({
                                              ...prevState,
                                              assigned_roles: [...formSettings.assigned_roles, "coordinator"]
                                            }))
                                        }} />
                                    </Form.Group>
                                  }

                                  <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox2">
                                    <Form.Check
                                      type="checkbox"
                                      label="Educator"
                                      checked={formSettings.assigned_roles.includes("educator")}
                                      onChange={() => {
                                        if (formSettings.assigned_roles.includes("educator")) {
                                          let data = formSettings.assigned_roles.filter(t => t !== "educator");
                                          setFormSettings(prevState => ({
                                            ...prevState,
                                            assigned_roles: [...data]
                                          }));
                                        }

                                        if (!formSettings.assigned_roles.includes("educator"))
                                          setFormSettings(prevState => ({
                                            ...prevState,
                                            assigned_roles: [...formSettings.assigned_roles, "educator"]
                                          }))
                                      }} />
                                  </Form.Group>

                                  <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox3">
                                    <Form.Check
                                      type="checkbox"
                                      label="All Roles"
                                      checked={formSettings.assigned_roles.length === 2}
                                      onChange={() => {

                                        if(formSettings?.assigned_roles?.length > 0) {
                                          setFormSettings(prevState => ({
                                            ...prevState,
                                            assigned_roles: ["coordinator", "educator"]
                                          }));
                                        }

                                        if (formSettings.assigned_roles.includes("coordinator")
                                          && formSettings.assigned_roles.includes("educator")) {
                                          setFormSettings(prevState => ({
                                            ...prevState,
                                            assigned_roles: [],
                                          }));
                                        }

                                        if (!formSettings.assigned_roles.includes("coordinator")
                                          && !formSettings.assigned_roles.includes("educator"))
                                          setFormSettings(prevState => ({
                                            ...prevState,
                                            assigned_roles: ["coordinator", "educator"]
                                          })
                                          )
                                      }} />
                                  </Form.Group>
                                </div> </> :
                              <Form.Group>
                                <Form.Label>Select User</Form.Label>
                                <div className="select-with-plus">
                                  <Multiselect
                                    placeholder={"Select"}
                                    displayValue="key"
                                    className="multiselect-box default-arrow-select"
                                    selectedValues={fetchedFranchiseeUsers?.filter(d => formSettings?.assigned_users.includes(d.id + ""))}
                                    onKeyPressFn={function noRefCheck() { }}
                                    onRemove={function noRefCheck(data) {
                                      setFormSettings((prevState) => ({
                                        ...prevState,
                                        assigned_users: [...data.map(data => data.id)],
                                      }));
                                    }}
                                    onSearch={function noRefCheck() { }}
                                    onSelect={function noRefCheck(data) {
                                      setFormSettings((prevState) => ({
                                        ...prevState,
                                        assigned_users: [...data.map((data) => data.id)],
                                      }));
                                    }}
                                    options={fetchedFranchiseeUsers}
                                  />
                                </div>
                              </Form.Group>
                          }
                        </Col>
                      </Row>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="justify-content-center">
                    <Button className="back" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button
                      className="done"
                      onClick={() => {
                        setShowModal(false);
                        handleTrainingSharing();
                      }}>
                      Save Settings
                    </Button>
                  </Modal.Footer>
                </Modal>
              )
          }
        </>
      }
    </>
  );
};

export default TrainingCreatedByOther;
