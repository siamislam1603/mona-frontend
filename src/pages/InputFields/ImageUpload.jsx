import { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { BASE_URL } from '../../components/App';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';

const ImageUpload = (props) => {
  const { ...controls } = props;
  const [image, setImage] = useState('');
  useEffect(() => {
    if (props.errorFocus) {
      document.getElementById(props.errorFocus).focus();
    }
  }, []);
  useEffect(() => {
    if (image || props?.field_data?.fields) {
      if (
        props !== {} &&
        props?.field_data !== {} &&
        !isEmpty(props?.field_data)
      ) {
        setImage(props?.field_data?.fields[`${controls?.field_name}`]);
      }
    }
  }, [image]);

  if (controls.field_data == {} || controls.field_data == undefined) {
    delete controls?.field_data;
  }
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
        type.includes('jpg') ||
        type.includes('jpeg') ||
        type.includes('png') ||
        type.includes('psd')
      )
    ) {
      toast.error('Image must be JPG, PNG, or PSD.');
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
      setImage(data?.url);
      return data?.url;
    }
  };
  return (
    <Col sm={6}>
      <Form.Group className="form-input-section">
        <Form.Label>{controls.field_label}</Form.Label>

        <Form.Control
          type="file"
          id={controls.field_name}
          name={controls.field_name}
          // value={
          //   props.field_data &&
          //   props.field_data.fields[`${controls.field_name}`]
          // }
          onChange={async (e) => {
            let file = e.target.files[0];
            await uploadFiles(file).then((url) => {
              props.onChange(e.target.name, url, 'image');
            });
          }}
          isInvalid={!!controls.error[controls.field_name]}
        />
        {image && (
          <>
            <img src={image} alt="image" style={{ width: '100px' }} />
          </>
        )}
        <Form.Control.Feedback type="invalid">
          {controls.error[controls.field_name]}
        </Form.Control.Feedback>
      </Form.Group>
    </Col>
  );
};
export default ImageUpload;
