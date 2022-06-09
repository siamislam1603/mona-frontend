import React, { useState } from "react";
import { Form } from "react-bootstrap";
// let default_checked_value;
const Radio = (props) => {
  const { ...controls } = props;
  const [optionValue, setOpionValue] = useState("");
  //   const [defaultValueCheck, setDefaultValueCheck] = useState(
  //     controls?.default_value
  //   );
  //   default_checked_value = defaultValueCheck;

  return (
    <>
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
                        }}
                      />
                      <span className="radio-round"></span>
                      <p>{Object.keys(item)[0]}</p>
                    </label>
                  </div>
                ) : (
                  <div className="new-form-radio-box">
                    <label for={Object.keys(item)[0]}>
                      <input
                        type="radio"
                        value={Object.keys(item)[0]}
                        name={controls.field_name}
                        id={Object.keys(item)[0]}
                        onClick={(e) => {
                          props.onChange(e.target.name, e.target.value);
                        }}
                      />
                      <span className="radio-round"></span>
                      <p>{Object.keys(item)[0]}</p>
                    </label>
                  </div>
                )}
              </>
            );
          })}
        </div>
        <p className="error">{controls.error[controls.field_name]}</p>
      </Form.Group>
    </>
  );
};
export default Radio;
