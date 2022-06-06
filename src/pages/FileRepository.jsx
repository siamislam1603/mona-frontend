import React, { Component, useEffect, useState } from "react";
import { Button, Container, Dropdown, DropdownButton, Form, Modal, Row, Col } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from 'react-bootstrap-table2-paginator';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import ToolkitProvider, {Search, CSVExport } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import Multiselect from "multiselect-react-dropdown";
import DragDropRepository from "../components/DragDropRepository";

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
    name: "../img/gfolder-ico.png, Folder 1, 140 Files",
    createdon: "10/07/2021",
    createdby: "James Smith, Educator",
    sharing: "../img/sharing-ico.png, Shared"
  },
  {
    id: 2,
    name: "../img/gfolder-ico.png, Folder 2, 36 Files",
    createdon: "10/07/2021",
    createdby: "Shelby Goode, Franchisor Admin",
    sharing: "../img/sharing-ico.png, Shared"
  },
  {
    id: 3,
    name: "../img/abstract-ico.png, Abstract.doc, 3 versions",
    createdon: "10/07/2021",
    createdby: "Robert Bacins, Co-ordinator",
    sharing: "../img/sharing-ico.png, Shared"
  },
  {
    id: 4,
    name: "../img/audio-ico.png, Audiofile.mp3",
    createdon: "10/07/2021",
    createdby: "John Carilo, Co-ordinator",
    sharing: "../img/sharing-ico.png, Shared"
  },
  {
    id: 5,
    name: "../img/abstract-ico.png, Abstract.doc",
    createdon: "10/07/2021",
    createdby: "Mark Ruffalo, Educator",
    sharing: "../img/sharing-ico.png, Shared"
  },
  {
    id: 6,
    name: "../img/abstract-ico.png, Abstract1.doc",
    createdon: "10/07/2021",
    createdby: "Jhon Deo, Co-ordinator",
    sharing: "../img/sharing-ico.png, Shared"
  },
  {
    id: 7,
    name: "../img/abstract-ico.png, Abstract2.doc",
    createdon: "10/07/2021",
    createdby: "Bethany Jackson, Educator",
    sharing: "../img/sharing-ico.png, Shared"
  },
  {
    id: 8,
    name: "../img/abstract-ico.png, Abstract3.doc",
    createdon: "10/07/2021",
    createdby: "James Smith, Educator",
    sharing: "../img/sharing-ico.png, Shared"
  },
  {
    id: 9,
    name: "../img/abstract-ico.png, Abstract4.doc",
    createdon: "10/07/2021",
    createdby: "James Smith, Educator",
    sharing: "../img/sharing-ico.png, Shared"
  },
  {
    id: 10,
    name: "../img/abstract-ico.png, Abstract5.doc",
    createdon: "10/07/2021",
    createdby: "James Smith, Educator",
    sharing: "../img/sharing-ico.png, Shared"
  },
  {
    id: 11,
    name: "../img/abstract-ico.png, Abstract6.doc",
    createdon: "10/07/2021",
    createdby: "James Smith, Educator",
    sharing: "../img/sharing-ico.png, Shared"
  },
  {
    id: 12,
    name: "../img/abstract-ico.png, Abstract7.doc",
    createdon: "10/07/2021",
    createdby: "James Smith, Educator",
    sharing: "../img/sharing-ico.png, Shared"
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
    dataField: 'createdon',
    text: 'Created on',
    sort: true
  },
  {
    dataField: 'createdby',
    text: 'Created by',
    sort: true,
    formatter: (cell) => {
    cell=cell.split(",");
    return (<><div className="user-list"><span className="user-name">{cell[0]} <small>{cell[1]}</small></span></div></>)
  },
},
  {
    dataField: 'sharing',
    text: 'Sharing',
    sort: true,
    formatter: (cell) => {
    cell=cell.split(",");
    return (<><img src={cell[0]} alt=''/> {cell[1]}</>)
  },
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

const FileRepository = () => {
  
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);

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
                      <h1 className="title-lg">File Repository</h1>
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
                          <span className="btn btn-primary me-3" onClick={handleShow}><FontAwesomeIcon icon={faArrowUpFromBracket} /> Upload File</span>
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
                    <div className="training-cat mb-3">
                      <ul>
                        <li><a href="/" className="active">Files  shared with me </a></li>
                        <li><a href="/">My added files</a></li>
                      </ul>
                    </div>
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
      
      <Modal className="training-modal" size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settings-content">
            <Row>
              <Col md={12}>
                <Form.Group>
                  <DragDropRepository />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label>Accessible to all franchisee</Form.Label>
                  <div className="new-form-radio">
                    <div className="new-form-radio-box">
                      <label for="yes2">
                        <input
                          type="radio"
                          value="Yes"
                          name="form_template_select1"
                          id="yes2"
                        />
                        <span className="radio-round"></span>
                        <p>Yes</p>
                      </label>
                    </div>
                    <div className="new-form-radio-box">
                      <label for="no2">
                        <input
                          type="radio"
                          value="No"
                          name="form_template_select1"
                          id="no2"
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              <Col lg={9} md={6}  className="mt-3 mt-md-0">
                <Form.Group>
                  <Form.Label>Select Franchisee</Form.Label>
                  <Multiselect
                    placeholder="Select Franchisee"
                    displayValue="key"
                    className="multiselect-box default-arrow-select"
                    onKeyPressFn={function noRefCheck() {}}
                    onRemove={function noRefCheck() {}}
                    onSearch={function noRefCheck() {}}
                    onSelect={function noRefCheck() {}}
                    options={[
                      {
                        cat: "Group 1",
                        key: "Option 1",
                      },
                      {
                        cat: "Group 1",
                        key: "Option 2",
                      },
                      {
                        cat: "Group 1",
                        key: "Option 3",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 4",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 5",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 6",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 7",
                      },
                    ]}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label>Applicable to all user roles</Form.Label>
                  <div className="new-form-radio">
                    <div className="new-form-radio-box">
                      <label for="yes1">
                        <input
                          type="radio"
                          value="Yes"
                          name="form_template_select1"
                          id="yes1"
                        />
                        <span className="radio-round"></span>
                        <p>Yes</p>
                      </label>
                    </div>
                    <div className="new-form-radio-box">
                      <label for="no1">
                        <input
                          type="radio"
                          value="No"
                          name="form_template_select1"
                          id="no1"
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              <Col lg={9} md={6}  className="mt-3 mt-md-0">
                <Form.Group>
                  <Form.Label>Select User Roles</Form.Label>
                  <Multiselect
                    placeholder="Select User Roles"
                    displayValue="key"
                    className="multiselect-box default-arrow-select"
                    onKeyPressFn={function noRefCheck() {}}
                    onRemove={function noRefCheck() {}}
                    onSearch={function noRefCheck() {}}
                    onSelect={function noRefCheck() {}}
                    options={[
                      {
                        cat: "Group 1",
                        key: "Option 1",
                      },
                      {
                        cat: "Group 1",
                        key: "Option 2",
                      },
                      {
                        cat: "Group 1",
                        key: "Option 3",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 4",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 5",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 6",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 7",
                      },
                    ]}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="transparent" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary">
            Upload File
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    );
}

export default FileRepository;
