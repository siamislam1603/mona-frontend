import React, { useEffect, useState } from 'react';
import { Col, Container, Form, Row, Button } from 'react-bootstrap';
import { BASE_URL } from '../components/App';
import { DynamicFormValidation } from '../helpers/validation';
import InputFields from './InputFields';
import { useLocation } from 'react-router-dom';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import { getSuggestedQuery } from '@testing-library/react';
let values = [];
const DynamicForm = (props) => {
  const location = useLocation();
  console.log('location----->', location);
  const [formData, setFormData] = useState([]);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({});
  const [formPermission, setFormPermission] = useState({});
  const [targetUser, setTargetUser] = useState([]);
  const [behalfOf,setBehalfOf]=useState("");

  const setField = (field, value) => {
    setForm({ ...form, [field]: value });
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
    let api_url = `${BASE_URL}/form/target_users?form_name=${
      location.pathname.split('/')[location.pathname.split('/').length - 1]
    }&franchisee_id=${localStorage.getItem('franchisee_id')}`;

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

    fetch(
      `${BASE_URL}/field?form_name=${
        location.pathname.split('/')[location.pathname.split('/').length - 1]
      }&franchisee_id=${localStorage.getItem('franchisee_id')}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        let res = JSON.parse(result);
        setFormData(res.result);
        setFormPermission(res.form_permission);
        console.log(res.result);
      })
      .catch((error) => console.log('error', error));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const newErrors = DynamicFormValidation(form, formData);
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
          form_id: formData[0]?.form_id,
          user_id: localStorage.getItem('user_id'),
          behalf_of:behalfOf,
          data: form,
        }),
        redirect: 'follow',
      };

      fetch(`${BASE_URL}/form/form_data`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          result = JSON.parse(result);
          alert(result?.message);
        })
        .catch((error) => console.log('error', error));
    }
  };
  return (
    <>
    {console.log("formPermission--->",formPermission)}
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
                  <div className="forms-managment-left new-form-title">
                    <h6>New Form</h6>
                  </div>
                </Row>
                <Form>
                  <Row>
                    {formData?.map((item) => {
                      return (
                        <InputFields
                          {...item}
                          error={errors}
                          onChange={setField}
                        />
                      );
                    })}
                    {console.log("formPermission?.fill_access_users--->",formPermission?.fill_access_users)}
                    {!(formPermission?.fill_access_users?.includes(localStorage.getItem("user_role")) || formPermission?.fill_access_users?.includes(localStorage.getItem("user_id"))) && <Col sm={6}> 
                      <div className="child_info_field sex">
                        <span className="form-label">
                          Behalf of:
                        </span>
                        <div className="d-flex mt-2"></div>
                        <div className="btn-radio d-flex align-items-center">
                          <Form.Select
                            name={"behalf_of"}
                            onChange={(e)=>{setBehalfOf(e.target.value)}}
                          >
                            <option>Select Behalf of</option>
                            {targetUser?.map((item) => {
                              return (
                                <>
                                  <option value={item.id}>{item.email}</option>
                                </>
                              );
                            })}
                          </Form.Select>
                        </div>
                      </div>
                    </Col>}
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
