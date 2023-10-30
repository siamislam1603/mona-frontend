import Radio from './InputFields/Radio';
import Checkbox from './InputFields/Checkbox';
import Input from './InputFields/Input';
import TextArea from './InputFields/TextArea';
import Select from './InputFields/Select';
import Signature from './InputFields/Signature';
import FileUpload from './InputFields/FileUpload';
import ImageUpload from './InputFields/ImageUpload';
import Headings from './InputFields/Headings';
import TextHeadings from './InputFields/TextHeadings';
import isEmpty from 'lodash/isEmpty';
import { FullLoader } from '../components/Loader';
import SubHeadings from './InputFields/SubHeadings';

const InputFields = (props) => {
  console.log('INPUT FIELDS PROPS:::', props);
  let inputElement = null;
  let { ...controls } = props;
  if (isEmpty(controls?.field_data)) {
    if (!controls.freshForm) return <FullLoader />;
  }
  let { field_data: { fields = {} } = {} } = controls;
  delete fields?.undefined;
  switch (controls?.field_type) {
    case 'radio':
      inputElement = (
        <Radio
          {...controls}
          field_index={props?.field_index}
          field_data={props?.field_data}
          setFieldData={props.setFieldData}
          diff_index={props?.diff_index}
          errorFocus={props?.errorFocus}
          isDisable={props.isDisable}
        />
      );
      break;
    case 'text_headings':
      inputElement = (
        <TextHeadings {...controls} field_index={props?.field_index} />
      );
      break;
    case 'headings':
      inputElement = (
        <Headings {...controls} field_index={props?.field_index} />
      );
      break;
    case 'sub_headings':
      inputElement = (
        <SubHeadings {...controls} field_index={props?.field_index} />
      );
      break;
    case 'checkbox':
      inputElement = (
        <Checkbox
          {...controls}
          field_index={props?.field_index}
          field_data={props?.field_data}
          errorFocus={props?.errorFocus}
          isDisable={props.isDisable}
        />
      );
      break;
    case 'instruction_text':
      inputElement = (
        <TextArea
          {...controls}
          field_index={props?.field_index}
          field_data={props.field_data}
          errorFocus={props.errorFocus}
          isDisable={props.isDisable}
        />
      );
      break;
    case 'dropdown_selection':
      inputElement = (
        <Select
          {...controls}
          field_index={props?.field_index}
          field_data={props.field_data}
          errorFocus={props.errorFocus}
          isDisable={props.isDisable}
        />
      );
      break;
    case 'signature':
      inputElement = (
        <Signature
          {...controls}
          field_index={props?.field_index}
          signature_flag={props.signature_flag}
          errorFocus={props.errorFocus}
          isDisable={props.isDisable}
        />
      );
      break;
    case 'document_attachment':
      inputElement = (
        <FileUpload
          {...controls}
          field_index={props?.field_index}
          field_data={props?.field_data}
          errorFocus={props?.errorFocus}
          isDisable={props.isDisable}
        />
      );
      break;
    case 'image_upload':
      inputElement = (
        <ImageUpload
          {...controls}
          field_index={props?.field_index}
          field_data={props?.field_data}
          errorFocus={props?.errorFocus}
          isDisable={props.isDisable}
        />
      );
      break;
    default:
      inputElement = (
        <Input
          {...controls}
          field_index={props?.field_index}
          field_data={props?.field_data}
          errorFocus={props?.errorFocus}
          isDisable={props.isDisable}
        />
      );
  }
  return inputElement;
};
export default InputFields;
