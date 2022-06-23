import axios from 'axios';
import ImageCropPopup from '../components/ImageCropPopup/ImageCropPopup';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Col, Container, Row, Form } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import DragDropCrop from '../components/DragDropCrop';
import DragDropMultiple from '../components/DragDropMultiple';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import validateForm from '../helpers/validateForm';
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
  const [topErrorMessage, setTopErrorMessage] = useState('');
  const [selectedFranchisee, setSelectedFranchisee] = useState();
  const [trainingDocuments, setTrainingDocuments] = useState();

  // IMAGE CROPPING STATES
  const [image, setImage] = useState(null);
  // const [croppedArea, setCroppedArea] = useState(null);
  // const [crop, setCrop] = useState({ x: 0, y: 0 });
  // const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  // const inputRef = useRef();

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
    // setFormErrors(validateForm(formData));
    // setIsSubmit(true);
    console.log('FORM DATA:', formData);
    console.log('TRAINING DOCUMENTS:', trainingDocuments);
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

      if (croppedImage) {
        data.append('file', croppedImage);
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
                        <DragDropCrop
                          croppedImage={croppedImage}
                          setCroppedImage={setCroppedImage}
                          onSave={setImage}
                          setPopupVisible={setPopupVisible}
                        />
                        <span className="error">
                          {!formData.file && formErrors.file}
                        </span>

                        {
                          popupVisible && 
                          <ImageCropPopup 
                            image={image} 
                            setCroppedImage={setCroppedImage} 
                            setPopupVisible={setPopupVisible} />
                        }
                        
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
                            <Form.Label>Suburb</Form.Label>
                            <Select
                              placeholder="Which Suburb?"
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
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control
                              type="number"
                              name="postalCode"
                              placeholder="Your Postal Code"
                              value={formData.postalCode ?? ''}
                              onChange={handleChange}
                            />
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
                          
                          <Form.Group className="col-md-6 mb-3">
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
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Professional Development Categories</Form.Label>
                            <Select
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              isMulti
                              // options={professionDevCategories}
                              onChange={(selectedOptions) => {
                                setFormData((prevState) => ({
                                  ...prevState,
                                  professionalDevCategories: selectedOptions
                                }));
                              }}
                            />
                          </Form.Group>
                          
                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Select Primary Co-ordinator</Form.Label>
                            <Select
                              placeholder="Which Co-ordinator?"
                              closeMenuOnSelect={true}
                              // options={coordinatorData}
                              onChange={(e) =>
                                setFormData((prevState) => ({
                                  ...prevState,
                                  coordinator: e.value,
                                }))
                              }
                            />
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Business Assets</Form.Label>
                            <Select
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              isMulti
                              // options={businessAssets}
                              onChange={(selectedOptions) => {
                                setFormData((prevState) => ({
                                  ...prevState,
                                  businessAssets: selectedOptions
                                }));
                              }}
                            />
                          </Form.Group>
                          
                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Termination Date</Form.Label>
                            <Form.Control
                              type="date"
                              name="terminationDate"
                              onChange={handleChange}
                            />
                          </Form.Group>
                          
                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Upload Training Documents</Form.Label>
                            <DragDropMultiple 
                              onSave={setTrainingDocuments} />
                          </Form.Group>

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
