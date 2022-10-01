import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import TopHeader from '../../components/TopHeader';
import LeftNavbar from '../../components/LeftNavbar';
import InputFields from '../InputFields';
import { BASE_URL } from '../../components/App';
import { FullLoader } from '../../components/Loader';
let values = [];
const Preview = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState({});
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);
  const [form, setForm] = useState({});
  const token = localStorage.getItem('token');
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
    getFormFields();
  }, []);
  const getFormFields = async () => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };

    fetch(
      `${BASE_URL}/field?form_name=${encodeURIComponent(
        location.pathname
          .split('/')
          [location.pathname.split('/').length - 1].replaceAll('%20', ' ')
      )
        .toString()
        .trim()}`,

      // )}&formId=${formId}`, need form id here
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        let res = JSON.parse(result);
        setFormData(res.result);
        setRole(res.created_by.role);
        setName(res.created_by.name);
        console.log(res.result);
        if (result) {
          setfullLoaderStatus(false);
        }
      })
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
                <TopHeader />
                <FullLoader loading={fullLoaderStatus} />
                <Row className="previewTitle">
                  <div className="forms-managment-left new-form-title mynewForm-heading">
                    <Button
                      onClick={() => {
                        navigate('/form/field/add', {
                          state: {
                            id: location?.state?.id,
                            form_name: location?.state?.form_name,
                          },
                        });
                      }}
                    >
                      <img src="../../img/back-arrow.svg" />
                    </Button>
                    <h4 className="mynewForm text-capitalize">{`Preview - ${location.pathname
                      .split('/')
                      [location.pathname.split('/').length - 1].replaceAll(
                        '%20',
                        ' '
                      )}`}</h4>
                  </div>
                  <div className="userBox">
                    <p>Created by:</p>
                    <div>
                      <img src="../../img/user_img.png" />
                      <div style={{ marginLeft: '18px' }}>
                        <h5>{name}</h5>
                        <p className="user-role text-capitalize">
                          {role.split('_').join(' ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Row>
                <Form>
                  <Row>
                    {formData?.map((item) => {
                      return (
                        <InputFields
                          {...item}
                          signature_flag={true}
                          error={errors}
                          onChange={setField}
                        />
                      );
                    })}
                  </Row>
                </Form>
                <Button
                  variant="transparent"
                  className="me-3"
                  onClick={() => {
                    navigate('/form/field/add', {
                      state: {
                        id: location?.state?.id,
                        form_name: location?.state?.form_name,
                      },
                    });
                  }}>
                  Edit
                </Button>
                <Button  onClick={()=>{
                  navigate('/form', {
                    state: {
                      message: 'Form added successfully.',
                      form_template: true,
                    },
                  });
                }}>Save</Button>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default Preview;
