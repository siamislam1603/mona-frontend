import { Form,Col } from "react-bootstrap";

const Input = (props) => {
  const { ...controls } = props;
  return (
    <Col sm={6}>
    <Form.Group className="form-input-section">
      <Form.Label>{controls.field_label}</Form.Label>
      <Form.Control
        type={controls.field_type}
        name={controls.field_name}
        maxLength={255}
        onChange={(e) => {
          props.onChange(e.target.name, e.target.value,controls.field_type);
        }}
        value={props.field_data && props.field_data.fields[`${controls.field_name}`]}
        isInvalid={!!controls.error[controls.field_name]}
      />
      <p style={{fontSize:"12px",marginBottom:"3px",marginLeft:"80%"}}>(Word Limit :250)</p>
      <Form.Control.Feedback type="invalid">
        {controls.error[controls.field_name]}
      </Form.Control.Feedback>
    </Form.Group>
    </Col>
  );
};
export default Input;
