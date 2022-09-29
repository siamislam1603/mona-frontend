import { useEffect } from "react";
import { Form,Col } from "react-bootstrap";

const Input = (props) => {
  const { ...controls } = props;
  useEffect(()=>{
    if(props.errorFocus)
    {
      document.getElementById(props.errorFocus).focus();
    }
  },[])
  return (
    <Col sm={6}>
    <Form.Group className="form-input-section">
      <Form.Label>{controls.field_label}</Form.Label>
      <Form.Control
        type={controls.field_type}
        id={controls.field_name}
        name={controls.field_name}
        maxLength={255}
        onChange={(e) => {
          props.onChange(e.target.name, e.target.value,controls.field_type);
        }}
        value={props.field_data && props.field_data.fields[`${controls.field_name}`]}
        isInvalid={!!controls.error[controls.field_name]}
      />
      {controls.field_type==="text" && <p style={{fontSize:"12px",marginBottom:"3px",marginLeft:"79%"}}>(Word Limit : 250)</p>}
      <Form.Control.Feedback type="invalid" style={{marginTop:"-10px"}}>
        {controls.error[controls.field_name]}
      </Form.Control.Feedback>
    </Form.Group>
    </Col>
  );
};
export default Input;
