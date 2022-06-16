import React, { useState, useEffect } from 'react';
import { Col, Container, Form, Row, Button, Modal } from 'react-bootstrap';
import { BASE_URL } from '../../components/App';
import TopHeader from '../../components/TopHeader';
import LeftNavbar from '../../components/LeftNavbar';
import Multiselect from 'multiselect-react-dropdown';
import MyEditor from '../CKEditor';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createCategoryValidation } from '../../helpers/validation';
import { useNavigate } from 'react-router-dom';
let selectedFranchisee = [];
let selectedUserRole = [];
let counter = 0;
const AddOperatingManual = () => {
  const navigate=useNavigate();
  const [operatingManualData, setOperatingManualData] = useState({});

  const [count, setCount] = useState();
  const [errors, setErrors] = useState({});
  const [loaderText, setLoaderText] = useState('');
  const [loaderFlag, setLoaderFlag] = useState(false);
  const [formSettingFlag, setFormSettingFlag] = useState(false);
  const [formSettingError, setFormSettingError] = useState({});
  const [formSettingData, setFormSettingData] = useState({});
  const [franchisee, setFranchisee] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const [category, setCategory] = useState([]);
  const [categoryModalFlag, setCategoryModalFlag] = useState(false);
  const [categoryData, setCategoryData] = useState({});
  const [categoryError, setCategoryError] = useState({});

  useEffect(() => {
    getCategory();
    getUserRoleAndFranchiseeData();
  }, []);

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
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("operating manual--->",operatingManualData);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    fetch(`${BASE_URL}/operating_manual/add`, {
      method: 'post',
      body: JSON.stringify(operatingManualData),
      headers: myHeaders,
    })
      .then((res) => res.json())
      .then((res) => {
        navigate("/operatingmanual");
      });
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
        let data=operatingManualData;
        data["category_name"]=result?.result[0]?.category_name;
        setOperatingManualData(data);
      })
      .catch((error) => console.log('error', error));
  };
  const uploadFiles = async (name, file) => {
    file = file[0];
    if (file.size > 2048 * 1024) {
      alert('file is too large');
    } else {
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
          } else {
            data[name] = res.url;
            setOperatingManualData(data);
            counter++;
            setCount(counter);

            setTimeout(() => {
              setLoaderFlag(false);
            }, 5000);
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
    selectedFranchisee.push({
      id: selectedItem.id,
      role_label: selectedItem.registered_name,
    });
    console.log('selected_item---->1selectedFranchisee', selectedFranchisee);
  }
  function onRemoveFranchisee(selectedList, removedItem) {
    const index = selectedFranchisee.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedFranchisee.splice(index, 1);
  }

  function onSelectUserRole(optionsList, selectedItem) {
    console.log('selected_item---->2', selectedItem);
    selectedUserRole.push({
      id: selectedItem.id,
      role_label: selectedItem.role_label,
    });
    console.log('selected_item---->1selectedFranchisee', selectedFranchisee);
  }
  function onRemoveUserRole(selectedList, removedItem) {
    const index = selectedUserRole.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedUserRole.splice(index, 1);
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
    fetch(`${BASE_URL}/api/franchisee-data`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        setFranchisee(res?.franchiseeList);
      })
      .catch((error) => console.log('error', error));
  };
  return (
    <>
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
                          onClick={() => {
                            setFormSettingFlag(true);
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
                          <Form.Label className="formlabel">
                            Sub-category Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="question"
                            placeholder="Lorem ipsum dolor sit ame"
                            onChange={(e) => {
                              setOperatingManualField(
                                e.target.name,
                                e.target.value
                              );
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Description
                          </Form.Label>
                          <MyEditor handleChange={setOperatingManualField} />
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
                              <img src="../img/video_icon_demo.png"></img>
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
                              <span>Remove</span>
                            </Button>
                          </div>
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
                                    <Col sm={4}>
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
                  <Form.Label>Applicable to all franchisee</Form.Label>
                  <div className="new-form-radio">
                    <div className="new-form-radio-box">
                      <label for="yes">
                        <input
                          type="radio"
                          value="Yes"
                          name="applicable_to_franchisee"
                          id="yes"
                          onChange={(e) => {
                            setFormSettingFields(e.target.name, e.target.value);
                          }}
                          checked={
                            formSettingData?.applicable_to_franchisee ===
                              true ||
                            formSettingData?.applicable_to_franchisee === 'Yes'
                          }
                        />
                        <span className="radio-round"></span>
                        <p>Yes</p>
                      </label>
                    </div>
                    <div className="new-form-radio-box">
                      <label for="no">
                        <input
                          type="radio"
                          value="No"
                          name="applicable_to_franchisee"
                          id="no"
                          onChange={(e) => {
                            setFormSettingFields(e.target.name, e.target.value);
                          }}
                          checked={
                            formSettingData?.applicable_to_franchisee ===
                              false ||
                            formSettingData?.applicable_to_franchisee === 'No'
                          }
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              {formSettingData?.applicable_to_franchisee === 'No' ||
              formSettingData?.applicable_to_franchisee === false ? (
                <Col lg={9} md={6} className="mt-3 mt-md-0">
                  <Form.Group>
                    <Form.Label>Select Franchisee</Form.Label>
                    <Multiselect
                      displayValue="registered_name"
                      className="multiselect-box default-arrow-select"
                      placeholder="Select Franchisee"
                      selectedValues={selectedFranchisee}
                      onKeyPressFn={function noRefCheck() {}}
                      onRemove={onRemoveFranchisee}
                      onSearch={function noRefCheck() {}}
                      onSelect={onSelectFranchisee}
                      options={franchisee}
                    />
                    <p className="error">{formSettingError.franchisee}</p>
                  </Form.Group>
                </Col>
              ) : null}
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label>Applicable to all users</Form.Label>
                  <div className="new-form-radio">
                    <div className="new-form-radio-box">
                      <label for="yes1">
                        <input
                          type="radio"
                          value="Yes"
                          name="applicable_to_user"
                          id="yes1"
                          onChange={(e) => {
                            setFormSettingFields(e.target.name, e.target.value);
                          }}
                          checked={
                            formSettingData?.applicable_to_user == true ||
                            formSettingData?.applicable_to_user === 'Yes'
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
                          value="No"
                          name="applicable_to_user"
                          id="no1"
                          onChange={(e) => {
                            setFormSettingFields(e.target.name, e.target.value);
                          }}
                          checked={
                            formSettingData?.applicable_to_user == false ||
                            formSettingData?.applicable_to_user === 'No'
                          }
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              {formSettingData?.applicable_to_user === 'No' ||
              formSettingData?.applicable_to_user === false ? (
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
                    <p className="error">{formSettingError.user}</p>
                  </Form.Group>
                </Col>
              ) : null}
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button className="back">Cancel</Button>
          <Button className="done">Save Settings</Button>
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
