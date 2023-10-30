import { Form, Col } from 'react-bootstrap';
import { useEffect } from 'react';

const Headings = (props) => {
  const { ...controls } = props;

  // useEffect(() => {
  //   props.onChange(props?.field_name, '', props?.field_type);
  // }, []);

  return (
    <Col sm={12} className="main-form-heading-title">
      <br />
      <Form.Group>
        <Form.Label className="form-style-headings">
          {controls.field_label}
        </Form.Label>
      </Form.Group>
    </Col>
  );
};
export default Headings;
