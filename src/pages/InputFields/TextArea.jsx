import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';

const TextArea = (props) => {
  const { ...controls } = props;

  let value;
  if (props !== {} && props?.field_data !== {} && !isEmpty(props?.field_data)) {
    value =
      props?.field_data && props?.field_data?.fields[`${controls.field_name}`];
  }

  useEffect(() => {
    if (props.errorFocus) {
      document.getElementById(props.errorFocus).focus();
    }
  }, []);

  return (
    <Col sm={6}>
      <div className="child_info_field">
        <Form.Label>{controls.field_label}</Form.Label>

        <Form.Control
          as="textarea"
          rows={controls.row ? controls.row : 3}
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
          name={controls.field_name}
          maxLength={2000}
          className="child_input"
          placeholder={controls.placeholder}
          value={value}
          onChange={(e) => {
            e.preventDefault();
            console.log('VALUE OF TEXT AREA:', e.target.value);
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
