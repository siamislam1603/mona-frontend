import React, { useState, useEffect } from "react";
import { Col, Row, Dropdown, Modal, Form, Button } from "react-bootstrap";
import { BASE_URL } from "../../components/App";
import axios from "axios";
import moment from 'moment';
import Multiselect from 'multiselect-react-dropdown';


const AvailableTraining = ({ filter }) => {
  console.log('FILTER:', filter);
  const [availableTrainingData, setAvailableTrainingData] = useState();
  const [trainingDeleteMessage, setTrainingDeleteMessage] = useState('');
  const [saveTrainingId, setSaveTrainingId] = useState(null);
  const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState(null);
  const [formSettings, setFormSettings] = useState({
    // assigned_roles: [],
    // assigned_franchisee: [],
    // assigned_users: []
  });
  const [showModal, setShowModal] = useState(false);
  const [franchiseeList, setFranchiseeList] = useState(null);

  // ERROR HANDLING
  const [topErrorMessage, setTopErrorMessage] = useState(null);

  const fetchAvailableTrainings = async () => {
    console.log('INSIDE AVAILABLE TRAINING MODULE')
    let user_id = localStorage.getItem('user_id');
    console.log('USER ID:', user_id)
    console.log('URL:', `${BASE_URL}/training/assigeedTraining/${user_id}`);
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/training/assigeedTraining/${user_id}?category_id=${filter.category_id}&search=${filter.search}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (response.status === 200 && response.data.status === "success") {
      console.log('RESPONSE:', response.data);
      const { searchedData } = response.data;
      setAvailableTrainingData(searchedData);
    }
  };

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

      if(training?.shares.length > 0) {
        copyDataToStates(training);
      } else {
        setTopErrorMessage('Sharing details for this user doesn\'t exist!');
        setTimeout(() => {
          setTopErrorMessage(null);
        }, 4000)
      }
    }
  };

  const copyDataToStates = (training) => {
    console.log('COPYING DATA TO STATES:');
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
      // const { dataObj } = response.data;
      
    }
  }

  // const filterData = (req, res, next) => {
  //   setFilteredData(availableTrainingData);

  //   let newData = availableTrainingData.filter(d => d.title.includes(searchTerm));
  //   setFilteredData(newData);
  // };

  useEffect(() => {
    fetchAvailableTrainings();
  }, [filter]);

  useEffect(() => {
    fetchFranchiseeList();
  }, [])

  useEffect(() => {
    fetchTrainingData(saveTrainingId);
    console.log('SAVE TRAINING ID:', saveTrainingId);
  }, [saveTrainingId]);

  formSettings && console.log('FORM SETTINGS:', formSettings);
  return (
    <>
    {topErrorMessage && <p className="alert alert-danger" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topErrorMessage}</p>}
      <div id="main">
        <div className="training-column">
          <Row>
            {availableTrainingData
              ? availableTrainingData.map((item) => {
                return (
                  <Col lg={4} md={6}>
                    <div className="item mt-3 mb-3">
                      <div className="pic"><a href={`/training-detail/${item.id}`}><img src={item.coverImage} alt="" /> <span className="lthumb"><img src="../img/logo-thumb.png" alt="" /></span></a></div>
                      <div className="fixcol">
                        <div className="icopic"><img src="../img/traning-audio-ico1.png" alt="" /></div>
                        <div className="iconame">
                          <a href="/training-detail">{item.title}</a>
                          <div className="datecol">
                            <span className="red-date">Due Date:{' '}{moment(item.createdAt).format('DD/MM/YYYY')}</span>
                            <span className="time">{item.completion_time} {item.completion_in}</span>
                          </div>
                        </div>
                        <div className="cta-col">
                        { localStorage.getItem('user_role') !== 'educator' &&
                          <Dropdown>
                            <Dropdown.Toggle variant="transparent" id="ctacol">
                              <img src="../img/dot-ico.svg" alt="" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item href="#" onClick={() => {
                                setSaveTrainingId(item.id);
                                setShowModal(true)
                              }}>Share</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        }
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })
              : <div><p>No trainings assigned to you!</p></div>
            }
          </Row>
        </div>
      </div>

      {
        Object.keys(formSettings).length > 0 &&
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
                    <Form.Label>Send to all franchisee:</Form.Label>
                    <div className="new-form-radio d-block">
                      <div className="new-form-radio-box">
                        <label for="all">
                          <input
                            type="radio"
                            checked={formSettings.send_to_all_franchisee === true}
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
                    <Form.Label>Select Franchisee</Form.Label>
                    <div className="select-with-plus">
                      <Multiselect
                        disable={formSettings?.send_to_all_franchisee === true}
                        placeholder={"Select User Names"}
                        singleSelect={true}
                        displayValue="key"
                        selectedValues={franchiseeList?.filter(d => parseInt(formSettings?.assigned_franchisee) === parseInt(d.id))}
                        className="multiselect-box default-arrow-select"
                        onKeyPressFn={function noRefCheck() { }}
                        onRemove={function noRefCheck(data) {
                          setFormSettings((prevState) => ({
                            ...prevState,
                            assigned_franchisee: [...data.map(data => data.id)],
                          }));
                        }}
                        onSearch={function noRefCheck() { }}
                        onSelect={function noRefCheck(data) {
                          setFormSettings((prevState) => ({
                            ...prevState,
                            assigned_franchisee: [...data.map((data) => data.id)],
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
                    <Form.Label>Applicable to:</Form.Label>
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
                              checked={formSettings?.assigned_roles?.includes("coordinator")}
                              label="Co-ordinators"
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

                          <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox1">
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

                          <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox2">
                            <Form.Check
                              type="checkbox"
                              label="Guardians"
                              checked={formSettings.assigned_roles.includes("guardian")}
                              onChange={() => {
                                if (formSettings.assigned_roles.includes("guardian")) {
                                  let data = formSettings.assigned_roles.filter(t => t !== "guardian");
                                  setFormSettings(prevState => ({
                                    ...prevState,
                                    assigned_roles: [...data]
                                  }));
                                }

                                if (!formSettings.assigned_roles.includes("guardian"))
                                  setFormSettings(prevState => ({
                                    ...prevState,
                                    assigned_roles: [...formSettings.assigned_roles, "guardian"]
                                  }))
                              }} />
                          </Form.Group>

                          <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox3">
                            <Form.Check
                              type="checkbox"
                              label="All Roles"
                              checked={formSettings.assigned_roles.length === 3}
                              onChange={() => {
                                if (formSettings.assigned_roles.includes("coordinator")
                                  && formSettings.assigned_roles.includes("educator")
                                  && formSettings.assigned_roles.includes("guardian")) {
                                  setFormSettings(prevState => ({
                                    ...prevState,
                                    assigned_roles: [],
                                  }));
                                }

                                if (!formSettings.assigned_roles.includes("coordinator")
                                  && !formSettings.assigned_roles.includes("educator")
                                  && !formSettings.assigned_roles.includes("guardian"))
                                  setFormSettings(prevState => ({
                                    ...prevState,
                                    assigned_roles: ["coordinator", "educator", "guardian"]
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

export default AvailableTraining;
