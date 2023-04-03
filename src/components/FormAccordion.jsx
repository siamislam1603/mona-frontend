import React from 'react';
import moment from 'moment';
import { Accordion } from 'react-bootstrap';

function formatDate(dateString) {
  let date = moment(dateString).format('Do MMMM YYYY');
  let time = moment(dateString).format('HH:mm A');

  return `${date}, ${time}`;
}

function FormAccordion({ data: formResponse }) {
  let count = 0;

  return (
    <Accordion>
      {formResponse.map((item, index) => (
        <Accordion.Item key={index} eventKey={index}>
          <Accordion.Header>
            <div className="responses-header-row">
              <div className="responses-header-left">
                <div className="responses-header-image">
                  <img
                    src={
                      item?.user.profile_photo
                        ? item?.user.profile_photo
                        : '/img/upload.jpg'
                    }
                    alt="response filling user"
                  />
                </div>
                <div className={'responses-header-detail'}>
                  <div className="d-flex">
                    <h5>{item?.user?.fullname}</h5>
                  </div>
                  <h6>
                    <span className="text-capitalize">{item?.user?.role}</span>
                  </h6>
                </div>
              </div>
              <div className="responses-header-right">
                <p>Created At: {formatDate(item?.createdAt)}</p>
              </div>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            {/* {item.response.length > 0 &&
              item.response.map((response, index) => ( */}
            <div
              key={index}
              className={
                index === 0
                  ? 'responses-content-wrap'
                  : 'responses-content-wrap response-margin'
              }
            >
              <div className="content-wrap-title text-capitalize d-md-flex">
                <h4>Filled By: {item?.filled_by}</h4>
              </div>

              {Object.keys(JSON.parse(item.fields)).map(
                (inner_item, inner_index) => {
                  return (
                    <div
                      key={inner_index}
                      className="responses-content-box"
                      style={{ marginTop: '12px' }}
                    >
                      <div className="responses-content-question">
                        {!(
                          Object.keys(JSON.parse(item.fields))[inner_index] ===
                            'headings' ||
                          Object.keys(JSON.parse(item.fields))[inner_index] ===
                            'text_headings'
                        ) && <span>{inner_index + 1 - count}</span>}
                        {Object.keys(JSON.parse(item.fields))[inner_index] ===
                        'headings' ? (
                          <h6
                            className="text-capitalize"
                            style={{
                              fontSize: '20px',
                              color: '#AA0061',
                            }}
                          >
                            {
                              Object.values(JSON.parse(item.fields))[
                                inner_index
                              ]
                            }
                          </h6>
                        ) : Object.keys(JSON.parse(item.fields))[
                            inner_index
                          ] === 'text_headings' ? (
                          <h6
                            className="text-capitalize"
                            style={{
                              fontSize: '16px',
                              color: '#455c58',
                            }}
                          >
                            {
                              Object.values(JSON.parse(item.fields))[
                                inner_index
                              ]
                            }
                          </h6>
                        ) : (
                          <h6 className="text-capitalize">
                            {inner_item.split('_').join(' ')}
                          </h6>
                        )}
                      </div>
                      <div className="responses-content-answer">
                        {!(
                          Object.keys(JSON.parse(item.fields))[inner_index] ===
                            'headings' ||
                          Object.keys(JSON.parse(item.fields))[inner_index] ===
                            'text_headings'
                        ) && <img src="../img/bx_right-arrow-alt.svg" alt="" />}

                        {Object.values(JSON.parse(item.fields))[
                          inner_index
                        ]?.includes('data:image') ||
                        Object.values(JSON.parse(item.fields))[
                          inner_index
                        ]?.includes('.png') ||
                        Object.values(JSON.parse(item.fields))[
                          inner_index
                        ]?.includes('.jpg') ||
                        Object.values(JSON.parse(item.fields))[
                          inner_index
                        ]?.includes('.jpeg') ? (
                          <>
                            <img
                              style={{
                                height: '40px',
                                width: '51px',
                              }}
                              src={`${
                                Object.values(JSON.parse(item.fields))[
                                  inner_index
                                ]
                              }`}
                            ></img>
                          </>
                        ) : Object.values(JSON.parse(item.fields))[
                            inner_index
                          ]?.includes('.doc') ||
                          Object.values(JSON.parse(item.fields))[
                            inner_index
                          ]?.includes('.docx') ||
                          Object.values(JSON.parse(item.fields))[
                            inner_index
                          ]?.includes('.html') ||
                          Object.values(JSON.parse(item.fields))[
                            inner_index
                          ]?.includes('.htm') ||
                          Object.values(JSON.parse(item.fields))[
                            inner_index
                          ]?.includes('.odt') ||
                          Object.values(JSON.parse(item.fields))[
                            inner_index
                          ]?.includes('.xls') ||
                          Object.values(JSON.parse(item.fields))[
                            inner_index
                          ]?.includes('.xlsx') ||
                          Object.values(JSON.parse(item.fields))[
                            inner_index
                          ]?.includes('ods') ||
                          Object.values(JSON.parse(item.fields))[
                            inner_index
                          ]?.includes('.ppt') ||
                          Object.values(JSON.parse(item.fields))[
                            inner_index
                          ]?.includes('.pptx') ||
                          Object.values(JSON.parse(item.fields))[
                            inner_index
                          ]?.includes('.pdf') ||
                          Object.values(JSON.parse(item.fields))[
                            inner_index
                          ]?.includes('.txt') ? (
                          <a
                            role="button"
                            href={
                              Object.values(JSON.parse(item.fields))[
                                inner_index
                              ]
                            }
                            download
                          >
                            <p>
                              {
                                Object.values(JSON.parse(item.fields))[
                                  inner_index
                                ].split('/')[
                                  Object.values(JSON.parse(item.fields))[
                                    inner_index
                                  ].split('/').length - 1
                                ]
                              }
                            </p>
                          </a>
                        ) : (
                          !(
                            Object.keys(JSON.parse(item.fields))[
                              inner_index
                            ] === 'headings' ||
                            Object.keys(JSON.parse(item.fields))[
                              inner_index
                            ] === 'text_headings'
                          ) && (
                            <p>
                              {
                                Object.values(JSON.parse(item.fields))[
                                  inner_index
                                ]
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
            {/* ))} */}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export default FormAccordion;
