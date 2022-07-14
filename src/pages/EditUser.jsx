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
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../components/App';
import { Link } from 'react-router-dom';
import moment from 'moment';

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

const EditUser = () => {
  const { userId } = useParams();
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
  const [coordinatorData, setCoordinatorData] = useState([]);
  const [trainingCategoryData, setTrainingCategoryData] = useState([]);
  const [pdcData, setPdcData] = useState([]);
  const [businessAssetData, setBuinessAssetData] = useState([]);
  const [trainingDocuments, setTrainingDocuments] = useState();
  const [editUserData, setEditUserData] = useState();

  // IMAGE CROPPING STATES
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  // FETCHES THE DATA OF USER FOR EDITING
  const fetchEditUserData = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/auth/user/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if(response.status === 200 && response.data.status === "success") {
      const { user } = response.data;
      setEditUserData(user);
    }
  };

  const copyDataToState = () => {
    setFormData(prevState => ({
      fullname: editUserData?.fullname,

      role: editUserData?.role,
      roleObj:userRoleData.filter(d => d.value === editUserData.role),
      
      city: editUserData?.city,
      address: editUserData?.address,
      postalCode: editUserData?.postalCode,
      email: editUserData?.email,
      telcode: editUserData?.phone.split("-")[0],
      phone: editUserData?.phone.split("-")[1],
      
      trainingCategories: editUserData?.training_categories?.map(d => parseInt(d)),
      trainingCategoriesObj: trainingCategoryData?.filter(category => editUserData?.training_categories?.includes(category.id + "")),

      professionalDevCategories: editUserData?.professional_development_categories?.map(d => parseInt(d)),
      professionalDevCategoriesObj: pdcData?.filter(user => editUserData?.professional_development_categories.includes(user.id + "")),

      coordinator: editUserData?.coordinator,

      businessAssets: editUserData?.business_assets?.map(d => parseInt(d)),
      businessAssetsObj: businessAssetData?.filter(user => editUserData?.business_assets.includes(user.id + '')),
      
      terminationDate: moment(editUserData?.termination_date).format('YYYY-MM-DD')
    }));
  }

  // CREATES NEW USER INSIDE THE DATABASE
  const updateUserDetails = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${BASE_URL}/auth/user/${userId}`, formData, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.status === 'success') {
      localStorage.setItem('success_msg', 'User updated successfully!');
      window.location.href = '/user-management';
    } else if (response.status === 200 && response.data.status === 'fail') {
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
    updateUserDetails();
  };

  const fetchCoordinatorData = async () => {
    if (selectedFranchisee) {
      let franchisee_alias = selectedFranchisee.split(",")[0].split(" ").map(data => data.charAt(0).toLowerCase() + data.slice(1)).join("_");
      
      console.log('SELECTED FRANCHISEE ALIAS:', franchisee_alias);
      const response = await axios.get(`${BASE_URL}/role/franchisee/coordinator/${franchisee_alias}/coordinator`);

      if(response.status === 200 && response.data.status === "success") {
        let { coordinators } = response.data;
        setCoordinatorData(coordinators.map(coordinator => ({
          id: coordinator.id,
          value: coordinator.fullname,
          label: coordinator.fullname
        })));
      }
    }
  }

  // FETCHES COUNTRY CODES FROM THE DATABASE AND POPULATES THE DROP DOWN LIST
  const fetchCountryData = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/api/country-data`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
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
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/api/user-role`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if (response.status === 200) {
      const { userRoleList } = response.data;
      setUserRoleData(
        userRoleList.map((list) => ({
          id: list.id,
          value: list.role_name,
          label: list.role_label,
        }))
      );
    }
  };

  // FETCHES AUSTRALIAN CITIES FROM THE DATABASE AND POPULATES THE DROP DOWN LIST
  const fetchCities = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/api/cities`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
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

  const fetchTrainingCategories = async () => {
    let token = localStorage.getItem('token');
    const response = await axios.get(
      `${BASE_URL}/training/get-training-categories`,
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );
    if (response.status === 200 && response.data.status === "success") {
      const { categoryList } = response.data;
      setTrainingCategoryData([
        ...categoryList.map((data) => ({
          id: data.id,
          value: data.category_alias,
          label: data.category_name,
        })),
      ]);
    }
  };

  const fetchProfessionalDevelopementCategories = async () => {
    let token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/api/get-pdc`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    if(response.status === 200 && response.data.status === "success") {
      const { pdcList } = response.data;
      setPdcData(pdcList.map(data => ({
        id: data.id,
        value: data.category_alias,
        label: data.category_name
      })));
    }
  }; 

  const fetchBuinessAssets = async () => {
    let token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/api/get-business-assets`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    if(response.status === 200 && response.data.status === "success") {
      const { businessAssetList } = response.data;
      setBuinessAssetData(businessAssetList.map(data => ({
        id: data.id,
        value: data.asset_alias,
        label: data.asset_name
      })));
    }
  };

  useEffect(() => {
    fetchCountryData();
    fetchUserRoleData();
    fetchCities();
    fetchTrainingCategories();
    fetchProfessionalDevelopementCategories();
    fetchBuinessAssets();
    fetchEditUserData();
  }, []);

  useEffect(() => {
    copyDataToState();
  }, [editUserData]);

  useEffect(() => {
    fetchCoordinatorData();
  }, [selectedFranchisee]);

  editUserData && console.log('EDIT USER DATA:',editUserData);
  formData && console.log('FORM DATA:', formData);
  businessAssetData && console.log('BUSINESS ASSET:', businessAssetData);
  businessAssetData && console.log('BUSINESS ASSET:', businessAssetData);
  formData && console.log('BUSINESS:', formData.businessAssets);
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
                    <h1 className="title-lg">Edit User</h1>
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
                              value={formData?.fullname}
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
                              value={formData.roleObj}
                              options={userRoleData}
                              onChange={(e) =>
                                setFormData((prevState) => ({
                                  ...prevState,
                                  role: e.value,
                                  roleObj: e
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
                              value={formData.address}
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
                              value={formData.postalCode}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          
                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              placeholder="Enter Your Email ID"
                              value={formData.email}
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
                              value={formData.trainingCategoriesObj}
                              options={trainingCategoryData}
                              onChange={(selectedOptions) => {
                                setFormData((prevState) => ({
                                  ...prevState,
                                  trainingCategories: [...selectedOptions.map(d => parseInt(d.id))],
                                  trainingCategoriesObj: selectedOptions
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
                              value={formData.professionalDevCategoriesObj}
                              options={pdcData}
                              onChange={(selectedOptions) => {
                                setFormData((prevState) => ({
                                  ...prevState,
                                  professionalDevCategories: [...selectedOptions.map(d => parseInt(d.id))],
                                  professionalDevCategoriesObj: selectedOptions
                                }));
                              }}
                            />
                          </Form.Group>
                          
                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Select Primary Co-ordinator</Form.Label>
                            <Select
                              isDisabled={formData.role !== 'educator'}
                              placeholder={formData.role === 'educator' ? "Which Co-ordinator?" : "disabled"}
                              closeMenuOnSelect={true}
                              options={coordinatorData}
                              onChange={(e) =>
                                setFormData((prevState) => ({
                                  ...prevState,
                                  coordinator: e.id,
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
                              value={formData.businessAssetsObj}
                              options={businessAssetData}
                              onChange={(selectedOptions) => {
                                setFormData((prevState) => ({
                                  ...prevState,
                                  businessAssets: [...selectedOptions.map(d => parseInt(d.id))],
                                  businessAssetsObj: selectedOptions
                                }));
                              }}
                            />
                          </Form.Group>
                          
                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Termination Date</Form.Label>
                            <Form.Control
                              type="date"
                              name="terminationDate"
                              value={formData.terminationDate}
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

export default EditUser;
