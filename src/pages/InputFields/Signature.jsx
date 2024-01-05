import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import SignaturePad from 'react-signature-canvas';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signature = (props) => {
  const [signature, setSignature] = useState(null);
  const [signatureFlag, setSignatureFlag] = useState(
    props?.signature_flag || true
  );
  const { ...controls } = props;
  const sigPad = useRef({});
  useEffect(() => {
    if (
      signatureFlag &&
      props?.currentForm[0]?.form_permissions[0]?.signatories &&
      !props?.currentForm[0]?.form_permissions[0]?.signatories_role?.includes(
        localStorage.getItem('user_role') === 'guardian'
          ? 'parent'
          : localStorage.getItem('user_role')
      ) &&
      props?.field_label?.includes('Signature ')
    ) {
      setSignatureFlag(false);
    } else {
      setSignatureFlag(true);
    }
  }, []);
  useEffect(() => {
    if (
      (signatureFlag &&
        props?.currentForm[0]?.form_permissions[0]?.fill_access_users ===
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
    ) {
      sigPad?.current?.off();
    }
  }, []);
  useEffect(() => {
    if (props.errorFocus) {
      document.getElementById(props.errorFocus).focus();
    }
  }, []);
  useEffect(() => {
    if (
      props !== {} &&
      props?.field_data &&
      props?.field_data !== {} &&
      !isEmpty(props?.field_data)
    ) {
      if (props?.field_data?.fields[controls?.field_name]) {
        sigPad.current.clear();
        sigPad?.current?.fromDataURL(
          props?.field_data?.fields[controls?.field_name]
        );
        setSignature(props?.field_data?.fields[controls?.field_name]);
      } else {
        setSignature(null);
        sigPad.current.clear();
      }
    }
  }, [controls?.field_name, props]);
  useEffect(() => {
    if (signature && props !== {} && props?.field_data) {
      sigPad?.current?.fromDataURL(signature);
    }
  }, [signature]);
  const clear = (e) => {
    e.preventDefault();
    sigPad.current.clear();
    props.onChange(controls.field_label.split(' ').join('_').toLowerCase(), '');
  };
  const trim = (e) => {
    e.preventDefault();
    props.onChange(
      controls.field_label.split(' ').join('_').toLowerCase(),
      sigPad.current.getTrimmedCanvas().toDataURL('image/png'),
      'signature'
    );
    if (
      props?.field_data ||
      props?.form_field_permissions[0]?.fill_access_users.includes(
        localStorage.getItem('user_role') === 'guardian'
          ? 'parent'
          : localStorage.getItem('user_role')
      )
    ) {
      setSignature(sigPad?.current?.getTrimmedCanvas()?.toDataURL('image/png'));
      sigPad?.current?.clear();
    }
    toast.success('Signature added.');
  };
  return (
    signatureFlag && (
      <Col sm={6}>
        <ToastContainer />
        <Form.Group className="form-input-section">
          <Form.Label id={controls.field_name}>
            {controls.field_label}
          </Form.Label>
          <p style={{ fontSize: '12px' }}>
            (Kindly use the write pad for free hand signature)
          </p>
          <SignaturePad
            canvasProps={{
              style: {
                background: 'white',
                border: '1px solid #e5e5e5',
                width: '310px',
                minHeight: '65%',
                display: 'grid',
              },
            }}
            ref={sigPad}
          />
          <div style={{ marginTop: '5px' }}>
            <Button
              disabled={
                (props?.currentForm[0]?.form_permissions[0]
                  ?.fill_access_users === null &&
                  !props?.form_field_permissions[0]?.fill_access_users?.includes(
                    localStorage.getItem('user_role') === 'guardian'
                      ? 'parent'
                      : localStorage.getItem('user_role')
                  )) ||
                (props?.currentForm[0]?.form_permissions[0]
                  ?.fill_access_users &&
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
              style={{ minWidth: '70px !important' }}
              onClick={trim}
            >
              Save Signature
            </Button>
            <Button
              className="theme-light"
              style={{ minWidth: '70px !important' }}
              onClick={clear}
              disabled={
                (props?.currentForm[0]?.form_permissions[0]
                  ?.fill_access_users === null &&
                  !props?.form_field_permissions[0]?.fill_access_users?.includes(
                    localStorage.getItem('user_role') === 'guardian'
                      ? 'parent'
                      : localStorage.getItem('user_role')
                  )) ||
                (props?.currentForm[0]?.form_permissions[0]
                  ?.fill_access_users &&
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
            >
              Clear
            </Button>
          </div>
        </Form.Group>
        <p style={{ color: 'red' }}>{controls.error[controls.field_name]}</p>
      </Col>
    )
  );
};
export default Signature;
