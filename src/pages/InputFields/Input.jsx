import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';

const Input = (props) => {
  let { ...controls } = props;
  const [dataValue, setDataValue] = useState('');

  if (controls.field_data == {} || controls.field_data == undefined) {
    delete controls.field_data;
  }
  useEffect(() => {
    let value;

    if (
      props !== {} &&
      props?.field_data !== {} &&
      !isEmpty(props?.field_data)
    ) {
      if (controls?.field_type === 'date') {
        value = moment(
          props?.field_data?.fields[`${controls?.field_name}`],
          'YYYY-MM-DD'
        ).format('YYYY-MM-DD');
        setDataValue(value);
      } else {
        value = props?.field_data?.fields[`${controls?.field_name}`] || '';
        setDataValue(value);
      }
    }
  }, [props]);

  useEffect(() => {
    if (props.errorFocus) {
      document.getElementById(props.errorFocus).focus();
    }
  }, []);

  return (
    <Col sm={6}>
      <Form.Group className="form-input-section">
        <Form.Label>{controls?.field_label}</Form.Label>
        <Form.Control
          type={controls?.field_type}
          id={controls?.field_name}
          name={controls?.field_name}
          maxLength={255}
          disabled={
            (props?.currentForm[0]?.form_permissions[0]?.fill_access_users ===
              null &&
              !props?.form_field_permissions[0]?.fill_access_users?.includes(
                localStorage.getItem('user_role') === 'guardian'
                  ? 'parent'
                  : localStorage.getItem('user_role')
              )) ||
            (props?.currentForm[0]?.form_permissions[0]?.fill_access_users &&
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
            if (controls?.field_type === 'date') {
              setDataValue(
                moment(e.target.value, 'YYYY-MM-DD').format('YYYY-MM-DD')
              );
            } else {
              setDataValue(e.target.value);
            }

            props.onChange(e.target.name, e.target.value, controls?.field_type);
          }}
          value={dataValue || props?.field_data?.fields?.[controls?.field_name]}
          isInvalid={!!controls.error[controls?.field_name]}
        />
        {controls?.field_type === 'text' && (
          <p
            style={{ fontSize: '12px', marginBottom: '3px', marginLeft: '79%' }}
          >
            (Text Limit : 250)
          </p>
        )}
        <Form.Control.Feedback type="invalid">
          {controls?.error[controls?.field_name]}
        </Form.Control.Feedback>
      </Form.Group>
    </Col>
  );
};
export default Input;
