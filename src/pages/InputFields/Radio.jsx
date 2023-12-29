import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import SignaturePad from 'react-signature-canvas';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../components/App';

let optIndex = 0;
const Radio = (props) => {
  const { ...controls } = props;
  const [optionValue, setOptionValue] = useState('');
  const [Index, setIndex] = useState(0);
  const [textInputValue, setTextInputValue] = useState('');
  const [array, setArray] = useState([]);
  const [event, setEvent] = useState();
  const [signature, setSignature] = useState(null);
  const [fileList, setFileList] = useState('');
  const [dropDownValue, setDropDownValue] = useState();

  const sigPad = useRef({});
  let extData = {};
  if (props?.field_data && Object?.keys(props?.field_data)?.length) {
    extData = props?.extra_data;
  }

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
  }, []);

  useEffect(() => {
    if (
      props !== {} &&
      props?.field_data &&
      props?.fieldData !== {} &&
      !isEmpty(props?.field_data) &&
      Object.values(eval(controls?.option)[Index])[0]?.field_type ===
        'signature'
    ) {
      setSignature(
        props?.field_data?.fields[
          Object.values(eval(controls?.option)[Index])[0]?.field_name
        ]
      );
    }
  }, [signature]);

  useEffect(() => {
    if (
      signature &&
      props !== {} &&
      props?.field_data &&
      Object.values(eval(controls?.option)[Index])[0]?.field_type ===
        'signature'
    ) {
      sigPad?.current?.fromDataURL(signature);
    }
  }, [signature]);

  useEffect(() => {
    if (props?.field_data?.form_id) {
      eval(controls.option)?.map((item, index) => {
        return props?.field_data &&
          (props?.field_data?.fields[`${controls?.field_name}`] ===
            Object.keys(item)[0]) ===
            true
          ? setIndex(index)
          : '';
      });
    }
  }, []);

  useEffect(() => {
    if (
      typeof controls.field_data !== 'undefined' &&
      Object.keys(controls.field_data).length > 0 &&
      Object.values(eval(controls.option)[Index])[0]?.field_type ===
        'dropdown_selection'
    ) {
      let val =
        props?.field_data?.fields[
          `${Object.values(eval(controls.option)[Index])[0]?.field_name}`
        ];
      let availableOptions = Object.values(eval(controls.option)[Index])[0]
        ?.option;
      let data = {};
      availableOptions.forEach((d, index) => {
        data = { ...data, ...d };
      });
      let valueSelected = Object.keys(data).filter((d) => d === val);
      setDropDownValue(valueSelected[0]);
    }
  }, [Index]);

  useEffect(() => {
    if (
      !isEmpty(props?.field_data) ||
      !props?.field_data ||
      props?.field_data == 'undefined'
    ) {
      let fieldData =
        props?.field_data?.fields[
          `${Object.values(eval(controls?.option)[Index])[0]?.field_name}`
        ];

      if (typeof fieldData === 'object') {
        fieldData = fieldData?.join(',');
      }
      setArray(
        fieldData?.split(',').map((item) => {
          return item;
        })
      );

      setOptionValue(props?.field_data?.fields?.[props?.field_name] || '');
      let ind = 0;
      let val = props?.field_data?.fields?.[props?.field_name];
      eval(controls.option)?.forEach((item, index) => {
        let key = Object?.keys(item);
        if (key?.[0] === val) {
          ind = index;
        }
      });
      setIndex(ind);
    }
  }, [props]);

  useEffect(() => {
    if (
      window.location.pathname.split('/')[2] !== 'preview' &&
      Object.values(eval(controls.option)[Index])[0]['field_type'] ===
        'checkbox'
    ) {
      props.onChange(event, array?.join(','));
    }
  }, [array]);

  useEffect(() => {
    if (fileList || props?.field_data?.fields) {
      if (
        props !== {} &&
        props?.field_data !== {} &&
        !isEmpty(props?.field_data)
      ) {
        setFileList(
          props?.field_data?.fields[
            `${Object.values(eval(controls?.option)[Index])[0]?.field_name}`
          ]
        );
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

  const uploadFile = async (file) => {
    let type = file.name.split('.')[file.name.split('.').length - 1];
    if (
      Object.values(eval(controls?.option)[Index])[0]?.field_type ===
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
      Object.values(eval(controls?.option)[Index])[0]?.field_type ===
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

  const hasValue = (value) => {
    let hasValue = false;
    eval(controls.option)?.forEach((item, index) => {
      let key = Object?.keys(item);
      if (key?.[0] === value) {
        hasValue = true;
      }
    });

    // setIndex(optIndex);
    return hasValue;
  };

  return (
    <>
      <Col sm={6}>
        <Form.Group className="form-input-section">
          <Form.Label id={controls.field_name}>
            {controls.field_label}
          </Form.Label>
          <div className="new-form-radio flex_wrap_radio">
            {eval(controls.option)?.map((item, index) => {
              return (
                <>
                  {Object.keys(eval(controls?.option)[index])[0] ===
                  Object.values(eval(controls?.option)[index])[0] ? (
                    <div className="new-form-radio-box">
                      <label htmlFor={Object.keys(item)[0] + props?.diff_index}>
                        <input
                          type="radio"
                          key={index}
                          // defaultChecked={true}
                          value={Object.keys(item)[0]}
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
                          name={controls.field_name}
                          id={Object.keys(item)[0] + props?.diff_index}
                          onClick={(e) => {
                            setOptionValue(e.target.value);
                            props.onChange(
                              e.target.name,
                              e.target.value,
                              'radio'
                            );
                            setIndex(index);
                          }}
                          // checked={optionValue}
                          checked={
                            props !== {} &&
                            props?.field_data !== {} &&
                            !isEmpty(props?.field_data)
                              ? props?.field_data &&
                                props?.field_data?.fields[
                                  `${controls?.field_name}`
                                ] === Object.keys(item)[0]
                              : props?.field_data &&
                                optionValue === Object.keys(item)[0]
                          }
                        />
                        <span className="radio-round"></span>
                        <p>{Object.keys(item)[0]}</p>
                      </label>
                    </div>
                  ) : (
                    <>
                      <div className="new-form-radio-box">
                        <label
                          htmlFor={Object.keys(item)[0] + props?.diff_index}
                        >
                          <input
                            type="radio"
                            value={Object.keys(item)[0]}
                            key={index}
                            disabled={
                              (props?.currentForm[0]?.form_permissions[0]
                                ?.fill_access_users === null &&
                                !props?.form_field_permissions[0]?.fill_access_users?.includes(
                                  localStorage.getItem('user_role') ===
                                    'guardian'
                                    ? 'parent'
                                    : localStorage.getItem('user_role')
                                )) ||
                              (props?.currentForm[0]?.form_permissions[0]
                                ?.fill_access_users &&
                                !props?.currentForm[0]?.form_permissions[0]?.fill_access_users?.includes(
                                  localStorage.getItem('user_role') ===
                                    'guardian'
                                    ? 'parent'
                                    : localStorage.getItem('user_role')
                                ) &&
                                !props?.form_field_permissions[0]?.fill_access_users?.includes(
                                  localStorage.getItem('user_role') ===
                                    'guardian'
                                    ? 'parent'
                                    : localStorage.getItem('user_role')
                                )) ||
                              props.isDisable
                            }
                            name={controls.field_name}
                            id={Object.keys(item)[0] + props?.diff_index}
                            onClick={(e) => {
                              props.onChange(
                                e.target.name,
                                e.target.value,
                                'radio'
                              );
                              setOptionValue(e.target.value);
                              setIndex(index);
                            }}
                            checked={
                              props !== {} &&
                              props?.field_data !== {} &&
                              !isEmpty(props?.field_data)
                                ? props?.field_data &&
                                  props?.field_data?.fields[
                                    `${controls?.field_name}`
                                  ] === Object.keys(item)[0]
                                : props?.field_data &&
                                  optionValue === Object.keys(item)[0]
                            }
                          />
                          <span className="radio-round"></span>
                          <p>{Object.keys(item)[0]}</p>
                        </label>
                      </div>
                    </>
                  )}
                </>
              );
            })}
          </div>
          <p className="error">{controls.error[controls.field_name]}</p>
        </Form.Group>
      </Col>
      {props?.field_data?.form_id || hasValue(optionValue) ? (
        Object.values(eval(controls.option)[Index])[0]['field_type'] ===
        'radio' ? (
          <Col sm={6}>
            <Form.Group>
              <Form.Label>
                {Object.values(eval(controls.option)[Index])[0]?.field_label}
              </Form.Label>
              <div className="new-form-radio">
                {Object.values(eval(controls.option)[Index])[0]['option'].map(
                  (item, index) => {
                    return (
                      <div className="new-form-radio-box">
                        <label htmlFor={Object.keys(item)[0]}>
                          <input
                            type={
                              Object.values(eval(controls.option)[Index])[0][
                                'field_type'
                              ]
                            }
                            key={index}
                            disabled={props.isDisable ? props.isDisable : false}
                            value={Object.values(item)[0]}
                            name={
                              Object.values(eval(controls.option)[Index])[0][
                                'field_name'
                              ]
                            }
                            id={Object.keys(item)[0]}
                            onClick={(e) => {
                              props.onChange(
                                `${e.target.name} ${props?.field_name}`,
                                e.target.value
                              );
                            }}
                            checked={
                              (props.field_data?.form_id &&
                                props.field_data.fields[
                                  `${
                                    Object.values(
                                      eval(controls.option)[Index]
                                    )[0]['field_name']
                                  }`
                                ] === Object.values(item)[0]) ||
                              (Object?.keys(extData)?.length > 0
                                ? extData[
                                    Object.values(
                                      eval(controls.option)[Index]
                                    )[0]['field_name']
                                  ] === Object.values(item)[0]
                                : null) ||
                              null
                            }
                          />
                          <span className="radio-round"></span>
                          <p>{Object.keys(item)[0]}</p>
                        </label>
                      </div>
                    );
                  }
                )}
              </div>
            </Form.Group>
          </Col>
        ) : Object.values(eval(controls.option)[Index])[0]['field_type'] ===
          'dropdown_selection' ? (
          <Col sm={6}>
            <div className="child_info_field sex">
              <span className="form-label">
                {Object.values(eval(controls.option)[Index])[0].field_label}
              </span>
              <div className="d-flex mt-2"></div>
              <div className="btn-radio d-flex align-items-center">
                <Form.Select
                  name={
                    Object.values(eval(controls.option)[Index])[0]?.field_name
                  }
                  value={dropDownValue ? dropDownValue : 'Select'}
                  onChange={(e) => {
                    setDropDownValue(e.target.value);
                    props.onChange(
                      `${
                        Object.values(eval(controls.option)[Index])[0]
                          ?.field_name
                      } ${props?.field_name}`,
                      e.target.value
                    );
                  }}
                >
                  <option>Select </option>
                  {Object.values(eval(controls.option)[Index])[0]['option'].map(
                    (item, index) => {
                      return (
                        <>
                          <option key={index}>{Object.keys(item)[0]}</option>
                        </>
                      );
                    }
                  )}
                </Form.Select>
              </div>
              <p>{controls.error[controls.field_name]}</p>
            </div>
          </Col>
        ) : Object.values(eval(controls.option)[Index])[0]['field_type'] ===
          'checkbox' ? (
          <Col sm={6}>
            <div className="child_info_field sex">
              <span>
                {Object.values(eval(controls?.option)[Index])[0]?.field_label}:
              </span>
              <div className="d-flex mt-2"></div>
              <div className="btn-radio d-flex align-items-center">
                {Object.values(eval(controls.option)[Index])[0]['option'].map(
                  (item, index) => {
                    return (
                      <>
                        <label htmlFor={Object.keys(item)[0]}>
                          {Object.keys(item)[0]}
                        </label>
                        <Form.Check
                          type="checkbox"
                          className="checktest"
                          key={index}
                          name={
                            Object.values(eval(controls.option)[Index])[0]
                              .field_name
                          }
                          id={Object.keys(item)[0]}
                          value={Object.keys(item)[0]}
                          onClick={(e) => {
                            if (e.target.checked) {
                              setEvent(e.target.name);
                              setArray((oldData) => {
                                if (oldData) {
                                  return [...oldData, Object.keys(item)[0]];
                                } else {
                                  return [Object.keys(item)[0]];
                                }
                              });
                            } else {
                              setEvent(e.target.name);
                              setArray((oldData) =>
                                oldData?.filter(
                                  (item) => item !== e.target.value
                                )
                              );
                            }
                          }}
                          checked={array?.includes(Object.keys(item)[0])}
                        />
                      </>
                    );
                  }
                )}
              </div>
            </div>
          </Col>
        ) : Object.values(eval(controls.option)[Index])[0]['field_type'] ===
          'instruction_text' ? (
          <Col sm={6}>
            <div className="child_info_field">
              <span className="form-label">
                {Object.values(eval(controls.option)[Index])[0].field_label}:
              </span>
              <Form.Control
                as="textarea"
                rows={controls.row ? controls.row : 3}
                name={Object.values(eval(controls.option)[Index])[0].field_name}
                value={
                  props.field_data?.form_id &&
                  props.field_data.fields[
                    `${
                      Object.values(eval(controls.option)[Index])[0].field_name
                    }`
                  ]
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
        ) : Object.values(eval(controls.option)[Index])[0]['field_type'] ===
          'signature' ? (
          <Col sm={6}>
            <Form.Group>
              <Form.Label>
                {Object.values(eval(controls.option)[Index])[0].field_label}
              </Form.Label>
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
                <Button style={{ minWidth: '70px !important' }} onClick={trim}>
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
        ) : Object.values(eval(controls.option)[Index])[0]['field_type'] ===
            'image_upload' ||
          Object.values(eval(controls.option)[Index])[0]['field_type'] ===
            'document_attachment' ? (
          <Col sm={6}>
            <Form.Group>
              <Form.Label>
                {Object.values(eval(controls.option)[Index])[0].field_label}
              </Form.Label>

              <Form.Control
                type="file"
                name={Object.values(eval(controls.option)[Index])[0].field_name}
                onChange={async (e) => {
                  let file = e.target.files[0];
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
                Object.values(eval(controls.option)[Index])[0].field_type ===
                  'document_attachment' && (
                  <>
                    <h5>
                      {fileList?.split('/')[fileList?.split('/').length - 1]}
                    </h5>
                  </>
                )}
              {fileList &&
                Object.values(eval(controls.option)[Index])[0].field_type ===
                  'image_upload' && (
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
        ) : Object.values(eval(controls.option)[Index])[0]['field_type'] ===
          'text_headings' ? (
          <Col sm={12} className="main-form-text-heading-title">
            <br />
            <Form.Group>
              <Form.Label className="form-style-headings">
                {Object.values(eval(controls.option)[Index])[0].field_label}
              </Form.Label>
            </Form.Group>
          </Col>
        ) : Object.values(eval(controls.option)[Index])[0]['field_type'] ===
          'headings' ? (
          <Col sm={12} className="main-form-heading-title">
            <br />
            <Form.Group>
              <Form.Label className="form-style-headings">
                {Object.values(eval(controls.option)[Index])[0].field_label}
              </Form.Label>
            </Form.Group>
          </Col>
        ) : Object.values(eval(controls.option)[Index])[0]['field_type'] ===
          'sub_headings' ? (
          <>
            <Col sm={12} className="main-form-text-sub-heading-title">
              <br />
              <Form.Group>
                <Form.Label className="form-style-headings">
                  {Object.values(eval(controls.option)[Index])[0].field_label}
                </Form.Label>
              </Form.Group>
            </Col>
          </>
        ) : (
          <>
            {Object.values(eval(controls.option)[Index])[0]?.field_name && (
              <Col sm={6}>
                <Form.Group>
                  <Form.Label>
                    {Object.values(eval(controls.option)[Index])[0].field_label}
                  </Form.Label>
                  <Form.Control
                    type={
                      Object.values(eval(controls.option)[Index])[0].field_type
                    }
                    name={
                      Object.values(eval(controls.option)[Index])[0].field_name
                    }
                    disabled={controls?.isDisable}
                    onChange={(e) => {
                      props.onChange(
                        `${e.target.name} ${props?.field_name}`,
                        e.target.value
                      );
                      setTextInputValue(e.target.value);
                    }}
                    value={
                      (props.field_data &&
                        Object.keys(props.field_data).length > 0 &&
                        props.field_data.fields[
                          `${
                            Object.values(eval(controls.option)[Index])[0]
                              .field_name
                          }`
                        ]) ||
                      textInputValue ||
                      (props?.field_data?.fields?.[
                        `${
                          Object.values(eval(controls.option)[Index])[0]
                            .field_name
                        } ${props?.field_name}`
                      ] || props?.field_data?.fields?.[`${props?.field_name}`]
                        ? props?.extra_data[
                            Object.values(eval(controls.option)[Index])[0]
                              .field_name
                          ]
                        : '')
                    }
                  />
                </Form.Group>
              </Col>
            )}
          </>
        )
      ) : null}
    </>
  );
};
export default Radio;
