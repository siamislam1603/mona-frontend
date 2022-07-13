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
import makeAnimated from 'react-select/animated';
import ToolkitProvider, {
  Search,
  // CSVExport,
} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import axios from 'axios';
import { BASE_URL } from '../components/App';
import { CSVDownload } from 'react-csv';
import { useRef } from 'react';
import { debounce } from 'lodash';

const { SearchBar } = Search;
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

const selectRow = {
  mode: 'checkbox',
  clickToSelect: true,
};

const headers = [
  { label: 'First Name', key: 'firstName' },
  { label: 'Last Name', key: 'lastName' },
  { label: 'Email', key: 'email' },
  { label: 'Age', key: 'age' },
];

const UserManagement = () => {
  const [userData, setUserData] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState(localStorage.getItem('selectedFranchisee'));
  const [csvDownloadFlag, setCsvDownloadFlag] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [filter, setFilter] = useState({
    user: '',
    location: [],
  });
  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      if (e.target.text === 'Delete') {
        async function deleteUserFromDB() {
          const response = await axios.patch(
            `${BASE_URL}/auth/user/${row.id}`,
            {
              is_deleted: 1,
            }
          );
          console.log('DELETE RESPONSE:', response);
        }

        deleteUserFromDB();
        fetchUserDetails();
      }
    },
  };

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
                  <Dropdown.Item href="/edit-user">Edit</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </>
        );
      },
    },
  ];
  const onFilter = debounce((data) => {
    fetchUserDetails(data);
  }, 200);

  const fetchUserDetails = async (search,filter) => {
    let api_url = '';
    
    let franchiseeFormat = selectedFranchisee
      .split(',')[0]
      .split(' ')
      .map((dt) => dt.charAt(0).toLowerCase() + dt.slice(1))
      .join('_')
      .toLowerCase();
    if (search) {
      api_url = `${BASE_URL}/role/user/${franchiseeFormat}?search=${search}`;
    }
    if(filter)
    {
      filter=filter.user;
      api_url = `${BASE_URL}/role/user/${franchiseeFormat}?filter=${filter}`;
    }
    if(!search && !filter) {
      api_url = `${BASE_URL}/role/user/${franchiseeFormat}`;
    }
    let response = await axios.get(api_url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.status === 200) {
      const { users } = response.data;
      let tempData = users.map((dt) => ({
        id: dt.id,
        name: `${BASE_URL}/${dt.profile_photo}, ${dt.fullname}, ${dt.role
          .split('_')
          .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
          .join(' ')}`,
        email: dt.email,
        number: dt.phone,
        location: dt.city,
        is_deleted: dt.is_deleted,
      }));
      tempData = tempData.filter((data) => data.is_deleted === 0);
      setUserData(tempData);
      let temp = tempData;
      let csv_data = [];
      temp.map((item) => {
        // item['Name'] = item['name'];
        // item['Email'] = item['email'];
        // item['Phone Number'] = item['number'];
        // item['Location'] = item['location'];
        // delete item['name'];
        // delete item['email'];
        // delete item['number'];
        // delete item['location'];
        delete item.is_deleted;
        delete item.id;
        csv_data.push(item);
      });
      setCsvData(csv_data);
    }
  };

  const handleCancelFilter = () => {
    setFilter({});
  };

  const handleApplyFilter = async (data) => {
    // const res = await axios.post(`${BASE_URL}/`)
    fetchUserDetails('',data);
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
    fetchUserDetails();
  }, []);

  const csvLink = useRef();
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
                                        onFilter(e.target.value);
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
                                          label="Admin"
                                          value="Admin"
                                          name="users"
                                          type="radio"
                                          id="one"
                                          onChange={(event) =>
                                            setFilter((prevState) => ({
                                              ...prevState,
                                              user: event.target.value,
                                            }))
                                          }
                                        />
                                        <Form.Check
                                          inline
                                          label="Co-ordinator"
                                          value="Coordinator"
                                          name="users"
                                          type="radio"
                                          id="two"
                                          onChange={(event) =>
                                            setFilter((prevState) => ({
                                              ...prevState,
                                              user: event.target.value,
                                            }))
                                          }
                                        />
                                        <Form.Check
                                          inline
                                          label="Educator"
                                          value="Educator"
                                          name="users"
                                          type="radio"
                                          id="three"
                                          onChange={(event) =>
                                            setFilter((prevState) => ({
                                              ...prevState,
                                              user: event.target.value,
                                            }))
                                          }
                                        />
                                        <Form.Check
                                          inline
                                          label="Parent/Guardian"
                                          value="Guardian"
                                          name="users"
                                          type="radio"
                                          id="four"
                                          onChange={(event) =>
                                            setFilter((prevState) => ({
                                              ...prevState,
                                              user: event.target.value,
                                            }))
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
                                        onClick={handleCancelFilter}
                                      >
                                        Reset
                                      </Button>
                                      <Button
                                        variant="primary"
                                        type="submit"
                                        onClick={()=>{handleApplyFilter(filter)}}
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
                                    <Dropdown.Item href="#">
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
