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

function AddFormBuilder(props) {
  const [formData, setFormData] = useState([]);
  const [form, setForm] = useState({ form_template_select: 'Yes' });
  const [formCategory,setFormCategory]=useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [selectedFranchiseeId, setSelectedFranchiseeId] = useState(null);
  const [errors, setErrors] = useState({});
  const [userRole, setUserRole] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("location?.state?.id--->",location?.state?.id);
    if (location?.state?.id) {
      getParticularFormData();
    }
    getFormData();
    getFormCategory();
    getUserRoleData();
  }, []);
  const getUpperRoleUser = () => {
    let upper_role = '';
    let flag = false;
    userRole?.map((item) => {
      if (item.role_name !== localStorage.getItem('user_role')) {
        if (!flag) upper_role += item.role_name + ',';
      } else {
        flag = true;
      }
    });
    return upper_role.slice(0, -1);
  };
  const getUserRoleData = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/api/user-role`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log('res---->', res);
        // console.log('response0-------->1', localStorage.getItem('user_role'));
        setUserRole(res?.userRoleList);
      })
      .catch((error) => console.log('error', error));
  };
  const getFormCategory=()=>{
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/form/category`, requestOptions)
      .then((response) => response.json())
      .then((result) => {setFormCategory(result?.result)})
      .catch((error) => console.log('error', error));
  }
  const setField = (field, value) => {
    setForm({ ...form, [field]: value });
    console.log('form---->', form);
    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };
  const OnSubmit = (e) => {
    e.preventDefault();
    const newErrors = createFormValidation(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      var myHeaders = new Headers();
      let data={...form};
      data["created_by"]=localStorage.getItem("user_id");
      data["upper_role"]=getUpperRoleUser();
      myHeaders.append('Content-Type', 'application/json');
      fetch(`${BASE_URL}/form/add`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: myHeaders,
      })
        .then((res) => res.json())
        .then((res) => {
          navigate('/form/setting', {
            state: { id: res?.result?.id,form_name:res?.result?.form_name },
          });
        });
    }
  };
  const getParticularFormData = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/form/one?id=${location?.state?.id}&franchisee_id=${localStorage.getItem('f_id')}`, requestOptions)
      .then((response) => response.json())
      .then((result) => setForm(result?.result))
      .catch((error) => console.log('error', error));
  };
  const getFormData = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/form/list`, requestOptions)
      .then((response) => response.json())
      .then((result) => setFormData(result?.result))
      .catch((error) => console.log('error', error));
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
                  setSelectedFranchisee={(name, id) => {
                    setSelectedFranchisee(name);
                    setSelectedFranchiseeId(id);
                    localStorage.setItem('f_id', id);
                  }}
                />
                <Row>
                <Col sm={8}>
                    <div className="mynewForm-heading">
                      <Button
                        onClick={() => {
                          navigate('/form');
                        }}
                      >
                        <img src="../../img/back-arrow.svg" />
                      </Button>
                      <h4 className="mynewForm">My New Form</h4>
                    </div>
                  </Col>
                </Row>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Form title</Form.Label>
                        <Form.Control
                          type="text"
                          name="form_name"
                          value={form?.form_name}
                          onChange={(e) => {
                            setField(e.target.name, e.target.value);
                          }}
                          isInvalid={!!errors.form_name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.form_name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mt-3 mt-md-0">
                      <Form.Group>
                        <Form.Label>Form Type</Form.Label>
                        <Form.Select
                          name="form_type"
                          onChange={(e) => {
                            setField(e.target.name, e.target.value.trim());
                          }}
                          isInvalid={!!errors.form_type}
                        >
                          <option value="">Select Form Type</option>
                          <option
                            value="single_submission"
                            selected={form?.form_type === 'single_submission'}
                          >
                            One time fill and submit
                          </option>
                          <option
                            value="multi_submission"
                            selected={form?.form_type === 'multi_submission'}
                          >
                            Multiple time fill and submit
                          </option>
                          <option
                            value="editable"
                            selected={form?.form_type === 'editable'}
                          >
                            One time fill and Edit
                          </option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.form_type}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={12} className="mt-3 mb-3">
                      <Form.Group>
                        <Form.Label>Form Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="form_description"
                          value={form?.form_description}
                          rows={3}
                          className="child_input"
                          onChange={(e) => {
                            setField(e.target.name, e.target.value);
                          }}
                          isInvalid={!!errors.form_description}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.form_description}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Select Previous Form as a Template
                        </Form.Label>
                        <div className="new-form-radio">
                          <div className="new-form-radio-box">
                            <label for="yes">
                              <input
                                type="radio"
                                value="Yes"
                                name="form_template_select"
                                id="yes"
                                checked={
                                  form?.form_template_select === 'Yes' ||
                                  form?.form_template_select === true
                                }
                                onClick={(e) => {
                                  setField(e.target.name, e.target.value);
                                }}
                              />
                              <span className="radio-round"></span>
                              <p>Yes, I want to select</p>
                            </label>
                          </div>
                          <div className="new-form-radio-box">
                            <label for="no">
                              <input
                                type="radio"
                                value="No"
                                name="form_template_select"
                                id="no"
                                onClick={(e) => {
                                  setField(e.target.name, e.target.value);
                                }}
                                checked={
                                  form?.form_template_select === 'No' ||
                                  form?.form_template_select === false
                                }
                              />
                              <span className="radio-round"></span>
                              <p>No, I want to create a new form</p>
                            </label>
                          </div>
                        </div>
                      </Form.Group>
                    </Col>
                    {form?.form_template_select === 'Yes' ? (
                      <Col md={6} className="mt-3 mt-md-0">
                        <Form.Group>
                          <Form.Label>Select Previous Form</Form.Label>
                          <Form.Select
                            name="previous_form"
                            isInvalid={!!errors.previous_form}
                          >
                            <option value="1">Select Previous Form</option>
                            {formData?.map((item) => {
                              return (
                                <option
                                  value={item.form_name}
                                  selected={
                                    form?.previous_form === item.form_name
                                  }
                                >
                                  {item.form_name}
                                </option>
                              );
                            })}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.previous_form}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    ) : null}
                    <Col md={6} className="mt-3 mt-md-0">
                      <Form.Group>
                        <Form.Label>Select Category</Form.Label>
                        <Form.Select
                          name="category_id"
                          isInvalid={!!errors.category_id}
                          onChange={(e)=>{
                            setField(e.target.name, e.target.value);
                          }}
                        >
                          <option value="">Select Category</option>
                          {formCategory?.map((item)=>{
                            return (
                              <option value={item.id} selected={
                                form?.category_id === item.id
                              }>{item.category}</option>
                            )
                          })}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.category_id}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    {/* <Col md={12} className="mt-3 mt-md-0">
                      <div className="form_setting">
                        <Accordion defaultActiveKey="0">
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>
                              <div className="form_setting_title">
                                <img src="../../img/carbon_settings.svg" />
                                <h3>Form Settings</h3>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body>
                              <div className="form_setting_fields">
                                <Row>
                                  <Col lg={3} sm={6}>
                                    <Form.Group className="form_fields_box">
                                      <Form.Label>Start Date</Form.Label>
                                      <Form.Control
                                        type="date"
                                        name="start_date"
                                        // value={formSettingData?.start_date}
                                        // onChange={(e) => {
                                        //   setFormSettingFields(
                                        //     e.target.name,
                                        //     e.target.value
                                        //   );
                                        // }}
                                        // isInvalid={!!formSettingError.start_date}
                                      />
                                      <img
                                        className="form_fields_icon"
                                        src="../../img/calendar_icons.png"
                                      />
                                      <Form.Control.Feedback type="invalid">
                                         {formSettingError.start_date} 
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                  <Col lg={3} sm={6} className="mt-3 mt-sm-0">
                                    <Form.Group className="form_fields_box">
                                      <Form.Label>Start Time</Form.Label>
                                      <Form.Control
                                        type="time"
                                        name="start_time"
                                        // value={formSettingData?.start_time}
                                        // onChange={(e) => {
                                        //   setFormSettingFields(
                                        //     e.target.name,
                                        //     e.target.value
                                        //   );
                                        // }}
                                        // isInvalid={!!formSettingError.start_time}
                                      />
                                      <img
                                        className="form_fields_icon"
                                        src="../../img/clock-circle-icon.png"
                                      />
                                      <Form.Control.Feedback type="invalid">
                                       {formSettingError.start_time} 
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                  <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                                    <Form.Group className="form_fields_box">
                                      <Form.Label>End Date</Form.Label>
                                      <Form.Control
                                        type="date"
                                        name="end_date"
                                        // value={formSettingData?.end_date}
                                        // onChange={(e) => {
                                        //   setFormSettingFields(
                                        //     e.target.name,
                                        //     e.target.value
                                        //   );
                                        // }}
                                        // isInvalid={!!formSettingError.end_date}
                                      />
                                      <img
                                        className="form_fields_icon"
                                        src="../../img/calendar_icons.png"
                                      />
                                      <Form.Control.Feedback type="invalid">
                                       {formSettingError.end_date} 
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                  <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                                    <Form.Group className="form_fields_box">
                                      <Form.Label>End Time</Form.Label>
                                      <Form.Control
                                        type="time"
                                        name="end_time"
                                        // value={formSettingData?.end_time}
                                        // onChange={(e) => {
                                        //   setFormSettingFields(
                                        //     e.target.name,
                                        //     e.target.value
                                        //   );
                                        // }}
                                        // isInvalid={!!formSettingError.end_time}
                                      />
                                      <img
                                        className="form_fields_icon"
                                        src="../../img/clock-circle-icon.png"
                                      />
                                      <Form.Control.Feedback type="invalid">
                                       {formSettingError.end_time} 
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </div>
                              <div className="applicable_section">
                                <Row>
                                  <Col md={4}>
                                    <Form.Group>
                                      <Form.Label className="form_label_title">
                                        Applicable to:
                                      </Form.Label>
                                      <div className="new-form-radio">
                                        <div className="new-form-radio-box">
                                          <label for="user_role">
                                            <input
                                              type="radio"
                                              value="user_role"
                                              name="applicable"
                                              id="user_role"
                                              // onChange={(e) => {
                                              //   setFormSettingFields(
                                              //     e.target.name,
                                              //     e.target.value
                                              //   );
                                              // }}
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
                                              // onChange={(e) => {
                                              //   setFormSettingFields(
                                              //     e.target.name,
                                              //     e.target.value
                                              //   );
                                              // }}
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
                                    <div className="sharing_section">
                                      <div className="sharing">
                                        <div className="sharing-title">
                                          <p>Enable Sharing</p>
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
                                      <div className="sharing">
                                        <div className="sharing-title">
                                          <p>Enable Editing</p>
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
                                      <div className="sharing">
                                        <div className="sharing-title">
                                          <p>Stop Form Submissions</p>
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
                                      <div className="sharing">
                                        <div className="sharing-title">
                                          <p>For Training Module</p>
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

                                    <Col md={12} className="mt-3 mt-md-0">
                                      <div className="submissions_section">
                                        <Form.Group>
                                          <Form.Label>
                                            Select folder to save submissions
                                          </Form.Label>
                                          <Form.Select
                                            name="previous_form"
                                            isInvalid={!!errors.previous_form}
                                          >
                                            <option value="1">
                                              Select folder to save submissions
                                            </option>
                                            {formData?.map((item) => {
                                              return (
                                                <option
                                                  value={item.form_name}
                                                  selected={
                                                    form?.previous_form ===
                                                    item.form_name
                                                  }
                                                >
                                                  {item.form_name}
                                                </option>
                                              );
                                            })}
                                          </Form.Select>
                                          <Form.Control.Feedback type="invalid">
                                            {errors.previous_form}
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    </Col>
                                  </Col>
                                  <Col md={8}>
                                    <section className="user_role_section">
                                      <Form.Label className="form_label_title">
                                        Select User Roles
                                      </Form.Label>

                                      <div className="user_role_table">
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
                                                {' '}
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
                                              </td>
                                              <td className="input_checkbox">
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
                                              </td>
                                              <td className="border_right_box input_checkbox">
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>Franchisee admin </td>
                                              <td className="input_checkbox">
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
                                              </td>
                                              <td className="input_checkbox">
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
                                              </td>
                                              <td className="input_checkbox">
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>Coordinator</td>
                                              <td className="input_checkbox">
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
                                              </td>
                                              <td className="input_checkbox">
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
                                              </td>
                                              <td className="input_checkbox">
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>Educator</td>
                                              <td className="input_checkbox">
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
                                              </td>
                                              <td className="input_checkbox">
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
                                              </td>
                                              <td className="input_checkbox">
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>Parent/Guardian</td>
                                              <td className="input_checkbox">
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
                                              </td>
                                              <td className="input_checkbox">
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
                                              </td>
                                              <td className="input_checkbox">
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
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
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
                                              </td>
                                              <td className="input_checkbox">
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
                                              </td>
                                              <td className="input_checkbox">
                                                <input
                                                  type="checkbox"
                                                  name="vehicle1"
                                                  value="Bike"
                                                />
                                              </td>
                                            </tr>
                                          </tbody>
                                        </Table>
                                      </div>
                                      <div className='signatories_section'>
                                        <Row>
                                        <Col md={3}>
                                        <div className="sharing">
                                        <div className="sharing-title">
                                          <p>Signatories</p>
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

                                        </Col>
                                        <Col md={8}>

                                        <div className='footer_modal footer_user-roles-box'>
                                          <div className='footer_modal_checkbox'>
                                          <label class="container">Co-ordinators<input type="checkbox" name="shared_role" id="coordinator"/>
                                            <span class="checkmark">
                                              </span>
                                              </label>
                                              <label class="container">Co-ordinators<input type="checkbox" name="shared_role" id="coordinator"/>
                                            <span class="checkmark">
                                              </span>
                                              </label>
                                              <label class="container">Co-ordinators<input type="checkbox" name="shared_role" id="coordinator"/>
                                            <span class="checkmark">
                                              </span>
                                              </label>

                                          </div>
                                          <div className='footer_modal_checkbox'>
                                          <label class="container">Co-ordinators<input type="checkbox" name="shared_role" id="coordinator"/>
                                            <span class="checkmark">
                                              </span>
                                              </label>
                                              <label class="container">Co-ordinators<input type="checkbox" name="shared_role" id="coordinator"/>
                                            <span class="checkmark">
                                              </span>
                                              </label>

                                          </div>

                                            </div>
                                        </Col>

                                        </Row>

                                      </div>
                                    </section>
                                  </Col>
                                </Row>
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </div>
                    </Col> */}
                    <Col sm={12}>
                      <div className="mt-5 mb-5 d-flex justify-content-center">
                        <Button
                          className="theme-light"
                          onClick={() => {
                            navigate('/form');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button className="primary" onClick={OnSubmit}>
                          Next
                        </Button>
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

export default AddFormBuilder;
