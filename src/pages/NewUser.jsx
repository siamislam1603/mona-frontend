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
import { suburbData } from '../assets/data/suburbData';
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
    franchisee: "",
    open_coordinator: false,
  });
  const [countryData, setCountryData] = useState([]);
  const [userRoleData, setUserRoleData] = useState([]);
  const [cityData, setCityData] = useState(suburbData);
  const [topErrorMessage, setTopErrorMessage] = useState('');
  const [selectedFranchisee, setSelectedFranchisee] = useState();
  const [franchiseeData, setFranchiseeData] = useState(null);
  const [coordinatorData, setCoordinatorData] = useState([]);
  const [trainingCategoryData, setTrainingCategoryData] = useState([]);
  const [pdcData, setPdcData] = useState([]);
  const [businessAssetData, setBuinessAssetData] = useState([]);
  const [trainingDocuments, setTrainingDocuments] = useState();
  const [suburbSearchString, setSuburbSearchString] = useState("");

  // IMAGE CROPPING STATES
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [createUserModal, setCreateUserModal] = useState(false);
  const [userActiveStatus, setUserActiveStatus] = useState(null);
  const [statusPopup, setStatusPopup] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);


  // LOADER STATES
  const [loaderMessage, setLoaderMessage] = useState(null);

  // CREATES NEW USER INSIDE THE DATABASE
  const createUser = async (data) => {
    const token = localStorage.getItem('token');

    const response = await axios.post(`${BASE_URL}/auth/signup`, data, {

      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    console.log('RESPONSE:', response);

    if(response.status === 201 && response.data.status === "success") {
      let { data } = response.data;
      
      setLoaderMessage("Adding the User details to Engagebay Contacts")
      updateEngageBayContactList(data);
      setLoaderMessage("Wrapping Up");

      // setLoader(false);
      // setCreateUserModal(false);
      // localStorage.setItem('success_msg', 'User created successfully!');

      // if(localStorage.getItem('user_role') === 'coordinator' && data.role === 'guardian') {
      //   window.location.href=`/children/${data.id}`;
      // } else {
      //   window.location.href="/user-management";
      // }

    } else if(response.status === 200 && response.data.status === "fail") {
      setLoader(false);
      setCreateUserModal(false);
      let { errorObject } = response.data;
      errorObject.map(error => setFormErrors(prevState => ({
          ...prevState,
          [error.error_field]: error.error_msg
      })));
    }
  };

  // const validateEmail = (email) => {
  //   let errors = {};  
  //   if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
  //       errors.email= "Enter a valid email"
  //   }
  //   return errors;

  // }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getEngagebayDetail = async (email) => {
    const response = await axios.get(`${BASE_URL}/contacts/${email}`);
    if(response.status === 200 && response.data.status === "success") {
    
      const {data} = response.data;
      let { properties } = data;
      
      let tempDataObj = {}
      properties.map(d => {
        let obj = { [d.name]: [d.value][0] };
        tempDataObj = {...tempDataObj, ...obj};
      });

      setFormData(prevState => ({
        ...prevState,
        fullname: tempDataObj?.fullname,
        phone: tempDataObj?.phone,
        role: tempDataObj?.role,
        address: tempDataObj?.address,
        city: tempDataObj?.city,
        postalCode: tempDataObj?.postalCode
      }));

    }

  };

  const checkIfUserExistsAndDeactivated = async (email) => {
    const response = await axios.get(`${BASE_URL}/auth/user/checkIfExists/${email}`);

    if(response.status === 200 && response.data.isPresentAndDeactivated === 1) {
      const { active_status } = response.data;
      setUserActiveStatus(active_status);
      setStatusPopup(true);
    } else {
      getEngagebayDetail(email);
    }
  }

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async(event) => {
    event.preventDefault();
    if(localStorage.getItem('user_role') === 'franchisee_admin' || localStorage.getItem('user_role') === 'coordinator' || localStorage.getItem('user_role') === 'educator') {
      setFormData((prevState) => ({
        ...prevState,
        franchisee: selectedFranchisee,
      }));

      setFormErrors(prevState => ({
        ...prevState,
        franchisee: null
      }));
    }
    const errorObj = UserFormValidation(formData);
    if(Object.keys(errorObj).length > 0) {
      console.log('There are errors in the code!');
      setFormErrors(errorObj);
    } else {
        console.log('Erorrs removed!');
        let data=new FormData();
        let doc=[];
        trainingDocuments?.map(async(item)=>{
          const blob=await fetch(await toBase64(item)).then((res) => res.blob());
          // doc.push(blob);
          data.append('images', blob);
        })
        
        if(croppedImage) {
          const blob = await fetch(croppedImage.getAttribute('src')).then((res) => res.blob());
          // doc.push(blob);
          data.append('images', blob);
        }
        
        Object.keys(formData)?.map((item,index) => {
          data.append(item,Object.values(formData)[index]);
        })
        
        // data.append("images", doc);
        let errorObject = UserFormValidation(formData);

        if(Object.keys(errorObject).length > 0) {
            console.log('THERE ARE STILL ERRORS', errorObject);
            setFormErrors(errorObject);
        } else {
            console.log('CREATING USER!');
            setCreateUserModal(true);
            setLoaderMessage("Creating New User")
            setLoader(true)
            createUser(data);
        } 
        createUser(data);
    }
  };

  const updateEngageBayContactList = async (data) => {
    // PAYLOAD TO BE USED WHILE CREATING OR UPDATING
    let payload = {
      email: data.email,
      role: data.role,
      fullname: data.name,
      city: data.city,
      postalCode: data.postalCode,
      firstname: data.name.split(" ")[0],
      lastname: data.name.split(" ")[1],
      address: data.address,
      phone: data.phone.split("-")[1]
    };

    // CHECKING WHETHER THE RECORD WITH GIVEN MAIL EXISTS OR NOT
    let response = await axios.get(`${BASE_URL}/contacts/data/${data.email}`);

    if(response.status === 200 && response.data.isRecordFetched === 0) {

      // RECORD WITH THE AFOREMENTIONED EMAIL DOESN'T EXIST, 
      // HENCE, CREATING A NEW RECORD INSIDE ENGAGEBAY
      // WITH THE GIVEN DETAILS
      let createResponse = await axios.post(`${BASE_URL}/contacts/create`, payload);
  
      if(createResponse.status === 200 && createResponse.data.status === "success") {
        
        console.log('ENGAGEBAY CONTACT CREATED SUCCESSFULLY!');
        setLoader(false);
        setCreateUserModal(false);
        localStorage.setItem('success_msg', 'User created successfully!');

        if(localStorage.getItem('user_role') === 'coordinator' && data.role === 'guardian') {
          window.location.href=`/children/${data.id}`;
        } else {
          window.location.href="/user-management";
        }
      
      } else {
        console.log('ENGAGEBAY CONTACT COULDN\'T BE CREATED');
      }

    } else if(response.status === 200 && response.data.isRecordFetched === 1) {

      // RECORD WITH THE AFOREMENTIONED EMAIL ALREADY EXISTS, 
      // HENCE, UPDATING THE RECORD
      // WITH THE GIVEN DETAILS
      let updateResponse = await axios.put(`${BASE_URL}/contacts/${data.email}`, payload);

      if(updateResponse.status === 201 && updateResponse.data.status === "success") {
        
        console.log('ENGAGEBAY CONTACT UPDATED SUCCESSFULLY!');
        setLoader(false);
        setCreateUserModal(false);
        localStorage.setItem('success_msg', 'User created successfully!');

        if(localStorage.getItem('user_role') === 'coordinator' && data.role === 'guardian') {
          window.location.href=`/children/${data.id}`;
        } else {
          window.location.href="/user-management";
        }

      } else {
        console.log('COULDN\'T UPDATE THE ENGAGEBAY CONTACT!');
      }
    }

  }

  const fetchCoordinatorData = async (franchisee_id) => {
    console.log('FETCHING COORDINATOR DATA');
    const response = 
      await axios.get(`${BASE_URL}/role/franchisee/coordinator/franchiseeID/${franchisee_id}/coordinator`);
    if(response.status === 200 && response.data.status === "success") {
      let { coordinators } = response.data;
      setCoordinatorData(coordinators.map(coordinator => ({
        id: coordinator.id,
        value: coordinator.fullname,
        label: coordinator.fullname
      })));
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
      // let newRoleList = userRoleList.filter(role => role.role_name !== 'franchisor_admin');
      
      let newRoleList = userRoleList.map(d => ({
        id: d.id,
        value: d.role_name,
        label: d.role_label,
        sequence: d.role_sequence
      }));

      // if(localStorage.getItem('user_role') === 'franchisee_admin') {
      //   newRoleList = newRoleList.filter(role => role.label !== 'Franchisee Admin');
      // }

      // if(localStorage.getItem('user_role')) {
      //   newRoleList = newRoleList.filter(role => role.role_name !== 'Franchisee Admin' && role.role_name !== 'Coordinator');
      // }
      setUserRoleData(
        newRoleList
      );
      setCurrentRole(localStorage.getItem('user_role'));
    }
  };

  // FETCHING SUBURB DATA
  const fetchSuburbData = () => {
    const suburbAPI = `${BASE_URL}/api/suburbs/data/${suburbSearchString}`;
    const getSuburbList = axios(suburbAPI, {headers: {"Authorization": "Bearer " + localStorage.getItem('token')}});
    axios.all([getSuburbList]).then(
      axios.spread((...data) => {
        console.log('SUBURB DATA:', data[0].data.data);
        let sdata = data[0].data.data;
        setCityData(sdata.map(d => ({
          id: d.id,
          value: d.name,
          label: d.name
        })));
      })
    )
  }

  const fetchTrainingCategories = async () => {
    const response = await axios.get(
      `${BASE_URL}/training/get-training-categories`);
    if (response.status === 200 && response.data.status === "success") {
      const { categoryList } = response.data;
      setTrainingCategoryData([
        ...categoryList.map((data) => ({
          id: data.id,
          value: data.category_name,
          label: data.category_name,
        })),
      ]);
    }
  };

  const fetchProfessionalDevelopementCategories = async () => {
    const response = await axios.get(`${BASE_URL}/api/get-pdc`);
    
    if(response.status === 200 && response.data.status === "success") {
      const { pdcList } = response.data;
      setPdcData(pdcList.map(data => ({
        id: data.id,
        value: data.category_name,
        label: data.category_name
      })));
    }
  }; 

  const fetchBuinessAssets = async () => {
    const response = await axios.get(`${BASE_URL}/api/get-business-assets`);
    
    if(response.status === 200 && response.data.status === "success") {
      const { businessAssetList } = response.data;
      setBuinessAssetData(businessAssetList.map(data => ({
        id: data.id,
        value: data.asset_name,
        label: data.asset_name
      })));
    }
  };

  const fetchFranchiseeList = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/role/franchisee`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if(response.status === 200 && response.data.status === "success") {
      let { franchiseeList } = response.data;
      setFranchiseeData(franchiseeList.map(franchisee => ({
        id: franchisee.id,
        value: franchisee.franchisee_name,
        label: franchisee.franchisee_name
      })));  
    }
  }

  const trimRoleList = () => {
    console.log('TRIMMING ROLE!');
    let newRoleList = userRoleData;
    console.log('NEW ROLE LIST:', newRoleList);

    if(currentRole === "educator") {
      newRoleList = newRoleList.filter(role => role.sequence === 4);
      setUserRoleData(newRoleList);
    }

    if(currentRole === "coordinator") {
      newRoleList = newRoleList.filter(role => role.sequence > 3);
      setUserRoleData(newRoleList);
    }

    if(currentRole === "franchisee_admin") {
      newRoleList = newRoleList.filter(role => role.sequence > 2);
      setUserRoleData(newRoleList);
    }

    if(currentRole === 'franchisor_admin') {
      newRoleList = newRoleList.filter(role => role.sequence > 1);
      setUserRoleData(newRoleList);
    }

    if(currentRole === "guardian") {
      newRoleList = newRoleList.filter(role => role.sequence === 5);
      setUserRoleData(newRoleList);
    }
  }


  // useEffect(() => {
  //   setFormErrors(prevState => ({
  //     ...prevState,
  //     profile_pic: null
  //   }))
  // }, [croppedImage]);

  useEffect(() => {
    fetchCountryData();
    fetchUserRoleData();
    fetchTrainingCategories();
    fetchProfessionalDevelopementCategories();
    fetchBuinessAssets();
    fetchFranchiseeList();
  }, []);

  useEffect(() => {
    fetchSuburbData();
  }, [suburbSearchString])

  useEffect(() => {
    fetchCoordinatorData(formData.franchisee)
  }, [formData.franchisee]);

  formErrors && console.log('FORM ERRORS:', formErrors);

  useEffect(() => { 
    if(localStorage.getItem('user_role') === 'franchisee_admin' || localStorage.getItem('user_role') === 'coordinator') {
      let franchisee_id = localStorage.getItem('franchisee_id');
      setFormData(prevState => ({
        ...prevState,
        franchisee: franchisee_id,
        franchiseeObj: {...franchiseeData?.filter(data => parseInt(data.id) === parseInt(franchisee_id))[0]} 
      }));
    }
  }, [franchiseeData]);

  useEffect(() => {
    console.log('CURRENT ROLE HAS BEEN LOADED!');
    trimRoleList();
  }, [currentRole]);

  formData && console.log('FORM ERRORS:', formData);
  formData && console.log('ROLE:', userRoleData?.filter(d => d.value === formData?.role));

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
                          fetchedPhoto={""}
                        />

                        {
                          popupVisible && 
                          <ImageCropPopup 
                            image={image} 
                            setCroppedImage={setCroppedImage}
                            setPopupVisible={setPopupVisible} />
                        }

                        
                        
                      </div>
                      <form className="user-form error-sec" onSubmit={handleSubmit}>
                        <Row>
                        <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              placeholder="Enter Your Email ID"
                              value={formData?.email}
                              onChange={(e) => {
                                handleChange(e);
                                setFormErrors(prevState => ({
                                  ...prevState,
                                  email: null
                                }));
                              }}
                              onBlur={(e) => {
                                checkIfUserExistsAndDeactivated(e.target.value);;
                              }}
                            />
                            { formErrors.email !== null && <span className="error">{formErrors.email}</span> }
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>User Role</Form.Label>
                            <Select
                              placeholder="Which Role?"
                              closeMenuOnSelect={true}
                              options={userRoleData}
                              value={userRoleData?.filter(d => d.value === formData?.role)}
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

                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="fullname"
                              placeholder="Enter Full Name"
                              value={formData?.fullname}
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

                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Suburb</Form.Label>
                            <Select
                              placeholder="Search Your Suburb"
                              closeMenuOnSelect={true}
                              options={cityData}
                              value={cityData?.filter(d => d.label === formData?.city)}
                              onInputChange={(e) => {
                                setSuburbSearchString(e);
                              }}
                              onChange={(e) => {
                                setFormData(prevState => ({
                                  ...prevState,
                                  city: e.value
                                }));

                                setFormErrors(prevState => ({
                                  ...prevState,
                                  city: null
                                }));
                              }}
                            />
                            { formErrors.city !== null && <span className="error">{formErrors.city}</span> }
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3 relative">
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

                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control
                              type="tel"
                              name="postalCode"
                              maxLength="4"
                              placeholder="Your Postal Code"
                              value={formData.postalCode ?? ''}
                              onChange={(e) => {

                                handleChange(e);
                                setFormErrors(prevState => ({
                                  ...prevState,
                                  postalCode: null
                                }));

                                if(e.target.value.length === 4) {
                                  setFormErrors(prevState => ({
                                    ...prevState,
                                    postalCodeLength: null
                                  }))
                                }
                              }}
                            />
                            { (formErrors.postalCode !== null && <span className="error">{formErrors.postalCode}</span>) || (formErrors.postalCodeLength !== null && <span className="error">{formErrors.postalCodeLength}</span>) }
                          </Form.Group>
                          
                          <Form.Group className="col-md-6 mb-3 relative">
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

                          <Form.Group className="col-md-6 mb-3 relative">
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
                          
                          <Form.Group className="col-md-6 mb-3 relative">
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
                                maxLength={10}
                                placeholder="Enter Your Number"
                                value={formData.phone}
                                onChange={(e) => {

                                  e.target.value = e.target.value.replace(/\s/g, "");
                                  // handleChange(e);
                                  if(isNaN(e.target.value.charAt(e.target.value.length - 1)) === true) {
                                    setFormData(prevState => ({
                                      ...prevState,
                                      phone: e.target.value.slice(0, -1)
                                    })); 
                                  } else {
                                    setFormData(prevState => ({
                                      ...prevState,
                                      phone: e.target.value
                                    }));
                                  }

                                  setFormErrors(prevState => ({
                                    ...prevState,
                                    phone: null
                                  }));
                                }}
                              />
                            </div>
                            { formErrors.phone !== null && <span className="error">{formErrors.phone}</span> }
                          </Form.Group>
                          
                          {
                            formData && formData?.role === 'educator' &&
                            <Form.Group className="col-md-6 mb-3 relative">
                              <Form.Label>Nominated Assistant</Form.Label>
                              <Form.Control
                                type="text"
                                name="nominated_assistant"
                                placeholder="Enter Full Name"
                                value={formData?.nominated_assistant}
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                              />
                            </Form.Group>
                          }
                            
                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Select Franchise</Form.Label>
                            {
                              localStorage.getItem('user_role') === 'franchisor_admin' && 
                              <Select
                                placeholder="Which Franchise?"
                                closeMenuOnSelect={true}
                                options={franchiseeData}
                                onChange={(e) => {
                                  setFormData((prevState) => ({
                                    ...prevState,
                                    franchisee: e.id,
                                    open_coordinator: true
                                  }));

                                  setFormData((prevState) => ({
                                    ...prevState,
                                    franchiseeObj: e
                                  }))

                                  setFormErrors(prevState => ({
                                    ...prevState,
                                    franchisee: null
                                  }));
                                }}
                              />
                            }
                            {
                              (localStorage.getItem('user_role') === 'franchisee_admin' || localStorage.getItem('user_role') === 'coordinator' || localStorage.getItem('user_role') === 'educator') && 
                              <Select
                                placeholder={franchiseeData?.filter(d => parseInt(d.id) === parseInt(selectedFranchisee))[0].label || "Which Franchise?"}
                                isDisabled={true}
                                closeMenuOnSelect={true}
                                hideSelectedOptions={true}
                              />
                            }
                            { formErrors.franchisee !== null && <span className="error">{formErrors.franchisee}</span> }
                          </Form.Group>

                          {
                            formData?.role === 'educator' &&
                            <Form.Group className="col-md-6 mb-3 relative">
                              <Form.Label>Select Primary Coordinator</Form.Label>
                              <Select
                                isDisabled={formData.role !== 'educator'}
                                placeholder={(formData.role === 'educator' && formData.franchisee !== "") ? "Which Co-ordinator?" : "Not Applicable"}
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
                          }
                          <Form.Group className="col-md-6 mb-3 relative">
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
                          {/* <Form.Group className="mb-3 relative">
                            <div className="btn-checkbox">
                              <Form.Check
                                type="checkbox"
                                id="accept"
                                // checked={parentData.i_give_medication_permission}
                                label="Assign random password (sent to user via email)"
                                onChange={() => {
                                  
                                }} />
                            </div>
                          </Form.Group> */}
                          
                          {/* <Form.Group className="col-md-6 mb-3 relative">
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
                          </Form.Group> */}

                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Upload Documents</Form.Label>
                            <DragDropMultiple 
                              onSave={setTrainingDocuments} />
                          </Form.Group>

                          {/* <Form.Group className="mb-3 relative">
                            <div className="btn-checkbox">
                              <Form.Check
                                type="checkbox"
                                id="accept"
                                checked={formData?.assign_random_password}
                                label="Assign random password (sent to user via email)"
                                onChange={(e) => {
                                  setFormData(prevState => ({
                                    ...prevState,
                                    assign_random_password: !formData?.assign_random_password
                                  }))
                                }} />
                            </div>
                          </Form.Group> */}

                          <Col md={12}>
                            <div className="cta text-center mt-5">
                              <Button variant="transparent" className="me-3">
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
                        <p>{loaderMessage}</p>
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
      <Modal
        show={statusPopup}
        onHide={() => setStatusPopup(false)}>
        <Modal.Header>
          <Modal.Title>Attention!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
              <p>A {userActiveStatus === "deleted" ? "Deleted" : "Deactivated"} User with this email already exists.</p>
              <p>Contact your administrator to reactivate him/her.</p>
            </div>
        </Modal.Body>
        <Modal.Footer>
        <button 
              className="modal-button"
              onClick={() => {
                setFormData(prevState => ({
                  ...prevState,
                  email: ""
                }));
                setStatusPopup(false)
              }}>Okay</button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NewUser;
