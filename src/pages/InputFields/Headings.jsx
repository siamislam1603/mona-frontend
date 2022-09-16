import { Form,Col } from "react-bootstrap";

const Headings = (props) => {
  const { ...controls } = props;
  return (
    <Col sm={12} className="main-form-heading-title">
    <br/>
    <Form.Group>
      <Form.Label className="form-style-headings">{controls.field_label}</Form.Label>
    </Form.Group>
    </Col>
  );
};
export default Headings;

