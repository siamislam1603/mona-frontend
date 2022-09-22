import React, { useRef, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import SignaturePad from "react-signature-canvas";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signature = (props) => {
  const { ...controls } = props;
  console.log("props--->",props.signature_flag);
  const sigPad = useRef({});
  const clear = (e) => {
    e.preventDefault();
    sigPad.current.clear();
    props.onChange(controls.field_label.split(" ").join("_").toLowerCase(),"");
  };
  const trim = (e) => {
    e.preventDefault();
    props.onChange(controls.field_label.split(" ").join("_").toLowerCase(),sigPad.current.getTrimmedCanvas().toDataURL("image/png"),"signature");
    toast.success("Signature added.");
  };
  return (
    props.signature_flag && <Col sm={6}>
      <ToastContainer/>
      <Form.Group className="form-input-section">
        <Form.Label>{controls.field_label}</Form.Label>
        <p style={{fontSize:"12px"}}>(Kindly use the write pad for free hand signature)</p>
        <SignaturePad
          canvasProps={{
            style: {
              background: "white",
              border: "1px solid #e5e5e5",
              width: "310px",
              minHeight: "65%",
              display: "grid"
            },
          }}
          ref={sigPad}
        />
        <div>
          <Button className="theme-light" style={{minWidth:"70px !important"}} onClick={clear}>Clear</Button>
          <Button style={{minWidth:"70px !important"}} onClick={trim}>Save</Button>
        </div>
      </Form.Group>
      <p style={{color:"red"}}>{controls.error[controls.field_name]}</p>
    </Col>
  );
};
export default Signature;
