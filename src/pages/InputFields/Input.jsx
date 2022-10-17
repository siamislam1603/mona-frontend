import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';
import { Form, Col } from 'react-bootstrap';

const Input = (props) => {
  let { ...controls } = props;
  if (controls.field_data == {} || controls.field_data == undefined) {
    delete controls.field_data;
  }
  let value;
  if (props !== {} && props?.field_data !== {} && !isEmpty(props?.field_data)) {
    if (controls?.field_type === 'date') {
      value = moment(
        props?.field_data?.fields[`${controls?.field_name}`],
        'DD-MM-YYYY'
      ).format('YYYY-MM-DD');
    } else {
      value = props?.field_data?.fields[`${controls?.field_name}`];
    }
  }
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
          disabled={props.isDisable ? props.isDisable : false}
          onChange={(e) => {
            props.onChange(e.target.name, e.target.value, controls?.field_type);
          }}
          value={value}
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
