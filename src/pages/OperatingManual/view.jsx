import {
  faEllipsisVertical,
  faPen,
  faPlus,
  faRemove,
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
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../components/App';
import LeftNavbar from '../../components/LeftNavbar';
import TopHeader from '../../components/TopHeader';
import PdfComponent from '../PrintPDF/PdfComponent';
import moment from 'moment';
import Multiselect from 'multiselect-react-dropdown';

let selectedUserRole = [];
let selectedUserRoleName = '';
const OperatingManual = () => {
  const navigate = useNavigate();
  const [Index, setIndex] = useState(0);
  const [operatingManualData, setOperatingManualData] = useState({});
  const [innerIndex, setInnerIndex] = useState(0);
  const [operatingManualdata, setOperatingManualdata] = useState([]);
  const [formSettingFlag, setFormSettingFlag] = useState(false);
  const [show, setShow] = useState(false);
  let [videoUrl, setVideoUrl] = useState('');
  let [category, setCategory] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [formSettingError, setFormSettingError] = useState({});
  const [formSettingData, setFormSettingData] = useState({
    applicable_to_franchisee: '1',
    applicable_to_user: '1',
  });
  const [userRole, setUserRole] = useState([]);
  const [errors, setErrors] = useState({});
  const [categoryFilter, setCategoryFilter] = useState('');
  useEffect(() => {
    getOperatingManual();
    getCategory();
    getUserRoleAndFranchiseeData();
    console.log('role---->', localStorage.getItem('user_role'));
  }, []);

  useEffect(() => {
    var tree = document.getElementById('tree1');
    if (tree) {
      // console.log('tree---->', tree);
      tree.querySelectorAll('ul').forEach(function (el, index, key, parent) {
        var elm = el.parentNode;
        elm.classList.add('branch');
        var x = document.createElement('img');
        if (index === 0) {
          el.classList.add('expand');
          x.src = '../img/circle-minus.svg';
          const childNode = elm.childNodes[1];
          childNode.classList.add('tree-title');
        } else {
          x.src = '../img/plus-circle.svg';
          el.classList.add('collapse');
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
                console.log('el.classlist---->', el.classList);
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
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    await fetch(
      `${BASE_URL}/operating_manual/one?id=${id}&category_name=${category_name}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((response) => {
        console.log('operating manual--->', response?.result);
        setOperatingManualData(response?.result);
        let data = formSettingData;
        data.applicable_to_user =
          response?.result?.applicable_to_user.toString();
        // data.applicable_to_franchisee =
        //   response?.result?.applicable_to_franchisee.toString();
        // console.log('Franchisee--->', franchisee);
        // selectedFranchisee = [];
        // franchisee.map((item) => {
        //   if (response?.result?.shared_with.includes(item.franchisee_alias)) {
        //     selectedFranchisee.push({
        //       id: item.id,
        //       franchisee_name: item.franchisee_name,
        //       franchisee_alias: item.franchisee_alias,
        //     });
        //     selectedFranchiseeName += item.franchisee_alias + ',';
        //   }
        // });
        selectedUserRole = [];
        console.log('userRole---->', userRole);
        userRole.map((item) => {
          console.log('selectedUserRole---->', response?.result?.shared_role);
          if (response?.result?.shared_role.includes(item.role_name)) {
            selectedUserRole.push({
              id: item.id,
              role_label: item.role_label,
              role_name: item.role_name,
            });
            selectedUserRoleName += item.role_name + ',';
          }
        });
        console.log('selectedUserRole---->', selectedUserRole);

        setFormSettingData(data);
      })
      .catch((error) => console.log('error', error));
  };
  const getUserRoleAndFranchiseeData = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/api/user-role`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log('response0-------->1', res?.userRoleList);
        setUserRole(res?.userRoleList);
      })
      .catch((error) => console.log('error', error));
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
  const getCategory = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/operating_manual/category`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
        setCategory(result.result);
      })
      .catch((error) => console.log('error', error));
  };
  const deleteOperatingManual = () => {
    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
    };

    fetch(
      `${BASE_URL}/operating_manual/${operatingManualdata[Index]?.operating_manuals[innerIndex]?.id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        getOperatingManual();
      })
      .catch((error) => console.log('error', error));
  };
  const getOperatingManual = (key, value) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    let api_url = '';
    if (key === 'category') {
      api_url = `${BASE_URL}/operating_manual?category=${value}&role=${localStorage.getItem(
        'user_role'
      )}`;
      setCategoryFilter(value);
    } else if (key === 'search') {
      api_url = `${BASE_URL}/operating_manual?search=${value}&role=${localStorage.getItem(
        'user_role'
      )}`;
    } else {
      api_url = `${BASE_URL}/operating_manual?role=${localStorage.getItem(
        'user_role'
      )}`;
      setCategoryFilter('reset');
    }

    fetch(api_url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
        setOperatingManualdata(result.result);
      })
      .catch((error) => console.log('error', error));
  };
  function onSelectUserRole(optionsList, selectedItem) {
    console.log('selected_item---->2', selectedItem);
    selectedUserRoleName += selectedItem.role_name + ',';
    selectedUserRole.push({
      id: selectedItem.id,
      role_label: selectedItem.role_label,
      role_name: selectedItem.role_name,
    });
    console.log('form---->2selectedUserRole', selectedUserRole);
  }
  function onRemoveUserRole(selectedList, removedItem) {
    selectedUserRoleName = selectedUserRoleName.replace(
      removedItem.role_name + ',',
      ''
    );
    const index = selectedUserRole.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedUserRole.splice(index, 1);
    console.log('form---->2selectedUserRole', selectedUserRole);
  }
  const onModelSubmit = (e) => {
    e.preventDefault();
    let data = operatingManualData;
    if (!data?.id) {
      alert('Please save first operating manual information');
    } else {
      data['access_to_all_user'] = formSettingData.applicable_to_user;
      data['access_to_all_franchise'] =
        formSettingData.applicable_to_franchisee;
      // data['shared_with'] = selectedFranchiseeName;
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
                <TopHeader />
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
                        <Button
                          className="add_operating_button"
                          onClick={() => {
                            navigate('/operatingmanual/add');
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </Button>
                        <div className="forms-toogle">
                          <div class="custom-menu-dots">
                            <Dropdown>
                              <Dropdown.Toggle id="dropdown-basic">
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                {category?.map((item, index) => {
                                  return categoryFilter ===
                                    item.category_name ? (
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
                                  ) : (
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
                                  );
                                })}
                                {categoryFilter === 'reset' ? (
                                  <Dropdown.Item
                                    onClick={() => {
                                      getOperatingManual('', '');
                                    }}
                                    active
                                  >
                                    Reset
                                  </Dropdown.Item>
                                ) : (
                                  <Dropdown.Item
                                    onClick={() => {
                                      getOperatingManual('', '');
                                    }}
                                  >
                                    Reset
                                  </Dropdown.Item>
                                )}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                      </div>
                      <ul id="tree1" className="tree">
                        {operatingManualdata.map((item, index) => {
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
                      {/* <Button
                        onClick={() => {
                          navigate('/operatingmanual/add');
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Create an Operating
                        Manual
                      </Button> */}
                      <div className="forms-toogle">
                        <div class="custom-menu-dots">
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
                                  {console.log('inner_item----->', inner_item)}
                                  {console.log('inner_item----->', inner_item)}
                                  <PdfComponent {...inner_item} />
                                  <Row>
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
                                            <h6>
                                              Computer Literacy - The growing
                                              reliance on technology and
                                              computers also in experiment.
                                            </h6>
                                          </div>
                                        </div>
                                      </div>
                                    </Col>
                                    {inner_item.related_files ? (
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

                                                  <div className="forms-content">
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
                                                        ).format('MM/DD/YYYY')}
                                                      </h4>
                                                    </div>
                                                  </div>
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
          <h2>
            Computer Literacy - The growing reliance on technology and computers
            also in experiment.
          </h2>
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
            Form Settings
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settings-content">
            <Row className="mt-4">
              {/* <Col lg={3} md={6}>
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
              </Col> */}
              {/* {formSettingData.applicable_to_franchisee === '0' ? (
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
              ) : null} */}
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
    </>
  );
};
export default OperatingManual;
