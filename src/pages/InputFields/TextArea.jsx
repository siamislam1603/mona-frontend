import { Col, Form } from "react-bootstrap";

const TextArea = (props) => {
  const { ...controls } = props;
  return (
    <Col sm={6}>
      <div className="child_info_field">
        <span className="form-label">{controls.field_label}</span>
        <Form.Control
          as="textarea"
          rows={controls.row ? controls.row : 3}
          name={controls.field_name}
          className="child_input"
          placeholder={controls.placeholder}
          onChange={(e) => {
            e.preventDefault();
            props.onChange(e.target.name, e.target.value,"textarea");
          }}
          isInvalid={!!controls.error[controls.field_name]}
        />
        <Form.Control.Feedback type="invalid">
          {controls.error[controls.field_name]}
        </Form.Control.Feedback>
      </div>
    </Col>
  );
};
  export default TextArea;
