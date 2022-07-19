import {
  faEllipsisVertical,
  faPen,
  faPlus,
  faRemove,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  Modal,
  Row,
  Tab,
  Tabs,
} from 'react-bootstrap';
import LeftNavbar from '../../components/LeftNavbar';
import TopHeader from '../../components/TopHeader';
import { BASE_URL } from '../../components/App';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

function ViewFormBuilder(props) {
  const navigate = useNavigate();
  const [viewResponseFlag, setViewResponseFlag] = useState(false);
  const [formData, setFormData] = useState([]);
  useEffect(() => {
    getFormData('');
  }, []);
  const getFormData = (search) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/form?search=${search}`, requestOptions)
      .then((response) => response.json())
      .then((result) => setFormData(result?.result))
      .catch((error) => console.log('error', error));
  };

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
                <TopHeader />

                <div className="forms-header-section">
                  <div className="forms-managment-section">
                    <div className="forms-managment-left">
                      <h6>Forms Management</h6>
                    </div>
                    <div className="forms-managment-right">
                      <div className="forms-search">
                        <Form.Group>
                          <div className="forms-icon">
                            <img src="../img/search-icon-light.svg" alt="" />
                          </div>
                          <Form.Control
                            type="text"
                            placeholder="Search..."
                            name="search"
                            onChange={(e) => {
                              getFormData(e.target.value);
                            }}
                          />
                        </Form.Group>
                      </div>
                      <div className="forms-filter">
                        <Button variant="outline-primary">
                          <img src="../img/Vector.svg" />
                          Add Filters
                        </Button>
                      </div>
                      <div className="forms-create">
                        <Button
                          variant="primary"
                          onClick={() => {
                            navigate('/form/add');
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                          Create New Form
                        </Button>
                      </div>
                      <div className="forms-toogle">
                        <div class="custom-menu-dots">
                          <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic">
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item href="#/action-1">
                                <FontAwesomeIcon icon={faPen} /> Edit
                              </Dropdown.Item>
                              <Dropdown.Item href="#/action-2">
                                <FontAwesomeIcon icon={faRemove} /> Remove
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-section">
                    <Tabs
                      defaultActiveKey="profile"
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab eventKey="home" title="Forms to complete">
                        <div className="forms-content-section">
                          <Row>
                            <div className="col-lg-12">
                              <h2 className="page_title">Parent Forms</h2>
                            </div>
                          </Row>
                          <Row>
                            {formData?.map((item) => {
                              return (
                                <Col lg={4}>
                                  <div className="forms-content create-other">
                                    <div className="content-icon-section">
                                      <img src="../img/survey_icon.png" />
                                    </div>
                                    <div className="content-title-section">
                                      <h6>{item.form_name}</h6>
                                      <h4>
                                        Created on:{' '}
                                        {moment(item.createdAt).format(
                                          'MM/DD/YYYY'
                                        )}
                                      </h4>
                                    </div>
                                    <div className="content-toogle">
                                      <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic1">
                                          <FontAwesomeIcon
                                            icon={faEllipsisVertical}
                                          />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item
                                            onClick={() => {
                                              navigate('/form/add', {
                                                state: { id: item.id },
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faPen} />{' '}
                                            Edit
                                          </Dropdown.Item>
                                          <Dropdown.Item href="#/action-2">
                                            <FontAwesomeIcon icon={faRemove} />{' '}
                                            Remove
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>

                          <Row>
                            <div className="col-lg-12">
                              <h2 className="page_title">Talent Management</h2>
                            </div>
                          </Row>
                          <Row>
                            {formData?.map((item) => {
                              return (
                                <Col lg={4}>
                                  <div className="forms-content create-other">
                                    <div className="content-icon-section">
                                      <img src="../img/blue_survey.png" />
                                    </div>
                                    <div className="content-title-section">
                                      <h6>{item.form_name}</h6>
                                      <h4>
                                        Created on:{' '}
                                        {moment(item.createdAt).format(
                                          'MM/DD/YYYY'
                                        )}
                                      </h4>
                                    </div>
                                    <div className="content-toogle">
                                      <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic1">
                                          <FontAwesomeIcon
                                            icon={faEllipsisVertical}
                                          />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item
                                            onClick={() => {
                                              navigate('/form/add', {
                                                state: { id: item.id },
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faPen} />{' '}
                                            Edit
                                          </Dropdown.Item>
                                          <Dropdown.Item href="#/action-2">
                                            <FontAwesomeIcon icon={faRemove} />{' '}
                                            Remove
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>

                          <Row>
                            <div className="col-lg-12">
                              <h2 className="page_title">Child Care Forms</h2>
                            </div>
                          </Row>
                          <Row>
                            {formData?.map((item) => {
                              return (
                                <Col lg={4}>
                                  <div className="forms-content create-other">
                                    <div className="content-icon-section">
                                      <img src="../img/green_survey.png" />
                                    </div>
                                    <div className="content-title-section">
                                      <h6>{item.form_name}</h6>
                                      <h4>
                                        Created on:{' '}
                                        {moment(item.createdAt).format(
                                          'MM/DD/YYYY'
                                        )}
                                      </h4>
                                    </div>
                                    <div className="content-toogle">
                                      <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic1">
                                          <FontAwesomeIcon
                                            icon={faEllipsisVertical}
                                          />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item
                                            onClick={() => {
                                              navigate('/form/add', {
                                                state: { id: item.id },
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faPen} />{' '}
                                            Edit
                                          </Dropdown.Item>
                                          <Dropdown.Item href="#/action-2">
                                            <FontAwesomeIcon icon={faRemove} />{' '}
                                            Remove
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>

                          <Row>
                            <div className="col-lg-12">
                              <h2 className="page_title">
                                Business Operations
                              </h2>
                            </div>
                          </Row>
                          <Row>
                            {formData?.map((item) => {
                              return (
                                <Col lg={4}>
                                  <div className="forms-content create-other">
                                    <div className="content-icon-section">
                                      <img src="../img/dark_green_survey.png" />
                                    </div>
                                    <div className="content-title-section">
                                      <h6>{item.form_name}</h6>
                                      <h4>
                                        Created on:{' '}
                                        {moment(item.createdAt).format(
                                          'MM/DD/YYYY'
                                        )}
                                      </h4>
                                    </div>
                                    <div className="content-toogle">
                                      <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic1">
                                          <FontAwesomeIcon
                                            icon={faEllipsisVertical}
                                          />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item
                                            onClick={() => {
                                              navigate('/form/add', {
                                                state: { id: item.id },
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faPen} />{' '}
                                            Edit
                                          </Dropdown.Item>
                                          <Dropdown.Item href="#/action-2">
                                            <FontAwesomeIcon icon={faRemove} />{' '}
                                            Remove
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>

                          <Row>
                            <div className="col-lg-12">
                              <h2 className="page_title">Customer Service</h2>
                            </div>
                          </Row>
                          <Row>
                            {formData?.map((item) => {
                              return (
                                <Col lg={4}>
                                  <div className="forms-content create-other">
                                    <div className="content-icon-section">
                                      <img src="../img/gray_survey.png" />
                                    </div>
                                    <div className="content-title-section">
                                      <h6>{item.form_name}</h6>
                                      <h4>
                                        Created on:{' '}
                                        {moment(item.createdAt).format(
                                          'MM/DD/YYYY'
                                        )}
                                      </h4>
                                    </div>
                                    <div className="content-toogle">
                                      <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic1">
                                          <FontAwesomeIcon
                                            icon={faEllipsisVertical}
                                          />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item
                                            onClick={() => {
                                              navigate('/form/add', {
                                                state: { id: item.id },
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faPen} />{' '}
                                            Edit
                                          </Dropdown.Item>
                                          <Dropdown.Item href="#/action-2">
                                            <FontAwesomeIcon icon={faRemove} />{' '}
                                            Remove
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>

                          <Row>
                            <div className="col-lg-12">
                              <h2 className="page_title">
                                Governance & Compliance
                              </h2>
                            </div>
                          </Row>
                          <Row>
                            {formData?.map((item) => {
                              return (
                                <Col lg={4}>
                                  <div className="forms-content create-other">
                                    <div className="content-icon-section">
                                      <img src="../img/pink_survey.png" />
                                    </div>
                                    <div className="content-title-section">
                                      <h6>{item.form_name}</h6>
                                      <h4>
                                        Created on:{' '}
                                        {moment(item.createdAt).format(
                                          'MM/DD/YYYY'
                                        )}
                                      </h4>
                                    </div>
                                    <div className="content-toogle">
                                      <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic1">
                                          <FontAwesomeIcon
                                            icon={faEllipsisVertical}
                                          />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item
                                            onClick={() => {
                                              navigate('/form/add', {
                                                state: { id: item.id },
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faPen} />{' '}
                                            Edit
                                          </Dropdown.Item>
                                          <Dropdown.Item href="#/action-2">
                                            <FontAwesomeIcon icon={faRemove} />{' '}
                                            Remove
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>

                          <Row>
                            <div className="col-lg-12">
                              <h2 className="page_title">General</h2>
                            </div>
                          </Row>
                          <Row>
                            {formData?.map((item) => {
                              return (
                                <Col lg={4}>
                                  <div className="forms-content create-other">
                                    <div className="content-icon-section">
                                      <img src="../img/orange_survey.png" />
                                    </div>
                                    <div className="content-title-section">
                                      <h6>{item.form_name}</h6>
                                      <h4>
                                        Created on:{' '}
                                        {moment(item.createdAt).format(
                                          'MM/DD/YYYY'
                                        )}
                                      </h4>
                                    </div>
                                    <div className="content-toogle">
                                      <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic1">
                                          <FontAwesomeIcon
                                            icon={faEllipsisVertical}
                                          />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item
                                            onClick={() => {
                                              navigate('/form/add', {
                                                state: { id: item.id },
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faPen} />{' '}
                                            Edit
                                          </Dropdown.Item>
                                          <Dropdown.Item href="#/action-2">
                                            <FontAwesomeIcon icon={faRemove} />{' '}
                                            Remove
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>
                        </div>
                      </Tab>
                      <Tab eventKey="profile" title="Forms History">
                        <div className="forms-content-section">
                          <Row>
                            <div className="col-lg-12">
                              <h2 className="page_title">Parent Forms</h2>
                            </div>
                          </Row>
                          <Row>
                            {formData?.map((item) => {
                              return (
                                <Col lg={4}>
                                  <div className="forms-content create-other">
                                    <div className="content-icon-section">
                                      <img src="../img/survey_icon.png" />
                                    </div>
                                    <div className="content-title-section">
                                      <h6>{item.form_name}</h6>
                                      <h4>
                                        Created on:{' '}
                                        {moment(item.createdAt).format(
                                          'MM/DD/YYYY'
                                        )}
                                      </h4>
                                    </div>
                                    <div className="content-toogle">
                                      <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic1">
                                          <FontAwesomeIcon
                                            icon={faEllipsisVertical}
                                          />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item
                                            onClick={() => {
                                              navigate('/form/add', {
                                                state: { id: item.id },
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faPen} />{' '}
                                            Edit
                                          </Dropdown.Item>
                                          <Dropdown.Item href="#/action-2">
                                            <FontAwesomeIcon icon={faRemove} />{' '}
                                            Remove
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>

                          <Row>
                            <div className="col-lg-12">
                              <h2 className="page_title">Talent Management</h2>
                            </div>
                          </Row>
                          <Row>
                            {formData?.map((item) => {
                              return (
                                <Col lg={4}>
                                  <div className="forms-content create-other">
                                    <div className="content-icon-section">
                                      <img src="../img/blue_survey.png" />
                                    </div>
                                    <div className="content-title-section">
                                      <h6>{item.form_name}</h6>
                                      <h4>
                                        Created on:{' '}
                                        {moment(item.createdAt).format(
                                          'MM/DD/YYYY'
                                        )}
                                      </h4>
                                    </div>
                                    <div className="content-toogle">
                                      <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic1">
                                          <FontAwesomeIcon
                                            icon={faEllipsisVertical}
                                          />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item
                                            onClick={() => {
                                              navigate('/form/add', {
                                                state: { id: item.id },
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faPen} />{' '}
                                            Edit
                                          </Dropdown.Item>
                                          <Dropdown.Item href="#/action-2">
                                            <FontAwesomeIcon icon={faRemove} />{' '}
                                            Remove
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>

                          <Row>
                            <div className="col-lg-12">
                              <h2 className="page_title">Child Care Forms</h2>
                            </div>
                          </Row>
                          <Row>
                            {formData?.map((item) => {
                              return (
                                <Col lg={4}>
                                  <div className="forms-content create-other">
                                    <div className="content-icon-section">
                                      <img src="../img/green_survey.png" />
                                    </div>
                                    <div className="content-title-section">
                                      <h6>{item.form_name}</h6>
                                      <h4>
                                        Created on:{' '}
                                        {moment(item.createdAt).format(
                                          'MM/DD/YYYY'
                                        )}
                                      </h4>
                                    </div>
                                    <div className="content-toogle">
                                      <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic1">
                                          <FontAwesomeIcon
                                            icon={faEllipsisVertical}
                                          />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item
                                            onClick={() => {
                                              navigate('/form/add', {
                                                state: { id: item.id },
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faPen} />{' '}
                                            Edit
                                          </Dropdown.Item>
                                          <Dropdown.Item href="#/action-2">
                                            <FontAwesomeIcon icon={faRemove} />{' '}
                                            Remove
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>

                          <Row>
                            <div className="col-lg-12">
                              <h2 className="page_title">
                                Business Operations
                              </h2>
                            </div>
                          </Row>
                          <Row>
                            {formData?.map((item) => {
                              return (
                                <Col lg={4}>
                                  <div className="forms-content create-other">
                                    <div className="content-icon-section">
                                      <img src="../img/dark_green_survey.png" />
                                    </div>
                                    <div className="content-title-section">
                                      <h6>{item.form_name}</h6>
                                      <h4>
                                        Created on:{' '}
                                        {moment(item.createdAt).format(
                                          'MM/DD/YYYY'
                                        )}
                                      </h4>
                                    </div>
                                    <div className="content-toogle">
                                      <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic1">
                                          <FontAwesomeIcon
                                            icon={faEllipsisVertical}
                                          />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item
                                            onClick={() => {
                                              navigate('/form/add', {
                                                state: { id: item.id },
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faPen} />{' '}
                                            Edit
                                          </Dropdown.Item>
                                          <Dropdown.Item href="#/action-2">
                                            <FontAwesomeIcon icon={faRemove} />{' '}
                                            Remove
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>

                          <Row>
                            <div className="col-lg-12">
                              <h2 className="page_title">Customer Service</h2>
                            </div>
                          </Row>
                          <Row>
                            {formData?.map((item) => {
                              return (
                                <Col lg={4}>
                                  <div className="forms-content create-other">
                                    <div className="content-icon-section">
                                      <img src="../img/gray_survey.png" />
                                    </div>
                                    <div className="content-title-section">
                                      <h6>{item.form_name}</h6>
                                      <h4>
                                        Created on:{' '}
                                        {moment(item.createdAt).format(
                                          'MM/DD/YYYY'
                                        )}
                                      </h4>
                                    </div>
                                    <div className="content-toogle">
                                      <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic1">
                                          <FontAwesomeIcon
                                            icon={faEllipsisVertical}
                                          />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item
                                            onClick={() => {
                                              navigate('/form/add', {
                                                state: { id: item.id },
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faPen} />{' '}
                                            Edit
                                          </Dropdown.Item>
                                          <Dropdown.Item href="#/action-2">
                                            <FontAwesomeIcon icon={faRemove} />{' '}
                                            Remove
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>

                          <Row>
                            <div className="col-lg-12">
                              <h2 className="page_title">
                                Governance & Compliance
                              </h2>
                            </div>
                          </Row>
                          <Row>
                            {formData?.map((item) => {
                              return (
                                <Col lg={4}>
                                  <div className="forms-content create-other">
                                    <div className="content-icon-section">
                                      <img src="../img/pink_survey.png" />
                                    </div>
                                    <div className="content-title-section">
                                      <h6>{item.form_name}</h6>
                                      <h4>
                                        Created on:{' '}
                                        {moment(item.createdAt).format(
                                          'MM/DD/YYYY'
                                        )}
                                      </h4>
                                    </div>
                                    <div className="content-toogle">
                                      <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic1">
                                          <FontAwesomeIcon
                                            icon={faEllipsisVertical}
                                          />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item
                                            onClick={() => {
                                              navigate('/form/add', {
                                                state: { id: item.id },
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faPen} />{' '}
                                            Edit
                                          </Dropdown.Item>
                                          <Dropdown.Item href="#/action-2">
                                            <FontAwesomeIcon icon={faRemove} />{' '}
                                            Remove
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>

                          <Row>
                            <div className="col-lg-12">
                              <h2 className="page_title">General</h2>
                            </div>
                          </Row>
                          <Row>
                            {formData?.map((item) => {
                              return (
                                <Col lg={4}>
                                  <div className="forms-content create-other">
                                    <div className="content-icon-section">
                                      <img src="../img/orange_survey.png" />
                                    </div>
                                    <div className="content-title-section">
                                      <h6>{item.form_name}</h6>
                                      <h4>
                                        Created on:{' '}
                                        {moment(item.createdAt).format(
                                          'MM/DD/YYYY'
                                        )}
                                      </h4>
                                    </div>
                                    <div className="content-toogle">
                                      <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic1">
                                          <FontAwesomeIcon
                                            icon={faEllipsisVertical}
                                          />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item
                                            onClick={() => {
                                              navigate('/form/add', {
                                                state: { id: item.id },
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faPen} />{' '}
                                            Edit
                                          </Dropdown.Item>
                                          <Dropdown.Item href="#/action-2">
                                            <FontAwesomeIcon icon={faRemove} />{' '}
                                            Remove
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })}
                          </Row>
                        </div>
                      </Tab>
                      <Tab eventKey="contact" title="Form Templates">
                        <div className="tab-created">
                          <Tabs
                            defaultActiveKey="profile"
                            id="uncontrolled-tab-example"
                            className="mb-3"
                          >
                            <Tab
                              className="create-me create_by_me_list"
                              eventKey="home"
                              title="Created by me"
                            >
                              <div className="forms-content-section">
                                <Row>
                                  <div className="col-lg-12">
                                    <h2 className="page_title">Parent Forms</h2>
                                  </div>
                                </Row>
                                <Row>
                                  {formData?.map((item) => {
                                    return (
                                      <Col lg={4}>
                                        <div className="forms-content create-other">
                                          <div className="content-icon-section">
                                            <img src="../img/survey_icon.png" />
                                          </div>
                                          <div className="content-title-section">
                                            <h6>{item.form_name}</h6>
                                            <h4>
                                              Created on:{' '}
                                              {moment(item.createdAt).format(
                                                'MM/DD/YYYY'
                                              )}
                                            </h4>
                                          </div>
                                          <div className="content-toogle">
                                            <div
                                              className="user-img"
                                              onClick={() => {
                                                setViewResponseFlag(true);
                                              }}
                                            >
                                              <img src="../img/form-user-round.svg" />
                                              <span>
                                                {item?.form_data?.length}
                                              </span>
                                            </div>
                                            <Dropdown>
                                              <Dropdown.Toggle id="dropdown-basic1">
                                                <FontAwesomeIcon
                                                  icon={faEllipsisVertical}
                                                />
                                              </Dropdown.Toggle>

                                              <Dropdown.Menu>
                                                <Dropdown.Item
                                                  onClick={() => {
                                                    navigate('/form/add', {
                                                      state: { id: item.id },
                                                    });
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPen}
                                                  />{' '}
                                                  Edit
                                                </Dropdown.Item>
                                                <Dropdown.Item href="#/action-2">
                                                  <FontAwesomeIcon
                                                    icon={faRemove}
                                                  />{' '}
                                                  Remove
                                                </Dropdown.Item>
                                              </Dropdown.Menu>
                                            </Dropdown>
                                          </div>
                                        </div>
                                      </Col>
                                    );
                                  })}
                                </Row>

                                <Row>
                                  <div className="col-lg-12">
                                    <h2 className="page_title">
                                      Talent Management
                                    </h2>
                                  </div>
                                </Row>
                                <Row>
                                  {formData?.map((item) => {
                                    return (
                                      <Col lg={4}>
                                        <div className="forms-content create-other">
                                          <div className="content-icon-section">
                                            <img src="../img/blue_survey.png" />
                                          </div>
                                          <div className="content-title-section">
                                            <h6>{item.form_name}</h6>
                                            <h4>
                                              Created on:{' '}
                                              {moment(item.createdAt).format(
                                                'MM/DD/YYYY'
                                              )}
                                            </h4>
                                          </div>
                                          <div className="content-toogle">
                                            <div
                                              className="user-img"
                                              onClick={() => {
                                                setViewResponseFlag(true);
                                              }}
                                            >
                                              <img src="../img/form-user-round.svg" />
                                              <span>
                                                {item?.form_data?.length}
                                              </span>
                                            </div>
                                            <Dropdown>
                                              <Dropdown.Toggle id="dropdown-basic1">
                                                <FontAwesomeIcon
                                                  icon={faEllipsisVertical}
                                                />
                                              </Dropdown.Toggle>

                                              <Dropdown.Menu>
                                                <Dropdown.Item
                                                  onClick={() => {
                                                    navigate('/form/add', {
                                                      state: { id: item.id },
                                                    });
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPen}
                                                  />{' '}
                                                  Edit
                                                </Dropdown.Item>
                                                <Dropdown.Item href="#/action-2">
                                                  <FontAwesomeIcon
                                                    icon={faRemove}
                                                  />{' '}
                                                  Remove
                                                </Dropdown.Item>
                                              </Dropdown.Menu>
                                            </Dropdown>
                                          </div>
                                        </div>
                                      </Col>
                                    );
                                  })}
                                </Row>

                                <Row>
                                  <div className="col-lg-12">
                                    <h2 className="page_title">
                                      Child Care Forms
                                    </h2>
                                  </div>
                                </Row>
                                <Row>
                                  {formData?.map((item) => {
                                    return (
                                      <Col lg={4}>
                                        <div className="forms-content create-other">
                                          <div className="content-icon-section">
                                            <img src="../img/green_survey.png" />
                                          </div>
                                          <div className="content-title-section">
                                            <h6>{item.form_name}</h6>
                                            <h4>
                                              Created on:{' '}
                                              {moment(item.createdAt).format(
                                                'MM/DD/YYYY'
                                              )}
                                            </h4>
                                          </div>
                                          <div className="content-toogle">
                                            <div
                                              className="user-img"
                                              onClick={() => {
                                                setViewResponseFlag(true);
                                              }}
                                            >
                                              <img src="../img/form-user-round.svg" />
                                              <span>
                                                {item?.form_data?.length}
                                              </span>
                                            </div>
                                            <Dropdown>
                                              <Dropdown.Toggle id="dropdown-basic1">
                                                <FontAwesomeIcon
                                                  icon={faEllipsisVertical}
                                                />
                                              </Dropdown.Toggle>

                                              <Dropdown.Menu>
                                                <Dropdown.Item
                                                  onClick={() => {
                                                    navigate('/form/add', {
                                                      state: { id: item.id },
                                                    });
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPen}
                                                  />{' '}
                                                  Edit
                                                </Dropdown.Item>
                                                <Dropdown.Item href="#/action-2">
                                                  <FontAwesomeIcon
                                                    icon={faRemove}
                                                  />{' '}
                                                  Remove
                                                </Dropdown.Item>
                                              </Dropdown.Menu>
                                            </Dropdown>
                                          </div>
                                        </div>
                                      </Col>
                                    );
                                  })}
                                </Row>

                                <Row>
                                  <div className="col-lg-12">
                                    <h2 className="page_title">
                                      Business Operations
                                    </h2>
                                  </div>
                                </Row>
                                <Row>
                                  {formData?.map((item) => {
                                    return (
                                      <Col lg={4}>
                                        <div className="forms-content create-other">
                                          <div className="content-icon-section">
                                            <img src="../img/dark_green_survey.png" />
                                          </div>
                                          <div className="content-title-section">
                                            <h6>{item.form_name}</h6>
                                            <h4>
                                              Created on:{' '}
                                              {moment(item.createdAt).format(
                                                'MM/DD/YYYY'
                                              )}
                                            </h4>
                                          </div>
                                          <div className="content-toogle">
                                            <div
                                              className="user-img"
                                              onClick={() => {
                                                setViewResponseFlag(true);
                                              }}
                                            >
                                              <img src="../img/form-user-round.svg" />
                                              <span>
                                                {item?.form_data?.length}
                                              </span>
                                            </div>
                                            <Dropdown>
                                              <Dropdown.Toggle id="dropdown-basic1">
                                                <FontAwesomeIcon
                                                  icon={faEllipsisVertical}
                                                />
                                              </Dropdown.Toggle>

                                              <Dropdown.Menu>
                                                <Dropdown.Item
                                                  onClick={() => {
                                                    navigate('/form/add', {
                                                      state: { id: item.id },
                                                    });
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPen}
                                                  />{' '}
                                                  Edit
                                                </Dropdown.Item>
                                                <Dropdown.Item href="#/action-2">
                                                  <FontAwesomeIcon
                                                    icon={faRemove}
                                                  />{' '}
                                                  Remove
                                                </Dropdown.Item>
                                              </Dropdown.Menu>
                                            </Dropdown>
                                          </div>
                                        </div>
                                      </Col>
                                    );
                                  })}
                                </Row>

                                <Row>
                                  <div className="col-lg-12">
                                    <h2 className="page_title">
                                      Customer Service
                                    </h2>
                                  </div>
                                </Row>
                                <Row>
                                  {formData?.map((item) => {
                                    return (
                                      <Col lg={4}>
                                        <div className="forms-content create-other">
                                          <div className="content-icon-section">
                                            <img src="../img/gray_survey.png" />
                                          </div>
                                          <div className="content-title-section">
                                            <h6>{item.form_name}</h6>
                                            <h4>
                                              Created on:{' '}
                                              {moment(item.createdAt).format(
                                                'MM/DD/YYYY'
                                              )}
                                            </h4>
                                          </div>
                                          <div className="content-toogle">
                                            <div
                                              className="user-img"
                                              onClick={() => {
                                                setViewResponseFlag(true);
                                              }}
                                            >
                                              <img src="../img/form-user-round.svg" />
                                              <span>
                                                {item?.form_data?.length}
                                              </span>
                                            </div>
                                            <Dropdown>
                                              <Dropdown.Toggle id="dropdown-basic1">
                                                <FontAwesomeIcon
                                                  icon={faEllipsisVertical}
                                                />
                                              </Dropdown.Toggle>

                                              <Dropdown.Menu>
                                                <Dropdown.Item
                                                  onClick={() => {
                                                    navigate('/form/add', {
                                                      state: { id: item.id },
                                                    });
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPen}
                                                  />{' '}
                                                  Edit
                                                </Dropdown.Item>
                                                <Dropdown.Item href="#/action-2">
                                                  <FontAwesomeIcon
                                                    icon={faRemove}
                                                  />{' '}
                                                  Remove
                                                </Dropdown.Item>
                                              </Dropdown.Menu>
                                            </Dropdown>
                                          </div>
                                        </div>
                                      </Col>
                                    );
                                  })}
                                </Row>

                                <Row>
                                  <div className="col-lg-12">
                                    <h2 className="page_title">
                                      Governance & Compliance
                                    </h2>
                                  </div>
                                </Row>
                                <Row>
                                  {formData?.map((item) => {
                                    return (
                                      <Col lg={4}>
                                        <div className="forms-content create-other">
                                          <div className="content-icon-section">
                                            <img src="../img/pink_survey.png" />
                                          </div>
                                          <div className="content-title-section">
                                            <h6>{item.form_name}</h6>
                                            <h4>
                                              Created on:{' '}
                                              {moment(item.createdAt).format(
                                                'MM/DD/YYYY'
                                              )}
                                            </h4>
                                          </div>
                                          <div className="content-toogle">
                                            <div
                                              className="user-img"
                                              onClick={() => {
                                                setViewResponseFlag(true);
                                              }}
                                            >
                                              <img src="../img/form-user-round.svg" />
                                              <span>
                                                {item?.form_data?.length}
                                              </span>
                                            </div>
                                            <Dropdown>
                                              <Dropdown.Toggle id="dropdown-basic1">
                                                <FontAwesomeIcon
                                                  icon={faEllipsisVertical}
                                                />
                                              </Dropdown.Toggle>

                                              <Dropdown.Menu>
                                                <Dropdown.Item
                                                  onClick={() => {
                                                    navigate('/form/add', {
                                                      state: { id: item.id },
                                                    });
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPen}
                                                  />{' '}
                                                  Edit
                                                </Dropdown.Item>
                                                <Dropdown.Item href="#/action-2">
                                                  <FontAwesomeIcon
                                                    icon={faRemove}
                                                  />{' '}
                                                  Remove
                                                </Dropdown.Item>
                                              </Dropdown.Menu>
                                            </Dropdown>
                                          </div>
                                        </div>
                                      </Col>
                                    );
                                  })}
                                </Row>

                                <Row>
                                  <div className="col-lg-12">
                                    <h2 className="page_title">General</h2>
                                  </div>
                                </Row>
                                <Row>
                                  {formData?.map((item) => {
                                    return (
                                      <Col lg={4}>
                                        <div className="forms-content create-other">
                                          <div className="content-icon-section">
                                            <img src="../img/orange_survey.png" />
                                          </div>
                                          <div className="content-title-section">
                                            <h6>{item.form_name}</h6>
                                            <h4>
                                              Created on:{' '}
                                              {moment(item.createdAt).format(
                                                'MM/DD/YYYY'
                                              )}
                                            </h4>
                                          </div>
                                          <div className="content-toogle">
                                            <div
                                              className="user-img"
                                              onClick={() => {
                                                setViewResponseFlag(true);
                                              }}
                                            >
                                              <img src="../img/form-user-round.svg" />
                                              <span>
                                                {item?.form_data?.length}
                                              </span>
                                            </div>
                                            <Dropdown>
                                              <Dropdown.Toggle id="dropdown-basic1">
                                                <FontAwesomeIcon
                                                  icon={faEllipsisVertical}
                                                />
                                              </Dropdown.Toggle>

                                              <Dropdown.Menu>
                                                <Dropdown.Item
                                                  onClick={() => {
                                                    navigate('/form/add', {
                                                      state: { id: item.id },
                                                    });
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPen}
                                                  />{' '}
                                                  Edit
                                                </Dropdown.Item>
                                                <Dropdown.Item href="#/action-2">
                                                  <FontAwesomeIcon
                                                    icon={faRemove}
                                                  />{' '}
                                                  Remove
                                                </Dropdown.Item>
                                              </Dropdown.Menu>
                                            </Dropdown>
                                          </div>
                                        </div>
                                      </Col>
                                    );
                                  })}
                                </Row>
                              </div>
                            </Tab>
                            <Tab
                              className="create-me"
                              eventKey="profile"
                              title="Created by others"
                            >
                              <div className="forms-content-section">
                                <Row>
                                  <div className="col-lg-12">
                                    <h2 className="page_title">Parent Forms</h2>
                                  </div>
                                </Row>
                                <Row>
                                  {formData?.map((item) => {
                                    return (
                                      <Col lg={4}>
                                        <div className="forms-content">
                                          <div className="create-other">
                                            <div className="content-icon-section">
                                              <img src="../img/survey_icon.png" />
                                            </div>
                                            <div className="content-title-section">
                                              <h6>{item.form_name}</h6>
                                              <h4>
                                                Created on:{' '}
                                                {moment(item.createdAt).format(
                                                  'MM/DD/YYYY'
                                                )}
                                              </h4>
                                            </div>
                                            <div className="content-toogle">
                                              <div
                                                className="user-img"
                                                onClick={() => {
                                                  setViewResponseFlag(true);
                                                }}
                                              >
                                                <img src="../img/form-user-round.svg" />
                                                <span>
                                                  {item?.form_data?.length}
                                                </span>
                                              </div>
                                              <Dropdown>
                                                <Dropdown.Toggle id="dropdown-basic1">
                                                  <FontAwesomeIcon
                                                    icon={faEllipsisVertical}
                                                  />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                  <Dropdown.Item
                                                    onClick={() => {
                                                      navigate('/form/add', {
                                                        state: { id: item.id },
                                                      });
                                                    }}
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faPen}
                                                    />{' '}
                                                    Edit
                                                  </Dropdown.Item>
                                                  <Dropdown.Item href="#/action-2">
                                                    <FontAwesomeIcon
                                                      icon={faRemove}
                                                    />{' '}
                                                    Remove
                                                  </Dropdown.Item>
                                                </Dropdown.Menu>
                                              </Dropdown>
                                            </div>
                                          </div>
                                          <div className="create-by">
                                            <div className="create-by-heading">
                                              {' '}
                                              <h5>Created by:</h5>{' '}
                                            </div>
                                            <div className="user-img-other">
                                              <img src="../../img/user-other.svg"></img>
                                            </div>
                                            <div className="user-name-other">
                                              <p>James Smith,</p>
                                              <span>Co-ordinator</span>
                                            </div>
                                          </div>
                                        </div>
                                      </Col>
                                    );
                                  })}
                                </Row>

                                <Row>
                                  <div className="col-lg-12">
                                    <h2 className="page_title">
                                      Talent Management
                                    </h2>
                                  </div>
                                </Row>
                                <Row>
                                  {formData?.map((item) => {
                                    return (
                                      <Col lg={4}>
                                        <div className="forms-content">
                                          <div className="create-other">
                                            <div className="content-icon-section">
                                              <img src="../img/blue_survey.png" />
                                            </div>
                                            <div className="content-title-section">
                                              <h6>{item.form_name}</h6>
                                              <h4>
                                                Created on:{' '}
                                                {moment(item.createdAt).format(
                                                  'MM/DD/YYYY'
                                                )}
                                              </h4>
                                            </div>
                                            <div className="content-toogle">
                                              <div
                                                className="user-img"
                                                onClick={() => {
                                                  setViewResponseFlag(true);
                                                }}
                                              >
                                                <img src="../img/form-user-round.svg" />
                                                <span>
                                                  {item?.form_data?.length}
                                                </span>
                                              </div>
                                              <Dropdown>
                                                <Dropdown.Toggle id="dropdown-basic1">
                                                  <FontAwesomeIcon
                                                    icon={faEllipsisVertical}
                                                  />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                  <Dropdown.Item
                                                    onClick={() => {
                                                      navigate('/form/add', {
                                                        state: { id: item.id },
                                                      });
                                                    }}
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faPen}
                                                    />{' '}
                                                    Edit
                                                  </Dropdown.Item>
                                                  <Dropdown.Item href="#/action-2">
                                                    <FontAwesomeIcon
                                                      icon={faRemove}
                                                    />{' '}
                                                    Remove
                                                  </Dropdown.Item>
                                                </Dropdown.Menu>
                                              </Dropdown>
                                            </div>
                                          </div>
                                          <div className="create-by">
                                            <div className="create-by-heading">
                                              {' '}
                                              <h5>Created by:</h5>{' '}
                                            </div>
                                            <div className="user-img-other">
                                              <img src="../../img/user-other.svg"></img>
                                            </div>
                                            <div className="user-name-other">
                                              <p>James Smith,</p>
                                              <span>Co-ordinator</span>
                                            </div>
                                          </div>
                                        </div>
                                      </Col>
                                    );
                                  })}
                                </Row>

                                <Row>
                                  <div className="col-lg-12">
                                    <h2 className="page_title">
                                      Child Care Forms
                                    </h2>
                                  </div>
                                </Row>
                                <Row>
                                  {formData?.map((item) => {
                                    return (
                                      <Col lg={4}>
                                        <div className="forms-content">
                                          <div className="create-other">
                                            <div className="content-icon-section">
                                              <img src="../img/green_survey.png" />
                                            </div>
                                            <div className="content-title-section">
                                              <h6>{item.form_name}</h6>
                                              <h4>
                                                Created on:{' '}
                                                {moment(item.createdAt).format(
                                                  'MM/DD/YYYY'
                                                )}
                                              </h4>
                                            </div>
                                            <div className="content-toogle">
                                              <div
                                                className="user-img"
                                                onClick={() => {
                                                  setViewResponseFlag(true);
                                                }}
                                              >
                                                <img src="../img/form-user-round.svg" />
                                                <span>
                                                  {item?.form_data?.length}
                                                </span>
                                              </div>
                                              <Dropdown>
                                                <Dropdown.Toggle id="dropdown-basic1">
                                                  <FontAwesomeIcon
                                                    icon={faEllipsisVertical}
                                                  />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                  <Dropdown.Item
                                                    onClick={() => {
                                                      navigate('/form/add', {
                                                        state: { id: item.id },
                                                      });
                                                    }}
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faPen}
                                                    />{' '}
                                                    Edit
                                                  </Dropdown.Item>
                                                  <Dropdown.Item href="#/action-2">
                                                    <FontAwesomeIcon
                                                      icon={faRemove}
                                                    />{' '}
                                                    Remove
                                                  </Dropdown.Item>
                                                </Dropdown.Menu>
                                              </Dropdown>
                                            </div>
                                          </div>
                                          <div className="create-by">
                                            <div className="create-by-heading">
                                              {' '}
                                              <h5>Created by:</h5>{' '}
                                            </div>
                                            <div className="user-img-other">
                                              <img src="../../img/user-other.svg"></img>
                                            </div>
                                            <div className="user-name-other">
                                              <p>James Smith,</p>
                                              <span>Co-ordinator</span>
                                            </div>
                                          </div>
                                        </div>
                                      </Col>
                                    );
                                  })}
                                </Row>

                                <Row>
                                  <div className="col-lg-12">
                                    <h2 className="page_title">
                                      Business Operations
                                    </h2>
                                  </div>
                                </Row>
                                <Row>
                                  {formData?.map((item) => {
                                    return (
                                      <Col lg={4}>
                                        <div className="forms-content">
                                          <div className="create-other">
                                            <div className="content-icon-section">
                                              <img src="../img/dark_green_survey.png" />
                                            </div>
                                            <div className="content-title-section">
                                              <h6>{item.form_name}</h6>
                                              <h4>
                                                Created on:{' '}
                                                {moment(item.createdAt).format(
                                                  'MM/DD/YYYY'
                                                )}
                                              </h4>
                                            </div>
                                            <div className="content-toogle">
                                              <div
                                                className="user-img"
                                                onClick={() => {
                                                  setViewResponseFlag(true);
                                                }}
                                              >
                                                <img src="../img/form-user-round.svg" />
                                                <span>
                                                  {item?.form_data?.length}
                                                </span>
                                              </div>
                                              <Dropdown>
                                                <Dropdown.Toggle id="dropdown-basic1">
                                                  <FontAwesomeIcon
                                                    icon={faEllipsisVertical}
                                                  />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                  <Dropdown.Item
                                                    onClick={() => {
                                                      navigate('/form/add', {
                                                        state: { id: item.id },
                                                      });
                                                    }}
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faPen}
                                                    />{' '}
                                                    Edit
                                                  </Dropdown.Item>
                                                  <Dropdown.Item href="#/action-2">
                                                    <FontAwesomeIcon
                                                      icon={faRemove}
                                                    />{' '}
                                                    Remove
                                                  </Dropdown.Item>
                                                </Dropdown.Menu>
                                              </Dropdown>
                                            </div>
                                          </div>
                                          <div className="create-by">
                                            <div className="create-by-heading">
                                              {' '}
                                              <h5>Created by:</h5>{' '}
                                            </div>
                                            <div className="user-img-other">
                                              <img src="../../img/user-other.svg"></img>
                                            </div>
                                            <div className="user-name-other">
                                              <p>James Smith,</p>
                                              <span>Co-ordinator</span>
                                            </div>
                                          </div>
                                        </div>
                                      </Col>
                                    );
                                  })}
                                </Row>

                                <Row>
                                  <div className="col-lg-12">
                                    <h2 className="page_title">
                                      Customer Service
                                    </h2>
                                  </div>
                                </Row>
                                <Row>
                                  {formData?.map((item) => {
                                    return (
                                      <Col lg={4}>
                                        <div className="forms-content">
                                          <div className="create-other">
                                            <div className="content-icon-section">
                                              <img src="../img/gray_survey.png" />
                                            </div>
                                            <div className="content-title-section">
                                              <h6>{item.form_name}</h6>
                                              <h4>
                                                Created on:{' '}
                                                {moment(item.createdAt).format(
                                                  'MM/DD/YYYY'
                                                )}
                                              </h4>
                                            </div>
                                            <div className="content-toogle">
                                              <div
                                                className="user-img"
                                                onClick={() => {
                                                  setViewResponseFlag(true);
                                                }}
                                              >
                                                <img src="../img/form-user-round.svg" />
                                                <span>
                                                  {item?.form_data?.length}
                                                </span>
                                              </div>
                                              <Dropdown>
                                                <Dropdown.Toggle id="dropdown-basic1">
                                                  <FontAwesomeIcon
                                                    icon={faEllipsisVertical}
                                                  />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                  <Dropdown.Item
                                                    onClick={() => {
                                                      navigate('/form/add', {
                                                        state: { id: item.id },
                                                      });
                                                    }}
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faPen}
                                                    />{' '}
                                                    Edit
                                                  </Dropdown.Item>
                                                  <Dropdown.Item href="#/action-2">
                                                    <FontAwesomeIcon
                                                      icon={faRemove}
                                                    />{' '}
                                                    Remove
                                                  </Dropdown.Item>
                                                </Dropdown.Menu>
                                              </Dropdown>
                                            </div>
                                          </div>
                                          <div className="create-by">
                                            <div className="create-by-heading">
                                              {' '}
                                              <h5>Created by:</h5>{' '}
                                            </div>
                                            <div className="user-img-other">
                                              <img src="../../img/user-other.svg"></img>
                                            </div>
                                            <div className="user-name-other">
                                              <p>James Smith,</p>
                                              <span>Co-ordinator</span>
                                            </div>
                                          </div>
                                        </div>
                                      </Col>
                                    );
                                  })}
                                </Row>

                                <Row>
                                  <div className="col-lg-12">
                                    <h2 className="page_title">
                                      Governance & Compliance
                                    </h2>
                                  </div>
                                </Row>
                                <Row>
                                  {formData?.map((item) => {
                                    return (
                                      <Col lg={4}>
                                        <div className="forms-content">
                                          <div className="create-other">
                                            <div className="content-icon-section">
                                              <img src="../img/pink_survey.png" />
                                            </div>
                                            <div className="content-title-section">
                                              <h6>{item.form_name}</h6>
                                              <h4>
                                                Created on:{' '}
                                                {moment(item.createdAt).format(
                                                  'MM/DD/YYYY'
                                                )}
                                              </h4>
                                            </div>
                                            <div className="content-toogle">
                                              <div
                                                className="user-img"
                                                onClick={() => {
                                                  setViewResponseFlag(true);
                                                }}
                                              >
                                                <img src="../img/form-user-round.svg" />
                                                <span>
                                                  {item?.form_data?.length}
                                                </span>
                                              </div>
                                              <Dropdown>
                                                <Dropdown.Toggle id="dropdown-basic1">
                                                  <FontAwesomeIcon
                                                    icon={faEllipsisVertical}
                                                  />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                  <Dropdown.Item
                                                    onClick={() => {
                                                      navigate('/form/add', {
                                                        state: { id: item.id },
                                                      });
                                                    }}
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faPen}
                                                    />{' '}
                                                    Edit
                                                  </Dropdown.Item>
                                                  <Dropdown.Item href="#/action-2">
                                                    <FontAwesomeIcon
                                                      icon={faRemove}
                                                    />{' '}
                                                    Remove
                                                  </Dropdown.Item>
                                                </Dropdown.Menu>
                                              </Dropdown>
                                            </div>
                                          </div>
                                          <div className="create-by">
                                            <div className="create-by-heading">
                                              {' '}
                                              <h5>Created by:</h5>{' '}
                                            </div>
                                            <div className="user-img-other">
                                              <img src="../../img/user-other.svg"></img>
                                            </div>
                                            <div className="user-name-other">
                                              <p>James Smith,</p>
                                              <span>Co-ordinator</span>
                                            </div>
                                          </div>
                                        </div>
                                      </Col>
                                    );
                                  })}
                                </Row>

                                <Row>
                                  <div className="col-lg-12">
                                    <h2 className="page_title">General</h2>
                                  </div>
                                </Row>
                                <Row>
                                  {formData?.map((item) => {
                                    return (
                                      <Col lg={4}>
                                        <div className="forms-content">
                                          <div className="create-other">
                                            <div className="content-icon-section">
                                              <img src="../img/orange_survey.png" />
                                            </div>
                                            <div className="content-title-section">
                                              <h6>{item.form_name}</h6>
                                              <h4>
                                                Created on:{' '}
                                                {moment(item.createdAt).format(
                                                  'MM/DD/YYYY'
                                                )}
                                              </h4>
                                            </div>
                                            <div className="content-toogle">
                                              <div
                                                className="user-img"
                                                onClick={() => {
                                                  setViewResponseFlag(true);
                                                }}
                                              >
                                                <img src="../img/form-user-round.svg" />
                                                <span>
                                                  {item?.form_data?.length}
                                                </span>
                                              </div>
                                              <Dropdown>
                                                <Dropdown.Toggle id="dropdown-basic1">
                                                  <FontAwesomeIcon
                                                    icon={faEllipsisVertical}
                                                  />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                  <Dropdown.Item
                                                    onClick={() => {
                                                      navigate('/form/add', {
                                                        state: { id: item.id },
                                                      });
                                                    }}
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faPen}
                                                    />{' '}
                                                    Edit
                                                  </Dropdown.Item>
                                                  <Dropdown.Item href="#/action-2">
                                                    <FontAwesomeIcon
                                                      icon={faRemove}
                                                    />{' '}
                                                    Remove
                                                  </Dropdown.Item>
                                                </Dropdown.Menu>
                                              </Dropdown>
                                            </div>
                                          </div>
                                          <div className="create-by">
                                            <div className="create-by-heading">
                                              {' '}
                                              <h5>Created by:</h5>{' '}
                                            </div>
                                            <div className="user-img-other">
                                              <img src="../../img/user-other.svg"></img>
                                            </div>
                                            <div className="user-name-other">
                                              <p>James Smith,</p>
                                              <span>Co-ordinator</span>
                                            </div>
                                          </div>
                                        </div>
                                      </Col>
                                    );
                                  })}
                                </Row>
                              </div>
                            </Tab>
                          </Tabs>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
      <Modal
        className="responses_model"
        show={viewResponseFlag}
        onHide={() => {
          setViewResponseFlag(false);
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <img src="../img/survey.png" />
            <h1>Form Responses</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="user_list_wrp">
            <div className="table_head">
              <div className="user_box">
                <div className="user_name">Name</div>
                <div className="user_role">User Role</div>
              </div>
            </div>
            <div className="table_body">
              <div className="user_box">
                <div className="user_name">
                  <div className="user_profile">
                    <img src="../img/user_img.png" alt="" />
                    <h4>James Smith</h4>
                  </div>
                </div>
                <div className="user_role">
                  <div className="user_detail">
                    <h4>Educator</h4>
                    <button>View Reponse</button>
                  </div>
                </div>
              </div>
              <div className="user_box">
                <div className="user_name">
                  <div className="user_profile">
                    <img src="../img/user_img.png" alt="" />
                    <h4>James Smith</h4>
                  </div>
                </div>
                <div className="user_role">
                  <div className="user_detail">
                    <h4>Educator</h4>
                    <button>View Response</button>
                  </div>
                </div>
              </div>
              <div className="user_box">
                <div className="user_name">
                  <div className="user_profile">
                    <img src="../img/user_img.png" alt="" />
                    <h4>James Smith</h4>
                  </div>
                </div>
                <div className="user_role">
                  <div className="user_detail">
                    <h4>Educator</h4>
                    <button>View Response</button>
                  </div>
                </div>
              </div>
              <div className="user_box">
                <div className="user_name">
                  <div className="user_profile">
                    <img src="../img/user_img.png" alt="" />
                    <h4>James Smith</h4>
                  </div>
                </div>
                <div className="user_role">
                  <div className="user_detail">
                    <h4>Educator</h4>
                    <button>View Response</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ViewFormBuilder;
