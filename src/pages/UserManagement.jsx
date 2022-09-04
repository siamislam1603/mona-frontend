import React, { useEffect, useState, } from 'react';
import {
  Button,
  Container,
  Dropdown,
  DropdownButton,
  Form,
} from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Select from 'react-select';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import { BASE_URL } from '../components/App';
import { CSVDownload } from 'react-csv';
import { useRef } from 'react';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { verifyPermission } from '../helpers/roleBasedAccess';
import { FullLoader } from "../components/Loader";
import { useParams } from 'react-router-dom';
// const { ExportCSVButton } = CSVExport;

const animatedComponents = makeAnimated();
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

let DeleteId = [];

const UserManagement = () => {
  const Key = useParams()

  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [userEducator, setEducator] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [csvDownloadFlag, setCsvDownloadFlag] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [topSuccessMessage, setTopSuccessMessage] = useState();
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true)
  const [deleteResponse, setDeleteResponse] = useState(null);
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);
  const [parentFranchiseeId, setParentFranchiseeId] = useState(null);

 
  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      // if (e.target.text === 'Delete') {

      //   async function deleteUserFromDB() {
      //     const response = await axios.patch(
      //       `${BASE_URL}/auth/user/status/${row.userID}`,
      //       {
      //         is_active: 2,
      //       }, {
      //       headers: {
      //         "Authorization": `Bearer ${localStorage.getItem('token')}`
      //       }
      //     });

      //     if(response.status === 201 && response.data.status === "success") {
      //       fetchUserDetails();
      //     }
      //   }

      //   if (window.confirm('Are you sure you want to delete this user?')) {
      //     deleteUserFromDB();
      //   }

      //   // fetchUserDetails();
      // }

      if (e.target.text === "Deactivate") {

        async function deactivateUserFromDB() {
          const response = await axios.patch(
            `${BASE_URL}/auth/user/status/${row.userID}`,
            {
              is_active: 0,
            }, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (response.status === 201 && response.data.status === "success") {
            fetchUserDetails();
          }
        }

        if (window.confirm('Are you sure you want to deactivate this user?')) {
          deactivateUserFromDB();
        }
      }

      if (e.target.text === "Activate") {
        console.log('ACTIVATING USER!')

        async function activateUserFromDB() {
          const response = await axios.patch(
            `${BASE_URL}/auth/user/status/${row.userID}`,
            {
              is_active: 1,
            }, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (response.status === 201 && response.data.status === "success") {
            fetchUserDetails();
          }
        }

        if (window.confirm('Are you sure you want to activate this user?')) {
          activateUserFromDB();
        }

        // fetchUserDetails();
      }

      if (e.target.text === "Edit") {
        navigate(`/edit-user/${row.userID}`);
      }

    }
  }

  const selectRow = {
    mode: 'checkbox',
    onSelect: (row, isSelect, rowIndex, e) => {
      if (DeleteId.includes(row.userID)) {
        let Index;
        DeleteId.map((item, index) => {
          if (item === row.userID) {
            Index = index;
          }
        })
        DeleteId.splice(Index, 1);
      }
      else {
        DeleteId.push(row.userID);
      }

    },
    onSelectAll: (isSelect, rows, e) => {
      if (isSelect) {
        userData.map((item) => {
          DeleteId.push(item.userID);
        });
      }
      else {
        DeleteId = [];
      }
    }
  };
  const onDeleteAll = async () => {

    if (window.confirm('Are you sure you want to delete All Records?')) {

      let response = await axios.post(`${BASE_URL}/auth/user/delete/all`, { id: DeleteId }, {

        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },

      });
      if (response.status === 200) {
        fetchUserDetails();
        DeleteId = [];
      }
    }
  }
  const columns = [
    {
      dataField: 'name',
      text: 'Name',
      sort: true,
      formatter: (cell) => {
        let status = null;
        cell = cell.split(',');
        if (parseInt(cell[3]) === 0) {
          status = "inactive"
        } else if (parseInt(cell[3]) === 1) {
          status = "active"
        } else if (parseInt(cell[3]) === 2) {
          status = "deleted"
        }
        console.log('BIG STATUS:', cell[0]);
        return (
          <>
            <div className="user-list">
              <span className="user-pic">
                <img src={cell[0]=='null'? '../img/upload.jpg':cell[0]} alt="" />
              </span>
              <span className="user-name">
                {cell[1]} <small>{cell[2]}</small> <small className={`${status}`}>{status}</small>
              </span>
            </div>
          </>
        );
      },
    },
    {
      dataField: 'email',
      text: 'Email',
      sort: true,
    },
    {
      dataField: 'number',
      text: 'Phone',
      sort: true,
    },
    {
      dataField: 'location',
      text: 'Location',
      sort: true,
    },
    {
      dataField: 'roleDetail',
      text: 'Action',
      formatter: (cell) => {
        cell = cell.split(',');
        return (
          <>
            {
              (localStorage.getItem('user_role') === 'franchisor_admin' || localStorage.getItem('user_role') === "franchisee_admin" || localStorage.getItem('user_role') === 'coordinator') &&
                (cell[0] === "guardian" && cell[1] == 0) ? (
                <button className='btn btn-outline-danger' onClick={() => navigate(`/child-enrollment-init/${cell[3]}`)}>
                  New Children
                </button>
              ) : (cell[0] === "guardian" && cell[1] != 0) ?
                (<button className='btn btn-outline-secondary' onClick={() => navigate(`/children/${cell[3]}`, { state: { franchisee_id: cell[2] } })}>
                  View Children
                </button>
                ) : ""
            }
          </>
        );
      },
    },
    {
      dataField: 'action',
      text: '',
      formatter: (cell) => {
        let button = null;

        if (cell === 1) {
          button = "Deactivate";
        } else if (cell === 0) {
          button = "Activate";
        }
        return (
          <>
            <div className="cta-col">
              <Dropdown>
                <Dropdown.Toggle variant="transparent" id="ctacol">
                  <img src="../img/dot-ico.svg" alt="" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {cell === 1 && <Dropdown.Item href="#">Edit</Dropdown.Item>}
                  <Dropdown.Item href="#">{button}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </>
        );
      },
    },
  ];
  const onFilter = debounce(() => {
    fetchUserDetails();
  }, 200);

  const getFormattedName = (name) => {
    let firstName = name?.split(" ")[0];
    let secondName = name?.split(" ")?.slice(1).join(" ");

    return `${firstName}\n${secondName}`
  }

  const fetchUserDetails = async () => {
    let api_url = '';
    let id = localStorage.getItem('user_role') === 'guardian' ? localStorage.getItem('franchisee_id') : selectedFranchisee;

    if (search) {
      api_url = `${BASE_URL}/role/user/${id}?search=${search}`;
    }
    if (filter) {
      api_url = `${BASE_URL}/role/user/${id}?filter=${filter}`;
    }
    if (search && filter) {
      api_url = `${BASE_URL}/role/user/${id}?search=${search}&filter=${filter}`;
    }

    if (!search && !filter) {
      api_url = `${BASE_URL}/role/user/${id}`;
    }

    let response = await axios.get(api_url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response) {
      setfullLoaderStatus(false)
    }
    if (response.status === 200) {

      const { users } = response.data;
      console.log('USERS:', users);
      let tempData = users.map((dt) => ({
        name: `${dt.profile_photo}, ${getFormattedName(dt.fullname)}, ${dt.role
          .split('_')
          .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
          .join(' ')}, ${dt.is_active}`,
        email: dt.email,
        number: (dt.phone !== null ? dt.phone.slice(1) : null),
        location: dt.city,
        role: dt.role,
        is_deleted: dt.is_deleted,
        role: dt.role,
        userID: dt.id,
        roleDetail: dt.role + "," + dt.isChildEnrolled + "," + dt.franchisee_id + "," + dt.id,
        action: dt.is_active
      }));
      console.log('TEMP =>>>>>>>>>>>>>>>>>', tempData);
      // tempData = tempData.filter((data) => data.is_deleted === 0);
      // console.log('Temp Data:', tempData);
      if (localStorage.getItem('user_role') === 'guardian') {
        tempData = tempData.filter(d => parseInt(d.userID) === parseInt(localStorage.getItem('user_id')));
      }

      if (localStorage.getItem('user_role') === 'coordinator' || localStorage.getItem('user_role') === 'educator') {
        tempData = tempData.filter(d => d.action === 1);
      }

      setUserDataAfterFilter(tempData);
      setIsLoading(false)

      let temp = tempData;
      let csv_data = [];
      temp.map((item, index) => {
        // item['Name'] = item['name'];
        // item['Email'] = item['email'];
        // item['Phone Number'] = item['number'];
        // item['Location'] = item['location'];
        // delete item['name'];
        // delete item['email'];
        // delete item['number'];
        // delete item['location'];

        delete item.is_deleted;
        // delete item.user_id;
        csv_data.push(item);
        let data = { ...csv_data[index] };
        data["name"] = data.name.split(",")[1];
        csv_data[index] = data;
      });
      setCsvData(csv_data);
    }
  };

  const setUserDataAfterFilter = data => {
    console.log('DATA:', data);
    let role = localStorage.getItem('user_role');
    let filteredData = null;

    if (role === 'franchisor_admin') {
      filteredData = data.filter(d => d.role !== 'franchisor_admin');
    }

    if (role === 'franchisee_admin') {
      filteredData = data.filter(d => d.role !== 'franchisor_admin')
      filteredData = filteredData.filter(d => d.role !== 'franchisee_admin')

    }

    if (role === 'coordinator') {
      filteredData = data.filter(d => d.role === 'educator' || d.role === 'guardian');
      console.log('COORDINATOR:', filteredData);
    }

    if (role === 'educator') {
      filteredData = data.filter(d => d.role === 'guardian');
    }

    setUserData(filteredData);
  };



  const handleApplyFilter = async () => {
    fetchUserDetails();
  }


  const Show_eduactor = async () => {
    let api_url = '';
    // let id = localStorage.getItem('user_role') === 'guardian' ? localStorage.getItem('franchisee_id') : selectedFranchisee;
    let filter = Key.key
    // console.log(alert(filter))
    if (filter) {
      api_url = `${BASE_URL}/role/user/All?filter=${filter}`;
    }

    let response = await axios.get(api_url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')} `,
      },
    });


    if (response.status === 200) {
      const { users } = response.data;
      console.log('USERS =>>>>>>>>>>>>>>>>>>:', users);
      let tempData = users.map((dt) => ({
        name: `${dt.profile_photo}, ${dt.fullname}, ${dt.role
          .split('_')
          .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
          .join(' ')
          }, ${dt.is_active} `,
        email: dt.email,
        number: (dt.phone !== null ? dt.phone.slice(1) : null),
        location: dt.city,
        is_deleted: dt.is_deleted,
        userID: dt.id,
        role: dt.role,
        roleDetail: dt.role + "," + dt.isChildEnrolled + "," + dt.franchisee_id + "," + dt.id,
        action: dt.is_active
      }));

      if (localStorage.getItem('user_role') === 'guardian') {
        tempData = tempData.filter(d => parseInt(d.userID) === parseInt(localStorage.getItem('user_id')));
      }

      if (localStorage.getItem('user_role') === 'coordinator' || localStorage.getItem('user_role') === 'educator') {
        tempData = tempData.filter(d => d.action === 1);
      }
      setEducator(tempData);
      setIsLoading(false)




      let temp = tempData;
      let csv_data = [];
      temp.map((item, index) => {
        delete item.is_deleted;
        csv_data.push(item);
        let data = { ...csv_data[index] };
        data["name"] = data.name.split(",")[1];
        csv_data[index] = data;
      });
      setCsvData(csv_data);
    }
  }


  // const render_user_filter = async (arg) => {
  //   let data;
  //   console.log("datadatadatadatadatadatadatadatadatadata",userData)

  //   var user_role = localStorage.getItem('user_role');
  //     if(user_role==='franchisor_admin')
  //       data = arg.filter(d=>d.role!=='franchisor_admin');
  //     if(user_role==='franchisee_admin')
  //       data = arg.filter(d=>d.role!=='franchisee_admin' && d.role!=='franchisor_admin')
  //     if(user_role==='coordinator')
  //       data = arg.filter(d=>d.role =='educator' && d.role=='guardian')
  //     if(user_role==='educator')
  //       data = arg.filter(d=>d.role=='guardian')


  //       setUserData(data)
  // }


  // useEffect(() => {
  //   render_user_filter()
  // }, [tempData])


  useEffect(() => {
    Show_eduactor()
  }, [])


  useEffect(() => {
    if (selectedFranchisee) {
      fetchUserDetails();
    }
  }, [selectedFranchisee]);

  useEffect(() => {
    if (deleteResponse !== null)
      fetchUserDetails();
  }, [deleteResponse]);

  useEffect(() => {
    if (filter === "")
      fetchUserDetails();
  }, [filter]);

  useEffect(() => {
    if (localStorage.getItem('success_msg')) {
      setTopSuccessMessage(localStorage.getItem('success_msg'));
      localStorage.removeItem('success_msg');

      setTimeout(() => {
        setTopSuccessMessage(null);
      }, 3000);
    }
  }, []);
  
  useEffect(() => {
    if(localStorage.getItem('guardian')) {
      window.location.href=`/parents-dashboard`;
    }
  }, []);

  useEffect(() => {
    if(localStorage.getItem('guardian')) {
      window.location.href=`/parents-dashboard`;
    }
  }, [])

  const csvLink = useRef();


  // userData && console.log('USER DATA:', userData.map(data => data));
  userEducator && console.log('userEducator DATA:', userEducator.map(data => data))
  selectedFranchisee && console.log('Selected Franchisee:', selectedFranchisee);
  // console.log("USER DATA,",userData,"CSV",csvData)
  console.log("CSV STATE",csvDownloadFlag)
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
                  setSelectedFranchisee={setSelectedFranchisee}
                />
                <FullLoader loading={fullLoaderStatus} />

                <div className="entry-container">
                  <div className="user-management-sec">

                    <>
                      {
                        topSuccessMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topSuccessMessage}</p>
                      }
                      <header className="title-head">
                        <h1 className="title-lg">All User</h1>
                        <div className="othpanel">
                          <div className="extra-btn">
                            <div className="data-search me-3">
                              <Form.Group
                                className="d-flex"
                                style={{ position: 'relative' }}
                              >
                                <div className="user-search">
                                  <img
                                    src="./img/search-icon-light.svg"
                                    alt=""
                                  />
                                </div>
                                <Form.Control
                                  className="searchBox"
                                  type="text"
                                  placeholder="Search"
                                  name="search"
                                  onChange={(e) => {
                                    setSearch(e.target.value);
                                    onFilter();
                                  }}
                                />
                              </Form.Group>
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
                                      label="Franchisor Admin"
                                      value="Franchisor_Admin"
                                      name="users"
                                      type="radio"
                                      id="one"
                                      checked={filter === "Franchisor_Admin"}
                                      onChange={(event) =>
                                        setFilter(event.target.value)
                                      }
                                    />
                                    <Form.Check
                                      inline
                                      label="Franchisee Admin"
                                      value="Franchisee_Admin"
                                      name="users"
                                      type="radio"
                                      id="five"
                                      checked={filter === "Franchisee_Admin"}
                                      onChange={(event) =>
                                        setFilter(event.target.value)
                                      }
                                    />
                                    <Form.Check
                                      inline
                                      label="Co-ordinator"
                                      value="Coordinator"
                                      name="users"
                                      type="radio"
                                      id="two"
                                      checked={filter === "Coordinator"}
                                      onChange={(event) =>
                                        setFilter(event.target.value)
                                      }
                                    />
                                    <Form.Check
                                      inline
                                      label="Educator"
                                      value="Educator"
                                      name="users"
                                      type="radio"
                                      id="three"
                                      s
                                      checked={filter === "Educator"}
                                      onChange={(event) =>
                                        setFilter(event.target.value)
                                      }
                                    />

                                    <Form.Check
                                      inline
                                      label="Parent/Guardian"
                                      value="Guardian"
                                      name="users"
                                      type="radio"
                                      id="four"
                                      checked={filter === "Guardian"}
                                      onChange={(event) =>
                                        setFilter(event.target.value)
                                      }
                                    />
                                  </Form.Group>
                                </div>
                                {/* <div className="custom-radio">
                                      <label className="mb-2">Location:</label>
                                      <Form.Group>
                                        <Select
                                          closeMenuOnSelect={false}
                                          components={animatedComponents}
                                          isMulti
                                          options={training}
                                          onChange={(event) =>
                                            setFilter((prevState) => ({
                                              ...prevState,
                                              location: [
                                                ...event.map(
                                                  (data) => data.label
                                                ),
                                              ],
                                            }))
                                          }
                                        />
                                      </Form.Group>
                                    </div> */}
                                <footer>
                                  <Button
                                    variant="transparent"
                                    type="submit"
                                    onClick={() => { setFilter(''); }}
                                  >
                                    Reset
                                  </Button>
                                  <Button
                                    variant="primary"
                                    type="submit"
                                    onClick={() => { handleApplyFilter(filter) }}
                                  >
                                    Apply
                                  </Button>
                                </footer>
                              </Dropdown.Menu>
                            </Dropdown>
                            {
                              verifyPermission("user_management", "add") &&
                              <a href="/new-user" className="btn btn-primary me-3">+ Create New User</a>
                            }
                            <Dropdown>
                              <Dropdown.Toggle
                                id="extrabtn"
                                className="ctaact"
                              >
                                <img src="../img/dot-ico.svg" alt="" />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() => {
                                    setCsvDownloadFlag(true);
                                  }}
                                >
                                  Export CSV!!
                                  {csvDownloadFlag && (
                                    <CSVDownload
                                      data={csvData}
                                      filename="user_management.csv"
                                      ref={csvLink}
                                    >
                                      {/* {setCsvDownloadFlag(false)} */}
                                  {    setTimeout(() => {
                                      setCsvDownloadFlag(false)
                                        
                                      }, 1000)}
                                    </CSVDownload>
                                  )}
                                </Dropdown.Item>
                                {/* <Dropdown.Item onClick={() => { onDeleteAll() }}>
                                  Delete All Row
                                </Dropdown.Item> */}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                      </header>
                      {/* userEducator */}
                      {!Key.key ? (
                        <>
                          <ToolkitProvider
                            keyField="name"
                            data={userData}
                            columns={columns}
                          >
                            {(props) => (
                              <>
                                <BootstrapTable
                                  {...props.baseProps}
                                  rowEvents={rowEvents}
                                  selectRow={selectRow}
                                  pagination={paginationFactory()}
                                />
                              </>
                            )}
                          </ToolkitProvider>

                        </>) :
                        (<>
                          <ToolkitProvider
                            keyField="name"
                            data={userEducator}
                            columns={columns}
                          >
                            {(props) => (
                              <>
                                <BootstrapTable
                                  {...props.baseProps}
                                  rowEvents={rowEvents}
                                  selectRow={selectRow}
                                  pagination={paginationFactory()}
                                />
                              </>
                            )}
                          </ToolkitProvider>
                        </>)}

                    </>

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

export default UserManagement;
