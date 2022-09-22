import axios from 'axios';
import ImageCropPopup from '../components/ImageCropPopup/ImageCropPopup';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Col, Container, Row, Form, Modal } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import DragDropMultiple from '../components/DragDropMultiple';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useParams } from 'react-router-dom';
// import { suburbData } from '../assets/data/suburbData';
import { BASE_URL } from '../components/App';
import { Link } from 'react-router-dom';
import UserSignature from './InputFields/UserSignature';
import moment from 'moment';
import DragDropSingle from '../components/DragDropSingle';
import { editUserValidation } from '../helpers/validation';
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

const EditUser = () => {  
  const { userId } = useParams();

  // REFS
  let address = useRef(null);
  let city = useRef(null);
  let crn = useRef(null);
  let email = useRef(null);
  let fullname = useRef(null);
  let phone = useRef(null);
  let postalCode = useRef(null);
  let state = useRef(null);

  const [formErrors, setFormErrors] = useState([]);
  const [formData, setFormData] = useState({
    city: 'Sydney',
    phone: '',
    role: '',
    telcode: '+61',
    terminationDate: "",
    password: "",
    assign_random_password: false,
    change_pwd_next_login: false
  });
  const [countryData, setCountryData] = useState([]);
  const [userRoleData, setUserRoleData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState();
  const [topErrorMessage, setTopErrorMessage] = useState('');
  const [selectedFranchisee, setSelectedFranchisee] = useState();
  const [franchiseeData, setFranchiseeData] = useState(null);
  const [franchiseePlaceholder, setFranchiseePlaceholder] = useState(null);
  const [coordinatorData, setCoordinatorData] = useState([]);
  const [trainingCategoryData, setTrainingCategoryData] = useState([]);
  const [pdcData, setPdcData] = useState([]);
  const [businessAssetData, setBuinessAssetData] = useState([]);
  const [trainingDocuments, setTrainingDocuments] = useState([]);
  const [fetchedTrainingDocuments, setFetchedTrainingDocuments] = useState([]);
  const [editUserData, setEditUserData] = useState();
  const [suburbSearchString, setSuburbSearchString] = useState("");

  // IMAGE CROPPING STATES
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // DIALOG STATES
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [showUserAgreementDialog, setShowUserAgreementDialog] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [signatureUploaded, setSignatureUploaded] = useState(false);
  const [loader, setLoader] = useState(false);
  const [createUserModal, setCreateUserModal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);

  // ERROR HANDLING
  const [errors, setErrors] = useState({});
  const [fileDeleteMessage, setFileDeleteMessage] = useState(null);

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
      const { userFiles } = response.data;

      if(Object.keys(user).length > 0) {
        copyDataToState(user, userFiles);
      } else {
        localStorage.setItem('success_msg', 'User doesn\'t exist!');
        const userRole = localStorage.getItem('user_role');
        if(userRole === 'guardian')
          window.location.href = '/';
        else
          window.location.href = '/user-management';
      }
    }
  };

  const copyDataToState = (user, files) => {
    setCurrentRole(user?.role);
    setFormData(prevState => ({
      id: user?.id,
      fullname: user?.fullname,
      role: user?.role,
      state: user?.state,
      city: user?.city,
      address: user?.address,
      postalCode: user?.postalCode,
      crn: user?.crn,
      email: user?.email,
      telcode: user?.phone.split("-")[0],
      phone: user?.phone.split("-")[1],
      franchisee_id: user?.franchisee_id,
      nominated_assistant: user?.nominated_assistant || null,
      trainingCategories: user?.training_categories?.map(d => parseInt(d)),
      professionalDevCategories: user?.professional_development_categories?.map(d => parseInt(d)),
      coordinator: user?.coordinator,
      businessAssets: user?.business_assets?.map(d => parseInt(d)),
      terminationDate: user?.termination_date || "",
      termination_reach_me: user?.termination_reach_me,
      user_signature: user?.user_signature,
      profile_photo: user?.profile_photo,
      assign_random_password: user?.assign_random_password ? true : false,
      change_pwd_next_login: user?.change_pwd_next_login ? true : false
    }));
    setCroppedImage(user?.profile_photo);

    if(files?.length > 0) {
      setFetchedTrainingDocuments(files?.map(f => ({
        id: f.id,
        link: f.file,
        user_id: f.user_id,
        file_name: f.name
      })));
    }
  }

  // CREATES NEW USER INSIDE THE DATABASE
  const updateUserDetails = async (data) => {
    console.log('UPDATING USER DETAILS!');
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${BASE_URL}/auth/user/${userId}`, data, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (response.status === 200 && response.data.status === 'success') {
      console.log('USER EDITED SUCCESSFULLY!');
      if(signatureImage) {
        let data = new FormData();
        const blob = await fetch(signatureImage).then((res) => res.blob());
        console.log('BLOB:', blob);
        data.append('image', blob);
        let signatureImageResponse = await axios.put(`${BASE_URL}/auth/${response.data.userId}`, data, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        console.log('SIGNATURE IMAGE RESPONSE:', signatureImageResponse);

        if(signatureImageResponse.status === 201 && signatureImageResponse.data.status === "success") {
          console.log('WE ARE DONE HERE: I');
          updateEngageBayContactList(formData);
          setCreateUserModal(false);
          setLoader(false)
          localStorage.setItem('success_msg', 'User updated successfully Termination date set!');
          const userRole = localStorage.getItem('guardian');
          if(userRole === 'guardian')
            window.location.href = '/';
          else
            window.location.href = '/user-management';

          setSignatureUploaded(true);
        } else if(signatureImageResponse.status === 201 && signatureImageResponse.data.status === "fail") {
          setTopErrorMessage(signatureImageResponse.data.msg);
        }
      }

      if(signatureUploaded !== true) {
        console.log('WE ARE DONE HERE: II')
        updateEngageBayContactList(formData);
      }
    } else if (response.status === 200 && response.data.status === 'fail') {
      setTopErrorMessage(response.data.msg);
    }
  };

  const updateEngageBayContactList = async (data) => {
    // PAYLOAD TO BE USED WHILE CREATING OR UPDATING
    let payload = {
      email: data.email,
      role: data.role,
      fullname: data.fullname,
      city: data.city,
      postalCode: data.postalCode,
      firstname: data.fullname.split(" ")[0],
      lastname: data.fullname.split(" ")[1],
      address: data.address,
      phone: data.phone
    };

    console.log('ENGAGEBAY PAYLOAD:', payload);

    // CHECKING WHETHER THE RECORD WITH GIVEN MAIL EXISTS OR NOT
    let response = await axios.get(`${BASE_URL}/contacts/data/${data.email}`);

    if(response.status === 200 && response.data.isRecordFetched === 0) {

      // RECORD WITH THE AFOREMENTIONED EMAIL DOESN'T EXIST, 
      // HENCE, CREATING A NEW RECORD INSIDE ENGAGEBAY
      // WITH THE GIVEN DETAILS
      let createResponse = await axios.post(`${BASE_URL}/contacts/create`, payload);
  
      if(createResponse.status === 200 && createResponse.data.status === "success") {
        console.log('ENGAGEBAY CONTACT CREATED SUCCESSFULLY!');
        localStorage.setItem('success_msg', 'User updated successfully');

        const userRole = localStorage.getItem('user_role');
        if(userRole === 'guardian')
          window.location.href = '/';
        else
          window.location.href = '/user-management';
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
        localStorage.setItem('success_msg', 'User updated successfully');
        
        const userRole = localStorage.getItem('user_role');
        if(userRole=== 'guardian')
          window.location.href = '/';
        else
          window.location.href = '/user-management';        // setLoader(false);
        // setCreateUserModal(false);
        // localStorage.setItem('success_msg', 'User created successfully!');

        // if(localStorage.getItem('user_role') === 'coordinator' && data.role === 'guardian') {
        //   window.location.href=`/children/${data.id}`;
        // } else {
        //   window.location.href="/user-management";
        // }

      } else {
        console.log('COULDN\'T UPDATE THE ENGAGEBAY CONTACT!');
      }
    }

  }

  const handleChange = (event) => {
    let { name, value } = event.target;
    // value = value.replace(/\s/g, "");
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchStateList = async () => {
    let response = await axios.get(`${BASE_URL}/api/state/data`);

    if(response.status === 200 && response.data.status === "success") {
      let { states } = response.data;
      setStateData(states.map(d => ({
        id: d.id,
        value: d.name,
        label: d.name
      })));
    }
  }

  const setAutoFocus = (obj) => {
    let errArray = Object.keys(obj);
    console.log('Array of errors:', errArray);

    if(errArray.includes('fullname')) {
      fullname?.current?.focus();
    } else if(errArray?.includes('state')) {
      state?.current?.focus();
    } else if(errArray?.includes('city')) {
      city?.current?.focus();
    } else if(errArray?.includes('address')) {
      address?.current?.focus();
    } else if(errArray?.includes('postalCode')) {
      postalCode?.current?.focus();
    } else if(errArray?.includes('crn')) {
      crn?.current?.focus();
    } else if(errArray?.includes('email')) {
      email?.current?.focus();
    } else if(errArray?.includes('phone')) {
      phone?.current?.focus();
    } 
  }

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (event) => {
    event.preventDefault();

    let error = editUserValidation(formData, trainingDocuments, fetchedTrainingDocuments);
    
    if(Object.keys(error).length > 0) {
      setFormErrors(error);
      setAutoFocus(error);
    } else {
      let data = new FormData();
      
      trainingDocuments?.map(async(item)=>{
        const blob=await fetch(await toBase64(item)).then((res) => res.blob());
        data.append('images', blob);
      })

      let blob;
      if(croppedImage) {

        if(typeof croppedImage === "object") {
          blob = await fetch(croppedImage.getAttribute('src')).then((res) => res.blob());
          data.append('images', blob);
        } else {
          blob = croppedImage
          data.append('profile_photo', blob);
        }
      }
      
      Object.keys(formData)?.map((item,index) => {
        data.append(item,Object.values(formData)[index]);
      });

      trainingDocuments.map(doc => data.append('images', doc));

      setCreateUserModal(true);
      setLoader(true)
      updateUserDetails(data);
    }
  };

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
    
      let newRoleList = userRoleList.map(d => ({
        id: d.id,
        value: d.role_name,
        label: d.role_label,
        sequence: d.role_sequence
      }));

      setUserRoleData(
        newRoleList
      );
    }
  };

  // FETCHING SUBURB DATA
  const fetchSuburbData = (state) => {
    const suburbAPI = `${BASE_URL}/api/suburbs/data/${state}`;
    const getSuburbList = axios(suburbAPI, {headers: {"Authorization": "Bearer " + localStorage.getItem('token')}});
    axios.all([getSuburbList]).then(
      axios.spread((...data) => {
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
          value: data.category_name,
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
        value: data.category_name,
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

  const fetchCoordinatorData = async (franchisee_id) => {
    const response = await axios.get(`${BASE_URL}/role/franchisee/coordinator/franchiseeID/${franchisee_id}/coordinator`);
    if(response.status === 200 && response.data.status === "success") {
      let { coordinators } = response.data;
      setCoordinatorData(coordinators.map(coordinator => ({
        id: coordinator.id,
        value: coordinator.fullname,
        label: coordinator.fullname
      })));
    }
  }

  // DIALOG HANDLING
  const handleConsentDialog = () => {
    if(formData?.termination_reach_me && formData?.terminationDate.length > 0) {
      setShowConsentDialog(false);
      setShowSignatureDialog(true);
    }
  }

  const handleSignatureDialog = (data) => {
    setSignatureImage(data);
    if(signatureImage) {
      console.log('SIGNATURE IMAGE:', signatureImage);
      setShowSignatureDialog(false);
    }
  }

  const trimRoleList = () => {
    let newRoleList = userRoleData;

    if(currentRole === "educator") {
      newRoleList = newRoleList.filter(role => role.sequence < 5);
      setUserRoleData(newRoleList);
    }

    if(currentRole === "coordinator") {
      newRoleList = newRoleList.filter(role => role.sequence < 4);
      setUserRoleData(newRoleList);
    }

    if(currentRole === "franchisee_admin") {
      newRoleList = newRoleList.filter(role => role.sequence < 3 && role.sequence > 1);
      setUserRoleData(newRoleList);
    }

    if(currentRole === "guardian") {
      newRoleList = newRoleList.filter(role => role.sequence === 5);
      setUserRoleData(newRoleList);
    }
  }

  const handleUserFileDelete = async (fileId) => {
    console.log('FILE ID:', fileId);
    let response = await axios.delete(`${BASE_URL}/auth/user/files/${fileId}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    });

    if(response.status === 201 && response.data.status === "success") {
      setFileDeleteMessage('File deleted successfully');

      let newData = fetchedTrainingDocuments.filter(d => parseInt(d.id) !== parseInt(fileId));
      setFetchedTrainingDocuments(newData);
    }
  }

  useEffect(() => {
    fetchCountryData();
    fetchUserRoleData();
    fetchTrainingCategories();
    fetchProfessionalDevelopementCategories();
    fetchBuinessAssets();
    fetchEditUserData();
    fetchFranchiseeList();
    fetchStateList();
  }, []);

  useEffect(() => {
    fetchSuburbData(formData.state);
  }, [formData.state])

  useEffect(() => {
    copyDataToState();
  }, [editUserData]);

  useEffect(() => {
    fetchCoordinatorData(formData.franchisee_id);
  }, [formData.franchisee_id]);

  useEffect(() => {
    trimRoleList();
  }, [currentRole]);

  useEffect(() => {
    setTimeout(() => {
      setFileDeleteMessage(null);
    }, 3000)
  }, [fileDeleteMessage]);

  useEffect(() => {
    if(trainingDocuments?.length + fetchedTrainingDocuments.length < 5) {
      setFormErrors(prevState => ({
        ...prevState,
        doc: null
      }));
    }
  }, [trainingDocuments, fetchedTrainingDocuments]);

  formData && console.log('EDIT USER DATA:', formData);
  formErrors && console.log('Errors:', formErrors);

  return (
    <>
      {
        fileDeleteMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{fileDeleteMessage}</p>
      }
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
                        <DragDropSingle
                          croppedImage={croppedImage}
                          setCroppedImage={setCroppedImage}
                          onSave={setImage}
                          setPopupVisible={setPopupVisible}
                          fetchedPhoto={formData?.profile_photo || ""}
                        />
                        <span className="error">
                          {!formData.file && formErrors.file}
                        </span>

                        {
                          popupVisible && 
                          <ImageCropPopup 
                            image={image} 
                            setCroppedImage={setCroppedImage} 
                            setPopupVisible={setPopupVisible}
                             />
                        }
                        
                      </div>
                      <form className="user-form error-sec" onSubmit={handleSubmit}>
                        <Row>
                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Full Name *</Form.Label>
                            <Form.Control
                              type="text"
                              name="fullname"
                              ref={fullname}
                              value={formData?.fullname}
                              onChange={(e) => {
                                handleChange(e)
                                setFormErrors(prevState => ({
                                  ...prevState,
                                  fullname: null
                                }))
                              }}
                            />
                            { formErrors.fullname !== null && <span className="error">{formErrors.fullname}</span> }
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>User Role *</Form.Label>
                            <Select
                              placeholder="Select"
                              closeMenuOnSelect={true}
                              isDisabled={localStorage.getItem('user_role') === 'educator' || localStorage.getItem('user_role') === 'guardian'}
                              value={userRoleData.filter(d => d.value === formData?.role) || ""}
                              options={userRoleData}
                              onChange={(e) =>
                                setFormData((prevState) => ({
                                  ...prevState,
                                  role: e.value,
                                  roleObj: e
                                }))
                              }
                            />
                            {/* <span className="error">
                              {!formData.role && formErrors.role}
                            </span> */}
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>State *</Form.Label>
                            <Select
                              placeholder="Select"
                              ref={state}
                              closeMenuOnSelect={true}
                              options={stateData}
                              value={stateData?.filter(d => d.label === formData?.state)}
                              onChange={(e) => {
                                setFormData(prevState => ({
                                  ...prevState,
                                  state: e.value,
                                  city: ""
                                }));

                                setFormErrors(prevState => ({
                                  ...prevState,
                                  city: null
                                }));
                              }}
                            />
                            { formErrors.state !== null && <span className="error">{formErrors.state}</span> }
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Suburb *</Form.Label>
                            <Select
                              placeholder="Select"
                              closeMenuOnSelect={true}
                              ref={city}
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
                            <Form.Label>Address *</Form.Label>
                            <Form.Control
                              type="text"
                              name="address"
                              ref={address}
                              value={formData.address}
                              onChange={(e) => {
                                handleChange(e)
                                setFormErrors(prevState => ({
                                  ...prevState,
                                  address: null
                                }))
                              }}
                            />
                            { formErrors.address !== null && <span className="error">{formErrors.address}</span> }
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Post Code *</Form.Label>
                            <Form.Control
                              type="text"
                              name="postalCode"
                              ref={postalCode}
                              maxLength={4}
                              value={formData.postalCode}
                              onChange={handleChange}
                            />
                            { formErrors.postalCode !== null && <span className="error">{formErrors.postalCode}</span> }
                          </Form.Group>
                          
                          {
                            formData?.role === "guardian" &&
                            <Form.Group className="col-md-6 mb-3 relative">
                              <Form.Label>CRN *</Form.Label>
                              <Form.Control
                                type="text"
                                ref={crn}
                                name="crn"
                                value={formData.crn}
                                onChange={handleChange}
                              />
                              { formErrors.crn !== null && <span className="error">{formErrors.crn}</span> }
                            </Form.Group>
                          }
                          
                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Email Address *</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              ref={email}
                              value={formData.email}
                              onChange={handleChange}
                            />
                            { formErrors.email !== null && <span className="error">{formErrors.email}</span> } 
                          </Form.Group>
                          
                          {
                            formData && formData?.role !== 'guardian' &&
                            <Form.Group className="col-md-6 mb-3 relative">
                              <Form.Label>Training Categories</Form.Label>
                              <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti
                                placeholder="Select"
                                value={trainingCategoryData?.filter(d => formData?.trainingCategories?.includes(parseInt(d.id)))}
                                options={trainingCategoryData}
                                onChange={(selectedOptions) => {
                                  setFormData((prevState) => ({
                                    ...prevState,
                                    trainingCategories: [...selectedOptions.map(option => option.id)],
                                  }));
                                }}
                              />
                            </Form.Group>
                            }

                          {
                            formData && formData?.role !== 'guardian' &&
                            <Form.Group className="col-md-6 mb-3 relative">
                              <Form.Label>Professional Development Categories</Form.Label>
                              <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti
                                placeholder="Select"
                                value={pdcData?.filter(d => formData?.professionalDevCategories?.includes(parseInt(d.id)))}
                                options={pdcData}
                                onChange={(selectedOptions) => {
                                  setFormData((prevState) => ({
                                    ...prevState,
                                    professionalDevCategories: [...selectedOptions.map(option => option.id)],
                                  }));
                                }}
                              />
                            </Form.Group>
                          }
                          
                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Contact Number *</Form.Label>
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
                                ref={phone}
                                maxLength={20}
                                value={formData.phone}
                                onChange={(e) => {
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
                                }}
                              />
                            </div>
                            { formErrors.phone !== null && <span className="error">{formErrors.phone}</span> }
                          </Form.Group>

                          {
                            formData && formData?.role === 'educator' &&
                            <Form.Group className="col-md-6 mb-3 relative">
                              <Form.Label>Nominated Assistant *</Form.Label>
                              <Form.Control
                                type="text"
                                name="nominated_assistant"
                                value={formData?.nominated_assistant || ""}
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                              />
                            </Form.Group>
                          }
                          
                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Select Franchise *</Form.Label>
                            <Select
                              placeholder={"Select"}
                              closeMenuOnSelect={true}
                              options={franchiseeData}
                              isDisabled={localStorage.getItem('user_role') !== 'franchisor_admin'}
                              // isMulti
                              value={franchiseeData?.filter(data => parseInt(data.id) === parseInt(formData?.franchisee_id))}
                              onChange={(e) => {
                                setFormData((prevState) => ({
                                  ...prevState,
                                  franchisee_id: e.id,
                                  open_coordinator: false
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
                          </Form.Group>
                          
                          {
                            formData?.role === 'educator' &&
                            <Form.Group className="col-md-6 mb-3 relative">
                              <Form.Label>Select Primary Coordinator *</Form.Label> 
                              <Select
                                isDisabled={formData.role !== 'educator'}
                                placeholder={formData.role === 'educator' ? "Select" : "disabled"}
                                closeMenuOnSelect={true}
                                value={coordinatorData?.filter(data => parseInt(data.id) === parseInt(formData?.coordinator))}
                                options={coordinatorData}
                                onChange={(e) => {
                                  setFormData((prevState) => ({
                                    ...prevState,
                                    coordinator: e.id,
                                  }));

                                  setFormData((prevState) => ({
                                    ...prevState,
                                    coordinatorObj: e
                                  }))
                                }}
                              />
                            </Form.Group>
                          }

                          {
                            formData && formData?.role !== 'guardian' &&
                            <Form.Group className="col-md-12 mb-3 relative">
                              <Form.Label>Business Assets</Form.Label>
                              <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti
                                placeholder="Select"
                                value={businessAssetData?.filter(d => formData?.businessAssets?.includes(parseInt(d.id)))}
                                options={businessAssetData}
                                onChange={(selectedOptions) => {
                                  setFormData((prevState) => ({
                                    ...prevState,
                                    businessAssets: [...selectedOptions.map(option => option.id)],
                                  }));
                                }}
                              />
                            </Form.Group>
                          }

                          {
                            formData?.assign_random_password === false &&
                            <>
                              <Form.Group className="col-md-6 mb-3 relative">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                  type="password"
                                  name="password"
                                  disabled={formData?.assign_random_password === true}
                                  value={formData.password ?? ''}
                                  onChange={(e) => {
                                    handleChange(e);
                                    setFormErrors(prevState => ({
                                      ...prevState,
                                      password: null
                                    }));
                                  }}
                                />
                                { formErrors.password !== null && <span className="error">{formErrors.password}</span> }
                              </Form.Group>

                              <Form.Group className="col-md-6 mb-3 relative">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                  type="password"
                                  name="confirm_password"
                                  disabled={formData?.assign_random_password === true}
                                  value={formData.confirm_password ?? ''}
                                  onChange={(e) => {
                                    handleChange(e);
                                    setFormErrors(prevState => ({
                                      ...prevState,
                                      confirm_password: null
                                    }));
                                  }}
                                />
                                { formErrors.confirm_password !== null && <span className="error">{formErrors.confirm_password}</span> }
                              </Form.Group>
                            </>
                          }
                          <div className="col-md-12 mb-3 relative passopt">
                          <Form.Label>Password Settings</Form.Label>
                          <Form.Group>
                            <div className="btn-checkbox">
                              <Form.Check
                                type="checkbox"
                                id="assign" className="p-0"
                                checked={formData?.assign_random_password}
                                label="Assign random password (sent to user via email)"
                                onChange={(e) => {
                                  if(formData?.assign_random_password === false) {
                                    setFormData(prevState => ({
                                      ...prevState,
                                      password: null,
                                      confirm_password: null
                                    }));
                                  }
                                  setFormData(prevState => ({
                                    ...prevState,
                                    assign_random_password: !formData?.assign_random_password
                                  }))
                                }} />
                            </div>

                            <div className="btn-checkbox">
                              <Form.Check
                                type="checkbox"
                                id="change" className="p-0"
                                checked={formData?.change_pwd_next_login}
                                label="Change password during next login"
                                onChange={(e) => {
                                  setFormData(prevState => ({
                                    ...prevState,
                                    change_pwd_next_login: !formData?.change_pwd_next_login

                                  }))
                                }} />
                            </div>
                          </Form.Group>
                          </div>
                          
                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Termination Date</Form.Label>
                            <Form.Control
                              type="date"
                              disabled={true}
                              name="terminationDate"
                              value={moment(formData?.terminationDate).format('YYYY-MM-DD') || ""}
                              onChange={(e) => setFormData(prevState => ({
                                ...prevState,
                                terminationData: e.target.value 
                              }))}
                            />
                            {
                              ((formData.termination_reach_me === false  || formData.termination_reach_me === null)) &&
                              parseInt(localStorage.getItem('user_id')) === parseInt(formData.id) &&
                              <p style={{ fontSize: "13px", marginTop: "10px" }}>Please fill in <strong style={{ color: '#C2488D', cursor: 'pointer' }}><span onClick={() => setShowConsentDialog(true)}>Termination Consent Form</span></strong> to set termination date</p>
                            }
                            {
                              formData.termination_reach_me === true &&
                              parseInt(localStorage.getItem('user_id')) === parseInt(formData.id) && 
                              <div>
                                <p style={{ fontSize: "14px" }}>You've consented to be terminated on <strong style={{ color: '#C2488D' }}>{moment(formData?.terminationDate).format('DD/MM/YYYY')} <span style={{ cursor: 'pointer' }} onClick={() => setShowConsentDialog(true)}>(edit)</span></strong>.</p>
                                <img style={{ width: "40px", height: "auto" }}src={`${signatureImage ||formData.user_signature}`} alt="" />
                              </div>
                              }
                              {
                                (localStorage.getItem('user_role') === 'franchisor_admin' || localStorage.getItem('user_role') === 'franchisee_admin') && formData?.termination_reach_me === true && 
                                <div>
                                  <p style={{ fontSize: "14px", marginTop: '10px' }}>Consent Form: <strong style={{ color: '#C2488D', cursor: 'pointer' }} onClick={() => setShowUserAgreementDialog(true)}>Click Here!</strong></p>
                                </div>
                              }
                          </Form.Group>
                          
                          <Form.Group className="col-md-12 mb-3 relative">
                            <Form.Label>Upload Documents</Form.Label>
                            <DragDropMultiple
                              module="user-management"
                              onSave={setTrainingDocuments}
                              setUploadError={setUploadError} />
                            <small className="fileinput">(pdf, doc, ppt, xslx and other documents)</small>
                            <small className="fileinput">(max. 5 files, 5MB each)</small>
                            {
                              uploadError  &&
                              uploadError.map(errorObj => {
                                return (
                                  // errorObj?.error[0].message
                                  <p style={{ color: 'tomato', fontSize: '12px' }}>{"File is greater than 5MB"}</p>
                                )
                              })
                            }
                            {
                              fetchedTrainingDocuments &&
                              fetchedTrainingDocuments.map(doc => {
                                return (
                                  <div>
                                    <a href={ doc?.link}><p>{doc.file_name || doc.name}</p></a>
                                    <img
                                      onClick={() => handleUserFileDelete(doc?.id)}
                                      style={{ width: "18px", height: "auto", cursor: "pointer", marginLeft: "5px" }}
                                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Delete-button.svg/862px-Delete-button.svg.png"
                                      alt="" />
                                  </div>
                                )
                              })
                            }
                            { formErrors.doc !== null && <span className="error">{formErrors.doc}</span> }
                          </Form.Group>

                          <Col md={12}>
                            <div className="cta text-center mt-5">
                              <Button variant="transparent" className="me-3">
                                <Link to="/user-management">
                                  Cancel
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
          {
            <Modal
              size="lg"
              show={showUserAgreementDialog}
              onHide={() => setShowUserAgreementDialog(false)}>
              <Modal.Header>
                <Modal.Title>Termination Agreement</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Row>
                  <p><strong>To whom it may concern,</strong></p>
                  
                  <div className="mt-2">
                    <p style={{ fontSize: "16px" }}>I hereby formally provide notice of my intention to terminate my arrangement with Mona.</p>
                    <p style={{ marginTop: "-10px", fontSize: "16px" }}>I am mindful of the required notice period, and propose a termination date of <strong style={{ color: '#C2488D' }}>{moment(formData.terminationDate).format('DD/MM/YYYY')}</strong>.</p>
                  </div>

                  <p></p>

                  <p className="form-check-label" for="flexCheckDefault">
                    I am happy to be reached if you have any questions.
                  </p>

                  <img style={{ width: '200px', height: 'auto' }} src={signatureImage || formData?.user_signature} alt="consented user signature" />
                </Row>
              </Modal.Body>

              <Modal.Footer style={{ alignItems: 'center', justifyContent: 'center', padding: "45px 60px" }}>
              <div className="text-center">
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ borderRadius: '5px', backgroundColor: '#3E5D58', padding: "8px 18px" }}onClick={() => setShowUserAgreementDialog(false)}>Close</button>
              </div>
              </Modal.Footer>
            </Modal>
          }
          {
            <Modal
              size="lg"
              show={showConsentDialog}
              onHide={() => setShowConsentDialog(false)}>
              <Modal.Header>
                <Modal.Title>Termination</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Row>
                  <p><strong>To whom it may concern,</strong></p>
                  
                  <div className="mt-2">
                    <p style={{ fontSize: "16px" }}>I hereby formally provide notice of my intention to terminate my arrangement with Mona.</p>
                    <p style={{ marginTop: "-10px", fontSize: "16px" }}>I am mindful of the required notice period, and propose a termination date of:</p>
                  </div>

                  <Form.Group className="col-md-6 mb-3 relative mt-4">
                    <Form.Label>Termination Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="terminationDate"
                      value={moment(formData?.terminationDate).format('YYYY-MM-DD')}
                      onChange={(e) => setFormData(prevState => ({
                        ...prevState,
                        terminationDate: e.target.value 
                      }))}
                    />
                  </Form.Group>

                  <Form.Group className="col-md-12 mb-6 mt-4">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        value="" 
                        id="flexCheckDefault"
                        checked={formData?.termination_reach_me ? true : false}
                        onChange={() => {
                          setFormData(prevState => ({
                            ...prevState,
                            termination_reach_me: !formData?.termination_reach_me 
                          }));
                        }} />
                      <label className="form-check-label" for="flexCheckDefault">
                        I am happy to be reached if you have any questions.
                      </label>
                    </div>
                  </Form.Group>
                </Row>
              </Modal.Body>

              <Modal.Footer style={{ alignItems: 'center', justifyContent: 'center', padding: "45px 60px" }}>
              <div className="text-center">
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ borderRadius: '5px', backgroundColor: '#3E5D58', padding: "8px 18px" }}onClick={() => {
                    handleConsentDialog();
                  }}>Submit</button>
              </div>
              </Modal.Footer>
            </Modal>
          }

          {
            <Modal
              size="lg"
              show={showSignatureDialog}
              onHide={() => setShowSignatureDialog(false)}>
              <Modal.Header>
                <Modal.Title>Termination</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Row>
                  <UserSignature
                    field_label="Signature:"
                    handleSignatureDialog={handleSignatureDialog}
                    setShowSignatureDialog={setShowSignatureDialog}
                    onChange={setSignatureImage} />
                </Row>
              </Modal.Body>

              <Modal.Footer style={{ alignItems: 'center', justifyContent: 'center', padding: "45px 60px" }}>
              <div className="text-center">
                {/* <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ borderRadius: '5px', backgroundColor: '#3E5D58', padding: "8px 18px" }}onClick={() => handleSignatureDialog()}>Submit</button> */}
              </div>
              </Modal.Footer>
            </Modal>
          }
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
                        <p>User details are being updated!</p>
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
        </section>
      </div>
    </>
  );
};

export default EditUser;

