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
  const [Index, setIndex] = useState(0);
  const [innerIndex, setInnerIndex] = useState(0);
  const [MeFormData, setMeFormData] = useState([]);
  const [OthersFormData, setOthersFormData] = useState([]);
  const [key, setKey] = useState('created-by-me');
  let hrFlag = false;
  useEffect(() => {
    getFormData('');
  }, []);
  const deleteForm = (id) => {
    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
    };

    fetch(
      `${BASE_URL}/form/${id}?user_id=${localStorage.getItem('user_id')}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        alert(result?.message);
        getFormData('');
      })
      .catch((error) => console.log('error', error));
  };
  const getFormData = (search) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `${BASE_URL}/form?search=${search}&id=${localStorage.getItem(
        'user_id'
      )}&role=${localStorage.getItem(
        'user_role'
      )}&franchisee_id=${localStorage.getItem('franchisee_id')}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setFormData(result?.result);
        let me = [];
        let others = [];
        result?.result.map((item, index) => {
          console.log('item--->', item);
          me.push(item);
          others.push(item);
          me.forms = [];
          others.forms = [];

          item?.forms?.map((inner_item) => {
            if (
              inner_item.created_by ===
              parseInt(localStorage.getItem('user_id'))
            ) {
              console.log('if', inner_item);
              me.forms.push(inner_item);
            } else {
              console.log('else', inner_item);
              others.forms.push(inner_item);
            }
          });
          console.log('me.forms--->', me.forms);
          if (me.forms.length === 0) {
            delete me[index];
          }
          console.log('others.forms.length---->', others.forms);
          if (others.forms.length === 0) {
            delete others[index];
          }
        });
        console.log('me--->', me);
        console.log('others--->', others);
        setMeFormData(me);
        setOthersFormData(others);
      })
      .catch((error) => console.log('error', error));
  };
  const seenFormResponse = (data) => {
    console.log('data--->RESPONSE', data);
    let seenData = [];
    data?.map((item) => {
      item?.map((inner_item) => {
        seenData.push({
          id: inner_item.id,
          user_id: localStorage.getItem('user_id'),
        });
      });
    });
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(seenData),
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/form/response/seen`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result?.message))
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
                      {/* <div className="forms-filter">
                        <Button variant="outline-primary">
                          <img src="../img/Vector.svg" />
                          Add Filters
                        </Button>
                      </div> */}
                      {(localStorage.getItem('user_role') ===
                        'franchisee_admin' ||
                        localStorage.getItem('user_role') ===
                          'franchisor_admin') && (
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
                      )}
                      {/* <div className="forms-toogle">
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
                      </div> */}
                    </div>
                  </div>
                  <div className="tab-section">
                    <Tabs
                      defaultActiveKey="forms-to-complete"
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab
                        eventKey="forms-to-complete"
                        title="Forms to complete"
                      >
                        <div className="forms-content-section">
                          {formData?.map((item) => {
                            return (
                              <>
                                {/* <Row>
                                  <Col lg={12}>
                                    <h2 className="page_title">
                                      {item.category}
                                    </h2>
                                  </Col>
                                </Row> */}
                                <Row>
                                  {item?.forms?.map(
                                    (inner_item, inner_index) => {
                                      {console.log("inner_item--->",inner_item.form_filled_user)}
                                      return inner_item.end_date &&
                                      !((inner_item?.form_filled_user || []).includes(
                                        localStorage.getItem('user_id')
                                      )) 
                                      &&
                                      (
                                        (inner_item.form_permissions[0]?.fill_access_users || []).includes(
                                        localStorage.getItem('user_role')) ||
                                        (inner_item.form_permissions[0]?.fill_access_users || []).includes(
                                            localStorage.getItem('user_id')) ||
                                        (inner_item.upper_role || []).includes(localStorage.getItem('user_role')) ||
                                          inner_item.created_by===parseInt(localStorage.getItem('user_id')) ||
                                          localStorage.getItem('user_role')==="franchisor_admin"
                                          
                                      )
                                         ? (
                                        <>
                                          {console.log('Hello--->', inner_item)}
                                          {/* {(hrFlag = true)} */}
                                          {inner_index === 0 && (
                                            <Row>
                                              <Col lg={12}>
                                                <h2 className="page_title">
                                                  {item.category}
                                                </h2>
                                              </Col>
                                            </Row>
                                          )}
                                          <Col lg={4}>
                                            <div className="forms-content create-other">
                                              <div
                                                className="content-icon-section"
                                                onClick={() => {
                                                  navigate(
                                                    `/form/dynamic/${inner_item.form_name}`
                                                  );
                                                }}
                                              >
                                                <img
                                                  src={
                                                    item.category ===
                                                    'Parent Forms'
                                                      ? '../img/survey_icon.png'
                                                      : item.category ===
                                                        'Talent Management'
                                                      ? '../img/blue_survey.png'
                                                      : item.category ===
                                                        'Child Care Forms'
                                                      ? '../img/green_survey.png'
                                                      : item.category ===
                                                        'Business Operations'
                                                      ? '../img/dark_green_survey.png'
                                                      : item.category ===
                                                        'Customer Service'
                                                      ? '../img/gray_survey.png'
                                                      : item.category ===
                                                        'Governance & Compliance'
                                                      ? '../img/pink_survey.png'
                                                      : item.category ===
                                                        'General'
                                                      ? '../img/orange_survey.png'
                                                      : '../img/survey_icon.png'
                                                  }
                                                />
                                              </div>
                                              <div
                                                className="content-title-section"
                                                onClick={() => {
                                                  navigate(
                                                    `/form/dynamic/${inner_item.form_name}`
                                                  );
                                                }}
                                              >
                                                <h6>{inner_item.form_name}</h6>
                                                <h4 className="due_date">
                                                  Due on:{' '}
                                                  {moment(
                                                    inner_item.end_date
                                                  ).format('DD/MM/YYYY')}
                                                </h4>
                                              </div>
                                              {/* <div className="content-toogle">
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
                                                          state: {
                                                            id: inner_item.id,
                                                          },
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
                                              </div> */}
                                            </div>
                                          </Col>
                                        </>
                                      ) : null;
                                    }
                                  )}
                                </Row>
                                {/* {hrFlag && <hr className="date-line"></hr>} */}
                                <Row>
                                  {item?.forms?.map(
                                    (inner_item, inner_index) => {
                                     return inner_item.end_date === null &&
                                        !((inner_item?.form_filled_user || []).includes(
                                          localStorage.getItem('user_id')
                                        )) 
                                        &&
                                        (
                                          (inner_item.form_permissions[0]?.fill_access_users || []).includes(
                                          localStorage.getItem('user_role')) ||
                                          (inner_item.form_permissions[0]?.fill_access_users || []).includes(
                                              localStorage.getItem('user_id')) ||
                                          (inner_item.upper_role || []).includes(localStorage.getItem('user_role')) ||
                                            inner_item.created_by===parseInt(localStorage.getItem('user_id')) ||
                                            localStorage.getItem('user_role')==="franchisor_admin"
                                            
                                        )
                                         ? (
                                        <>
                                          {inner_index === 0 && (
                                            <Row>
                                              <Col lg={12}>
                                                <h2 className="page_title">
                                                  {item.category}
                                                </h2>
                                              </Col>
                                            </Row>
                                          )}
                                          <Col lg={4}>
                                            {(hrFlag = false)}
                                            {console.log(
                                              'inner_item?.end_date---->ELSE',
                                              inner_item?.end_date,
                                              '------',
                                              inner_item
                                            )}
                                            <div className="forms-content create-other">
                                              <div
                                                className="content-icon-section"
                                                onClick={() => {
                                                  navigate(
                                                    `/form/dynamic/${inner_item.form_name}`
                                                  );
                                                }}
                                              >
                                                <img
                                                  src={
                                                    item.category ===
                                                    'Parent Forms'
                                                      ? '../img/survey_icon.png'
                                                      : item.category ===
                                                        'Talent Management'
                                                      ? '../img/blue_survey.png'
                                                      : item.category ===
                                                        'Child Care Forms'
                                                      ? '../img/green_survey.png'
                                                      : item.category ===
                                                        'Business Operations'
                                                      ? '../img/dark_green_survey.png'
                                                      : item.category ===
                                                        'Customer Service'
                                                      ? '../img/gray_survey.png'
                                                      : item.category ===
                                                        'Governance & Compliance'
                                                      ? '../img/pink_survey.png'
                                                      : item.category ===
                                                        'General'
                                                      ? '../img/orange_survey.png'
                                                      : '../img/survey_icon.png'
                                                  }
                                                />
                                              </div>
                                              <div
                                                className="content-title-section"
                                                onClick={() => {
                                                  navigate(
                                                    `/form/dynamic/${inner_item.form_name}`
                                                  );
                                                }}
                                              >
                                                <h6>{inner_item.form_name}</h6>
                                                <h4>
                                                  Created on:{' '}
                                                  {moment(
                                                    inner_item.createdAt
                                                  ).format('DD/MM/YYYY')}
                                                </h4>
                                              </div>
                                              {/* <div className="content-toogle">
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
                                                          state: {
                                                            id: inner_item.id,
                                                          },
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
                                              </div> */}
                                            </div>
                                          </Col>
                                        </>
                                      ) : null;
                                    }
                                  )}
                                </Row>
                              </>
                            );
                          })}
                        </div>
                      </Tab>
                      <Tab eventKey="forms-history" title="Forms History">
                        <div className="forms-content-section">
                          {formData?.map((item) => {
                            return (
                              <>
                                <Row>
                                  {item?.forms?.map(
                                    (inner_item, inner_index) => {
                                      return (inner_item?.form_filled_user || []).includes(
                                        localStorage.getItem('user_id')
                                      )
                                      &&
                                      (
                                        (inner_item.form_permissions[0]?.fill_access_users || []).includes(
                                        localStorage.getItem('user_role')) ||
                                        (inner_item.form_permissions[0]?.fill_access_users || []).includes(
                                            localStorage.getItem('user_id')) ||
                                        (inner_item.upper_role || []).includes(localStorage.getItem('user_role')) ||
                                          inner_item.created_by===parseInt(localStorage.getItem('user_id')) ||
                                          localStorage.getItem('user_role')==="franchisor_admin"
                                          
                                      ) ? (
                                        <>
                                          {inner_index === 0 && (
                                            <Row>
                                              <div className="col-lg-12">
                                                <h2 className="page_title">
                                                  {item.category}
                                                </h2>
                                              </div>
                                            </Row>
                                          )}
                                          <Col lg={4}>
                                            <div className="forms-content create-other">
                                              <div
                                                className="content-icon-section"
                                                onClick={() => {
                                                  navigate('/form/response', {
                                                    state: {
                                                      id: inner_item.id,
                                                    },
                                                  });
                                                }}
                                              >
                                                <img
                                                  src={
                                                    item.category ===
                                                    'Parent Forms'
                                                      ? '../img/survey_icon.png'
                                                      : item.category ===
                                                        'Talent Management'
                                                      ? '../img/blue_survey.png'
                                                      : item.category ===
                                                        'Child Care Forms'
                                                      ? '../img/green_survey.png'
                                                      : item.category ===
                                                        'Business Operations'
                                                      ? '../img/dark_green_survey.png'
                                                      : item.category ===
                                                        'Customer Service'
                                                      ? '../img/gray_survey.png'
                                                      : item.category ===
                                                        'Governance & Compliance'
                                                      ? '../img/pink_survey.png'
                                                      : item.category ===
                                                        'General'
                                                      ? '../img/orange_survey.png'
                                                      : '../img/survey_icon.png'
                                                  }
                                                />
                                              </div>
                                              <div
                                                className="content-title-section"
                                                onClick={() => {
                                                  navigate('/form/response', {
                                                    state: {
                                                      id: inner_item.id,
                                                    },
                                                  });
                                                }}
                                              >
                                                <h6>{inner_item.form_name}</h6>
                                                <h4>
                                                  Created on:{' '}
                                                  {moment(
                                                    inner_item.createdAt
                                                  ).format('DD/MM/YYYY')}
                                                </h4>
                                              </div>
                                              {/* {inner_item.form_type!=="single_submission" && ( */}
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
                                                        navigate(
                                                          `/form/dynamic/${inner_item.form_name}`
                                                        );
                                                      }}
                                                    >
                                                      <FontAwesomeIcon
                                                        icon={faPen}
                                                      />{' '}
                                                      Add Response
                                                    </Dropdown.Item>
                                                  </Dropdown.Menu>
                                                </Dropdown>
                                              </div>
                                              {/* )} */}
                                            </div>
                                          </Col>
                                        </>
                                      ) : null;
                                    }
                                  )}
                                </Row>
                              </>
                            );
                          })}
                        </div>
                      </Tab>
                      {(localStorage.getItem('user_role') ===
                        'franchisee_admin' ||
                        localStorage.getItem('user_role') ===
                          'franchisor_admin') && (
                        <Tab eventKey="form-templates" title="Form Templates">
                          <div className="tab-created">
                            <Tabs
                              defaultActiveKey={key}
                              id="uncontrolled-tab-example"
                              className="mb-3"
                              onSelect={(k) => {
                                setKey(k);
                              }}
                            >
                              <Tab
                                className="create-me create_by_me_list"
                                eventKey="created-by-me"
                                title="Created by me"
                              >
                                <div className="forms-content-section">
                                  {MeFormData?.map((item, index) => {
                                    return (
                                      <>
                                        <Row>
                                          <div className="col-lg-12">
                                            <h2 className="page_title">
                                              {item.category}
                                            </h2>
                                          </div>
                                        </Row>
                                        <Row>
                                          {item?.forms?.map(
                                            (inner_item, inner_index) => {
                                              return (
                                                inner_item.created_by ===
                                                  parseInt(
                                                    localStorage.getItem(
                                                      'user_id'
                                                    )
                                                  ) && (
                                                  <Col lg={4}>
                                                    <div className="forms-content create-other">
                                                      <div className="content-icon-section">
                                                        <img
                                                          src={
                                                            item.category ===
                                                            'Parent Forms'
                                                              ? '../img/survey_icon.png'
                                                              : item.category ===
                                                                'Talent Management'
                                                              ? '../img/blue_survey.png'
                                                              : item.category ===
                                                                'Child Care Forms'
                                                              ? '../img/green_survey.png'
                                                              : item.category ===
                                                                'Business Operations'
                                                              ? '../img/dark_green_survey.png'
                                                              : item.category ===
                                                                'Customer Service'
                                                              ? '../img/gray_survey.png'
                                                              : item.category ===
                                                                'Governance & Compliance'
                                                              ? '../img/pink_survey.png'
                                                              : item.category ===
                                                                'General'
                                                              ? '../img/orange_survey.png'
                                                              : '../img/survey_icon.png'
                                                          }
                                                        />
                                                      </div>
                                                      <div className="content-title-section">
                                                        <h6>
                                                          {inner_item.form_name}
                                                        </h6>
                                                        <h4>
                                                          Created on:{' '}
                                                          {moment(
                                                            inner_item.createdAt
                                                          ).format(
                                                            'DD/MM/YYYY'
                                                          )}
                                                        </h4>
                                                      </div>
                                                      <div className="content-toogle">
                                                        <div
                                                          className="user-img"
                                                          onClick={() => {
                                                            setViewResponseFlag(
                                                              true
                                                            );
                                                            setInnerIndex(
                                                              inner_index
                                                            );
                                                            setIndex(index);
                                                          }}
                                                        >
                                                          <img
                                                            src="../img/form-user-round.svg"
                                                            onClick={() => {
                                                              seenFormResponse(
                                                                item?.forms[
                                                                  inner_index
                                                                ]?.form_data
                                                              );
                                                            }}
                                                          />
                                                          <span
                                                            onClick={() => {
                                                              seenFormResponse(
                                                                item?.forms[
                                                                  inner_index
                                                                ]?.form_data
                                                              );
                                                            }}
                                                          >
                                                            {
                                                              inner_item?.seen_count
                                                            }
                                                          </span>
                                                        </div>
                                                        <Dropdown>
                                                          <Dropdown.Toggle id="dropdown-basic1">
                                                            <FontAwesomeIcon
                                                              icon={
                                                                faEllipsisVertical
                                                              }
                                                            />
                                                          </Dropdown.Toggle>

                                                          <Dropdown.Menu>
                                                            <Dropdown.Item
                                                              onClick={() => {
                                                                navigate(
                                                                  '/form/add',
                                                                  {
                                                                    state: {
                                                                      id: inner_item.id,
                                                                    },
                                                                  }
                                                                );
                                                              }}
                                                            >
                                                              <FontAwesomeIcon
                                                                icon={faPen}
                                                              />{' '}
                                                              Edit
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                              onClick={() => {
                                                                deleteForm(
                                                                  inner_item.id
                                                                );
                                                              }}
                                                            >
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
                                                )
                                              );
                                            }
                                          )}
                                        </Row>
                                      </>
                                    );
                                  })}
                                </div>
                              </Tab>
                              <Tab
                                className="create-me"
                                eventKey="created-by-others"
                                title="Created by others"
                              >
                                <div className="forms-content-section">
                                  {OthersFormData?.map((item, index) => {
                                    return (
                                      <>
                                        <Row>
                                          <div className="col-lg-12">
                                            <h2 className="page_title">
                                              {item.category}
                                            </h2>
                                          </div>
                                        </Row>
                                        <Row>
                                          {item?.forms?.map(
                                            (inner_item, inner_index) => {
                                              return (
                                                inner_item.created_by !==
                                                  parseInt(
                                                    localStorage.getItem(
                                                      'user_id'
                                                    )
                                                  ) && (
                                                  <Col lg={4}>
                                                    <div className="forms-content">
                                                      <div className="create-other">
                                                        <div className="content-icon-section">
                                                          <img
                                                            src={
                                                              item.category ===
                                                              'Parent Forms'
                                                                ? '../img/survey_icon.png'
                                                                : item.category ===
                                                                  'Talent Management'
                                                                ? '../img/blue_survey.png'
                                                                : item.category ===
                                                                  'Child Care Forms'
                                                                ? '../img/green_survey.png'
                                                                : item.category ===
                                                                  'Business Operations'
                                                                ? '../img/dark_green_survey.png'
                                                                : item.category ===
                                                                  'Customer Service'
                                                                ? '../img/gray_survey.png'
                                                                : item.category ===
                                                                  'Governance & Compliance'
                                                                ? '../img/pink_survey.png'
                                                                : item.category ===
                                                                  'General'
                                                                ? '../img/orange_survey.png'
                                                                : '../img/survey_icon.png'
                                                            }
                                                          />
                                                        </div>
                                                        <div className="content-title-section">
                                                          <h6>
                                                            {
                                                              inner_item.form_name
                                                            }
                                                          </h6>
                                                          <h4>
                                                            Created on:{' '}
                                                            {moment(
                                                              inner_item.createdAt
                                                            ).format(
                                                              'DD/MM/YYYY'
                                                            )}
                                                          </h4>
                                                        </div>
                                                        <div className="content-toogle">
                                                          <div
                                                            className="user-img"
                                                            onClick={() => {
                                                              setViewResponseFlag(
                                                                true
                                                              );
                                                              setInnerIndex(
                                                                inner_index
                                                              );
                                                              setIndex(index);
                                                            }}
                                                          >
                                                            <img
                                                              src="../img/form-user-round.svg"
                                                              onClick={() => {
                                                                console.log(
                                                                  'item?.forms--->343243',
                                                                  item?.forms[
                                                                    inner_index
                                                                  ]
                                                                );
                                                                seenFormResponse(
                                                                  item?.forms[
                                                                    inner_index
                                                                  ]?.form_data
                                                                );
                                                              }}
                                                            />
                                                            {console.log(
                                                              'item?.forms---->',
                                                              item?.forms
                                                            )}
                                                            <span
                                                              onClick={() => {
                                                                seenFormResponse(
                                                                  item?.forms[
                                                                    inner_index
                                                                  ]?.form_data
                                                                );
                                                              }}
                                                            >
                                                              {
                                                                inner_item?.seen_count
                                                              }
                                                            </span>
                                                          </div>
                                                          {localStorage.getItem(
                                                            'user_role'
                                                          ) ===
                                                            'franchisor_admin' && (
                                                            <Dropdown>
                                                              <Dropdown.Toggle id="dropdown-basic1">
                                                                <FontAwesomeIcon
                                                                  icon={
                                                                    faEllipsisVertical
                                                                  }
                                                                />
                                                              </Dropdown.Toggle>

                                                              <Dropdown.Menu>
                                                                <Dropdown.Item
                                                                  onClick={() => {
                                                                    navigate(
                                                                      '/form/add',
                                                                      {
                                                                        state: {
                                                                          id: inner_item.id,
                                                                        },
                                                                      }
                                                                    );
                                                                  }}
                                                                >
                                                                  <FontAwesomeIcon
                                                                    icon={faPen}
                                                                  />{' '}
                                                                  Edit
                                                                </Dropdown.Item>
                                                                <Dropdown.Item
                                                                  onClick={() => {
                                                                    deleteForm(
                                                                      inner_item.id
                                                                    );
                                                                  }}
                                                                >
                                                                  <FontAwesomeIcon
                                                                    icon={
                                                                      faRemove
                                                                    }
                                                                  />{' '}
                                                                  Remove
                                                                </Dropdown.Item>
                                                              </Dropdown.Menu>
                                                            </Dropdown>
                                                          )}
                                                        </div>
                                                      </div>
                                                      <div className="create-by">
                                                        <div className="create-by-heading">
                                                          {' '}
                                                          <h5>
                                                            Created by:
                                                          </h5>{' '}
                                                        </div>
                                                        <div className="user-img-other">
                                                          <img
                                                            src={
                                                              inner_item?.user
                                                                ?.profile_photo
                                                                ? inner_item
                                                                    ?.user
                                                                    ?.profile_photo
                                                                : '../../img/user-other.svg'
                                                            }
                                                          ></img>
                                                        </div>
                                                        <div className="user-name-other">
                                                          <p>
                                                            {
                                                              inner_item?.user
                                                                ?.fullname
                                                            }
                                                            ,
                                                          </p>
                                                          <span className="text-capitalize">
                                                            {' ' +
                                                              inner_item?.user?.role
                                                                .split('_')
                                                                .join(' ')}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </Col>
                                                )
                                              );
                                            }
                                          )}
                                        </Row>
                                      </>
                                    );
                                  })}
                                </div>
                              </Tab>
                            </Tabs>
                          </div>
                        </Tab>
                      )}
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
          getFormData('');
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <img src="../img/survey.png" />
            <h1>Form Responses</h1>
            {/* {key === 'created-by-me' &&
            MeFormData[Index]?.forms[innerIndex]?.form_data.length === 0 ? (
              <button
                className="view-response-button"
                onClick={() => {
                  navigate('/form/response', {
                    state: {
                      id: MeFormData[Index]?.forms[innerIndex]?.id,
                    },
                  });
                }}
              >
                View Response
              </button>
            ) : (
              OthersFormData[Index]?.forms[innerIndex]?.form_data.length ===
                0 && (
                <button
                  className="view-response-button"
                  onClick={() => {
                    navigate('/form/response', {
                      state: {
                        id: OthersFormData[Index]?.forms[innerIndex]?.id,
                      },
                    });
                  }}
                >
                  View Response
                </button>
              )
            )} */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {console.log('index', Index)}
          <div className="user_list_wrp">
            <div className="table_head">
              <div className="user_box">
                <div className="user_name">Name</div>
                <div className="user_role">User Role</div>
                <div className="date">Date</div>
              </div>
            </div>
            <div className="table_body">
              {key === 'created-by-me'
                ? MeFormData[Index]?.forms &&
                  MeFormData[Index]?.forms[innerIndex]?.form_data.map(
                    (item) => {
                      {
                        console.log(
                          'MeFormData--->',
                          MeFormData[Index]?.forms[innerIndex]?.id
                        );
                      }
                      return (
                        <div className="user_box">
                          <div className="user_name">
                            <div className="user_profile">
                              <img src="../img/user_img.png" alt="" />
                              <h4
                                className={
                                  item[0]?.seen_flag === false &&
                                  'bold-user-info'
                                }
                              >
                                {
                                  MeFormData[Index]?.forms[innerIndex]?.user
                                    ?.fullname
                                }
                              </h4>
                            </div>
                          </div>
                          <div className="user_role">
                            <div className="user_detail">
                              <h4
                                className={
                                  item[0]?.seen_flag === false
                                    ? 'bold-user-info text-capitalize'
                                    : 'text-capitalize'
                                }
                              >
                                {MeFormData[Index]?.forms[
                                  innerIndex
                                ]?.user?.role
                                  .split('_')
                                  .join(' ')}
                              </h4>
                            </div>
                          </div>
                          <div className="date">
                            <div className="user_detail">
                              <h4
                                className={
                                  item[0]?.seen_flag === false &&
                                  'bold-user-info'
                                }
                              >
                                {moment(item.createdAt).format('DD/MM/YYYY')} -
                                {moment(item.createdAt).format('HH:MM:SS')}
                              </h4>
                              <button
                                onClick={() => {
                                  navigate('/form/response', {
                                    state: {
                                      id: MeFormData[Index]?.forms[innerIndex]
                                        ?.id,
                                    },
                                  });
                                }}
                              >
                                View Response
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )
                : OthersFormData[Index]?.forms &&
                  OthersFormData[Index]?.forms[innerIndex]?.form_data.map(
                    (item, index) => {
                      return (
                        <div className="user_box">
                          {console.log(
                            'item?.seen_flag--->',
                            item[0]?.seen_flag,
                            'index--->',
                            index
                          )}
                          <div className="user_name">
                            <div className="user_profile">
                              <img src="../img/user_img.png" alt="" />
                              <h4
                                className={
                                  item[0]?.seen_flag === false &&
                                  'bold-user-info'
                                }
                              >
                                {item[0]?.user?.fullname}
                              </h4>
                            </div>
                          </div>
                          <div className="user_role">
                            <div className="user_detail">
                              <h4
                                className={
                                  item[0]?.seen_flag === false
                                    ? 'bold-user-info text-capitalize'
                                    : 'text-capitalize'
                                }
                              >
                                {item[0]?.user?.role.split('_').join(' ')}
                              </h4>
                            </div>
                          </div>
                          <div className="date">
                            <div className="user_detail">
                              <h4
                                className={
                                  item[0]?.seen_flag === false &&
                                  'bold-user-info'
                                }
                              >
                                {moment(item.createdAt).format('DD/MM/YYYY')}
                              </h4>
                              <button
                                onClick={() => {
                                  navigate('/form/response', {
                                    state: {
                                      id: OthersFormData[Index]?.forms[
                                        innerIndex
                                      ]?.id,
                                    },
                                  });
                                }}
                              >
                                View Response
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ViewFormBuilder;
