import React, { useEffect, useState } from 'react';
import { Col, Container, Form, Row, Button } from 'react-bootstrap';
import { BASE_URL } from '../components/App';
import { DynamicFormValidation } from '../helpers/validation';
import InputFields from './InputFields';
import { useLocation, useNavigate } from 'react-router-dom';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { FullLoader } from '../components/Loader';

let values = [];
let behalfOfFlag = false;
const DynamicForm = () => {
  const query = new URL(window.location.href);
  console.log('QWUERY:', query);
  console.log('TRAINING ID:', query.searchParams.get('trainingId'));
  const location = useLocation();
  const navigate = useNavigate();
  const [signatureAccessFlag, setSignatureAccessFlag] = useState();
  const [formData, setFormData] = useState([]);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({});
  const [fieldData, setFieldData] = useState({});
  const [formPermission, setFormPermission] = useState({});
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);
  const [targetUser, setTargetUser] = useState([]);
  const [behalfOf, setBehalfOf] = useState('');
  const [childId, setChildId] = useState();
  const [errorFocus,setErrorFocus]=useState('');
  const token = localStorage.getItem('token');
  let training_id = location.search
    ? location.search.split('?')[1].split('=')[1]
    : null;
  const setField = (section, field, value, type) => {
    console.log('set---section', section);
    console.log('set---field', field);
    console.log('set---value', value);
    console.log('set---type', type);
    
    let flag = false;
    if (type === 'text') {
      value = value.trimEnd();
      console.log('length----->', value.split(' ').length);
      if (value.split(' ').length > 250) {
        let errorsData = { ...errors };
        errorsData[
          `${field}`
        ] = `Text word limit must be less or equal to 250.`;
        setErrors(errorsData);
        flag = true;
      }
    }
    if (type === 'textarea') {
      value = value.trimEnd();
      if (value.split(' ').length > 2000) {
        let errorsData = { ...errors };
        errorsData[
          `${field}`
        ] = `Text area word limit must be less or equal to 2000.`;
        setErrors(errorsData);
        flag = true;
      }
    }
    if (location?.state?.id) {
      console.log('field---->', field);
      console.log('value---->', value);

      if (type === 'date') {
        value = moment(value).format('DD-MM-YYYY');
        setFieldData({
          ...fieldData,
          ['fields']: { ...fieldData[`fields`], [field]: value },
        });
      }
      if (type === 'checkbox') {
        value = value.slice(0, -1);
        setFieldData({
          ...fieldData,
          ['fields']: { ...fieldData[`fields`], [field]: value },
        });
      } else {
        setFieldData({
          ...fieldData,
          ['fields']: { ...fieldData[`fields`], [field]: value },
        });
      }
    } else {
      if (type === 'date') {
        value = moment(value).format('DD-MM-YYYY');
        setForm({
          ...form,
          [section]: { ...form[`${section}`], [field]: value },
        });
      }
      if (type === 'checkbox') {
        value = value.slice(0, -1);
        setForm({
          ...form,
          [section]: { ...form[`${section}`], [field]: value },
        });
      } else {
        setForm({
          ...form,
          [section]: { ...form[`${section}`], [field]: value },
        });
      }
    }

    if (!flag) {
      if (!!errors[field]) {
        setErrors({
          ...errors,
          [field]: null,
        });
      }
    }

    // if (field === 'hobby') {
    //   values.includes(value) ? values.pop(value) : values.push(value);
    //   setForm({ ...form, [field]: values });

    // console.log('Values', values);
    // }
  };
  useEffect(() => {
    if (location?.state?.id) {
      getFieldsData(location?.state?.id);
    }
    getFormFields();
    getUser();
  }, []);
  const getFieldsData = (id) => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/form/form_data/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result.result.fields = JSON.parse(result.result.fields);
        console.log('result---->', result.result.fields);
        setFieldData(result.result);
      })
      .catch((error) => console.log('error', error));
  };
  const getUser = () => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);

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
    )}&user_id=${localStorage.getItem(
      'user_id'
    )}&user_role=${localStorage.getItem('user_role')}`;

    fetch(api_url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setTargetUser(result?.data);
      })
      .catch((error) => console.log('error', error));
  };
  const getFormFields = async () => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
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
    fetch(
      `${BASE_URL}/field?form_name=${form_name}&franchisee_id=${localStorage.getItem(
        'franchisee_id'
      )}&request=user`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        let res = result;
        console.log('res----->', Object.values(res?.result));

        // res?.result?.map((item)=>{
        //   console.log("item---->",item);
        // })
        if (res?.success == false) {
          localStorage.setItem('form_error', res?.message);
          window.location.href = '/form';
        }

        setFormData(res.result);
        setFormPermission(res?.form[0]?.form_permissions[0]);
        let formsData = {};
        let data = {};
        Object.keys(res?.result)?.map((item) => {
          if (!formsData[item]) formsData[item] = {};
          if (!data[item]) data[item] = [];

          res?.result[item]?.map((inner_item) => {
            console.log('inner_item--->', inner_item.field_type);
            // if(inner_item.field_type==="headings" || inner_item.field_type==="text_headings")
            // {
            //   setForm({
            //     ...form,
            //     [item]: { ...form[`${item}`], [inner_item.field_type]: inner_item.field_label },
            //   });
            // }
            // else{

            //   setForm({
            //     ...form,
            //     [item]: { ...form[`${item}`], [inner_item.field_label]: "" },
            //   });
            // }
            if (inner_item.form_field_permissions.length > 0) {
              console.log('HEllloooo------>');
              inner_item?.form_field_permissions?.map((permission) => {
                console.log('HEllloooo------>');
                if (
                  permission?.fill_access_users.includes(
                    localStorage.getItem('user_role')
                  ) ||
                  permission?.fill_access_users.includes(
                    localStorage.getItem('user_id')
                  )
                ) {
                  
                  if (
                    inner_item.field_type === 'headings' ||
                    inner_item.field_type === 'text_headings'
                  ) {
                    formsData[item][`${inner_item.field_type}`] = inner_item.field_label;
                    
                  } else {
                    formsData[item][`${inner_item.field_name}`] = null;
                  }
                  data[item].push(inner_item);
                } else {
                  delete formsData[item];
                  delete data[item];
                }
              });
            } else {
              if (
                inner_item.field_type === 'headings' ||
                inner_item.field_type === 'text_headings'
              ) {
                formsData[item][`${inner_item.field_type}`] = inner_item.field_label;
                
              } else {
                formsData[item][`${inner_item.field_name}`] = null;
              }
              data[item].push(inner_item);
            }
          });
        });
        if (result.form[0]?.form_permissions[0].signatories === true) {
          if (
            result.form[0]?.form_permissions[0]?.signatories_role.includes(
              localStorage.getItem('user_role') === 'guardian'
                ? 'parent'
                : localStorage.getItem('user_role')
            )
          ) {
            console.log('Hello----12121212---->');
            setSignatureAccessFlag(true);
          } else {
            setSignatureAccessFlag(false);
          }
        } else {
          setSignatureAccessFlag(true);
        }
        console.log(
          'formsData---->',
          formsData
          );

        setForm(formsData);
        setFormData(data);
        if (result) {
          setfullLoaderStatus(false);
        }
      })
      .catch((error) => {
        console.log('error', error);
        setfullLoaderStatus(false);
      });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (location?.state?.id) {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('authorization', 'Bearer ' + token);
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
          id: location?.state?.id,
          data: fieldData,
          status: 'update',
        }),
        redirect: 'follow',
      };

      fetch(`${BASE_URL}/form/form_data`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          navigate(`/form/response/${location.state.form_id}`, {
            state: { message: result.message },
          });
        });
    } else {
      const newErrors = DynamicFormValidation(
        form,
        formData,
        localStorage.getItem('user_role') === 'guardian' ? childId : behalfOf,
        behalfOfFlag,
        signatureAccessFlag
      );
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setErrorFocus(Object.keys(newErrors)[0]);
        document.getElementById(Object.keys(newErrors)[0]).focus();
      } else {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('authorization', 'Bearer ' + token);
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify({
            form_id: formData[Object.keys(formData)[0]][0]?.form_id,
            user_id: localStorage.getItem('user_id'),
            behalf_of:
              localStorage.getItem('user_role') === 'guardian'
                ? behalfOfFlag
                  ? childId
                  : behalfOf
                  ? behalfOf
                  : localStorage.getItem('user_id')
                : behalfOf
                ? behalfOf
                : localStorage.getItem('user_id'),
            data: form,
          }),
          redirect: 'follow',
        };

        fetch(`${BASE_URL}/form/form_data?role=${localStorage.getItem("user_role")}`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            result = JSON.parse(result);
            if (training_id) {
              const user_id = localStorage.getItem('user_id');
              const token = localStorage.getItem('token');
              var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({}),
                redirect: 'follow',
              };
              fetch(
                `${BASE_URL}/training/completeTraining/${training_id}/${user_id}?training_status=finished`,
                requestOptions
              )
                .then((response) => response.json())
                .then((res) => {
                  if (res) {
                    if (
                      result?.message ===
                      'You can add only one time form data!!'
                    ) {
                      toast.error(result?.message);
                    } else {
                      navigate('/training');
                    }
                  }
                });
            } else {
              if (result?.message === 'You can add only one time form data!!') {
                toast.error(result?.message);
              } else {
                navigate('/form', { state: { message: result.message } });
              }
            }
          })
          .catch((error) => console.log('error', error));
      }
    }
  };
  return (
    <>
      {console.log('form------>', form)}
      <div id="main">
        <ToastContainer />
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
                <TopHeader
                  setSelectedFranchisee={(id) => {
                    setChildId(id);
                    console.log('user_id', id);
                    id =
                      localStorage.getItem('user_role') === 'guardian'
                        ? localStorage.getItem('franchisee_id')
                        : id;
                  }}
                />
                <FullLoader loading={fullLoaderStatus} />
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
                  <Row className="set-layout-row">
                    {formPermission?.target_user &&
                      !(
                        formPermission?.target_user?.includes(
                          localStorage.getItem('user_role') === 'guardian'
                            ? 'parent'
                            : localStorage.getItem('user_role')
                        ) ||
                        formPermission?.target_user?.includes(
                          localStorage.getItem('user_id')
                        )
                      ) && (
                        <Col sm={6}>
                          {console.log(
                            'Hello New once',
                            formPermission?.target_user
                          )}
                          {(behalfOfFlag = true)}
                          <div className="child_info_field sex">
                            <span className="form-label">Behalf of:</span>
                            <div clas Name="d-flex mt-2"></div>
                            <div className="btn-radio d-flex align-items-center">
                              {localStorage.getItem('user_role') ===
                              'guardian' ? (
                                <Form.Select
                                  name={'behalf_of'}
                                  id="behalf_of"
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
                                  <option value="">Select</option>
                                  {targetUser?.map((item) => {
                                    return (
                                      <>
                                        {item.id === parseInt(childId) ? (
                                          <option value={item.id} selected>
                                            {item.child
                                              ? item.fullname
                                              : `${item.fullname} (${item.email})`}
                                          </option>
                                        ) : (
                                          <option value={item.id}>
                                            {item.child
                                              ? item.fullname
                                              : `${item.fullname} (${item.email})`}
                                          </option>
                                        )}
                                      </>
                                    );
                                  })}
                                </Form.Select>
                              ) : location?.state?.id ? (
                                <Form.Select
                                  name={'behalf_of'}
                                  id="behalf_of"
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
                                  <option value="">Select</option>
                                  {targetUser?.map((item) => {
                                    return (
                                      <>
                                        {item.id === fieldData.behalf_of ? (
                                          <option value={item.id} selected>
                                            {item.child
                                              ? item.fullname
                                              : `${item.fullname} (${item.email})`}
                                          </option>
                                        ) : (
                                          <option value={item.id}>
                                            {item.child
                                              ? item.fullname
                                              : `${item.fullname} (${item.email})`}
                                          </option>
                                        )}
                                      </>
                                    );
                                  })}
                                </Form.Select>
                              ) : (
                                <Form.Select
                                  name={'behalf_of'}
                                  id="behalf_of"
                                  onChange={(e) => {
                                    setBehalfOf(e.target.value);
                                    if (e.target.value !== '') {
                                      let errorData = { ...errors };
                                      errorData['behalf_of'] = null;
                                      setErrors(errorData);
                                    }
                                  }}
                                  isInvalid={!!errors.behalf_of}
                                >
                                  <option value="">Select</option>
                                  {targetUser?.map((item) => {
                                    return (
                                      <>
                                        {(parseInt(
                                          localStorage.getItem('franchisee_id')
                                        ) === item.franchisee_id ||
                                          localStorage.getItem('user_role') ===
                                            'franchisor_admin') && (
                                          <option value={item.id}>
                                            {item.child
                                              ? item.fullname
                                              : `${item.fullname} (${item.email})`}
                                          </option>
                                        )}
                                      </>
                                    );
                                  })}
                                </Form.Select>
                              )}
                            </div>
                            <p
                              className="error"
                              style={{ marginTop: '-10px !important' }}
                            >
                              {errors.behalf_of}
                            </p>
                          </div>
                        </Col>
                      )}
                    {Object.keys(formData)?.map((item,index) => {
                      return item ? (
                        <>
                          {formData[item]?.map((inner_item, inner_index) => {
                            return inner_item.form_field_permissions.length >
                              0 ? (
                              (
                                inner_item.form_field_permissions[0]
                                  .fill_access_users || []
                              ).includes(
                                localStorage.getItem('user_role') === 'guardian'
                                  ? 'parent'
                                  : localStorage.getItem('user_role')
                              ) && location?.state?.id ? (
                                <InputFields
                                  {...inner_item}
                                  signature_flag={signatureAccessFlag}
                                  diff_index={inner_index}
                                  field_data={fieldData}
                                  error={errors}
                                  errorFocus={errorFocus}
                                  onChange={(key, value, type) => {
                                    setField('', key, value, type);
                                  }}
                                />
                              ) : (
                                (
                                  inner_item.form_field_permissions[0]
                                    .fill_access_users || []
                                ).includes(
                                  localStorage.getItem('user_role') ===
                                    'guardian'
                                    ? 'parent'
                                    : localStorage.getItem('user_role')
                                ) && (
                                  <>
                                    {console.log(
                                      'inner_item111111',
                                      inner_item.form_field_permissions[0]
                                        .fill_access_users
                                    )}
                                    {index === 0 && (
                                      <h6 className="text-capitalize">
                                        {item.split('_').join(' ')}
                                      </h6>
                                    )}
                                    <InputFields
                                      {...inner_item}
                                      signature_flag={signatureAccessFlag}
                                      diff_index={inner_index}
                                      error={errors}
                                      errorFocus={errorFocus}
                                      onChange={(key, value, type) => {
                                        setField(item, key, value, type);
                                      }}
                                    />
                                  </>
                                )
                              )
                            ) : location?.state?.id ? (
                              <InputFields
                                {...inner_item}
                                signature_flag={signatureAccessFlag}
                                diff_index={inner_index}
                                field_data={fieldData}
                                error={errors}
                                errorFocus={errorFocus}
                                onChange={(key, value, type) => {
                                  setField('', key, value, type);
                                }}
                              />
                            ) : (
                              <InputFields
                                {...inner_item}
                                signature_flag={signatureAccessFlag}
                                error={errors}
                                diff_index={inner_index}
                                errorFocus={errorFocus}
                                onChange={(key, value, type) => {
                                  setField('', key, value, type);
                                }}
                              />
                            );
                          })}
                        </>
                      ) : (
                        formData[item]?.map((inner_item,inner_index) => {
                          return location?.state?.id ? (
                            <InputFields
                              {...inner_item}
                              signature_flag={signatureAccessFlag}
                              field_data={fieldData}
                              diff_index={inner_index}
                              error={errors}
                              errorFocus={errorFocus}
                              onChange={(key, value, type) => {
                                setField('', key, value, type);
                              }}
                            />
                          ) : (
                            <InputFields
                              {...inner_item}
                              signature_flag={signatureAccessFlag}
                              diff_index={inner_index}
                              error={errors}
                              errorFocus={errorFocus}
                              onChange={(key, value, type) => {
                                setField(item, key, value, type);
                              }}
                            />
                          );
                        })
                      );
                    })}

                    <Col md={12}>
                      <div className="d-flex justify-content custom_submit">
                        <Button
                          className="custom_submit_button w-auto ml-auto mr-auto d-block"
                          onClick={onSubmit}
                        >
                          Submit
                        </Button>
                        <Button
                          className="theme-light"
                          onClick={() => {
                            navigate('/form');
                          }}
                        >
                          Cancel
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
