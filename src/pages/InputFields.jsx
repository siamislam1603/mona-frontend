import Radio from "./InputFields/Radio";
import Checkbox from "./InputFields/Checkbox";
import Input from "./InputFields/Input";
import TextArea from "./InputFields/TextArea";
import Select from "./InputFields/Select";
import Signature from "./InputFields/Signature";
import FileUpload from "./InputFields/FileUpload";
import ImageUpload from "./InputFields/ImageUpload";
import Headings from "./InputFields/Headings";

const InputFields = (props) => {
  let inputElement = null;
  const { ...controls } = props;
  const {signature_flag}=props
  console.log("props.field_data---->",props);
  
  console.log("props-2132--->", props.signature_flag);
  switch (controls.field_type) {
    case "radio":
      inputElement = <Radio {...controls} field_data={props.field_data}/>;
      break;
    case "headings":
      inputElement = <Headings {...controls} />;
      break;
    case "checkbox":
      inputElement = <Checkbox {...controls} field_data={props.field_data}/>;
      break;
    case "instruction_text":
      inputElement = <TextArea {...controls} field_data={props.field_data}/>;
      break;
    case "dropdown_selection":
      inputElement = <Select {...controls} field_data={props.field_data}/>;
      break;
    case "signature":
      inputElement = <Signature {...controls} signature_flag={props.signature_flag} />;
      break;
    case "document_attachment":
      inputElement = <FileUpload {...controls} field_data={props.field_data}/>;
      break;
    case "image_upload":
      inputElement = <ImageUpload {...controls} field_data={props.field_data}/>;
      break;
    default:
      inputElement = <Input {...controls} field_data={props.field_data} />;
  }
  return inputElement;
};
export default InputFields;
