import React, { useEffect, useRef, useState } from 'react';
import { Col, Container, Form, Row, Button, Modal } from 'react-bootstrap';
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
import context from 'react-bootstrap/esm/AccordionContext';

// function copyOneStateToAnother(formObj) {
//   let keyNames = Object.keys(formObj);
//   let miscelleneousObj = {};

//   for(let i = 0; i < keyNames.length; i++) {
//     if(keyNames[i]) {
//       let data = formObj[keyNames[i]];
//       miscelleneousObj = {...miscelleneousObj, ...data};
//     }
//   }
//   return formObj;
// }

function formattedFormData(dataArr) {
  let formedObj = {};

  dataArr?.forEach((item, index) => {
    if (!item?.option) {
      if (!formedObj[`${item?.field_name} ${index}`]) {
        formedObj[`${item?.field_name} ${index}`] = null;
      }
    } else {
      formedObj[`${item?.field_name} ${index}`] = null;
      let options = item?.option;
      // eslint-disable-next-line no-eval
      options = eval(options);
      options?.forEach((d) => {
        // let key = Object?.keys(d);
        let value = Object?.values(d);
        if (typeof value[0] === 'object') {
          value = value[0];
          formedObj[`${value?.field_name} ${item?.field_name} ${index}`] = null;
        }
      });
    }
  });

  return formedObj;
}

function formatDate(date) {
  let data = date.split('-');
  return `${data[2]}/${data[1]}/${data[0]}`;
}

function formatTime(time) {
  let data = time.split(':');
  let hour = null;
  let hourValue = data[0],
    minuteValue = data[1];

  if (parseInt(hourValue) > 12) {
    hourValue = parseInt(hourValue) - 12;
    hour = 'PM';
  } else if (parseInt(hourValue) === 12) {
    hourValue = parseInt(hourValue);
    hour = 'PM';
  } else {
    hourValue = parseInt(hourValue);
    hour = 'AM';
  }

  return `${
    hourValue >= 10 ? hourValue : `0${hourValue}`
  }:${minuteValue} ${hour}`;
}

// function filterBlankData(dataArr) {
//   let data = [];

//   dataArr?.forEach((item, index) => {
//     item?.data?.forEach((d) => {});
//   });

//   return data;
// }

let values = [];
let behalfOfFlag = false;
const DynamicForm = () => {
  const query = new URL(window.location.href);
  const location = useLocation();
  const navigate = useNavigate();
  const [signatureAccessFlag, setSignatureAccessFlag] = useState();
  const [tempFormData, setTempFormData] = useState({});
  const [formData, setFormData] = useState([]);
  const [formDataVal, setFormDataVal] = useState({});
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({});
  const [fieldData, setFieldData] = useState({});
  const [formPermission, setFormPermission] = useState({});
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);
  const [targetUser, setTargetUser] = useState([]);
  const [behalfOf, setBehalfOf] = useState('');
  const [selectedUserValue, setSelectedUserValue] = useState({});
  const [childId, setChildId] = useState();
  const [inactiveFormPopup, setInactiveFormPopup] = useState(false);
  const [formFillingDate, setFormFillingDate] = useState(null);
  const [formFillingTime, setFormFillingTime] = useState(null);
  const [errorFocus, setErrorFocus] = useState('');
  const [signatories, setSignatories] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState('');
  const [formFieldDetails, setFormFieldDetails] = useState({});
  const [currentForm, setCurrentForm] = useState({});
  const token = localStorage.getItem('token');
  let training_id = location.search
    ? location.search.split('?')[1].split('=')[1]
    : null;
  const setField = ({ field_index, section, field, value, type }) => {
    let tempObj = {};
    let flag = false;
    if (type === 'text') {
      if (!location?.state?.id) {
        // value = value.trimEnd();
      }
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
      if (!location?.state?.id) {
        // value = value.trimEnd();
      }
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
      if (type === 'date') {
        value = moment(value).format('DD-MM-YYYY');
        setFieldData({
          ...fieldData,
          ['fields']: { ...fieldData[`fields`], [field]: value },
        });

        setTempFormData({
          ...tempFormData,
          ['fields']: {
            ...tempFormData[`fields`],
            [`${field} ${field_index}`]: value,
          },
        });
      }
      if (type === 'checkbox') {
        value = value.slice(0, -1);
        setFieldData({
          ...fieldData,
          ['fields']: { ...fieldData[`fields`], [field]: value },
        });

        setTempFormData({
          ...tempFormData,
          ['fields']: {
            ...tempFormData[`fields`],
            [`${field} ${field_index}`]: value,
          },
        });
      }
      if (type === 'radio') {
        setFieldData({
          ...fieldData,
          ['fields']: { ...fieldData[`fields`], [field]: value },
        });
        setTempFormData({
          ...tempFormData,
          ['fields']: {
            ...tempFormData[`fields`],
            [`${field} ${field_index}`]: value,
          },
        });
      } else {
        setFieldData({
          ...fieldData,
          ['fields']: { ...fieldData[`fields`], [field]: value },
        });
        setTempFormData({
          ...tempFormData,
          ['fields']: {
            ...tempFormData[`fields`],
            [`${field} ${field_index}`]: value,
          },
        });
      }
    } else {
      if (type === 'date') {
        value = moment(value).format('DD-MM-YYYY');
        setForm({
          ...form,
          [section]: { ...form[`${section}`], [field]: value },
        });
        setTempFormData({
          ...tempFormData,
          [section]: {
            ...tempFormData[section],
            [`${field} ${field_index}`]: value,
          },
        });
      }

      if (type === 'checkbox') {
        value = value.slice(0, -1);
        setForm({
          ...form,
          [section]: { ...form[`${section}`], [field]: value },
        });
        setTempFormData({
          ...tempFormData,
          [section]: {
            ...tempFormData[section],
            [`${field} ${field_index}`]: value,
          },
        });
      } else {
        setForm({
          ...form,
          [section]: {
            ...form[`${section}`],
            [field]: value,
          },
        });
        setFieldData({
          ...fieldData,
          ['fields']: {
            ...fieldData['fields'],
            [field]: value,
          },
        });
        setTempFormData({
          ...tempFormData,
          [section]: {
            ...tempFormData[section],
            [`${field} ${field_index}`]: value,
          },
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

  function handleGoBack() {
    setFormFillingDate(null);
    setFormFillingTime(null);
    window.location.href = '/form';
  }

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
        setFormDataVal(result?.fData);
        setCurrentForm(result?.form);
        let { form } = result;
        let { start_date, start_time, created_by } = form[0];

        let currentDate = moment().format('YYYY-MM-DD');
        let currentTime = moment().format('HH:mm:ss');

        if (currentDate < start_date) {
          setInactiveFormPopup(true);
          setFormFillingDate(start_date);
          setFormFillingTime(start_time);
        } else {
          if (currentDate === start_date && currentTime < start_time) {
            // && parseInt(created_by) !== parseInt(localStorage.getItem('user_id'))
            setInactiveFormPopup(true);
            setFormFillingDate(start_date);
            setFormFillingTime(start_time);
          } else {
            let res = result;
            if (res?.success === false) {
              localStorage.setItem('form_error', res?.message);
              window.location.href = '/form';
            }

            setSignatories(
              res?.form[0]?.form_permissions[0]?.signatories_role || []
            );
            setFormData(res.result);
            setFormPermission(res?.form[0]?.form_permissions[0]);
            let formsData = {};
            let data = {};
            Object.keys(res?.result)?.map((item) => {
              if (!formsData[item]) formsData[item] = {};
              if (!data[item]) data[item] = [];

              res?.result[item]?.map((inner_item, index) => {
                data[item]?.push(inner_item);
                if (inner_item.form_field_permissions.length > 0) {
                  inner_item?.form_field_permissions?.map((permission) => {
                    if (
                      permission?.fill_access_users?.includes(
                        localStorage.getItem('user_role') === 'guardian'
                          ? 'parent'
                          : localStorage.getItem('user_role')
                      ) ||
                      permission?.fill_access_users?.includes(
                        localStorage.getItem('user_id')
                      )
                    ) {
                      if (
                        inner_item.field_type === 'headings' ||
                        inner_item.field_type === 'text_headings' ||
                        inner_item.field_type === 'sub_headings'
                      ) {
                        formsData[item][`${inner_item.field_type}_${index}`] =
                          inner_item.field_label;
                      } else {
                        formsData[item][`${inner_item.field_name}`] = null;
                      }
                      // data[item].push(inner_item);
                    } else {
                      // delete formsData[item];
                      // delete data[item];
                    }
                  });
                } else {
                  if (
                    inner_item.field_type === 'headings' ||
                    inner_item.field_type === 'text_headings' ||
                    inner_item.field_type === 'sub_headings'
                  ) {
                    formsData[item][`${inner_item.field_type}_${index}`] =
                      inner_item.field_label;
                  } else {
                    formsData[item][`${inner_item.field_name}`] = null;
                  }
                  // data[item].push(inner_item);
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
                setSignatureAccessFlag(true);
              } else {
                setSignatureAccessFlag(false);
              }
            } else {
              setSignatureAccessFlag(true);
            }
            setForm(formsData);
            setFormData(data);
            if (result) {
              setfullLoaderStatus(false);
            }
          }
        }
      })
      .catch((error) => {
        setfullLoaderStatus(false);
      });
  };

  useEffect(() => {
    if (location?.state?.id) {
      setTextField(fieldData);
    } else {
      setTextField(form);
    }
  }, [form, fieldData]);

  const setTextField = (data) => {
    if (data?.fields) {
      Object.keys(formData)?.map((ele) => {
        formData[ele]?.map((inner_item) => {
          if (inner_item?.option) {
            Object.values(eval(inner_item?.option))?.map(
              (option1, inner_index) => {
                if (
                  (Object.values(eval(option1))[0]?.field_type === 'headings' ||
                    Object.values(eval(option1))[0]?.field_type ===
                      'text_headings' ||
                    Object.values(eval(option1))[0]?.field_type ===
                      'sub_headings') &&
                  data?.fields[`${inner_item?.field_name}`] ===
                    Object.values(eval(option1))[0]?.option_key
                ) {
                  data.fields[
                    `${
                      Object.values(eval(option1))[0]?.field_type
                    }_${inner_index}`
                  ] = Object.values(eval(option1))[0]?.field_label;
                } else {
                  delete data?.fields[
                    `${
                      Object.values(eval(option1))[0]?.field_type
                    }_${inner_index}`
                  ];
                }
              }
            );
          }
        });
      });
    } else {
      Object.keys(formData)?.map((ele) => {
        formData[ele]?.map((inner_item) => {
          if (inner_item?.option) {
            Object.values(eval(inner_item?.option))?.map(
              (option1, inner_index) => {
                Object.keys(data)?.map((ele1) => {
                  if (
                    data[ele1][`${inner_item?.field_name}`] ===
                      Object.values(eval(option1))[0]?.option_key &&
                    (Object.values(eval(option1))[0]?.field_type ===
                      'sub_headings' ||
                      Object.values(eval(option1))[0]?.field_type ===
                        'headings' ||
                      Object.values(eval(option1))[0]?.field_type ===
                        'text_headings')
                  ) {
                    data[ele1][
                      `${
                        Object.values(eval(option1))[0]?.field_type
                      }_${inner_index}`
                    ] = Object.values(eval(option1))[0]?.field_label;
                  }
                });
              }
            );
          }
        });
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (location?.state?.id) {
      let formData1 = {};
      Object.keys(formData)?.map((editFormData) => {
        if (!formData1[editFormData]) formData1[editFormData] = {};
        formData[editFormData]?.map((inner_editFormData) => {
          formData1[editFormData][`${inner_editFormData?.field_name}`] =
            fieldData?.fields[inner_editFormData?.field_name];
        });
      });

      const newErrors = DynamicFormValidation(
        formData1,
        formData,
        signatories,
        localStorage.getItem('user_role') === 'guardian'
          ? childId
          : behalfOf || fieldData?.behalf_of,
        behalfOfFlag,
        signatureAccessFlag,
        currentForm
      );

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setErrorFocus(Object.keys(newErrors)[0]);
        document.getElementById(Object.keys(newErrors)[0])?.focus();
      } else {
        setIsSubmitDisabled('disabled');
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
            updated: true,
            updatedBy: localStorage.getItem('user_id'),
          }),
          redirect: 'follow',
        };
        fetch(`${BASE_URL}/form/form_data`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            setIsSubmitDisabled('');
            navigate(`/form/response/${location.state.form_id}`, {
              state: { message: result.message },
            });
          });
      }
    } else {
      let formDataVal = formData[''];
      let formDataObj = {};
      formDataVal?.forEach((item, index) => {
        if (
          item?.field_type === 'sub_headings' ||
          item?.field_type === 'headings' ||
          item?.field_type === 'text_headings'
        ) {
          if (!formDataObj[`${`${item?.field_type}_${index}`} ${index}`]) {
            formDataObj[`${`${item?.field_type}_${index}`} ${index}`] =
              item?.field_label;
          }
        }
      });

      // return;

      // let newFormObj = copyOneStateToAnother(form);
      let orderedObject = {};
      let finalizedObject = {
        '': {},
      };
      let defaultFormData = formattedFormData(formData['']);
      // return;
      let newDataObj = tempFormData[''];
      let data = {};

      Object?.keys(newDataObj)?.forEach((item) => {
        if (!(newDataObj[item] === 'undefined')) {
          data[item] = newDataObj[item];
        }
      });

      data = { ...defaultFormData, ...data, ...formDataObj };
      Object?.keys(data)?.forEach((item, index) => {
        let info = item?.split(' ');
        let parent_key = info?.[0];
        let isParent = info?.length === 2 ? true : false;
        if (!isParent) {
          parent_key = info?.[1];
        }
        let order_index = info?.pop();
        if (parent_key !== 'undefined') {
          if (!orderedObject[`${order_index} ${parent_key}`]) {
            orderedObject[`${order_index} ${parent_key}`] = {
              [info?.[0]]: data[item],
            };
          } else {
            orderedObject[`${order_index} ${parent_key}`] = {
              ...orderedObject[`${order_index} ${parent_key}`],
              [info?.[0]]: data[item],
            };
          }
        }
      });

      let unsortedKeyArray = Object.keys(orderedObject);
      unsortedKeyArray = unsortedKeyArray?.map((item) =>
        parseInt(item?.split(' ')?.[0])
      );

      unsortedKeyArray = unsortedKeyArray?.sort();
      let tempObj = {};
      Object?.keys(orderedObject)?.forEach((item) => {
        if (orderedObject[item]) {
          if (!tempObj[item?.split(' ')?.[0]]) {
            tempObj[item?.split(' ')?.[0]] = orderedObject[item];
          } else {
            let index = Object.keys(tempObj)?.length + 1;
            tempObj[index] = orderedObject[item];
          }
        }
      });

      orderedObject = {};
      unsortedKeyArray = Object.keys(tempObj);
      unsortedKeyArray?.forEach((item) => {
        orderedObject[item] = tempObj[item];
      });

      Object?.keys(orderedObject)?.forEach((item, index) => {
        finalizedObject[''] = {
          ...finalizedObject[''],
          ...orderedObject[item],
        };
      });

      let form_payload_data = finalizedObject;

      const newErrors = DynamicFormValidation(
        form_payload_data,
        formData,
        signatories,
        localStorage.getItem('user_role') === 'guardian' ? childId : behalfOf,
        behalfOfFlag,
        signatureAccessFlag,
        currentForm
      );

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setErrorFocus(Object.keys(newErrors)[0]);
        document.getElementById(Object.keys(newErrors)[0])?.focus();
      } else {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('authorization', 'Bearer ' + token);

        setIsSubmitDisabled('disabled');
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify({
            form_id: formData[Object.keys(formData)[0]][0]?.form_id,
            user_id: localStorage.getItem('user_id'),
            franchisee_id: localStorage.getItem('franchisee_id') || undefined,
            behalf_of:
              localStorage.getItem('user_role') === 'guardian'
                ? !behalfOfFlag
                  ? childId
                  : behalfOf
                  ? behalfOf
                  : localStorage.getItem('user_id')
                : behalfOf
                ? behalfOf
                : localStorage.getItem('user_id'),
            selectedUserData: selectedUserValue,
            data: form_payload_data,
          }),
          redirect: 'follow',
        };
        fetch(
          `${BASE_URL}/form/form_data?role=${localStorage.getItem(
            'user_role'
          )}`,
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => {
            setIsSubmitDisabled('');
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

  useEffect(() => {
    if (localStorage.getItem('user_role') === 'guardian') {
      let userObj = targetUser.filter(
        (d) =>
          parseInt(d.id) === parseInt(localStorage.getItem('selectedChild'))
      );
      setSelectedUserValue({
        id: userObj[0]?.id,
        role: 'child',
      });
    }
  }, [targetUser, localStorage.getItem('selectedChild')]);

  useEffect(() => {
    let user_id = localStorage.getItem('user_id');
    let details =
      formDataVal?.[selectedUserValue?.id] || formDataVal?.[user_id] || {};
    let tempDetails = {};
    let fData = {};

    if (Object.keys(details)?.length > 0) {
      let dataKeys = Object?.keys(formData);
      dataKeys?.forEach((item) => {
        let innerData = formData?.[item];
        innerData = innerData?.map((inner_item) => {
          let keys = Object?.keys(inner_item);
          let valObj = {};

          keys?.forEach((item) => {
            if (
              details?.[inner_item?.['field_name']] &&
              !inner_item.form_field_permissions?.[0].fill_access_users?.includes(
                localStorage.getItem('user_role') === 'guardian'
                  ? 'parent'
                  : localStorage.getItem('user_role')
              )
            ) {
              valObj['field_value'] = details?.[inner_item?.['field_name']];
              tempDetails[inner_item?.['field_name']] =
                details?.[inner_item?.['field_name']];

              if (inner_item?.option) {
                let item = eval(inner_item?.option);
                item?.map((item) => {
                  let key = Object?.keys(item);
                  if (details[item?.[key]?.field_name]) {
                    tempDetails[item?.[key]?.field_name] =
                      details[item?.[key]?.field_name];
                  }
                });
              }
            }
          });

          return {
            ...inner_item,
            ...valObj,
          };
        });
        setFormFieldDetails(tempDetails);
        fData[item] = innerData;
      });
    } else {
      let dataKeys = Object?.keys(formData);
      setFormFieldDetails(details || {});
      dataKeys?.forEach((item) => {
        let innerData = formData?.[item];
        innerData = innerData?.map((inner_item) => {
          delete inner_item['field_value'];

          return {
            ...inner_item,
          };
        });
        fData[item] = innerData;
      });
    }

    if (Object?.keys(fData)?.length > 0) {
      setFormData(fData);
    }

    setFieldData({});
  }, [selectedUserValue, localStorage?.getItem('user_id')]);

  useEffect(() => {
    if (Object?.keys(selectedUserValue)?.length === 0) {
      let user_id = localStorage.getItem('user_id');
      let details = formDataVal?.[user_id] || {};
      let tempDetails = {};
      let fData = {};

      if (Object.keys(details)?.length > 0) {
        let dataKeys = Object?.keys(formData);
        dataKeys?.forEach((item) => {
          let innerData = formData?.[item];
          innerData = innerData?.map((inner_item) => {
            let keys = Object?.keys(inner_item);
            let valObj = {};

            keys?.forEach((item) => {
              if (
                details?.[inner_item?.['field_name']] &&
                !inner_item.form_field_permissions?.[0].fill_access_users?.includes(
                  localStorage.getItem('user_role') === 'guardian'
                    ? 'parent'
                    : localStorage.getItem('user_role')
                )
              ) {
                valObj['field_value'] = details?.[inner_item?.['field_name']];
                tempDetails[inner_item?.['field_name']] =
                  details?.[inner_item?.['field_name']];

                if (inner_item?.option) {
                  let item = eval(inner_item?.option);
                  item?.map((item) => {
                    let key = Object?.keys(item);
                    if (details[item?.[key]?.field_name]) {
                      tempDetails[item?.[key]?.field_name] =
                        details[item?.[key]?.field_name];
                    }
                  });
                }
              }
            });

            return {
              ...inner_item,
              ...valObj,
            };
          });
          setFormFieldDetails(tempDetails);
          fData[item] = innerData;
        });
      } else {
        let dataKeys = Object?.keys(formData);
        setFormFieldDetails(details || {});
        dataKeys?.forEach((item) => {
          let innerData = formData?.[item];
          innerData = innerData?.map((inner_item) => {
            delete inner_item['field_value'];

            return {
              ...inner_item,
            };
          });
          fData[item] = innerData;
        });
      }

      if (Object?.keys(fData)?.length > 0) {
        setFormData(fData);
      }

      setFieldData({});
    }

    // setFieldData({});
  }, [formDataVal]);

  return (
    <>
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
                          {(behalfOfFlag = true)}
                          <div className="child_info_field sex">
                            <span className="form-label">Name:</span>
                            {/* <span className="form-label">Behalf of:</span> */}
                            <div clas Name="d-flex mt-2"></div>
                            <div className="btn-radio d-flex align-items-center">
                              {localStorage.getItem('user_role') ===
                              'guardian' ? (
                                <Form.Select
                                  name={'behalf_of'}
                                  id="behalf_of"
                                  onChange={(e) => {
                                    setBehalfOf(e.target.value.split(' ')[0]);
                                    setSelectedUserValue({
                                      id: e.target.value.split(' ')[0],
                                      role: e.target.value.split(' ')[1],
                                    });
                                    if (e.target.value !== '') {
                                      let errorData = { ...errors };
                                      errorData['behalf_of'] = null;
                                      setErrors(errorData);
                                    }
                                  }}
                                  disabled
                                >
                                  {formPermission?.target_user?.includes(
                                    'parent'
                                  )
                                    ? (behalfOfFlag = true)
                                    : (behalfOfFlag = false)}
                                  <option value="">Select</option>
                                  {targetUser?.map((item, index) => {
                                    return (
                                      <>
                                        {item.id === parseInt(childId) ? (
                                          <option
                                            value={`${item.id} ${
                                              item.role || 'child'
                                            }`}
                                            selected
                                            key={index}
                                          >
                                            {item.child
                                              ? `${item?.fullname} ${item.family_name}`
                                              : `${item.fullname} (${item.email})`}
                                          </option>
                                        ) : (
                                          <option
                                            value={`${item.id} ${
                                              item.role || 'child'
                                            }`}
                                            key={index}
                                          >
                                            {item.child
                                              ? `${item?.fullname} ${item.family_name}`
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
                                    setBehalfOf(e.target.value.split(' ')[0]);
                                    setSelectedUserValue({
                                      id: e.target.value.split(' ')[0],
                                      role: e.target.value.split(' ')[1],
                                    });
                                    if (e.target.value !== '') {
                                      let errorData = { ...errors };
                                      errorData['behalf_of'] = null;
                                      setErrors(errorData);
                                    }
                                  }}
                                  disabled
                                >
                                  {formPermission?.target_user?.includes(
                                    'parent'
                                  )
                                    ? (behalfOfFlag = true)
                                    : (behalfOfFlag = false)}
                                  <option value="">Select</option>
                                  {targetUser?.map((item, index) => {
                                    // console.log('ITEM>>>>>>>>>>>>',   item);
                                    return (
                                      <>
                                        {item?.id === fieldData?.behalf_of ? (
                                          <option
                                            value={`${item.id} ${
                                              item.role || 'child'
                                            }`}
                                            selected
                                            key={index}
                                          >
                                            {item?.child
                                              ? `${item?.fullname} ${item.family_name}`
                                              : `${item?.fullname} (${item?.email})`}
                                          </option>
                                        ) : (
                                          <option
                                            value={`${item.id} ${
                                              item.role || 'child'
                                            }`}
                                            key={index}
                                          >
                                            {item?.child
                                              ? `${item?.fullname} ${item.family_name}`
                                              : `${item?.fullname} (${item?.email})`}
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
                                    setBehalfOf(e.target.value.split(' ')[0]);
                                    setSelectedUserValue({
                                      id: e.target.value.split(' ')[0],
                                      role: e.target.value.split(' ')[1],
                                    });
                                    if (e.target.value !== '') {
                                      let errorData = { ...errors };
                                      errorData['behalf_of'] = null;
                                      setErrors(errorData);
                                    }
                                  }}
                                  isInvalid={!!errors.behalf_of}
                                >
                                  <option value="">Select</option>
                                  {targetUser?.map((item, index) => {
                                    // console.log('ITEM>>>>>>>>>>>>>', item);
                                    return (
                                      <>
                                        {(parseInt(
                                          localStorage.getItem('franchisee_id')
                                        ) === item.franchisee_id ||
                                          localStorage.getItem('user_role') ===
                                            'franchisor_admin' ||
                                          localStorage.getItem('user_role') ===
                                            'educator') && (
                                          <option
                                            value={`${item.id} ${
                                              item.role || 'child'
                                            }`}
                                            key={index}
                                          >
                                            {item.child
                                              ? `${item.fullname} ${item.family_name}`
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
                    {Object.keys(formData)?.map((item, index) => {
                      return item ? (
                        <>
                          {formData[item]?.map((inner_item, inner_index) => {
                            return inner_item.form_field_permissions.length >
                              0 ? (
                              // inner_item.form_field_permissions[0].fill_access_users?.includes(
                              //   localStorage.getItem('user_role') === 'guardian'
                              //     ? 'parent'
                              //     : localStorage.getItem('user_role')
                              // ) ? (
                              //   <>
                              //     <InputFields
                              //       {...inner_item}
                              //       dataKey={'1'}
                              //       signature_flag={signatureAccessFlag}
                              //       diff_index={inner_index}
                              //       field_data={fieldData}
                              //       setFieldData={setFieldData}
                              //       error={errors}
                              //       errorFocus={errorFocus}
                              //       onChange={(key, value, type) => {
                              //         setField({
                              //           field_index: inner_index,
                              //           section: '',
                              //           field: key,
                              //           value: value,
                              //           type: type,
                              //         });
                              //       }}
                              //       freshForm={true}
                              //       currentForm={currentForm}
                              //     />
                              //   </>
                              // ) : (
                              //   (
                              //     inner_item.form_field_permissions[0]
                              //       .fill_access_users || []
                              //   ).includes(
                              //     localStorage.getItem('user_role') ===
                              //       'guardian'
                              //       ? 'parent'
                              //       : localStorage.getItem('user_role')
                              //   ) && (
                              //     <>
                              //       {index === 0 && (
                              //         <h6 className="text-capitalize">
                              //           {item.split('_').join(' ')}
                              //         </h6>
                              //       )}
                              //       <InputFields
                              //         {...inner_item}
                              //         dataKey={'2'}
                              //         signature_flag={signatureAccessFlag}
                              //         diff_index={inner_index}
                              //         error={errors}
                              //         errorFocus={errorFocus}
                              //         onChange={(key, value, type) => {
                              //           setField({
                              //             field_index: inner_index,
                              //             section: item,
                              //             field: key,
                              //             value: value,
                              //             type: type,
                              //           });
                              //         }}
                              //         currentForm={currentForm}
                              //       />
                              //     </>
                              //   )
                              // )
                              <>
                                <InputFields
                                  {...inner_item}
                                  dataKey={'1'}
                                  signature_flag={signatureAccessFlag}
                                  diff_index={inner_index}
                                  extra_data={formFieldDetails}
                                  field_data={
                                    !inner_item.form_field_permissions?.[0].fill_access_users?.includes(
                                      localStorage.getItem('user_role') ===
                                        'guardian'
                                        ? 'parent'
                                        : localStorage.getItem('user_role')
                                    )
                                      ? {
                                          fields: {
                                            [inner_item?.field_name]:
                                              inner_item?.field_value || '',
                                          },
                                        }
                                      : fieldData || fieldData
                                  }
                                  setFieldData={setFieldData}
                                  isDisable={
                                    !inner_item.form_field_permissions?.[0].fill_access_users?.includes(
                                      localStorage.getItem('user_role') ===
                                        'guardian'
                                        ? 'parent'
                                        : localStorage.getItem('user_role')
                                    )
                                  }
                                  error={errors}
                                  errorFocus={errorFocus}
                                  onChange={(key, value, type) => {
                                    setField({
                                      field_index: inner_index,
                                      section: '',
                                      field: key,
                                      value: value,
                                      type: type,
                                    });
                                  }}
                                  freshForm={true}
                                  currentForm={currentForm}
                                />
                              </>
                            ) : location?.state?.id ? (
                              <InputFields
                                {...inner_item}
                                dataKey={'3'}
                                signature_flag={signatureAccessFlag}
                                diff_index={inner_index}
                                extra_data={formFieldDetails}
                                field_data={
                                  !inner_item.form_field_permissions?.[0].fill_access_users?.includes(
                                    localStorage.getItem('user_role') ===
                                      'guardian'
                                      ? 'parent'
                                      : localStorage.getItem('user_role')
                                  )
                                    ? {
                                        fields: {
                                          [inner_item?.field_name]:
                                            inner_item?.field_value || '',
                                        },
                                      }
                                    : fieldData || fieldData
                                }
                                setFieldData={setFieldData}
                                error={errors}
                                errorFocus={errorFocus}
                                onChange={(key, value, type) => {
                                  setField({
                                    field_index: inner_index,
                                    section: '',
                                    field: key,
                                    value: value,
                                    type: type,
                                  });
                                }}
                                currentForm={currentForm}
                              />
                            ) : (
                              <InputFields
                                {...inner_item}
                                dataKey={'4'}
                                signature_flag={signatureAccessFlag}
                                error={errors}
                                diff_index={inner_index}
                                errorFocus={errorFocus}
                                onChange={(key, value, type) => {
                                  setField({
                                    field_index: inner_index,
                                    section: '',
                                    field: key,
                                    value: value,
                                    type: type,
                                  });
                                }}
                                currentForm={currentForm}
                              />
                            );
                          })}
                        </>
                      ) : (
                        formData[item]?.map((inner_item, inner_index) => {
                          return location?.state?.id ? (
                            <InputFields
                              {...inner_item}
                              signature_flag={signatureAccessFlag}
                              extra_data={formFieldDetails}
                              field_data={
                                !inner_item.form_field_permissions?.[0].fill_access_users?.includes(
                                  localStorage.getItem('user_role') ===
                                    'guardian'
                                    ? 'parent'
                                    : localStorage.getItem('user_role')
                                )
                                  ? {
                                      fields: {
                                        [inner_item?.field_name]:
                                          inner_item?.field_value || '',
                                      },
                                    }
                                  : fieldData || fieldData
                              }
                              dataKey={'5'}
                              setFieldData={setFieldData}
                              diff_index={inner_index}
                              error={errors}
                              errorFocus={errorFocus}
                              onChange={(key, value, type) => {
                                setField({
                                  field_index: inner_index,
                                  section: '',
                                  field: key,
                                  value: value,
                                  type: type,
                                });
                              }}
                              currentForm={currentForm}
                            />
                          ) : (
                            <InputFields
                              {...inner_item}
                              dataKey={'6'}
                              signature_flag={signatureAccessFlag}
                              diff_index={inner_index}
                              error={errors}
                              errorFocus={errorFocus}
                              onChange={(key, value, type) => {
                                setField({
                                  field_index: inner_index,
                                  section: item,
                                  field: key,
                                  value: value,
                                  type: type,
                                });
                              }}
                              freshForm={true}
                              currentForm={currentForm}
                            />
                          );
                        })
                      );
                    })}

                    <Col md={12}>
                      <div className="d-flex justify-content custom_submit">
                        <Button
                          className={`custom_submit_button w-auto ml-auto mr-auto d-block ${isSubmitDisabled}`}
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

      {inactiveFormPopup && (
        <Modal show={inactiveFormPopup}>
          <Modal.Header>
            <Modal.Title>Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              The Form isn't ready to be filled yet. You can start filling the
              form on {formatDate(formFillingDate)}, from{' '}
              {formatTime(formFillingTime)} onwards.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button className="modal-button" onClick={handleGoBack}>
              Go Back
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default DynamicForm;
