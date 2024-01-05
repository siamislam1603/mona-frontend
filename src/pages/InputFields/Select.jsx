import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { FullLoader } from '../../components/Loader';

const Select = (props) => {
  const { ...controls } = props;
  // console.log('Controls:', controls);
  const [dropdownValue, setDropdownValue] = useState();
  const [options, setOptions] = useState();
  const [textInputValue, setTextInputValue] = useState('');

  useEffect(() => {
    if (
      typeof controls.field_data !== 'undefined' &&
      Object.keys(controls.field_data).length > 0
    ) {
      let val = controls.field_data.fields[`${controls.field_name}`];
      let availableOptions = JSON.parse(controls.option);
      let data = {};
      availableOptions.forEach((d, index) => {
        data = { ...data, ...d };
      });
      let valueSelected = Object.keys(data).filter((d) => d === val);
      setDropdownValue(valueSelected[0]);
    }
  }, [controls]);

  useEffect(() => {
    if (
      props.option &&
      typeof props.option !== 'undefined' &&
      props.option !== 'null' &&
      Object(props.option).length !== 0
    ) {
      let optionsData = eval(props.option);
      let optionsKeys = optionsData.map((item) => Object.keys(item));
      let optionsValues = optionsData.map((item) => Object.values(item));
      let newOptionsObj = {};
      optionsKeys.forEach((item, index) => {
        newOptionsObj = { ...newOptionsObj, [item]: optionsValues[index][0] };
      });
      setOptions(newOptionsObj);
    }
  }, []);

  if (isEmpty(controls)) {
    return <FullLoader />;
  }

  return (
    <>
      <Col sm={6}>
        <div className="child_info_field sex">
          <span className="form-label">{controls.field_label}</span>
          <div className="d-flex mt-2"></div>
          <div className="btn-radio d-flex align-items-center">
            <Form.Select
              className="form-input-section"
              name={controls.field_name}
              value={dropdownValue || 'Select'}
              disabled={
                (props?.currentForm[0]?.form_permissions[0]
                  ?.fill_access_users === null &&
                  !props?.form_field_permissions[0]?.fill_access_users?.includes(
                    localStorage.getItem('user_role') === 'guardian'
                      ? 'parent'
                      : localStorage.getItem('user_role')
                  )) ||
                (props?.currentForm[0]?.form_permissions[0]
                  ?.fill_access_users &&
                  !props?.currentForm[0]?.form_permissions[0]?.fill_access_users?.includes(
                    localStorage.getItem('user_role') === 'guardian'
                      ? 'parent'
                      : localStorage.getItem('user_role')
                  ) &&
                  !props?.form_field_permissions[0]?.fill_access_users?.includes(
                    localStorage.getItem('user_role') === 'guardian'
                      ? 'parent'
                      : localStorage.getItem('user_role')
                  )) ||
                props.isDisable
              }
              onChange={(e) => {
                setDropdownValue(e.target.value);
                props.onChange(e.target.name, e.target.value, 'select');
              }}
              isInvalid={!!controls.error[controls.field_name]}
            >
              <option>Select {controls.label}</option>
              {[...JSON.parse(controls.option)]?.map((item2, index) => {
                return <option key={index}>{Object.keys(item2)}</option>;
              })}
            </Form.Select>
          </div>
          <p>{controls.error[controls.field_name]}</p>
        </div>
      </Col>

      {typeof dropdownValue !== 'undefined' &&
        typeof options[dropdownValue] !== 'undefined' &&
        typeof options[dropdownValue] === 'object' && (
          <Col sm={6}>
            <Form.Group>
              <Form.Label>{options[dropdownValue]?.field_label}</Form.Label>
              <Form.Control
                type={options[dropdownValue]?.field_type}
                name={options[dropdownValue]?.field_name}
                onChange={(e) => {
                  props.onChange(e.target.name, e.target.value);
                  setTextInputValue(e.target.value);
                }}
                value={
                  (props.field_data &&
                    typeof props.field_data !== 'undefined' &&
                    Object.keys(props.field_data).length > 0 &&
                    props.field_data?.fields[
                      options[dropdownValue]?.field_name
                    ]) ||
                  textInputValue
                }
              />
            </Form.Group>
          </Col>
        )}
    </>
  );
};
export default Select;
