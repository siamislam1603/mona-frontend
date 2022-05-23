import React, { Component } from "react";
import { Button, Container, Dropdown, DropdownButton, Form } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from 'react-bootstrap-table2-paginator';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import ToolkitProvider, {Search, CSVExport } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';

const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;
const animatedComponents = makeAnimated();
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
const products = [
  {
    id: 1,
    name: "../img/user.png, James Smith, Educator",
    email: "smithjms2211@gmail.com",
    number: "+33757005467",
    location: "Australia"
  },
  {
    id: 2,
    name: "../img/user.png, Shelby Goode, Parent",
    email: "shelbygoode41@gmail.com",
    number: "+33757005455",
    location: "Australia"
  },
  {
    id: 3,
    name: "../img/user.png, Robert Bacins, Co-ordinator",
    email: "robertbacins4182@.com",
    number: "+33757005467",
    location: "Australia"
  },
  {
    id: 4,
    name: "../img/user.png, John Carilo, Co-ordinator",
    email: "john carilo182@.com",
    number: "+33757005455",
    location: "Australia"
  },
  {
    id: 5,
    name: "../img/user.png, Mark Ruffalo, Parent",
    email: "markruffalo3735@.com",
    number: "+33757005467",
    location: "Australia"
  },
  {
    id: 6,
    name: "../img/user.png, Jhon Deo, Parent",
    email: "jhondeo24823@.com",
    number: "+33757005455",
    location: "Sydney"
  },
  {
    id: 7,
    name: "../img/user.png, Bethanyjackson, Educator",
    email: "bethanyjackson5@.com",
    number: "+33757005467",
    location: "Australia"
  },
  {
    id: 8,
    name: "../img/user.png, Jack Ruffalo, Parent",
    email: "markrufalo3735@.com",
    number: "+33757005455",
    location: "Sydney"
  },
  {
    id: 9,
    name: "../img/user.png, James Smith, Doctor",
    email: "smithjms2211@gmail.com",
    number: "+33757005467",
    location: "Australia"
  },
  {
    id: 10,
    name: "../img/user.png, Shelby Goode, Doctor",
    email: "shelbygoode1@gmail.com",
    number: "+33757005455",
    location: "Sydney"
  },
  {
    id: 11,
    name: "../img/user.png, James Smith, Doctor",
    email: "smithjms221@gmail.com",
    number: "+33757005467",
    location: "Australia"
  },
  {
    id: 12,
    name: "../img/user.png, Shelby Goode, Doctor",
    email: "shelbygode41@gmail.com",
    number: "+33757005455",
    location: "Sydney"
  },
];
const selectRow = {
  mode: 'checkbox',
  clickToSelect: true
};

const columns = [
{
  dataField: 'name',
  text: 'Name',
  sort: true,
  formatter: (cell) => {
    cell=cell.split(",");
    return (<><div className="user-list"><span className="user-pic"><img src={cell[0]} alt=''/></span><span className="user-name">{cell[1]} <small>{cell[2]}</small></span></div></>)
  },
},
{
    dataField: 'email',
    text: 'Email',
    sort: true
  },
  {
    dataField: 'number',
    text: 'Phone Number',
    sort: true
  },
  {
    dataField: 'location',
    text: 'Location',
    sort: true
  },
  {
    dataField: "action",
    text: "",
    formatter: (cell) => {
      return (<><div className="cta-col">
        <Dropdown>
          <Dropdown.Toggle variant="transparent" id="ctacol">
            <img src="../img/dot-ico.svg" alt=""/>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#">Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div></>)
    },
  }
];

const UserManagement = () => {
    return (
      <>
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar/>
              </aside>
              <div className="sec-column">
                <TopHeader/>
                <div className="entry-container">
                  <div className="user-management-sec">
                    <ToolkitProvider
                      keyField="name"
                      data={products}
                      columns={ columns }
                      search
                    >
                      {
                        props => (
                          <>
                            <header className="title-head">
                              <h1 className="title-lg">All User</h1>
                              <div className="othpanel">
                                <div className="extra-btn">
                                  <div className="data-search me-3">
                                    <SearchBar { ...props.searchProps } />
                                  </div>
                                  <Dropdown className="filtercol me-3">
                                    <Dropdown.Toggle id="extrabtn" variant="btn-outline">
                                      <i className="filter-ico"></i> Add Filters
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <header>Filter by:</header>
                                      <div className="custom-radio btn-radio mb-2">
                                        <label>Users:</label>
                                        <Form.Group>
                                          <Form.Check
                                            inline
                                            label='Admin'
                                            value='Admin'
                                            name="users"
                                            type="radio"
                                            id='one'
                                          />
                                          <Form.Check
                                            inline
                                            label='Co-ordinator'
                                            value='Co-ordinator'
                                            name="users"
                                            type="radio"
                                            id='two'
                                          />
                                          <Form.Check
                                            inline
                                            label='Educator'
                                            value='Educator'
                                            name="users"
                                            type="radio"
                                            id='three'
                                          />
                                          <Form.Check
                                            inline
                                            label='Parent/Guardian'
                                            value='Parent-Guardian'
                                            name="users"
                                            type="radio"
                                            id='four'
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
                                        <Button variant="transparent" type="submit">Cancel</Button>
                                        <Button variant="primary" type="submit">Apply</Button>
                                      </footer>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                  <a href="/new-user" className="btn btn-primary me-3">+ Create New User</a>
                                  <Dropdown>
                                    <Dropdown.Toggle id="extrabtn" className="ctaact">
                                      <img src="../img/dot-ico.svg" alt=""/>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item><ExportCSVButton { ...props.csvProps }>Export CSV!!</ExportCSVButton></Dropdown.Item>
                                      <Dropdown.Item href="#">Delete All Row</Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>
                            </header>
                            <BootstrapTable
                              { ...props.baseProps }
                              selectRow={ selectRow }
                              pagination={ paginationFactory() }
                            />
                          </>
                        )
                      }
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
}

export default UserManagement;