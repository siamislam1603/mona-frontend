import React, { useState, useEffect } from 'react';
import { Col, Container, Form, Row, Button, Modal } from 'react-bootstrap';
import { BASE_URL, FRONT_BASE_URL } from '../../components/App';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { includes } from 'lodash';
let selectedUserId = '';
let upperRoleUser = '';
const AddOperatingManual = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("Dsa",location?.state?.edit)

  const [operatingManualData, setOperatingManualData] = useState({
    related_files: [],
  });
  const [errors, setErrors] = useState({});
  const [ImageloaderFlag, setImageLoaderFlag] = useState(false);
  const [videoloaderFlag, setVideoLoaderFlag] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState('');
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
  const [selectedFranchisee, setSelectedFranchisee] = useState(localStorage.getItem('franchisee_id'));
  const [selectedFranchiseeId, setSelectedFranchiseeId] = useState(null);
  const [pageTitle,setPageTitle] = useState("Create New")
  const [wordCount,setWordCount] = useState(0)
  const token = localStorage.getItem('token');
  const loginuser = localStorage.getItem('user_role')

  useEffect(() => {
    getUserRoleData();
  }, []);
  useEffect(() => {
    if(selectedFranchisee)
    {
      getUser();
    }
  }, [selectedFranchisee]);
  useEffect(() => {
    getCategory();
  }, [user]);
  useEffect(() => {
    getCategory();
  }, [selectedFranchiseeId]);
  const getUser = () => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);

    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };
    let api_url = '';
    if (selectedFranchisee) {
      if (selectedFranchisee === 'All' || selectedFranchisee === 'all') api_url = `${BASE_URL}/auth/users`;
      else
        api_url = `${BASE_URL}/user-group/users/franchisee/${selectedFranchisee}`;
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
          if (selectedFranchisee === 'All' || selectedFranchisee === 'all') setUser(result?.data);
          else setUser(result?.users);
        } else setUser(result?.data);
      })
      .catch((error) => console.log('error', error));
  };
  const getOneOperatingManual = async () => {
    setPageTitle("Edit Operating manual")

    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
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
        setOperatingManualData(response?.result);
        setImageUrl(response?.result?.cover_image);
        setVideoThumbnailUrl(response?.result?.video_thumbnail);
        setVideoUrl(response?.result?.reference_video);
        let data = formSettingData;
        data['applicable_to_all'] =
          response?.result?.permission?.accessible_to_all;

        data['accessible_to_role'] =
          response?.result?.permission?.accessible_to_role;
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
        setSelectedUser(users);
        let role = '';
        response?.result?.permission?.shared_role.map((item) => {
          role += item + ',';
        });
        data['shared_role'] = role;
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
    console.log(field,value)
    console.log("THE VALUE",value)

    if(field == "description"){
      const text = value;
      if(value.includes("&nbsp")){

        setWordCount(text.length-12);
      }
      else{
        setWordCount(text.length-7);
      }
      console.log("WORD count",text.split(" ").length)
      if(value === ""){
        setWordCount(0)
      }
    }
    
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
      toast.error('Please save the details of operating manual!!');
    } else {
      if (formSettingData.shared_role === '' && selectedUserId === '') {
        data['accessible_to_role'] = null;
        data['accessible_to_all'] = true;
      } else {
        if(localStorage.getItem("user_role")!=="franchisor_admin")
        {
          formSettingData.shared_role =  formSettingData.shared_role ? formSettingData.shared_role.replace("franchisee_admin,","") : null;
        }
        formSettingData.shared_role =  formSettingData.shared_role ? formSettingData.shared_role.replace("all,","") : null;
        data['shared_role'] = formSettingData.shared_role
          ? formSettingData.shared_role.slice(0, -1)
          : null;
        data['accessible_to_role'] = null;
        data['accessible_to_all'] = false;
        data['shared_with'] = selectedUserId
          ? selectedUserId.slice(0, -1)
          : null;
        data['link'] = FRONT_BASE_URL + '/operatingmanual';
      }
      data['cover_image'] = imageUrl;
      data['video_thumbnail'] = videoThumbnailUrl;
      data['reference_video'] = videoUrl;
      data['created_by'] = localStorage.getItem('user_id');
      data['shared_by'] = localStorage.getItem('user_id');
      upperRoleUser = getUpperRoleUser();
      data['upper_role'] = upperRoleUser;
      data['franchisee_id'] = selectedFranchiseeId;

      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('authorization', 'Bearer ' + token);
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
    const newErrors = createOperatingManualValidation(operatingManualData,wordCount);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log("newErrors--->",Object.keys(newErrors)[0]);
      document.getElementById(Object.keys(newErrors)[0]).focus();
    } else {
      upperRoleUser = getUpperRoleUser();
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('authorization', 'Bearer ' + token);
      let data = { ...operatingManualData };
      data['cover_image'] = imageUrl;
      data['video_thumbnail'] = videoThumbnailUrl;
      data['reference_video'] = videoUrl;
      data['link'] = FRONT_BASE_URL + '/operating_manual?select=';
      data.created_by = localStorage.getItem('user_id');
      data.upper_role = upperRoleUser;
      fetch(`${BASE_URL}/operating_manual/add`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: myHeaders,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.success === false) {
            let errorData = { ...errors };
            errorData['title'] = res?.message;
            console.log("Error DATA",errorData)
            setErrors(errorData);
            document.getElementById(Object.keys(errorData)[0]).focus();

          } else {
            setOperatingManualData(res?.result);
            setFormSettingFlag(true);
            setErrors([]);
          }
        });
    }
  };
  const OnCategorySubmit = (e) => {
    e.preventDefault();
    const newErrors = createCategoryValidation(categoryData);

    if (Object.keys(newErrors).length > 0) {
      setCategoryError(newErrors);
    } else {
      let flag = false;
      category.map((item) => {
        if (
          item.category_name.toLowerCase() ===
          categoryData?.category_name.toLowerCase()
        ) {
          let categoryErrorData = { ...categoryError };
          categoryErrorData['category_name'] = 'Module already exists';
          setCategoryError(categoryErrorData);
          flag = true;
        }
      });
      if (!flag) {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('authorization', 'Bearer ' + token);
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
    }
  };

  const getCategory = async () => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };

    fetch(`${BASE_URL}/operating_manual/category`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
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
    console.log("file---->",file);
    if (name === 'cover_image') {
      if (file.size > 2048 * 1024) {
        let errorData = { ...errors };
        errorData['cover_image'] = 'File is too large. File limit 2 MB.';
        setErrors(errorData);
        flag = true;
      }
      if (
        !(
          file.type.includes('jpg') ||
          file.type.includes('jpeg') ||
          file.type.includes('png')
        )
      ) {
        let errorData = { ...errors };
        errorData['cover_image'] = 'File must be JPG or PNG.';
        setErrors(errorData);
        flag = true;
      }

    }
    if (name === 'reference_video') {
      if (file.size > 1024 * 1024 * 1024) {
        let errorData = { ...errors };
        errorData['reference_video'] = 'File is too large. File limit 1 GB.';
        setErrors(errorData);
        flag = true;
      }
      console.log("file type",file.type)
      if (!file.type.includes('mp4') && !file.type.includes('mkv') && !file.type.includes('video/x-matroska') ) {
        let errorData = { ...errors };
        errorData['reference_video'] = 'File format not supported.';
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
      body.append('image',file);
      body.append('description', 'operating manual');
      body.append('title', name);
      body.append('uploadedBy', 'vaibhavi');

      var myHeaders = new Headers();
      myHeaders.append('shared_role', 'admin');
      myHeaders.append('authorization', 'Bearer ' + token);
      
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

  function onSelectUser(optionsList, selectedItem) {
    selectedUserId += selectedItem.id + ',';
    selectedUser.push({
      id: selectedItem.id,
      email: selectedItem.email,
    });
  }
  function onRemoveUser(selectedList, removedItem) {
    selectedUserId = selectedUserId.replace(removedItem.id + ',', '');
    const index = selectedUser.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedUser.splice(index, 1);
  }
  const getUserRoleData = () => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };

    fetch(`${BASE_URL}/api/user-role`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        setUserRole(res?.userRoleList);
      })
      .catch((error) => console.log('error', error));
  };
console.log("Oepratiing",errors)
console.log("PERMISSION SELECT",selectedUser,formSettingData)
  return (
    <>
      <div id="main">
      <ToastContainer/>
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
                    setSelectedFranchisee={(id) => {
                      id =
                        localStorage.getItem('user_role') === 'guardian'
                          ? localStorage.getItem('franchisee_id')
                          : id;
                      setSelectedFranchiseeId(id);
                      setSelectedFranchisee(id);
                      localStorage.setItem('f_id', id);
                    }}
                  />{' '}
                  <Row>
                    <Col sm={12}>
                      <div className="mynewForm-heading">
                        <h4 className="mynewForm">{location?.state?.edit=== true  ? "Edit Operating Manual":"Create new" }</h4>
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
                            Select Module
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
                   {
                    loginuser === "franchisor_admin" &&  <Col sm={6} className="add_fields">
                    <Button
                      onClick={() => {
                        setCategoryModalFlag(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Add New Module
                    </Button>
                  </Col>
                   }
                  </Row>
                  <div className="my-new-formsection">
                    <Row>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Sub-Module Name *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            id="title"
                            value={operatingManualData?.title}
                            // placeholder="Enter Title"
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
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Order in List *
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="order"
                            min={1}
                            id="order"
                            value={operatingManualData?.order}
                            placeholder="1"
                            onChange={(e) => {
                              setOperatingManualField(
                                e.target.name,
                                e.target.value
                              );
                            }}
                            isInvalid={!!errors.order}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.order}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12}>
                        <Form.Group>
                          <Form.Label id="description" className="formlabel">
                            Description *
                          </Form.Label>
                          {location?.state?.id &&
                          location?.state?.category_name &&
                          operatingManualData?.description ? (
                            <MyEditor
                              name="description"
                              id="description"
                              // operatingManual={{ ...operatingManualData }}
                              data={operatingManualData?.description}
                              errors={errors}
                              handleChange={(e, data) => {
                                setOperatingManualField(e, data);
                              }}
                            />
                          ) : (
                            <MyEditor
                              name="description"
                              errors={errors}
                              handleChange={(e, data) => {
                                setOperatingManualField(e, data);
                              }}
                            />
                          )}
                          <p>Word Count : {wordCount} </p>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Upload Cover Image
                          </Form.Label>
                          <div className="upload_cover_box">
                            <div className="cover_image">
                              {ImageloaderFlag ? (
                                <img src="../img/loader.gif" />
                              ) : null}
                              <img
                                src={
                                  imageUrl ? imageUrl : '../img/image_icon.png'
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
                                setImageUrl('');
                              }}
                            >
                              <img src="../../img/removeIcon.svg" />
                            </Button>
                          </div>

                          <p className="form-errors">{errors.cover_image}</p>
                          <small className="fileinput">(png, jpg & jpeg)</small>
                          <small className="fileinput">(File limit 2 MB)</small>


                        
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Upload Video
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
                                  Add Video
                                </span>
                                <Form.Control
                                  className="add_image_input"
                                  type="file"
                                  name="reference_video"
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
                              className="remove_bin"
                              onClick={() => {
                                setVideoUrl('');
                                setVideoThumbnailUrl('');
                              }}
                            >
                              <img src="../../img/removeIcon.svg" />
                            </Button>
                          </div>
                          <p className="form-errors">
                            {errors.reference_video}
                          </p>
                          <small className="fileinput">((mp4, flv & mkv))</small>
                          <small className="fileinput">(File limit 1 GB)</small>



                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12}>
                        <div className="upload_related_files">
                          <Form.Group>
                            <Form.Label className="formlabel">
                              Upload File
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
                          <small className="fileinput">((pdf, doc, ppt & xslx))</small>
                          <small className="fileinput">(max 5 file,File limit 200 mb)</small>
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
                        <Button
                          className="preview"
                          onClick={() => {
                            navigate('/operatingmanual');
                          }}
                        >
                          Cancel
                        </Button>
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
            Sharing Permissions
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settings-content">
            <Row className="mt-4">
              <Col lg={12} md={12}>
                <Form.Group>
                  <Form.Label>Select User Roles</Form.Label>
                  <div className="modal-two-check user-roles-box">
                    {localStorage.getItem('user_role') ===
                      'franchisor_admin' && (
                      <label className="container">
                        Franchisee Admin
                        <input
                          type="checkbox"
                          name="shared_role"
                          id="franchisee_admin"
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
                                data['shared_role'] = data[
                                  'shared_role'
                                ].replace('all,', '');
                              }
                            }
                            setFormSettingData(data);
                          }}
                          checked={formSettingData?.shared_role
                            ?.toString()
                            .includes('franchisee_admin')}
                        />
                        <span className="checkmark"></span>
                      </label>
                    )}
                    <label className="container">
                      Coordinator
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
                      Educator
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
                              !data['shared_role']
                                .toString()
                                .includes('franchisee_admin')
                            ) {
                              data['shared_role'] += 'franchisee_admin,';
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
                <Form.Group>
                  <Form.Label>Select User</Form.Label>
                  <div className="select-with-plus">
                    <Multiselect
                      displayValue="email"
                      className="multiselect-box default-arrow-select"
                      selectedValues={selectedUser}
                      onRemove={onRemoveUser}
                      onSelect={onSelectUser}
                      options={user}
                    />
                  </div>
                  <p className="error">{errors.franchisee}</p>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            className="back"
            onClick={() => {
              setFormSettingFlag(false);
            }}
          >
            Cancel
          </Button>
          <Button className="done" onClick={onModelSubmit}>
            Save Permissions
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
            Add Module
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settings-content">
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Module Name</Form.Label>
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
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Order in List </Form.Label>
                  <Form.Control
                    type="number"
                    name="order"
                    min={1}
                    placeholder="1"
                    onChange={(e) => {
                      setCategoryField(e.target.name, e.target.value);
                    }}
                    isInvalid={!!categoryError.order}
                  />
                  <Form.Control.Feedback type="invalid">
                    {categoryError.order}
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
              let data = { ...categoryData };
              data['category_name'] = '';
              setCategoryData(data);
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