import React, { useState, useEffect } from 'react';
import { Accordion, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../components/App';
import LeftNavbar from '../../components/LeftNavbar';
import TopHeader from '../../components/TopHeader';

function FormResponse(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState([]);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    getResponse('');
    getResponseTow('');
  }, []);

  const getResponse = (search) => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };

    fetch(
      `${BASE_URL}/form/response?search=${search}&form_id=${location?.state?.id ? location?.state?.id : 1
      }&user_id=${localStorage.getItem(
        'user_id'
      )}&user_role=${localStorage.getItem('user_role')}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setResponseData(result?.result);
        setFormData(result?.form);
      })
      .catch((error) => console.log('error', error));
  };



  const getResponseTow = (search) => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };

    fetch(
      `${BASE_URL}/form/response?search=&form_id=11&user_id=2&user_role=franchisor_admin`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setResponseData(result?.result);
        setFormData(result?.form);
      })
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
                      <h4 className="mynewForm">My New Form</h4>
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
                                    <img src="../img/small-user.png" alt="" />
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
                                                ]?.user.fullname.includes(
                                                  inner_item.user.fullname
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
                                              ].user.fullname.includes(
                                                inner_item.user.fullname
                                              ) && inner_item.user.fullname
                                              : inner_item.user.fullname}
                                          </h5>
                                          <h6>
                                            <span className="text-capitalize">
                                              {inner_index > 0
                                                ? !responseData[index][
                                                  inner_index - 1
                                                ].user.role
                                                  .split('_')
                                                  .join(' ')
                                                  .includes(
                                                    inner_item?.user.role
                                                      .split('_')
                                                      .join(' ')
                                                  ) &&
                                                inner_item?.user.role
                                                  .split('_')
                                                  .join(' ') + ','
                                                : inner_item?.user.role
                                                  .split('_')
                                                  .join(' ') + ','}
                                            </span>{' '}
                                            {inner_index > 0
                                              ? !responseData[index][
                                                inner_index - 1
                                              ].user?.franchisee?.franchisee_name.includes(
                                                inner_item?.user?.franchisee
                                                  ?.franchisee_name
                                              ) &&
                                              inner_item?.user?.franchisee
                                                ?.franchisee_name
                                              : inner_item?.user?.franchisee
                                                ?.franchisee_name}
                                          </h6>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                                <div className="responses-header-right">
                                  <p>
                                    Completed on: <br />
                                    {item[0].createdAt.split('T')[0] +
                                      ', ' +
                                      item[0].createdAt
                                        .split('T')[1]
                                        .split('.')[0] +
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
                                      Filled By {item.user.fullname}{' '}
                                      {!item.section_name ||
                                        (item.section_name !== '' &&
                                          `| ${item.section_name} Section`)}
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
                                                    src={`${Object.values(
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
                            </Accordion.Body>
                          </Accordion.Item>
                        );
                      })}
                    </Accordion>
                  }
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
export default FormResponse;
