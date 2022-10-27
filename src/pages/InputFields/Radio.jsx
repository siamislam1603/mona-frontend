import React, { useEffect, useRef, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import SignaturePad from 'react-signature-canvas';
const Radio = (props) => {
  const { ...controls } = props;
  const [optionValue, setOptionValue] = useState('');
  const [Index, setIndex] = useState(0);
  const sigPad = useRef({});
  const clear = (e) => {
    e.preventDefault();
    sigPad.current.clear();
  };
  const trim = (e) => {
    e.preventDefault();
    props.onChange(sigPad.current.getTrimmedCanvas().toDataURL('image/png'));
  };
  useEffect(() => {
    if (props.errorFocus) {
      document.getElementById(props.errorFocus).focus();
    }
  }, []);

  useEffect(() => {
    if(typeof controls?.field_data !== "undefined" && Object.keys(controls?.field_data).length > 0) {
      setOptionValue(prevState => ({
        [controls?.field_name]: controls?.field_data?.fields[`${controls?.field_name}`]
      }));
    }
  }, [controls?.field_name])

  useEffect(() => {
    if(typeof props.setFieldData !== "undefined") {
      props?.setFieldData(prevState => ({
        ...prevState,
        fields: {...controls.field_data.fields, [controls?.field_name]: optionValue[`${controls.field_name}`]}
      }))
    }
  }, [optionValue]);

  return (
    <>
      <Col sm={6}>
        <Form.Group className="form-input-section">
          <Form.Label id={controls.field_name}>
            {controls.field_label}
          </Form.Label>
          <div className="new-form-radio flex_wrap_radio">
            {eval(controls?.option)?.map((item, index) => {
              return (
                <>
                  {console.log('CONTROLS:>>>>>>>>>>>>>>>', controls)}
                  {Object.keys(item)[0] === Object.keys(JSON.parse(controls?.option)[0])[0] ? (
                    <div className="new-form-radio-box">
                      <label htmlFor={Object.keys(item)[0] + props?.diff_index}>
                        <input
                          type="radio"
                          key={index}
                          value={Object.keys(item)[0]}
                          disabled={props.isDisable ? props.isDisable : false}
                          name={Object.keys(JSON.parse(controls.option)[0])[0]}
                          id={Object.keys(item)[0] + props?.diff_index}
                          onClick={(e) => {
                            console.log('NAME:', e.target.name);
                            console.log('VALUE:', e.target.value);
                            props.onChange(
                              controls?.field_name,
                              e.target.name,
                              e.target.value,
                              'radio'
                            );
                            setOptionValue(prevState => ({
                              [controls?.field_name]: e.target.value
                            }));
                            setIndex(index);
                          }}
                          checked={optionValue[`${controls?.field_name}`] === Object.keys(JSON.parse(controls?.option)[0])[0]}
                          // typeof controls.field_data !== "undefined" && Object.keys(controls.field_data).length > 0 && 
                          // checked={
                          //   props?.field_data &&
                          //   props?.field_data?.fields[
                          //     `${controls?.field_name}`
                          //   ] === Object.keys(item)[0]
                          // }
                        />
                        <span className="radio-round"></span>
                        <p>{Object.keys(item)[0]}</p>
                      </label>
                    </div>
                  ) : (
                    <>
                      <div className="new-form-radio-box">
                        <label
                          htmlFor={Object.keys(item)[0] + props?.diff_index}
                        >
                          <input
                            type="radio"
                            value={Object.keys(item)[0]}
                            key={index}
                            disabled={props.isDisable ? props.isDisable : false}
                            name={Object.keys(JSON.parse(controls.option)[1])[0]}
                            id={Object.keys(item)[0] + props?.diff_index}
                            onClick={(e) => {
                              props.onChange(
                                controls?.field_name,
                                e.target.name,
                                e.target.value,
                                'radio'
                              );
                              setOptionValue(prevState => ({
                                [controls?.field_name]: e.target.value
                              }));
                              setIndex(index);
                            }}
                            checked={optionValue[`${controls?.field_name}`] === Object.keys(JSON.parse(controls?.option)[1])[0]}
                            // checked={
                            //   props.field_data &&
                            //   props.field_data.fields[
                            //     `${controls.field_name}`
                            //   ] === Object.keys(item)[0]
                            // }
                          />
                          <span className="radio-round"></span>
                          <p>{Object.keys(item)[0]}</p>
                        </label>
                      </div>
                    </>
                  )}
                </>
              );
            })}
          </div>
          <p className="error">{controls.error[controls.field_name]}</p>
        </Form.Group>
      </Col>
      {props.field_data ||
        optionValue ===
        Object.values(eval(controls.option)[Index])[0]['option_key'] ? (
        Object.values(eval(controls.option)[Index])[0]['field_type'] ===
          'radio' ? (
          <Col sm={6}>
            <Form.Group>
              <Form.Label>
                {Object.values(eval(controls.option)[Index])[0]['field_name']}
              </Form.Label>
              <div className="new-form-radio">
                {Object.values(eval(controls.option)[Index])[0]['option'].map(
                  (item, index) => {
                    return (
                      <div className="new-form-radio-box">
                        <label htmlFor={Object.keys(item)[0]}>
                          <input
                            type={
                              Object.values(eval(controls.option)[Index])[0][
                              'field_type'
                              ]
                            }
                            key={index}
                            disabled={props.isDisable ? props.isDisable : false}
                            value={Object.values(item)[0]}
                            name={
                              Object.values(eval(controls.option)[Index])[0][
                              'field_name'
                              ]
                            }
                            id={Object.keys(item)[0]}
                            onClick={(e) => {
                              props.onChange(e.target.name, e.target.value);
                            }}
                            checked={
                              props.field_data &&
                              props.field_data.fields[
                              `${Object.values(
                                eval(controls.option)[Index]
                              )[0]['field_name']
                              }`
                              ] === Object.values(item)[0]
                            }
                          />
                          <span className="radio-round"></span>
                          <p>{Object.keys(item)[0]}</p>
                        </label>
                      </div>
                    );
                  }
                )}
              </div>
            </Form.Group>
          </Col>
        ) : Object.values(eval(controls.option)[Index])[0]['field_type'] ===
          'dropdown_selection' ? (
          <Col sm={6}>
            <div className="child_info_field sex">
              <span className="form-label">
                {Object.values(eval(controls.option)[Index])[0].field_label}
              </span>
              <div className="d-flex mt-2"></div>
              <div className="btn-radio d-flex align-items-center">
                <Form.Select
                  name={controls.field_name}
                  onChange={(e) => {
                    props.onChange(e.target.name, e.target.value);
                  }}
                >
                  <option>Select </option>
                  {Object.values(eval(controls.option)[Index])[0]['option'].map(
                    (item, index) => {
                      return (
                        <>
                          <option key={index}>{Object.keys(item)[0]}</option>
                        </>
                      );
                    }
                  )}
                </Form.Select>
              </div>
              <p>{controls.error[controls.field_name]}</p>
            </div>
          </Col>
        ) : Object.values(eval(controls.option)[Index])[0]['field_type'] ===
          'checkbox' ? (
          <Col sm={6}>
            <div className="child_info_field sex">
              <span>
                {Object.values(eval(controls.option)[Index])[0].field_label}:
              </span>
              <div className="d-flex mt-2"></div>
              <div className="btn-radio d-flex align-items-center">
                {Object.values(eval(controls.option)[Index])[0]['option'].map(
                  (item, index) => {
                    return (
                      <>
                        <label htmlFor={Object.keys(item)[0]}>
                          {Object.keys(item)[0]}
                        </label>
                        <Form.Check
                          type="checkbox"
                          className="checktest"
                          key={index}
                          name={
                            Object.values(eval(controls.option)[Index])[0]
                              .field_name
                          }
                          id={Object.keys(item)[0]}
                          value={Object.keys(item)[0]}
                          checked={
                            props.field_data &&
                            props.field_data.fields[
                              `${Object.values(eval(controls.option)[Index])[0]
                                .field_name
                              }`
                            ].includes(Object.keys(item)[0])
                          }
                          onClick={(e) => {
                            props.onChange(e.target.name, e.target.value);
                          }}
                        />
                      </>
                    );
                  }
                )}
              </div>
            </div>
          </Col>
        ) : Object.values(eval(controls.option)[Index])[0]['field_type'] ===
          'instruction_text' ? (
          <Col sm={6}>
            <div className="child_info_field">
              <span className="form-label">
                {Object.values(eval(controls.option)[Index])[0].field_label}:
              </span>
              <Form.Control
                as="textarea"
                rows={controls.row ? controls.row : 3}
                name={Object.values(eval(controls.option)[Index])[0].field_name}
                value={
                  props.field_data &&
                  props.field_data.fields[
                  `${Object.values(eval(controls.option)[Index])[0].field_name
                  }`
                  ]
                }
                className="child_input"
                onChange={(e) => {
                  e.preventDefault();
                  props.onChange(e.target.name, e.target.value);
                }}
              />
            </div>
          </Col>
        ) : Object.values(eval(controls.option)[Index])[0]['field_type'] ===
          'signature' ? (
          <Col sm={6}>
            <Form.Group>
              <Form.Label>
                {Object.values(eval(controls.option)[Index])[0].field_label}
              </Form.Label>
              <SignaturePad
                canvasProps={{
                  style: {
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    width: '700px',
                    height: '250px',
                  },
                }}
                ref={sigPad}
              />
              <div>
                <button
                  onClick={clear}
                  style={{ padding: '12px 35px', marginRight: '10px' }}
                >
                  Clear
                </button>
                <button onClick={trim} style={{ padding: '12px 35px' }}>
                  Trim
                </button>
              </div>
            </Form.Group>
          </Col>
        ) : Object.values(eval(controls.option)[Index])[0]['field_type'] ===
          'image_upload' ||
          Object.values(eval(controls.option)[Index])[0]['field_type'] ===
          'document_attachment' ? (
          <Col sm={6}>
            <Form.Group>
              <Form.Label>
                {Object.values(eval(controls.option)[Index])[0].field_label}
              </Form.Label>

              <Form.Control
                type="file"
                name={Object.values(eval(controls.option)[Index])[0].field_name}
                onChange={(e) => {
                  props.onChange(e.target.name, e.target.value);
                }}
              />
            </Form.Group>
          </Col>
        ) : (
          <>
            {Object.values(eval(controls.option)[Index])[0]?.field_name && (
              <Col sm={6}>
                <Form.Group>
                  <Form.Label>
                    {Object.values(eval(controls.option)[Index])[0].field_label}
                  </Form.Label>

                  <Form.Control
                    type={
                      Object.values(eval(controls.option)[Index])[0].field_type
                    }
                    name={
                      Object.values(eval(controls.option)[Index])[0].field_name
                    }
                    onChange={(e) => {
                      props.onChange(e.target.name, e.target.value);
                    }}
                    value={
                      props.field_data &&
                      props.field_data.fields[
                      `${Object.values(eval(controls.option)[Index])[0]
                        .field_name
                      }`
                      ]
                    }
                  />
                </Form.Group>
              </Col>
            )}
          </>
        )
      ) : null}
    </>
  );
};
export default Radio;

