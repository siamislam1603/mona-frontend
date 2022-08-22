
import React, { useEffect, useState } from 'react';
import { Col, Container, Form, Row, Button } from 'react-bootstrap';
import { BASE_URL } from '../components/App';
import { DynamicFormValidation } from '../helpers/validation';
import InputFields from './InputFields';
import { useLocation, useNavigate } from 'react-router-dom';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import { getSuggestedQuery } from '@testing-library/react';
let values = [];
const DynamicForm = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log('location----->', location);
  const [formData, setFormData] = useState([]);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({});
  const [formPermission, setFormPermission] = useState({});
  const [targetUser, setTargetUser] = useState([]);
  const [behalfOf, setBehalfOf] = useState('');
  const [childId,setChildId]=useState();
  const setField = (section, field, value) => {
    setForm({ ...form, [section]: { ...form[`${section}`], [field]: value } });
    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
    if (field === 'hobby') {
      values.includes(value) ? values.pop(value) : values.push(value);
      setForm({ ...form, [field]: values });

      console.log('Values', values);
    }
  };
  useEffect(() => {
    console.log('history---->');
    getFormFields();
    getUser();
  }, []);
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
    let form_name = encodeURIComponent(
      location.pathname
        .split('/')
        [location.pathname.split('/').length - 1].replaceAll('%20', ' ')
    );

    
    let api_url = `${BASE_URL}/form/target_users?form_name=${form_name}&franchisee_id=${localStorage.getItem(
      'franchisee_id'
    )}&user_id=${localStorage.getItem("user_id")}&user_role=${localStorage.getItem("user_role")}`;

    fetch(api_url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setTargetUser(result?.data);
      })
      .catch((error) => console.log('error', error));
  };
  const getFormFields = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    let form_name = encodeURIComponent(
      location.pathname
        .split('/')
        [location.pathname.split('/').length - 1].replaceAll('%20', ' ')
    );
    fetch(
      `${BASE_URL}/field?form_name=${form_name}&franchisee_id=${localStorage.getItem('franchisee_id')}&request=user`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        let res = JSON.parse(result);
        setFormData(res.result);
        setFormPermission(res?.form[0]?.form_permissions[0]);
        let formsData = {};
        let data = {};
        Object.keys(res?.result)?.map((item) => {
          if (!formsData[item]) formsData[item] = {};
          if (!data[item]) data[item] = [];

          res?.result[item]?.map((inner_item) => {
            if (inner_item.form_field_permissions.length > 0) {
              inner_item?.form_field_permissions?.map((permission) => {
                if (
                  permission?.fill_access_users.includes(
                    localStorage.getItem('user_role')
                  ) ||
                  permission?.fill_access_users.includes(
                    localStorage.getItem('user_id')
                  )
                ) {
                  formsData[item][`${inner_item.field_name}`] = null;
                  data[item].push(inner_item);
                } else {
                  delete formsData[item];
                  delete data[item];
                }
              });
            } else {
              data[item].push(inner_item);
            }
            console.log('form_data---->1212', data);
          });
        });
        setForm(formsData);
        setFormData(data);
        console.log(res.result);
      })
      .catch((error) => console.log('error', error));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log('form---->', form);
    console.log('form_data---->', formData);
    const newErrors = DynamicFormValidation(form, formData, localStorage.getItem("user_role")==="guardian" ? childId.includes("all") ? null : childId : behalfOf);
    console.log('newErrors---->', newErrors);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      console.log('formData[0]?.form?.id---->', formData[0]?.form_id);
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
          form_id: formData[Object.keys(formData)[0]][0]?.form_id,
          user_id: localStorage.getItem('user_id'),
          behalf_of: localStorage.getItem("user_role")==="guardian" ? childId : behalfOf,
          data: form,
        }),
        redirect: 'follow',
      };

      fetch(`${BASE_URL}/form/form_data`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          result = JSON.parse(result);
          alert(result?.message);
          navigate('/form');
        })
        .catch((error) => console.log('error', error));
    }
  };
  return (
    <>
      {console.log('form_data---->', formData)}
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
              <TopHeader
                  setSelectedFranchisee={(id) => {
                    console.log("id---->444",id);
                    setChildId(id);
                    console.log("user_id",id);
                    id=localStorage.getItem("user_role")==="guardian" ? localStorage.getItem("franchisee_id") : id;
                  }}
                />
                <Row>
                  <div className="forms-managment-left new-form-title">
                    <h6>
                      {location.pathname
                        .split('/')
                        [location.pathname.split('/').length - 1].replaceAll(
                          '%20',
                          ' '
                        )}{' '}
                      Form
                    </h6>
                  </div>
                </Row>
                <Form>
                  <Row>
                    {console.log("formPermission?.target_user--->",formPermission)}
                    {!(
                      formPermission?.target_user?.includes(
                        localStorage.getItem('user_role')==="guardian" ? "parent" : localStorage.getItem('user_role')
                      ) ||
                      formPermission?.target_user?.includes(
                        localStorage.getItem('user_id')
                      )
                    ) && (
                      <Col sm={6}>
                        <div className="child_info_field sex">
                          <span className="form-label">Behalf of:</span>
                          <div clas Name="d-flex mt-2"></div>
                          <div className="btn-radio d-flex align-items-center">
                            {localStorage.getItem("user_role")==="guardian" ? (
                            <Form.Select
                              name={'behalf_of'}
                              onChange={(e) => {
                                setBehalfOf(e.target.value);
                                if (e.target.value !== '') {
                                  let errorData = { ...errors };
                                  errorData['behalf_of'] = null;
                                  setErrors(errorData);
                                }
                              }}
                              disabled 
                            >
                              <option value="">Select Behalf of</option>
                              {targetUser?.map((item) => {
                                return (
                                  <>
                                    {item.id===parseInt(childId) ? <option value={item.id} selected>
                                      {item.child ? item.fullname : item.email}
                                    </option> : <option value={item.id}>
                                      {item.child ? item.fullname : item.email}
                                    </option>}
                                  </>
                                );
                              })}
                            </Form.Select>):
                            (<Form.Select
                              name={'behalf_of'}
                              onChange={(e) => {
                                setBehalfOf(e.target.value);
                                if (e.target.value !== '') {
                                  let errorData = { ...errors };
                                  errorData['behalf_of'] = null;
                                  setErrors(errorData);
                                }
                              }}
                            >
                              <option value="">Select Behalf of</option>
                              {targetUser?.map((item) => {
                                return (
                                  <>
                                    <option value={item.id}>
                                      {item.child ? item.fullname : item.email}
                                    </option>
                                  </>
                                );
                              })}
                            </Form.Select>)
                            }
                          </div>
                          <p className='error' style={{marginTop:"-10px !important"}}>
                            {errors.behalf_of}
                          </p>
                        </div>
                      </Col>
                    )}
                    {Object.keys(formData)?.map((item) => {
                      return item ? (
                        <>
                          {console.log('item---->', item)}
                          {formData[item]?.map((inner_item, index) => {
                            return inner_item.form_field_permissions.length >
                              0 ? (
                              <>
                                {index === 0 && (
                                  <h6 className="text-capitalize">{item}</h6>
                                )}
                                <InputFields
                                  {...inner_item}
                                  error={errors}
                                  onChange={(key, value) => {
                                    console.log('KEY--->', key);
                                    console.log('VALUE--->', value);
                                    setField(item, key, value);
                                  }}
                                />
                              </>
                            ) : (
                              <InputFields
                                {...inner_item}
                                error={errors}
                                onChange={(key, value) => {
                                  console.log('KEY--->', key);
                                  console.log('VALUE--->', value);
                                  setField(key, value);
                                }}
                              />
                            );
                          })}
                        </>
                      ) : (
                        formData[item]?.map((inner_item) => {
                          return (
                            <InputFields
                              {...inner_item}
                              error={errors}
                              onChange={(key, value) => {
                                console.log('KEY--->', key);
                                console.log('VALUE--->', value);
                                setField(item, key, value);
                              }}
                            />
                          );
                        })
                      );
                    })}
                    {console.log(
                      'formPermission?.fill_access_users--->',
                      formPermission?.target_user
                    )}

                    <Col md={12}>
                      <div className="custom_submit">
                        <Button
                          className="custom_submit_button w-auto ml-auto mr-auto d-block"
                          onClick={onSubmit}
                        >
                          Submit
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
};

export default DynamicForm;
