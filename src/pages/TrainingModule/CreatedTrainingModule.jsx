import React, { useState, useEffect } from "react";
import { Col, Row, Dropdown, Modal, Form, Button } from "react-bootstrap";
import { BASE_URL } from "../../components/App";
import axios from "axios";
import Multiselect from 'multiselect-react-dropdown';
import { FullLoader } from "../../components/Loader";
import { Link } from "react-router-dom";

const CreatedTraining = ({ filter, selectedFranchisee }) => {
  const [myTrainingData, setMyTrainingData] = useState([]);
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
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);
  const [page, setPage] = useState(6)

  const [formSettings, setFormSettings] = useState({
    assigned_roles: [],
    assigned_franchisee: [],
    assigned_users: []
  });
  const [successMessageToast, setSuccessMessageToast] = useState(null);

  const fetchFranchiseeList = async () => {
    const token = localStorage.getItem('token');

    const response = await axios.get(`${BASE_URL}/role/franchisee`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.status === "success") {
      setFranchiseeList(response.data.franchiseeList.map(data => ({
        id: data.id,
        cat: data.franchisee_alias,
        key: `${data.franchisee_name}, ${data.city}`
      })));
    }
  };

  const fetchUserList = async () => {
    let franchisee_alias = selectedFranchisee.split(",")[0].split(" ").map(d => d.charAt(0).toLowerCase() + d.slice(1)).join("_");
    const response = await axios.get(`${BASE_URL}/user-group/users/franchisee/${franchisee_alias}`);

    if (response.status === 200 && response.data.status === "success") {
      const { users } = response.data;
      setUserList(users.map(user => ({
        id: user.id,
        name: user.fullname,
        email: user.email,
        cat: user.email,
        key: user.email
      })));
    }
  };

  console.log('THE filter', filter)
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
      setSuccessMessageToast('Training re-shared successfully.');
    }
  }

  const fetchFranchiseeUsers = async (franchisee_id) => {
    const response = await axios.get(`${BASE_URL}/role/user/franchiseeById/${franchisee_id}`);
    if (response.status === 200 && Object.keys(response.data).length > 1) {
      const { users } = response.data;
      setFetchedFranchiseeUsers([
        ...users?.map((data) => ({
          id: data.id,
          cat: data.fullname.toLowerCase().split(" ").join("_"),
          key: data.fullname
        })),
      ]);
    }
  };
  const trainingCreatedByMe = async () => {
    try {
      let user_id = localStorage.getItem('user_id');
      let token = localStorage.getItem('token');
      console.log("TRaini created selectd",selectedFranchisee)
      const response = await axios.get(`${BASE_URL}/training/trainingCreatedByMeOnly/${user_id}/?limit=${page}&search=${filter.search}&category_id=${filter.category_id}&franchiseeAlias=${selectedFranchisee === "All"? "all":selectedFranchisee}`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      console.log('Training created by me', response)
      if (response.status === 200 && response.data.status === "success") {
        const { searchedData } = response.data
        setMyTrainingData(searchedData)
        setfullLoaderStatus(false)


      }
    } catch (error) {
      console.log("Error create by me",error)
      setMyTrainingData([])
    }

  }
  const trainingCreatedByOther = async () => {
    try {
      let user_id = localStorage.getItem('user_id');
      let token = localStorage.getItem('token');
      console.log("Search inside training other", filter.search)
      const response = await axios.get(`${BASE_URL}/training/trainingCreatedByOthers/?limit=${page}&search=${filter.search}&category_id=${filter.category_id}`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      console.log('Training created by OTHER', response)
      if (response.status === 200 && response.data.status === "success") {
        const { searchedData } = response.data
        setOtherTrainingData(searchedData)
        setfullLoaderStatus(false)


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
    const response = await axios.get(`${BASE_URL}/training/getTrainingById/${trainingId}/${userId}`, {
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
    setFormSettings(prevState => ({
      ...prevState,
      assigned_users: training?.shares[0]?.assigned_users,
      assigned_roles: training?.shares[0]?.assigned_roles,
      assigned_franchisee: training?.shares[0]?.franchisee,
      applicable_to: training?.shares[0]?.applicable_to,
      send_to_all_franchisee: training?.shares[0]?.franchisee === 'all' ? true : false,
    }));
    fetchFranchiseeUsers(training?.shares[0]?.franchisee[0]);
  }

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessageToast(null);
    }, 4000)
  }, [successMessageToast]);

  // useEffect(() => {
  //   fetchCreatedTrainings();
  // }, [filter, trainingDeleteMessage]);

  useEffect(() => {
    fetchUserList();
  }, [selectedFranchisee]);
  useEffect(() => {
    trainingCreatedByMe()

  },[filter,page,trainingDeleteMessage,selectedFranchisee])

  useEffect(() => {
    trainingCreatedByOther()
  }, [filter, page, trainingDeleteMessage])

  useEffect(() => {
    fetchFranchiseeList();
  }, [])

  useEffect(() => {
    fetchTrainingData(saveTrainingId);
    console.log('SAVE TRAINING ID:', saveTrainingId);
  }, [saveTrainingId]);

  // useEffect(() => {
  //   if(formSettings.assigned_franchisee[0] !== 'all') {
  //     console.log('fetching franchisee', formSettings?.assigned_franchisee[0], 'uesrs!');
  //     fetchFranchiseeUsers(formSettings?.assigned_franchisee[0]);
  //   }
  // }, [formSettings?.assigned_franchisee]);

  // formSettings && console.log('FORM SETTINGS:', formSettings);
  // fetchedFranchiseeUsers && console.log('FETCHED FRANCHISEE USERS:', fetchedFranchiseeUsers);
  otherTrainingData && console.log('OTHER TRAINING DATA:', otherTrainingData);
  myTrainingData && console.log('MY TRAINING DATA:', myTrainingData);
  // formSettings && console.log('FORM SETTINGS:', formSettings);
  console.log("Franchise",selectedFranchisee)
  return (
    <>
      <div id="main">
        <FullLoader loading={fullLoaderStatus} />
        {successMessageToast && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{successMessageToast}</p>}
        <div className="training-column">
          <Row style={{ marginBottom: '40px' }}>
            {/* {myTrainingData?.length > 0 && <h1></h1>} */}
            <header className="title-head mb-4 justify-content-between">
              {myTrainingData?.length > 0 &&
                <h3 className="title-sm mb-0"><strong>Created by me</strong></h3>

              }
              {myTrainingData?.length > 0 && <Link to="/training-createdby-me" className="viewall">View All</Link>}
            </header>
            {myTrainingData?.map((training) => {
              return (
                <Col lg={4} md={6} key={training.id}>
                  <div className="item mt-3 mb-3">
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
                      <div className="iconame"><a href={`/training-detail/${training.id}`}>{training.title}</a> <span className="time">{training.completion_time}</span></div>
                      <div className="cta-col">
                        <Dropdown>
                          <Dropdown.Toggle variant="transparent" id="ctacol">
                            <img src="../img/dot-ico.svg" alt="" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {training.is_Training_completed === false && <Dropdown.Item href={`/edit-training/${training.id}`}>Edit</Dropdown.Item>}
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
                  </div>
                </Col>
              );
            })}

          </Row>

          <Row>
            {/* {
              otherTrainingData?.length > 0 && <h1 style={{ marginBottom: '25px' }}>Created by others</h1>
            } */}
             <header className="title-head mb-4 justify-content-between">
                            {otherTrainingData?.length > 0 && 
                            <h3 className="title-sm mb-0"><strong>Created by Others</strong></h3>
                            
                            }
                            {otherTrainingData?.length > 0 && 
                            <Link to="/training-created-other" className="viewall">View All</Link>
                            
                            }
                          </header>
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
          {otherTrainingData?.length > 0 || myTrainingData?.length > 0 ?
            null
            :
            !fullLoaderStatus && <div className="text-center mb-5 mt-5">  <strong>No training available.</strong> </div>
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

      {
        formSettings &&
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
                    <Form.Label>Send to all franchise</Form.Label>
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
                        placeholder={"Select User Names"}
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
                    <Form.Label>Applicable to</Form.Label>
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
                              label="Educators"
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
                            placeholder={"Select User Names"}
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
      }
    </>
  );
};

export default CreatedTraining;
