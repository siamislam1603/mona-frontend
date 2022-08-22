import { Form,Col } from "react-bootstrap";

const Input = (props) => {
  const { ...controls } = props;
  return (
    <Col sm={6}>
    <Form.Group>
      <Form.Label>{controls.field_label}</Form.Label>

      <Form.Control
        type={controls.field_type}
        name={controls.field_name}
        onChange={(e) => {
          props.onChange(e.target.name, e.target.value);
        }}
        isInvalid={!!controls.error[controls.field_name]}
      />
      <Form.Control.Feedback type="invalid">
        {controls.error[controls.field_name]}
      </Form.Control.Feedback>
    </Form.Group>
    </Col>
  );
};
export default Input;
