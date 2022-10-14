import { useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';

const TextArea = (props) => {
  useEffect(() => {
    if (props.errorFocus) {
      document.getElementById(props.errorFocus).focus();
    }
  }, []);
  const { ...controls } = props;
  return (
    <Col sm={6}>
      <div className="child_info_field">
        <Form.Label>{controls.field_label}</Form.Label>

        <Form.Control
          as="textarea"
          rows={controls.row ? controls.row : 3}
          disabled={props.isDisable ? props.isDisable : false}
          name={controls.field_name}
          maxLength={2000}
          className="child_input"
          placeholder={controls.placeholder}
          value={
            props.field_data &&
            props.field_data.fields[`${controls.field_name}`]
          }
          onChange={(e) => {
            e.preventDefault();
            props.onChange(e.target.name, e.target.value, 'textarea');
          }}
          isInvalid={!!controls.error[controls.field_name]}
        />
        <p style={{ fontSize: '12px', marginBottom: '3px', marginLeft: '77%' }}>
          (Text Limit : 2000)
        </p>
        <Form.Control.Feedback type="invalid">
          {controls.error[controls.field_name]}
        </Form.Control.Feedback>
      </div>
    </Col>
  );
};
export default TextArea;
