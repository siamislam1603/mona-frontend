import { useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
let value = {};
const Checkbox = (props) => {
  const { ...controls } = props;
  useEffect(() => {
    if (props.errorFocus) {
      document.getElementById(props.errorFocus).focus();
    }
    eval(controls.option)?.map((item2) => {
      value[controls.field_name] = '';
    });
  }, []);
  return (
    <Col sm={6}>
      <div className="child_info_field sex flex_wrap_checkbox">
        <label className="form-label" id={controls.field_name}>
          {controls.field_label}
        </label>
        <div className="d-flex mt-2"></div>
        <div className="btn-radio d-flex align-items-center modal-two-check dynamic-form-check">
          {eval(controls.option)?.map((item2,index) => {
            return (
              <>
                <label className="container">
                  {Object.keys(item2)[0]}
                  <input
                    type="checkbox"
                    key={index}
                    name={controls.field_name}
                    id={Object.keys(item2)[0]}
                    value={Object.keys(item2)[0]}
                    onClick={(e) => {
                      if (e.target.checked === true) {
                        value[controls.field_name] =
                          value[controls.field_name] + e.target.value + ',';
                      } else {
                        value[controls.field_name] = value[
                          controls.field_name
                        ].replace(e.target.value + ',', '');
                      }

                      props.onChange(
                        e.target.name,
                        value[controls.field_name],
                        'checkbox'
                      );
                    }}
                    checked={
                      props.field_data &&
                      props.field_data.fields[
                        `${controls.field_name}`
                      ].includes(Object.keys(item2)[0])
                    }
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
