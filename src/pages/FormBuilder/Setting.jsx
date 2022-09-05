import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { BASE_URL, FRONT_BASE_URL } from '../../components/App';
import { useLocation, useNavigate } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import { FullLoader } from '../../components/Loader';

let selectedFillAccessUserId = '';
let selectedFillAccessUser = [];
let selectedFormVisibleUserId = '';
let selectedFormVisibleUser = [];
let selectedSignatoriesUserId = '';
let selectedSignatoriesUser = [];
let selectedTargetUserId = '';
let selectedTargetUser = [];
let selectedResponseVisibilityUserId = '';
let selectedResponseVisibilityUser = [];
let selectedChildId = '';
let selectedChild = [];
let counter = 0;
function Setting(props) {
  const [form, setForm] = useState({
    accessible_to_role: '1',
    form_visible_to: '',
    signatories_role: '',
    target_user: '',
    fill_access_users: '',
    response_visibility: '',
    for_training: false,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState([]);
  const [child, setChild] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [selectedFranchiseeId, setSelectedFranchiseeId] = useState(null);
  const [count, setCount] = useState(0);
  const [fullLoaderStatus,setfullLoaderStatus]=useState(true);
  const setFields = (field, value) => {
    setForm({ ...form, [field]: value });
  };
  const token = localStorage.getItem('token');

  useEffect(() => {
    getUser();
  }, [localStorage.getItem('f_id')]);
  const getParticularFormData = (userData, childData) => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };

    fetch(
      `${BASE_URL}/form/one?id=${
        location?.state?.id
      }&franchisee_id=${localStorage.getItem('f_id')}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        selectedFormVisibleUserId = '';
        selectedFormVisibleUser = [];
        selectedFillAccessUserId = '';
        selectedFillAccessUser = [];
        selectedSignatoriesUserId = '';
        selectedSignatoriesUser = [];
        selectedTargetUserId = '';
        selectedTargetUser = [];
        selectedResponseVisibilityUserId = '';
        selectedResponseVisibilityUser = [];
        selectedChild = [];
        selectedChildId = '';
        let oldResult = result?.result;
        if (
          oldResult?.permission?.accessible_to_role === '1' ||
          oldResult?.permission?.accessible_to_role === true
        ) {
          let formVisibility = oldResult?.permission?.form_visible_to
            ? oldResult?.permission?.form_visible_to.toString() + ','
            : '';
          let fillAccess = oldResult?.permission?.fill_access_users
            ? oldResult?.permission?.fill_access_users.toString() + ','
            : '';
          let responseVisibility = oldResult?.permission?.response_visibility
            ? oldResult?.permission?.response_visibility.toString() + ','
            : '';
          let signatoriesRole = oldResult?.permission?.signatories_role
            ? oldResult?.permission?.signatories_role.toString() + ','
            : '';
          let targetUser = oldResult?.permission?.target_user
            ? oldResult?.permission?.target_user.toString() + ','
            : '';
          let {
            form_visible_to,
            fill_access_users,
            response_visibility,
            signatories_role,
            target_users,
            ...newResult
          } = oldResult;
          newResult.accessible_to_role =
            oldResult?.permission?.accessible_to_role;
          newResult.signatories = oldResult?.permission?.signatories;
          newResult.form_visible_to = formVisibility;
          newResult.fill_access_users = fillAccess;
          newResult.response_visibility = responseVisibility;
          newResult.signatories_role = signatoriesRole;
          newResult.target_user = targetUser;
          setForm(newResult);
        } else if (
          oldResult?.permission?.accessible_to_role === '0' ||
          oldResult?.permission?.accessible_to_role === false
        ) {
          childData.map((item) => {
            if (oldResult?.permission?.target_child) {
              if (
                oldResult?.permission?.target_child.includes(item.id.toString())
              ) {
                selectedChild.push({
                  id: item.id,
                  fullname: item.fullname,
                });
                selectedChildId += item.id + ',';
              }
            }
          });
          userData.map((item) => {
            if (oldResult?.permission?.form_visible_to) {
              if (
                oldResult?.permission?.form_visible_to.includes(
                  item.id.toString()
                )
              ) {
                selectedFormVisibleUser.push({
                  id: item.id,
                  email: item.email,
                });
                selectedFormVisibleUserId += item.id + ',';
              }
            }
            if (oldResult?.permission?.fill_access_users) {
              if (
                oldResult?.permission?.fill_access_users.includes(
                  item.id.toString()
                )
              ) {
                selectedFillAccessUser.push({ id: item.id, email: item.email });
                selectedFillAccessUserId += item.id + ',';
              }
            }
            if (oldResult?.permission?.signatories_role) {
              if (
                oldResult?.permission?.signatories_role.includes(
                  item.id.toString()
                )
              ) {
                selectedSignatoriesUser.push({
                  id: item.id,
                  email: item.email,
                });
                selectedSignatoriesUserId += item.id + ',';
              }
            }
            if (oldResult?.permission?.response_visibility) {
              if (
                oldResult?.permission?.response_visibility.includes(
                  item.id.toString()
                )
              ) {
                selectedResponseVisibilityUser.push({
                  id: item.id,
                  email: item.email,
                });
                selectedResponseVisibilityUserId += item.id + ',';
              }
            }
            if (oldResult?.permission?.target_user) {
              if (
                oldResult?.permission?.target_user.includes(item.id.toString())
              ) {
                selectedTargetUser.push({ id: item.id, email: item.email });
                selectedTargetUserId += item.id + ',';
              }
            }
          });
          oldResult.accessible_to_role =
            oldResult?.permission?.accessible_to_role;
          oldResult.signatories = oldResult?.permission?.signatories;
          setForm(oldResult);
          counter++;
          setCount(counter);
        } else {
          oldResult.form_visible_to = '';
          oldResult.signatories_role = '';
          oldResult.target_user = '';
          oldResult.fill_access_users = '';
          oldResult.response_visibility = '';
          setForm(oldResult);
        }
        if (result) {
          setfullLoaderStatus(false);
        }
      })
      .catch((error) => console.log('error', error));
  };
  const setCheckBoxField = (name, value, checked) => {
    let data = { ...form };
    if (checked) {
      data[name] = data[name].replace('undefined', '');
      data[name] += value + ',';
    } else {
      data[name] = data[name].replace(value + ',', '');
    }
    setForm(data);
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

  function onTargetSelectUser(optionsList, selectedItem) {
    selectedTargetUserId += selectedItem.id + ',';
    selectedTargetUser.push({
      id: selectedItem.id,
      email: selectedItem.email,
    });
  }
  function onTargetRemoveUser(selectedList, removedItem) {
    selectedTargetUserId = selectedTargetUserId.replace(
      removedItem.id + ',',
      ''
    );
    const index = selectedTargetUser.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedTargetUser.splice(index, 1);
  }

  function onTargetSelectChild(optionsList, selectedItem) {
    selectedChildId += selectedItem.id + ',';
    selectedChild.push({
      id: selectedItem.id,
      fullname: selectedItem.fullname,
    });
  }
  function onTargetRemoveChild(selectedList, removedItem) {
    selectedChildId = selectedChildId.replace(removedItem.id + ',', '');
    const index = selectedChild.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedChild.splice(index, 1);
  }

  function onResponseVisibilitySelectUser(optionsList, selectedItem) {
    selectedResponseVisibilityUserId += selectedItem.id + ',';
    selectedResponseVisibilityUser.push({
      id: selectedItem.id,
      email: selectedItem.email,
    });
  }
  function onResponseVisibilityRemoveUser(selectedList, removedItem) {
    selectedResponseVisibilityUserId = selectedResponseVisibilityUserId.replace(
      removedItem.id + ',',
      ''
    );
    const index = selectedResponseVisibilityUser.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedResponseVisibilityUser.splice(index, 1);
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
    const index = selectedSignatoriesUser.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedSignatoriesUser.splice(index, 1);
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
    if (localStorage.getItem('f_id')) {
      if (
        localStorage.getItem('f_id') === 'all' ||
        localStorage.getItem('f_id') === 'All'
      ) {
        api_url = `${BASE_URL}/auth/users`;
      } else {
        api_url = `${BASE_URL}/user-group/users/franchisee/${localStorage.getItem(
          'f_id'
        )}`;
      }
    } else {
      api_url = `${BASE_URL}/auth/users`;
    }

    fetch(api_url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result?.data?.map((item) => {
          item['status'] = false;
        });
        if (localStorage.getItem('f_id')) {
          if (
            localStorage.getItem('f_id') === 'all' ||
            localStorage.getItem('f_id') === 'All'
          ) {
            setUser(result?.data);

            childList(result?.data);
          } else {
            setUser(result?.users);
            childList(result?.data);
          }
        } else {
          setUser(result?.data);
          childList(result?.data);
        }
      })
      .catch((error) => console.log('error', error));
  };
  const childList = (userData) => {
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
    if (localStorage.getItem('f_id')) {
      if (
        localStorage.getItem('f_id') === 'all' ||
        localStorage.getItem('f_id') === 'All'
      ) {
        api_url = `${BASE_URL}/form/child_list`;
      } else {
        api_url = `${BASE_URL}/form/child_list?franchisee_id=${localStorage.getItem(
          'f_id'
        )}`;
      }
    } else {
      api_url = `${BASE_URL}/form/child_list`;
    }
    fetch(api_url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setChild(result?.children);
        getParticularFormData(userData, result?.children);
      });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    let data = { ...form };
    if (data.accessible_to_role === '1' || data.accessible_to_role === true) {
      data['form_visible_to'] = form.form_visible_to
        ? form.form_visible_to.slice(0, -1)
        : null;
      data['signatories_role'] = form.signatories_role
        ? form.signatories_role.slice(0, -1)
        : null;
      data['target_user'] = form.target_user
        ? form.target_user.slice(0, -1)
        : null;
      data['fill_access_users'] = form.fill_access_users
        ? form.fill_access_users.slice(0, -1)
        : null;
      data['response_visibility'] = form.response_visibility
        ? form.response_visibility.slice(0, -1)
        : null;
      data['target_child'] = null;
    }
    if (data.accessible_to_role === '0' || data.accessible_to_role === false) {
      data['form_visible_to'] = selectedFormVisibleUserId
        ? selectedFormVisibleUserId.slice(0, -1)
        : null;
      data['signatories_role'] = selectedSignatoriesUserId
        ? selectedSignatoriesUserId.slice(0, -1)
        : null;
      data['target_user'] = selectedTargetUserId
        ? selectedTargetUserId.slice(0, -1)
        : null;
      data['fill_access_users'] = selectedFillAccessUserId
        ? selectedFillAccessUserId.slice(0, -1)
        : null;
      data['response_visibility'] = selectedResponseVisibilityUserId
        ? selectedResponseVisibilityUserId.slice(0, -1)
        : null;
      data['target_child'] = selectedChildId
        ? selectedChildId.slice(0, -1)
        : null;
    }
    data['link'] = FRONT_BASE_URL + '/form/dynamic/' + data.form_name;
    data['franchisee_id'] = localStorage.getItem('f_id');
    data['permission_update'] = true;
    data['shared_by'] = localStorage.getItem('user_id');
    data['id'] = location?.state?.id;
    myHeaders.append('Content-Type', 'application/json');
    fetch(`${BASE_URL}/form/add`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: myHeaders,
    })
      .then((res) => res.json())
      .then((res) => {
        navigate('/form/field/add', {
          state: { id: location?.state?.id, form_name: form?.form_name },
        });
        props.onModelChange();
      });
  };
  return (
    <>
      <Form>
      <FullLoader loading={fullLoaderStatus} />
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
                      />
                      <img
                        className="form_fields_icon"
                        src="../../img/calendar_icons.png"
                      />
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
                      />
                      <img
                        className="form_fields_icon"
                        src="../../img/clock-circle-icon.png"
                      />
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
                      />
                      <img
                        className="form_fields_icon"
                        src="../../img/calendar_icons.png"
                      />
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
                      />
                      <img
                        className="form_fields_icon"
                        src="../../img/clock-circle-icon.png"
                      />
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
                                value={1}
                                name="accessible_to_role"
                                id="user_role"
                                onChange={(e) => {
                                  setFields(e.target.name, e.target.value);
                                }}
                                checked={
                                  form?.accessible_to_role === '1' ||
                                  form?.accessible_to_role === true
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
                                  setFields(e.target.name, e.target.value);
                                }}
                                checked={
                                  form?.accessible_to_role === '0' ||
                                  form?.accessible_to_role === false
                                }
                              />
                              <span className="radio-round"></span>
                              <p>Specific Users</p>
                            </label>
                          </div>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  {form.accessible_to_role === '1' ||
                  form?.accessible_to_role === true ? (
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
                                          checked={form?.target_user?.includes(
                                            'franchisor_admin'
                                          )}
                                          onChange={(e) => {
                                            setCheckBoxField(
                                              e.target.name,
                                              e.target.value,
                                              e.target.checked
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
                                          checked={form?.fill_access_users?.includes(
                                            'franchisor_admin'
                                          )}
                                          onChange={(e) => {
                                            setCheckBoxField(
                                              e.target.name,
                                              e.target.value,
                                              e.target.checked
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
                                          checked={form?.response_visibility?.includes(
                                            'franchisor_admin'
                                          )}
                                          onChange={(e) => {
                                            setCheckBoxField(
                                              e.target.name,
                                              e.target.value,
                                              e.target.checked
                                            );
                                          }}
                                        />
                                        <span></span>
                                      </label>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Franchise admin </td>
                                    <td className="input_checkbox">
                                      <label className="table-checkbox">
                                        <input
                                          type="checkbox"
                                          name="target_user"
                                          value="franchisee_admin"
                                          checked={form?.target_user?.includes(
                                            'franchisee_admin'
                                          )}
                                          onChange={(e) => {
                                            setCheckBoxField(
                                              e.target.name,
                                              e.target.value,
                                              e.target.checked
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
                                          checked={form?.fill_access_users?.includes(
                                            'franchisee_admin'
                                          )}
                                          onChange={(e) => {
                                            setCheckBoxField(
                                              e.target.name,
                                              e.target.value,
                                              e.target.checked
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
                                          checked={form?.response_visibility?.includes(
                                            'franchisee_admin'
                                          )}
                                          onChange={(e) => {
                                            setCheckBoxField(
                                              e.target.name,
                                              e.target.value,
                                              e.target.checked
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
                                          checked={form?.target_user?.includes(
                                            'coordinator'
                                          )}
                                          onChange={(e) => {
                                            setCheckBoxField(
                                              e.target.name,
                                              e.target.value,
                                              e.target.checked
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
                                          checked={form?.fill_access_users?.includes(
                                            'coordinator'
                                          )}
                                          onChange={(e) => {
                                            setCheckBoxField(
                                              e.target.name,
                                              e.target.value,
                                              e.target.checked
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
                                          checked={form?.response_visibility?.includes(
                                            'coordinator'
                                          )}
                                          onChange={(e) => {
                                            setCheckBoxField(
                                              e.target.name,
                                              e.target.value,
                                              e.target.checked
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
                                          checked={form?.target_user?.includes(
                                            'educator'
                                          )}
                                          onChange={(e) => {
                                            setCheckBoxField(
                                              e.target.name,
                                              e.target.value,
                                              e.target.checked
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
                                          checked={form?.fill_access_users?.includes(
                                            'educator'
                                          )}
                                          onChange={(e) => {
                                            setCheckBoxField(
                                              e.target.name,
                                              e.target.value,
                                              e.target.checked
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
                                          checked={form?.response_visibility?.includes(
                                            'educator'
                                          )}
                                          onChange={(e) => {
                                            setCheckBoxField(
                                              e.target.name,
                                              e.target.value,
                                              e.target.checked
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
                                          checked={form?.target_user?.includes(
                                            'parent'
                                          )}
                                          onChange={(e) => {
                                            setCheckBoxField(
                                              e.target.name,
                                              e.target.value,
                                              e.target.checked
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
                                          checked={form?.fill_access_users?.includes(
                                            'parent'
                                          )}
                                          onChange={(e) => {
                                            setCheckBoxField(
                                              e.target.name,
                                              e.target.value,
                                              e.target.checked
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
                                          checked={form?.response_visibility?.includes(
                                            'parent'
                                          )}
                                          onChange={(e) => {
                                            setCheckBoxField(
                                              e.target.name,
                                              e.target.value,
                                              e.target.checked
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
                                        <li className="child_tag">Child</li>
                                      </ul>
                                    </td>
                                    <td className="input_checkbox">
                                      <label className="table-checkbox">
                                        <input
                                          type="checkbox"
                                          name="target_user"
                                          value="child"
                                          checked={form?.target_user?.includes(
                                            'child'
                                          )}
                                          onChange={(e) => {
                                            setCheckBoxField(
                                              e.target.name,
                                              e.target.value,
                                              e.target.checked
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
                                <p style={{ color: '#333333' }}>Signatories</p>
                              </div>
                              <div className="toogle-swich">
                                <input
                                  className="switch"
                                  name="signatories"
                                  type="checkbox"
                                  checked={form?.signatories}
                                  onChange={(e) => {
                                    setFields(e.target.name, e.target.checked);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col md={12}>
                          {form?.signatories && (
                            <div className="checkbox-card">
                              <div className="modal-two-check user-roles-box">
                                <label className="container">
                                  Franchisor Admin
                                  <input
                                    type="checkbox"
                                    name="signatories_role"
                                    value="franchisor_admin"
                                    checked={form?.signatories_role?.includes(
                                      'franchisor_admin'
                                    )}
                                    onChange={(e) => {
                                      setCheckBoxField(
                                        e.target.name,
                                        e.target.value,
                                        e.target.checked
                                      );
                                    }}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                                <label className="container">
                                  Franchise Admin
                                  <input
                                    type="checkbox"
                                    name="signatories_role"
                                    value="franchisee_admin"
                                    checked={form?.signatories_role?.includes(
                                      'franchisee_admin'
                                    )}
                                    onChange={(e) => {
                                      setCheckBoxField(
                                        e.target.name,
                                        e.target.value,
                                        e.target.checked
                                      );
                                    }}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                                <label className="container">
                                  Coordinator
                                  <input
                                    type="checkbox"
                                    name="signatories_role"
                                    value="coordinator"
                                    checked={form?.signatories_role?.includes(
                                      'coordinator'
                                    )}
                                    onChange={(e) => {
                                      setCheckBoxField(
                                        e.target.name,
                                        e.target.value,
                                        e.target.checked
                                      );
                                    }}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                                <label className="container">
                                  Educator
                                  <input
                                    type="checkbox"
                                    name="signatories_role"
                                    value="educator"
                                    checked={form?.signatories_role?.includes(
                                      'educator'
                                    )}
                                    onChange={(e) => {
                                      setCheckBoxField(
                                        e.target.name,
                                        e.target.value,
                                        e.target.checked
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
                                    checked={form?.signatories_role?.includes(
                                      'parent'
                                    )}
                                    onChange={(e) => {
                                      setCheckBoxField(
                                        e.target.name,
                                        e.target.value,
                                        e.target.checked
                                      );
                                    }}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                              </div>
                            </div>
                          )}
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
                                selectedValues={selectedTargetUser}
                                onRemove={onTargetRemoveUser}
                                onSelect={onTargetSelectUser}
                                options={user}
                              />
                            </div>
                            <p className="error">{errors.franchisee}</p>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label>
                              Select Users As Targeted Child
                            </Form.Label>
                            <div className="select-with-plus">
                              <Multiselect
                                displayValue="fullname"
                                className="multiselect-box default-arrow-select"
                                selectedValues={selectedChild}
                                onRemove={onTargetRemoveChild}
                                onSelect={onTargetSelectChild}
                                options={child}
                              />
                            </div>
                            <p className="error">{errors.franchisee}</p>
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
                                selectedValues={selectedFillAccessUser}
                                onRemove={onFillAccessRemoveUser}
                                onSelect={onFillAccessSelectUser}
                                options={user}
                              />
                            </div>
                            <p className="error">{errors.franchisee}</p>
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
                                selectedValues={selectedResponseVisibilityUser}
                                onRemove={onResponseVisibilityRemoveUser}
                                onSelect={onResponseVisibilitySelectUser}
                                options={user}
                              />
                            </div>
                            <p className="error">{errors.franchisee}</p>
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
                                <p style={{ color: '#333333' }}>Signatories</p>
                              </div>
                              <div className="toogle-swich">
                                <input
                                  className="switch"
                                  name="signatories"
                                  type="checkbox"
                                  checked={form.signatories}
                                  onChange={(e) => {
                                    setFields(e.target.name, e.target.checked);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      {form.signatories && (
                        <Row>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label>Select Signatories</Form.Label>
                              <div className="select-with-plus">
                                <Multiselect
                                  displayValue="email"
                                  className="multiselect-box default-arrow-select"
                                  selectedValues={selectedSignatoriesUser}
                                  onRemove={onSignatoriesRemoveUser}
                                  onSelect={onSignatorieselectUser}
                                  options={user}
                                />
                              </div>
                              <p className="error">{errors.franchisee}</p>
                            </Form.Group>
                          </Col>
                        </Row>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="sharing_section mt-4 pt-3">
                <div className="sharing signatories-toggle">
                  <div className="sharing-title">
                    <p style={{ color: '#333333' }}>For Training Module</p>
                  </div>
                  <div className="toogle-swich ps-5">
                    <input
                      className="switch"
                      name="for_training"
                      type="checkbox"
                      checked={form.for_training}
                      onChange={(e) => {
                        setFields(e.target.name, e.target.checked);
                      }}
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
                  navigate('/form/add', {
                    state: { id: location?.state?.id },
                  });
                }}
              >
                Cancel
              </Button>
              <Button className="primary" onClick={onSubmit}>
                Save Settings
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default Setting;
