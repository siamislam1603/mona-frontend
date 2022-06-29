import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Dropdown,
  Form,
  Modal,
  Row,
  Col,
} from 'react-bootstrap';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import ToolkitProvider, {
  Search,
  CSVExport,
} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import Multiselect from 'multiselect-react-dropdown';
import DragDropRepository from '../components/DragDropRepository';
import { BASE_URL } from '../components/App';
import { createFileRepoValidation } from '../helpers/validation';
import moment from 'moment';

const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;
const animatedComponents = makeAnimated();
let selectedFranchisee = [
  { id: 1, registered_name: 'ABC' },
  { id: 2, registered_name: 'PQR' },
];
let selectedUserRole = [];
let selectedFranchiseeId = '';
let selectedUserRoleName = '';
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
  const [show, setShow] = useState(false);
  const [category, setCategory] = useState([]);
  const [groupFlag, setGroupFlag] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [franchisee, setFranchisee] = useState([
    { id: 1, registered_name: 'ABC' },
    { id: 2, registered_name: 'PQR' },
    { id: 3, registered_name: 'RST' },
    { id: 4, registered_name: 'VWX' },
    { id: 5, registered_name: 'XYZ' },
  ]);
  const [userRole, setUserRole] = useState([]);
  const [settingData, setSettingData] = useState({
    applicable_to_franchisee: '1',
    applicable_to_user: '1',
  });
  const [loaderFlag, setLoaderFlag] = useState(false);
  const [columns, setColumns] = useState([
    {
      dataField: 'name',
      text: 'Name',
      sort: true,
      formatter: (cell) => {
        cell = cell.split(',');
        return (
          <>
            <div className="user-list">
              <span className="user-pic">
                <img src={cell[0]} alt="" />
              </span>
              <span className="user-name">
                {cell[1]}
                {/* <small>{cell[2]}</small> */}
              </span>
            </div>
          </>
        );
      },
    },
    {
      dataField: 'createdon',
      text: 'Created on',
      sort: true,
    },
    {
      dataField: 'createdby',
      text: 'Created by',
      sort: true,
      formatter: (cell) => {
        cell = cell.split(',');
        return (
          <>
            <div className="user-list">
              <span className="user-name">
                {cell[0]} <small>{cell[1]}</small>
              </span>
            </div>
          </>
        );
      },
    },
    {
      dataField: 'action',
      text: '',
      formatter: (cell) => {
        return (
          <>
            <div className="cta-col">
              <Dropdown>
                <Dropdown.Toggle variant="transparent" id="ctacol">
                  <img src="../img/dot-ico.svg" alt="" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#">Delete</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </>
        );
      },
    },
  ]);
  const [tabFlag, setTabFlag] = useState(true);
  const [fileRepoData, setFileRepoData] = useState([]);
  const [sharedWithMeFileRepoData, setSharedWithMeFileRepoData] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // getUserRoleAndFranchiseeData();
    getMyAddedFileRepoData();
    getFilesSharedWithMeData();
    getFileCategory();
  }, []);
  const getFileCategory = () => {
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

    fetch(`${BASE_URL}/api/file-category`, requestOptions)
      .then((response) => response.json())
      .then((result) => setCategory(result?.result))
      .catch((error) => console.log('error', error));
  };
  const setField = (field, value) => {
    if (!value) {
      setSettingData({ ...settingData, setting_files: field });
    } else {
      setSettingData({ ...settingData, [field]: value });
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
    // const newErrors = createFileRepoValidation(
    //   settingData,
    //   selectedFranchisee,
    //   selectedUserRole
    // );
    // if (Object.keys(newErrors).length > 0) {
    //   setErrors(newErrors);
    // } else {
    if (settingData.applicable_to_user === '1') {
      selectedUserRole = '';
    }
    if (settingData.applicable_to_franchisee === '1') {
      selectedFranchisee = '';
    }
    setLoaderFlag(true);
    var myHeaders = new Headers();
    myHeaders.append(
      'authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    const file = settingData.setting_files[0];
    console.log('file------->', file);
    const blob = await fetch(await toBase64(file)).then((res) => res.blob());
    console.log('reader---->');
    var formdata = new FormData();
    formdata.append('image', blob, file.name);
    formdata.append('description', 'abc');
    formdata.append('title', 'abc');
    formdata.append('createdBy', localStorage.getItem('user_name'));
    formdata.append('userId', localStorage.getItem('user_id'));
    formdata.append('AccessToAllUser', settingData.applicable_to_user);
    formdata.append('category_id', settingData.file_category);
    formdata.append(
      'AccessToAllFranchisee',
      settingData.applicable_to_franchisee
    );
    formdata.append('sharedWith', selectedFranchiseeId);
    formdata.append('SharedRole', selectedUserRoleName);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/uploads/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          setLoaderFlag(false);
          setShow(false);
        }
      })
      .catch((error) => console.log('error', error));
    // }
  };
  const getFilesSharedWithMeData = () => {
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
    fetch(
      `${BASE_URL}/uploads/sharedWithMe/${localStorage.getItem('user_id')}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((res) => {
        let repoData = [];

        res?.map((item) => {
          if (item.filesPath.includes('/')) {
            item.filesPath = item.filesPath.split('/');
          }

          if (item.filesPath.includes('\\')) {
            console.log('Hello9009546546789875674');
            item.filesPath = item.filesPath.split('\\');
          }
          repoData.push({
            id: item.id,
            name:
              '../img/abstract-ico.png,' +
              item.filesPath[item.filesPath.length - 1],
            createdon: moment(item.createdAt).format('DD/MM/YYYY'),
            createdby: item.creatorName + ',' + item.creatorRole,
            sharing: '../img/sharing-ico.png, Shared',
          });
        });
        console.log('repoData---->', repoData);
        setSharedWithMeFileRepoData(repoData);
      })
      .catch((error) => console.log('error', error));
  };
  const getMyAddedFileRepoData = () => {
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

    fetch(
      `${BASE_URL}/uploads/dashboardFiles/${localStorage.getItem('user_id')}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((res) => {
        let repoData = [];

        res?.map((item) => {
          if (item.filesPath.includes('/')) {
            item.filesPath = item.filesPath.split('/');
          }

          if (item.filesPath.includes('\\')) {
            console.log('Hello9009546546789875674');
            item.filesPath = item.filesPath.split('\\');
          }
          repoData.push({
            id: item.id,
            name:
              '../img/abstract-ico.png,' +
              item.filesPath[item.filesPath.length - 1],
            createdon: moment(item.createdAt).format('DD/MM/YYYY'),
            createdby: item.creatorName + ',' + item.creatorRole,
            sharing: '../img/sharing-ico.png, Shared',
          });
        });
        console.log('repoData---->', repoData);
        setFileRepoData(repoData);
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
  function onSelectFranchisee(optionsList, selectedItem) {
    console.log('selected_item---->2', selectedItem);
    selectedFranchiseeId += selectedItem.id + ',';
    selectedFranchisee.push({
      id: selectedItem.id,
      registered_name: selectedItem.registered_name,
    });
    {
      console.log('selectedFranchisee---->', selectedFranchisee);
    }
  }
  function onRemoveFranchisee(selectedList, removedItem) {
    selectedFranchiseeId = selectedFranchiseeId.replace(
      removedItem.id + ',',
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
  return (
    <>
      {console.log('form---->', settingData)}
      {console.log('form----franchisee>', selectedFranchisee)}
      {console.log('form----user-role>', selectedUserRole)}
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
                <TopHeader />

                <div className="entry-container">
                  <div className="user-management-sec repository-sec">
                    <ToolkitProvider
                      keyField="name"
                      data={
                        tabFlag === false
                          ? fileRepoData
                          : sharedWithMeFileRepoData
                      }
                      columns={columns}
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
                                <Dropdown className="filtercol me-3">
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
                                </Dropdown>
                                <span
                                  className="btn btn-primary me-3"
                                  onClick={handleShow}
                                >
                                  <FontAwesomeIcon
                                    icon={faArrowUpFromBracket}
                                  />{' '}
                                  Upload File
                                </span>
                                <Dropdown>
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
                                </Dropdown>
                              </div>
                            </div>
                          </header>

                          <div className="training-cat mb-3">
                            <ul>
                              <li>
                                <a
                                  onClick={() => {
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
                            </ul>
                          </div>
                          <BootstrapTable
                            {...props.baseProps}
                            selectRow={selectRow}
                            pagination={paginationFactory()}
                          />
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
                      <DragDropRepository onChange={setField} />
                      <p className="error">{errors.setting_files}</p>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="toggle-switch">
                  <Row>
                    <Col md={12}>
                      <div className="t-switch">
                        <p>Enable Sharing</p>
                        <div className="toogle-swich">
                          <input
                            className="switch"
                            name="required"
                            type="checkbox"
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
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
                      <Form.Label>Meta Description</Form.Label>
                      <Form.Control as="textarea" rows={2} />
                    </Form.Group>
                  </div>
                </Col>
              </Row>
            </div>
            <Row className="mt-4">
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label>Accessible to:</Form.Label>
                  <div className="new-form-radio d-block">
                    <div className="new-form-radio-box">
                      <label for="yes1">
                        <input
                          type="radio"
                          value="1"
                          name="applicable_to_franchisee"
                          id="yes1"
                          onChange={(e) => {
                            setField(e.target.name, e.target.value);
                          }}
                          checked={settingData.applicable_to_franchisee === '1'}
                        />
                        <span className="radio-round"></span>
                        <p>User Roles</p>
                      </label>
                    </div>
                    <div className="new-form-radio-box m-0 mt-3">
                      <label for="no1">
                        <input
                          type="radio"
                          value="0"
                          name="applicable_to_franchisee"
                          id="no1"
                          onChange={(e) => {
                            setField(e.target.name, e.target.value);
                          }}
                          checked={settingData.applicable_to_franchisee === '0'}
                        />
                        <span className="radio-round"></span>
                        <p>Specific Users</p>
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              <Col lg={9} md={12}>
                {settingData.applicable_to_franchisee === '1' ? (
                  <Form.Group>
                    <Form.Label>Select User Roles</Form.Label>
                    <div className="modal-two-check user-roles-box">
                      <label className="container">
                        Co-ordinators
                        <input type="checkbox" name="role" id="co-ordinators" />
                        <span className="checkmark"></span>
                      </label>
                      <label className="container">
                        Educators
                        <input type="checkbox" name="role" id="co-ordinators" />
                        <span className="checkmark"></span>
                      </label>
                      <label className="container">
                        Parents
                        <input type="checkbox" name="role" id="co-ordinators" />
                        <span className="checkmark"></span>
                      </label>
                      <label className="container">
                        All Roles
                        <input type="checkbox" name="role" id="co-ordinators" />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                  </Form.Group>
                ) : null}
                {settingData.applicable_to_franchisee === '0' ? (
                  <Form.Group>
                    <Form.Label>Select Franchisee</Form.Label>
                    <div className="select-with-plus">
                      <Multiselect
                        displayValue="registered_name"
                        className="multiselect-box default-arrow-select"
                        // placeholder="Select Franchisee"
                        selectedValues={selectedFranchisee}
                        // onKeyPressFn={function noRefCheck() {}}
                        onRemove={onRemoveFranchisee}
                        // onSearch={function noRefCheck() {}}
                        onSelect={onSelectFranchisee}
                        // options={franchisee}
                      />

                      <Button className="add_operating_button">
                        <FontAwesomeIcon
                          icon={faPlus}
                          onClick={() => {
                            setGroupFlag(true);
                          }}
                        />
                      </Button>
                    </div>
                    <p className="error">{errors.franchisee}</p>
                  </Form.Group>
                ) : null}
                {/* <Form.Group>
                  <Form.Label>File Category</Form.Label>
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
                </Form.Group> */}
              </Col>
            </Row>
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
              class="dropdown-toggle btn btn-btn-outline"
            >
              <i class="filter-ico"></i> Add Filters
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="select-user-modal-body ">
              <div className="select-user-list-head"></div>
              <div className="select-user-list-row main-lable">
                <div className="select-user-checkbox  modal-two-check">
                  <label className="container">
                    <input type="checkbox" name="role" id="co-ordinators" />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="select-user-image-name main-lable-img">
                  {/* <img alt="" id="user-pic" src="/img/user.png" /> */}
                  <h6>James Smith</h6>
                </div>
                <div className="select-user-role main-lable-heading">
                  <h6>Educator</h6>
                </div>
              </div>
            </div>
            <div className="select-user-modal-body">
              <div className="select-user-list-head"></div>
              <div className="select-user-list-row">
                <div className="select-user-checkbox  modal-two-check">
                  <label className="container">
                    <input type="checkbox" name="role" id="co-ordinators" />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="select-user-image-name">
                  <img alt="" id="user-pic" src="/img/user.png" />
                  <h6>James Smith</h6>
                </div>
                <div className="select-user-role">
                  <h6>Educator</h6>
                </div>
              </div>
            </div>
            <div className="select-user-modal-body">
              <div className="select-user-list-head"></div>
              <div className="select-user-list-row">
                <div className="select-user-checkbox  modal-two-check">
                  <label className="container">
                    <input type="checkbox" name="role" id="co-ordinators" />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="select-user-image-name">
                  <img alt="" id="user-pic" src="/img/user.png" />
                  <h6>James Smith</h6>
                </div>
                <div className="select-user-role">
                  <h6>Educator</h6>
                </div>
              </div>
            </div>
            <div className="select-user-modal-body">
              <div className="select-user-list-head"></div>
              <div className="select-user-list-row">
                <div className="select-user-checkbox  modal-two-check">
                  <label className="container">
                    <input type="checkbox" name="role" id="co-ordinators" />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="select-user-image-name">
                  <img alt="" id="user-pic" src="/img/user.png" />
                  <h6>James Smith</h6>
                </div>
                <div className="select-user-role">
                  <h6>Educator</h6>
                </div>
              </div>
            </div>
            <div className="select-user-modal-body">
              <div className="select-user-list-head"></div>
              <div className="select-user-list-row">
                <div className="select-user-checkbox  modal-two-check">
                  <label className="container">
                    <input type="checkbox" name="role" id="co-ordinators" />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="select-user-image-name">
                  <img alt="" id="user-pic" src="/img/user.png" />
                  <h6>James Smith</h6>
                </div>
                <div className="select-user-role">
                  <h6>Educator</h6>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button variant="transparent" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onSubmit}>
              Done
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default FileRepository;
