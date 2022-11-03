import {
  faEllipsisVertical,
  faEye,
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
import { BASE_URL, IGNORE_REMOVE_FORM } from '../../components/App';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import { FullLoader } from '../../components/Loader';

function ViewFormBuilder(props) {
  const navigate = useNavigate();
  const [viewResponseFlag, setViewResponseFlag] = useState(false);
  const [formData, setFormData] = useState([]);
  const [Index, setIndex] = useState(0);
  const [innerIndex, setInnerIndex] = useState(0);
  const [MeFormData, setMeFormData] = useState([]);
  const [meformDataStatus, setMeformDataStatus] = useState(false);
  const [otherformDataStatus, setOtherformDataStatus] = useState(false);

  const [selectedFranchisee, setSelectedFranchisee] = useState(
    localStorage.getItem('franchisee_id')
  );
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);
  const [formId, setFormId] = useState(null);
  const [OthersFormData, setOthersFormData] = useState([]);
  const [key, setKey] = useState(
    localStorage.getItem('user_role') === 'coordinator' ||
      localStorage.getItem('user_role') === 'educator' ||
      localStorage.getItem('user_role') === 'guardian'
      ? 'created-by-others'
      : 'created-by-me'
  );

  const token = localStorage.getItem('token');
  const location = useLocation();
  let no_record = false;
  let form_history_no_record = false;
  let count = 0;

  useEffect(() => {
    getAllForm();
    if (location?.state?.message) {
      toast.success(location?.state?.message);
      navigate('/form', { state: { message: null } });
    }
  }, []);

  const dateCheck = (start_date, start_time, end_date, end_time, form_name) => {
    let todayDate = new Date();
    todayDate = new Date(todayDate).toLocaleString('en-ZA', {
      timeZone: 'Australia/Perth',
    });
    todayDate = new Date(todayDate);
    if (start_date) {
      let dataAndTime = start_date + ' ' + start_time;
      let startDate = new Date(dataAndTime);
      startDate = new Date(startDate);
      if (todayDate.getTime() < startDate.getTime()) {
        toast.error(
          "You can't open this form because this form start date is " +
          moment(start_date).format('DD/MM/YYYY') +
          ' ' +
          start_time +
          '.'
        );
      } else {
        if (end_date) {
          let dataAndTime = end_date + ' ' + end_time;
          let endDate = new Date(dataAndTime);
          endDate = new Date(endDate);
          if (todayDate.getTime() > endDate.getTime()) {
            toast.error(
              'Your form was expired on ' +
              moment(end_date).format('DD/MM/YYYY') +
              ' ' +
              end_time +
              '.'
            );
          } else navigate(`/form/dynamic/${form_name}`);
        } else navigate(`/form/dynamic/${form_name}`);
      }
    } else navigate(`/form/dynamic/${form_name}`);
  };
  const getAllForm = () => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/form/list`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result?.result?.map((item) => {
          if (
            item.form_name.toLowerCase() === IGNORE_REMOVE_FORM.toLowerCase()
          ) {
            setFormId(item.id);
          }
        });
      })
      .catch((error) => console.log('error', error));
  };

  const deleteForm = (id, formCategory) => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
      headers: myHeaders,
    };

    fetch(
      `${BASE_URL}/form/${id}?user_id=${localStorage.getItem('user_id')}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        toast.success(result?.message);
        getFormData('', localStorage.getItem('franchisee_id'));
      })
      .catch((error) => console.log('error', error));
  };

  const getFormData = (search, franchisee_id) => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };
    localStorage.getItem('user_role') === 'guardian'
      ? (franchisee_id = 'all')
      : (franchisee_id = franchisee_id);
    fetch(
      `${BASE_URL}/form?search=${search}&id=${localStorage.getItem(
        'user_id'
      )}&role=${localStorage.getItem(
        'user_role'
      )}&franchisee_id=${franchisee_id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setFormData(result?.result);
        let me = [];
        let others = [];
        result?.result.map((item, index) => {
          me.push(item);
          others.push(item);
          me.forms = [];
          others.forms = [];
          item.forms = item?.forms.sort(
            (a, b) => new moment(b.createdAt) - new moment(a.createdAt)
          );
          item?.forms?.map((inner_item, inner_index) => {
            if (
              inner_item.created_by ===
              parseInt(localStorage.getItem('user_id'))
            ) {
              me.forms.push(inner_item);
            } else {
              others.forms.push(inner_item);
            }
          });
          if (me.forms.length === 0) {
            delete me[index];
          }
          if (others.forms.length === 0) {
            delete others[index];
          }
        });
        setMeFormData(me);
        setOthersFormData(others);
        if (result) {
          setfullLoaderStatus(false);
        }
      })
      .catch((error) => {
        setfullLoaderStatus(false);
      });
  };
  const seenFormResponse = (data) => {
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
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(seenData),
      redirect: 'follow',
    };

    // fetch(`${BASE_URL}/form/response/seen`, requestOptions)
    //   .then((response) => response.json())
    //   .then((result) => console.log(result?.message))
    //   .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    if (localStorage.getItem('form_error')) {
      toast.error(localStorage.getItem('form_error'));
      localStorage.removeItem('form_error');
    }
  }, []);

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
                  setSelectedFranchisee={(id) => {
                    id =
                      localStorage.getItem('user_role') === 'guardian'
                        ? localStorage.setItem('child_id', id)
                        : id;
                    if (count === 0) {
                      getFormData('', id);
                      count++;
                    }
                    setSelectedFranchisee(id);
                    localStorage.setItem('f_id', id);
                  }}
                />
                <FullLoader loading={fullLoaderStatus} />

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
                              getFormData(
                                e.target.value,
                                localStorage.getItem('franchisee_id')
                              );
                            }}
                          />
                        </Form.Group>
                      </div>
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
                    </div>
                  </div>
                  <div className="tab-section">
                    <Tabs
                      defaultActiveKey={
                        location?.state?.form_template
                          ? 'form-templates'
                          : 'forms-to-complete'
                      }
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab
                        eventKey="forms-to-complete"
                        title="Forms to complete"
                      >
                        <div className="forms-content-section">
                          {formData?.map((item, index) => {
                            return (
                              ((item.category === 'Talent Management' &&
                                localStorage.getItem('user_role') !==
                                'guardian') ||
                                localStorage.getItem('user_role') !==
                                'guardian' ||
                                (item.category !== 'Talent Management' &&
                                  localStorage.getItem('user_role') ===
                                  'guardian')) && (
                                <>
                                  <Row key={index + '1'}>
                                    {(item['title_flag'] = false)}

                                    {item?.forms?.map(
                                      (inner_item, inner_index) => {
                                        return inner_item?.end_date &&
                                          ((
                                            (typeof inner_item?.form_permissions !==
                                              'undefined' &&
                                              inner_item?.form_permissions[0]
                                                ?.fill_access_users) ||
                                            []
                                          ).includes('parent') &&
                                            (
                                              (typeof inner_item?.form_permissions !==
                                                'undefined' &&
                                                inner_item?.form_permissions !=
                                                'undefined' &&
                                                inner_item?.form_permissions[0]
                                                  ?.target_user) ||
                                              []
                                            ).includes('parent')
                                            ? !(
                                              inner_item?.form_filled_user ||
                                              []
                                            ).includes(
                                              localStorage.getItem(
                                                'user_role'
                                              ) === 'guardian'
                                                ? localStorage.getItem(
                                                  'user_id'
                                                )
                                                : localStorage.getItem(
                                                  'user_id'
                                                )
                                            )
                                            : !(
                                              inner_item?.form_filled_user ||
                                              []
                                            ).includes(
                                              localStorage.getItem(
                                                'user_role'
                                              ) === 'guardian'
                                                ? localStorage.getItem(
                                                  'child_id'
                                                )
                                                : localStorage.getItem(
                                                  'user_id'
                                                )
                                            )) &&
                                          ((
                                            (typeof inner_item?.form_permissions !==
                                              'undefined' &&
                                              inner_item?.form_permissions[0]
                                                ?.fill_access_users) ||
                                            []
                                          ).includes(
                                            localStorage.getItem(
                                              'user_role'
                                            ) === 'guardian'
                                              ? 'parent'
                                              : localStorage.getItem(
                                                'user_role'
                                              )
                                          ) ||
                                            (
                                              (typeof inner_item?.form_permissions !==
                                                'undefined' &&
                                                inner_item?.form_permissions[0]
                                                  ?.fill_access_users) ||
                                              []
                                            ).includes(
                                              localStorage.getItem(
                                                'user_role'
                                              ) === 'guardian'
                                                ? localStorage.getItem(
                                                  'child_id'
                                                ) ||
                                                localStorage.getItem(
                                                  'user_id'
                                                )
                                                : localStorage.getItem(
                                                  'user_id'
                                                )
                                            )) ? (
                                          <>
                                            {item.title_flag === false && (
                                              <>
                                                {(item['title_flag'] = true)}
                                                {(no_record = true)}
                                                <Col lg={12}>
                                                  <h2 className="page_title">
                                                    {item.category}
                                                  </h2>
                                                </Col>
                                              </>
                                            )}

                                            <Col
                                              lg={4}
                                              key={inner_index + '2'}
                                              onClick={() => {
                                                dateCheck(
                                                  inner_item.start_date,
                                                  inner_item.start_time,
                                                  inner_item.end_date,
                                                  inner_item.end_time,
                                                  inner_item.form_name
                                                );
                                              }}
                                            >
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
                                                  <h4 className="due_date">
                                                    Due on:{' '}
                                                    {moment(
                                                      inner_item.end_date
                                                    ).format('DD/MM/YYYY')}
                                                  </h4>
                                                </div>
                                              </div>
                                            </Col>
                                          </>
                                        ) : null;
                                      }
                                    )}
                                  </Row>
                                  <Row>
                                    {item?.forms?.map(
                                      (inner_item, inner_index) => {
                                        let formPermissions =
                                          inner_item?.form_permissions || [];
                                        return inner_item?.end_date === null &&
                                          ((
                                            (typeof formPermissions !==
                                              'undefined' &&
                                              formPermissions[0]
                                                ?.fill_access_users) ||
                                            []
                                          )?.includes('parent') &&
                                            (
                                              (typeof formPermissions !==
                                                'undefined' &&
                                                formPermissions[0]
                                                  ?.target_user) ||
                                              []
                                            )?.includes('parent')
                                            ? !(
                                              inner_item?.form_filled_user ||
                                              []
                                            )?.includes(
                                              localStorage.getItem(
                                                'user_role'
                                              ) === 'guardian'
                                                ? localStorage.getItem(
                                                  'user_id'
                                                )
                                                : localStorage.getItem(
                                                  'user_id'
                                                )
                                            )
                                            : !(
                                              inner_item?.form_filled_user ||
                                              []
                                            )?.includes(
                                              localStorage.getItem(
                                                'user_role'
                                              ) === 'guardian'
                                                ? localStorage.getItem(
                                                  'child_id'
                                                )
                                                : localStorage.getItem(
                                                  'user_id'
                                                )
                                            )) &&
                                          ((
                                            (typeof formPermissions !==
                                              'undefined' &&
                                              formPermissions[0]
                                                ?.fill_access_users) ||
                                            []
                                          )?.includes(
                                            localStorage.getItem(
                                              'user_role'
                                            ) === 'guardian'
                                              ? 'parent'
                                              : localStorage.getItem(
                                                'user_role'
                                              )
                                          ) ||
                                            (
                                              (typeof formPermissions !==
                                                'undefined' &&
                                                formPermissions[0]
                                                  ?.fill_access_users) ||
                                              []
                                            )?.includes(
                                              localStorage.getItem(
                                                'user_role'
                                              ) === 'guardian'
                                                ? localStorage.getItem(
                                                  'child_id'
                                                )
                                                : localStorage.getItem(
                                                  'user_id'
                                                )
                                            )) ? (
                                          <>
                                            {item.title_flag === false && (
                                              <>
                                                {(item['title_flag'] = true)}
                                                {(no_record = true)}
                                                <Col
                                                  lg={12}
                                                  key={inner_index + '3'}
                                                >
                                                  <h2 className="page_title">
                                                    {item.category}
                                                  </h2>
                                                </Col>
                                              </>
                                            )}
                                            <Col
                                              lg={4}
                                            // onClick={() => {
                                            //   dateCheck(
                                            //     inner_item.start_date,
                                            //     inner_item.start_time,
                                            //     inner_item.end_date,
                                            //     inner_item.end_time,
                                            //     inner_item.form_name
                                            //   );
                                            // }}
                                            >
                                              <div className="forms-content create-other">
                                                <div className="content-icon-section" onClick={() => {
                                                  navigate(
                                                    `/form/dynamic/${inner_item.form_name}`
                                                    // `/form/response/${inner_item.id}`
                                                  );
                                                }}>
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
                                                <div className="content-title-section" onClick={() => {
                                                  navigate(
                                                    `/form/dynamic/${inner_item.form_name}`
                                                    // `/form/response/${inner_item.id}`
                                                  );
                                                }}>
                                                  <h6
                                                  // onClick={() => {
                                                  //   navigate(
                                                  //     `/form/dynamic/${inner_item.form_name}`
                                                  //     // `/form/response/${inner_item.id}`
                                                  //   );
                                                  // }}
                                                  >
                                                    {inner_item.form_name}
                                                  </h6>
                                                  <h4>
                                                    Created on:{' '}
                                                    {moment(
                                                      inner_item.createdAt
                                                    )
                                                      .utcOffset('+11:00')
                                                      .format('DD/MM/YYYY')}
                                                  </h4>
                                                </div>
                                                <div className="content-toogle" >
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
                                                          if (
                                                            inner_item.end_date
                                                          ) {
                                                            let todayDate =
                                                              new Date();
                                                            todayDate =
                                                              new Date(
                                                                todayDate
                                                              ).toLocaleString(
                                                                'en-ZA',
                                                                {
                                                                  timeZone:
                                                                    'Australia/Perth',
                                                                }
                                                              );
                                                            todayDate =
                                                              new Date(
                                                                todayDate
                                                              );
                                                            let dataAndTime =
                                                              inner_item.end_date +
                                                              ' ' +
                                                              inner_item.end_time;
                                                            let endDate =
                                                              new Date(
                                                                dataAndTime
                                                              );
                                                            endDate = new Date(
                                                              endDate
                                                            ).toLocaleString(
                                                              'en-ZA',
                                                              {
                                                                timeZone:
                                                                  'Australia/Perth',
                                                              }
                                                            );
                                                            endDate = new Date(
                                                              endDate
                                                            );
                                                            if (
                                                              todayDate.getTime() >
                                                              endDate.getTime()
                                                            )
                                                              toast.error(
                                                                'Your form was expired on ' +
                                                                moment(
                                                                  inner_item.end_date
                                                                ).format(
                                                                  'DD/MM/YYYY'
                                                                ) +
                                                                '.'
                                                              );
                                                            else
                                                              navigate(
                                                                `/form/response/${inner_item.id}`
                                                                // `/form/dynamic/${inner_item.form_name}`
                                                              );
                                                          } else
                                                            navigate(
                                                              `/form/response/${inner_item.id}`
                                                              // `/form/dynamic/${inner_item.form_name}`
                                                            );
                                                        }}
                                                      >
                                                        <FontAwesomeIcon
                                                          icon={faEye}
                                                        />{' '}
                                                        View Response
                                                      </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                  </Dropdown>
                                                </div>
                                              </div>
                                            </Col>
                                          </>
                                        ) : null;
                                      }
                                    )}
                                  </Row>
                                </>
                              )
                            );
                          })}
                        </div>
                        {no_record === false && (
                          <Row>
                            <p>No Record founds</p>
                          </Row>
                        )}
                      </Tab>
                      <Tab eventKey="forms-history" title="Forms History">
                        <div className="forms-content-section">
                          {formData?.map((item, index) => {
                            return (
                              ((item.category === 'Talent Management' &&
                                localStorage.getItem('user_role') !==
                                'guardian') ||
                                localStorage.getItem('user_role') !==
                                'guardian' ||
                                (item.category !== 'Talent Management' &&
                                  localStorage.getItem('user_role') ===
                                  'guardian')) && (
                                <>
                                  {(item['title_flag'] = false)}
                                  <Row>
                                    {item?.forms?.map(
                                      (inner_item, inner_index) => {
                                        return ((
                                          (typeof inner_item?.form_permissions !==
                                            'undefined' &&
                                            inner_item?.form_permissions[0]
                                              ?.fill_access_users) ||
                                          []
                                        ).includes('parent') &&
                                          (
                                            (typeof inner_item?.form_permissions !==
                                              'undefined' &&
                                              inner_item?.form_permissions[0]
                                                ?.target_user) ||
                                            []
                                          ).includes('parent')
                                          ? (
                                            inner_item?.form_filled_user || []
                                          ).includes(
                                            localStorage.getItem('user_id')
                                          )
                                          : (
                                            inner_item?.form_filled_user || []
                                          ).includes(
                                            localStorage.getItem(
                                              'user_role'
                                            ) === 'guardian'
                                              ? localStorage.getItem(
                                                'child_id'
                                              )
                                              : localStorage.getItem(
                                                'user_id'
                                              )
                                          )) &&
                                          ((
                                            (typeof inner_item?.form_permissions !==
                                              'undefined' &&
                                              inner_item?.form_permissions[0]
                                                ?.fill_access_users) ||
                                            []
                                          ).includes(
                                            localStorage.getItem(
                                              'user_role'
                                            ) === 'guardian'
                                              ? 'parent'
                                              : localStorage.getItem(
                                                'user_role'
                                              )
                                          ) ||
                                            (
                                              (typeof inner_item?.form_permissions !==
                                                'undefined' &&
                                                inner_item?.form_permissions[0]
                                                  ?.fill_access_users) ||
                                              []
                                            ).includes(
                                              localStorage.getItem(
                                                'user_role'
                                              ) === 'guardian'
                                                ? localStorage.getItem(
                                                  'child_id'
                                                ) ||
                                                localStorage.getItem(
                                                  'user_id'
                                                )
                                                : localStorage.getItem(
                                                  'user_id'
                                                )
                                            )) ? (
                                          <>
                                            {item.title_flag === false && (
                                              <>
                                                {(item['title_flag'] = true)}
                                                {
                                                  (form_history_no_record = true)
                                                }
                                                <div
                                                  className="col-lg-12"
                                                  key={inner_index + '5'}
                                                >
                                                  <h2 className="page_title">
                                                    {item.category}
                                                  </h2>
                                                </div>
                                              </>
                                            )}
                                            <Col lg={4} key={inner_index + '6'}>
                                              <div className="forms-content create-other">
                                                <div
                                                  className="content-icon-section"
                                                  onClick={() => {
                                                    navigate(
                                                      `/form/response/${inner_item.id}`
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
                                                      `/form/response/${inner_item.id}`
                                                    );
                                                  }}
                                                >
                                                  <h6>
                                                    {inner_item.form_name}
                                                  </h6>
                                                  <h4>
                                                    Created on:{' '}
                                                    {moment(
                                                      inner_item.createdAt
                                                    )
                                                      .utcOffset('+11:00')
                                                      .format('DD/MM/YYYY')}
                                                  </h4>
                                                </div>
                                                <div className="content-toogle">
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
                                                          if (
                                                            inner_item.end_date
                                                          ) {
                                                            let todayDate =
                                                              new Date();
                                                            todayDate =
                                                              new Date(
                                                                todayDate
                                                              ).toLocaleString(
                                                                'en-ZA',
                                                                {
                                                                  timeZone:
                                                                    'Australia/Perth',
                                                                }
                                                              );
                                                            todayDate =
                                                              new Date(
                                                                todayDate
                                                              );
                                                            let dataAndTime =
                                                              inner_item.end_date +
                                                              ' ' +
                                                              inner_item.end_time;
                                                            let endDate =
                                                              new Date(
                                                                dataAndTime
                                                              );
                                                            endDate = new Date(
                                                              endDate
                                                            ).toLocaleString(
                                                              'en-ZA',
                                                              {
                                                                timeZone:
                                                                  'Australia/Perth',
                                                              }
                                                            );
                                                            endDate = new Date(
                                                              endDate
                                                            );
                                                            if (
                                                              todayDate.getTime() >
                                                              endDate.getTime()
                                                            )
                                                              toast.error(
                                                                'Your form was expired on ' +
                                                                moment(
                                                                  inner_item.end_date
                                                                ).format(
                                                                  'DD/MM/YYYY'
                                                                ) +
                                                                '.'
                                                              );
                                                            else
                                                              navigate(
                                                                `/form/dynamic/${inner_item.form_name}`
                                                              );
                                                          } else
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
                              )
                            );
                          })}
                        </div>
                        {form_history_no_record === false && (
                          <Row>
                            <p>No Record founds</p>
                          </Row>
                        )}
                      </Tab>

                      <Tab
                        eventKey="form-templates"
                        title="Form Templates and Responses"
                      >
                        <div className="tab-created">
                          <Tabs
                            defaultActiveKey={
                              localStorage.getItem('user_role') ===
                                'coordinator' ||
                                localStorage.getItem('user_role') ===
                                'educator' ||
                                localStorage.getItem('user_role') === 'guardian'
                                ? 'created-by-others'
                                : key
                            }
                            id="uncontrolled-tab-example"
                            className="mb-3"
                            onSelect={(k) => {
                              setKey(k);
                            }}
                          >
                            {!(
                              localStorage.getItem('user_role') ===
                              'coordinator' ||
                              localStorage.getItem('user_role') ===
                              'educator' ||
                              localStorage.getItem('user_role') === 'guardian'
                            ) && (
                                <Tab
                                  className="create-me create_by_me_list"
                                  eventKey="created-by-me"
                                  title="Created by me"
                                >
                                  <div className="forms-content-section">
                                    {MeFormData?.length > 0 &&
                                      MeFormData?.map((item, index) => {
                                        return (
                                          <>
                                            <Row key={index + '7'}>
                                              <div className="col-lg-12">
                                                <h2 className="page_title">
                                                  {item.category}
                                                </h2>
                                              </div>
                                            </Row>
                                            <Row key={index + '8'}>
                                              {item?.forms?.map(
                                                (inner_item, inner_index) => {
                                                  if (
                                                    inner_item?.created_by ==
                                                    parseInt(
                                                      localStorage.getItem(
                                                        'user_id'
                                                      )
                                                    ) &&
                                                    meformDataStatus == false
                                                  ) {
                                                    setMeformDataStatus(true);
                                                  }

                                                  return (
                                                    inner_item.created_by ===
                                                    parseInt(
                                                      localStorage.getItem(
                                                        'user_id'
                                                      )
                                                    ) && (
                                                      <Col
                                                        lg={4}
                                                        key={inner_index + '9'}
                                                      >
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
                                                              {
                                                                inner_item.form_name
                                                              }
                                                            </h6>
                                                            <h4>
                                                              Created on:{' '}
                                                              {moment(
                                                                inner_item.createdAt
                                                              )
                                                                .utcOffset(
                                                                  '+11:00'
                                                                )
                                                                .format(
                                                                  'DD/MM/YYYY'
                                                                )}
                                                            </h4>
                                                            {inner_item.form_data
                                                              ?.length &&
                                                              inner_item.form_data
                                                                ?.length > 0 ? (
                                                              <h4
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
                                                                Total Responses :{' '}
                                                                {
                                                                  inner_item
                                                                    .form_data
                                                                    ?.length
                                                                }
                                                                {inner_item?.seen_count >
                                                                  0 && (
                                                                    <>
                                                                      {' '}
                                                                      |
                                                                      <b>
                                                                        {' '}
                                                                        New :{' '}
                                                                        {
                                                                          inner_item?.seen_count
                                                                        }
                                                                      </b>
                                                                    </>
                                                                  )}
                                                              </h4>
                                                            ) : (
                                                              ''
                                                            )}
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
                                                              // onClick={() => {
                                                              //   seenFormResponse(
                                                              //     item?.forms[
                                                              //       inner_index
                                                              //     ]?.form_data
                                                              //   );
                                                              // }}
                                                              />
                                                              {inner_item?.seen_count >
                                                                0 && (
                                                                  <span
                                                                  // onClick={() => {
                                                                  //   seenFormResponse(
                                                                  //     item?.forms[
                                                                  //       inner_index
                                                                  //     ]?.form_data
                                                                  //   );
                                                                  // }}
                                                                  >
                                                                    {
                                                                      inner_item?.seen_count
                                                                    }
                                                                  </span>
                                                                )}
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
                                                                          update: true,
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
                                                                    localStorage.setItem('formStatus', false)
                                                                    navigate(
                                                                      `/form/preview/${inner_item.form_name}`,
                                                                      {
                                                                        state: {
                                                                          id: inner_item.id,
                                                                          form_name:
                                                                            inner_item.form_name,
                                                                        },
                                                                      }
                                                                    );
                                                                  }}
                                                                >
                                                                  <FontAwesomeIcon
                                                                    icon={faEye}
                                                                  />{' '}
                                                                  Preview
                                                                </Dropdown.Item>
                                                                {inner_item.id !==
                                                                  formId && (
                                                                    <Dropdown.Item
                                                                      onClick={() => {
                                                                        if (
                                                                          window.confirm(
                                                                            'Are you sure you want to delete the form?'
                                                                          )
                                                                        ) {
                                                                          deleteForm(
                                                                            inner_item.id,
                                                                            item.category
                                                                          );
                                                                        }
                                                                      }}
                                                                    >
                                                                      <FontAwesomeIcon
                                                                        icon={
                                                                          faRemove
                                                                        }
                                                                      />{' '}
                                                                      Remove
                                                                    </Dropdown.Item>
                                                                  )}
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

                                    {meformDataStatus == true
                                      ? ''
                                      : 'No Form Created by You '}
                                  </div>
                                </Tab>
                              )}
                            <Tab
                              className="create-me"
                              eventKey="created-by-others"
                              title="Created by others"
                            >
                              <div className="forms-content-section">
                                {OthersFormData?.length > 0 &&
                                  OthersFormData?.map((item, index) => {
                                    {
                                      item['title_flag'] = false;
                                    }
                                    return (
                                      <>
                                        <Row key={index + '10'}>
                                          {item?.forms?.map(
                                            (inner_item, inner_index) => {
                                              if (
                                                inner_item?.created_by !==
                                                parseInt(
                                                  localStorage.getItem(
                                                    'user_id'
                                                  )
                                                ) &&
                                                otherformDataStatus == false
                                              ) {
                                                setOtherformDataStatus(true);
                                              }

                                              return (
                                                inner_item.created_by !==
                                                parseInt(
                                                  localStorage.getItem(
                                                    'user_id'
                                                  )
                                                ) &&
                                                ((
                                                  (typeof inner_item?.form_permissions !==
                                                    'undefined' &&
                                                    inner_item
                                                      ?.form_permissions[0]
                                                      ?.response_visibility) ||
                                                  []
                                                ).includes(
                                                  localStorage.getItem(
                                                    'user_id'
                                                  )
                                                ) ||
                                                  (
                                                    (typeof inner_item?.form_permissions !==
                                                      'undefined' &&
                                                      inner_item
                                                        ?.form_permissions[0]
                                                        ?.response_visibility) ||
                                                    []
                                                  ).includes(
                                                    localStorage.getItem(
                                                      'user_role'
                                                    )
                                                  ) ||
                                                  (
                                                    (typeof inner_item?.form_permissions !==
                                                      'undefined' &&
                                                      inner_item
                                                        ?.form_permissions[0]
                                                        ?.signatories_role) ||
                                                    []
                                                  ).includes(
                                                    localStorage.getItem(
                                                      'user_id'
                                                    )
                                                  ) ||
                                                  (
                                                    (typeof inner_item?.form_permissions !==
                                                      'undefined' &&
                                                      inner_item
                                                        ?.form_permissions[0]
                                                        ?.signatories_role) ||
                                                    []
                                                  ).includes(
                                                    localStorage.getItem(
                                                      'user_role'
                                                    ) === 'guardian'
                                                      ? 'parent'
                                                      : localStorage.getItem(
                                                        'user_role'
                                                      )
                                                  )) && (
                                                  <>
                                                    {item.title_flag ===
                                                      false && (
                                                        <>
                                                          {
                                                            (item[
                                                              'title_flag'
                                                            ] = true)
                                                          }
                                                          <Col
                                                            lg={12}
                                                            key={
                                                              inner_index + '11'
                                                            }
                                                          >
                                                            <h2 className="page_title">
                                                              {item.category}
                                                            </h2>
                                                          </Col>
                                                        </>
                                                      )}
                                                    <Col
                                                      lg={4}
                                                      key={inner_index + '12'}
                                                    >
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
                                                              )
                                                                .utcOffset(
                                                                  '+11:00'
                                                                )
                                                                .format(
                                                                  'DD/MM/YYYY'
                                                                )}
                                                            </h4>

                                                            {inner_item
                                                              .form_data
                                                              ?.length &&
                                                              inner_item.form_data
                                                                ?.length > 0 ? (
                                                              <h4
                                                                onClick={() => {
                                                                  setViewResponseFlag(
                                                                    true
                                                                  );
                                                                  setInnerIndex(
                                                                    inner_index
                                                                  );
                                                                  setIndex(
                                                                    index
                                                                  );
                                                                }}
                                                              >
                                                                Total Responses
                                                                :{' '}
                                                                {
                                                                  inner_item
                                                                    .form_data
                                                                    ?.length
                                                                }
                                                                {inner_item?.seen_count >
                                                                  0 && (
                                                                    <>
                                                                      {' '}
                                                                      |
                                                                      <b>
                                                                        {' '}
                                                                        New :{' '}
                                                                        {
                                                                          inner_item?.seen_count
                                                                        }
                                                                      </b>
                                                                    </>
                                                                  )}
                                                              </h4>
                                                            ) : (
                                                              ''
                                                            )}
                                                          </div>
                                                          <div className="content-toogle">
                                                            <div
                                                              className="user-img"
                                                              onClick={() => {
                                                                setInnerIndex(
                                                                  inner_index
                                                                );
                                                                setIndex(index);
                                                                setViewResponseFlag(
                                                                  true
                                                                );
                                                              }}
                                                            >
                                                              <img
                                                                src="../img/form-user-round.svg"
                                                              // onClick={() => {
                                                              //   seenFormResponse(
                                                              //     item?.forms[
                                                              //       inner_index
                                                              //     ]?.form_data
                                                              //   );
                                                              // }}
                                                              />

                                                              {inner_item?.seen_count >
                                                                0 && (
                                                                  <span
                                                                  // onClick={() => {
                                                                  //   seenFormResponse(
                                                                  //     item?.forms[
                                                                  //       inner_index
                                                                  //     ]?.form_data
                                                                  //   );
                                                                  // }}
                                                                  >
                                                                    {
                                                                      inner_item?.seen_count
                                                                    }
                                                                  </span>
                                                                )}
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
                                                                            state:
                                                                            {
                                                                              id: inner_item.id,
                                                                              update: true,
                                                                            },
                                                                          }
                                                                        );
                                                                      }}
                                                                    >
                                                                      <FontAwesomeIcon
                                                                        icon={
                                                                          faPen
                                                                        }
                                                                      />{' '}
                                                                      Edit
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item
                                                                      onClick={() => {
                                                                        navigate(
                                                                          `/form/preview/${inner_item.form_name}`,
                                                                          {
                                                                            state:
                                                                            {
                                                                              id: inner_item.id,
                                                                              form_name:
                                                                                inner_item.form_name,
                                                                            },
                                                                          }
                                                                        );
                                                                      }}
                                                                    >
                                                                      <FontAwesomeIcon
                                                                        icon={
                                                                          faEye
                                                                        }
                                                                      />{' '}
                                                                      Preview
                                                                    </Dropdown.Item>
                                                                    {inner_item.id !==
                                                                      formId && (
                                                                        <Dropdown.Item
                                                                          onClick={() => {
                                                                            if (
                                                                              window.confirm(
                                                                                'Are you sure you want to delete the form?'
                                                                              )
                                                                            ) {
                                                                              deleteForm(
                                                                                inner_item.id,
                                                                                item.category
                                                                              );
                                                                            }
                                                                          }}
                                                                        >
                                                                          <FontAwesomeIcon
                                                                            icon={
                                                                              faRemove
                                                                            }
                                                                          />{' '}
                                                                          Remove
                                                                        </Dropdown.Item>
                                                                      )}
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
                                                  </>
                                                )
                                              );
                                            }
                                          )}
                                        </Row>
                                      </>
                                    );
                                  })}

                                {otherformDataStatus == true
                                  ? ''
                                  : 'No Form Created by Other '}
                              </div>
                            </Tab>
                          </Tabs>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                </div>
                <ToastContainer />
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
          getFormData('', localStorage.getItem('franchisee_id'));
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
                <div className="date">Date</div>
              </div>
            </div>
            <div className="table_body">
              {key === 'created-by-me'
                ? MeFormData[Index]?.forms &&
                MeFormData[Index]?.forms[innerIndex]?.form_data.map(
                  (item) => {
                    return (
                      <div className="user_box">
                        <div className="user_name">
                          <div className="user_profile">
                            <img
                              src={
                                item[0]?.user?.profile_photo
                                  ? item[0]?.user?.profile_photo
                                  : '../img/user_img.png'
                              }
                              alt=""
                            />
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
                              {moment(item[0]?.createdAt).format(
                                'DD/MM/YYYY'
                              )}{' '}
                              -{' '}
                              {item[0]?.createdAt
                                .split('T')[1]
                                .split('.')[0]
                                .split(':', 2)
                                .join(':')}{' '}
                              Hrs
                            </h4>
                            <button
                              onClick={() => {
                                navigate(
                                  `/form/response/${item[0]?.form_id}`,
                                  {
                                    state: {
                                      id: MeFormData[Index]?.forms[innerIndex]
                                        ?.id,
                                      form_name:
                                        MeFormData[Index]?.forms[innerIndex]
                                          ?.form_name,
                                    },
                                  }
                                );
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
                        <div className="user_name">
                          <div className="user_profile">
                            <img
                              src={
                                item[0]?.user?.profile_photo
                                  ? item[0]?.user?.profile_photo
                                  : '../img/user_img.png'
                              }
                              alt=""
                            />
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
                              {moment(item[0]?.createdAt)
                                .utcOffset('+11:00')
                                .format('DD/MM/YYYY')}{' '}
                              -{' '}
                              {item[0]?.createdAt
                                .split('T')[1]
                                .split('.')[0]
                                .split(':', 2)
                                .join(':')}{' '}
                              Hrs
                            </h4>
                            <button
                              onClick={() => {
                                if (
                                  OthersFormData[Index]?.forms[innerIndex]
                                    ?.form_permissions[0]?.signatories_role ||
                                  [].includes(
                                    localStorage.getItem('user_id')
                                  ) ||
                                  OthersFormData[Index]?.forms[innerIndex]
                                    ?.form_permissions[0]?.signatories_role ||
                                  [].includes(
                                    localStorage.getItem('user_role') ===
                                      'guardian'
                                      ? 'parent'
                                      : localStorage.getItem('user_role')
                                  )
                                ) {
                                  navigate(
                                    `/form/response/${item[0]?.form_id}`,
                                    {
                                      state: {
                                        id: OthersFormData[Index]?.forms[
                                          innerIndex
                                        ]?.id,
                                        form_name:
                                          OthersFormData[Index]?.forms[
                                            innerIndex
                                          ]?.form_name,
                                        signature_access: true,
                                      },
                                    }
                                  );
                                } else {
                                  navigate(
                                    `/form/response/${item[0]?.form_id}`,
                                    {
                                      state: {
                                        id: OthersFormData[Index]?.forms[
                                          innerIndex
                                        ]?.id,
                                        form_name:
                                          OthersFormData[Index]?.forms[
                                            innerIndex
                                          ]?.form_name,
                                        signature_access: false,
                                      },
                                    }
                                  );
                                }
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
