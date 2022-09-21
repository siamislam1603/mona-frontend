import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import LeftNavbar from '../../components/LeftNavbar';
import TopHeader from '../../components/TopHeader';
import { BASE_URL, FRONT_BASE_URL } from '../../components/App';
import { createFormValidation } from '../../helpers/validation';
import { useLocation, useNavigate } from 'react-router-dom';
import { FullLoader } from '../../components/Loader';

function AddFormBuilder(props) {
  const [formData, setFormData] = useState([]);
  const [form, setForm] = useState({ form_template_select: 'Yes' });
  const [formCategory, setFormCategory] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [selectedFranchiseeId, setSelectedFranchiseeId] = useState(null);
  const [errors, setErrors] = useState({});
  const [userRole, setUserRole] = useState([]);
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (location?.state?.id) {
      getParticularFormData();
    } else {
      setfullLoaderStatus(false);
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
      })
      .catch((error) => console.log('error', error));
  };
  const getFormCategory = () => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };

    fetch(`${BASE_URL}/form/category`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setFormCategory(result?.result);
      })
      .catch((error) => console.log('error', error));
  };
  const setField = (field, value) => {
    setForm({ ...form, [field]: value });
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
      myHeaders.append('authorization', 'Bearer ' + token);

      let data = { ...form };
      data['link'] = FRONT_BASE_URL + '/form/dynamic/' + data.form_name;
      data['created_by'] = localStorage.getItem('user_id');
      data['upper_role'] = getUpperRoleUser();
      myHeaders.append('Content-Type', 'application/json');
      fetch(`${BASE_URL}/form/add`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: myHeaders,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success === false) {
            let errorData = { ...errors };
            errorData['form_name'] = res.message;
            setErrors(errorData);
          } else {
            navigate('/form/setting', {
              state: { id: res?.result?.id, form_name: res?.result?.form_name },
            });
          }
        });
    }
  };
  const getParticularFormData = () => {
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
        setForm(result?.result);
        if (result) {
          setfullLoaderStatus(false);
        }
      })
      .catch((error) => {
        console.log('error', error);
        setfullLoaderStatus(false);
      });
  };
  const getFormData = () => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
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
                <FullLoader loading={fullLoaderStatus} />
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
                        <Form.Label>Form Title *</Form.Label>
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
                        <Form.Label>Form Type *</Form.Label>
                        <Form.Select
                          name="form_type"
                          onChange={(e) => {
                            setField(e.target.name, e.target.value.trim());
                          }}
                          isInvalid={!!errors.form_type}
                        >
                          <option value="">Select</option>
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
                        <Form.Label>Form Description *</Form.Label>
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
                    {!location?.state?.id && <><Col md={6}>
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
                    {form?.form_template_select === 'Yes' ||
                    form?.form_template_select === true ? (
                      <Col md={6} className="mt-3 mt-md-0">
                        <Form.Group>
                          <Form.Label>Select Previous Form *</Form.Label>
                          <Form.Select
                            name="previous_form"
                            onChange={(e) => {
                              setField(e.target.name, e.target.value);
                            }}
                            isInvalid={!!errors.previous_form}
                          >
                            <option value="1">Select</option>
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
                    ) : null} </>}
                    <Col md={6} className="mt-3 mt-md-0">
                      <Form.Group>
                        <Form.Label>Select Category *</Form.Label>
                        <Form.Select
                          name="category_id"
                          isInvalid={!!errors.category_id}
                          onChange={(e) => {
                            setField(e.target.name, e.target.value);
                          }}
                        >
                          <option value="">Select</option>
                          {formCategory?.map((item) => {
                            return (
                              <option
                                value={item.id}
                                selected={form?.category_id === item.id}
                              >
                                {item.category}
                              </option>
                            );
                          })}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.category_id}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
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
