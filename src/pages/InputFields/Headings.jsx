import { Form,Col } from "react-bootstrap";

const Headings = (props) => {
  const { ...controls } = props;
  return (
    <Col sm={12}>
    <Form.Group>
      <Form.Label>{controls.field_label}</Form.Label>
    </Form.Group>
    </Col>
  );
};
export default Headings;
