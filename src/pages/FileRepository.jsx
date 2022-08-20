import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Form,
  Modal,
  Row,
  Col,
} from 'react-bootstrap';
import axios from "axios";
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import makeAnimated from 'react-select/animated';
import { verifyPermission } from '../helpers/roleBasedAccess';
import ToolkitProvider, {
  Search,
  CSVExport,
} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import Multiselect from 'multiselect-react-dropdown';
import DragDropRepository from '../components/DragDropRepository';
import { BASE_URL } from '../components/App';
import { useNavigate } from 'react-router-dom';
import FileRepoShairWithme from './FileRepoShairWithme';
import FileRepodAddbyMe from './FileRepodAddbyMe';


let selectedUserId = '';
const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;
const animatedComponents = makeAnimated();
let selectedFranchisee = [
  { id: 1, registered_name: 'ABC' },
  { id: 2, registered_name: 'PQR' },
];
let selectedUserRole = [];
let selectedFranchiseeId = '';
const styles = {
  option: (styles, state) => ({
    ...styles,
    backgroundColor: state.isSelected ? '#E27235' : '',
  }),
};

const training = [
  {
    value: 'sydney',
    label: 'Sydney',
  },
  {
    value: 'melbourne',
    label: 'Melbourne',
  },
];
const selectRow = {
  mode: 'checkbox',
  clickToSelect: true,
};

const FileRepository = () => {
  let counter = 0;
  const Navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);
  const [groupFlag, setGroupFlag] = useState(false);
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  // console.log(category, "category")
  const [filterFlag, setFilterFlag] = useState(false);
  const [selectedAll, setSelectedAll] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [userRole, setUserRole] = useState([]);
  const [formSettingData, setFormSettingData] = useState({ shared_role: '' });
  const [loaderFlag, setLoaderFlag] = useState(false);
  const [tabLinkPath, setTabLinkPath] = useState("/available-Files");
  const [sendToAllFranchisee, setSendToAllFranchisee] = useState("none");
  const [franchiseeList, setFranchiseeList] = useState();
  const [error, setError] = useState(false);
  const [filterData, setFilterData] = useState({
    category_id: null,
    search: ""
  });
  const [formSettings, setFormSettings] = useState({
    assigned_franchisee: [],
  });
  console.log(formSettings, "formSettings")
  const [tabFlag, setTabFlag] = useState(true);
  const [fileRepoData, setFileRepoData] = useState([]);
  const [assigned_usersMeFileRepoData, setassigned_usersMeFileRepoData] = useState([]);
  const [errors, setErrors] = useState({});
  const [post, setPost] = React.useState([]);
  const [userData, setUserData] = useState([]);
  userData && console.log('USER DATA:', userData.map(data => data));

  const GetData = async () => {
    let response = await axios.get(`${BASE_URL}/fileRepo/`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    console.log(response, "+++++++++++++++++++++", "response")
    if (response.status === 200) {
      const users = response.data.dataArray;
      console.log(users, "successsuccesssuccesssuccesssuccess")
      let tempData = users.map((dt) => ({
        name: `${dt.categoryId}, ${dt.count}`,
        // createdAt: dt.createdAt,
        // userID: dt.id,
        // creatorName: dt.creatorName + "," + dt.creatorRole
      }));
      // tempData = tempData.filter((data) => data.is_deleted === 0);
      console.log("eeeeeeeeeeeeeeeeeeeeeeeeeee", tempData)
      setUserData(tempData);
      let temp = tempData;
    }
  }

  const fetchFranchiseeList = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/role/franchisee`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.status === "success") {
      setFranchiseeList(response.data.franchiseeList.map(data => ({
        id: data.id,
        cat: data.franchisee_alias,
        key: `${data.franchisee_name}, ${data.city}`
      })));
    }
  };
  useEffect(() => {
    GetData();
    fetchFranchiseeList();
    // getMyAddedFileRepoData();
    // getFilesassigned_usersMeData();
    getFileCategory();
    getUser();
    onSubmit();
  }, []);

  // if (!post) return null;
  const getFileCategory = async () => {
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
    let result = await fetch(`${BASE_URL}/fileRepo/files-category`, requestOptions);
    result = await result.json()
      .then((result) => setCategory(result.category))
      .catch((error) => console.log('error', error));
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

    fetch(`${BASE_URL}/auth/users`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result?.data?.map((item) => {
          item['status'] = false;
        });
        setUser(result?.data);
      })
      .catch((error) => console.log('error', error));
  };

  const setField = (field, value) => {
    if (value === null || value === undefined) {
      setFormSettingData({ ...formSettingData, setting_files: field });
    } else {
      setFormSettingData({ ...formSettingData, [field]: value });
    }

    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
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


  const onSubmit = async (e) => {
    e.preventDefault();
    selectedUser?.map((item) => {
      selectedFranchiseeId += item.id + ',';
    });

    if (!formSettingData.setting_files || !formSettingData.meta_description || !formSettingData.file_category) {
      setError(true);
      return false
    }


    setLoaderFlag(true);

    var myHeaders = new Headers();

    myHeaders.append(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    const file = formSettingData.setting_files[0];
    console.log('file------->', file);
    const blob = await fetch(await toBase64(file)).then((res) => res.blob());
    console.log('reader---->');
    var formdata = new FormData();

    formdata.append('image', blob, file.name);
    formdata.append('description', formSettingData.meta_description);
    formdata.append('title', 'abc');
    formdata.append('createdBy', localStorage.getItem('user_name'));
    formdata.append('userId', localStorage.getItem('user_id'));
    formdata.append('categoryId', formSettingData.file_category);
    formdata.append('franchisee', formSettings.assigned_franchisee);
    if (
      formSettingData.accessible_to_role === null ||
      formSettingData.accessible_to_role === undefined
    ) {
      formdata.append(
        'accessibleToRole',
        null
      );
      formdata.append(
        'accessibleToAll',
        true
      );
    }
    else {
      if (formSettingData.accessible_to_role === 1) {
        formdata.append(
          'user_roles',
          formSettingData.shared_role.slice(0, -1)
        );
        formdata.append(
          'assigned_users',
          ""
        );
        formdata.append(
          'accessibleToRole',
          formSettingData.accessible_to_role
        );
        formdata.append(
          'accessibleToAll',
          false
        );
      } else {
        formdata.append(
          'user_roles',
          ""
        );
        formdata.append(
          'assigned_users',
          selectedUserId.slice(0, -1)
        );
        formdata.append(
          'accessibleToRole',
          formSettingData.accessible_to_role
        );
        formdata.append(
          'accessibleToAll',
          false
        );
      }
    }
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    const ID_array = selectedFranchisee?.split(",");
    let data = ID_array?.length > 1 ? ID_array?.slice(1) : ID_array;
    fetch(`${BASE_URL}/fileRepo?childId=${data}`, requestOptions)
      .then((response) => {
        response.json()
        console.log(response.statusText, "+++++++++++")
        if (response.statusText === "Created") {
          setLoaderFlag(false);
          setShow(false);
          Navigate(`/file-repository`);
        }
      })
      .then((result) => {
        if (result) {
          setLoaderFlag(false);
          setShow(false);
          Navigate('/file-repository')
        }
      })
      .catch((error) => console.log('error', error));
  };

  // { console.log(formSettingData.setting_files, ")>>>>>>>>>>") }

  // const getFilesassigned_usersMeData = () => {
  //   var myHeaders = new Headers();
  //   myHeaders.append(
  //     'authorization',
  //     'Bearer ' + localStorage.getItem('token')
  //   );
  //   var requestOptions = {
  //     method: 'GET',
  //     redirect: 'follow',
  //     headers: myHeaders,
  //   };
  //   fetch(
  //     `${BASE_URL}/uploads/assigned_usersMe/${localStorage.getItem('user_id')}`,
  //     requestOptions
  //   )
  //     .then((response) => response.json())
  //     .then((res) => {
  //       setassigned_usersMeFileRepoData(res);
  //     })
  //     .catch((error) => console.log('error', error));
  // };


  // const getMyAddedFileRepoData = () => {
  //   var myHeaders = new Headers();
  //   myHeaders.append(
  //     'authorization',
  //     'Bearer ' + localStorage.getItem('token')
  //   );
  //   var requestOptions = {
  //     method: 'GET',
  //     redirect: 'follow',
  //     headers: myHeaders,
  //   };

  //   fetch(
  //     `${BASE_URL}/uploads/dashboardFiles/${localStorage.getItem('user_id')}`,
  //     requestOptions
  //   )
  //     .then((response) => response.json())
  //     .then((result) => {

  //       console.log('data--->', result);

  //       setFileRepoData(result);
  //     })
  //     .catch((error) => console.log('error', error));
  // };

  // const getUserRoleAndFranchiseeData = () => {
  //   var requestOptions = {
  //     method: 'GET',
  //     redirect: 'follow',
  //   };

  //   fetch(`${BASE_URL}/fileRepo/`, requestOptions)
  //     .then((response) => response.json())
  //     .then((res) => {
  //       setUserRole(res?.userRoleList);
  //       console.log('response0-------->1', res?.userRoleList);
  //     })
  //     .catch((error) => console.log('error', error));
  // };

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


  function onSelect(index) {
    let data = [...user];
    if (data[index]['status'] === true) {
      data[index]['status'] = false;
      setSelectedAll(false);
    } else {
      data[index]['status'] = true;
    }
    let count = 0;
    data.map((item) => {
      if (item.status === true) count++;
    });
    if (count === data.length) {
      setSelectedAll(true);
    }
    setUser(data);
  }
  post && console.log("post Data", '++++++++++++++++++++++++++++++:', post.map(data => data));

  const handleLinkClick = event => {
    let path = event.target.getAttribute('path');
    setTabLinkPath(path);
  }

  selectedFranchisee && console.log('Selected Franchisee Outside Tab:', selectedFranchisee);
  // console.log('TYPE OF:', typeof selectedFranchisee);
  return (
    <>
      {console.log('hello----->', formSettingData)}
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
                  setSelectedFranchisee={setSelectedFranchisee} />
                {console.log("assigned_usersMeFileRepoData------>", assigned_usersMeFileRepoData)}
                <div className="entry-container">
                  <div className="user-management-sec repository-sec">
                    <ToolkitProvider
                      keyField="name"
                      data={userData}
                      // columns={columns}
                      search
                    >
                      {(props) => (
                        <>
                          <header className="title-head">
                            <h1 className="title-lg">File Repository</h1>
                            <div className="othpanel">
                              <div className="extra-btn">
                                <div className="data-search me-3">
                                  <SearchBar {...props.searchProps} />
                                </div>
                                {/* <Dropdown className="filtercol me-3">
                                  <Dropdown.Toggle
                                    id="extrabtn"
                                    variant="btn-outline"
                                  >
                                    <i className="filter-ico"></i> Add Filters
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <header>Filter by:</header>
                                    <div className="custom-radio btn-radio mb-2">
                                      <label>Users:</label>
                                      <Form.Group>
                                        <Form.Check
                                          inline
                                          label="Admin"
                                          value="Admin"
                                          name="users"
                                          type="radio"
                                          id="one"
                                        />
                                        <Form.Check
                                          inline
                                          label="Co-ordinator"
                                          value="Co-ordinator"
                                          name="users"
                                          type="radio"
                                          id="two"
                                        />
                                        <Form.Check
                                          inline
                                          label="Educator"
                                          value="Educator"
                                          name="users"
                                          type="radio"
                                          id="three"
                                        />
                                        <Form.Check
                                          inline
                                          label="Parent/Guardian"
                                          value="Parent-Guardian"
                                          name="users"
                                          type="radio"
                                          id="four"
                                        />
                                      </Form.Group>
                                    </div>
                                    <div className="custom-radio">
                                      <label className="mb-2">Location:</label>
                                      <Form.Group>
                                        <Select
                                          closeMenuOnSelect={false}
                                          components={animatedComponents}
                                          isMulti
                                          options={training}
                                        />
                                      </Form.Group>
                                    </div>
                                    <footer>
                                      <Button
                                        variant="transparent"
                                        type="submit"
                                      >
                                        Cancel
                                      </Button>
                                      <Button variant="primary" type="submit">
                                        Apply
                                      </Button>
                                    </footer>
                                  </Dropdown.Menu>
                                </Dropdown> */}
                                <span
                                  className="btn btn-primary me-3"
                                  onClick={handleShow}
                                >
                                  <FontAwesomeIcon
                                    icon={faArrowUpFromBracket}
                                  />{' '}
                                  Upload File
                                </span>
                                {/* <Dropdown>
                                  <Dropdown.Toggle
                                    id="extrabtn"
                                    className="ctaact"
                                  >
                                    <img src="../img/dot-ico.svg" alt="" />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item>
                                      <ExportCSVButton {...props.csvProps}>
                                        Export CSV!!
                                      </ExportCSVButton>
                                    </Dropdown.Item>
                                    <Dropdown.Item href="#">
                                      Delete All Row
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown> */}
                              </div>
                            </div>
                          </header>
                          <div className="training-cat mb-3">
                            {/* <ul>
                              <li>
                                <a onClick={() => {
                                  setTabFlag(true);
                                }}
                                  className={tabFlag === true ? 'active' : ''}
                                >
                                  Files shared with me{' '}
                                </a>
                              </li>
                              <li>
                                <a
                                  onClick={() => {
                                    setTabFlag(false);
                                  }}
                                  className={tabFlag === false ? 'active' : ''}
                                >
                                  {' '}
                                  My added files
                                </a>
                              </li>
                            </ul> */}
                            <ul>
                              <li><a onClick={handleLinkClick} path="/available-Files" className={`${tabLinkPath === "/available-Files" ? "active" : ""}`}>Files shared with me</a></li>
                              {
                                verifyPermission("file_repository", "add") &&
                                <li><a onClick={handleLinkClick} path="/created-by-me" className={`${tabLinkPath === "/created-by-me" ? "active" : ""}`}>My added files</a></li>
                              }
                            </ul>
                          </div>
                          <div className="training-column">
                            {tabLinkPath === "/available-Files"
                              && <FileRepoShairWithme
                                filter={filterData} />}
                            {tabLinkPath === "/created-by-me"
                              && <FileRepodAddbyMe
                                filter={filterData}
                                selectedFranchisee={selectedFranchisee} />}
                          </div>
                          {/* <BootstrapTable
                            {...props.baseProps}
                            selectRow={selectRow}
                            pagination={paginationFactory()}
                          /> */}
                        </>
                      )}
                    </ToolkitProvider>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>

      <Modal
        className="training-modal"
        size="lg"
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton className="f-c-modal"></Modal.Header>
        <Modal.Body className="p-0">
          <div className="form-settings-content">
            <div className="modal-top">
              <div className="modal-top-containt">
                <Row>
                  <Col md={12}>
                    <Form.Group>
                    <Form.Label>Upload File:*</Form.Label>
                      <DragDropRepository onChange={setField} />
                      {error && !formSettingData.setting_files && < span className="error"> File Category is required!</span>}
                      <p className="error">{errors.setting_files}</p>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="setting-heading">
                  <h2>Settings</h2>
                </div>
              </div>
              <hr></hr>
            </div>
            <div className="modal-bottom">
              <Row>
                <Col lg={12}>
                  <div className="metadescription">
                    <Form.Group className="mb-3">
                      <Form.Label>Meta Description*</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="meta_description"
                        onChange={(e) => {
                          setField(e.target.name, e.target.value);
                        }}
                      />
                      {error && !formSettingData.meta_description && < span className="error"> Meta Description is required!</span>}
                    </Form.Group>
                  </div>
                </Col>
                <Col lg={12}>
                  <Form.Group>
                    <Form.Label>File Category*</Form.Label>
                    <Form.Select
                      name="file_category"
                      onChange={(e) => {
                        setField(e.target.name, e.target.value);
                      }}
                    >
                      <option value="">Select File Category</option>
                      {category?.map((item) => {
                        return (
                          <option value={item.id}>{item.category_name}</option>
                        );
                      })}
                    </Form.Select>
                    {error && !formSettingData.file_category && < span className="error"> File is required!</span>}
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col lg={3} md={6}>
                  <Form.Group>
                    <Form.Label>Send to all franchisee:</Form.Label>
                    <div className="new-form-radio d-block">
                      <div className="new-form-radio-box">
                        <label for="all">
                          <input
                            type="radio"
                            checked={sendToAllFranchisee === 'all'}
                            name="send_to_all_franchisee"
                            id="all"
                            onChange={() => {
                              setFormSettings(prevState => ({
                                ...prevState,
                                assigned_franchisee: ['all']
                              }));
                              setSendToAllFranchisee('all')
                            }}
                          />
                          <span className="radio-round"></span>
                          <p>Yes</p>
                        </label>
                      </div>
                      <div className="new-form-radio-box m-0 mt-3">
                        <label for="none">
                          <input
                            type="radio"
                            name="send_to_all_franchisee"
                            checked={sendToAllFranchisee === 'none'}
                            id="none"
                            onChange={() => {
                              setFormSettings(prevState => ({
                                ...prevState,
                                assigned_franchisee: []
                              }));
                              setSendToAllFranchisee('none')
                            }}
                          />
                          <span className="radio-round"></span>
                          <p>No</p>
                        </label>
                      </div>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg={9} md={12}>
                  <Form.Group>
                    <Form.Label>Select Franchisee</Form.Label>
                    <div className="select-with-plus">
                      <Multiselect
                        disable={sendToAllFranchisee === 'all'}
                        placeholder={"Select User Names"}
                        displayValue="key"
                        className="multiselect-box default-arrow-select"
                        onRemove={function noRefCheck(data) {
                          setFormSettings((prevState) => ({
                            ...prevState,
                            assigned_franchisee: [...data.map(data => data.id)],
                          }));
                        }}

                        onSelect={function noRefCheck(data) {
                          setFormSettings((prevState) => ({
                            ...prevState,
                            assigned_franchisee: [...data.map((data) => data.id)],
                          }));
                        }}
                        options={franchiseeList}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col lg={3} md={6}>
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
                              setField(e.target.name, parseInt(e.target.value));
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
                              setField(e.target.name, parseInt(e.target.value));
                            }}
                            checked={formSettingData.accessible_to_role === 0}
                          />
                          <span className="radio-round"></span>
                          <p>Specific Users</p>
                        </label>
                      </div>
                    </div>
                  </Form.Group>
                </Col>
                <Col lg={9} md={12}>
                  {console.log(formSettingData, "{console.log(...formSettingData)}")}
                  {formSettingData.accessible_to_role === 1 ? (
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
                                data['shared_role'] = data[
                                  'shared_role'
                                ].replace(e.target.id + ',', '');
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
                                data['shared_role'] = data[
                                  'shared_role'
                                ].replace(e.target.id + ',', '');
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
                                data['shared_role'] = data[
                                  'shared_role'
                                ].replace(e.target.id + ',', '');
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
                                  data['shared_role'] += 'coordinator';
                                }
                                if (
                                  !data['shared_role']
                                    .toString()
                                    .includes('all')
                                ) {
                                  data['shared_role'] += ',';
                                }
                                setFormSettingData(data);
                              } else {
                                data['shared_role'] = '';
                                setFormSettingData(data);
                              }
                            }}
                            checked={formSettingData?.shared_role?.includes(
                              'parent,educator,coordinator'
                            )}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </Form.Group>
                  ) : null}
                  {formSettingData.accessible_to_role === 0 ? (
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
                  ) : null}
                </Col>
              </Row>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="transparent" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            {loaderFlag === true ? (
              <>
                <img
                  style={{ width: '24px' }}
                  src={'/img/mini_loader1.gif'}
                  alt=""
                />
                Uploading...
              </>
            ) : (
              'Upload File'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="select-user-modal">
        <Modal
          className="select-user-modal select-user"
          show={groupFlag}
          onHide={() => {
            setSelectedUser([]);
            setGroupFlag(false);
          }}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton className="select-users-header">
            <Button className="ml-auto">
              <img src="../../img/carbon_settings.svg" />
            </Button>
            <Modal.Title
              id="contained-modal-title-vcenter"
              className="modal-heading"
            >
              Select Users
            </Modal.Title>
            <button
              type="button"
              id="extrabtn"
              aria-expanded="false"
              class="filter-button btn btn-btn-outline "
              onClick={() => {
                setFilterFlag(true);
              }}
            >
              <i class="filter-ico"></i> Add Filters
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="select-user-modal-body ">
              <div className="select-user-list-head"></div>
              <div className="select-user-list-row main-lable">
                <div className="s-modal-left s-modal-heading">
                  <div className="select-user-checkbox  modal-two-check">
                    <label className="container">
                      <input
                        type="checkbox"
                        name="role"
                        id="co-ordinators"
                        checked={selectedAll === true}
                        onClick={(e) => {
                          setSelectedAll(e.target.checked);
                          let data = [...user];
                          data?.map((item) => {
                            item.status = e.target.checked;
                          });
                          setUser(data);
                        }}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="select-user-image-name main-lable-img">
                    {/* <img alt="" id="user-pic" src="/img/user.png" /> */}
                    <h6>Name</h6>
                  </div>
                </div>
                <div className="select-user-role main-lable-heading">
                  <h6>User Role</h6>
                </div>
              </div>
            </div>
            {console.log('user----->', user)}
            {user?.map((item, index) => {
              return (
                <div className="select-user-modal-body">
                  <div className="select-user-list-head"></div>
                  <div className="select-user-list-row">
                    <div className="s-modal-left">
                      <div className="select-user-checkbox  modal-two-check">
                        <label className="container">
                          <input
                            type="checkbox"
                            name="role"
                            id="co-ordinators"
                            onClick={() => {
                              onSelect(index);
                            }}
                            checked={item.status === true}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <div className="select-user-image-name">
                        <img alt="" id="user-pic" src="/img/user.png" />
                        <h6>{item.fullname}</h6>
                      </div>
                    </div>
                    <div className="select-user-role text-capitalize">
                      <h6>{item.role.split('_').join(' ')}</h6>
                    </div>
                  </div>
                </div>
              );
            })}
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button
              variant="transparent"
              onClick={() => {
                setSelectedUser([]);
                setGroupFlag(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setGroupFlag(false);
                let data = [...user];
                let selectedData = [];
                data.map((item) => {
                  if (item.status === true) {
                    selectedData.push(item);
                  }
                });
                setSelectedUser(selectedData);
              }}
            >
              Done
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="filter-user-modal-wrp">
        <Modal
          className="select-user-modal select-user filter-user-modal"
          show={filterFlag}
          onHide={() => {
            setSelectedUser([]);
            setFilterFlag(false);
          }}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton className="select-users-header">
            <Modal.Title
              id="contained-modal-title-vcenter"
              className="modal-heading"
            >
              Filter by:
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="filter-wpr">
              <Form.Label>Select Filter Criteria:</Form.Label>
              <Form.Select
                name="file_category"
                onChange={(e) => {
                  setField(e.target.name, e.target.value);
                }}
              >
                <option value="">User based on their roles</option>
                <option value="">Parents specific to a educator</option>
                <option value="">Children specific to a educator</option>
                <option value="">
                  All users connected to a specific franchise
                </option>
                <option value="">
                  All internal users connected to a specific franchise (excludes
                  parents)
                </option>
                <option value="">All users</option>
                <option value="">
                  All internal users(all users excepts parents/children)
                </option>
                <option value="">
                  User based on their roles for a specific franchise
                </option>
                <option value="">Parents specific to children</option>
                <option value="">Co-ordinator specific to educator</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="select-role-wrp">
              <Form.Label>Select a role</Form.Label>
              <div className="select-check-wrp">
                {userRole.map((item) => {
                  return (
                    <div class="form-group">
                      <input type="radio" id={item.role_name} name="role" />
                      <label for={item.role_name}>{item.role_label}</label>
                    </div>
                  );
                })}
              </div>
              {/* <div className="select-check-wrp">
                <div class="form-group">
                  <input type="checkbox" id="html" />
                  <label for="html">Admin</label>
                </div>
                <div class="form-group">
                  <input type="checkbox" id="css" />
                  <label for="css">Co-ordinator</label>
                </div>
                <div class="form-group">
                  <input type="checkbox" id="javascript" />
                  <label for="javascript">Educator</label>
                </div>
                <div class="form-group">
                  <input type="checkbox" id="javascript1" />
                  <label for="javascript1">Parent/Guardian</label>
                </div>
              </div> */}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button
              variant="transparent"
              onClick={() => {
                setSelectedUser([]);
                setGroupFlag(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setFilterFlag(false);
                let data = [...user];
                let selectedData = [];
                data.map((item) => {
                  if (item.status === true) {
                    selectedData.push(item);
                  }
                });
                setSelectedUser(selectedData);
              }}
            >
              Apply
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default FileRepository;
