import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Form } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import DragDropSingle from '../components/DragDropSingle';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import validateForm from '../helpers/validateForm';
import ImageCropper from '../components/ImageCropper';
import Popup from '../components/Popup';
import { BASE_URL } from '../components/App';
import { Link } from 'react-router-dom';

const animatedComponents = makeAnimated();

const training = [
  {
    value: 'by-companies',
    label: 'By Companies',
  },
  {
    value: 'by-round',
    label: 'By Round',
  },
];

const NewUser = () => {
  const [formErrors, setFormErrors] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [formData, setFormData] = useState({
    city: 'Sydney',
    phone: '',
    role: '',
    telcode: '+61',
  });
  const [countryData, setCountryData] = useState([]);
  const [userRoleData, setUserRoleData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(undefined);
  const [croppedImage, setCroppedImage] = useState(undefined);
  const [topErrorMessage, setTopErrorMessage] = useState('');
  const [selectedFranchisee, setSelectedFranchisee] = useState();

  // CREATES NEW USER INSIDE THE DATABASE
  const createUser = async (data) => {
    const response = await axios.post(`${BASE_URL}/auth/signup`, data);
    if (response.status === 201) {
      localStorage.setItem('token', response.data.accessToken);
      window.location.href = '/user-management';
    } else if (response.status === 201 && response.data.status === 'fail') {
      console.log('MESSAGE:', response, data.msg);
      setTopErrorMessage(response.data.msg);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormErrors(validateForm(formData));
    setIsSubmit(true);
  };

  const onUploadFile = (files) => {
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        return setImageToCrop(reader.result);
      });

      reader.readAsDataURL(files[0]);
    }
  };

  const setCroppedImageInPopup = () => {
    if (croppedImage) {
      setImageToCrop(croppedImage.croppedImageURL);
      setFormData((prevData) => ({
        ...prevData,
        file: croppedImage.croppedImageURL,
      }));
    }
  };

  // FETCHES COUNTRY CODES FROM THE DATABASE AND POPULATES THE DROP DOWN LIST
  const fetchCountryData = async () => {
    const response = await axios.get(`${BASE_URL}/api/country-data`);
    if (response.status === 200) {
      const { countryDataList } = response.data;
      setCountryData(
        countryDataList.map((countryData) => ({
          value: `${countryData.name}\n${countryData.dial_code}`,
          label: `${countryData.name}\n${countryData.dial_code}`,
        }))
      );
    }
  };

  // FETCHES USER ROLES FROM THE DATABASE AND POPULATES THE DROP DOWN LIST
  const fetchUserRoleData = async () => {
    const response = await axios.get(`${BASE_URL}/api/user-role`);
    if (response.status === 200) {
      const { userRoleList } = response.data;
      setUserRoleData(
        userRoleList.map((list) => ({
          value: list.role_name,
          label: list.role_label,
        }))
      );
    }
  };

  // FETCHES AUSTRALIAN CITIES FROM THE DATABASE AND POPULATES THE DROP DOWN LIST
  const fetchCities = async () => {
    const response = await axios.get(`${BASE_URL}/api/cities`);
    if (response.status === 200) {
      const { cityList } = response.data;
      setCityData(
        cityList.map((city) => ({
          value: city.name,
          label: city.name,
        }))
      );
    }
  };

  useEffect(() => {
    fetchCountryData();
    fetchUserRoleData();
    fetchCities();
  }, []);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit === true) {
      let data = new FormData();
      for (let [key, value] of Object.entries(formData)) {
        data.append(`${key}`, `${value}`);
      }

      data.append('franchisee', selectedFranchisee);

      if (imageToCrop) {
        data.append('file', croppedImage.croppedImageFILE);
        createUser(data);
      } else {
        console.log('Choose & Crop an image first!');
      }
    }
  }, [formErrors]);

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
                <TopHeader setSelectedFranchisee={setSelectedFranchisee} />
                <div className="entry-container">
                  <header className="title-head">
                    <h1 className="title-lg">New User</h1>
                  </header>
                  <div className="maincolumn">
                    <div className="new-user-sec">
                      <div className="user-pic-sec">
                        <DragDropSingle
                          imageToCrop={imageToCrop}
                          onChange={onUploadFile}
                          setPopupVisible={setPopupVisible}
                        />
                        <span className="error">
                          {!formData.file && formErrors.file}
                        </span>

                        <Popup show={popupVisible}>
                          <ImageCropper
                            imageToCrop={imageToCrop}
                            onImageCropped={(croppedImage) =>
                              setCroppedImage(croppedImage)
                            }
                          />
                          <input
                            type="submit"
                            className="popup-button"
                            value="CROP"
                            onClick={() => {
                              return (
                                setCroppedImageInPopup(), setPopupVisible(false)
                              );
                            }}
                          />
                        </Popup>
                      </div>
                      <form className="user-form" onSubmit={handleSubmit}>
                        <Row>
                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="fullname"
                              placeholder="Enter Full Name"
                              value={formData?.fullName}
                              onChange={handleChange}
                            />
                            <span className="error">
                              {!formData.fullname && formErrors.fullname}
                            </span>
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>User Role</Form.Label>
                            <Select
                              placeholder="Which Role?"
                              closeMenuOnSelect={true}
                              options={userRoleData}
                              onChange={(e) =>
                                setFormData((prevState) => ({
                                  ...prevState,
                                  role: e.value,
                                }))
                              }
                            />
                            <span className="error">
                              {!formData.role && formErrors.role}
                            </span>
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>City</Form.Label>
                            <Select
                              placeholder="Which City?"
                              closeMenuOnSelect={true}
                              options={cityData}
                              onChange={(e) =>
                                setFormData((prevState) => ({
                                  ...prevState,
                                  city: e.value,
                                }))
                              }
                            />
                            <span className="error">
                              {!formData.city && formErrors.city}
                            </span>
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                              type="text"
                              name="address"
                              placeholder="Enter Your Address"
                              value={formData.address ?? ''}
                              onChange={handleChange}
                            />
                            <span className="error">
                              {!formData.address && formErrors.address}
                            </span>
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              placeholder="Enter Your Email ID"
                              value={formData.email ?? ''}
                              onChange={handleChange}
                            />
                            <span className="error">
                              {!formData.email && formErrors.email}
                            </span>
                            {topErrorMessage && (
                              <span className="toast-error">
                                {topErrorMessage}
                              </span>
                            )}
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Contact Number</Form.Label>
                            <div className="tel-col">
                              <Select
                                closeMenuOnSelect={true}
                                placeholder="+61"
                                className="telcode"
                                options={countryData}
                                onChange={(e) =>
                                  setFormData((prevState) => ({
                                    ...prevState,
                                    telcode: e.value.split('\n')[1],
                                  }))
                                }
                              />
                              <Form.Control
                                type="tel"
                                name="phone"
                                placeholder="Enter Your Number"
                                value={formData.phone}
                                onChange={handleChange}
                              />
                            </div>
                            <span className="error">
                              {!formData.telcode ||
                                (!formData.phone && formErrors.phone)}
                            </span>
                          </Form.Group>

                          {/* <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Training Categories</Form.Label>
                            <Select
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              isMulti
                              options={training}
                              onChange={(selectedOptions) => {
                                setFormData((prevState) => ({
                                  ...prevState,
                                  trainingCategories: selectedOptions
                                }));
                              }}
                            />
                          </Form.Group> */}

                          <Col md={12}>
                            <div className="cta text-center mt-5">
                              <Button variant="transparent">
                                <Link to="/user-management">
                                  Back to All Users
                                </Link>
                              </Button>
                              <Button variant="primary" type="submit">
                                Save Details
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default NewUser;
