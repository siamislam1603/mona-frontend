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
  CSVExport,
} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import axios from 'axios';
import { BASE_URL } from '../components/App';

const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;
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





const UserManagement = () => {
  const [userData, setUserData] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [filter, setFilter] = useState({
    user: '',
    location: [],
  });
  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      if (e.target.text === 'Delete') {
        async function deleteUserFromDB() {
          const response = await axios.patch(`${BASE_URL}/auth/user/${row.id}`, {
            is_deleted: 1,
          });
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
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </>
        );
      },
    },
  ];

  const fetchUserDetails = async () => {
    let franchiseeFormat = selectedFranchisee.split(",")[0].split(" ").map(dt => dt.charAt(0).toLowerCase() + dt.slice(1)).join("_").toLowerCase();
    let response = await axios.get(`${BASE_URL}/role/user/${franchiseeFormat}`, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('token')}`,
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
    }
  };

  const handleCancelFilter = () => {
    setFilter({});
  };

  const handleApplyFilter = async () => {
    // const res = await axios.post(`${BASE_URL}/`)
  };

  useEffect(() => {
    if(selectedFranchisee) {
      fetchUserDetails();
    }
  }, [selectedFranchisee]);
useEffect(()=>{
  fetchUserDetails();
},[])

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
                      search
                    >
                      {(props) => (
                        <>
                          <header className="title-head">
                            <h1 className="title-lg">All User</h1>
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
                                    <div className="custom-radio">
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
                                    </div>
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
                                        onClick={handleApplyFilter}
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
