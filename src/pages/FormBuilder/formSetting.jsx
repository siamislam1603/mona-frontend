import React, { useEffect, useState } from 'react';
import {
  Accordion,
  Button,
  Col,
  Container,
  Form,
  Row,
  Table,
} from 'react-bootstrap';
import LeftNavbar from '../../components/LeftNavbar';
import TopHeader from '../../components/TopHeader';
import { BASE_URL } from '../../components/App';
import { createFormValidation } from '../../helpers/validation';
import { useLocation, useNavigate } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';

function FormSetting(props) {
  const [form, setForm] = useState({ applicable: 'user_role' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  let targetUsers = '';
  let fillAccessUsers = '';
  let responseVisibility = '';
  let formVisibility = '';
  const setFields = (field, value) => {
    setForm({ ...form, [field]: value });
  };
  useEffect(() => {
    getUser();
  }, [selectedFranchisee]);
  let selectedUserId = '';
  function onSelectUser(optionsList, selectedItem) {
    console.log('selected_item---->2', selectedItem);
    selectedUserId += selectedItem.id + ',';
    selectedUser.push({
      id: selectedItem.id,
      email: selectedItem.email,
    });
    console.log('selectedUser---->', selectedUser);
  }
  function onRemoveUser(selectedList, removedItem) {
    selectedUserId = selectedUserId.replace(removedItem.id + ',', '');
    const index = selectedUser.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedUser.splice(index, 1);
    {
      console.log('selectedUser---->', selectedUser);
    }
  }
  const getUser = () => {
    var myHeaders = new Headers();
    myHeaders.append(
      'authorization',
      'Bearer ' + localStorage.getItem('token')
    );

    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };
    let api_url = '';
    console.log('selectedFranchisee--->', selectedFranchisee);
    if (selectedFranchisee) {
      if (selectedFranchisee === 'All') api_url = `${BASE_URL}/auth/users`;
      else
        api_url = `${BASE_URL}/user-group/users/franchisee/${selectedFranchisee
          .split(',')[0]
          .split(' ')
          .map((d) => d.charAt(0).toLowerCase() + d.slice(1))
          .join('_')}`;
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
  return (
    <>
      {console.log('form', form)}
      {console.log('targetUsers', targetUsers)}
      {console.log('fill access', fillAccessUsers)}
      {console.log('response visibility', responseVisibility)}
      {console.log('form visibility', formVisibility)}
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
                  setSelectedFranchisee={(name, id) => {
                    setSelectedFranchisee(name);
                  }}
                />
                <Row>
                  <Col sm={8}>
                    <div className="mynewForm-heading  mb-0">
                      <Button
                        onClick={() => {
                          navigate('/form/add');
                        }}
                      >
                        <img src="../../img/back-arrow.svg" />
                      </Button>
                      <h4 className="mynewForm">Form Settings</h4>
                    </div>
                  </Col>
                </Row>
                <Form>
                  <Row>
                    <Col md={12} className="mt-3 mt-md-0">
                      <div className="form_setting">
                        <div className="form_setting_fields">
                          <Row>
                            <Col lg={3} sm={6}>
                              <Form.Group className="form_fields_box">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                  type="date"
                                  name="start_date"
                                  value={form?.start_date}
                                  onChange={(e) => {
                                    setFields(e.target.name, e.target.value);
                                  }}
                                  // isInvalid={!!formSettingError.start_date}
                                />
                                <img
                                  className="form_fields_icon"
                                  src="../../img/calendar_icons.png"
                                />
                                <Form.Control.Feedback type="invalid">
                                  {/* {formSettingError.start_date}  */}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col lg={3} sm={6} className="mt-3 mt-sm-0">
                              <Form.Group className="form_fields_box">
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control
                                  type="time"
                                  name="start_time"
                                  value={form?.start_time}
                                  onChange={(e) => {
                                    setFields(e.target.name, e.target.value);
                                  }}
                                  // isInvalid={!!formSettingError.start_time}
                                />
                                <img
                                  className="form_fields_icon"
                                  src="../../img/clock-circle-icon.png"
                                />
                                <Form.Control.Feedback type="invalid">
                                  {/* {formSettingError.start_time}  */}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                              <Form.Group className="form_fields_box">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control
                                  type="date"
                                  name="end_date"
                                  value={form?.end_date}
                                  onChange={(e) => {
                                    setFields(e.target.name, e.target.value);
                                  }}
                                  // isInvalid={!!formSettingError.end_date}
                                />
                                <img
                                  className="form_fields_icon"
                                  src="../../img/calendar_icons.png"
                                />
                                <Form.Control.Feedback type="invalid">
                                  {/* {formSettingError.end_date}  */}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                              <Form.Group className="form_fields_box">
                                <Form.Label>End Time</Form.Label>
                                <Form.Control
                                  type="time"
                                  name="end_time"
                                  value={form?.end_time}
                                  onChange={(e) => {
                                    setFields(e.target.name, e.target.value);
                                  }}
                                  // isInvalid={!!formSettingError.end_time}
                                />
                                <img
                                  className="form_fields_icon"
                                  src="../../img/clock-circle-icon.png"
                                />
                                <Form.Control.Feedback type="invalid">
                                  {/* {formSettingError.end_time}  */}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>
                        <div className="applicable_section_card">
                          <div className="applicable_section">
                            <Row className="mb-3">
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
                                          value="user_role"
                                          name="applicable"
                                          id="user_role"
                                          onChange={(e) => {
                                            setFields(
                                              e.target.name,
                                              e.target.value
                                            );
                                          }}
                                          checked={
                                            form?.applicable === 'user_role'
                                          }
                                          // checked={
                                          //   formSettingData?.applicable_to_franchisee ===
                                          //     true ||
                                          //   formSettingData?.applicable_to_franchisee ===
                                          //     'Yes'
                                          // }
                                        />
                                        <span className="radio-round"></span>
                                        <p>User Roles</p>
                                      </label>
                                    </div>
                                    <div className="new-form-radio-box">
                                      <label for="specific_user">
                                        <input
                                          type="radio"
                                          value="specific_user"
                                          name="applicable"
                                          id="specific_user"
                                          onChange={(e) => {
                                            setFields(
                                              e.target.name,
                                              e.target.value
                                            );
                                          }}
                                          checked={
                                            form?.applicable === 'specific_user'
                                          }
                                          // checked={
                                          //   formSettingData?.applicable_to_franchisee ===
                                          //     false ||
                                          //   formSettingData?.applicable_to_franchisee ===
                                          //     'No'
                                          // }
                                        />
                                        <span className="radio-round"></span>
                                        <p>Specific Users</p>
                                      </label>
                                    </div>
                                  </div>
                                </Form.Group>
                              </Col>
                            </Row>
                            {form.applicable === 'user_role' ? (
                              <>
                                <Row>
                                  <Col md={12}>
                                    <section className="user_role_section">
                                      <Form.Label className="form_label_title">
                                        Select User Roles
                                      </Form.Label>

                                      <div className="user_role_table mt-3">
                                        <Table bordered>
                                          <thead className="table_title">
                                            <tr>
                                              <th>User Type</th>
                                              <th>Targeted Users</th>
                                              <th>Fill Access Users</th>
                                              <th>Response Visibility</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td className="border_left_box">
                                                Franchisor Admin
                                              </td>
                                              <td className="input_checkbox">
                                                <label className="table-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name="target_user"
                                                    value="franchisor_admin"
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        targetUsers +=
                                                          e.target.value + ',';
                                                      } else {
                                                        targetUsers =
                                                          targetUsers.replace(
                                                            e.target.value +
                                                              ',',
                                                            ''
                                                          );
                                                      }
                                                      console.log(
                                                        'targetUsers---->',
                                                        targetUsers
                                                      );
                                                    }}
                                                  />
                                                  <span></span>
                                                </label>
                                              </td>
                                              <td className="input_checkbox">
                                                <label className="table-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name="fill_access_users"
                                                    value="franchisor_admin"
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        fillAccessUsers +=
                                                          e.target.value + ',';
                                                      } else {
                                                        fillAccessUsers =
                                                          fillAccessUsers.replace(
                                                            e.target.value +
                                                              ',',
                                                            ''
                                                          );
                                                      }
                                                      console.log(
                                                        'fillAccessUsers---->',
                                                        fillAccessUsers
                                                      );
                                                    }}
                                                  />
                                                  <span></span>
                                                </label>
                                              </td>
                                              <td className="border_right_box input_checkbox">
                                                <label className="table-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name="response_visibility"
                                                    value="franchisor_admin"
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        responseVisibility +=
                                                          e.target.value + ',';
                                                      } else {
                                                        responseVisibility =
                                                          responseVisibility.replace(
                                                            e.target.value +
                                                              ',',
                                                            ''
                                                          );
                                                      }
                                                      console.log(
                                                        'responseVisibility---->',
                                                        responseVisibility
                                                      );
                                                    }}
                                                  />
                                                  <span></span>
                                                </label>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>Franchisee admin </td>
                                              <td className="input_checkbox">
                                                <label className="table-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name="target_user"
                                                    value="franchisee_admin"
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        targetUsers +=
                                                          e.target.value + ',';
                                                      } else {
                                                        targetUsers =
                                                          targetUsers.replace(
                                                            e.target.value +
                                                              ',',
                                                            ''
                                                          );
                                                      }
                                                      console.log(
                                                        'targetUsers---->',
                                                        targetUsers
                                                      );
                                                    }}
                                                  />
                                                  <span></span>
                                                </label>
                                              </td>
                                              <td className="input_checkbox">
                                                <label className="table-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name="fill_access_users"
                                                    value="franchisee_admin"
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        fillAccessUsers +=
                                                          e.target.value + ',';
                                                      } else {
                                                        fillAccessUsers =
                                                          fillAccessUsers.replace(
                                                            e.target.value +
                                                              ',',
                                                            ''
                                                          );
                                                      }
                                                      console.log(
                                                        'fillAccessUsers---->',
                                                        fillAccessUsers
                                                      );
                                                    }}
                                                  />
                                                  <span></span>
                                                </label>
                                              </td>
                                              <td className="input_checkbox">
                                                <label className="table-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name="response_visibility"
                                                    value="franchisee_admin"
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        responseVisibility +=
                                                          e.target.value + ',';
                                                      } else {
                                                        responseVisibility =
                                                          responseVisibility.replace(
                                                            e.target.value +
                                                              ',',
                                                            ''
                                                          );
                                                      }
                                                      console.log(
                                                        'responseVisibility---->',
                                                        responseVisibility
                                                      );
                                                    }}
                                                  />
                                                  <span></span>
                                                </label>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>Coordinator</td>
                                              <td className="input_checkbox">
                                                <label className="table-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name="target_user"
                                                    value="coordinator"
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        targetUsers +=
                                                          e.target.value + ',';
                                                      } else {
                                                        targetUsers =
                                                          targetUsers.replace(
                                                            e.target.value +
                                                              ',',
                                                            ''
                                                          );
                                                      }
                                                      console.log(
                                                        'targetUsers---->',
                                                        targetUsers
                                                      );
                                                    }}
                                                  />
                                                  <span></span>
                                                </label>
                                              </td>
                                              <td className="input_checkbox">
                                                <label className="table-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name="fill_access_users"
                                                    value="coordinator"
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        fillAccessUsers +=
                                                          e.target.value + ',';
                                                      } else {
                                                        fillAccessUsers =
                                                          fillAccessUsers.replace(
                                                            e.target.value +
                                                              ',',
                                                            ''
                                                          );
                                                      }
                                                      console.log(
                                                        'fillAccessUsers---->',
                                                        fillAccessUsers
                                                      );
                                                    }}
                                                  />
                                                  <span></span>
                                                </label>
                                              </td>
                                              <td className="input_checkbox">
                                                <label className="table-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name="response_visibility"
                                                    value="coordinator"
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        responseVisibility +=
                                                          e.target.value + ',';
                                                      } else {
                                                        responseVisibility =
                                                          responseVisibility.replace(
                                                            e.target.value +
                                                              ',',
                                                            ''
                                                          );
                                                      }
                                                      console.log(
                                                        'responseVisibility---->',
                                                        responseVisibility
                                                      );
                                                    }}
                                                  />
                                                  <span></span>
                                                </label>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>Educator</td>
                                              <td className="input_checkbox">
                                                <label className="table-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name="target_user"
                                                    value="educator"
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        targetUsers +=
                                                          e.target.value + ',';
                                                      } else {
                                                        targetUsers =
                                                          targetUsers.replace(
                                                            e.target.value +
                                                              ',',
                                                            ''
                                                          );
                                                      }
                                                      console.log(
                                                        'targetUsers---->',
                                                        targetUsers
                                                      );
                                                    }}
                                                  />
                                                  <span></span>
                                                </label>
                                              </td>
                                              <td className="input_checkbox">
                                                <label className="table-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name="fill_access_users"
                                                    value="educator"
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        fillAccessUsers +=
                                                          e.target.value + ',';
                                                      } else {
                                                        fillAccessUsers =
                                                          fillAccessUsers.replace(
                                                            e.target.value +
                                                              ',',
                                                            ''
                                                          );
                                                      }
                                                      console.log(
                                                        'fillAccessUsers---->',
                                                        fillAccessUsers
                                                      );
                                                    }}
                                                  />
                                                  <span></span>
                                                </label>
                                              </td>
                                              <td className="input_checkbox">
                                                <label className="table-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name="response_visibility"
                                                    value="educator"
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        responseVisibility +=
                                                          e.target.value + ',';
                                                      } else {
                                                        responseVisibility =
                                                          responseVisibility.replace(
                                                            e.target.value +
                                                              ',',
                                                            ''
                                                          );
                                                      }
                                                      console.log(
                                                        'responseVisibility---->',
                                                        responseVisibility
                                                      );
                                                    }}
                                                  />
                                                  <span></span>
                                                </label>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>Parent/Guardian</td>
                                              <td className="input_checkbox">
                                                <label className="table-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name="target_user"
                                                    value="parent"
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        targetUsers +=
                                                          e.target.value + ',';
                                                      } else {
                                                        targetUsers =
                                                          targetUsers.replace(
                                                            e.target.value +
                                                              ',',
                                                            ''
                                                          );
                                                      }
                                                      console.log(
                                                        'targetUsers---->',
                                                        targetUsers
                                                      );
                                                    }}
                                                  />
                                                  <span></span>
                                                </label>
                                              </td>
                                              <td className="input_checkbox">
                                                <label className="table-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name="fill_access_users"
                                                    value="parent"
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        fillAccessUsers +=
                                                          e.target.value + ',';
                                                      } else {
                                                        fillAccessUsers =
                                                          fillAccessUsers.replace(
                                                            e.target.value +
                                                              ',',
                                                            ''
                                                          );
                                                      }
                                                      console.log(
                                                        'fillAccessUsers---->',
                                                        fillAccessUsers
                                                      );
                                                    }}
                                                  />
                                                  <span></span>
                                                </label>
                                              </td>
                                              <td className="input_checkbox">
                                                <label className="table-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name="response_visibility"
                                                    value="parent"
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        responseVisibility +=
                                                          e.target.value + ',';
                                                      } else {
                                                        responseVisibility =
                                                          responseVisibility.replace(
                                                            e.target.value +
                                                              ',',
                                                            ''
                                                          );
                                                      }
                                                      console.log(
                                                        'responseVisibility---->',
                                                        responseVisibility
                                                      );
                                                    }}
                                                  />
                                                  <span></span>
                                                </label>
                                              </td>
                                            </tr>
                                            <tr className="child_table_row">
                                              <td>
                                                <ul>
                                                  <li className="child_tag">
                                                    Child
                                                  </li>
                                                </ul>
                                              </td>
                                              <td className="input_checkbox">
                                                <label className="table-checkbox">
                                                  <input
                                                    type="checkbox"
                                                    name="target_user"
                                                    value="child"
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        targetUsers +=
                                                          e.target.value + ',';
                                                      } else {
                                                        targetUsers =
                                                          targetUsers.replace(
                                                            e.target.value +
                                                              ',',
                                                            ''
                                                          );
                                                      }
                                                      console.log(
                                                        'targetUsers---->',
                                                        targetUsers
                                                      );
                                                    }}
                                                  />
                                                  <span></span>
                                                </label>
                                              </td>
                                              <td className="input_checkbox"></td>
                                              <td className="input_checkbox"></td>
                                            </tr>
                                          </tbody>
                                        </Table>
                                      </div>
                                    </section>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md={12}>
                                    <div className="sharing_section">
                                      <div className="sharing signatories-toggle">
                                        <div className="sharing-title">
                                          <p style={{ color: '#333333' }}>
                                            Signatories
                                          </p>
                                        </div>
                                        <div className="toogle-swich">
                                          <input
                                            className="switch"
                                            name="required"
                                            type="checkbox"
                                            // checked={form[index]?.required}
                                            // onChange={(e) => {
                                            //   setField(
                                            //     e.target.name,
                                            //     e.target.checked,
                                            //     index
                                            //   );
                                            // }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </Col>
                                  <Col md={12}>
                                    <div className="checkbox-card">
                                      <div className="modal-two-check user-roles-box">
                                        <label className="container">
                                          Franchisor Admin
                                          <input
                                            type="checkbox"
                                            name="shared_role"
                                            id=""
                                          />
                                          <span className="checkmark"></span>
                                        </label>
                                        <label className="container">
                                          Franchisee Admin
                                          <input
                                            type="checkbox"
                                            name="shared_role"
                                            id=""
                                          />
                                          <span className="checkmark"></span>
                                        </label>
                                        <label className="container">
                                          Co-ordinators
                                          <input
                                            type="checkbox"
                                            name="shared_role"
                                            id=""
                                          />
                                          <span className="checkmark"></span>
                                        </label>
                                        <label className="container">
                                          Educators
                                          <input
                                            type="checkbox"
                                            name="shared_role"
                                            id=""
                                          />
                                          <span className="checkmark"></span>
                                        </label>
                                        <label className="container">
                                          Parent/Guardian
                                          <input
                                            type="checkbox"
                                            name="shared_role"
                                            id=""
                                          />
                                          <span className="checkmark"></span>
                                        </label>
                                      </div>
                                    </div>
                                    <label class="form_label_title form-label mt-3 pb-1">
                                      Form Visible To
                                    </label>
                                    <div className="checkbox-card">
                                      <div className="modal-two-check user-roles-box">
                                        <label className="container">
                                          Franchisor Admin
                                          <input
                                            type="checkbox"
                                            name="form_visible_to"
                                            value="franchisor_admin"
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                formVisibility +=
                                                  e.target.value + ',';
                                              } else {
                                                formVisibility =
                                                formVisibility.replace(
                                                    e.target.value + ',',
                                                    ''
                                                  );
                                              }
                                              console.log(
                                                'formVisibility---->',
                                                formVisibility
                                              );
                                            }}
                                          />
                                          <span className="checkmark"></span>
                                        </label>
                                        <label className="container">
                                          Franchisee Admin
                                          <input
                                            type="checkbox"
                                            name="form_visible_to"
                                            value="franchisee_admin"
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                formVisibility +=
                                                  e.target.value + ',';
                                              } else {
                                                formVisibility =
                                                formVisibility.replace(
                                                    e.target.value + ',',
                                                    ''
                                                  );
                                              }
                                              console.log(
                                                'formVisibility---->',
                                                formVisibility
                                              );
                                            }}
                                          />
                                          <span className="checkmark"></span>
                                        </label>
                                        <label className="container">
                                          Co-ordinators
                                          <input
                                            type="checkbox"
                                            name="form_visible_to"
                                            value="coordinator"
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                formVisibility +=
                                                  e.target.value + ',';
                                              } else {
                                                formVisibility =
                                                formVisibility.replace(
                                                    e.target.value + ',',
                                                    ''
                                                  );
                                              }
                                              console.log(
                                                'formVisibility---->',
                                                formVisibility
                                              );
                                            }}
                                          />
                                          <span className="checkmark"></span>
                                        </label>
                                        <label className="container">
                                          Educators
                                          <input
                                            type="checkbox"
                                            name="form_visible_to"
                                            value="educator"
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                formVisibility +=
                                                  e.target.value + ',';
                                              } else {
                                                formVisibility =
                                                formVisibility.replace(
                                                    e.target.value + ',',
                                                    ''
                                                  );
                                              }
                                              console.log(
                                                'formVisibility---->',
                                                formVisibility
                                              );
                                            }}
                                          />
                                          <span className="checkmark"></span>
                                        </label>
                                        <label className="container">
                                          Parent/Guardian
                                          <input
                                            type="checkbox"
                                            name="form_visible_to"
                                            value="parent"
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                formVisibility +=
                                                  e.target.value + ',';
                                              } else {
                                                formVisibility =
                                                formVisibility.replace(
                                                    e.target.value + ',',
                                                    ''
                                                  );
                                              }
                                              console.log(
                                                'formVisibility---->',
                                                formVisibility
                                              );
                                            }}
                                            
                                          />
                                          <span className="checkmark"></span>
                                        </label>
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              </>
                            ) : (
                              <>
                                <Row>
                                  <Col md={12}>
                                    <Form.Group>
                                      <Form.Label>
                                        Select Users As Targeted Users
                                      </Form.Label>
                                      <div className="select-with-plus">
                                        <Multiselect
                                          displayValue="email"
                                          className="multiselect-box default-arrow-select"
                                          // placeholder="Select Franchisee"
                                          selectedValues={selectedUser}
                                          // onKeyPressFn={function noRefCheck() {}}
                                          onRemove={onRemoveUser}
                                          // onSearch={function noRefCheck() {}}
                                          onSelect={onSelectUser}
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
                                    <Form.Group>
                                      <Form.Label>
                                        Select Users For Fill Access
                                      </Form.Label>
                                      <div className="select-with-plus">
                                        <Multiselect
                                          displayValue="email"
                                          className="multiselect-box default-arrow-select"
                                          // placeholder="Select Franchisee"
                                          selectedValues={selectedUser}
                                          // onKeyPressFn={function noRefCheck() {}}
                                          onRemove={onRemoveUser}
                                          // onSearch={function noRefCheck() {}}
                                          onSelect={onSelectUser}
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
                                    <Form.Group>
                                      <Form.Label>
                                        Select Users For Response Visibility
                                      </Form.Label>
                                      <div className="select-with-plus">
                                        <Multiselect
                                          displayValue="email"
                                          className="multiselect-box default-arrow-select"
                                          // placeholder="Select Franchisee"
                                          selectedValues={selectedUser}
                                          // onKeyPressFn={function noRefCheck() {}}
                                          onRemove={onRemoveUser}
                                          // onSearch={function noRefCheck() {}}
                                          onSelect={onSelectUser}
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
                                          marginTop: '23px',
                                          marginBottom: '33px',
                                        }}
                                      >
                                        <div className="sharing-title">
                                          <p style={{ color: '#333333' }}>
                                            Signatories
                                          </p>
                                        </div>
                                        <div className="toogle-swich">
                                          <input
                                            className="switch"
                                            name="required"
                                            type="checkbox"
                                            // checked={form[index]?.required}
                                            // onChange={(e) => {
                                            //   setField(
                                            //     e.target.name,
                                            //     e.target.checked,
                                            //     index
                                            //   );
                                            // }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col md={12}>
                                    <Form.Group>
                                      <Form.Label>
                                        Select Signatories
                                      </Form.Label>
                                      <div className="select-with-plus">
                                        <Multiselect
                                          displayValue="email"
                                          className="multiselect-box default-arrow-select"
                                          // placeholder="Select Franchisee"
                                          selectedValues={selectedUser}
                                          // onKeyPressFn={function noRefCheck() {}}
                                          onRemove={onRemoveUser}
                                          // onSearch={function noRefCheck() {}}
                                          onSelect={onSelectUser}
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
                                    <Form.Group>
                                      <Form.Label>Form Visible To</Form.Label>
                                      <div className="select-with-plus">
                                        <Multiselect
                                          displayValue="email"
                                          className="multiselect-box default-arrow-select"
                                          // placeholder="Select Franchisee"
                                          selectedValues={selectedUser}
                                          // onKeyPressFn={function noRefCheck() {}}
                                          onRemove={onRemoveUser}
                                          // onSearch={function noRefCheck() {}}
                                          onSelect={onSelectUser}
                                          options={user}
                                        />
                                      </div>
                                      <p className="error">
                                        {errors.franchisee}
                                      </p>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="sharing_section mt-4 pt-3">
                          <div className="sharing signatories-toggle">
                            <div className="sharing-title">
                              <p style={{ color: '#333333' }}>
                                For Training Module
                              </p>
                            </div>
                            <div className="toogle-swich ps-5">
                              <input
                                className="switch"
                                name="required"
                                type="checkbox"
                                // checked={form[index]?.required}
                                // onChange={(e) => {
                                //   setField(
                                //     e.target.name,
                                //     e.target.checked,
                                //     index
                                //   );
                                // }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12}>
                      <div className="mt-5 mb-5 d-flex justify-content-center">
                        <Button
                          className="theme-light"
                          onClick={() => {
                            navigate('/form/add');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button className="primary">Save Settings</Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}

export default FormSetting;
