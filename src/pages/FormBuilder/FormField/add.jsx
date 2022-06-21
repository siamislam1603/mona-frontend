import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import LeftNavbar from '../../../components/LeftNavbar';
import TopHeader from '../../../components/TopHeader';
import Multiselect from 'multiselect-react-dropdown';
import {
  createFormFieldValidation,
  createFormSettingModelValidation,
} from '../../../helpers/validation';
import { BASE_URL } from '../../../components/App';
import { useLocation, useNavigate } from 'react-router-dom';

let counter = 0;
let selectedFranchisee = [];
let selectedUserRole = [];
const AddFormField = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [conditionFlag, setConditionFlag] = useState(false);
  const [groupFlag, setGroupFlag] = useState(false);
  const [formSettingFlag, setFormSettingFlag] = useState(false);
  const [formSettingError, setFormSettingError] = useState({});
  const [count, setCount] = useState(0);
  const [Index, setIndex] = useState(1);
  // const [conditionModelData, setConditionModelData] = useState([]);
  const [franchisee, setFranchisee] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const [groupModelData, setGroupModelData] = useState([]);
  const [form, setForm] = useState([
    { field_type: 'text' },
    { field_type: 'radio', option: [{ '': '' }, { '': '' }] },
    { field_type: 'checkbox', option: [{ '': '' }, { '': '' }] },
  ]);
  const [formSettingData, setFormSettingData] = useState({});
  const [sectionTitle, setSectionTitle] = useState('');
  const [errors, setErrors] = useState([{}]);
  const [section, setSection] = useState([]);
  const [createSectionFlag, setCreateSectionFlag] = useState(false);
  useEffect(() => {
    if (location?.state?.form_name) {
      getFormField();
      getFormData();
      getUserRoleAndFranchiseeData();
    }
  }, []);
  function onSelectFranchisee(optionsList, selectedItem) {
    console.log('selected_item---->2', selectedItem);
    selectedFranchisee.push({
      id: selectedItem.id,
      role_label: selectedItem.registered_name,
    });
    console.log('selected_item---->1selectedFranchisee', selectedFranchisee);
  }
  function onRemoveFranchisee(selectedList, removedItem) {
    const index = selectedFranchisee.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedFranchisee.splice(index, 1);
  }

  function onSelectUserRole(optionsList, selectedItem) {
    console.log('selected_item---->2', selectedItem);
    selectedUserRole.push({
      id: selectedItem.id,
      role_label: selectedItem.role_label,
    });
    console.log('selected_item---->1selectedFranchisee', selectedFranchisee);
  }
  function onRemoveUserRole(selectedList, removedItem) {
    const index = selectedUserRole.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedUserRole.splice(index, 1);
  }
  const getUserRoleAndFranchiseeData = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/api/user-role`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        setUserRole(res?.userRoleList);
        console.log('response0-------->1', res?.userRoleList);
      })
      .catch((error) => console.log('error', error));
    fetch(`${BASE_URL}/role/franchisee`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        setFranchisee(res?.franchiseeList);
      })
      .catch((error) => console.log('error', error));
  };
  const setFormSettingFields = (field, value) => {
    setFormSettingData({ ...formSettingData, [field]: value });

    if (!!formSettingError[field]) {
      setFormSettingError({
        ...formSettingError,
        [field]: null,
      });
    }
  };
  const setConditionField = (
    field,
    value,
    index,
    inner_index,
    inner_inner_index,
    key
  ) => {
    counter++;
    setCount(counter);
    const tempArr = form;
    const tempObj = tempArr[index];
    const tempOption = tempObj['option'];
    if (field === 'option') {
      const keyOfOption = tempOption[inner_index];
      keyOfOption[key]['option'][inner_inner_index] = { [value]: value };
      tempOption[inner_index] = keyOfOption;
      tempArr[index]['option'] = tempOption;
      setForm(tempArr);
    } else if (
      field === 'field_type' &&
      (value === 'radio' ||
        value === 'checkbox' ||
        value === 'dropdown_selection')
    ) {
      const keyOfOption = tempOption[inner_index];

      if (!keyOfOption[key]['option']) {
        console.log('Hello');
        keyOfOption[key]['option'] = [{ '': '' }, { '': '' }];
      }

      keyOfOption[key][field] = value;
      tempOption[inner_index] = keyOfOption;
      console.log('tempOption[inner_index]', tempOption[inner_index]);
      tempArr[index]['option'] = tempOption;
      console.log(
        'keyOfOption[key][option][inner_inner_index]',
        tempArr[index]['option']
      );
      setForm(tempArr);
    } else {
      const keyOfOption = tempOption[inner_index];
      keyOfOption[key][field] = value;
      tempOption[inner_index] = keyOfOption;
      tempArr[index]['option'] = tempOption;
      setForm(tempArr);
    }
  };
  const getFormData = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `${BASE_URL}/form?form_name=${location?.state?.form_name}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((res) => {
        setFormSettingData(res?.result);
        if (res.result.franchisee) {
          selectedFranchisee = JSON.parse(res?.result?.franchisee);
        }
        if (res.result.user) {
          selectedUserRole = JSON.parse(res?.result?.user);
        }
      })
      .catch((error) => console.log('error', error));
  };
  const getFormField = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `${BASE_URL}/field?form_name=${location?.state?.form_name}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((res) => {
        if (res?.result.length > 0) {
          let sectionData = [];
          res?.result?.map((item) => {
            if (item.option) {
              item.option = JSON.parse(item.option);
            }
            if (item?.section_name) {
              if (
                !sectionData.includes(item?.section_name.split('_').join(' '))
              ) {
                sectionData.push(item?.section_name.split('_').join(' '));
              }
            }
          });
          setSection(sectionData);
          if (!conditionFlag && !groupFlag) {
            setForm(res?.result);
            // setConditionModelData(res?.result);
            setGroupModelData(res?.result);
          } else if (groupFlag) {
            setGroupModelData(res?.result);
          } else {
            // setConditionModelData(res?.result);
          }
        }
      })
      .catch((error) => console.log('error', error));
  };
  const deleteFormField = (id) => {
    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/field/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log('delete data successfully!'))
      .catch((error) => console.log('error', error));
  };
  const onSubmitSetting = (e) => {
    e.preventDefault();

    const newErrors = createFormSettingModelValidation(
      formSettingData,
      selectedFranchisee,
      selectedUserRole
    );

    if (Object.keys(newErrors).length > 0) {
      setFormSettingError(newErrors);
    } else {
      var myHeaders = new Headers();
      console.log('Select Franchisee', selectedFranchisee);
      console.log('Select User Role', selectedUserRole);
      myHeaders.append('Content-Type', 'application/json');
      let data = formSettingData;
      if (
        data['applicable_to_franchisee'] === 'No' ||
        data['applicable_to_franchisee'] === false
      )
        data['franchisee'] = JSON.stringify(selectedFranchisee);
      if (
        data['applicable_to_user'] === 'No' ||
        data['applicable_to_user'] === false
      )
        data['user'] = JSON.stringify(selectedUserRole);
      fetch(`${BASE_URL}/form?form_name=${location?.state?.form_name}`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: myHeaders,
      })
        .then((res) => res.json())
        .then((res) => {
          alert('Submit Successfully---->');
          setFormSettingData(res?.result);
          if (res.result.franchisee) {
            selectedFranchisee = JSON.parse(res?.result?.franchisee);
          }
          if (res.result.user) {
            selectedUserRole = JSON.parse(res?.result?.user);
          }
          console.log('selected Franchisee--->', selectedFranchisee);
          console.log('selected UserRole------>', selectedUserRole);
        });
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    alert('Hello');
    const newErrors = createFormFieldValidation(form);
    console.log('newErrors--onSubmit--->', newErrors);
    let error_flag = false;
    newErrors.map((item) => {
      if (Object.values(item)[0]) {
        if (Array.isArray(Object.values(item)[0])) {
          Object.values(item)[0].map((inner_item) => {
            if (inner_item || !inner_item === '') {
              error_flag = true;
            }
          });
        } else {
          if (!item === '' || item) {
            error_flag = true;
          }
        }
      }
    });
    if (error_flag) {
      setErrors(newErrors);
    } else {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      fetch(`${BASE_URL}/field/add?form_name=${location?.state?.form_name}`, {
        method: 'post',
        body: JSON.stringify(form),
        headers: myHeaders,
      })
        .then((res) => res.json())
        .then((res) => {
          alert('Submit Successfully---->');
          res?.result?.map((item) => {
            if (item.option) {
              item.option = JSON.parse(item.option);
            }
          });
          setForm(res?.result);
        });
    }
  };
  const setField = (field, value, index, inner_index) => {
    counter++;
    setCount(counter);
    setIndex(index);
    const tempArr = form;
    const tempObj = tempArr[index];
    if (field === 'option') {
      console.log('tempObj----->', tempObj);
      const tempOption = tempObj['option'];
      console.log('tempoption---->', tempOption);
      tempOption[inner_index] = { [value]: value };
      tempArr[index]['option'] = tempOption;
      setForm(tempArr);
    } else if (
      field === 'field_type' &&
      (value === 'radio' ||
        value === 'checkbox' ||
        value === 'dropdown_selection')
    ) {
      console.log('Hello field---->', field);
      console.log('Hello value---->', value);
      tempObj['option'] = [{ '': '' }, { '': '' }];
      tempObj[field] = value;
      tempArr[index] = tempObj;
      setForm(tempArr);
    } else {
      tempObj[field] = value;
      tempArr[index] = tempObj;
      setForm(tempArr);
    }

    if (!!errors[index][field]) {
      if (field === 'option') {
        let tempErrorArray = errors;
        let tempErrorObj = tempErrorArray[index];
        tempErrorObj['option'][inner_index] = undefined;
        tempErrorArray[index] = tempErrorObj;

        setErrors(tempErrorArray);
        console.log(
          'option.length--->',
          tempErrorObj['option'].length,
          '======',
          inner_index,
          '-------',
          tempErrorObj['option']
        );
        console.log('Hello--->', tempErrorArray);
      } else {
        let tempErrorArray = errors;
        let tempErrorObj = tempErrorArray[index];
        delete tempErrorObj[field];
        tempErrorArray[index] = tempErrorObj;
        setErrors(tempErrorArray);
        console.log('Hello--->', tempErrorArray);
      }
    }
  };
  // console.log("conditionModelData==>", conditionModelData);
  return (
    <>
      {console.log('form--->', form)}
      {console.log('formSettingData---->', formSettingData)}
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
                <TopHeader />
                <Row>
                  <Col sm={8}>
                    <div className="mynewForm-heading">
                      <Button
                        onClick={() => {
                          navigate('/form/add');
                        }}
                      >
                        <img src="../../img/back-arrow.svg" />
                      </Button>
                      <h4 className="mynewForm">My New Form</h4>
                      <Button
                        onClick={() => {
                          setFormSettingFlag(true);
                        }}
                      >
                        <img src="../../img/carbon_settings.svg" />
                      </Button>
                    </div>
                  </Col>
                  {/* <Col sm={4}>
                  <a href="#">Questions</a>
                  <a href="#">Answers</a>
                </Col> */}
                  <Col sm={12}>
                    <p className="myform-details">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit, sed do eiusmod tempor incididunt ut labore et dolore
                      magna aliqua.
                    </p>
                  </Col>
                </Row>
                <Form>
                  {form?.map((item, index) => {
                    return (
                      <div className="my-new-formsection">
                        <Row>
                          {index === 0 ? (
                            <Col sm={12}>
                              <Form.Label className="formlabel">
                                Label {index + 1}
                              </Form.Label>
                            </Col>
                          ) : (
                            <>
                              <Col xs={6}>
                                <Form.Label className="formlabel">
                                  Label {index + 1}
                                </Form.Label>
                              </Col>
                              <Col xs={6}>
                                <div className="remove-button">
                                  <Button
                                    variant="link"
                                    onClick={() => {
                                      counter++;
                                      setCount(counter);
                                      let data = form;
                                      if (data[index]?.id) {
                                        deleteFormField(data[index]?.id);
                                      }
                                      data.splice(index, 1);
                                      setForm(data);
                                    }}
                                  >
                                    <img src="../../img/removeIcon.svg" />{' '}
                                    Remove
                                  </Button>
                                </div>
                              </Col>
                            </>
                          )}
                        </Row>
                        <div className="label-one">
                          <Row>
                            <Col sm={6}>
                              <div className="my-form-input">
                                <Form.Control
                                  type="text"
                                  name="field_label"
                                  value={form[index]?.field_label}
                                  onChange={(e) => {
                                    setField(
                                      e.target.name,
                                      e.target.value,
                                      index
                                    );
                                  }}
                                  placeholder="Some text here for the label"
                                  isInvalid={!!errors[index]?.field_label}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors[index]?.field_label}
                                </Form.Control.Feedback>
                                <div className="input-img">
                                  <img src="../../img/input-img.svg" />
                                </div>
                              </div>
                            </Col>
                            <Col sm={6}>
                              <div className="text-answer-div default-arrow-select">
                                <Form.Select
                                  name="field_type"
                                  onChange={(e) => {
                                    setField(
                                      e.target.name,
                                      e.target.value,
                                      index
                                    );
                                  }}
                                >
                                  <option
                                    value="text"
                                    selected={
                                      form[index]?.field_type === 'text'
                                    }
                                  >
                                    Text Answer
                                  </option>
                                  <option
                                    value="radio"
                                    selected={
                                      form[index]?.field_type === 'radio'
                                    }
                                  >
                                    Multiple Choice
                                  </option>
                                  <option
                                    value="checkbox"
                                    selected={
                                      form[index]?.field_type === 'checkbox'
                                    }
                                  >
                                    Checkboxes
                                  </option>
                                  <option
                                    value="date"
                                    selected={
                                      form[index]?.field_type === 'date'
                                    }
                                  >
                                    Date
                                  </option>
                                  <option
                                    value="image_upload"
                                    selected={
                                      form[index]?.field_type === 'image_upload'
                                    }
                                  >
                                    Image Upload
                                  </option>
                                  <option
                                    value="document_attachment"
                                    selected={
                                      form[index]?.field_type ===
                                      'document_attachment'
                                    }
                                  >
                                    Document Attachment
                                  </option>
                                  <option
                                    value="signature"
                                    selected={
                                      form[index]?.field_type === 'signature'
                                    }
                                  >
                                    Signature
                                  </option>
                                  <option
                                    value="instruction_text"
                                    selected={
                                      form[index]?.field_type ===
                                      'instruction_text'
                                    }
                                  >
                                    Instruction Text
                                  </option>
                                  <option
                                    value="headings"
                                    selected={
                                      form[index]?.field_type === 'headings'
                                    }
                                  >
                                    Headings
                                  </option>
                                  <option
                                    value="dropdown_selection"
                                    selected={
                                      form[index]?.field_type ===
                                      'dropdown_selection'
                                    }
                                  >
                                    Drop down selection
                                  </option>
                                </Form.Select>
                                <div className="input-text-img">
                                  <img
                                    src={
                                      form[index]?.field_type === 'text'
                                        ? '../../img/input-text-icon.svg'
                                        : form[index]?.field_type === 'radio'
                                        ? '../../img/multiple-choice-icon.svg'
                                        : form[index]?.field_type === 'checkbox'
                                        ? '../../img/check_boxIcon.svg'
                                        : '../../img/input-text-icon.svg'
                                    }
                                  />
                                </div>
                              </div>
                            </Col>
                            {form[index]?.field_type === 'dropdown_selection' ||
                            form[index]?.field_type === 'radio' ||
                            form[index]?.field_type === 'checkbox' ? (
                              <>
                                {form[index]?.option?.map(
                                  (item, inner_index) => {
                                    return (
                                      <Col sm={6}>
                                        {console.log(
                                          'item---->',
                                          item[Object.keys(item)[0]]
                                        )}
                                        <div className="my-form-input">
                                          <Form.Control
                                            type="text"
                                            name="option"
                                            value={Object.keys(item)[0]}
                                            onChange={(e) => {
                                              setField(
                                                e.target.name,
                                                e.target.value,
                                                index,
                                                inner_index
                                              );
                                            }}
                                            placeholder={
                                              'Option ' + (inner_index + 1)
                                            }
                                            isInvalid={
                                              errors[index]?.option
                                                ? !!errors[index]?.option[
                                                    inner_index
                                                  ]
                                                : null
                                            }
                                          />
                                          <Form.Control.Feedback type="invalid">
                                            {errors[index]?.option
                                              ? errors[index]?.option[
                                                  inner_index
                                                ]
                                              : ''}
                                          </Form.Control.Feedback>
                                          <div className="delete-icon">
                                            <img
                                              src="../../img/removeIcon.svg"
                                              onClick={() => {
                                                const tempArr = form;
                                                const tempObj = tempArr[index];
                                                if (
                                                  tempObj['option'].length > 2
                                                ) {
                                                  counter++;
                                                  setCount(counter);
                                                  tempObj['option'].splice(
                                                    inner_index,
                                                    1
                                                  );
                                                  tempArr[index] = tempObj;
                                                  setForm(tempArr);
                                                }
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </Col>
                                    );
                                  }
                                )}
                              </>
                            ) : null}
                          </Row>
                        </div>

                        <div className="apply-section">
                          <Row>
                            <Col md={6}>
                              <div className="apply-condition">
                                {form[index]?.field_type ===
                                  'dropdown_selection' ||
                                form[index]?.field_type === 'radio' ||
                                form[index]?.field_type === 'checkbox' ? (
                                  <>
                                    <Button
                                      onClick={() => {
                                        counter++;
                                        setCount(counter);
                                        const tempArr = form;
                                        const tempObj = tempArr[index];
                                        tempObj['option'].push({ '': '' });
                                        tempArr[index] = tempObj;
                                        setForm(tempArr);
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faPlus} /> Add
                                      Option
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        let fillOptionCounter = 0;
                                        setIndex(index);
                                        const tempArr = form;
                                        const tempObj = tempArr[index];
                                        const tempOption = tempObj['option'];

                                        tempOption.map((item) => {
                                          if (!(Object.keys(item)[0] === '')) {
                                            fillOptionCounter++;
                                          }
                                        });
                                        if (
                                          tempOption.length ===
                                          fillOptionCounter
                                        ) {
                                          setConditionFlag(!conditionFlag);

                                          tempOption.map((item, index) => {
                                            if (
                                              Object.keys(item)[0] ===
                                              Object.values(item)[0]
                                            ) {
                                              item[Object.keys(item)[0]] = {
                                                field_type: 'text',
                                                option: [
                                                  { '': '' },
                                                  { '': '' },
                                                ],
                                              };
                                            }
                                          });
                                        } else {
                                          alert('Please Fill Option First');
                                        }

                                        tempArr[index]['option'] = tempOption;

                                        setForm(tempArr);
                                      }}
                                    >
                                      Apply Condition
                                    </Button>
                                  </>
                                ) : null}
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="add-group-t-button">
                                <div className="add-g">
                                  <Button
                                    onClick={() => {
                                      setGroupFlag(!groupFlag);
                                      setCreateSectionFlag(false);
                                      setIndex(index);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faPlus} />
                                    Add to Group
                                  </Button>
                                </div>
                                <div className="required">
                                  <p>Required</p>
                                </div>
                                <div className="toogle-swich">
                                  <input
                                    className="switch"
                                    name="required"
                                    type="checkbox"
                                    checked={form[index]?.required}
                                    onChange={(e) => {
                                      setField(
                                        e.target.name,
                                        e.target.checked,
                                        index
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    );
                  })}

                  <Row>
                    <Col sm={12}>
                      <div className="add-q">
                        <Button
                          variant="link"
                          onClick={() => {
                            let data = form;
                            console.log('data----?', data);
                            counter++;
                            setCount(counter);
                            data.push({ field_type: 'text' });
                            setForm(data);
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} /> Add Question
                        </Button>
                      </div>
                      <div className="button mb-5">
                        <Button className="preview">Preview</Button>
                        <Button className="saveForm" onClick={onSubmit}>
                          Save Form
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <div className="applyCondition-modal">
                    {conditionFlag ? (
                      <Modal
                        show={conditionFlag}
                        onHide={() => {
                          setConditionFlag(false);
                          getFormField();
                        }}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title
                            id="contained-modal-title-vcenter"
                            className="modal-heading"
                          >
                            Condition
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="modal-condtion">
                            {form[Index]?.['option']?.map((item, index) => {
                              return (
                                <Row>
                                  {console.log(
                                    'item------of---model=---->',
                                    Object.values(item)[0]
                                  )}
                                  <Col sm={12}>
                                    <Form.Label className="formlabel modal-m-lable">
                                      If{' '}
                                      <span className="modal-lable">
                                        {Object.keys(item) &&
                                        !(Object.keys(item)[0] === '')
                                          ? Object.keys(item)[0]
                                          : 'Option ' + (index + 1)}{' '}
                                      </span>
                                      is selected,
                                    </Form.Label>
                                  </Col>
                                  <Col sm={12}>
                                    <Form.Label>Label</Form.Label>
                                  </Col>
                                  <Col lg={6}>
                                    <Form.Control
                                      type="text"
                                      name="field_label"
                                      value={
                                        Object.values(item)[0]['field_label']
                                      }
                                      placeholder="Some text here for the label"
                                      onChange={(e) => {
                                        setConditionField(
                                          e.target.name,
                                          e.target.value,
                                          Index,
                                          index,
                                          0,
                                          Object.keys(item)[0]
                                        );
                                      }}
                                    />
                                  </Col>
                                  <Col lg={6} className="mt-3 mt-lg-0">
                                    <div className="text-answer-div">
                                      <Form.Select
                                        name="field_type"
                                        onChange={(e) => {
                                          setConditionField(
                                            e.target.name,
                                            e.target.value,
                                            Index,
                                            index,
                                            0,
                                            Object.keys(item)[0]
                                          );
                                        }}
                                      >
                                        <option
                                          value="text"
                                          selected={
                                            Object.values(item)[0][
                                              'field_type'
                                            ] === 'text'
                                          }
                                        >
                                          Text Answer
                                        </option>
                                        <option
                                          value="radio"
                                          selected={
                                            Object.values(item)[0][
                                              'field_type'
                                            ] === 'radio'
                                          }
                                        >
                                          Multiple Choice
                                        </option>
                                        <option
                                          value="checkbox"
                                          selected={
                                            Object.values(item)[0][
                                              'field_type'
                                            ] === 'checkbox'
                                          }
                                        >
                                          Checkboxes
                                        </option>
                                        <option
                                          value="date"
                                          selected={
                                            Object.values(item)[0][
                                              'field_type'
                                            ] === 'date'
                                          }
                                        >
                                          Date
                                        </option>
                                        <option
                                          value="image_upload"
                                          selected={
                                            Object.values(item)[0][
                                              'field_type'
                                            ] === 'image_upload'
                                          }
                                        >
                                          Image Upload
                                        </option>
                                        <option
                                          value="document_attachment"
                                          selected={
                                            Object.values(item)[0][
                                              'field_type'
                                            ] === 'document_attachment'
                                          }
                                        >
                                          Document Attachment
                                        </option>
                                        <option
                                          value="signature"
                                          selected={
                                            Object.values(item)[0][
                                              'field_type'
                                            ] === 'signature'
                                          }
                                        >
                                          Signature
                                        </option>
                                        <option
                                          value="instruction_text"
                                          selected={
                                            Object.values(item)[0][
                                              'field_type'
                                            ] === 'instruction_text'
                                          }
                                        >
                                          Instruction Text
                                        </option>
                                        <option
                                          value="headings"
                                          selected={
                                            Object.values(item)[0][
                                              'field_type'
                                            ] === 'headings'
                                          }
                                        >
                                          Headings
                                        </option>
                                        <option
                                          value="dropdown_selection"
                                          selected={
                                            Object.values(item)[0][
                                              'field_type'
                                            ] === 'dropdown_selection'
                                          }
                                        >
                                          Drop down selection
                                        </option>
                                      </Form.Select>
                                      <div className="input-text-img">
                                        <img src="../../img/input-text-icon.svg" />
                                      </div>
                                    </div>
                                  </Col>
                                  {item[Object.keys(item)[0]].field_type ===
                                    'radio' ||
                                  item[Object.keys(item)[0]].field_type ===
                                    'checkbox' ||
                                  item[Object.keys(item)[0]].field_type ===
                                    'dropdown_selection' ? (
                                    <>
                                      {item[Object.keys(item)[0]]['option'].map(
                                        (inner_item, inner_index) => {
                                          return (
                                            <Col lg={6}>
                                              {console.log(
                                                'inner_item--->',
                                                inner_item
                                              )}
                                              <div className="my-form-input my-form-input-modal">
                                                <Form.Control
                                                  type="text"
                                                  name="option"
                                                  value={
                                                    inner_item[
                                                      Object.keys(inner_item)[0]
                                                    ]
                                                  }
                                                  placeholder={
                                                    'Option ' +
                                                    (inner_index + 1)
                                                  }
                                                  onChange={(e) => {
                                                    setConditionField(
                                                      e.target.name,
                                                      e.target.value,
                                                      Index,
                                                      index,
                                                      inner_index,
                                                      Object.keys(item)[0]
                                                    );
                                                  }}
                                                />
                                                <div
                                                  className="delete-icon modal-remove-icon"
                                                  onClick={() => {
                                                    counter++;
                                                    setCount(counter);

                                                    const tempArr = form;

                                                    const tempObj =
                                                      tempArr[Index];

                                                    const tempOption =
                                                      tempObj['option'];

                                                    const keyOfOption =
                                                      tempOption[index];
                                                    if (
                                                      keyOfOption.length > 2
                                                    ) {
                                                      keyOfOption[
                                                        Object.keys(item)[0]
                                                      ]['option'].splice(
                                                        inner_index,
                                                        1
                                                      );
                                                      tempOption[index] =
                                                        keyOfOption;
                                                      tempArr[Index]['option'] =
                                                        tempOption;
                                                      setForm(tempArr);
                                                      counter++;
                                                      setCount(counter);
                                                    }
                                                  }}
                                                >
                                                  <img src="../../img/removeIcon.svg" />
                                                </div>
                                              </div>
                                            </Col>
                                          );
                                        }
                                      )}
                                    </>
                                  ) : null}

                                  <div className="apply-condition pb-2">
                                    {!(
                                      item[Object.keys(item)[0]].field_type ===
                                      'text'
                                    ) ? (
                                      <Button
                                        onClick={() => {
                                          counter++;
                                          setCount(counter);
                                          const tempArr = form;
                                          const tempObj = tempArr[Index];
                                          const tempOption = tempObj['option'];

                                          const keyOfOption = tempOption[index];
                                          keyOfOption[Object.keys(item)[0]][
                                            'option'
                                          ].push({ '': '' });
                                          tempOption[index] = keyOfOption;
                                          tempArr[Index]['option'] = tempOption;
                                          setForm(tempArr);
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faPlus} /> Add
                                        Option
                                      </Button>
                                    ) : null}
                                  </div>
                                </Row>
                              );
                            })}
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            className="back"
                            onClick={() => {
                              setConditionFlag(false);
                              getFormField();
                            }}
                          >
                            Back
                          </Button>
                          <Button
                            className="done"
                            onClick={() => {
                              setConditionFlag(false);
                              // setForm(conditionModelData);
                              counter++;
                              setCount(counter);
                            }}
                          >
                            Done
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    ) : null}
                  </div>

                  <div className="select-section-modal">
                    <Modal
                      show={groupFlag}
                      onHide={() => {
                        setGroupFlag(false);
                        getFormField();
                      }}
                      size="md"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title
                          id="contained-modal-title-vcenter"
                          className="modal-heading"
                        >
                          Select Section
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="modalTwo-select">
                          <div className="modal-two-check">
                            {section?.map((item) => {
                              return (
                                <label className="container">
                                  {item}
                                  <input
                                    type="radio"
                                    id={item}
                                    value={item}
                                    name="section_name"
                                    checked={
                                      groupModelData[Index]?.section_name ===
                                      item.toLowerCase().split(' ').join('_')
                                    }
                                    onChange={(e) => {
                                      counter++;
                                      setCount(counter);
                                      e.target.value = e.target.value
                                        .toLocaleLowerCase()
                                        .split(' ')
                                        .join('_');
                                      const tempArr = groupModelData;
                                      const tempObj = tempArr[Index];
                                      tempObj[e.target.name] = e.target.value;
                                      tempArr[Index] = tempObj;
                                      setGroupModelData(tempArr);
                                    }}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        {!createSectionFlag ? (
                          <>
                            <div className="apply-condition modal-two-footer pb-2">
                              <Button
                                onClick={() => {
                                  setCreateSectionFlag(true);
                                }}
                              >
                                <FontAwesomeIcon icon={faPlus} /> Create Section
                              </Button>
                            </div>
                            <Button
                              className="done"
                              onClick={() => {
                                setGroupFlag(!groupFlag);
                              }}
                            >
                              Done
                            </Button>
                          </>
                        ) : null}

                        {createSectionFlag ? (
                          <div className="three-modal-footer">
                            <div className="modal-three">
                              <div className="my-form-input my-form-input-modal">
                                <Form.Control
                                  className="mb-0"
                                  type="text"
                                  name="section_title"
                                  value={sectionTitle}
                                  onChange={(e) => {
                                    setSectionTitle(e.target.value);
                                  }}
                                  placeholder="Section"
                                />
                                <Button
                                  className="right-button"
                                  disabled={sectionTitle === '' ? true : false}
                                  onClick={() => {
                                    counter++;
                                    setCount(counter);
                                    let sectionData = section;
                                    sectionData.push(sectionTitle);
                                    setSection(sectionData);
                                    setSectionTitle('');
                                    setCreateSectionFlag(false);
                                  }}
                                >
                                  <img src="../../img/right-sign-img.svg" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </Modal.Footer>
                    </Modal>
                  </div>
                  <Modal
                    show={formSettingFlag}
                    onHide={() => setFormSettingFlag(false)}
                    size="lg"
                    className="form-settings-modal"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title
                        id="contained-modal-title-vcenter"
                        className="modal-heading"
                      >
                        <img src="../../img/carbon_settings.svg" />
                        Form Settings
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="form-settings-content">
                        <Row>
                          <Col lg={3} sm={6}>
                            <Form.Group>
                              <Form.Label>Start Date</Form.Label>
                              <Form.Control
                                type="date"
                                name="start_date"
                                value={formSettingData?.start_date}
                                onChange={(e) => {
                                  setFormSettingFields(
                                    e.target.name,
                                    e.target.value
                                  );
                                }}
                                isInvalid={!!formSettingError.start_date}
                              />
                              <Form.Control.Feedback type="invalid">
                                {formSettingError.start_date}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col lg={3} sm={6} className="mt-3 mt-sm-0">
                            <Form.Group>
                              <Form.Label>Start Time</Form.Label>
                              <Form.Control
                                type="time"
                                name="start_time"
                                value={formSettingData?.start_time}
                                onChange={(e) => {
                                  setFormSettingFields(
                                    e.target.name,
                                    e.target.value
                                  );
                                }}
                                isInvalid={!!formSettingError.start_time}
                              />
                              <Form.Control.Feedback type="invalid">
                                {formSettingError.start_time}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                            <Form.Group>
                              <Form.Label>End Date</Form.Label>
                              <Form.Control
                                type="date"
                                name="end_date"
                                value={formSettingData?.end_date}
                                onChange={(e) => {
                                  setFormSettingFields(
                                    e.target.name,
                                    e.target.value
                                  );
                                }}
                                isInvalid={!!formSettingError.end_date}
                              />
                              <Form.Control.Feedback type="invalid">
                                {formSettingError.end_date}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                            <Form.Group>
                              <Form.Label>End Time</Form.Label>
                              <Form.Control
                                type="time"
                                name="end_time"
                                value={formSettingData?.end_time}
                                onChange={(e) => {
                                  setFormSettingFields(
                                    e.target.name,
                                    e.target.value
                                  );
                                }}
                                isInvalid={!!formSettingError.end_time}
                              />
                              <Form.Control.Feedback type="invalid">
                                {formSettingError.end_time}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col lg={3} md={6}>
                            <Form.Group>
                              <Form.Label>
                                Applicable to all franchisee
                              </Form.Label>
                              <div className="new-form-radio">
                                <div className="new-form-radio-box">
                                  <label for="yes">
                                    <input
                                      type="radio"
                                      value="Yes"
                                      name="applicable_to_franchisee"
                                      id="yes"
                                      onChange={(e) => {
                                        setFormSettingFields(
                                          e.target.name,
                                          e.target.value
                                        );
                                      }}
                                      checked={
                                        formSettingData?.applicable_to_franchisee ===
                                          true ||
                                        formSettingData?.applicable_to_franchisee ===
                                          'Yes'
                                      }
                                    />
                                    <span className="radio-round"></span>
                                    <p>Yes</p>
                                  </label>
                                </div>
                                <div className="new-form-radio-box">
                                  <label for="no">
                                    <input
                                      type="radio"
                                      value="No"
                                      name="applicable_to_franchisee"
                                      id="no"
                                      onChange={(e) => {
                                        setFormSettingFields(
                                          e.target.name,
                                          e.target.value
                                        );
                                      }}
                                      checked={
                                        formSettingData?.applicable_to_franchisee ===
                                          false ||
                                        formSettingData?.applicable_to_franchisee ===
                                          'No'
                                      }
                                    />
                                    <span className="radio-round"></span>
                                    <p>No</p>
                                  </label>
                                </div>
                              </div>
                            </Form.Group>
                          </Col>
                          {formSettingData?.applicable_to_franchisee === 'No' ||
                          formSettingData?.applicable_to_franchisee ===
                            false ? (
                            <Col lg={9} md={6} className="mt-3 mt-md-0">
                              <Form.Group>
                                <Form.Label>Select Franchisee</Form.Label>
                                <Multiselect
                                  displayValue="registered_name"
                                  className="multiselect-box default-arrow-select"
                                  placeholder="Select Franchisee"
                                  selectedValues={selectedFranchisee}
                                  onKeyPressFn={function noRefCheck() {}}
                                  onRemove={onRemoveFranchisee}
                                  onSearch={function noRefCheck() {}}
                                  onSelect={onSelectFranchisee}
                                  options={franchisee}
                                />
                                <p className="error">
                                  {formSettingError.franchisee}
                                </p>
                              </Form.Group>
                            </Col>
                          ) : null}
                          <Col lg={3} md={6}>
                            <Form.Group>
                              <Form.Label>Applicable to all users</Form.Label>
                              <div className="new-form-radio">
                                <div className="new-form-radio-box">
                                  <label for="yes1">
                                    <input
                                      type="radio"
                                      value="Yes"
                                      name="applicable_to_user"
                                      id="yes1"
                                      onChange={(e) => {
                                        setFormSettingFields(
                                          e.target.name,
                                          e.target.value
                                        );
                                      }}
                                      checked={
                                        formSettingData?.applicable_to_user ==
                                          true ||
                                        formSettingData?.applicable_to_user ===
                                          'Yes'
                                      }
                                    />
                                    <span className="radio-round"></span>
                                    <p>Yes</p>
                                  </label>
                                </div>
                                <div className="new-form-radio-box">
                                  <label for="no1">
                                    <input
                                      type="radio"
                                      value="No"
                                      name="applicable_to_user"
                                      id="no1"
                                      onChange={(e) => {
                                        setFormSettingFields(
                                          e.target.name,
                                          e.target.value
                                        );
                                      }}
                                      checked={
                                        formSettingData?.applicable_to_user ==
                                          false ||
                                        formSettingData?.applicable_to_user ===
                                          'No'
                                      }
                                    />
                                    <span className="radio-round"></span>
                                    <p>No</p>
                                  </label>
                                </div>
                              </div>
                            </Form.Group>
                          </Col>
                          {formSettingData?.applicable_to_user === 'No' ||
                          formSettingData?.applicable_to_user === false ? (
                            <Col lg={9} md={6} className="mt-3 mt-md-0">
                              <Form.Group>
                                <Form.Label>Select User Roles</Form.Label>
                                <Multiselect
                                  placeholder="Select User Roles"
                                  displayValue="role_label"
                                  selectedValues={selectedUserRole}
                                  className="multiselect-box default-arrow-select"
                                  onKeyPressFn={function noRefCheck() {}}
                                  onRemove={onRemoveUserRole}
                                  onSearch={function noRefCheck() {}}
                                  onSelect={onSelectUserRole}
                                  options={userRole}
                                />
                                <p className="error">{formSettingError.user}</p>
                              </Form.Group>
                            </Col>
                          ) : null}
                        </Row>
                      </div>
                    </Modal.Body>
                    <Modal.Footer className="justify-content-center">
                      <Button className="back">Cancel</Button>
                      <Button className="done" onClick={onSubmitSetting}>
                        Save Settings
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </Form>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default AddFormField;
