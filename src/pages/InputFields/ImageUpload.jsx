import { useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { BASE_URL } from '../../components/App';

const ImageUpload = (props) => {
  const { ...controls } = props;
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const uploadFiles = async (file) => {
    if (file.size > 2048 * 1024) {
      alert('File is too large. File limit 2 MB.');
    }
    const body = new FormData();
    const blob = await fetch(await toBase64(file)).then((res) => res.blob());
    body.append('image', blob, file.name);
    body.append('description', 'form module');
    body.append('title', 'image');
    body.append('uploadedBy', 'vaibhavi');

    var myHeaders = new Headers();
    myHeaders.append('shared_role', 'admin');
    let res= await fetch(`${BASE_URL}/uploads/uiFiles`, {
      method: 'post',
      body: body,
      headers: myHeaders,
    })
    let data=await res.json();
    return data?.url;
       
  };
  return (
    <Col sm={6}>
      <Form.Group>
        <Form.Label>{controls.field_label}</Form.Label>

        <Form.Control
          type="file"
          name={controls.field_name}
          onChange={async (e) => {
            let file = e.target.files[0];
            await uploadFiles(file).then((url)=>{
              alert("uploaded!!");
              props.onChange(e.target.name, url);
            });
          }}
          isInvalid={!!controls.error[controls.field_name]}
        />
        <Form.Control.Feedback type="invalid">
          {controls.error[controls.field_name]}
        </Form.Control.Feedback>
      </Form.Group>
    </Col>
  );
};
export default ImageUpload;
