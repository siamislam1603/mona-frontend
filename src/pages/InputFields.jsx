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
  
  console.log("controls.field_type---->", controls.field_type);
  switch (controls.field_type) {
    case "radio":
      inputElement = <Radio {...controls} />;
      break;
    case "headings":
      inputElement = <Headings {...controls} />;
      break;
    case "checkbox":
      inputElement = <Checkbox {...controls} />;
      break;
    case "instruction_text":
      inputElement = <TextArea {...controls} />;
      break;
    case "select":
      inputElement = <Select {...controls} />;
      break;
    case "signature":
      inputElement = <Signature {...controls} />;
      break;
    case "document_attachment":
      inputElement = <FileUpload {...controls} />;
      break;
    case "image_upload":
      inputElement = <ImageUpload {...controls} />;
      break;
    default:
      inputElement = <Input {...controls}  />;
  }
  return inputElement;
};
export default InputFields;
