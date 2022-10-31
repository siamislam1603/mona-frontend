import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { FullLoader } from '../../components/Loader';

const Select = (props) => {
  const { ...controls } = props;
  const [dropdownValue, setDropdownValue] = useState();

  useEffect(() => {
    if(typeof controls.field_data !== "undefined") {
      let val = controls.field_data.fields[`${controls.field_name}`];
      let availableOptions = JSON.parse(controls.option);
      let data = {};
      availableOptions.forEach((d, index) => {
        data = {...data, ...d};
      });
      let valueSelected = Object.keys(data).filter(d => d === val);
      setDropdownValue(valueSelected[0]);
    }
  }, [controls]);

  if (isEmpty(controls)) {
    return <FullLoader />;
  }

  return (
    <Col sm={6}>
      <div className="child_info_field sex">
        <span className="form-label">{controls.field_label}</span>
        <div className="d-flex mt-2"></div>
        <div className="btn-radio d-flex align-items-center">
          <Form.Select
            className="form-input-section"
            name={controls.field_name}
            value={dropdownValue || "Select"}
            disabled={props.isDisable ? props.isDisable : false}
            onChange={(e) => {
              setDropdownValue(e.target.value)
              props.onChange(e.target.name, e.target.value, 'select');
            }}
            isInvalid={!!controls.error[controls.field_name]}
          >
            <option>Select {controls.label}</option>
            {console.log(JSON.parse(controls.option))}
            {[...JSON.parse(controls.option)]?.map((item2, index) => {
              return (
                <option key={index}>
                  {Object.keys(item2)}
                </option>
              );
            })}
            {/* {eval(controls.option)?.map((item2, index) => {
              return (
                <>
                  {props !== {} && props.field_data !== {} ? (
                    props.field_data.fields[`${controls.field_name}`] ===
                    Object.keys(item2)[0] ? (
                      <option selected key={index}>
                        {Object.keys(item2)[0]}
                      </option>
                    ) : (
                      <option key={index}>{Object.keys(item2)[0]}</option>
                    )
                  ) : (
                    <option key={index}>{Object.keys(item2)[0]}</option>
                  )}
                </>
              );
            })} */}
          </Form.Select>
        </div>
        <p>{controls.error[controls.field_name]}</p>
      </div>
    </Col>
  );
};
export default Select;
