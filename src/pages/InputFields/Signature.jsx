import React, { useRef, useState } from "react";
import { Col, Form } from "react-bootstrap";
import SignaturePad from "react-signature-canvas";

const Signature = (props) => {
  const { ...controls } = props;
  const sigPad = useRef({});
  const clear = (e) => {
    e.preventDefault();
    sigPad.current.clear();
  };
  const trim = (e) => {
    e.preventDefault();
    console.log(controls.field_name,"-------->",sigPad.current.getTrimmedCanvas().toDataURL("image/png"));
    props.onChange(sigPad.current.getTrimmedCanvas().toDataURL("image/png"));
  };
  return (
    <Col sm={6}>
      <Form.Group>
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
        />
        <div>
          <button onClick={clear}>Clear</button>
          <button onClick={trim}>Trim</button>
        </div>
      </Form.Group>
    </Col>
  );
};
export default Signature;
