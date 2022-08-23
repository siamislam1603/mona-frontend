import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import LeftNavbar from '../../../components/LeftNavbar';
import TopHeader from '../../../components/TopHeader';
import Multiselect from 'multiselect-react-dropdown';
import { createFormFieldValidation } from '../../../helpers/validation';
import { BASE_URL } from '../../../components/App';
import { useLocation, useNavigate } from 'react-router-dom';
import Setting from '../Setting';

let counter = 0;
let selectedUserRole = [];
let selectedFillAccessUserId = '';
let selectedFillAccessUser = [];
let selectedSignatoriesUserId = '';
let selectedSignatoriesUser = [];
const token = localStorage.getItem('token');
const AddFormField = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [conditionFlag, setConditionFlag] = useState(false);
  const [groupFlag, setGroupFlag] = useState(false);
  const [formSettingFlag, setFormSettingFlag] = useState(false);
  const [formSettingError, setFormSettingError] = useState({});
  const [count, setCount] = useState(0);
  const [Index, setIndex] = useState(1);
  const [user, setUser] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [selectedFranchiseeId, setSelectedFranchiseeId] = useState(null);
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
    setFormSettingFlag(false);
    if (location?.state?.form_name) {
      getFormField();
      getFormData();
      getUserRoleAndFranchiseeData();
    }
  }, [user]);
  useEffect(() => {
    getUser();
  }, [localStorage.getItem('f_id')]);
  const getUser = () => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);

    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };
    let api_url = '';
    if (selectedFranchisee) {
      if (selectedFranchisee === 'All') api_url = `${BASE_URL}/auth/users`;
      else
        api_url = `${BASE_URL}/user-group/users/franchisee/${selectedFranchisee}`;
    } else {
      api_url = `${BASE_URL}/auth/users`;
    }

    fetch(api_url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result?.data?.map((item) => {
          item['status'] = false;
        });
        if (selectedFranchisee) {
          if (selectedFranchisee === 'All') setUser(result?.data);
          else setUser(result?.users);
        } else setUser(result?.data);
      })
      .catch((error) => console.log('error', error));
  };
  const setCheckBoxField = (name, value, checked, index) => {
    let tempArr = [...form];
    const tempObj = tempArr[index];
    if (checked) {
      tempObj[name] = tempObj[name].replace('undefined', '');
      tempObj[name] += value + ',';
    } else {
      tempObj[name] = tempObj[name].replace(value + ',', '');
    }
    tempArr[Index] = tempObj;
    setForm(tempArr);
  };
  function onFillAccessSelectUser(optionsList, selectedItem) {
    selectedFillAccessUserId += selectedItem.id + ',';
    selectedFillAccessUser.push({
      id: selectedItem.id,
      email: selectedItem.email,
    });
  }
  function onFillAccessRemoveUser(selectedList, removedItem) {
    selectedFillAccessUserId = selectedFillAccessUserId.replace(
      removedItem.id + ',',
      ''
    );
    const index = selectedFillAccessUser.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedFillAccessUser.splice(index, 1);
  }
  function onSignatorieselectUser(optionsList, selectedItem) {
    selectedSignatoriesUserId += selectedItem.id + ',';
    selectedSignatoriesUser.push({
      id: selectedItem.id,
      email: selectedItem.email,
    });
  }
  function onSignatoriesRemoveUser(selectedList, removedItem) {
    selectedSignatoriesUserId = selectedSignatoriesUserId.replace(
      removedItem.id + ',',
      ''
    );
    const index = selectedFillAccessUser.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedSignatoriesUser.splice(index, 1);
  }
  const getUserRoleAndFranchiseeData = () => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
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
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
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
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };

    fetch(
      `${BASE_URL}/field?form_name=${location?.state?.form_name}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((res) => {
        if (res?.result.length > 0) {
          let sectionData = [];
          let flag = false;
          res?.result?.map((item) => {
            if (item.field_type === 'signature') {
              flag = true;
            }
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
            if (
              item?.accessible_to_role === '0' ||
              item?.accessible_to_role === false
            ) {
              user.map((user_item) => {
                if (item?.fill_access_users) {
                  if (
                    item?.fill_access_users.includes(user_item.id.toString())
                  ) {
                    selectedFillAccessUser.push({
                      id: user_item.id,
                      email: user_item.email,
                    });
                    selectedFillAccessUserId += user_item.id + ',';
                  }
                }
                if (item?.signatories_role) {
                  if (item?.signatories_role.includes(item.id.toString())) {
                    selectedSignatoriesUser.push({
                      id: item.id,
                      email: item.email,
                    });
                    selectedSignatoriesUserId += item.id + ',';
                  }
                }
              });
            }
          });

          setSection(sectionData);
          if (!conditionFlag && !groupFlag) {
            if (res?.form_permission?.signatories === true && flag === false) {
              res?.result?.push({
                field_label: 'Signature',
                field_type: 'signature',
              });
            }
            setForm(res?.result);
            setGroupModelData(res?.result);
          } else if (groupFlag) {
            setGroupModelData(res?.result);
          }
        } else {
          if (res?.form?.previous_form !== '') {
            fetch(
              `${BASE_URL}/field?form_name=${res?.form?.previous_form}`,
              requestOptions
            )
              .then((response) => response.json())
              .then((result) => {
                if (result?.result.length > 0) {
                  let sectionData = [];
                  let flag = false;
                  result?.result?.map((item) => {
                    console.log('item.field_type----->', item);
                    if (item.field_type === 'signature') {
                      flag = true;
                    }
                    delete item.id;
                    if (item.option) {
                      item.option = JSON.parse(item.option);
                    }
                    if (item?.section_name) {
                      if (
                        !sectionData.includes(
                          item?.section_name.split('_').join(' ')
                        )
                      ) {
                        sectionData.push(
                          item?.section_name.split('_').join(' ')
                        );
                      }
                    }
                  });
                  setSection(sectionData);
                  if (!conditionFlag && !groupFlag) {
                    if (
                      res?.form_permission?.signatories === true &&
                      flag === false
                    ) {
                      console.log('Hello23423423423');
                      result?.result?.push({
                        field_label: 'Signature',
                        field_type: 'signature',
                      });
                    }
                    setForm(result?.result);
                    setGroupModelData(result?.result);
                  } else if (groupFlag) {
                    setGroupModelData(result?.result);
                  }
                }
              });
          } else if (res?.form_permission?.signatories === true) {
            setForm([
              { field_type: 'text' },
              { field_type: 'radio', option: [{ '': '' }, { '': '' }] },
              { field_type: 'checkbox', option: [{ '': '' }, { '': '' }] },
              {
                field_label: 'Signature',
                field_type: 'signature',
              },
            ]);
          }
        }
      })
      .catch((error) => console.log('error', error));
  };
  const deleteFormField = (id) => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
      headers: myHeaders,
    };

    fetch(`${BASE_URL}/field/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log('delete data successfully!'))
      .catch((error) => console.log('error', error));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const newErrors = createFormFieldValidation(form);
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
      myHeaders.append('authorization', 'Bearer ' + token);
      let data = [...form];
      data?.map((item) => {
        console.log('item.accessible_to_role--->', item.accessible_to_role);
        data['accessible_to_role'] = item.accessible_to_role;
        data['signatories'] = item.signatories;
        if (
          item.accessible_to_role === '1' ||
          item.accessible_to_role === true
        ) {
          item['signatories_role'] = item.signatories_role
            ? item.signatories_role.slice(0, -1)
            : null;
          item['fill_access_users'] = item.fill_access_users
            ? item.fill_access_users.slice(0, -1)
            : null;
        }
        if (
          item.accessible_to_role === '0' ||
          item.accessible_to_role === false
        ) {
          item['signatories_role'] = selectedSignatoriesUserId
            ? selectedSignatoriesUserId.slice(0, -1)
            : null;
          item['fill_access_users'] = selectedFillAccessUserId
            ? selectedFillAccessUserId.slice(0, -1)
            : null;
        }
        if (item.section_name) {
          item['franchisee_id'] = localStorage.getItem('f_id');
          item['shared_by'] = localStorage.getItem('user_id');
          item['section'] = true;
        } else {
          item['section'] = false;
        }
      });

      fetch(`${BASE_URL}/field/add?form_name=${location?.state?.form_name}`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: myHeaders,
      })
        .then((res) => res.json())
        .then((res) => {
          navigate('/form');

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
      const tempOption = tempObj['option'];
      tempOption[inner_index] = { [value]: value };
      tempArr[index]['option'] = tempOption;
      setForm(tempArr);
    } else if (
      field === 'field_type' &&
      (value === 'radio' ||
        value === 'checkbox' ||
        value === 'dropdown_selection')
    ) {
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
      } else {
        let tempErrorArray = errors;
        let tempErrorObj = tempErrorArray[index];
        delete tempErrorObj[field];
        tempErrorArray[index] = tempErrorObj;
        setErrors(tempErrorArray);
      }
    }
  };
  return (
    <>
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
                <TopHeader
                  selectedFranchisee={selectedFranchisee}
                  setSelectedFranchisee={(id) => {
                    id =
                      localStorage.getItem('user_role') === 'guardian'
                        ? localStorage.getItem('franchisee_id')
                        : id;
                    setSelectedFranchiseeId(id);
                    localStorage.setItem('f_id', id);
                  }}
                />
                <Row>
                  <Col sm={8}>
                    <div className="mynewForm-heading">
                      <Button
                        onClick={() => {
                          navigate('/form/setting', {
                            state: {
                              id: location?.state?.id,
                              form_name: location?.state?.form_name,
                            },
                          });
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
                      <>
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
                                        let data = [...form];
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
                                        form[index]?.field_type ===
                                        'image_upload'
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
                                          : form[index]?.field_type ===
                                            'checkbox'
                                          ? '../../img/check_boxIcon.svg'
                                          : '../../img/input-text-icon.svg'
                                      }
                                    />
                                  </div>
                                </div>
                              </Col>
                              {form[index]?.field_type ===
                                'dropdown_selection' ||
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
                                                  const tempObj =
                                                    tempArr[index];
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
                                            if (
                                              !(Object.keys(item)[0] === '')
                                            ) {
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
                        <div className="add-q">
                          <Button
                            variant="link"
                            onClick={() => {
                              let data = [...form];
                              data.splice(index + 1, 0, {
                                field_type: 'text',
                                field_label: '',
                              });
                              setForm(data);
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} /> Add Field
                          </Button>
                        </div>
                      </>
                    );
                  })}

                  <Row>
                    <Col sm={12}>
                      <div className="button mb-5">
                        <Button
                          className="preview"
                          onClick={() => {
                            navigate(
                              `/form/preview/${location?.state?.form_name}`,
                              {
                                state: {
                                  id: location?.state?.id,
                                  form_name: location?.state?.form_name,
                                },
                              }
                            );
                          }}
                        >
                          Preview
                        </Button>
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
                                                    const tempArr = [...form];
                                                    const tempObj = {
                                                      ...tempArr[Index],
                                                    };

                                                    const tempOption = {
                                                      ...tempObj['option'],
                                                    };

                                                    const keyOfOption = {
                                                      ...tempOption[index],
                                                    };
                                                    if (
                                                      keyOfOption[
                                                        Object.keys(item)[0]
                                                      ].option.length > 2
                                                    ) {
                                                      keyOfOption[
                                                        Object.keys(item)[0]
                                                      ]['option'].splice(
                                                        inner_index,
                                                        1
                                                      );
                                                      setForm(tempArr);
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
                      className="select_group_model"
                      show={groupFlag}
                      onHide={() => {
                        setGroupFlag(false);
                      }}
                      size="xl"
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
                                <>
                                  <label className="container">
                                    {item}
                                    <input
                                      type="radio"
                                      id={item}
                                      value={item}
                                      name="section_name"
                                      checked={
                                        form[Index]?.section_name ===
                                        item.toLowerCase().split(' ').join('_')
                                      }
                                      onChange={(e) => {
                                        e.target.value = e.target.value
                                          .toLocaleLowerCase()
                                          .split(' ')
                                          .join('_');
                                        const tempArr = [...form];
                                        const tempObj = tempArr[Index];
                                        tempObj[e.target.name] = e.target.value;
                                        tempObj['fill_access_users'] = '';
                                        tempObj['signatories_role'] = '';
                                        tempObj['accessible_to_role'] = '1';
                                        tempArr[Index] = tempObj;
                                        setForm(tempArr);
                                      }}
                                    />
                                    <span className="checkmark"></span>
                                  </label>
                                  {form[Index]?.section_name ===
                                    item.toLowerCase().split(' ').join('_') && (
                                    <>
                                      <Col md={12}>
                                        <Form.Group>
                                          <Form.Label className="form_label_title">
                                            Select:
                                          </Form.Label>
                                          <div className="new-form-radio">
                                            <div className="new-form-radio-box">
                                              <label for="user_role">
                                                <input
                                                  type="radio"
                                                  value={1}
                                                  name="accessible_to_role"
                                                  id="user_role"
                                                  onChange={(e) => {
                                                    setField(
                                                      e.target.name,
                                                      e.target.value,
                                                      Index
                                                    );
                                                  }}
                                                  checked={
                                                    form[Index]
                                                      ?.accessible_to_role ===
                                                      '1' ||
                                                    form[Index]
                                                      ?.accessible_to_role ===
                                                      true
                                                  }
                                                />
                                                <span className="radio-round"></span>
                                                <p>User Roles</p>
                                              </label>
                                            </div>
                                            <div className="new-form-radio-box">
                                              <label for="specific_user">
                                                <input
                                                  type="radio"
                                                  value={0}
                                                  name="accessible_to_role"
                                                  id="specific_user"
                                                  onChange={(e) => {
                                                    setField(
                                                      e.target.name,
                                                      e.target.value,
                                                      Index
                                                    );
                                                  }}
                                                  checked={
                                                    form[Index]
                                                      ?.accessible_to_role ===
                                                      '0' ||
                                                    form[Index]
                                                      ?.accessible_to_role ===
                                                      false
                                                  }
                                                />
                                                <span className="radio-round"></span>
                                                <p>Specific Users</p>
                                              </label>
                                            </div>
                                          </div>
                                        </Form.Group>
                                      </Col>
                                      {form[Index]?.accessible_to_role ===
                                        '1' ||
                                      form[Index]?.accessible_to_role ===
                                        true ? (
                                        <>
                                          <Col md={12} className="mt-2">
                                            <Form.Label>
                                              Fill access user:
                                            </Form.Label>
                                            <div className="checkbox-card">
                                              <div className="modal-two-check user-roles-box">
                                                <label className="container">
                                                  Franchisor Admin
                                                  <input
                                                    type="checkbox"
                                                    name="fill_access_users"
                                                    value="franchisor_admin"
                                                    checked={form[
                                                      Index
                                                    ]?.fill_access_users?.includes(
                                                      'franchisor_admin'
                                                    )}
                                                    onChange={(e) => {
                                                      setCheckBoxField(
                                                        e.target.name,
                                                        e.target.value,
                                                        e.target.checked,
                                                        Index
                                                      );
                                                    }}
                                                  />
                                                  <span className="checkmark"></span>
                                                </label>
                                                <label className="container">
                                                  Franchisee Admin
                                                  <input
                                                    type="checkbox"
                                                    name="fill_access_users"
                                                    value="franchisee_admin"
                                                    checked={form[
                                                      Index
                                                    ]?.fill_access_users?.includes(
                                                      'franchisee_admin'
                                                    )}
                                                    onChange={(e) => {
                                                      setCheckBoxField(
                                                        e.target.name,
                                                        e.target.value,
                                                        e.target.checked,
                                                        Index
                                                      );
                                                    }}
                                                  />
                                                  <span className="checkmark"></span>
                                                </label>
                                                <label className="container">
                                                  Co-ordinators
                                                  <input
                                                    type="checkbox"
                                                    name="fill_access_users"
                                                    value="coordinator"
                                                    checked={form[
                                                      Index
                                                    ]?.fill_access_users?.includes(
                                                      'coordinator'
                                                    )}
                                                    onChange={(e) => {
                                                      setCheckBoxField(
                                                        e.target.name,
                                                        e.target.value,
                                                        e.target.checked,
                                                        Index
                                                      );
                                                    }}
                                                  />
                                                  <span className="checkmark"></span>
                                                </label>
                                                <label className="container">
                                                  Educators
                                                  <input
                                                    type="checkbox"
                                                    name="fill_access_users"
                                                    value="educator"
                                                    checked={form[
                                                      Index
                                                    ]?.fill_access_users?.includes(
                                                      'educator'
                                                    )}
                                                    onChange={(e) => {
                                                      setCheckBoxField(
                                                        e.target.name,
                                                        e.target.value,
                                                        e.target.checked,
                                                        Index
                                                      );
                                                    }}
                                                  />
                                                  <span className="checkmark"></span>
                                                </label>
                                                <label className="container">
                                                  Parent/Guardian
                                                  <input
                                                    type="checkbox"
                                                    name="fill_access_users"
                                                    value="parent"
                                                    checked={form[
                                                      Index
                                                    ]?.fill_access_users?.includes(
                                                      'parent'
                                                    )}
                                                    onChange={(e) => {
                                                      setCheckBoxField(
                                                        e.target.name,
                                                        e.target.value,
                                                        e.target.checked,
                                                        Index
                                                      );
                                                    }}
                                                  />
                                                  <span className="checkmark"></span>
                                                </label>
                                              </div>
                                            </div>
                                          </Col>
                                          <Col md={12}>
                                            <div className="sharing_section mt-3">
                                              <div className="sharing signatories-toggle">
                                                <div className="sharing-title">
                                                  <p
                                                    style={{
                                                      color: '#333333',
                                                    }}
                                                  >
                                                    Signatories
                                                  </p>
                                                </div>
                                                <div className="toogle-swich">
                                                  <input
                                                    className="switch"
                                                    name="signatories"
                                                    type="checkbox"
                                                    checked={
                                                      form[Index]?.signatories
                                                    }
                                                    onChange={(e) => {
                                                      setField(
                                                        e.target.name,
                                                        e.target.checked,
                                                        Index
                                                      );
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </Col>
                                          <Col md={12}>
                                            {form[Index]?.signatories && (
                                              <div className="checkbox-card">
                                                <div className="modal-two-check user-roles-box">
                                                  <label className="container">
                                                    Franchisor Admin
                                                    <input
                                                      type="checkbox"
                                                      name="signatories_role"
                                                      value="franchisor_admin"
                                                      checked={form[
                                                        Index
                                                      ]?.signatories_role?.includes(
                                                        'franchisor_admin'
                                                      )}
                                                      onChange={(e) => {
                                                        setCheckBoxField(
                                                          e.target.name,
                                                          e.target.value,
                                                          e.target.checked,
                                                          Index
                                                        );
                                                      }}
                                                    />
                                                    <span className="checkmark"></span>
                                                  </label>
                                                  <label className="container">
                                                    Franchisee Admin
                                                    <input
                                                      type="checkbox"
                                                      name="signatories_role"
                                                      value="franchisee_admin"
                                                      checked={form[
                                                        Index
                                                      ]?.signatories_role?.includes(
                                                        'franchisee_admin'
                                                      )}
                                                      onChange={(e) => {
                                                        setCheckBoxField(
                                                          e.target.name,
                                                          e.target.value,
                                                          e.target.checked,
                                                          Index
                                                        );
                                                      }}
                                                    />
                                                    <span className="checkmark"></span>
                                                  </label>
                                                  <label className="container">
                                                    Co-ordinators
                                                    <input
                                                      type="checkbox"
                                                      name="signatories_role"
                                                      value="coordinator"
                                                      checked={form[
                                                        Index
                                                      ]?.signatories_role?.includes(
                                                        'coordinator'
                                                      )}
                                                      onChange={(e) => {
                                                        setCheckBoxField(
                                                          e.target.name,
                                                          e.target.value,
                                                          e.target.checked,
                                                          Index
                                                        );
                                                      }}
                                                    />
                                                    <span className="checkmark"></span>
                                                  </label>
                                                  <label className="container">
                                                    Educators
                                                    <input
                                                      type="checkbox"
                                                      name="signatories_role"
                                                      value="educator"
                                                      checked={form[
                                                        Index
                                                      ]?.signatories_role?.includes(
                                                        'educator'
                                                      )}
                                                      onChange={(e) => {
                                                        setCheckBoxField(
                                                          e.target.name,
                                                          e.target.value,
                                                          e.target.checked,
                                                          Index
                                                        );
                                                      }}
                                                    />
                                                    <span className="checkmark"></span>
                                                  </label>
                                                  <label className="container">
                                                    Parent/Guardian
                                                    <input
                                                      type="checkbox"
                                                      name="signatories_role"
                                                      value="parent"
                                                      checked={form[
                                                        Index
                                                      ]?.signatories_role?.includes(
                                                        'parent'
                                                      )}
                                                      onChange={(e) => {
                                                        setCheckBoxField(
                                                          e.target.name,
                                                          e.target.value,
                                                          e.target.checked,
                                                          Index
                                                        );
                                                      }}
                                                    />
                                                    <span className="checkmark"></span>
                                                  </label>
                                                </div>
                                              </div>
                                            )}
                                          </Col>
                                        </>
                                      ) : (
                                        <>
                                          <Row style={{ marginTop: '10px' }}>
                                            <Col md={12}>
                                              <Form.Group>
                                                <Form.Label>
                                                  Select Users For Fill Access
                                                </Form.Label>
                                                <div className="select-with-plus">
                                                  <Multiselect
                                                    displayValue="email"
                                                    className="multiselect-box default-arrow-select"
                                                    selectedValues={
                                                      selectedFillAccessUser
                                                    }
                                                    onRemove={
                                                      onFillAccessRemoveUser
                                                    }
                                                    onSelect={
                                                      onFillAccessSelectUser
                                                    }
                                                    options={user}
                                                  />
                                                </div>
                                                <p className="error">
                                                  {errors.franchisee}
                                                </p>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col md={12}>
                                              <div
                                                className="sharing_section"
                                                style={{ margin: 0 }}
                                              >
                                                <div
                                                  className="sharing signatories-toggle"
                                                  style={{
                                                    marginTop: '-10px',
                                                    marginBottom: '10px',
                                                  }}
                                                >
                                                  <div className="sharing-title">
                                                    <p
                                                      style={{
                                                        color: '#333333',
                                                      }}
                                                    >
                                                      Signatories
                                                    </p>
                                                  </div>
                                                  <div className="toogle-swich">
                                                    <input
                                                      className="switch"
                                                      name="signatories"
                                                      type="checkbox"
                                                      checked={
                                                        form[Index]?.signatories
                                                      }
                                                      onChange={(e) => {
                                                        setField(
                                                          e.target.name,
                                                          e.target.checked,
                                                          Index
                                                        );
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </Col>
                                          </Row>
                                          {form[Index]?.signatories && (
                                            <Col md={12}>
                                              <Form.Group>
                                                <Form.Label>
                                                  Select Signatories
                                                </Form.Label>
                                                <div className="select-with-plus">
                                                  <Multiselect
                                                    displayValue="email"
                                                    className="multiselect-box default-arrow-select"
                                                    selectedValues={
                                                      selectedSignatoriesUser
                                                    }
                                                    onRemove={
                                                      onSignatoriesRemoveUser
                                                    }
                                                    onSelect={
                                                      onSignatorieselectUser
                                                    }
                                                    options={user}
                                                  />
                                                </div>
                                                <p className="error">
                                                  {errors.franchisee}
                                                </p>
                                              </Form.Group>
                                            </Col>
                                          )}
                                        </>
                                      )}
                                    </>
                                  )}
                                </>
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

                                let data = [...form];
                                if (data[Index]['signatories'] === true) {
                                  let flag = false;
                                  data.map((item) => {
                                    if (
                                      item.field_type === 'signature' &&
                                      item.section_name ===
                                        data[Index]['section_name']
                                    ) {
                                      flag = true;
                                    }
                                  });
                                  if (flag === false)
                                    data.push({
                                      field_label: 'Signature',
                                      field_type: 'signature',
                                      section_name: data[Index]['section_name'],
                                      accessible_to_role:
                                        data[Index]['accessible_to_role'],
                                      fill_access_users:
                                        data[Index]['fill_access_users'],
                                      signatories: data[Index]['signatories'],
                                      signatories_role:
                                        data[Index]['signatories_role'],
                                    });
                                }
                                setForm(data);
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
                      <div className="setting_model_body">
                        <Setting
                          onModelChange={() => {
                            getFormField();
                            setFormSettingFlag(false);
                          }}
                        />
                      </div>
                    </Modal.Body>
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
