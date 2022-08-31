import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Modal, Row, Col } from 'react-bootstrap';
import axios from "axios";
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import makeAnimated from 'react-select/animated';
import { verifyPermission } from '../helpers/roleBasedAccess';
import ToolkitProvider, { Search, CSVExport, } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import Multiselect from 'multiselect-react-dropdown';
import DragDropRepository from '../components/DragDropRepository';
import { BASE_URL } from '../components/App';
import { useNavigate } from 'react-router-dom';
import FileRepoShairWithme from './FileRepoShairWithme';
import FileRepodAddbyMe from './FileRepodAddbyMe';
import FilerepoUploadFile from './FilerepoUploadFile';


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
  const [child, setChild] = useState([]);
  const [selectedChild, setSelectedChild] = useState([]);
  const [userData, setUserData] = useState([]);
  userData && console.log('USER DATA:', userData.map(data => data));



  const getUser_Role = localStorage.getItem(`user_role`)
  const getFranchisee = localStorage.getItem('franchisee_id')

  const GetData = async () => {
    let response = await axios.get(`${BASE_URL}/fileRepo/`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    console.log(response, "+++++++++++++++++++++", "response")
    if (response.status === 200) {
      const users = response.data.dataDetails;
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

  const getChildren = async () => {
    var myHeaders = new Headers();
    myHeaders.append(
      'authorization',
      'Bearer ' + localStorage.getItem('token')
    );

    let franchiseeArr = getUser_Role == 'franchisor_admin' ? formSettings.franchisee : [getFranchisee]

    var request = {
      headers: myHeaders,
    };

    let response = await axios.post(`${BASE_URL}/enrollment/franchisee/child`, { franchisee_id: franchiseeArr }, request)
    if (response.status === 200) {
      setChild(response.data.children)
    }
  }

  useEffect(() => {
    getUser();
    getChildren()
  }, [formSettings.franchisee])


  useEffect(() => {
    GetData();
    fetchFranchiseeList();
    getFileCategory();
    getUser();
    onSubmit();
  }, []);

  useEffect(() => {
    let role = localStorage.getItem('user_role')
    if (role != 'franchisor_admin') {
      setFormSettings((prevState) => ({
        ...prevState,
        assigned_franchisee: [getFranchisee],
        franchisee: [getFranchisee]
      }))
    }
  }, [])
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
  const getUser = async () => {
    var myHeaders = new Headers();
    myHeaders.append(
      'authorization',
      'Bearer ' + localStorage.getItem('token')
    );

    var request = {
      headers: myHeaders,
    };

    let franchiseeArr = getUser_Role == 'franchisor_admin' ? formSettings.franchisee : [getFranchisee]

    let response = await axios.post(`${BASE_URL}/auth/users/franchisees`, { franchisee_id: franchiseeArr }, request)
    if (response.status === 200) {
      // console.log(response.data.users, "respo")
      let userList = response.data.users
      if (getUser_Role == 'franchisee_admin') {
        userList = response.data.users.filter(c => ['coordinator', 'educator', 'guardian']?.includes(c.role + ""))
      } else if (getUser_Role == 'coordinator') {
        userList = response.data.users.filter(c => ['educator', 'guardian']?.includes(c.role + ""))
      } else if (getUser_Role == 'educator') {
        userList = response.data.users.filter(c => ['guardian']?.includes(c.role + ""))
      }
      setUser(userList)
    }
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
    formdata.append('franchisee', formSettings.assigned_franchisee[0] == "all" ? [] : formSettings.assigned_franchisee);
    if (
      formSettingData.accessible_to_role === null ||
      formSettingData.accessible_to_role === undefined
    ) {
      formdata.append(
        'accessibleToRole',
        ""
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
          selectedUserId.slice(0, -1) == "" ? [] : selectedUserId.slice(0, -1)
        );
        formdata.append(
          'accessibleToRole',
          formSettingData.accessible_to_role
        );
        formdata.append(
          'accessibleToAll',
          false
        );
        formdata.append(
          'assigned_childs',
          formSettings.assigned_childs
        )
      }
    }
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };


    fetch(`${BASE_URL}/fileRepo/`, requestOptions)
      .then((response) => {
        response.json()
        console.log(response.statusText, "+++++++++++")
        if (response.statusText === "Created") {
          setLoaderFlag(false);
          setShow(false);
          Navigate(`/file-repository-List-me/${formSettingData.file_category}`);
        }
      })
      .then((result) => {
        if (result) {
          setLoaderFlag(false);
          setShow(false);
          Navigate(`/file-repository-List-me/${formSettingData.file_category}`);
        }
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

  function onSelectChild(selectedItem) {
    let selectedchildarr = selectedItem
    selectedItem = selectedItem.map((item) => {
      return item.id
    })
    setFormSettings(prevState => ({
      ...prevState,
      assigned_childs: selectedItem
    }));
    console.log(selectedChild, "Selllee")
    setSelectedChild(selectedchildarr)
  }

  function onRemoveChild(removedItem) {
    let removedchildarr = removedItem
    removedItem = removedItem.map((item) => {
      return item.id
    })
    setFormSettings(prevState => ({
      ...prevState,
      assigned_childs: removedItem
    }));
    console.log(selectedChild, "Selllee")
    setSelectedChild(removedchildarr)
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

  const isAllRolesChecked = () => {
    let bool = false;
    if (getUser_Role == "franchisor_admin") {
      bool = ["guardian", "educator", "coordinator", "franchisee_admin"].every(item => formSettingData?.shared_role?.includes(item))
    }
    else if (getUser_Role == "franchisee_admin") {
      bool = ["guardian", "educator", "coordinator"].every(item => formSettingData?.shared_role?.includes(item))
    }
    else if (getUser_Role == "coordinator") {
      bool = ["guardian", "educator"].every(item => formSettingData?.shared_role?.includes(item))
    }
    else if (getUser_Role == "educator") {
      bool = ["guardian"].every(item => formSettingData?.shared_role?.includes(item))
    }

    return bool;
  }
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
                <TopHeader />
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
                                <FilerepoUploadFile />
                                {/* <span
                                  className="btn btn-primary me-3"
                                  onClick={handleShow}
                                >
                                  <FontAwesomeIcon
                                    icon={faArrowUpFromBracket}
                                  />{' '}
                                  Upload File
                                </span> */}
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
    </>
  );
};

export default FileRepository;
