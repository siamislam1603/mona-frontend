import React, { useRef, useState } from "react";
import { Col, Form } from "react-bootstrap";
import SignaturePad from "react-signature-canvas";

const UserSignature = (props) => {
  const { ...controls } = props;
  const sigPad = useRef({});
  const clear = (e) => {
    e.preventDefault();
    sigPad.current.clear();
  };
  const trim = (e) => {
    e.preventDefault();
    props.setShowSignatureDialog(false);
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
              width: "700px",
              height: "250px",
            },
          }}
          ref={sigPad}
        />
        <div>
          <button onClick={clear} style={{ padding: "12px 35px", marginRight: "10px" }}>Clear</button>
          <button onClick={trim} style={{ padding: "12px 35px" }}>Submit</button>
        </div>
      </Form.Group>
    </Col>
  );
};
export default UserSignature;
