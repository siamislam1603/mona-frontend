import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Dropdown,
  Form,
  Modal,
  Row,
  Col,
  Tabs,
  Tab,
} from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import Multiselect from "multiselect-react-dropdown";
import DragDropRepository from "../components/DragDropRepository";
import { BASE_URL } from "../components/App";
import { createFileRepoValidation } from "../helpers/validation";
import moment from "moment";

const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;
const animatedComponents = makeAnimated();
let selectedFranchisee = [];
let selectedUserRole = [];
const styles = {
  option: (styles, state) => ({
    ...styles,
    backgroundColor: state.isSelected ? "#E27235" : "",
  }),
};
const training = [
  {
    value: "sydney",
    label: "Sydney",
  },
  {
    value: "melbourne",
    label: "Melbourne",
  },
];

const selectRow = {
  mode: "checkbox",
  clickToSelect: true,
};

const FileRepository = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [franchisee, setFranchisee] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const [settingData, setSettingData] = useState({
    applicable_to_franchisee: "1",
    applicable_to_user: "1",
  });
  const [columns,setColumns]=useState([
    {
      dataField: "name",
      text: "Name",
      sort: true,
      formatter: (cell) => {
        cell = cell.split(",");
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
      dataField: "createdon",
      text: "Created on",
      sort: true,
    },
    {
      dataField: "createdby",
      text: "Created by",
      sort: true,
      formatter: (cell) => {
        cell = cell.split(",");
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
      dataField: "action",
      text: "",
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
  ])
  const [tabFlag,setTabFlag]=useState(true);
  const [fileRepoData, setFileRepoData] = useState([]);
  const [sharedWithMeFileRepoData,setSharedWithMeFileRepoData]=useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getUserRoleAndFranchiseeData();
    getMyAddedFileRepoData();
    getFilesSharedWithMeData();
  }, []);
  const setField = (field, value) => {
    if (!value) {
      setSettingData({ ...settingData, setting_files: field });
    } else {
      setSettingData({ ...settingData, [field]: value });
    }
    console.log("form---->", settingData);
    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const newErrors = createFileRepoValidation(
      settingData,
      selectedFranchisee,
      selectedUserRole
    );
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      alert("success");
    }
  };
  const getFilesSharedWithMeData=()=>{
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${BASE_URL}/uploads/sharedWithMe/${localStorage.getItem('user_id')}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        let repoData = [];
        
        res?.map((item) => {
          item.filesPath = item.filesPath.split("/");
          repoData.push({
            id: item.id,
            name: "../img/abstract-ico.png,"+item.filesPath[item.filesPath.length - 1],
            createdon: moment(item.createdAt).format("DD/MM/YYYY"),
            createdby: item.creatorName + "," + item.creatorRole,
            sharing: "../img/sharing-ico.png, Shared"
          });
        });
        console.log("repoData---->",repoData);
        setSharedWithMeFileRepoData(repoData);
      })
      .catch((error) => console.log("error", error));
  }
  const getMyAddedFileRepoData = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${BASE_URL}/uploads/dashboardFiles/${localStorage.getItem('user_id')}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        let repoData = [];
        
        res?.map((item) => {
          item.filesPath = item.filesPath.split("/");
          repoData.push({
            id: item.id,
            name: "../img/abstract-ico.png,"+item.filesPath[item.filesPath.length - 1],
            createdon: moment(item.createdAt).format("DD/MM/YYYY"),
            createdby: item.creatorName + "," + item.creatorRole,
            sharing: "../img/sharing-ico.png, Shared"
          });
        });
        console.log("repoData---->",repoData);
        setFileRepoData(repoData);
      })
      .catch((error) => console.log("error", error));
  };
  const getUserRoleAndFranchiseeData = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${BASE_URL}/api/user-role`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        setUserRole(res?.userRoleList);
        console.log("response0-------->1", res?.userRoleList);
      })
      .catch((error) => console.log("error", error));
    fetch(`${BASE_URL}/api/franchisee-data`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        setFranchisee(res?.franchiseeList);
      })
      .catch((error) => console.log("error", error));
  };
  function onSelectFranchisee(optionsList, selectedItem) {
    console.log("selected_item---->2", selectedItem);
    selectedFranchisee.push(selectedItem.id);
    console.log("selected_item---->1selectedFranchisee", selectedFranchisee);
  }
  function onRemoveFranchisee(selectedList, removedItem) {
    const index = selectedFranchisee.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedFranchisee.splice(index, 1);
  }

  function onSelectUserRole(optionsList, selectedItem) {
    console.log("selected_item---->2", selectedItem);
    selectedUserRole.push(selectedItem.role_label);
    console.log("selected_item---->1selectedFranchisee", selectedFranchisee);
  }
  function onRemoveUserRole(selectedList, removedItem) {
    const index = selectedUserRole.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedUserRole.splice(index, 1);
  }
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
                
                <div className="entry-container">
                  <div className="user-management-sec repository-sec">
                    <ToolkitProvider
                      keyField="name"
                      data={tabFlag===false ? fileRepoData : sharedWithMeFileRepoData}
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
                                  />{" "}
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
                                <a onClick={()=>{setTabFlag(true)}} className={tabFlag===true ? "active" : ""}>
                                  Files shared with me{" "}
                                </a>
                              </li>
                              <li>
                                <a onClick={()=>{setTabFlag(false)}} className={tabFlag===false ? "active" : ""}> My added files</a>
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
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settings-content">
            <Row>
              <Col md={12}>
                <Form.Group>
                  <DragDropRepository onChange={setField} />
                  <p className="error">{errors.setting_files}</p>
                </Form.Group>
              </Col>
            </Row>
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
                            setField(e.target.name, e.target.value);
                          }}
                          checked={
                            settingData.applicable_to_franchisee === "1"
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
                            setField(e.target.name, e.target.value);
                          }}
                          checked={
                            settingData.applicable_to_franchisee === "0"
                          }
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              {settingData.applicable_to_franchisee === "0" ? (
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
                            setField(e.target.name, e.target.value);
                          }}
                          checked={settingData.applicable_to_user === "1"}
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
                            setField(e.target.name, e.target.value);
                          }}
                          checked={settingData.applicable_to_user === "0"}
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              {settingData.applicable_to_user === "0" ? (
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
        <Modal.Footer>
          <Button variant="transparent" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Upload File
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FileRepository;
