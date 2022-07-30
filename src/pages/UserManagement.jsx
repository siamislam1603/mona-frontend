import React, { Component, useEffect, useState } from 'react';
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
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState('All');
  const [csvDownloadFlag, setCsvDownloadFlag] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [topSuccessMessage, setTopSuccessMessage] = useState();
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState('');
  const [deleteResponse, setDeleteResponse] = useState(null);
  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      if (e.target.text === 'Delete') {

        async function deleteUserFromDB() {
          const response = await axios.patch(
            `${BASE_URL}/auth/user/delete/${row.userID}`,
            {
              is_deleted: 1,
            }, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
          }
          );
          if (response.status === 200 && response.data.status === "success")
            setDeleteResponse(response);
        }

        if (window.confirm('Are you sure you want to delete?')) {

          deleteUserFromDB();

        }

        fetchUserDetails();
      }
      if (e.target.text === "Edit") {
        navigate(`/edit-user/${row.userID}`);
      }
    },
  };
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
        cell = cell.split(',');
        return (
          <>
            <div className="user-list">
              <span className="user-pic">
                <img src={cell[0]} alt="" />
              </span>
              <span className="user-name">
                {cell[1]} <small>{cell[2]}</small>
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
      text: 'Phone Number',
      sort: true,
    },
    {
      dataField: 'location',
      text: 'Location',
      sort: true,
    },
    {
      dataField: 'roleDetail',
      text: '',
      formatter: (cell) => {
        cell = cell.split(',');
        return (
          <>
            {
              cell[0] == "guardian" ? (
                cell[1] == 1 ? (
                  <button className='btn btn-outline-secondary' onClick={() => navigate(`/children/${cell[3]}`, { state: { franchisee_id: cell[2] } })}>
                    View Children
                  </button>
                ) : <button className='btn btn-outline-danger' onClick={() => navigate('/child-enrollment')}>
                  New Children
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
        return (
          <>
            <div className="cta-col">
              <Dropdown>
                <Dropdown.Toggle variant="transparent" id="ctacol">
                  <img src="../img/dot-ico.svg" alt="" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#">Delete</Dropdown.Item>
                  <Dropdown.Item href="#">Edit</Dropdown.Item>
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

  const fetchUserDetails = async () => {
    let api_url = '';

    if (search) {
      api_url = `${BASE_URL}/role/user-data/${selectedFranchisee}?search=${search}`;
    }
    if (filter) {
      api_url = `${BASE_URL}/role/user-data/${selectedFranchisee}?filter=${filter}`;
    }
    if (search && filter) {
      api_url = `${BASE_URL}/role/user-data/${selectedFranchisee}?search=${search}&filter=${filter}`;
    }
    if (!search && !filter) {
      api_url = `${BASE_URL}/role/user-data/${selectedFranchisee}`;
    }


    let response = await axios.get(api_url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });


    if (response.status === 200) {
      const { users } = response.data;
      console.log('USERS:', users);
      let tempData = users.map((dt) => ({
        name: `${dt.profile_photo}, ${dt.fullname}, ${dt.role
          .split('_')
          .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
          .join(' ')}`,
        email: dt.email,
        number: dt.phone.slice(1),
        location: dt.city,
        is_deleted: dt.is_deleted,
        userID: dt.id,
        roleDetail: dt.role + "," + dt.isChildEnrolled + "," + dt.franchisee_id + "," + dt.id
      }));

      tempData = tempData.filter((data) => data.is_deleted === 0);
      console.log("eeeeeeeeeeeeeeeeeeeeeeeeeee", tempData)
      setUserData(tempData);

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

  const handleApplyFilter = async () => {
    // const res = await axios.post(`${BASE_URL}/`)
    fetchUserDetails();
  };

  // useEffect(() =>{
  //   fetchAllUsers()
  // },[])
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

  const csvLink = useRef();
  userData && console.log('USER DATA:', userData.map(data => data));
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
                <div className="entry-container">
                  <div className="user-management-sec">
                    <ToolkitProvider
                      keyField="name"
                      data={userData}
                      columns={columns}
                    >
                      {(props) => (
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
                                <a
                                  href="/new-user"
                                  className="btn btn-primary me-3"
                                >
                                  + Create New User
                                </a>
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
                                          {setCsvDownloadFlag(false)}
                                        </CSVDownload>
                                      )}
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => { onDeleteAll() }}>
                                      Delete All Row
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </header>
                          <BootstrapTable
                            {...props.baseProps}
                            rowEvents={rowEvents}
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
    </>
  );
};

export default UserManagement;
