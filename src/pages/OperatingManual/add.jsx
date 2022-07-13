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
import DropAllRelatedFile from '../../components/DragDropMultipleRelatedFiles';
let selectedUserId = '';
let upperRoleUser = '';
const AddOperatingManual = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [operatingManualData, setOperatingManualData] = useState({
    related_files: [],
  });
  const [errors, setErrors] = useState({});
  const [ImageloaderFlag, setImageLoaderFlag] = useState(false);
  const [videoloaderFlag, setVideoLoaderFlag] = useState(false);
  const [filesLoaderFlag, setFilesLoaderFlag] = useState(false);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [imageUrl,setImageUrl]=useState("");
  const [videoUrl,setVideoUrl]=useState("");
  const [videoThumbnailUrl,setVideoThumbnailUrl]=useState("");
  const [formSettingFlag, setFormSettingFlag] = useState(false);
  const [formSettingError, setFormSettingError] = useState({});
  const [formSettingData, setFormSettingData] = useState({ shared_role: '' });
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const [category, setCategory] = useState([]);
  const [categoryModalFlag, setCategoryModalFlag] = useState(false);
  const [categoryData, setCategoryData] = useState({});
  const [categoryError, setCategoryError] = useState({});
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [selectedFranchiseeId, setSelectedFranchiseeId] = useState(null);
  useEffect(() => {
    getUserRoleData();
  }, []);
  useEffect(() => {
    getUser();
  }, [selectedFranchisee]);
  useEffect(() => {
    getCategory();
  }, [user]);
  useEffect(() => {
    getCategory();
  }, [selectedFranchiseeId]);
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
    let api_url = '';
    if (selectedFranchisee) {
      if (selectedFranchisee === 'All') api_url = `${BASE_URL}/auth/users`;
      else
        api_url = `${BASE_URL}/user-group/users/franchisee/${selectedFranchisee
          .split(',')[0]
          .split(' ')
          .map((d) => d.charAt(0).toLowerCase() + d.slice(1))
          .join('_')}`;
    } else {
      api_url = `${BASE_URL}/auth/users`;
    }
    fetch(api_url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result?.data?.map((item) => {
          item['status'] = false;
        });
        if (selectedFranchisee) {
          if (selectedFranchisee === 'All') setUser(result?.data);
          else setUser(result?.users);
        } else setUser(result?.data);
      })
      .catch((error) => console.log('error', error));
  };
  const getOneOperatingManual = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    await fetch(
      `${BASE_URL}/operating_manual/one?id=${
        location?.state?.id
      }&category_name=${
        location?.state?.category_name
      }&franchisee_id=${localStorage.getItem('f_id')}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((response) => {
        console.log('operating manual--->', response?.result);
        setOperatingManualData(response?.result);
        let data = formSettingData;
        data['applicable_to_all'] =
          response?.result?.permission?.accessible_to_all;

        data['accessible_to_role'] =
          response?.result?.permission?.accessible_to_role;
        // if (response?.result?.permission?.accessible_to_role === 0) {
        if (Object.keys(response?.result?.permission).length === 0) {
          selectedUserId = '';
          setSelectedUser({});
          data['shared_role'] = '';
        }
        let users = [];
        selectedUserId = '';
        user.map((item) => {
          if (
            response?.result?.permission?.shared_with.includes(
              item.id.toString()
            )
          ) {
            users.push(item);
            selectedUserId += item.id + ',';
          }
        });
        console.log('users-retretertetretert-->', users);
        setSelectedUser(users);
        // }
        // else
        // {
        let role = '';
        response?.result?.permission?.shared_role.map((item) => {
          role += item + ',';
        });
        data['shared_role'] = role;
        // }
        setFormSettingData(data);
      })
      .catch((error) => console.log('error', error));
  };
  const getUpperRoleUser = () => {
    let upper_role = '';
    let flag = false;
    userRole?.map((item) => {
      if (item.role_name !== localStorage.getItem('user_role')) {
        if (!flag) upper_role += item.role_name + ',';
      } else {
        flag = true;
      }
    });
    return upper_role.slice(0, -1);
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
      console.log(
        'formSettingData.accessible_to_role---->',
        formSettingData.shared_role
      );

      if (formSettingData.shared_role === '' && selectedUserId === '') {
        console.log('Hello');
        data['accessible_to_role'] = null;
        data['accessible_to_all'] = true;
      } else {
        // if (formSettingData.accessible_to_role === 1) {
        data['shared_role'] = formSettingData.shared_role
          ? formSettingData.shared_role.slice(0, -1)
          : null;
        // data['shared_with'] = null;
        data['accessible_to_role'] = null;
        data['accessible_to_all'] = false;
        // } else {
        data['shared_with'] = selectedUserId
          ? selectedUserId.slice(0, -1)
          : null;
        // data['shared_role'] = null;
        // data['accessible_to_role'] = formSettingData.accessible_to_role;
        // data['accessible_to_all'] = false;
        // }
      }
      data['cover_image']=imageUrl;
      data['video_thumbnail']=videoThumbnailUrl;
      data['reference_video']=videoUrl;
      data['created_by'] = localStorage.getItem('user_id');
      data['shared_by'] = localStorage.getItem('user_id');
      upperRoleUser = getUpperRoleUser();
      data['upper_role'] = upperRoleUser;
      data['franchisee_id'] = selectedFranchiseeId;
      console.log('Hello---->', data);

      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      fetch(`${BASE_URL}/operating_manual/add`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: myHeaders,
      })
        .then((res) => res.json())
        .then((res) => {
          setOperatingManualData(res?.result);
          setFormSettingFlag(false);
          navigate('/operatingmanual');
        });
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const newErrors = createOperatingManualValidation(operatingManualData,imageUrl,videoUrl);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      upperRoleUser = getUpperRoleUser();
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      let data = { ...operatingManualData };
      data['cover_image']=imageUrl;
      data['video_thumbnail']=videoThumbnailUrl;
      data['reference_video']=videoUrl;
      data.created_by = localStorage.getItem('user_id');
      data.upper_role = upperRoleUser;
      console.log('data---->', data);
      fetch(`${BASE_URL}/operating_manual/add`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: myHeaders,
      })
        .then((res) => res.json())
        .then((res) => {
          setOperatingManualData(res?.result);
          setFormSettingFlag(true);
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
        if (location?.state?.id && location?.state?.category_name) {
          getOneOperatingManual();
        } else {
          let data = operatingManualData;
          data['category_name'] = result?.result[0]?.category_name;
          setOperatingManualData(data);
        }
      })
      .catch((error) => console.log('error', error));
  };

  const uploadFiles = async (name, file) => {
    let flag = false;
    if (name === 'cover_image') {
      if (file.size > 2048 * 1024) {
        let errorData = { ...errors };
        errorData['cover_image'] = 'File is too much large';
        setErrors(errorData);
        flag = true;
      }
    }
    if (name === 'reference_video') {
      if (file.size > 1024 * 1024 * 1024) {
        let errorData = { ...errors };
        errorData['reference_video'] = 'File is too much large';
        setErrors(errorData);
        flag = true;
      }
    }

    if (flag === false) {
      if (name === 'cover_image') {
        setImageLoaderFlag(true);
      }
      if (name === 'reference_video') {
        setVideoLoaderFlag(true);
      }

      const body = new FormData();
      const blob = await fetch(await toBase64(file)).then((res) => res.blob());
      body.append('image', blob, file.name);
      body.append('description', 'operating manual');
      body.append('title', name);
      body.append('uploadedBy', 'vaibhavi');

      var myHeaders = new Headers();
      myHeaders.append('shared_role', 'admin');
      fetch(`${BASE_URL}/uploads/uiFiles`, {
        method: 'post',
        body: body,
        headers: myHeaders,
      })
        .then((res) => res.json())
        .then((res) => {
          if (name === 'reference_video') {
            setVideoThumbnailUrl(res.thumbnail);
            setVideoUrl(res.url);

            setTimeout(() => {
              setVideoLoaderFlag(false);
            }, 8000);
          }
          if (name === 'cover_image') {
             setImageUrl(res.url);
            

            setTimeout(() => {
              setImageLoaderFlag(false);
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
  function onSelectUser(optionsList, selectedItem) {
    console.log('selected_item---->2', selectedItem);
    selectedUserId += selectedItem.id + ',';
    selectedUser.push({
      id: selectedItem.id,
      email: selectedItem.email,
    });
    console.log('selectedUser---->', selectedUser);
  }
  function onRemoveUser(selectedList, removedItem) {
    selectedUserId = selectedUserId.replace(removedItem.id + ',', '');
    const index = selectedUser.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedUser.splice(index, 1);
    {
      console.log('selectedUser---->', selectedUser);
    }
  }
  const getUserRoleData = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/api/user-role`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log('res---->', res);
        // console.log('response0-------->1', localStorage.getItem('user_role'));
        setUserRole(res?.userRoleList);
      })
      .catch((error) => console.log('error', error));
  };

  selectedFranchisee && console.log('sds ->>>', selectedFranchisee);
  return (
    <>
      {console.log('selectedFranchiseeId--->', selectedFranchiseeId)}
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
                  <TopHeader
                    selectedFranchisee={selectedFranchisee}
                    setSelectedFranchisee={(name, id) => {
                      setSelectedFranchisee(name);
                      setSelectedFranchiseeId(id);
                      localStorage.setItem('f_id', id);
                    }}
                  />{' '}
                  <Row>
                    <Col sm={12}>
                      <div className="mynewForm-heading">
                        <h4 className="mynewForm">New Operating Manual</h4>
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
                              if (
                                location?.state?.id &&
                                location?.state?.category_name
                              ) {
                                getOneOperatingManual();
                              }
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
                        <FontAwesomeIcon icon={faPlus} /> Add New Operating
                        Manual
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
                         
                          {location?.state?.id &&
                          location?.state?.category_name ? (
                            <MyEditor
                              operatingManual={{ ...operatingManualData }}
                              errors={errors}
                              handleChange={(e, data) => {
                                setOperatingManualField(e, data);
                              }}
                            />
                          ) : (
                            <MyEditor
                              errors={errors}
                              handleChange={(e, data) => {
                                setOperatingManualField(e, data);
                              }}
                            />
                          )}
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
                              {ImageloaderFlag ? (
                                <img src="../img/loader.gif" />
                              ) : null}
                              <img
                                src={
                                 imageUrl
                                    ? imageUrl
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
                                        e.target.files[0]
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <Button
                              variant="link"
                              onClick={() => {
                                let data = { ...operatingManualData };
                                delete data['cover_image'];
                                setOperatingManualData(data);
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
                              {videoloaderFlag ? (
                                <img src="../img/loader.gif" />
                              ) : null}
                              <img
                                src={
                                  videoThumbnailUrl
                                    ? videoThumbnailUrl
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
                                    console.log(
                                      'e.target.files---->',
                                      e.target.files
                                    );
                                    if (e.target.files) {
                                      uploadFiles(
                                        e.target.name,
                                        e.target.files[0]
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
                                let data = { ...operatingManualData };
                                delete data['reference_video'];
                                delete data['video_thumbnail'];
                                setOperatingManualData(data);
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

                            <DropAllRelatedFile
                              onSave={(value) => {
                                let data = { ...operatingManualData };
                                data['related_files'] = value;
                                setOperatingManualData(data);
                              }}
                              relatedFilesData={
                                operatingManualData.related_files
                              }
                            />
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
                        {/* <Button className="preview">Preview</Button> */}
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
              {/* <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label>Accessible to:</Form.Label>
                  <div className="new-form-radio d-block">
                    <div className="new-form-radio-box">
                      <label for="yes">
                        <input
                          type="radio"
                          value={1}
                          name="accessible_to_role"
                          id="yes"
                          onChange={(e) => {
                            setFormSettingFields(
                              e.target.name,
                              parseInt(e.target.value)
                            );
                          }}
                          checked={formSettingData.accessible_to_role === 1}
                        />
                        <span className="radio-round"></span>
                        <p>User Roles</p>
                      </label>
                    </div>
                    <div className="new-form-radio-box m-0 mt-3">
                      <label for="no">
                        <input
                          type="radio"
                          value={0}
                          name="accessible_to_role"
                          id="no"
                          onChange={(e) => {
                            setFormSettingFields(
                              e.target.name,
                              parseInt(e.target.value)
                            );
                          }}
                          checked={formSettingData.accessible_to_role === 0}
                        />
                        <span className="radio-round"></span>
                        <p>Specific Users</p>
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </Col> */}
              <Col lg={12} md={12}>
                {/* {formSettingData.accessible_to_role === 1 ? ( */}
                <Form.Group>
                  <Form.Label>Select User Roles</Form.Label>
                  <div className="modal-two-check user-roles-box">
                    <label className="container">
                      Co-ordinators
                      <input
                        type="checkbox"
                        name="shared_role"
                        id="coordinator"
                        onClick={(e) => {
                          let data = { ...formSettingData };
                          if (
                            !data['shared_role']
                              .toString()
                              .includes(e.target.id)
                          ) {
                            data['shared_role'] += e.target.id + ',';
                          } else {
                            data['shared_role'] = data['shared_role'].replace(
                              e.target.id + ',',
                              ''
                            );
                            if (data['shared_role'].includes('all')) {
                              data['shared_role'] = data['shared_role'].replace(
                                'all,',
                                ''
                              );
                            }
                          }
                          setFormSettingData(data);
                        }}
                        checked={formSettingData?.shared_role
                          ?.toString()
                          .includes('coordinator')}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container">
                      Educators
                      <input
                        type="checkbox"
                        name="shared_role"
                        id="educator"
                        onClick={(e) => {
                          let data = { ...formSettingData };
                          console.log(
                            "data['shared_role']---->",
                            data['shared_role']
                          );
                          if (
                            !data['shared_role']
                              .toString()
                              .includes(e.target.id)
                          ) {
                            data['shared_role'] += e.target.id + ',';
                          } else {
                            data['shared_role'] = data['shared_role'].replace(
                              e.target.id + ',',
                              ''
                            );
                            if (data['shared_role'].includes('all')) {
                              data['shared_role'] = data['shared_role'].replace(
                                'all,',
                                ''
                              );
                            }
                          }
                          setFormSettingData(data);
                        }}
                        checked={formSettingData?.shared_role
                          ?.toString()
                          .includes('educator')}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container">
                      Parents
                      <input
                        type="checkbox"
                        name="shared_role"
                        id="parent"
                        onClick={(e) => {
                          let data = { ...formSettingData };
                          if (
                            !data['shared_role']
                              .toString()
                              .includes(e.target.id)
                          ) {
                            data['shared_role'] += e.target.id + ',';
                          } else {
                            data['shared_role'] = data['shared_role'].replace(
                              e.target.id + ',',
                              ''
                            );
                            if (data['shared_role'].includes('all')) {
                              data['shared_role'] = data['shared_role'].replace(
                                'all,',
                                ''
                              );
                            }
                          }
                          setFormSettingData(data);
                        }}
                        checked={formSettingData?.shared_role?.includes(
                          'parent'
                        )}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container">
                      All Roles
                      <input
                        type="checkbox"
                        name="shared_role"
                        id="all_roles"
                        onClick={(e) => {
                          let data = { ...formSettingData };
                          console.log('e.target.checked', e.target.checked);
                          if (e.target.checked === true) {
                            if (
                              !data['shared_role'].toString().includes('parent')
                            ) {
                              data['shared_role'] += 'parent,';
                            }
                            if (
                              !data['shared_role']
                                .toString()
                                .includes('educator')
                            ) {
                              data['shared_role'] += 'educator,';
                            }
                            if (
                              !data['shared_role']
                                .toString()
                                .includes('coordinator')
                            ) {
                              data['shared_role'] += 'coordinator,';
                            }
                            if (
                              !data['shared_role'].toString().includes('all')
                            ) {
                              data['shared_role'] += 'all,';
                            }
                            setFormSettingData(data);
                          } else {
                            data['shared_role'] = '';
                            setFormSettingData(data);
                          }
                        }}
                        checked={formSettingData?.shared_role?.includes('all')}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </Form.Group>
                {/* ) : null} */}
                {/* {formSettingData.accessible_to_role === 0 ? ( */}
                <Form.Group>
                  <Form.Label>Select User</Form.Label>
                  <div className="select-with-plus">
                    <Multiselect
                      displayValue="email"
                      className="multiselect-box default-arrow-select"
                      // placeholder="Select Franchisee"
                      selectedValues={selectedUser}
                      // onKeyPressFn={function noRefCheck() {}}
                      onRemove={onRemoveUser}
                      // onSearch={function noRefCheck() {}}
                      onSelect={onSelectUser}
                      options={user}
                    />
                  </div>
                  <p className="error">{errors.franchisee}</p>
                </Form.Group>
                {/* ) : null} */}
              </Col>
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
