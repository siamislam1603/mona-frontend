import axios from 'axios';
import ImageCropPopup from '../components/ImageCropPopup/ImageCropPopup';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Col, Container, Row, Form, Modal } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import DragDropSingle from '../components/DragDropSingle';
import DragDropMultiple from '../components/DragDropMultiple';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import validateForm from '../helpers/validateForm';
import { BASE_URL } from '../components/App';
import { Link } from 'react-router-dom';
import { UserFormValidation } from '../helpers/validation';
import * as ReactBootstrap from 'react-bootstrap';

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
  const [formData, setFormData] = useState({
    fullname: "",
    role: "",
    city: "",
    address: "",
    postalCode: "",
    email: "",
    phone: "",
    trainingCategories: "",
    professionalDevCategories: "",
    coordinator: "",
    businessAssets: "",
    terminationDate: "",
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

  // IMAGE CROPPING STATES
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [createUserModal, setCreateUserModal] = useState(false);

  // CREATES NEW USER INSIDE THE DATABASE
  const createUser = async (data) => {
    const token = localStorage.getItem('token');
    // const response = await axios.post(`${BASE_URL}/auth/signup`, {...formData, franchisee: selectedFranchisee || 'Alphabet Kids, Armidale'}, {
    //   headers: {
    //     "Authorization": `Bearer ${token}`
    //   }
    // });

    const response = await axios.post(`${BASE_URL}/auth/signup`, data, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if(response.status === 201 && response.data.status === "success") {
      setLoader(false);
      setCreateUserModal(false);
      localStorage.setItem('success_msg', 'User created successfully!');
      window.location.href="/user-management";

    } else if(response.status === 200 && response.data.status === "fail") {
      setLoader(false);
      setCreateUserModal(false);
      let { errorObject } = response.data;
      errorObject.map(error => setFormErrors(prevState => ({
          ...prevState,
          [error.error_field]: error.error_msg
      })));
    }
    // if (response.status === 201) {
    //   localStorage.setItem('token', response.data.accessToken);
    //   window.location.href = '/user-management';
    // } else if (response.status === 201 && response.data.status === 'fail') {
    //   console.log('MESSAGE:', response, data.msg);
    //   setTopErrorMessage(response.data.msg);
    // }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const handleSubmit = async(event) => {
    event.preventDefault();
    console.log("trainingDocuments---->",trainingDocuments);
    let doc=[];
    trainingDocuments?.map(async(item)=>{
      const blob=await fetch(await toBase64(item)).then((res) => res.blob());
      doc.push(blob);
    })
    console.log("trainingDocuments---->123",doc);
    const blob = await fetch(croppedImage.getAttribute('src')).then((res) => res.blob());
    doc.push(blob);
    let data=new FormData();
    Object.keys(formData)?.map((item,index)=>{
      data.append(item,Object.values(formData)[index]);
    })
    
    data.append("image",doc);
    data.append("franchisee",selectedFranchisee || 'Alphabet Kids, Armidale')
    let errorObject = UserFormValidation(formData);

    if(Object.keys(errorObject).length > 0) {
        console.log(errorObject);
        setFormErrors(errorObject);
    } else {
        console.log('CREATING USER!');
        setCreateUserModal(true);
        setLoader(true)
        createUser(data);
    }
    
    createUser(data);
  };

  const fetchCoordinatorData = async () => {
    if (selectedFranchisee) {
      let franchisee_alias = selectedFranchisee.split(",")[0].split(" ").map(data => data.charAt(0).toLowerCase() + data.slice(1)).join("_");
      
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
      let newRoleList = userRoleList.filter(role => role.role_name !== 'franchisor_admin');
      setUserRoleData(
        newRoleList.map((list) => ({
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
  }, []);

  useEffect(() => {
    fetchCoordinatorData();
  }, [selectedFranchisee])

  // formData && console.log('FORM DATA:', formData);
  // trainingDocuments && console.log('TRAINING DOCUMENTS:', trainingDocuments);
  croppedImage && console.log('CROPPED IMAGE:', croppedImage);

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
                              onChange={(e) => {
                                handleChange(e);
                                setFormErrors(prevState => ({
                                  ...prevState,
                                  fullname: null
                                }));
                              }}
                            />
                            { formErrors.fullname !== null && <span className="error">{formErrors.fullname}</span> }
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>User Role</Form.Label>
                            <Select
                              placeholder="Which Role?"
                              closeMenuOnSelect={true}
                              options={userRoleData}
                              onChange={(e) => {
                                setFormData((prevState) => ({
                                  ...prevState,
                                  role: e.value,
                                }));

                                setFormErrors(prevState => ({
                                  ...prevState,
                                  role: null
                                }));
                              }}
                            />
                            { formErrors.role !== null && <span className="error">{formErrors.role}</span> }
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>City</Form.Label>
                            <Select
                              placeholder="Which Suburb?"
                              closeMenuOnSelect={true}
                              options={cityData}
                              onChange={(e) => {
                                setFormData((prevState) => ({
                                  ...prevState,
                                  city: e.value,
                                }));

                                setFormErrors(prevState => ({
                                  ...prevState,
                                  city: null
                                }));
                              }}
                            />
                            { formErrors.city !== null && <span className="error">{formErrors.city}</span> }
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                              type="text"
                              name="address"
                              placeholder="Enter Your Address"
                              value={formData.address ?? ''}
                              onChange={(e) => {
                                handleChange(e);
                                setFormErrors(prevState => ({
                                  ...prevState,
                                  address: null
                                }));
                              }}
                            />
                            { formErrors.address !== null && <span className="error">{formErrors.address}</span> }
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control
                              type="number"
                              name="postalCode"
                              placeholder="Your Postal Code"
                              value={formData.postalCode ?? ''}
                              onChange={(e) => {
                                handleChange(e);
                                setFormErrors(prevState => ({
                                  ...prevState,
                                  postalCode: null
                                }));
                              }}
                            />
                            { formErrors.postalCode !== null && <span className="error">{formErrors.postalCode}</span> }
                            { formErrors.postalcodeLength !== null && <span className="error">{formErrors.postalcodeLength}</span> }
                          </Form.Group>
                          
                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              placeholder="Enter Your Email ID"
                              value={formData.email ?? ''}
                              onChange={(e) => {
                                handleChange(e);
                                setFormErrors(prevState => ({
                                  ...prevState,
                                  email: null
                                }));
                              }}
                            />
                            { formErrors.email !== null && <span className="error">{formErrors.email}</span> }
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
                                onChange={(e) => {
                                  handleChange(e);
                                  setFormErrors(prevState => ({
                                    ...prevState,
                                    phone: null
                                  }));
                                }}
                              />
                            </div>
                            { formErrors.phone !== null && <span className="error">{formErrors.phone}</span> }
                          </Form.Group>
                          
                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Training Categories</Form.Label>
                            <Select
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              isMulti
                              options={trainingCategoryData}
                              onChange={(selectedOptions) => {
                                setFormData((prevState) => ({
                                  ...prevState,
                                  trainingCategories: [...selectedOptions.map(option => option.id + "")]
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
                              options={pdcData}
                              onChange={(selectedOptions) => {
                                setFormData((prevState) => ({
                                  ...prevState,
                                  professionalDevCategories: [...selectedOptions.map(option => option.id + "")]
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
                              onChange={(e) => {
                                setFormData((prevState) => ({
                                  ...prevState,
                                  coordinator: e.id,
                                }));
                              }}
                            />
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Business Assets</Form.Label>
                            <Select
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              isMulti
                              options={businessAssetData}
                              onChange={(selectedOptions) => {
                                setFormData((prevState) => ({
                                  ...prevState,
                                  businessAssets: [...selectedOptions.map(option => option.id + "")]
                                }));
                              }}
                            />
                          </Form.Group>
                          
                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Termination Date</Form.Label>
                            <Form.Control
                              type="date"
                              name="terminationDate"
                              onChange={(e) => {
                                handleChange(e);
                                setFormErrors(prevState => ({
                                  ...prevState,
                                  terminationDate: null
                                })); 
                              }}
                            />
                            { formErrors.terminationDate !== null && <span className="error">{formErrors.terminationDate}</span> }
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
        {
                createUserModal && 
                <Modal
                show={createUserModal}
                onHide={() => setCreateUserModal(false)}>
                    <Modal.Header>
                        <Modal.Title>
                        Creating User
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="create-training-modal" style={{ textAlign: 'center' }}>
                        <p>User is being created!</p>
                        <p>Please Wait...</p>
                        </div>
                    </Modal.Body>

                    <Modal.Footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {
                        loader === true && <div>
                        <ReactBootstrap.Spinner animation="border" />
                        </div>
                    }
                    </Modal.Footer>
                </Modal>
            }
      </div>
    </>
  );
};

export default NewUser;
