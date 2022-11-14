import { Form, Col } from 'react-bootstrap';
import { BASE_URL } from '../../components/App';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';

const FileUpload = (props) => {
  const { ...controls } = props;
  if (controls.field_data == {} || controls.field_data == undefined) {
    delete controls?.field_data;
  }
  const [fileList, setFileList] = useState('');
  const [values, setValue] = useState();

  useEffect(() => {
    if (props.errorFocus) {
      document.getElementById(props.errorFocus).focus();
    }
  }, []);
  useEffect(() => {
    if (fileList || props?.field_data?.fields) {
      if (
        props !== {} &&
        props?.field_data !== {} &&
        !isEmpty(props?.field_data)
      ) {
        setFileList(props?.field_data?.fields[`${controls?.field_name}`]);
      }
    }
  }, [fileList]);
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const uploadFiles = async (file) => {
    let type = file.name.split('.')[file.name.split('.').length - 1];
    if (
      !(
        type.includes('doc') ||
        type.includes('docx') ||
        type.includes('html') ||
        type.includes('htm') ||
        type.includes('odt') ||
        type.includes('xls') ||
        type.includes('xlsx') ||
        type.includes('ods') ||
        type.includes('ppt') ||
        type.includes('pptx') ||
        type.includes('pdf') ||
        type.includes('txt')
      )
    ) {
      toast.error('File must be DOC, PDF, TXT, XLS, or PPT.');
      return null;
    } else if (file.size > 2048 * 1024) {
      toast.error('File is too large. File limit 2 MB.');
      return null;
    } else {
      const body = new FormData();
      const blob = await fetch(await toBase64(file)).then((res) => res.blob());
      body.append('image', blob, file.name);
      body.append('description', 'form module');
      body.append('title', 'image');
      body.append('uploadedBy', 'vaibhavi');

      var myHeaders = new Headers();
      myHeaders.append('shared_role', 'admin');
      let res = await fetch(`${BASE_URL}/uploads/uiFiles`, {
        method: 'post',
        body: body,
        headers: myHeaders,
      });
      let data = await res.json();
      toast.success('uploaded.');
      setFileList(data?.url);
      return data?.url;
    }
  };

  useEffect(() => {
    if (
      props !== {} &&
      props?.field_data !== {} &&
      !isEmpty(props?.field_data)
    ) {
      setValue(
        props?.field_data &&
          props?.field_data?.fields[`${controls?.field_name}`]
      );
    }
  }, []);

  return (
    <Col sm={6}>
      <Form.Group className="form-input-section">
        <Form.Label>{controls?.field_label}</Form.Label>
        {props !== {} &&
        props?.field_data !== {} &&
        !isEmpty(props?.field_data) &&
        props?.field_data?.fields[`${controls?.field_name}`] ? (
          <Form.Control
            type="file"
            name={controls?.field_name}
            disabled={
              (props?.currentForm[0]?.form_permissions[0]?.fill_access_users ===
                null &&
                !props?.form_field_permissions[0]?.fill_access_users?.includes(
                  localStorage.getItem('user_role') === 'guardian'
                    ? 'parent'
                    : localStorage.getItem('user_role')
                )) ||
              (props?.currentForm[0]?.form_permissions[0]?.fill_access_users &&
                !props?.currentForm[0]?.form_permissions[0]?.fill_access_users?.includes(
                  localStorage.getItem('user_role') === 'guardian'
                    ? 'parent'
                    : localStorage.getItem('user_role')
                ) &&
                !props?.form_field_permissions[0]?.fill_access_users?.includes(
                  localStorage.getItem('user_role') === 'guardian'
                    ? 'parent'
                    : localStorage.getItem('user_role')
                )) ||
              props.isDisable
            }
            id={controls?.field_name}
            onChange={async (e) => {
              let file = e.target.files[0];
              await uploadFiles(file).then((url) => {
                props.onChange(e.target.name, url, 'file');
              });
            }}
            isInvalid={!!controls.error[controls?.field_name]}
          />
        ) : (
          <Form.Control
            type="file"
            name={controls?.field_name}
            disabled={
              (props?.currentForm[0]?.form_permissions[0]?.fill_access_users ===
                null &&
                !props?.form_field_permissions[0]?.fill_access_users.includes(
                  localStorage.getItem('user_role') === 'guardian'
                    ? 'parent'
                    : localStorage.getItem('user_role')
                )) ||
              (props?.currentForm[0]?.form_permissions[0]?.fill_access_users &&
                !props?.currentForm[0]?.form_permissions[0]?.fill_access_users.includes(
                  localStorage.getItem('user_role') === 'guardian'
                    ? 'parent'
                    : localStorage.getItem('user_role') &&
                        !props?.form_field_permissions[0]?.fill_access_users.includes(
                          localStorage.getItem('user_role') === 'guardian'
                            ? 'parent'
                            : localStorage.getItem('user_role')
                        )
                )) ||
              props.isDisable
            }
            id={controls?.field_name}
            value={values}
            onChange={async (e) => {
              let file = e.target.files[0];
              await uploadFiles(file).then((url) => {
                props.onChange(e.target.name, url, 'file');
              });
            }}
            isInvalid={!!controls.error[controls?.field_name]}
          />
        )}
        {fileList && (
          <>
            <h5>{fileList?.split('/')[fileList?.split('/').length - 1]}</h5>
          </>
        )}
        <Form.Control.Feedback type="invalid">
          {controls.error[controls?.field_name]}
        </Form.Control.Feedback>
      </Form.Group>
    </Col>
  );
};
export default FileUpload;
