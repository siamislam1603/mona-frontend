import {
  faEllipsisVertical,
  faPen,
  faPlus,
  faRemove,
  faTrash,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  Modal,
  Row,
} from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL, FRONT_BASE_URL } from '../../components/App';
import LeftNavbar from '../../components/LeftNavbar';
import TopHeader from '../../components/TopHeader';
import PdfComponent from '../PrintPDF/PdfComponent';
import moment from 'moment';
import Multiselect from 'multiselect-react-dropdown';
import { verifyPermission } from '../../helpers/roleBasedAccess';
import { createCategoryValidation } from '../../helpers/validation';

let upperRoleUser = '';
let selectedUserId = '';
const OperatingManual = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [Index, setIndex] = useState(0);
  const [innerIndex, setInnerIndex] = useState(0);
  const [operatingManualdata, setOperatingManualdata] = useState([]);
  const [singleOperatingManual, setSingleOperatingManual] = useState({});
  const [formSettingFlag, setFormSettingFlag] = useState(false);
  const [show, setShow] = useState(false);
  let [videoUrl, setVideoUrl] = useState('');
  let [category, setCategory] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [formSettingData, setFormSettingData] = useState({ shared_role: '' });
  const [selectedUser, setSelectedUser] = useState([]);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categoryModalFlag, setCategoryModalFlag] = useState(false);
  const [categoryData, setCategoryData] = useState({});
  const [categoryError, setCategoryError] = useState({});
  const [userRole, setUserRole] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState(
    localStorage.getItem('franchisee_id')
  );
  const [selectedFranchiseeId, setSelectedFranchiseeId] = useState(null);
  const token = localStorage.getItem('token');
  useEffect(() => {
    getOperatingManual();
    getUserRoleData();
    // getCategory();
  }, []);
  useEffect(() => {
    if (selectedFranchisee) {
      getUser();
    }
  }, [selectedFranchisee]);
  const setCategoryField = (field, value) => {
    setCategoryData({ ...categoryData, [field]: value });
    if (!!categoryError[field]) {
      setCategoryError({
        ...categoryError,
        [field]: null,
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
        if (!(item.id === categoryData?.id)) {
          if (
            item.category_name.toLowerCase() ===
            categoryData?.category_name.toLowerCase()
          ) {
            let categoryErrorData = { ...categoryError };
            categoryErrorData['category_name'] = 'Module already exists';
            setCategoryError(categoryErrorData);
            flag = true;
          }
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
            getOperatingManual();
            // getCategory();
            // let data = operatingManualData;
            // data['category_name'] = categoryData?.category_name;
            // setOperatingManualData(data);
          });
      }
    }
  };
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
      if (selectedFranchisee === 'All') api_url = `${BASE_URL}/auth/users`;
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
          if (selectedFranchisee === 'All') setUser(result?.data);
          else setUser(result?.users);
        } else setUser(result?.data);
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    var tree = document.getElementById('tree1');
    if (tree) {
      tree.querySelectorAll('ul').forEach(function (el, index, key, parent) {
        var elm = el.parentNode;
        elm.classList.add('branch');
        var x = document.createElement('img');
        el.classList.add('expand');
        x.src = '../img/circle-minus.svg';
        const childNode = elm.childNodes[0];
        if (location.search) {
          if (index === Index) {
            childNode.classList.add('tree-title');
          }
        } else {
          if (index === 0) {
            childNode.classList.add('tree-title');
          }
        }
        if (elm.firstChild.tagName !== x.tagName) {
          console.log('tagName', x.tagName, elm.firstChild.tagName);
          elm.insertBefore(x, elm.firstChild);
        }

        elm.addEventListener(
          'click',
          function (event) {
            if (elm === event.target || elm === event.target.parentNode) {
              if (el.classList.contains('collapse')) {
                el.classList.add('expand');
                el.classList.remove('collapse');
                const childNode = el.parentNode.childNodes[1];
                childNode.classList.add('tree-title');
                x.src = '../img/circle-minus.svg';
              } else {
                el.classList.add('collapse');
                el.classList.remove('expand');
                const childNode = el.parentNode.childNodes[1];
                childNode.classList.remove('tree-title');
                x.src = '../img/plus-circle.svg';
              }
            }
          },
          false
        );
      });
    }
  }, [operatingManualdata]);
  const getOneOperatingManual = async (id, category_name) => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };
    await fetch(
      `${BASE_URL}/operating_manual/one?id=${id}&category_name=${category_name}&franchisee_id=${localStorage.getItem(
        'f_id'
      )}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((response) => {
        setSingleOperatingManual(response?.result);
        let data = formSettingData;
        data['applicable_to_all'] =
          response?.result?.permission?.accessible_to_all;
        data['accessible_to_role'] =
          response?.result?.permission?.accessible_to_role;
        let users = [];
        setSelectedUser(users);
        let role = '';
        selectedUserId = '';
        data['shared_role'] = '';

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
        response?.result?.permission?.shared_role.map((item) => {
          role += item + ',';
        });
        data['shared_role'] = role;
        setFormSettingData(data);
      })
      .catch((error) => console.log('error', error));
  };

  // const getCategory = async () => {
  //   var myHeaders = new Headers();
  //   myHeaders.append('authorization', 'Bearer ' + token);
  //   var requestOptions = {
  //     method: 'GET',
  //     redirect: 'follow',
  //     headers: myHeaders,
  //   };

  //   fetch(`${BASE_URL}/operating_manual/category`, requestOptions)
  //     .then((response) => response.text())
  //     .then((result) => {
  //       result = JSON.parse(result);
  //       setCategory(result.result);
  //     })
  //     .catch((error) => console.log('error', error));
  // };
  const deleteOperatingManualCategory = (id) => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
      headers: myHeaders,
    };

    fetch(
      `${BASE_URL}/operating_manual/category/${id}?shared_by=${localStorage.getItem(
        'user_id'
      )}&link=${FRONT_BASE_URL}/operatingmanual`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        getOperatingManual();
        // getCategory();
      })
      .catch((error) => console.log('error', error));
  };
  const deleteOperatingManual = () => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
      headers: myHeaders,
    };

    fetch(
      `${BASE_URL}/operating_manual/${
        operatingManualdata[Index]?.operating_manuals[innerIndex]?.id
      }?shared_by=${localStorage.getItem(
        'user_id'
      )}&link=${FRONT_BASE_URL}/operatingmanual`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        getOperatingManual();
      })
      .catch((error) => console.log('error', error));
  };
  const getOperatingManual = (key, value) => {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };
    let category_flag = false;
    let api_url = '';
    if (key === 'category') {
      api_url = `${BASE_URL}/operating_manual?category=${value}&role=${localStorage.getItem(
        'user_role'
      )}&id=${localStorage.getItem(
        'user_id'
      )}&franchisee_id=${localStorage.getItem('franchisee_id')}`;
      setCategoryFilter(value);
    } else if (key === 'search') {
      api_url = `${BASE_URL}/operating_manual?search=${value}&role=${localStorage.getItem(
        'user_role'
      )}&id=${localStorage.getItem(
        'user_id'
      )}&franchisee_id=${localStorage.getItem('franchisee_id')}`;
    } else {
      api_url = `${BASE_URL}/operating_manual?role=${localStorage.getItem(
        'user_role'
      )}&id=${localStorage.getItem(
        'user_id'
      )}&franchisee_id=${localStorage.getItem('franchisee_id')}`;
      setCategoryFilter('reset');
      category_flag = true;
    }

    fetch(api_url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
        setOperatingManualdata(result.result);
        if (category_flag) {
          setCategory(result.result);
        }
        if (location.search) {
          result?.result?.map((item, index) => {
            item?.operating_manuals?.map((inner_item, inner_index) => {
              if (inner_item.id === parseInt(location.search.split('=')[1])) {
                setIndex(index);
                setInnerIndex(inner_index);
              }
            });
          });
        }
      })
      .catch((error) => console.log('error', error));
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
  const onModelSubmit = (e) => {
    e.preventDefault();
    let data = singleOperatingManual;
    if (!data?.id) {
      alert('Please save first operating manual information');
    } else {
      if (formSettingData.shared_role === '' && selectedUserId === '') {
        data['accessible_to_role'] = null;
        data['accessible_to_all'] = true;
      } else {
        data['shared_role'] = formSettingData.shared_role
          ? formSettingData.shared_role.slice(0, -1)
          : null;
        data['accessible_to_role'] = null;
        data['accessible_to_all'] = false;
        data['shared_with'] = selectedUserId
          ? selectedUserId.slice(0, -1)
          : null;
      }
      data['shared_by'] = localStorage.getItem('user_id');
      data['link'] = FRONT_BASE_URL + '/operatingmanual';
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
          setSingleOperatingManual(res?.result);
          setFormSettingFlag(false);
        });
    }
  };

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
                    if (
                      operatingManualdata[Index]?.operating_manuals[innerIndex]
                        ?.id &&
                      operatingManualdata[Index]?.category_name
                    ) {
                      getOneOperatingManual(
                        operatingManualdata[Index]?.operating_manuals[
                          innerIndex
                        ]?.id,
                        operatingManualdata[Index]?.category_name
                      );
                    }
                  }}
                />
                <Row>
                  <Col sm={4}>
                    <div className="tree_wrp">
                      <div className="tree_header">
                        <div className="tree_search_box">
                          <img src="../img/search-icon.svg" alt="" />
                          <Form.Control
                            type="text"
                            name="search"
                            className="tree_view_search"
                            placeholder="Search..."
                            onChange={(e) => {
                              getOperatingManual('search', e.target.value);
                            }}
                          />
                        </div>
                        {verifyPermission('operating_manual', 'add') && (
                          <Button
                            className="add_operating_button"
                            onClick={() => {
                              navigate('/operatingmanual/add');
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                        )}
                        <div className="forms-toogle">
                          <div class="custom-menu-dots">
                            <Dropdown>
                              <Dropdown.Toggle id="dropdown-basic">
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                {categoryFilter === 'reset' ? (
                                  <Dropdown.Item
                                    onClick={() => {
                                      getOperatingManual('', '');
                                    }}
                                    active
                                  >
                                    Clear Filter
                                  </Dropdown.Item>
                                ) : (
                                  <Dropdown.Item
                                    onClick={() => {
                                      getOperatingManual('', '');
                                    }}
                                  >
                                    Clear Filter
                                  </Dropdown.Item>
                                )}
                                {category?.map((item, index) => {
                                  return categoryFilter ===
                                    item.category_name ? (
                                    <div className="module-drop-down">
                                      <Dropdown.Item
                                        onClick={() => {
                                          getOperatingManual(
                                            'category',
                                            item.category_name
                                          );
                                        }}
                                        active
                                      >
                                        {item.category_name}
                                      </Dropdown.Item>
                                      {verifyPermission(
                                        'operating_manual',
                                        'add'
                                      ) && (
                                        <div className="edit-module">
                                          <Dropdown.Item
                                            onClick={() => {
                                              setCategoryModalFlag(true);
                                              setCategoryData(item);
                                            }}
                                            active
                                          >
                                            <FontAwesomeIcon
                                              icon={faPen}
                                              style={{ color: '#455C58' }}
                                            />
                                          </Dropdown.Item>
                                          <Dropdown.Item
                                            className="tab-trash"
                                            onClick={() => {
                                              deleteOperatingManualCategory(
                                                item.id
                                              );
                                            }}
                                            active
                                          >
                                            <FontAwesomeIcon icon={faTrash} style={{ color: '#455C58' }} />
                                          </Dropdown.Item>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="module-drop-down">
                                      <Dropdown.Item
                                        onClick={() => {
                                          getOperatingManual(
                                            'category',
                                            item.category_name
                                          );
                                        }}
                                      >
                                        {item.category_name}
                                      </Dropdown.Item>
                                      {verifyPermission(
                                        'operating_manual',
                                        'add'
                                      ) && (
                                        <div className="edit-module">
                                          <Dropdown.Item
                                            onClick={() => {
                                              setCategoryModalFlag(true);
                                              setCategoryData(item);
                                            }}
                                            active
                                          >
                                            <FontAwesomeIcon
                                              icon={faPen}
                                              style={{ color: '#455C58' }}
                                            />
                                          </Dropdown.Item>
                                          <Dropdown.Item
                                            className="tab-trash"
                                            onClick={() => {
                                              deleteOperatingManualCategory(
                                                item.id
                                              );
                                            }}
                                            active
                                          >
                                            <FontAwesomeIcon icon={faTrash} />
                                          </Dropdown.Item>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                      </div>
                      <ul id="tree1" className="tree">
                        {operatingManualdata?.map((item, index) => {
                          return (
                            <li className="title_active">
                              <a href="#">
                                <img src="../img/main_tree.svg" alt="" />
                                {item.category_name}
                              </a>
                              <ul>
                                {item?.operating_manuals.map(
                                  (inner_item, inner_index) => {
                                    return (
                                      <li
                                        onClick={() => {
                                          setIndex(index);
                                          setInnerIndex(inner_index);
                                        }}
                                      >
                                        <a
                                          className={
                                            index === Index &&
                                            innerIndex === inner_index
                                              ? 'tree_active'
                                              : ''
                                          }
                                        >
                                          <img
                                            src="../img/child_file.svg"
                                            alt=""
                                          />
                                          {inner_item.title}
                                        </a>
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </Col>
                  <Col sm={8}>
                    <div className="create_model_bar">
                      <div className="forms-toogle">
                        <div class="custom-menu-dots">
                          {(operatingManualdata[Index]?.operating_manuals[
                            innerIndex
                          ]?.created_by ===
                            parseInt(localStorage.getItem('user_id')) ||
                            operatingManualdata[Index]?.operating_manuals[
                              innerIndex
                            ]?.upper_role.includes(
                              localStorage.getItem('user_role')
                            )) && (
                            <Dropdown>
                              <Dropdown.Toggle id="dropdown-basic">
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                <Dropdown.Item
                                  href=""
                                  onClick={() => {
                                    navigate('/operatingmanual/add', {
                                      state: {
                                        id: operatingManualdata[Index]
                                          ?.operating_manuals[innerIndex]?.id,
                                        category_name:
                                          operatingManualdata[Index]
                                            ?.category_name,
                                      },
                                    });
                                  }}
                                >
                                  <FontAwesomeIcon icon={faPen} /> Edit
                                </Dropdown.Item>
                                <Dropdown.Item
                                  href=""
                                  onClick={() => {
                                    deleteOperatingManual();
                                  }}
                                >
                                  <FontAwesomeIcon icon={faRemove} /> Remove
                                </Dropdown.Item>
                                <Dropdown.Item
                                  href=""
                                  onClick={() => {
                                    setFormSettingFlag(true);
                                    getOneOperatingManual(
                                      operatingManualdata[Index]
                                        ?.operating_manuals[innerIndex]?.id,
                                      operatingManualdata[Index]?.category_name
                                    );
                                  }}
                                >
                                  <FontAwesomeIcon icon={faUsers} /> Sharing
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          )}
                        </div>
                      </div>
                    </div>
                    {operatingManualdata.map((item, index) => {
                      return index === Index
                        ? item?.operating_manuals.map(
                            (inner_item, inner_index) => {
                              {
                                inner_item.category =
                                  operatingManualdata[
                                    operatingManualdata
                                      .map((object) => object.id)
                                      .indexOf(inner_item.category_id)
                                  ]?.category_name;
                                inner_item.related_files = eval(
                                  inner_item.related_files
                                );
                              }
                              return inner_index === innerIndex ? (
                                <>
                                  <PdfComponent {...inner_item} />
                                  <Row>
                                    {inner_item.reference_video && (
                                      <Col sm={7}>
                                        <div className="reference_wrp">
                                          <h1>Reference Videos</h1>
                                          <div className="reference_videos">
                                            <Button
                                              className="vidico"
                                              variant="transparent"
                                              onClick={() => {
                                                setVideoUrl(
                                                  inner_item.reference_video
                                                    ? inner_item.reference_video
                                                    : 'https://player.vimeo.com/video/718118183?title=0&portrait=0&byline=0&autoplay=1&loop=1&transparent=1'
                                                );
                                                handleShow();
                                              }}
                                            >
                                              <img
                                                src={
                                                  inner_item.video_thumbnail
                                                    ? inner_item.video_thumbnail
                                                    : 'https://i.vimeocdn.com/video/1446869688-ebc55555ef4671d3217b51fa6fea2d6a1c1010568f048e57a22966e13c2c4338-d_640x360.jpg'
                                                }
                                                alt=""
                                              />
                                            </Button>
                                            <div className="video_title">
                                              <h6>Video 1</h6>
                                            </div>
                                          </div>
                                        </div>
                                      </Col>
                                    )}
                                    {inner_item.related_files.length !== 0 ? (
                                      <Col sm={5}>
                                        <div className="related_files">
                                          <h1>Related Files</h1>
                                          {inner_item.related_files.map(
                                            (file_item, file_index) => {
                                              return (
                                                <>
                                                  {console.log(
                                                    'file_item---->',
                                                    file_item
                                                  )}

                                                  <a
                                                    className="forms-content create-other"
                                                    role="button"
                                                    href={file_item.url}
                                                    download
                                                  >
                                                    <div className="content-icon-section">
                                                      <img
                                                        src={
                                                          (file_index + 1) %
                                                            2 ==
                                                          0
                                                            ? '../img/doc_pink.svg'
                                                            : '../img/doc_blue.svg'
                                                        }
                                                      />
                                                    </div>
                                                    <div className="content-title-section">
                                                      <h6>{file_item.name}</h6>
                                                      <h4>
                                                        Added On :
                                                        {moment(
                                                          inner_item.createdAt
                                                        ).format('DD/MM/YYYY')}
                                                      </h4>
                                                    </div>
                                                  </a>
                                                </>
                                              );
                                            }
                                          )}
                                        </div>
                                      </Col>
                                    ) : null}
                                  </Row>
                                </>
                              ) : null;
                            }
                          )
                        : null;
                    })}
                  </Col>
                </Row>
              </div>
            </div>
          </Container>
        </section>
      </div>

      <Modal
        size="lg"
        className="video-modal module_video_model"
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <h2>Video 1</h2>
        </Modal.Header>
        <Modal.Body>
          <div className="embed-responsive embed-responsive-16by9">
            <iframe
              width="1366"
              height="445"
              src={videoUrl}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </Modal.Body>
      </Modal>

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
                            // if (
                            //   !data['shared_role'].toString().includes('parent')
                            // ) {
                            //   data['shared_role'] += 'parent,';
                            // }
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
            Edit Module
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
                    value={categoryData?.category_name}
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
                  <Form.Label>Position in the tree-structure </Form.Label>
                  <Form.Control
                    type="number"
                    name="order"
                    value={categoryData?.order}
                    placeholder="Enter Position"
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
export default OperatingManual;
