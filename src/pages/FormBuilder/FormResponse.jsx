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
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL, IGNORE_REMOVE_FORM } from '../../components/App';
import LeftNavbar from '../../components/LeftNavbar';
import { FullLoader } from '../../components/Loader';
import TopHeader from '../../components/TopHeader';
import SignaturePad from 'react-signature-canvas';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FormResponse(props) {
  const location = useLocation();
  const sigPad = useRef({});
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState([]);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem('token');
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);
  const [signatureModel, setSignatureModel] = useState(false);
  const [Index, setIndex] = useState(0);
  let hideFlag=false;

  useEffect(() => {
    console.log(':location?.state--->', location?.state);
    if (location?.state?.id) {
      getResponse('');
    } else {
      getAllForm();
    }
  }, []);
  const clear = (e) => {
    e.preventDefault();
    sigPad.current.clear();
    // props.onChange(controls.field_label.split(" ").join("_").toLowerCase(),"");
  };
  const trim = (e, index) => {
    e.preventDefault();
    console.log(
      'index--->',
      Index,
      '-----',
      JSON.parse(responseData[Index][0].fields)
    );
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('authorization', 'Bearer ' + token);
    let fields = JSON.parse(responseData[Index][0].fields);
    console.log(
      'sigpad--------->><<<<<<<<',
      sigPad.current.getTrimmedCanvas().toDataURL('image/png')
    );
    fields['signature'] = sigPad.current
      .getTrimmedCanvas()
      .toDataURL('image/png');
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        form_id: responseData[Index][0].form_id,
        user_id: responseData[Index][0].user_id,
        behalf_of: responseData[Index][0].behalf_of,
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
          hideFlag=true;
        }
      });

    // props.onChange(controls.field_label.split(" ").join("_").toLowerCase(),sigPad.current.getTrimmedCanvas().toDataURL("image/png"),"signature");
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
            getResponseTow(item.id);
          }
        });
      })
      .catch((error) => console.log('error', error));
  };
  const getResponse = (search) => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };

    fetch(
      `${BASE_URL}/form/response?search=${search}&form_id=${
        location?.state?.id ? location?.state?.id : 1
      }&user_id=${localStorage.getItem(
        'user_id'
      )}&user_role=${localStorage.getItem('user_role')}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        
        if (result) {
          setfullLoaderStatus(false);
        }
        result?.result.map((item, index) => {
          item["signature_button"]=true;
          console.log("item--->",item);
          result?.result[index]?.map((inner_item,inner_index)=>{
            // if(inner_item.fields)
            Object.keys(JSON.parse(inner_item.fields)).map((field_item)=>{
              console.log("inner_item--->",field_item);
              if(field_item==="signature")
              {
                item["signature_button"]=false;
              }
            })
          })
          if(result?.result?.length-1===index)
          {
            setResponseData(result?.result);
            setFormData(result?.form);
          }
        });
        
      })
      .catch((error) => console.log('error', error));
  };

  const getResponseTow = (id) => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };

    fetch(
      `${BASE_URL}/form/response?search=&form_id=${id}&user_id=2&user_role=franchisor_admin`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setResponseData(result?.result);
        setFormData(result?.form);
        if (result) {
          setfullLoaderStatus(false);
        }
      })
      .catch((error) => console.log('error', error));
  };

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
                      <h4 className="mynewForm">
                        {location?.state?.form_name
                          ? location?.state?.form_name
                          : 'Compliance Visit Form'}
                      </h4>
                    </div>
                  </Col>
                </Row>
                <div className="responses-forms-header-section forms-header-section">
                  <div className="forms-managment-section">
                    <div className="forms-managment-left">
                      <p>{responseData.length} Responses</p>
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
                              getResponse(e.target.value);
                            }}
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="responses-collapse">
                  {
                    <Accordion defaultActiveKey="0">
                      {responseData.map((item, index) => {
                        return (
                          <Accordion.Item eventKey={index}>
                            <Accordion.Header>
                              <div className="responses-header-row">
                                <div className="responses-header-left">
                                  <div className="responses-header-image">
                                    <img
                                      src={
                                        item[0]?.filled_user?.profile_photo
                                          ? item[0]?.filled_user?.profile_photo
                                          : '../img/small-user.png'
                                      }
                                      alt=""
                                    />
                                  </div>
                                  {responseData[index]?.map(
                                    (inner_item, inner_index) => {
                                      return (
                                        <div
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
                                          {/* {console.log("iner_itemwdasdasddassd---->",responseData[index].length)} */}
                                          {console.log(
                                            'iner_itemwdasdasddassd---->',
                                            inner_item
                                          )}
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
                                  <p>
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
                                  </p>
                                </div>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body>
                              {responseData[index]?.map((item, index) => {
                                return (
                                  <div
                                    className={
                                      index === 0
                                        ? 'responses-content-wrap'
                                        : 'responses-content-wrap response-margin'
                                    }
                                  >
                                    <h4 className="content-wrap-title text-capitalize">
                                      Filled By {item?.filled_user?.fullname}{' '}
                                      {!item.section_name ||
                                        (item.section_name !== '' &&
                                          `| ${item.section_name
                                            .split('_')
                                            .join(' ')} Section`)}{' '}
                                      {`| Behalf of ${item?.user?.fullname}`}
                                    </h4>

                                    {Object.keys(JSON.parse(item.fields)).map(
                                      (inner_item, inner_index) => {
                                        return (
                                          <div className="responses-content-box">
                                            <div className="responses-content-question">
                                              <span>{inner_index + 1}</span>
                                              <h6 className="text-capitalize">
                                                {inner_item
                                                  .split('_')
                                                  .join(' ')}
                                              </h6>
                                            </div>
                                            <div className="responses-content-answer">
                                              <img
                                                src="../img/bx_right-arrow-alt.svg"
                                                alt=""
                                              />

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
                                                  <img
                                                    src={`${
                                                      Object.values(
                                                        JSON.parse(item.fields)
                                                      )[inner_index]
                                                    }`}
                                                  ></img>
                                                </>
                                              ) : (
                                                <p>
                                                  {
                                                    Object.values(
                                                      JSON.parse(item.fields)
                                                    )[inner_index]
                                                  }
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                );
                              })}
                              {location?.state?.signature_access && item.signature_button && (
                                <Button
                                  onClick={() => {
                                    setSignatureModel(true);
                                    setIndex(index);
                                  }}
                                >
                                  Add Signature
                                </Button>
                              )}
                            </Accordion.Body>
                          </Accordion.Item>
                        );
                      })}
                    </Accordion>
                  }
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
                        {/* <p style={{ color: 'red' }}>
                                    {controls.error[controls.field_name]}
                                  </p> */}
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
export default FormResponse;
