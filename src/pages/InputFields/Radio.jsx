import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
// let default_checked_value;
const Radio = (props) => {
  const { ...controls } = props;
  const [optionValue, setOptionValue] = useState("");
  const [Index, setIndex] = useState(0);
  //   const [defaultValueCheck, setDefaultValueCheck] = useState(
  //     controls?.default_value
  //   );
  //   default_checked_value = defaultValueCheck;

  return (
    <>
      <Col sm={6}>
        <Form.Group>
          <Form.Label>{controls.field_label}</Form.Label>
          <div className="new-form-radio">
            {eval(controls.option)?.map((item, index) => {
              return (
                <>
                  {console.log(
                    "eval(controls.option)",
                    Object.keys(eval(controls.option)[index])[0]
                  )}
                  {console.log(
                    "eval(controls.option)",
                    Object.values(eval(controls.option)[index])[0]
                  )}
                  {Object.keys(eval(controls.option)[index])[0] ===
                  Object.values(eval(controls.option)[index])[0] ? (
                    <div className="new-form-radio-box">
                      <label for={Object.keys(item)[0]}>
                        <input
                          type="radio"
                          value={Object.keys(item)[0]}
                          name={controls.field_name}
                          id={Object.keys(item)[0]}
                          onClick={(e) => {
                            props.onChange(e.target.name, e.target.value);
                            setOptionValue(e.target.value);
                            setIndex(index);
                          }}
                        />
                        <span className="radio-round"></span>
                        <p>{Object.keys(item)[0]}</p>
                      </label>
                    </div>
                  ) : (
                    <>
                      <div className="new-form-radio-box">
                        <label for={Object.keys(item)[0]}>
                          <input
                            type="radio"
                            value={Object.keys(item)[0]}
                            name={controls.field_name}
                            id={Object.keys(item)[0]}
                            onClick={(e) => {
                              props.onChange(e.target.name, e.target.value);
                              setOptionValue(e.target.value);
                              setIndex(index);
                            }}
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
      {optionValue ===
      Object.values(eval(controls.option)[Index])[0]["option_key"] ? (
        Object.values(eval(controls.option)[Index])[0]["field_type"] ===
        "radio" ? (
          <Col sm={6}>
            <Form.Group>
              <Form.Label>
                {Object.values(eval(controls.option)[Index])[0]["field_name"]}
              </Form.Label>
              <div className="new-form-radio">
                {Object.values(eval(controls.option)[Index])[0]["option"].map(
                  (item) => {
                    return (
                      <div className="new-form-radio-box">
                        <label for={Object.keys(item)[0]}>
                          <input
                            type="radio"
                            value={Object.values(item)[0]}
                            name={
                              Object.values(eval(controls.option)[Index])[0][
                                "field_name"
                              ]
                            }
                            id={Object.keys(item)[0]}
                            onClick={(e) => {
                              props.onChange(e.target.name, e.target.value);
                            }}
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
        ) : null
      ) : null}
    </>
  );
};
export default Radio;
