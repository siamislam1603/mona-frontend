import React, { useState, useEffect } from 'react';
import { Col, Container, Form, Row, Button, Modal } from 'react-bootstrap';
import { BASE_URL } from '../../components/App';
import TopHeader from '../../components/TopHeader';
import LeftNavbar from '../../components/LeftNavbar';
import Multiselect from 'multiselect-react-dropdown';
import MyEditor from '../CKEditor';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  createCategoryValidation,
  createOperatingManualValidation,
} from '../../helpers/validation';
import { useLocation, useNavigate } from 'react-router-dom';
let selectedFranchisee = [];
let selectedUserRole = [];
let selectedFranchiseeName = '';
let selectedUserRoleName = '';
let counter = 0;
const AddOperatingManual = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [operatingManualData, setOperatingManualData] = useState({});

  const [count, setCount] = useState();
  const [errors, setErrors] = useState({});
  const [loaderText, setLoaderText] = useState('');
  const [loaderFlag, setLoaderFlag] = useState(false);
  const [formSettingFlag, setFormSettingFlag] = useState(false);
  const [formSettingError, setFormSettingError] = useState({});
  const [formSettingData, setFormSettingData] = useState({
    applicable_to_franchisee: '1',
    applicable_to_user: '1',
  });
  const [franchisee, setFranchisee] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const [category, setCategory] = useState([]);
  const [categoryModalFlag, setCategoryModalFlag] = useState(false);
  const [categoryData, setCategoryData] = useState({});
  const [categoryError, setCategoryError] = useState({});

  useEffect(() => {
    getCategory();
    console.log('location---->', location);
    if (location?.state?.id && location?.state?.category_name) {
      getOneOperatingManual();
    }
    getUserRoleAndFranchiseeData();
  }, []);
  const getOneOperatingManual = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `${BASE_URL}/operating_manual/one?id=${location?.state?.id}&category_name=${location?.state?.category_name}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
        console.log('result---->', result?.result);
        setOperatingManualData(result?.result);
      })
      .catch((error) => console.log('error', error));
  };
  const setCategoryField = (field, value) => {
    setCategoryData({ ...categoryData, [field]: value });
    if (!!categoryError[field]) {
      setCategoryError({
        ...categoryError,
        [field]: null,
      });
    }
  };
  const setOperatingManualField = (field, value) => {
    setOperatingManualData({ ...operatingManualData, [field]: value });
    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };
  const onModelSubmit = (e) => {
    e.preventDefault();
    let data = operatingManualData;
    if (!data?.id) {
      alert('Please save first operating manual information');
    } else {
      data['access_to_all_user'] = formSettingData.applicable_to_user;
      data['access_to_all_franchise'] =
        formSettingData.applicable_to_franchisee;
      data['shared_with'] = selectedFranchiseeName;
      data['shared_role'] = selectedUserRoleName;
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      fetch(`${BASE_URL}/operating_manual/add`, {
        method: 'post',
        body: JSON.stringify(operatingManualData),
        headers: myHeaders,
      })
        .then((res) => res.json())
        .then((res) => {
          setOperatingManualData(res?.result);
          setFormSettingFlag(false);
          // navigate('/operatingmanual');
        });
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const newErrors = createOperatingManualValidation(operatingManualData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log('operating manual--->', operatingManualData);
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      fetch(`${BASE_URL}/operating_manual/add`, {
        method: 'post',
        body: JSON.stringify(operatingManualData),
        headers: myHeaders,
      })
        .then((res) => res.json())
        .then((res) => {
          setOperatingManualData(res?.result);
          // navigate('/operatingmanual');
        });
    }
  };
  const OnCategorySubmit = (e) => {
    e.preventDefault();
    const newErrors = createCategoryValidation(categoryData);
    if (Object.keys(newErrors).length > 0) {
      setCategoryError(newErrors);
    } else {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      fetch(`${BASE_URL}/operating_manual/category/add`, {
        method: 'post',
        body: JSON.stringify(categoryData),
        headers: myHeaders,
      })
        .then((res) => res.json())
        .then((res) => {
          setCategory(res?.result);
          setCategoryModalFlag(false);
          let data = operatingManualData;
          data['category_name'] = categoryData?.category_name;
          setOperatingManualData(data);
        });
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const getCategory = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/operating_manual/category`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
        console.log('result---->', result?.result);
        setCategory(result.result);
        let data = operatingManualData;
        data['category_name'] = result?.result[0]?.category_name;
        setOperatingManualData(data);
      })
      .catch((error) => console.log('error', error));
  };
  const uploadFiles = async (name, file) => {
    let flag = false;
    file = file[0];
    if (!(name === 'reference_video')) {
      setLoaderFlag(true);
      setLoaderText('video');
      if (file.size > 2048 * 1024) {
        alert('file is too large');
        flag = true;
      }
    }

    if (flag === false) {
      let data = operatingManualData;
      const body = new FormData();
      const blob = await fetch(await toBase64(file)).then((res) => res.blob());
      body.append('image', blob, file.name);
      body.append('description', 'operating manual');
      body.append('title', name);
      body.append('uploadedBy', 'vaibhavi');
      if (name === 'cover_image') {
        setLoaderFlag(true);
        setLoaderText('image');
      }
      if (name === 'reference_video') {
        setLoaderFlag(true);
        setLoaderText('video');
      }
      if (name === 'related_files') {
        setLoaderFlag(true);
        setLoaderText('files');
      }

      var myHeaders = new Headers();
      myHeaders.append('role', 'admin');
      fetch(`${BASE_URL}/uploads/uiFiles`, {
        method: 'post',
        body: body,
        headers: myHeaders,
      })
        .then((res) => res.json())
        .then((res) => {
          if (name === 'related_files') {
            if (!data[name]) {
              data[name] = [];
            }

            data[name].push({ name: file.name, url: res.url });
            setOperatingManualData(data);
            counter++;
            setCount(counter);
            setLoaderFlag(false);
          } else if (name === 'reference_video') {
            data['video_thumbnail'] = res.thumbnail;
            data[name] = res.url;
            setOperatingManualData(data);
            counter++;
            setCount(counter);

            setTimeout(() => {
              setLoaderFlag(false);
            }, 8000);
          } else {
            data[name] = res.url;
            setOperatingManualData(data);
            counter++;
            setCount(counter);

            setTimeout(() => {
              setLoaderFlag(false);
            }, 5000);
          }
          if (!!errors[name]) {
            setErrors({
              ...errors,
              [name]: null,
            });
          }
        })
        .catch((err) => {
          console.log('error---->', err);
        });
      counter++;
      setCount(counter);
    }
  };

  const setFormSettingFields = (field, value) => {
    setFormSettingData({ ...formSettingData, [field]: value });

    if (!!formSettingError[field]) {
      setFormSettingError({
        ...formSettingError,
        [field]: null,
      });
    }
  };
  function onSelectFranchisee(optionsList, selectedItem) {
    console.log('selected_item---->2', selectedItem);
    selectedFranchiseeName += selectedItem.franchisee_name + ',';
    selectedFranchisee.push({
      id: selectedItem.id,
      franchisee_name: selectedItem.franchisee_name,
    });
    {
      console.log('selectedFranchisee---->', selectedFranchisee);
    }
  }
  function onRemoveFranchisee(selectedList, removedItem) {
    selectedFranchiseeName = selectedFranchiseeName.replace(
      removedItem.franchisee_name + ',',
      ''
    );
    const index = selectedFranchisee.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedFranchisee.splice(index, 1);
    {
      console.log('selectedFranchisee---->', selectedFranchisee);
    }
  }

  function onSelectUserRole(optionsList, selectedItem) {
    console.log('selected_item---->2', selectedItem);
    selectedUserRoleName += selectedItem.role_label + ',';
    selectedUserRole.push({
      id: selectedItem.id,
      role_label: selectedItem.role_label,
    });
    console.log('form---->2selectedUserRole', selectedUserRole);
  }
  function onRemoveUserRole(selectedList, removedItem) {
    selectedUserRoleName = selectedUserRoleName.replace(
      removedItem.role_label + ',',
      ''
    );
    const index = selectedUserRole.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedUserRole.splice(index, 1);
    console.log('form---->2selectedUserRole', selectedUserRole);
  }
  const getUserRoleAndFranchiseeData = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/api/user-role`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        setUserRole(res?.userRoleList);
        console.log('response0-------->1', res?.userRoleList);
      })
      .catch((error) => console.log('error', error));
    fetch(`${BASE_URL}/role/franchisee`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        setFranchisee(res?.franchiseeList);
      })
      .catch((error) => console.log('error', error));
  };
  return (
    <>
      {console.log('errors--->', errors)}
      {console.log('operating manual--->', operatingManualData)}
      <div id="main">
        <section className="mainsection ">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
                <div className="new_module">
                  <TopHeader />
                  <Row>
                    <Col sm={12}>
                      <div className="mynewForm-heading">
                        <h4 className="mynewForm">New Category</h4>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            const newErrors =
                              createOperatingManualValidation(
                                operatingManualData
                              );
                            if (Object.keys(newErrors).length > 0) {
                              setErrors(newErrors);
                            } else {
                              setFormSettingFlag(true);
                            }
                          }}
                        >
                          <img src="../../img/carbon_settings.svg" />
                        </Button>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="select_module">
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Select Category
                          </Form.Label>
                          <Form.Select
                            name="category_name"
                            value={operatingManualData.category_name}
                            onChange={(e) => {
                              setOperatingManualField(
                                e.target.name,
                                e.target.value
                              );
                            }}
                          >
                            {category.map((item) => {
                              return (
                                <option value={item.name}>
                                  {item.category_name}
                                </option>
                              );
                            })}
                          </Form.Select>
                        </Form.Group>
                      </div>
                    </Col>
                    <Col sm={6} className="add_fields">
                      <Button
                        onClick={() => {
                          setCategoryModalFlag(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Add New Category
                      </Button>
                    </Col>
                  </Row>
                  <div className="my-new-formsection">
                    <Row>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label className="formlabel">title</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            value={operatingManualData?.title}
                            placeholder="Enter Title"
                            onChange={(e) => {
                              setOperatingManualField(
                                e.target.name,
                                e.target.value
                              );
                            }}
                            isInvalid={!!errors.title}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.title}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Description
                          </Form.Label>
                          <MyEditor
                            operatingManual={operatingManualData}
                            errors={errors}
                            handleChange={setOperatingManualField}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Upload Cover Image :
                          </Form.Label>
                          <div className="upload_cover_box">
                            <div className="cover_image">
                              {loaderFlag && loaderText === 'image' ? (
                                <img src="../img/loader.gif" />
                              ) : null}
                              <img
                                src={
                                  operatingManualData?.cover_image
                                    ? operatingManualData?.cover_image
                                    : '../img/image_icon.png'
                                }
                              ></img>
                            </div>
                            <div className="add_image">
                              <div className="add_image_box">
                                <span>
                                  <img
                                    src="../img/bi_cloud-upload.svg"
                                    alt=""
                                  />
                                  Add Image
                                </span>
                                <Form.Control
                                  className="add_image_input"
                                  type="file"
                                  name="cover_image"
                                  onChange={(e) => {
                                    if (e.target.files) {
                                      uploadFiles(
                                        e.target.name,
                                        e.target.files
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <Button
                              variant="link"
                              onClick={() => {
                                let data = operatingManualData;
                                delete data['cover_image'];
                                setOperatingManualData(data);
                                counter++;
                                setCount(counter);
                              }}
                            >
                              <img src="../../img/removeIcon.svg" />
                            </Button>
                          </div>
                          <p className="form-errors">{errors.cover_image}</p>
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Upload Reference Video Here :
                          </Form.Label>

                          <div className="upload_cover_box video_reference">
                            <div className="cover_image">
                              {loaderFlag && loaderText === 'video' ? (
                                <img src="../img/loader.gif" />
                              ) : null}
                              <img
                                src={
                                  operatingManualData?.video_thumbnail
                                    ? operatingManualData?.video_thumbnail
                                    : '../img/video_icon_demo.png'
                                }
                              ></img>
                            </div>
                            <div className="add_image">
                              <div className="add_image_box">
                                <span>
                                  <img
                                    src="../img/bi_cloud-upload.svg"
                                    alt=""
                                  />
                                  Add File
                                </span>
                                <Form.Control
                                  className="add_image_input"
                                  type="file"
                                  name="reference_video"
                                  onChange={(e) => {
                                    if (e.target.files) {
                                      uploadFiles(
                                        e.target.name,
                                        e.target.files
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <Button
                              variant="link"
                              className="remove_bin"
                              onClick={() => {
                                let data = operatingManualData;
                                delete data['reference_video'];
                                setOperatingManualData(data);
                                counter++;
                                setCount(counter);
                              }}
                            >
                              <img src="../../img/removeIcon.svg" />
                              {/* <span>Remove</span> */}
                            </Button>
                          </div>
                          <p className="form-errors">
                            {errors.reference_video}
                          </p>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12}>
                        <div className="upload_related_files">
                          <Form.Group>
                            <Form.Label className="formlabel">
                              Upload Related Files :
                            </Form.Label>
                            <Row>
                              {operatingManualData?.related_files?.map(
                                (item, index) => {
                                  return (
                                    <Col sm={6}>
                                      <div className="upload_related_box">
                                        <div className="forms-content">
                                          <div className="content-icon-section">
                                            <img
                                              src={
                                                item.name.includes('.docx')
                                                  ? '../img/doc_blue.svg'
                                                  : item.name.includes('.pptx')
                                                  ? '../img/doc_pptx.svg'
                                                  : ''
                                              }
                                            />
                                          </div>
                                          <div className="content-title-section">
                                            <h6>{item.name}</h6>
                                            <h4>3 Hours</h4>
                                          </div>
                                        </div>
                                        <Button
                                          variant="link"
                                          onClick={() => {
                                            let data = operatingManualData;
                                            data.related_files.splice(index, 1);
                                            setOperatingManualData(data);
                                            counter++;
                                            setCount(counter);
                                          }}
                                        >
                                          <img src="../../img/removeIcon.svg" />
                                        </Button>
                                      </div>
                                    </Col>
                                  );
                                }
                              )}
                              {/* <Col sm={4}>
                                <div className="upload_related_box">
                                  <div className="forms-content">
                                    <div className="content-icon-section">
                                      <img src="../img/doc_pptx.svg" />
                                    </div>
                                    <div className="content-title-section">
                                      <h6>presentation1.pptx</h6>
                                      <h4>3 Hours</h4>
                                    </div>
                                  </div>
                                  <Button variant="link">
                                    <img src="../../img/removeIcon.svg" />
                                  </Button>
                                </div>
                              </Col> */}
                            </Row>
                            <div className="add_image">
                              <div className="add_image_box">
                                <span>
                                  <img
                                    src={
                                      loaderFlag && loaderText === 'files'
                                        ? '../img/mini_loader.gif'
                                        : '../img/bi_cloud-upload.svg'
                                    }
                                    alt=""
                                  />
                                  Add File
                                </span>
                                <Form.Control
                                  className="add_image_input"
                                  type="file"
                                  name="related_files"
                                  onChange={(e) => {
                                    if (e.target.files) {
                                      uploadFiles(
                                        e.target.name,
                                        e.target.files
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <p className="form-errors">
                              {errors.related_files}
                            </p>
                          </Form.Group>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <Row>
                    <Col sm={12}>
                      <div className="bottom_button">
                        <Button className="preview">Preview</Button>
                        <Button className="saveForm" onClick={onSubmit}>
                          Save
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
      <Modal
        show={formSettingFlag}
        onHide={() => setFormSettingFlag(false)}
        size="lg"
        className="form-settings-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="modal-heading"
          >
            <img src="../../img/carbon_settings.svg" />
            Form Settings
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settings-content">
            <Row className="mt-4">
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label>Accessible to all franchisee</Form.Label>
                  <div className="new-form-radio">
                    <div className="new-form-radio-box">
                      <label for="yes1">
                        <input
                          type="radio"
                          value="1"
                          name="applicable_to_franchisee"
                          id="yes1"
                          onChange={(e) => {
                            setFormSettingFields(e.target.name, e.target.value);
                          }}
                          checked={
                            formSettingData.applicable_to_franchisee === '1'
                          }
                        />
                        <span className="radio-round"></span>
                        <p>Yes</p>
                      </label>
                    </div>
                    <div className="new-form-radio-box">
                      <label for="no1">
                        <input
                          type="radio"
                          value="0"
                          name="applicable_to_franchisee"
                          id="no1"
                          onChange={(e) => {
                            setFormSettingFields(e.target.name, e.target.value);
                          }}
                          checked={
                            formSettingData.applicable_to_franchisee === '0'
                          }
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              {formSettingData.applicable_to_franchisee === '0' ? (
                <Col lg={9} md={6} className="mt-3 mt-md-0">
                  <Form.Group>
                    <Form.Label>Select Franchisee</Form.Label>
                    <Multiselect
                      displayValue="franchisee_name"
                      className="multiselect-box default-arrow-select"
                      placeholder="Select Franchisee"
                      selectedValues={selectedFranchisee}
                      onKeyPressFn={function noRefCheck() {}}
                      onRemove={onRemoveFranchisee}
                      onSearch={function noRefCheck() {}}
                      onSelect={onSelectFranchisee}
                      options={franchisee}
                    />
                    <p className="error">{errors.franchisee}</p>
                  </Form.Group>
                </Col>
              ) : null}
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label>Applicable to all user roles</Form.Label>
                  <div className="new-form-radio">
                    <div className="new-form-radio-box">
                      <label for="yes2">
                        <input
                          type="radio"
                          value="1"
                          name="applicable_to_user"
                          id="yes2"
                          onChange={(e) => {
                            setFormSettingFields(e.target.name, e.target.value);
                          }}
                          checked={formSettingData.applicable_to_user === '1'}
                        />
                        <span className="radio-round"></span>
                        <p>Yes</p>
                      </label>
                    </div>
                    <div className="new-form-radio-box">
                      <label for="no2">
                        <input
                          type="radio"
                          value="0"
                          name="applicable_to_user"
                          id="no2"
                          onChange={(e) => {
                            setFormSettingFields(e.target.name, e.target.value);
                          }}
                          checked={formSettingData.applicable_to_user === '0'}
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              {formSettingData.applicable_to_user === '0' ? (
                <Col lg={9} md={6} className="mt-3 mt-md-0">
                  <Form.Group>
                    <Form.Label>Select User Roles</Form.Label>
                    <Multiselect
                      placeholder="Select User Roles"
                      displayValue="role_label"
                      selectedValues={selectedUserRole}
                      className="multiselect-box default-arrow-select"
                      onKeyPressFn={function noRefCheck() {}}
                      onRemove={onRemoveUserRole}
                      onSearch={function noRefCheck() {}}
                      onSelect={onSelectUserRole}
                      options={userRole}
                    />
                    <p className="error">{errors.user}</p>
                  </Form.Group>
                </Col>
              ) : null}
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button className="back">Cancel</Button>
          <Button className="done" onClick={onModelSubmit}>
            Save Settings
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={categoryModalFlag}
        onHide={() => {
          setCategoryModalFlag(false);
        }}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="modal-heading"
          >
            Add Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settings-content">
            <Row className="mt-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="category_name"
                    onChange={(e) => {
                      setCategoryField(e.target.name, e.target.value);
                    }}
                    isInvalid={!!categoryError.category_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {categoryError.category_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            className="back"
            onClick={() => {
              setCategoryModalFlag(false);
            }}
          >
            Cancel
          </Button>
          <Button className="done" onClick={OnCategorySubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddOperatingManual;
