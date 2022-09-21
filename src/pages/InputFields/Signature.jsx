import React, { useRef, useState } from "react";
import { Col, Form } from "react-bootstrap";
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
        <SignaturePad
          canvasProps={{
            style: {
              background: "white",
              border: "1px solid #e5e5e5",
              width: "300px",
              minHeight: "65%",
              display: "grid"
            },
          }}
          ref={sigPad}
          onEnd={trim}
        />
        <div>
          <button onClick={clear}>Clear</button>
          {/* <button onClick={trim}>Save</button> */}
        </div>
      </Form.Group>
      <p style={{color:"red"}}>{controls.error[controls.field_name]}</p>
    </Col>
  );
};
export default Signature;
