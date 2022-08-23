import { Col, Form } from 'react-bootstrap';
const Checkbox = (props) => {
  const { ...controls } = props;
  return (
    <Col sm={6}>
      <div className="child_info_field sex">
        <label className="form-label">{controls.field_label}:</label>
        <div className="d-flex mt-2"></div>
        <div className="btn-radio d-flex align-items-center modal-two-check dynamic-form-check">
          {console.log('eval(controls.option)', eval(controls.option))}
          {eval(controls.option)?.map((item2) => {
            return (
              <>
                <label className="container">
                  {Object.keys(item2)[0]}
                  <input
                    type="checkbox"
                    name={controls.field_name}
                    id={Object.keys(item2)[0]}
                    value={Object.keys(item2)[0]}
                    onClick={(e) => {
                      props.onChange(e.target.name, e.target.value);
                    }}
                  />
                  <span className="checkmark"></span>
                </label>
              </>
            );
          })}
        </div>
        <p className="error">{controls.error[controls.field_name]}</p>
      </div>
    </Col>
  );
};
export default Checkbox;
