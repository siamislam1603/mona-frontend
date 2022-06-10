import { Form,Col } from "react-bootstrap";

const ImageUpload = (props) => {
  const { ...controls } = props;
  return (
    <Col sm={6}>
    <Form.Group>
      <Form.Label>{controls.field_label}</Form.Label>

      <Form.Control
        type="file"
        name={controls.field_name}
        onChange={(e) => {
          props.onChange(e.target.name, e.target.files);
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
export default ImageUpload;
