import React, { useState } from 'react'
import { Button, Container, Dropdown, Form, Modal, Row, Col } from 'react-bootstrap';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
const animatedComponents = makeAnimated();
const { SearchBar } = Search;


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

const FileRpositoryList = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [userData, setUserData] = useState([]);

    const [columns, setColumns] = useState([
        {
            dataField: 'name',
            text: 'Name',
            sort: true,
            // formatter: (cell) => {
            //     cell = cell.split(',');
            //     return (
            //         <>
            //             <Link to="/file-repository-List" className="FileResp">
            //                 <div className="user-list">
            //                     <span>
            //                         <img src="../img/gfolder-ico.png" className="me-2" alt="" />
            //                     </span>
            //                     <span className="user-name">
            //                         {cell[0]}
            //                         <small>{cell[1]}</small>
            //                     </span>
            //                 </div>
            //             </Link>
            //         </>
            //     );
            // },
        },
        {
            dataField: 'createdAt',
            text: 'Created on',
            sort: true,
        },
        {
            dataField: 'creatorName',
            text: 'Created by',
            sort: true,
            // formatter: (cell) => {
            //     cell = cell.split(',');
            //     return (
            //         <>
            //             <div className="user-list">
            //                 <span className="user-name">
            //                     {cell[0]}
            //                     <small>{cell[1]}</small>
            //                 </span>
            //             </div>
            //         </>
            //     );
            // }
        },
        {
            dataField: 'repository_files',
            text: '',
            // formatter: (cell) => {
            //     return (
            //         <>
            //             <div className="cta-col">
            //                 <Dropdown>
            //                     <Dropdown.Toggle variant="transparent" id="ctacol">
            //                         <img src="../img/dot-ico.svg" alt="" />
            //                     </Dropdown.Toggle>
            //                     <Dropdown.Menu>
            //                         <Dropdown.Item href="#">Delete</Dropdown.Item>
            //                     </Dropdown.Menu>
            //                 </Dropdown>
            //             </div>
            //         </>
            //     );
            // },
        },
    ]);
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
                                            // data={userData}
                                            columns={columns}
                                            search
                                        >
                                            {(props) => (
                                                <>
                                                    <h1 className="title-lg"><Link to="/file-repository"><img src="../../img/back-arrow.svg" /></Link>File Repository</h1>
                                                    <header className="title-head">
                                                        <div className="user-list">
                                                            <span>
                                                                <img src="../img/gfolder-ico.png" className="me-2" alt="" />
                                                            </span>
                                                            <span className="user-name">
                                                                Daily Use
                                                                <small>140 files</small>
                                                            </span>
                                                        </div>
                                                        <div className="othpanel">
                                                            <div className="extra-btn">
                                                                <div className="data-search me-3">
                                                                    <SearchBar />
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
                                                                            {/* <ExportCSVButton {...props.csvProps}>
                                                                    Export CSV!!
                                                                </ExportCSVButton> */}
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item href="#">
                                                                            Delete All Row
                                                                        </Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </div>
                                                        </div>
                                                    </header>
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
        </>
    )
}

export default FileRpositoryList