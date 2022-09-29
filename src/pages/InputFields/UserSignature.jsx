import React, { useRef, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
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
        <div style={{marginTop:"5px"}}>
          <Button style={{minWidth:"70px !important"}} onClick={trim}>Save</Button>
          <Button className="theme-light" style={{minWidth:"70px !important"}} onClick={clear}>Clear</Button>
        </div>
      </Form.Group>
    </Col>
  );
};
export default UserSignature;
