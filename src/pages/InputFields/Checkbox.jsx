import { Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';

let value = {};

const Checkbox = (props) => {
  const { ...controls } = props;

  const [array, setArray] = useState([]);
  const [event, setEvent] = useState();

  useEffect(() => {
    if (props.errorFocus) {
      document.getElementById(props.errorFocus).focus();
    }
    eval(controls.option)?.map((item2) => {
      value[controls.field_name] = '';
    });
  }, []);

  useEffect(() => {
    let fieldData = props?.field_data?.fields[controls?.field_name];

    if (typeof fieldData === 'object') {
      fieldData = fieldData?.join(',');
    }

    setArray(
      fieldData?.split(',').map((item) => {
        return item;
      })
    );
  }, []);

  useEffect(() => {
    props.onChange(
      event,
      value[controls.field_name] + array?.join(',') + ',',
      'checkbox'
    );
  }, [array]);

  return (
    <Col sm={6}>
      <div className="child_info_field sex flex_wrap_checkbox">
        <label className="form-label" id={controls.field_name}>
          {controls.field_label}
        </label>
        <div className="d-flex mt-2"></div>
        <div className="btn-radio d-flex align-items-center modal-two-check dynamic-form-check">
          {eval(controls.option)?.map((item2, index) => {
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
                      if (e.target.checked) {
                        setEvent(e.target.name);
                        // value[controls.field_name] =
                        //   value[controls.field_name] + e.target.value + ',';
                        setArray((oldData) => {
                          if (oldData) {
                            return [...oldData, Object.keys(item2)[0]];
                          } else {
                            return [Object.keys(item2)[0]];
                          }
                        });
                      } else {
                        setEvent(e.target.name);
                        setArray((oldData) =>
                          oldData?.filter((item) => item !== e.target.value)
                        );
                        // value[controls.field_name] = value[
                        //   controls.field_name
                        // ].replace(e.target.value + ',', '');
                      }
                    }}
                    checked={array?.includes(Object.keys(item2)[0])}
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
