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

let upperRoleUser = '';
let selectedUserId = '';
const OperatingManual = () => {
  const navigate = useNavigate();
  const [Index, setIndex] = useState(0);
  const [innerIndex, setInnerIndex] = useState(0);
  const [operatingManualdata, setOperatingManualdata] = useState([]);
  const [singleOperatingManual,setSingleOperatingManual]=useState({});
  const [formSettingFlag, setFormSettingFlag] = useState(false);
  const [show, setShow] = useState(false);
  let [videoUrl, setVideoUrl] = useState('');
  let [category, setCategory] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [formSettingError, setFormSettingError] = useState({});
  const [formSettingData, setFormSettingData] = useState({ shared_role: '' });
  const [selectedUser, setSelectedUser] = useState([]);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [userRole, setUserRole] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [selectedFranchiseeId,setSelectedFranchiseeId]=useState(null);
  useEffect(() => {
    getOperatingManual();
    getUserRoleData();
    getCategory();
    console.log('user_id---->', operatingManualdata[Index]?.operating_manuals[
      innerIndex
    ]?.created_by);
  }, []);
  useEffect(() => {
    getUser();
  }, [selectedFranchisee]);
  const getUserRoleData = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/api/user-role`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        // console.log('response0-------->1', localStorage.getItem('user_role'));
        setUserRole(res?.userRoleList);

        console.log('upperRoleUser--->', upperRoleUser);
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
    myHeaders.append(
      'authorization',
      'Bearer ' + localStorage.getItem('token')
    );

    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };
    let api_url="";
    console.log("selectedFranchisee--->",selectedFranchisee);
    if(selectedFranchisee)
    {
      if(selectedFranchisee==="All")
        api_url=`${BASE_URL}/auth/users`;
      else
        api_url=`${BASE_URL}/user-group/users/franchisee/${selectedFranchisee.split(",")[0].split(" ").map(d => d.charAt(0).toLowerCase() + d.slice(1)).join("_")}`;
    }
    else
    {
      api_url=`${BASE_URL}/auth/users`;
    }
      
      
    fetch(api_url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result?.data?.map((item) => {
          item['status'] = false;
        });
        if(selectedFranchisee)
        {
          if(selectedFranchisee==="All")
            setUser(result?.data);
          else
           setUser(result?.users);
        }
        else
          setUser(result?.data);
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    var tree = document.getElementById('tree1');
    if (tree) {
      // console.log('tree---->', tree);
      tree.querySelectorAll('ul').forEach(function (el, index, key, parent) {
        var elm = el.parentNode;
        elm.classList.add('branch');
        var x = document.createElement('img');
        el.classList.add('expand');
        x.src = '../img/circle-minus.svg';
        const childNode = elm.childNodes[0];
        if (index === 0) {
          childNode.classList.add('tree-title');
        }
        // } else {
        //   x.src = '../img/plus-circle.svg';
        //   el.classList.add('collapse');
        // }
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
      `${BASE_URL}/operating_manual/one?id=${id}&category_name=${category_name}&franchisee_id=${localStorage.getItem("f_id")}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(
          'response--->',
          response?.result
        );
        setSingleOperatingManual(response?.result);
        let data = formSettingData;
        data['applicable_to_all'] = response?.result?.permission?.accessible_to_all;
        data['accessible_to_role'] = response?.result?.permission?.accessible_to_role;
        let users = [];
        setSelectedUser(users);
        let role="";
        selectedUserId = '';
        data['shared_role']="";

        // if (response?.result?.permission?.accessible_to_role === 0) {
          
          console.log("user----->",user);
          user.map((item) => {
            if (response?.result?.permission?.shared_with.includes(item.id.toString())) {
              users.push(item);
              selectedUserId += item.id + ',';
            }
          });
          setSelectedUser(users);
        // }
        // else
        // {
          
          response?.result?.permission?.shared_role.map((item)=>{
            role+=item+",";
          })
          data['shared_role'] = role;
        // }
        setFormSettingData(data);
      })
      .catch((error) => console.log('error', error));
  };

  // const setFormSettingFields = (field, value) => {
  //   setFormSettingData({ ...formSettingData, [field]: value });

  //   if (!!formSettingError[field]) {
  //     setFormSettingError({
  //       ...formSettingError,
  //       [field]: null,
  //     });
  //   }
  // };
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
      )}&id=${localStorage.getItem('user_id')}`;
      setCategoryFilter(value);
    } else if (key === 'search') {
      api_url = `${BASE_URL}/operating_manual?search=${value}&role=${localStorage.getItem(
        'user_role'
      )}&id=${localStorage.getItem('user_id')}`;
    } else {
      api_url = `${BASE_URL}/operating_manual?role=${localStorage.getItem(
        'user_role'
      )}&id=${localStorage.getItem('user_id')}&franchisee_id=${localStorage.getItem('franchisee_id')}`;
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
  const onModelSubmit = (e) => {
    e.preventDefault();
    let data = singleOperatingManual;
    if (!data?.id) {
      console.log("data----->",data);
      alert('Please save first operating manual information');
    } else {
      console.log(
        'formSettingData.accessible_to_role---->',
        formSettingData.shared_role
      );

      if (
        formSettingData.shared_role==="" &&
        selectedUserId === ""
      ) {
        data['accessible_to_role'] = null;
        data['accessible_to_all'] = true;
      } else {
        // if (formSettingData.accessible_to_role === 1) {
          data['shared_role'] = formSettingData.shared_role ? formSettingData.shared_role.slice(0, -1) : null;
          // data['shared_with'] = null;
          data['accessible_to_role'] = null;
          data['accessible_to_all'] = false;
        // } else {
          data['shared_with'] = selectedUserId ? selectedUserId.slice(0, -1) : null;
          // data['shared_role'] = null;
          // data['accessible_to_role'] = formSettingData.accessible_to_role;
          // data['accessible_to_all'] = false;
        // }
      }
      // data['created_by'] = localStorage.getItem('user_id');
      data['shared_by']=localStorage.getItem('user_id');
      upperRoleUser = getUpperRoleUser();
      data['upper_role'] = upperRoleUser;
      data['franchisee_id']=selectedFranchiseeId;

      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      fetch(`${BASE_URL}/operating_manual/add`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: myHeaders,
      })
        .then((res) => res.json())
        .then((res) => {
          setSingleOperatingManual(res?.result);
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
              <TopHeader 
                    selectedFranchisee={selectedFranchisee}
                    setSelectedFranchisee={(name,id)=>{setSelectedFranchisee(name);setSelectedFranchiseeId(id);localStorage.setItem("f_id",id);
                      if(operatingManualdata[Index]
                        ?.operating_manuals[innerIndex]?.id && operatingManualdata[Index]
                        ?.category_name)
                        {
                          getOneOperatingManual(
                            operatingManualdata[Index]
                              ?.operating_manuals[innerIndex]?.id,
                            operatingManualdata[Index]
                              ?.category_name
                          );
                        }
                      }} />
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
                          {(operatingManualdata[Index]?.operating_manuals[
                            innerIndex
                          ]?.created_by === parseInt(localStorage.getItem('user_id')) ||
                            operatingManualdata[Index]?.operating_manuals[
                              innerIndex
                            ]?.upper_role.includes(
                              localStorage.getItem('user_role'))
                            ) && (
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
                                        operatingManualdata[Index]
                                          ?.category_name
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
                                              Video 1
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
            Video 1
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
                  <Form.Label>Accessible to:</Form.Label>
                  <div className="new-form-radio d-block">
                    <div className="new-form-radio-box">
                      <label for="yes">
                        <input
                          type="radio"
                          value={1}
                          name="accessible_to_role"
                          id="yes"
                          onClick={(e) => {
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
                          onClick={(e) => {
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
                                data['shared_role'] = data[
                                  'shared_role'
                                ].replace('all,', '');
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
                                data['shared_role'] = data[
                                  'shared_role'
                                ].replace('all,', '');
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
                                data['shared_role'] = data[
                                  'shared_role'
                                ].replace('all,', '');
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
                                !data['shared_role']
                                  .toString()
                                  .includes('parent')
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
                          checked={formSettingData?.shared_role?.includes(
                            'all'
                          )}
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
    </>
  );
};
export default OperatingManual;
