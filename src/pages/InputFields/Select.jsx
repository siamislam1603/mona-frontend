import { Col, Form } from "react-bootstrap";
const Select = (props) => {
  const { ...controls } = props;
  return (
    <Col sm={6}>
    <div className="child_info_field sex">
      <span className="form-label">{controls.field_label}</span>
      <div className="d-flex mt-2"></div>
      <div className="btn-radio d-flex align-items-center">
        <Form.Select className="form-input-section"
          name={controls.field_name}
          onChange={(e) => {
            props.onChange(e.target.name, e.target.value,"select");
          }}
        >
            <option>Select {controls.label}</option>
          {eval(controls.option)?.map((item2) => {
            return (
              <>
              <option>{Object.keys(item2)[0]}</option>
              </>
            );
          })}
        </Form.Select>
      </div>
      <p>{controls.error[controls.field_name]}</p>
    </div>
    </Col>
  );
};
export default Select;
