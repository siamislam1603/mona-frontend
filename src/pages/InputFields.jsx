import { Col } from "react-bootstrap";
import Radio from "./InputFields/Radio";
import Checkbox from "./InputFields/Checkbox";
import Input from "./InputFields/Input";
import TextArea from "./InputFields/TextArea";
import Select from "./InputFields/Select";

const InputFields = (props) => {
  let inputElement = null;
  const { ...controls } = props;
  switch (controls.field_type) {
    case "radio":
      inputElement = <Radio {...controls} />;
      break;
    case "checkbox":
      inputElement = <Checkbox {...controls} />;
      break;
    case "textarea":
      inputElement = <TextArea {...controls} />;
      break;
    case "select":
      inputElement = <Select {...controls} />;
      break;
    default:
      inputElement = <Input {...controls} />;
  }
  return <Col md={6}>{inputElement}</Col>;
};
export default InputFields;
