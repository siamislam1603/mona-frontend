import { Form } from "react-bootstrap";
const Checkbox = (props) => {
  const { ...controls } = props;
  return (
    <div className="child_info_field sex">
      <span>{controls.field_label}:</span>
      <div className="d-flex mt-2"></div>
      <div className="btn-radio d-flex align-items-center">
        {console.log("eval(controls.option)",eval(controls.option))}
        {eval(controls.option)?.map((item2) => {
          return (
            <>
              <label htmlFor={Object.keys(item2)[0]}>
                 {Object.keys(item2)[0]}
               </label>
               <Form.Check
                 type="checkbox"
                 className="checktest"
                 name={controls.field_name}
                 id={Object.keys(item2)[0]}
                 value={Object.keys(item2)[0]}
                 onClick={(e) => {
                    //  setDefaultValueCheck(e.target.value);
                     props.onChange(e.target.name,e.target.value);
                 }}
               />
            </>
          );
        })}
      </div>
      <p>{controls.error[controls.field_name]}</p>
    </div>
  );
};
export default Checkbox;
