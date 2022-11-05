import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';
import {
  Accordion,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BASE_URL, IGNORE_REMOVE_FORM } from '../../components/App';
import LeftNavbar from '../../components/LeftNavbar';
import { FullLoader } from '../../components/Loader';
import TopHeader from '../../components/TopHeader';
import SignaturePad from 'react-signature-canvas';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

function OwnFormResponse(props) {
  const Params = useParams();

  const location = useLocation();
  const { id } = useParams();
  const sigPad = useRef({});
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState([]);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem('token');
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);
  const [signatureModel, setSignatureModel] = useState(false);
  const [indexToHide, setIndexToHide] = useState(-1);
  const [Index, setIndex] = useState(0);
  const [ childrenData, setChildrenData ] = useState([]);
  const [hideFlag, setHideFlag] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    from_date: '',
    to_date: '',
  });

  let count = 0;

  useEffect(() => {
    if (location?.state?.message) {
      toast.success(location?.state?.message);
      navigate(`/form/response/${id}`, { state: { message: null } });
    }
    getResponse('');
  }, []);
  const clear = (e) => {
    e.preventDefault();
    sigPad.current.clear();
  };

  const trim = (e, index) => {
    e.preventDefault();



    console.log("vvvvvvvvvvvvvvvvvvvvvvvv",indexToHide)
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('authorization', 'Bearer ' + token);
    let fields = JSON.parse(responseData[Index][0].fields);
    fields['signature_1'] = sigPad.current
      .getTrimmedCanvas()
      .toDataURL('image/png');

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        form_id: responseData[Index][0].form_id,
        user_id: responseData[Index][0].user_id,
        behalf_of: responseData[Index][0].behalf_of,
        franchisee_id: responseData[Index][0]?.filled_user?.franchisee_id,
        data: fields,
        edit_signature: true,
        id: responseData[Index][0].id,
      }),
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/form/form_data`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        getResponse('');
        setSignatureModel(false);
        if (result) {
          toast.success('Signature added successfully');
          setHideFlag(true);
        }
      });
  };

  const fetchChildren = async () => {
    let response = await axios.get(`${BASE_URL}/enrollment/children/${localStorage.getItem('user_id')}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if(response.status === 200 && response.data.status === "success") {
      console.log('RESPONSE>>>>>>>>>>>>>>>>>>>>>>', response);
      const { parentData } = response.data;
      let { children } = parentData;
      let childrenData = children.map(data => data.fullname);
      console.log('CHILDREN>>>>>>>>', childrenData);
      setChildrenData(childrenData);
    }
  };

  const getResponse = (search) => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };

    const URL_ = `${BASE_URL}/form/response/own?search=${search}&form_id=${id}&user_id=${localStorage.getItem(
      'user_id'
    )}&user_role=${localStorage.getItem('user_role')}&from_date=${
      dateFilter.from_date
    }&to_date=${dateFilter.to_date}`;
    fetch(URL_, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('RESULT>>>>>>>>>>>>>>', result);
        if (result) {
          // console.log('Result>>>>>>>>>>>>>>>>>>>>', result);
          setfullLoaderStatus(false);
        }
        if (result?.result.length > 0) {
          result?.result.map((item, index) => {
            // if(item['signature_button'] === true) {
              
            // }
            item['signature_button'] = true;

            result?.result[index]?.map((inner_item, inner_index) => {

              let parsedJSON = JSON.parse(inner_item.fields);

              Object.keys(JSON.parse(inner_item.fields)).map((field_item) => {
                  if (field_item === 'signature_1' && parsedJSON[field_item] !== null) {
                  item['signature_button'] = false;
                }
                
              });
            });
            if (result?.result?.length - 1 === index) {
              setResponseData(result?.result);
              seenFormResponse(result?.result);

              setFormData(result?.form);
            }
          });
        } else {
          setResponseData(result?.result);
          seenFormResponse(result?.result);

          setFormData(result?.form);
        }
      })
      .catch((error) => console.log('error', error));
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
    fetch(`${BASE_URL}/form/response/seen`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result?.message))
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    fetchChildren();
  }, []);
  return (
    <>
      <div id="main">
        <ToastContainer />
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
                <TopHeader />
                <FullLoader loading={fullLoaderStatus} />
                <Row>
                  <Col sm={8}>
                    <div className="mynewForm-heading  mb-0">
                      <Button
                        onClick={() => {
                          navigate('/form');
                        }}
                      >
                        <img src="../../img/back-arrow.svg" />
                      </Button>
                      <h4 className="mynewForm text-capitalize">
                        {formData.form_name}
                      </h4>
                    </div>
                  </Col>
                </Row>
                <div className="responses-forms-header-section mb-5 forms-header-section">
                  <div className="d-md-flex align-items-end mt-4">
                    <div className="forms-managmentsection">
                      <div className="forms-managment-left">
                        <p>{responseData.length} Responses</p>
                      </div>

                      <div className="d-sm-flex align-items-center">
                        <Form.Group className="me-3">
                          <Form.Label>From Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="from_date"
                            value={dateFilter?.from_date}
                            onChange={(e) => {
                              setDateFilter((prevState) => ({
                                ...prevState,
                                from_date: e.target.value,
                              }));
                            }}
                          />
                        </Form.Group>
                        <Form.Group className="me-3">
                          <Form.Label>To Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="to_date"
                            value={dateFilter?.to_date}
                            onChange={(e) => {
                              setDateFilter((prevState) => ({
                                ...prevState,
                                to_date: e.target.value,
                              }));
                            }}
                          />
                        </Form.Group>
                        <Button
                          variant="primary"
                          type="submit"
                          className="mt-4"
                          onClick={() => {
                            console.log(
                              'GETTING FILTERED RESPONSE FROM SERVER!'
                            );
                            getResponse('');
                          }}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>

                    <div className="forms-search me-0 ms-auto mt-3">
                      <Form.Group>
                        <div className="forms-icon">
                          <img src="/img/search-icon-light.svg" alt="" />
                        </div>
                        <Form.Control
                          type="text"
                          placeholder="Search..."
                          name="search"
                          onChange={(e) => {
                            getResponse(e.target.value);
                          }}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </div>
                <div className="responses-collapse">
                  {responseData.length > 0 ? (
                    <Accordion defaultActiveKey="0">
                      {responseData.map((item, index) => {
                        return localStorage.getItem('user_role') === "guardian" ?
                        (
                          childrenData.includes(item[0].user.fullname) &&
                          <Accordion.Item key={index} eventKey={index}>
                            <Accordion.Header>
                              <div className="responses-header-row">
                                <div className="responses-header-left">
                                  <div className="responses-header-image">
                                    <img
                                      src={
                                        item[0]?.filled_user?.profile_photo
                                          ? item[0]?.filled_user?.profile_photo
                                          : '/img/upload.jpg'
                                      }
                                      alt=""
                                    />
                                  </div>
                                  {responseData[index]?.map(
                                    (inner_item, inner_index) => {
                                      return (
                                        <div
                                          key={inner_index}
                                          className={
                                            responseData[index].length - 1 ===
                                              inner_index ||
                                            (inner_index > 0 &&
                                              responseData[index][
                                                inner_index - 1
                                              ]?.filled_user?.fullname?.includes(
                                                inner_item?.filled_user
                                                  ?.fullname
                                              ))
                                              ? 'responses-header-detail'
                                              : 'responses-header-detail response-header-left-line'
                                          }
                                        >
                                          <div className="d-flex">
                                            <h5>
                                              {inner_index > 0
                                                ? !responseData[index][
                                                    inner_index - 1
                                                  ].filled_user?.fullname?.includes(
                                                    inner_item?.filled_user
                                                      ?.fullname
                                                  ) &&
                                                  inner_item?.filled_user
                                                    ?.fullname
                                                : inner_item?.filled_user
                                                    ?.fullname}
                                            </h5>

                                            {item[inner_index].isEditTime !=
                                              null &&
                                            moment(
                                              item[inner_index].isEditTime
                                            ).format() > moment().format() ? (
                                              <span
                                                style={{
                                                  fontSize: '12px',
                                                  paddingLeft: '12px',
                                                }}
                                              >
                                                Currently in editing mode <br />
                                                [Refresh the page after some
                                                time]
                                              </span>
                                            ) : (
                                              formData &&
                                              inner_index === 0 &&
                                              (formData?.form_type ===
                                                'editable' ||
                                                formData?.form_type ===
                                                  'multi_submission') && (
                                                <Link
                                                  style={{
                                                    marginLeft: '5px',
                                                  }}
                                                  to={`/form/dynamic/${formData.form_name}`}
                                                  state={{
                                                    id: item[inner_index]?.id,
                                                    form_id: id ? id : null,
                                                  }}
                                                >
                                                  {console.log(
                                                    'item[index]?.id--->',
                                                    item[inner_index]
                                                  )}
                                                  {/* <div
                                                  className="edit-icon-form"
                                                  onClick={() => {
                                                    alert(
                                                      'Hello--->' +
                                                        inner_index
                                                    );
                                                    navigate(
                                                      `/form/dynamic/${formData.form_name}`,
                                                      {
                                                        state: {
                                                          id: item[index].id,
                                                          form_id: id,
                                                        },
                                                      }
                                                    );
                                                  }}
                                                > */}
                                                  <FontAwesomeIcon
                                                    icon={faPen}
                                                  />
                                                </Link>
                                              )
                                            )}
                                          </div>
                                          <h6>
                                            <span className="text-capitalize">
                                              {inner_index > 0
                                                ? !responseData[index][
                                                    inner_index - 1
                                                  ]?.filled_user?.role
                                                    .split('_')
                                                    .join(' ')
                                                    .includes(
                                                      inner_item?.filled_user?.role
                                                        .split('_')
                                                        .join(' ')
                                                    ) &&
                                                  inner_item?.filled_user?.role
                                                    .split('_')
                                                    .join(' ') + ','
                                                : inner_item?.filled_user?.role
                                                    .split('_')
                                                    .join(' ') + ','}
                                            </span>{' '}
                                            {inner_index > 0
                                              ? !responseData[index][
                                                  inner_index - 1
                                                ].filled_user?.franchisee?.franchisee_name.includes(
                                                  inner_item?.filled_user
                                                    ?.franchisee
                                                    ?.franchisee_name
                                                ) &&
                                                inner_item?.filled_user
                                                  ?.franchisee?.franchisee_name
                                              : inner_item?.filled_user
                                                  ?.franchisee?.franchisee_name}
                                          </h6>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>

                                <div className="responses-header-right">
                                  {item[0]?.updated ? (
                                    <p>
                                      Last Updated By :{' '}
                                      {item[0]?.updatedByUsers[0]?.fullname}{' '}
                                      <br />
                                      Updated on: <br />
                                      {moment(item[0].updatedAt).format(
                                        'DD/MM/YYYY'
                                      ) +
                                        ', ' +
                                        moment(item[0].updatedAt)
                                          .subtract(13, 'hours')
                                          .utc()
                                          .format('HH:mm')}
                                      hrs
                                    </p>
                                  ) : (
                                    <p>
                                      Completed By :{' '}
                                      {item[0]?.filled_user?.fullname} <br />
                                      Completed on: <br />
                                      {moment(item[0].createdAt).format(
                                        'DD/MM/YYYY'
                                      ) +
                                        ', ' +
                                        moment(item[0].createdAt)
                                          .subtract(13, 'hours')
                                          .utc()
                                          .format('HH:mm')}
                                      hrs{' '}
                                    </p>
                                  )}
                                  {/* <p>
                                    Completed on: <br />
                                    {moment(item[0].createdAt)
                                      .utcOffset('+11:00')
                                      .format('DD/MM/YYYY') +
                                      ', ' +
                                      item[0].createdAt
                                        .split('T')[1]
                                        .split('.')[0]
                                        .split(':', 2)
                                        .join(':') +
                                      ' hrs'}
                                  </p> */}
                                </div>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body>
                              {console.log('RESPONSE DATA:', JSON.parse(responseData[0][0].fields))}
                              {responseData[index]?.map((item, index) => {

                                console.log("index index index index ", index)
                                return (
                                  <div
                                    key={index}
                                    className={
                                      index === 0
                                        ? 'responses-content-wrap'
                                        : 'responses-content-wrap response-margin'
                                    }
                                  >
                                    <h4 className="content-wrap-title text-capitalize">
                                      {/* Filled By {item?.filled_user?.fullname}{' '} */}
                                      {item?.filled_user?.fullname}{' '}
                                      {!item.section_name ||
                                         (item.section_name !== '' &&
                                          `| ${item.section_name
                                            .split('_')
                                            .join(' ')} Section`)}{' '}
                                      {`| Name: ${item?.user?.fullname} ${item?.user?.family_name || ''}`}
                                    </h4>

                                    {Object.keys(JSON.parse(item.fields)).map(
                                      (inner_item, inner_index) => {
                                        // if (item.fields) {
                                        //   let a = JSON.parse(item?.fields);

                                        //   console.log(a);
                                        //   // a.filter((item) => {
                                        //   //   console.log(item.signature_);
                                        //   // });
                                        // }
                                        {
                                          {
                                            (Object.keys(
                                              JSON.parse(item.fields)
                                            )[inner_index].includes('headings') ||
                                              Object.keys(
                                                JSON.parse(item.fields)
                                              )[inner_index] ===
                                                'text_headings') &&
                                              count++;
                                          }
                                        }
                                        return (
                                          <div
                                            key={inner_index}
                                            sss
                                            className="responses-content-box"
                                            style={{ marginTop: '12px' }}
                                          >
                                            <div className="responses-content-question">
                                              {!(
                                                Object.keys(
                                                  JSON.parse(item.fields)
                                                )[inner_index].includes('headings') ||
                                                Object.keys(
                                                  JSON.parse(item.fields)
                                                )[inner_index] ===
                                                  'text_headings'
                                              ) && (
                                                <span>
                                                  {inner_index + 1 - count}
                                                </span>
                                              )}
                                              {Object.keys(
                                                JSON.parse(item.fields)
                                              )[inner_index].includes('headings') ? (
                                                <h6
                                                  className="text-capitalize"
                                                  style={{
                                                    fontSize: '20px',
                                                    color: '#AA0061',
                                                  }}
                                                >
                                                  {
                                                    Object.values(
                                                      JSON.parse(item.fields)
                                                    )[inner_index]
                                                  }
                                                </h6>
                                              ) : Object.keys(
                                                  JSON.parse(item.fields)
                                                )[inner_index] ===
                                                'text_headings' ? (
                                                <h6
                                                  className="text-capitalize"
                                                  style={{
                                                    fontSize: '16px',
                                                    color: '#455c58',
                                                  }}
                                                >
                                                  {
                                                    Object.values(
                                                      JSON.parse(item.fields)
                                                    )[inner_index]
                                                  }
                                                </h6>
                                              ) : (
                                                <h6 className="text-capitalize">
                                                  {inner_item
                                                    .split('_')
                                                    .join(' ')}
                                                </h6>
                                              )}
                                            </div>
                                            <div className="responses-content-answer">
                                              {!(
                                                Object.keys(
                                                  JSON.parse(item.fields)
                                                )[inner_index].includes('headings') ||
                                                Object.keys(
                                                  JSON.parse(item.fields)
                                                )[inner_index] ===
                                                  'text_headings'
                                              ) && (
                                                <img
                                                  src="/img/bx_right-arrow-alt.svg"
                                                  alt=""
                                                />
                                              )}

                                              {Object.values(
                                                JSON.parse(item.fields)
                                              )[inner_index]?.includes(
                                                'data:image'
                                              ) ||
                                              Object.values(
                                                JSON.parse(item.fields)
                                              )[inner_index]?.includes(
                                                '.png'
                                              ) ||
                                              Object.values(
                                                JSON.parse(item.fields)
                                              )[inner_index]?.includes(
                                                '.jpg'
                                              ) ||
                                              Object.values(
                                                JSON.parse(item.fields)
                                              )[inner_index]?.includes(
                                                '.jpeg'
                                              ) ? (
                                                <>
                                                  {/* {console.log('INNER INDEX:', inner_index)}
                                                  {console.log('ITEM FIELDS:', item.fields)}
                                                  {console.log('>>>>><<<<<', Object.values(
                                                        JSON.parse(item.fields)
                                                      )[inner_index])} */}
                                                  <img
                                                    style={{
                                                      height: '40px',
                                                      width: '51px',
                                                    }}
                                                    alt="img"
                                                    src={`${
                                                      Object.values(
                                                        JSON.parse(item.fields)
                                                      )[inner_index]
                                                    }`}
                                                  ></img>
                                                </>
                                              ) : Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.doc'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.docx'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.html'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.htm'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.odt'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.xls'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.xlsx'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  'ods'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.ppt'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.pptx'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.pdf'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.txt'
                                                ) ? (
                                                <a
                                                  role="button"
                                                  href={
                                                    Object.values(
                                                      JSON.parse(item.fields)
                                                    )[inner_index]
                                                  }
                                                  download
                                                >
                                                  <p>
                                                    {
                                                      Object.values(
                                                        JSON.parse(item.fields)
                                                      )[inner_index].split('/')[
                                                        Object.values(
                                                          JSON.parse(
                                                            item.fields
                                                          )
                                                        )[inner_index].split(
                                                          '/'
                                                        ).length - 1
                                                      ]
                                                    }
                                                  </p>
                                                </a>
                                              ) : (
                                                !(
                                                  Object.keys(
                                                    JSON.parse(item.fields)
                                                  )[inner_index].includes('headings') ||
                                                  Object.keys(
                                                    JSON.parse(item.fields)
                                                  )[inner_index] ===
                                                    'text_headings'
                                                ) && (
                                                  <p>
                                                    {
                                                      Object.values(
                                                        JSON.parse(item.fields)
                                                      )[inner_index]
                                                    }
                                                  </p>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                );
                              })}
                              {location?.state?.signature_access &&
                                item.signature_button &&
                                index !== indexToHide  && (
                                  <Button
                                    onClick={() => {
                                      setSignatureModel(true);
                                      setIndex(index);
                                      setIndexToHide(index);
                                    }}
                                  >
                                    Add Signature
                                  </Button>
                                )}
                            </Accordion.Body>
                          </Accordion.Item>
                        )
                        : (
                          <Accordion.Item key={index} eventKey={index}>
                            <Accordion.Header>
                              <div className="responses-header-row">
                                <div className="responses-header-left">
                                  <div className="responses-header-image">
                                    <img
                                      src={
                                        item[0]?.filled_user?.profile_photo
                                          ? item[0]?.filled_user?.profile_photo
                                          : '/img/upload.jpg'
                                      }
                                      alt=""
                                    />
                                  </div>
                                  {responseData[index]?.map(
                                    (inner_item, inner_index) => {
                                      return (
                                        <div
                                          key={inner_index}
                                          className={
                                            responseData[index].length - 1 ===
                                              inner_index ||
                                            (inner_index > 0 &&
                                              responseData[index][
                                                inner_index - 1
                                              ]?.filled_user?.fullname?.includes(
                                                inner_item?.filled_user
                                                  ?.fullname
                                              ))
                                              ? 'responses-header-detail'
                                              : 'responses-header-detail response-header-left-line'
                                          }
                                        >
                                          <div className="d-flex">
                                            <h5>
                                              {inner_index > 0
                                                ? !responseData[index][
                                                    inner_index - 1
                                                  ].filled_user?.fullname?.includes(
                                                    inner_item?.filled_user
                                                      ?.fullname
                                                  ) &&
                                                  inner_item?.filled_user
                                                    ?.fullname
                                                : inner_item?.filled_user
                                                    ?.fullname}
                                            </h5>

                                            {item[inner_index].isEditTime !=
                                              null &&
                                            moment(
                                              item[inner_index].isEditTime
                                            ).format() > moment().format() ? (
                                              <span
                                                style={{
                                                  fontSize: '12px',
                                                  paddingLeft: '12px',
                                                }}
                                              >
                                                Currently in editing mode <br />
                                                [Refresh the page after some
                                                time]
                                              </span>
                                            ) : (
                                              formData &&
                                              inner_index === 0 &&
                                              (formData?.form_type ===
                                                'editable' ||
                                                formData?.form_type ===
                                                  'multi_submission') && (
                                                <Link
                                                  style={{
                                                    marginLeft: '5px',
                                                  }}
                                                  to={`/form/dynamic/${formData.form_name}`}
                                                  state={{
                                                    id: item[inner_index]?.id,
                                                    form_id: id ? id : null,
                                                  }}
                                                >
                                                  {console.log(
                                                    'item[index]?.id--->',
                                                    item[inner_index]
                                                  )}
                                                  {/* <div
                                                  className="edit-icon-form"
                                                  onClick={() => {
                                                    alert(
                                                      'Hello--->' +
                                                        inner_index
                                                    );
                                                    navigate(
                                                      `/form/dynamic/${formData.form_name}`,
                                                      {
                                                        state: {
                                                          id: item[index].id,
                                                          form_id: id,
                                                        },
                                                      }
                                                    );
                                                  }}
                                                > */}
                                                  <FontAwesomeIcon
                                                    icon={faPen}
                                                  />
                                                </Link>
                                              )
                                            )}
                                          </div>
                                          <h6>
                                            <span className="text-capitalize">
                                              {inner_index > 0
                                                ? !responseData[index][
                                                    inner_index - 1
                                                  ]?.filled_user?.role
                                                    .split('_')
                                                    .join(' ')
                                                    .includes(
                                                      inner_item?.filled_user?.role
                                                        .split('_')
                                                        .join(' ')
                                                    ) &&
                                                  inner_item?.filled_user?.role
                                                    .split('_')
                                                    .join(' ') + ','
                                                : inner_item?.filled_user?.role
                                                    .split('_')
                                                    .join(' ') + ','}
                                            </span>{' '}
                                            {inner_index > 0
                                              ? !responseData[index][
                                                  inner_index - 1
                                                ].filled_user?.franchisee?.franchisee_name.includes(
                                                  inner_item?.filled_user
                                                    ?.franchisee
                                                    ?.franchisee_name
                                                ) &&
                                                inner_item?.filled_user
                                                  ?.franchisee?.franchisee_name
                                              : inner_item?.filled_user
                                                  ?.franchisee?.franchisee_name}
                                          </h6>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>

                                <div className="responses-header-right">
                                  {item[0]?.updated ? (
                                    <p>
                                      Last Updated By :{' '}
                                      {item[0]?.updatedByUsers[0]?.fullname}{' '}
                                      <br />
                                      Updated on: <br />
                                      {moment(item[0].updatedAt).format(
                                        'DD/MM/YYYY'
                                      ) +
                                        ', ' +
                                        moment(item[0].updatedAt)
                                          .subtract(13, 'hours')
                                          .utc()
                                          .format('HH:mm')}
                                      hrs
                                    </p>
                                  ) : (
                                    <p>
                                      Completed By :{' '}
                                      {item[0]?.filled_user?.fullname} <br />
                                      Completed on: <br />
                                      {moment(item[0].createdAt).format(
                                        'DD/MM/YYYY'
                                      ) +
                                        ', ' +
                                        moment(item[0].createdAt)
                                          .subtract(13, 'hours')
                                          .utc()
                                          .format('HH:mm')}
                                      hrs{' '}
                                    </p>
                                  )}
                                  {/* <p>
                                    Completed on: <br />
                                    {moment(item[0].createdAt)
                                      .utcOffset('+11:00')
                                      .format('DD/MM/YYYY') +
                                      ', ' +
                                      item[0].createdAt
                                        .split('T')[1]
                                        .split('.')[0]
                                        .split(':', 2)
                                        .join(':') +
                                      ' hrs'}
                                  </p> */}
                                </div>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body>
                              {console.log('RESPONSE DATA:', JSON.parse(responseData[0][0].fields))}
                              {responseData[index]?.map((item, index) => {

                                console.log("index index index index ", index)
                                return (
                                  <div
                                    key={index}
                                    className={
                                      index === 0
                                        ? 'responses-content-wrap'
                                        : 'responses-content-wrap response-margin'
                                    }
                                  >
                                    <h4 className="content-wrap-title text-capitalize">
                                      {/* Filled By {item?.filled_user?.fullname}{' '} */}
                                      {item?.filled_user?.fullname}{' '}
                                      {!item.section_name ||
                                         (item.section_name !== '' &&
                                          `| ${item.section_name
                                            .split('_')
                                            .join(' ')} Section`)}{' '}
                                      {`| Name: ${item?.user?.fullname} ${item?.user?.family_name || ''}`}
                                    </h4>

                                    {Object.keys(JSON.parse(item.fields)).map(
                                      (inner_item, inner_index) => {
                                        // if (item.fields) {
                                        //   let a = JSON.parse(item?.fields);

                                        //   console.log(a);
                                        //   // a.filter((item) => {
                                        //   //   console.log(item.signature_);
                                        //   // });
                                        // }
                                        {
                                          {
                                            (Object.keys(
                                              JSON.parse(item.fields)
                                            )[inner_index].includes('headings') ||
                                              Object.keys(
                                                JSON.parse(item.fields)
                                              )[inner_index] ===
                                                'text_headings') &&
                                              count++;
                                          }
                                        }
                                        return (
                                          <div
                                            key={inner_index}
                                            sss
                                            className="responses-content-box"
                                            style={{ marginTop: '12px' }}
                                          >
                                            <div className="responses-content-question">
                                              {!(
                                                Object.keys(
                                                  JSON.parse(item.fields)
                                                )[inner_index].includes('headings') ||
                                                Object.keys(
                                                  JSON.parse(item.fields)
                                                )[inner_index] ===
                                                  'text_headings'
                                              ) && (
                                                <span>
                                                  {inner_index + 1 - count}
                                                </span>
                                              )}
                                              {Object.keys(
                                                JSON.parse(item.fields)
                                              )[inner_index].includes('headings') ? (
                                                <h6
                                                  className="text-capitalize"
                                                  style={{
                                                    fontSize: '20px',
                                                    color: '#AA0061',
                                                  }}
                                                >
                                                  {
                                                    Object.values(
                                                      JSON.parse(item.fields)
                                                    )[inner_index]
                                                  }
                                                </h6>
                                              ) : Object.keys(
                                                  JSON.parse(item.fields)
                                                )[inner_index] ===
                                                'text_headings' ? (
                                                <h6
                                                  className="text-capitalize"
                                                  style={{
                                                    fontSize: '16px',
                                                    color: '#455c58',
                                                  }}
                                                >
                                                  {
                                                    Object.values(
                                                      JSON.parse(item.fields)
                                                    )[inner_index]
                                                  }
                                                </h6>
                                              ) : (
                                                <h6 className="text-capitalize">
                                                  {inner_item
                                                    .split('_')
                                                    .join(' ')}
                                                </h6>
                                              )}
                                            </div>
                                            <div className="responses-content-answer">
                                              {!(
                                                Object.keys(
                                                  JSON.parse(item.fields)
                                                )[inner_index].includes('headings') ||
                                                Object.keys(
                                                  JSON.parse(item.fields)
                                                )[inner_index] ===
                                                  'text_headings'
                                              ) && (
                                                <img
                                                  src="/img/bx_right-arrow-alt.svg"
                                                  alt=""
                                                />
                                              )}

                                              {Object.values(
                                                JSON.parse(item.fields)
                                              )[inner_index]?.includes(
                                                'data:image'
                                              ) ||
                                              Object.values(
                                                JSON.parse(item.fields)
                                              )[inner_index]?.includes(
                                                '.png'
                                              ) ||
                                              Object.values(
                                                JSON.parse(item.fields)
                                              )[inner_index]?.includes(
                                                '.jpg'
                                              ) ||
                                              Object.values(
                                                JSON.parse(item.fields)
                                              )[inner_index]?.includes(
                                                '.jpeg'
                                              ) ? (
                                                <>
                                                  {/* {console.log('INNER INDEX:', inner_index)}
                                                  {console.log('ITEM FIELDS:', item.fields)}
                                                  {console.log('>>>>><<<<<', Object.values(
                                                        JSON.parse(item.fields)
                                                      )[inner_index])} */}
                                                  <img
                                                    style={{
                                                      height: '40px',
                                                      width: '51px',
                                                    }}
                                                    alt="img"
                                                    src={`${
                                                      Object.values(
                                                        JSON.parse(item.fields)
                                                      )[inner_index]
                                                    }`}
                                                  ></img>
                                                </>
                                              ) : Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.doc'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.docx'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.html'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.htm'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.odt'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.xls'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.xlsx'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  'ods'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.ppt'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.pptx'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.pdf'
                                                ) ||
                                                Object.values(
                                                  JSON.parse(item.fields)
                                                )[inner_index]?.includes(
                                                  '.txt'
                                                ) ? (
                                                <a
                                                  role="button"
                                                  href={
                                                    Object.values(
                                                      JSON.parse(item.fields)
                                                    )[inner_index]
                                                  }
                                                  download
                                                >
                                                  <p>
                                                    {
                                                      Object.values(
                                                        JSON.parse(item.fields)
                                                      )[inner_index].split('/')[
                                                        Object.values(
                                                          JSON.parse(
                                                            item.fields
                                                          )
                                                        )[inner_index].split(
                                                          '/'
                                                        ).length - 1
                                                      ]
                                                    }
                                                  </p>
                                                </a>
                                              ) : (
                                                !(
                                                  Object.keys(
                                                    JSON.parse(item.fields)
                                                  )[inner_index].includes('headings') ||
                                                  Object.keys(
                                                    JSON.parse(item.fields)
                                                  )[inner_index] ===
                                                    'text_headings'
                                                ) && (
                                                  <p>
                                                    {
                                                      Object.values(
                                                        JSON.parse(item.fields)
                                                      )[inner_index]
                                                    }
                                                  </p>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                );
                              })}
                              {location?.state?.signature_access &&
                                item.signature_button &&
                                index !== indexToHide  && (
                                  <Button
                                    onClick={() => {
                                      setSignatureModel(true);
                                      setIndex(index);
                                      setIndexToHide(index);
                                    }}
                                  >
                                    Add Signature
                                  </Button>
                                )}
                            </Accordion.Body>
                          </Accordion.Item>
                        )
                      })}
                    </Accordion>
                  ) : (
                    <h4 style={{ fontWeight: '200', textAlign: 'center' }}>
                      No Response found
                    </h4>
                  )}
                </div>

                <Modal
                  className="responses_model"
                  show={signatureModel}
                  onHide={() => {
                    setSignatureModel(false);
                  }}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>
                      <img src="../img/survey.png" />
                      <h1>Add Signature</h1>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {location?.state?.signature_access && (
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label>Signature</Form.Label>
                          <SignaturePad
                            canvasProps={{
                              style: {
                                background: 'white',
                                border: '1px solid #e5e5e5',
                                width: '300px',
                                minHeight: '135px',
                                display: 'grid',
                              },
                            }}
                            ref={sigPad}
                          />
                          <div>
                            <button onClick={clear}>Clear</button>
                            <button
                              onClick={(e) => {
                                trim(e);
                              }}
                            >
                              Submit
                            </button>
                          </div>
                        </Form.Group>
                      </Col>
                    )}
                  </Modal.Body>
                </Modal>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
export default OwnFormResponse;
