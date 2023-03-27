import React, { useState, useEffect } from 'react';
import { Col, Row, Dropdown, Modal, Form, Button } from 'react-bootstrap';
import { BASE_URL } from '../../components/App';
import axios from 'axios';
import Multiselect from 'multiselect-react-dropdown';
import moment from 'moment';
import { FullLoader } from '../../components/Loader';
import { isTrainingAddedByLoggedInUser } from '../../utils/commonMethods';
import { Link } from 'react-router-dom';

const CreatedTraining = ({ filter, selectedFranchisee, setTabName }) => {
  const [myTrainingData, setMyTrainingData] = useState([]);
  const [otherTrainingData, setOtherTrainingData] = useState([]);
  const [applicableToAll, setApplicableToAll] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState(
    localStorage.getItem('selectedFrachise')
  );
  const [franchiseeList, setFranchiseeList] = useState();
  const [showModal, setShowModal] = useState(false);
  const [saveTrainingId, setSaveTrainingId] = useState(null);
  const [sendToAllFranchisee, setSendToAllFranchisee] = useState('none');
  const [shareType, setShareType] = useState('roles');
  const [userList, setUserList] = useState();
  const [trainingDeleteMessage, setTrainingDeleteMessage] = useState('');
  const [fetchedFranchiseeUsers, setFetchedFranchiseeUsers] = useState([]);
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);
  const [page, setPage] = useState(6);

  function isTrainingExpired(end_date) {
    let due_date = moment(end_date).format();
    let today = moment().format();

    if (due_date < today) return true;

    return false;
  }

  const [formSettings, setFormSettings] = useState({
    assigned_roles: [],
    assigned_franchisee: [],
    assigned_users: [],
  });
  const [successMessageToast, setSuccessMessageToast] = useState(null);
  const [errorMessageToast, setErrorMessageToast] = useState(null);

  const fetchFranchiseeList = async () => {
    const token = localStorage.getItem('token');

    const response = await axios.get(`${BASE_URL}/role/franchisee`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200 && response.data.status === 'success') {
      setFranchiseeList(
        response.data.franchiseeList.map((data) => ({
          id: data.id,
          cat: data.franchisee_alias,
          key: `${data.franchisee_name}, ${data.city}`,
        }))
      );
    }
  };

  const handleTrainingSharing = async () => {
    let token = localStorage.getItem('token');
    let user_id = localStorage.getItem('user_id');
    const response = await axios.post(
      `${BASE_URL}/share/${saveTrainingId}?titlePage=share`,
      {
        ...formSettings,
        shared_by: parseInt(user_id),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201 && response.data.status === 'success') {
      let { msg: successMessage } = response.data;
      setSuccessMessageToast(successMessage);
      setSuccessMessageToast('Training re-shared successfully.');
    } else if (response.status === 200 && response.data.status === 'fail') {
      let { msg: failureMessage } = response.data;
      setErrorMessageToast(failureMessage);
    }
  };

  const trainingCreatedByMe = async () => {
    let user_id = localStorage.getItem('user_id');

    let token = localStorage.getItem('token');
    // let selectedFranchiseee = selectedFranchisee === "All" ? "all" : selectedFranchisee === "undefined" ? "all" : selectedFranchisee
    const response = await axios.get(
      `${BASE_URL}/training/trainingCreatedByMeOnly/${user_id}/?limit=${page}&search=${
        filter.search
      }&category_id=${
        filter.category_id
      }&franchiseeAlias=${localStorage.getItem('selectedFranchise')}`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
    if (response.status === 200 && response.data.status === 'success') {
      const { searchedData } = response.data;
      setMyTrainingData(searchedData);
      setfullLoaderStatus(false);
    }
  };

  const trainingCreatedByOther = async () => {
    try {
      let user_id = localStorage.getItem('user_id');
      let token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/training/trainingCreatedByOthers/?limit=${page}&search=${
          filter.search
        }&category_id=${
          filter.category_id
        }&franchiseeAlias=${localStorage.getItem('selectedFranchise')}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );
      if (response.status === 200 && response.data.status === 'success') {
        const { searchedData } = response.data;
        setOtherTrainingData(searchedData);
        setfullLoaderStatus(false);
      }
    } catch (error) {
      setfullLoaderStatus(false);
      // setOtherTrainingData([])
    }
  };

  const fetchFranchiseeUsers = async (franchisee_id, data) => {
    let f_id =
      localStorage.getItem('user_role') === 'franchisor_admin'
        ? franchisee_id
        : selectedFranchisee;
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${BASE_URL}/auth/users/franchisees?franchiseeId=${f_id}`,
      data,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if (response.status === 200 && response.data.status === 'success') {
      const { users } = response.data;
      setFetchedFranchiseeUsers([
        ...users?.map((data) => ({
          id: data.id,
          cat: data.fullname.toLowerCase().split(' ').join('_'),
          key: `${data.fullname} (${data.email})`,
        })),
      ]);
    }
    // }
  };

  const handleTrainingDelete = async (trainingId, stateName) => {
    let token = localStorage.getItem('token');
    let userId = localStorage.getItem('user_id');
    const response = await axios.delete(
      `${BASE_URL}/training/deleteTraining/${trainingId}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // HANDLING THE RESPONSE GENEREATED AFTER DELETING THE TRAINING
    if (response.status === 200 && response.data.status === 'success') {
      if (stateName === 'others') {
        let tempData = otherTrainingData.filter(
          (d) => parseInt(d.id) !== parseInt(trainingId)
        );
        setOtherTrainingData(tempData);
        setTrainingDeleteMessage(response.data.message);
        // trainingCreatedByOther();
      } else if (stateName === 'me') {
        let tempData = myTrainingData.filter(
          (d) => parseInt(d.id) !== parseInt(trainingId)
        );
        setMyTrainingData(tempData);
        setTrainingDeleteMessage(response.data.message);
        // trainingCreatedByMe();
      }
    } else if (response.status === 200 && response.data.status === 'fail') {
      setTrainingDeleteMessage(response.data.message);
    }
  };

  // FETCH TRAINING DATA
  const fetchTrainingData = async (trainingId) => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${BASE_URL}/training/getTrainingByIdCreated/${trainingId}/${userId}`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );

    if (response.status === 200 && response.data.status === 'success') {
      const { training } = response.data;
      copyDataToStates(training);
    }
  };

  const copyDataToStates = (training) => {
    localStorage.getItem('user_role') === 'franchisor_admin'
      ? setFormSettings((prevState) => ({
          ...prevState,
          assigned_users: training?.shares[0]?.assigned_users,
          assigned_roles: training?.shares[0]?.assigned_roles,
          assigned_franchisee: training?.shares[0]?.franchisee,
          applicable_to: training?.shares[0]?.applicable_to,
          send_to_all_franchisee:
            training?.shares[0]?.franchisee[0] === 'all' ? true : false,
        }))
      : setFormSettings((prevState) => ({
          ...prevState,
          assigned_users: training?.shares[0]?.assigned_users,
          assigned_roles: training?.shares[0]?.assigned_roles.filter(
            (d) => d !== 'franchisee_admin'
          ),
          assigned_franchisee: [selectedFranchisee],
          applicable_to: training?.shares[0]?.applicable_to,
          send_to_all_franchisee: false,
        }));

    localStorage.getItem('user_role') === 'franchisor_admin'
      ? fetchFranchiseeUsers(training?.shares[0]?.franchisee[0])
      : fetchFranchiseeUsers(selectedFranchisee);
  };

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessageToast(null);
    }, 4000);
  }, [successMessageToast]);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessageToast(null);
    }, 4000);
  }, [errorMessageToast]);

  // useEffect(() => {
  //   fetchCreatedTrainings();
  // }, [filter, trainingDeleteMessage]);

  // useEffect(() => {
  //   fetchUserList();
  // }, [selectedFranchisee]);

  useEffect(() => {
    if (formSettings?.assigned_franchisee?.length > 0) {
      fetchFranchiseeUsers(formSettings?.assigned_franchisee);
    } else {
      setFetchedFranchiseeUsers([]);
    }
  }, [formSettings?.assigned_franchisee]);

  useEffect(() => {
    if (selectedFranchise) {
      trainingCreatedByMe();
    }
  }, [selectedFranchise, filter.search, filter.category_id]);

  useEffect(() => {
    setSelectedFranchise(localStorage.getItem('selectedFranchise'));
  }, [localStorage.getItem('selectedFranchise')]);

  useEffect(() => {
    if (typeof selectedFranchisee !== 'undefined') {
      trainingCreatedByOther();
    }
  }, [
    filter.search,
    filter.category_id,
    trainingDeleteMessage,
    selectedFranchisee,
  ]);

  useEffect(() => {
    if (typeof selectedFranchisee !== 'undefined') {
      trainingCreatedByOther();
    }
  }, [selectedFranchisee]);
  useEffect(() => {
    fetchFranchiseeList();
  }, []);

  useEffect(() => {
    fetchTrainingData(saveTrainingId);
  }, [saveTrainingId]);

  useEffect(() => {
    setTabName('created_training');
  }, []);

  // filter && console.log('FILTER:', filter);
  // selectedFranchisee && console.log('SELECTED FRANCHISEE:', selectedFranchisee);
  return (
    <>
      <div id="main">
        <FullLoader loading={fullLoaderStatus} />
        {successMessageToast && (
          <p
            className="alert alert-success"
            style={{ position: 'fixed', left: '50%', top: '0%', zIndex: 1000 }}
          >
            {successMessageToast}
          </p>
        )}
        {errorMessageToast && (
          <p
            className="alert alert-danger"
            style={{ position: 'fixed', left: '50%', top: '0%', zIndex: 1000 }}
          >
            {errorMessageToast}
          </p>
        )}
        <div className="training-column">
          <Row style={{ marginBottom: '40px' }}>
            {/* {myTrainingData?.length > 0 && <h1></h1>} */}
            {localStorage.getItem('user_role') === 'franchisor_admin' ? (
              <header className="title-head mb-4 justify-content-between">
                {myTrainingData?.length > 0 &&
                  localStorage.getItem('user_role') === 'franchisor_admin' && (
                    <h3 className="title-sm mb-0">
                      <strong>Created by me</strong>
                    </h3>
                  )}
                {myTrainingData?.length > 5 && (
                  <Link to="/training-createdby-me" className="viewall">
                    View All
                  </Link>
                )}
              </header>
            ) : (
              <header
                className="title-head mt-4 mb-0"
                style={{ display: 'flex', justifyContent: 'right' }}
              >
                {myTrainingData?.length > 0 &&
                  localStorage.getItem('user_role') === 'franchisor_admin' && (
                    <h3 className="title-sm mb-0">
                      <strong>Created by me</strong>
                    </h3>
                  )}
                {myTrainingData?.length > 5 && (
                  <Link to="/training-createdby-me" className="viewall">
                    View All
                  </Link>
                )}
              </header>
            )}
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
                      <div className="icopic">
                        <img src="../img/traning-audio-ico1.png" alt="" />
                      </div>
                      <div className="iconame">
                        <a href={`/training-detail/${training.id}`}>
                          {training.title.length > 40
                            ? training.title.slice(0, 40) + '...'
                            : training.title}
                        </a>
                        <div className="datecol">
                          {training.end_date !== null && (
                            <span className="red-date">
                              Due Date:{' '}
                              {moment(training.end_date).format('DD/MM/YYYY')}
                            </span>
                          )}
                          <span className="time">
                            {training.completion_time} {training.completion_in}
                          </span>
                        </div>
                      </div>
                      <div className="cta-col">
                        <Dropdown>
                          <Dropdown.Toggle variant="transparent" id="ctacol">
                            <img src="../img/dot-ico.svg" alt="" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {(isTrainingAddedByLoggedInUser(
                              training?.addedBy
                            ) ||
                              (isTrainingExpired(training.end_date) === false &&
                                training.is_Training_completed === false)) && (
                              <Dropdown.Item
                                href={`/edit-training/${training.id}`}
                              >
                                Edit
                              </Dropdown.Item>
                            )}
                            {isTrainingExpired(training.end_date) === false && (
                              <Dropdown.Item
                                href="#"
                                onClick={() => {
                                  setSaveTrainingId(training.id);
                                  setShowModal(true);
                                }}
                              >
                                Share
                              </Dropdown.Item>
                            )}
                            <Dropdown.Item
                              onClick={() => {
                                if (
                                  window.confirm(
                                    'Are you sure you want to delete this training?'
                                  )
                                )
                                  handleTrainingDelete(training.id, 'me');
                              }}
                            >
                              Delete
                            </Dropdown.Item>
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
              {otherTrainingData?.length > 0 && (
                <h3 className="title-sm mb-0">
                  <strong>Created by Others</strong>
                </h3>
              )}
              {otherTrainingData?.length > 0 && (
                <Link to="/training-created-other" className="viewall">
                  View All
                </Link>
              )}
            </header>
            {otherTrainingData?.map((training) => {
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
                      <div className="icopic">
                        <img src="../img/traning-audio-ico1.png" alt="" />
                      </div>
                      <div className="iconame">
                        <a href={`/training-detail/${training.id}`}>
                          {training.title}
                        </a>
                        <div className="datecol">
                          {training.end_date !== null && (
                            <span className="red-date">
                              Due Date:{' '}
                              {moment(training.end_date).format('DD/MM/YYYY')}
                            </span>
                          )}
                          <span className="time">
                            {training.completion_time} {training.completion_in}
                          </span>
                        </div>
                      </div>
                      <div className="cta-col">
                        <Dropdown>
                          <Dropdown.Toggle variant="transparent" id="ctacol">
                            <img src="../img/dot-ico.svg" alt="" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {isTrainingExpired(training.end_date) === false && (
                              <Dropdown.Item
                                href={`/edit-training/${training.id}`}
                              >
                                Edit
                              </Dropdown.Item>
                            )}

                            {isTrainingExpired(training.end_date) === false && (
                              <Dropdown.Item
                                href="#"
                                onClick={() => {
                                  setSaveTrainingId(training.id);
                                  setShowModal(true);
                                }}
                              >
                                Share
                              </Dropdown.Item>
                            )}
                            <Dropdown.Item
                              onClick={() => {
                                if (
                                  window.confirm(
                                    'Are you sure you want to delete this training?'
                                  )
                                )
                                  handleTrainingDelete(training.id, 'others');
                              }}
                            >
                              Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                    <div className="created-by">
                      <h4 className="title">Created by:</h4>
                      <div className="createrimg">
                        <img
                          src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?w=2000"
                          alt=""
                        />
                      </div>
                      <p>
                        {training.user?.fullname},{' '}
                        <span>
                          {training.user?.role
                            .split('_')
                            .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
                            .join(' ')}
                        </span>
                      </p>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
          {otherTrainingData?.length > 0 || myTrainingData?.length > 0
            ? null
            : !fullLoaderStatus && (
                <div className="text-center mb-5 mt-5">
                  {' '}
                  <strong>No training available.</strong>{' '}
                </div>
              )}
          {/* {

             }
              otherTrainingData?.length>0 && myTrainingData?.length>0 ? (
                null
              ):(
                  <div className="text-center mb-5 mt-5">  <strong>No trainings assigned to you!</strong> </div>
      
            } */}
        </div>
      </div>

      {formSettings && (
        <>
          {localStorage.getItem('user_role') === 'franchisor_admin' ? (
            <Modal
              show={showModal}
              onHide={() => setShowModal(false)}
              size="lg"
              className="form-settings-modal"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title
                  id="contained-modal-title-vcenter"
                  className="modal-heading"
                >
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
                                checked={
                                  formSettings?.send_to_all_franchisee === true
                                }
                                name="send_to_all_franchisee"
                                id="all"
                                onChange={() => {
                                  setFormSettings((prevState) => ({
                                    ...prevState,
                                    send_to_all_franchisee: true,
                                    assigned_franchisee: ['all'],
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
                                checked={
                                  formSettings?.send_to_all_franchisee === false
                                }
                                id="none"
                                onChange={() => {
                                  setFormSettings((prevState) => ({
                                    ...prevState,
                                    send_to_all_franchisee: false,
                                    assigned_franchisee: [],
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
                            disable={
                              formSettings?.send_to_all_franchisee === true
                            }
                            placeholder={'Select'}
                            // singleSelect={true}
                            displayValue="key"
                            selectedValues={franchiseeList?.filter((d) =>
                              formSettings?.assigned_franchisee?.includes(
                                d.id + ''
                              )
                            )}
                            className="multiselect-box default-arrow-select"
                            onKeyPressFn={function noRefCheck() {}}
                            onRemove={function noRefCheck(data) {
                              setFormSettings((prevState) => ({
                                ...prevState,
                                assigned_franchisee: [
                                  ...data.map((data) => data.id + ''),
                                ],
                              }));
                            }}
                            onSearch={function noRefCheck() {}}
                            onSelect={function noRefCheck(data) {
                              setFormSettings((prevState) => ({
                                ...prevState,
                                assigned_franchisee: [
                                  ...data.map((data) => data.id + ''),
                                ],
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
                                checked={
                                  formSettings?.applicable_to === 'roles'
                                }
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
                                checked={
                                  formSettings?.applicable_to === 'users'
                                }
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
                      {formSettings?.applicable_to === 'roles' ? (
                        <>
                          <Form.Label className="d-block">
                            Select User Roles
                          </Form.Label>
                          <div
                            className="btn-checkbox"
                            style={{ display: 'flex', flexDirection: 'row' }}
                          >
                            <Form.Group
                              className="mb-3 form-group"
                              controlId="formBasicCheckbox"
                            >
                              <Form.Check
                                type="checkbox"
                                checked={formSettings?.assigned_roles?.includes(
                                  'franchisee_admin'
                                )}
                                label="Franchise Admin"
                                onChange={() => {
                                  if (
                                    formSettings.assigned_roles.includes(
                                      'franchisee_admin'
                                    )
                                  ) {
                                    let data =
                                      formSettings.assigned_roles.filter(
                                        (t) => t !== 'franchisee_admin'
                                      );
                                    setFormSettings((prevState) => ({
                                      ...prevState,
                                      assigned_roles: [...data],
                                    }));
                                  }

                                  if (
                                    !formSettings.assigned_roles.includes(
                                      'franchisee_admin'
                                    )
                                  )
                                    setFormSettings((prevState) => ({
                                      ...prevState,
                                      assigned_roles: [
                                        ...formSettings.assigned_roles,
                                        'franchisee_admin',
                                      ],
                                    }));
                                }}
                              />
                            </Form.Group>

                            <Form.Group
                              className="mb-3 form-group"
                              controlId="formBasicCheckbox1"
                            >
                              <Form.Check
                                type="checkbox"
                                checked={formSettings?.assigned_roles?.includes(
                                  'coordinator'
                                )}
                                label="Coordinator"
                                onChange={() => {
                                  if (
                                    formSettings.assigned_roles.includes(
                                      'coordinator'
                                    )
                                  ) {
                                    let data =
                                      formSettings.assigned_roles.filter(
                                        (t) => t !== 'coordinator'
                                      );
                                    setFormSettings((prevState) => ({
                                      ...prevState,
                                      assigned_roles: [...data],
                                    }));
                                  }

                                  if (
                                    !formSettings.assigned_roles.includes(
                                      'coordinator'
                                    )
                                  )
                                    setFormSettings((prevState) => ({
                                      ...prevState,
                                      assigned_roles: [
                                        ...formSettings.assigned_roles,
                                        'coordinator',
                                      ],
                                    }));
                                }}
                              />
                            </Form.Group>

                            <Form.Group
                              className="mb-3 form-group"
                              controlId="formBasicCheckbox2"
                            >
                              <Form.Check
                                type="checkbox"
                                label="Educator"
                                checked={formSettings.assigned_roles.includes(
                                  'educator'
                                )}
                                onChange={() => {
                                  if (
                                    formSettings.assigned_roles.includes(
                                      'educator'
                                    )
                                  ) {
                                    let data =
                                      formSettings.assigned_roles.filter(
                                        (t) => t !== 'educator'
                                      );
                                    setFormSettings((prevState) => ({
                                      ...prevState,
                                      assigned_roles: [...data],
                                    }));
                                  }

                                  if (
                                    !formSettings.assigned_roles.includes(
                                      'educator'
                                    )
                                  )
                                    setFormSettings((prevState) => ({
                                      ...prevState,
                                      assigned_roles: [
                                        ...formSettings.assigned_roles,
                                        'educator',
                                      ],
                                    }));
                                }}
                              />
                            </Form.Group>

                            <Form.Group
                              className="mb-3 form-group"
                              controlId="formBasicCheckbox3"
                            >
                              <Form.Check
                                type="checkbox"
                                label="All Roles"
                                checked={
                                  formSettings.assigned_roles.length === 3
                                }
                                onChange={() => {
                                  if (
                                    formSettings?.assigned_roles?.length > 0
                                  ) {
                                    setFormSettings((prevState) => ({
                                      ...prevState,
                                      assigned_roles: [
                                        'franchisee_admin',
                                        'coordinator',
                                        'educator',
                                      ],
                                    }));
                                  }

                                  if (
                                    formSettings.assigned_roles.includes(
                                      'franchisee_admin'
                                    ) &&
                                    formSettings.assigned_roles.includes(
                                      'coordinator'
                                    ) &&
                                    formSettings.assigned_roles.includes(
                                      'educator'
                                    )
                                  ) {
                                    setFormSettings((prevState) => ({
                                      ...prevState,
                                      assigned_roles: [],
                                    }));
                                  }

                                  if (
                                    !formSettings.assigned_roles.includes(
                                      'franchisee_admin'
                                    ) &&
                                    !formSettings.assigned_roles.includes(
                                      'coordinator'
                                    ) &&
                                    !formSettings.assigned_roles.includes(
                                      'educator'
                                    )
                                  )
                                    setFormSettings((prevState) => ({
                                      ...prevState,
                                      assigned_roles: [
                                        'franchisee_admin',
                                        'coordinator',
                                        'educator',
                                      ],
                                    }));
                                }}
                              />
                            </Form.Group>
                          </div>{' '}
                        </>
                      ) : (
                        <Form.Group>
                          <Form.Label>Select User</Form.Label>
                          <div className="select-with-plus">
                            <Multiselect
                              placeholder={'Select'}
                              displayValue="key"
                              className="multiselect-box default-arrow-select"
                              selectedValues={fetchedFranchiseeUsers?.filter(
                                (d) =>
                                  formSettings?.assigned_users.includes(
                                    d.id + ''
                                  )
                              )}
                              onKeyPressFn={function noRefCheck() {}}
                              onRemove={function noRefCheck(data) {
                                setFormSettings((prevState) => ({
                                  ...prevState,
                                  assigned_users: [
                                    ...data.map((data) => data.id),
                                  ],
                                }));
                              }}
                              onSearch={function noRefCheck() {}}
                              onSelect={function noRefCheck(data) {
                                setFormSettings((prevState) => ({
                                  ...prevState,
                                  assigned_users: [
                                    ...data.map((data) => data.id),
                                  ],
                                }));
                              }}
                              options={fetchedFranchiseeUsers}
                            />
                          </div>
                        </Form.Group>
                      )}
                    </Col>
                  </Row>
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-content-center">
                <Button className="back" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="done"
                  onClick={() => {
                    setShowModal(false);
                    handleTrainingSharing();
                  }}
                >
                  Save Settings
                </Button>
              </Modal.Footer>
            </Modal>
          ) : (
            <Modal
              show={showModal}
              onHide={() => setShowModal(false)}
              size="lg"
              className="form-settings-modal"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title
                  id="contained-modal-title-vcenter"
                  className="modal-heading"
                >
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
                                checked={
                                  formSettings?.applicable_to === 'roles'
                                }
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
                                checked={
                                  formSettings?.applicable_to === 'users'
                                }
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
                      {formSettings?.applicable_to === 'roles' ? (
                        <>
                          <Form.Label className="d-block">
                            Select User Roles
                          </Form.Label>
                          <div
                            className="btn-checkbox"
                            style={{ display: 'flex', flexDirection: 'row' }}
                          >
                            {localStorage.getItem('user_role') ===
                              'franchisee_admin' && (
                              <Form.Group
                                className="mb-3 form-group"
                                controlId="formBasicCheckbox1"
                              >
                                <Form.Check
                                  type="checkbox"
                                  checked={formSettings?.assigned_roles?.includes(
                                    'coordinator'
                                  )}
                                  label="Coordinator"
                                  onChange={() => {
                                    if (
                                      formSettings.assigned_roles.includes(
                                        'coordinator'
                                      )
                                    ) {
                                      let data =
                                        formSettings.assigned_roles.filter(
                                          (t) => t !== 'coordinator'
                                        );
                                      setFormSettings((prevState) => ({
                                        ...prevState,
                                        assigned_roles: [...data],
                                      }));
                                    }

                                    if (
                                      !formSettings.assigned_roles.includes(
                                        'coordinator'
                                      )
                                    )
                                      setFormSettings((prevState) => ({
                                        ...prevState,
                                        assigned_roles: [
                                          ...formSettings.assigned_roles,
                                          'coordinator',
                                        ],
                                      }));
                                  }}
                                />
                              </Form.Group>
                            )}

                            <Form.Group
                              className="mb-3 form-group"
                              controlId="formBasicCheckbox2"
                            >
                              <Form.Check
                                type="checkbox"
                                label="Educator"
                                checked={formSettings.assigned_roles.includes(
                                  'educator'
                                )}
                                onChange={() => {
                                  if (
                                    formSettings.assigned_roles.includes(
                                      'educator'
                                    )
                                  ) {
                                    let data =
                                      formSettings.assigned_roles.filter(
                                        (t) => t !== 'educator'
                                      );
                                    setFormSettings((prevState) => ({
                                      ...prevState,
                                      assigned_roles: [...data],
                                    }));
                                  }

                                  if (
                                    !formSettings.assigned_roles.includes(
                                      'educator'
                                    )
                                  )
                                    setFormSettings((prevState) => ({
                                      ...prevState,
                                      assigned_roles: [
                                        ...formSettings.assigned_roles,
                                        'educator',
                                      ],
                                    }));
                                }}
                              />
                            </Form.Group>

                            <Form.Group
                              className="mb-3 form-group"
                              controlId="formBasicCheckbox3"
                            >
                              <Form.Check
                                type="checkbox"
                                label="All Roles"
                                checked={
                                  formSettings.assigned_roles.length === 2
                                }
                                onChange={() => {
                                  if (
                                    formSettings?.assigned_roles?.length > 0
                                  ) {
                                    setFormSettings((prevState) => ({
                                      ...prevState,
                                      assigned_roles: [
                                        'coordinator',
                                        'educator',
                                      ],
                                    }));
                                  }

                                  if (
                                    formSettings.assigned_roles.includes(
                                      'coordinator'
                                    ) &&
                                    formSettings.assigned_roles.includes(
                                      'educator'
                                    )
                                  ) {
                                    setFormSettings((prevState) => ({
                                      ...prevState,
                                      assigned_roles: [],
                                    }));
                                  }

                                  if (
                                    !formSettings.assigned_roles.includes(
                                      'coordinator'
                                    ) &&
                                    !formSettings.assigned_roles.includes(
                                      'educator'
                                    )
                                  )
                                    setFormSettings((prevState) => ({
                                      ...prevState,
                                      assigned_roles: [
                                        'coordinator',
                                        'educator',
                                      ],
                                    }));
                                }}
                              />
                            </Form.Group>
                          </div>{' '}
                        </>
                      ) : (
                        <Form.Group>
                          <Form.Label>Select User</Form.Label>
                          <div className="select-with-plus">
                            <Multiselect
                              placeholder={'Select'}
                              displayValue="key"
                              className="multiselect-box default-arrow-select"
                              selectedValues={fetchedFranchiseeUsers?.filter(
                                (d) =>
                                  formSettings?.assigned_users.includes(
                                    d.id + ''
                                  )
                              )}
                              onKeyPressFn={function noRefCheck() {}}
                              onRemove={function noRefCheck(data) {
                                setFormSettings((prevState) => ({
                                  ...prevState,
                                  assigned_users: [
                                    ...data.map((data) => data.id),
                                  ],
                                }));
                              }}
                              onSearch={function noRefCheck() {}}
                              onSelect={function noRefCheck(data) {
                                setFormSettings((prevState) => ({
                                  ...prevState,
                                  assigned_users: [
                                    ...data.map((data) => data.id),
                                  ],
                                }));
                              }}
                              options={fetchedFranchiseeUsers}
                            />
                          </div>
                        </Form.Group>
                      )}
                    </Col>
                  </Row>
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-content-center">
                <Button className="back" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="done"
                  onClick={() => {
                    setShowModal(false);
                    handleTrainingSharing();
                  }}
                >
                  Save Settings
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </>
      )}
    </>
  );
};

export default CreatedTraining;
