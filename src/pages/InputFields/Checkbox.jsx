import { useEffect, useState, useRef } from 'react';
import { Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import SignaturePad from 'react-signature-canvas';
import { isEmpty } from 'lodash';
import { BASE_URL } from '../../components/App';

let value = {};

const Checkbox = (props) => {
  const { ...controls } = props;

  const [array, setArray] = useState([]);
  const [subCheckbox, setSubCheckbox] = useState([]);
  const [condIndex, setCondIndex] = useState(0);
  const [event, setEvent] = useState();
  const [fileList, setFileList] = useState('');
  const [checkboxValue, setCheckboxValue] = useState('');
  const [Index, setIndex] = useState(0);
  const [optionValue, setOptionValue] = useState([]);
  const [signature, setSignature] = useState(null);
  const [dropdownValue, setDropdownValue] = useState(null);

  const sigPad = useRef({});

  const clear = (e) => {
    e.preventDefault();
    sigPad.current.clear();
  };

  const trim = (e) => {
    e.preventDefault();
    props.onChange(
      `${Object.values(eval(controls?.option)[Index])[0]?.field_name} ${
        props?.field_name
      }`,
      sigPad.current.getTrimmedCanvas().toDataURL('image/png')
    );
    if (props?.field_data || signature) {
      setSignature(sigPad?.current?.getTrimmedCanvas()?.toDataURL('image/png'));
      sigPad?.current?.clear();
    }
    toast.success('Signature added.');
  };

  useEffect(() => {
    if (props.errorFocus) {
      document.getElementById(props.errorFocus).focus();
    }
    eval(controls.option)?.map((item2) => {
      value[controls.field_name] = '';
    });
  }, []);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const uploadFile = async (file) => {
    console.log(file, '===-=-=');
    let type = file.name.split('.')[file.name.split('.').length - 1];
    if (
      Object.values(eval(controls?.option)[condIndex])[0]?.field_type ===
        'document_attachment' &&
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
    } else if (
      Object.values(eval(controls?.option)[condIndex])[0]?.field_type ===
        'image_upload' &&
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
      console.log('object');
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
      !isEmpty(props?.field_data) ||
      !props?.field_data ||
      props?.field_data == 'undefined'
    ) {
      let fieldData = props?.field_data?.fields[controls?.field_name];
      if (typeof fieldData === 'object') {
        fieldData = fieldData?.join(',');
      }
      setArray(
        fieldData?.split(',').map((item) => {
          return item;
        })
      );
    }
  }, []);

  useEffect(() => {
    if (window.location.pathname.split('/')[2] !== 'preview') {
      props.onChange(
        `${event}`,
        value[controls.field_name] + array?.join(',') + ',',
        'checkbox'
      );
    }

    // Rendering conditional elements, if present;
  }, [array]);

  useEffect(() => {
    if (
      window.location.pathname.split('/')[2] !== 'preview' &&
      Object.values(eval(controls.option)[condIndex])[0]['field_type'] ===
        'checkbox'
    ) {
      props.onChange(
        `${checkboxValue} ${props?.field_name}`,
        value[controls.field_name] + subCheckbox?.join(',') + ',',
        'checkbox'
      );
    }

    // Rendering conditional elements, if present;
  }, [subCheckbox]);

  return (
    <>
      <Col sm={6}>
        <div className="child_info_field sex flex_wrap_checkbox">
          <label className="form-label" id={controls.field_name}>
            {controls.field_label}
          </label>
          <div className="d-flex mt-2"></div>
          <div className="btn-radio d-flex align-items-center modal-two-check dynamic-form-check">
            {eval(controls.option)?.map((item2, index) => {
              return (
                <>
                  <label className="container">
                    {Object.keys(item2)[0]}
                    <input
                      type="checkbox"
                      key={index}
                      name={controls.field_name}
                      id={Object.keys(item2)[0]}
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
                      value={Object.keys(item2)[0]}
                      onChange={(e) => {
                        if (e.target.checked) {
                          if (optionValue?.includes(Object.keys(item2)[0])) {
                            let data = optionValue;
                            data = data.filter(
                              (item) => item !== Object.keys(item2)[0]
                            );
                            setOptionValue(data);
                          } else {
                            setOptionValue((val) => [
                              ...val,
                              Object.keys(item2)[0],
                            ]);
                          }

                          setEvent(e.target.name);
                          // value[controls.field_name] =
                          //   value[controls.field_name] + e.target.value + ',';
                          setArray((oldData) => {
                            if (oldData) {
                              return [...oldData, Object.keys(item2)[0]];
                            } else {
                              return [Object.keys(item2)[0]];
                            }
                          });
                        } else {
                          setEvent(e.target.name);
                          setArray((oldData) =>
                            oldData?.filter((item) => item !== e.target.value)
                          );
                          if (optionValue?.includes(e.target.value)) {
                            let data = optionValue;
                            data = data.filter(
                              (item) => item !== e.target.value
                            );
                            setOptionValue(data);
                          } else {
                            setOptionValue((val) => [...val, e.target.value]);
                          }
                          // value[controls.field_name] = value[
                          //   controls.field_name
                          // ].replace(e.target.value + ',', '');
                        }
                      }}
                      checked={array?.includes(Object.keys(item2)[0])}
                    />
                    <span className="checkmark"></span>
                  </label>
                </>
              );
            })}
          </div>
          <p className="error">{controls.error[controls.field_name]}</p>
        </div>
      </Col>
      {/* Conditonal elements are being rendered here */}
      {/* {array && array?.length > 0 && (
        <>
          {conditionalFieldType === 'text' ? (
            <>
              {Object.keys(conditionalElems)?.length > 0 &&
                Object.values(conditionalElems)?.map((item) => item)}
            </>
          ) : null}
        </>
      )} */}
      {/* {props?.field_data?.form_id || true ?  */}
      <>
        {Object.values(eval(controls.option))?.map((item, i) => {
          let key = Object.keys(item)[0];
          let value = Object.values(item)[0];
          if (array?.includes(key) && typeof value !== 'string') {
            switch (value?.field_type) {
              case 'radio':
                return (
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>{value?.field_label}</Form.Label>
                      <div className="new-form-radio">
                        {value['option'].map((key, index) => {
                          return (
                            <div className="new-form-radio-box">
                              <label htmlFor={Object.keys(key)[0]}>
                                <input
                                  type={value['field_type']}
                                  key={index}
                                  // disabled={
                                  //   props.isDisable ? props.isDisable : false
                                  // }
                                  value={Object.values(key)[0]}
                                  name={value['field_name']}
                                  id={Object.keys(key)[0]}
                                  onClick={(e) => {
                                    props.onChange(
                                      `${e.target.name} ${props?.field_name}`,
                                      e.target.value
                                    );
                                  }}
                                  checked={
                                    props.field_data?.form_id &&
                                    props.field_data.fields[
                                      `${value['field_name']}`
                                    ] === Object.values(key)[0]
                                  }
                                />
                                <span className="radio-round"></span>
                                <p>{Object.keys(key)[0]}</p>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </Form.Group>
                  </Col>
                );
              case 'checkbox':
                return (
                  <>
                    <Col sm={6}>
                      <div className="child_info_field sex flex_wrap_checkbox">
                        <label className="form-label" id={value.field_name}>
                          {value.field_label}:
                        </label>
                        <div className="d-flex mt-2"></div>
                        <div className="btn-radio d-flex align-items-center modal-two-check dynamic-form-check">
                          {value['option'].map((key, index) => {
                            return (
                              <>
                                <label lassName="container">
                                  {Object.keys(key)[0]}
                                  <input
                                    type="checkbox"
                                    key={index}
                                    name={value?.field_name}
                                    id={Object.keys(key)[0]}
                                    value={Object.keys(key)[0]}
                                    onClick={(e) => {
                                      if (e.target.checked) {
                                        setCheckboxValue(e.target.name);
                                        setSubCheckbox((oldData) => {
                                          if (oldData) {
                                            setCondIndex(i);
                                            return [
                                              ...oldData,
                                              Object.keys(key)[0],
                                            ];
                                          } else {
                                            setCondIndex(i);
                                            return [Object.keys(key)[0]];
                                          }
                                        });
                                      } else {
                                        setCondIndex(i);
                                        setCheckboxValue(e.target.name);
                                        setSubCheckbox((oldData) =>
                                          oldData?.filter(
                                            (item) => item !== e.target.value
                                          )
                                        );
                                      }
                                    }}
                                    checked={subCheckbox?.includes(
                                      Object.keys(key)[0]
                                    )}
                                  />
                                </label>
                              </>
                            );
                          })}
                        </div>
                      </div>
                    </Col>
                  </>
                );
              case 'text':
                return (
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>{value?.field_label}</Form.Label>
                      <Form.Control
                        type={value?.field_type}
                        name={value?.field_name}
                        onChange={(e) => {
                          props.onChange(
                            `${e.target.name} ${props?.field_name}`,
                            e.target.value,
                            'text'
                          );
                        }}
                        value={
                          props.field_data &&
                          Object.keys(props.field_data).length > 0 &&
                          props.field_data.fields[`${value?.field_name}`]
                        }
                      />
                    </Form.Group>
                  </Col>
                );
              case 'dropdown_selection':
                return (
                  <Col sm={6}>
                    <div className="child_info_field sex">
                      <span className="form-label">{value?.field_label}</span>
                      <div className="d-flex mt-2"></div>
                      <div className="btn-radio d-flex align-items-center">
                        <Form.Select
                          name={value?.field_name}
                          value={dropdownValue ? dropdownValue : 'Select'}
                          onChange={(e) => {
                            setDropdownValue(e.target.value);
                            props.onChange(
                              `${value?.field_name} ${props.field_name}`,
                              e.target.value
                            );
                          }}
                        >
                          <option>Select </option>
                          {value?.option?.map((item, index) => {
                            return (
                              <>
                                <option key={index}>
                                  {Object.keys(item)[0]}
                                </option>
                              </>
                            );
                          })}
                        </Form.Select>
                      </div>
                      <p>{controls.error[controls.field_name]}</p>
                    </div>
                  </Col>
                );
              case 'instruction_text':
                return (
                  <Col sm={6}>
                    <div className="child_info_field">
                      <span className="form-label">{value?.field_label}:</span>
                      <Form.Control
                        as="textarea"
                        rows={controls.row ? controls.row : 3}
                        name={value?.field_name}
                        value={
                          props.field_data?.form_id &&
                          props.field_data.fields[`${value?.field_name}`]
                        }
                        className="child_input"
                        onChange={(e) => {
                          e.preventDefault();
                          props.onChange(
                            `${e.target.name} ${props?.field_name}`,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </Col>
                );
              case 'image_upload' || 'document_attachment':
                return (
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>{value?.field_label}</Form.Label>

                      <Form.Control
                        type="file"
                        name={value?.field_name}
                        onChange={async (e) => {
                          console.log('FIELD5:>>>>', e.target.files[0]);
                          let file = e.target.files[0];
                          setCondIndex(i);
                          await uploadFile(file).then((url) => {
                            props.onChange(
                              `${e.target.name} ${props?.field_name}`,
                              url,
                              'file'
                            );
                          });
                        }}
                      />
                      {fileList &&
                        value?.field_type === 'document_attachment' && (
                          <>
                            <h5>
                              {
                                fileList?.split('/')[
                                  fileList?.split('/').length - 1
                                ]
                              }
                            </h5>
                          </>
                        )}
                      {fileList && value.field_type === 'image_upload' && (
                        <>
                          <img
                            src={fileList}
                            alt="image"
                            style={{ width: '100px' }}
                          />
                        </>
                      )}
                    </Form.Group>
                  </Col>
                );
              case 'signature':
                return (
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>{value?.field_label}</Form.Label>
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
                          style={{ minWidth: '70px !important' }}
                          onClick={trim}
                        >
                          Save Signature
                        </Button>
                        <Button
                          className="theme-light"
                          style={{ minWidth: '70px !important' }}
                          onClick={clear}
                        >
                          Clear
                        </Button>
                      </div>
                    </Form.Group>
                  </Col>
                );
              case 'text_headings':
                return (
                  <Col sm={12} className="main-form-text-heading-title">
                    <br />
                    <Form.Group>
                      <Form.Label className="form-style-headings">
                        {value?.field_label}
                      </Form.Label>
                    </Form.Group>
                  </Col>
                );
              case 'headings':
                return (
                  <Col sm={12} className="main-form-heading-title">
                    <br />
                    <Form.Group>
                      <Form.Label className="form-style-headings">
                        {value?.field_label}
                      </Form.Label>
                    </Form.Group>
                  </Col>
                );
              case 'sub_headings':
                return (
                  <Col sm={12} className="main-form-text-sub-heading-title">
                    <br />
                    <Form.Group>
                      <Form.Label className="form-style-headings">
                        {value?.field_label}
                      </Form.Label>
                    </Form.Group>
                  </Col>
                );
              default:
                break;
            }
          }

          return null;
        })}
      </>
      {/* ) : null */}
    </>
  );
};
export default Checkbox;
