import React, { useState, useEffect } from 'react'
import { Button, Container, Dropdown, Form, Modal, Row, Col } from 'react-bootstrap';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../components/App';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from "axios";
import VideoPop from "../components/VideoPop";
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
    const [user, setUser] = useState([]);
    const GetFile = async () => {
        // let response = await axios.get(`${BASE_URL}fileRepo/files-by-category/6`, {
        //     headers: {
        //         authorization: `Bearer ${localStorage.getItem('token')}`,
        //     },
        // })
        // console.log(response, "response")
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
        let response = await fetch(`${BASE_URL}/fileRepo/files-by-category/6`, requestOptions)
        response = await response.json();
        setUser(response.result)
        const users = response.result.files;
        // console.log(users, "++++++++++++++++++++++++++++")
        let tempData = users.map((dt) => ({
            name: `${dt.fileType}`,
            createdAt: dt.createdAt,
            userID: dt.id,
            creatorName: dt.creatorName + "," + dt.creatorRole,
            Shaired: dt.repository.repository_shares.length
        }));
        setUserData(tempData);
    }

    console.log(userData, "user")

    useEffect(() => {
        GetFile();
    }, [])

    const [columns, setColumns] = useState([
        {
            dataField: 'name',
            text: 'Name',
            sort: true,
            formatter: (cell) => {
                console.log()
                return (
                    <>
                        <div className="user-list">
                            {cell === "image/jpeg" ?
                                <span>
                                    <img src="../img/abstract-ico.png" className="me-2" alt="" />
                                </span>
                                : cell === "audio/mpeg" ?
                                    < span >
                                        <img src="../img/audio-ico.png" className="me-2" alt="" />
                                    </span> :
                                    cell === "video/mp4" ?
                                        < span >
                                            <VideoPop
                                                data={cell}
                                                title={``}
                                                // duration={trainingDetails.completion_time}
                                                fun={handleClose} />
                                        </span> : "oisdu"
                            }
                            <span className="user-name">
                                {cell}
                            </span>
                        </div>

                    </>
                );
            },
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
            formatter: (cell) => {
                cell = cell.split(',');
                return (
                    <>
                        <div className="user-list">
                            <span className="user-name">
                                {cell[0]}
                                <small>{cell[1]}</small>
                            </span>
                        </div>
                    </>
                );
            }
        },
        {
            dataField: 'Shaired',
            text: 'Shared',
            sort: true,
            formatter: (cell) => {
                return (
                    <>
                        <div className="user-list">
                            {cell > 0 ?
                                <span className="user-name">
                                    <img src="../img/sharing-ico.png" className="me-2" alt="" />
                                    Shared
                                </span> :
                                <span className="user-name">
                                    <img src="../img/close_icons.png" className="me-2" alt="" />
                                    No Shared
                                </span>
                            }
                        </div>
                    </>
                );
            }
        },
        {
            dataField: 'repository_files',
            text: '',
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
                                            data={userData}
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
                                                                <small>{user.count} files</small>
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
        </>
    )
}

export default FileRpositoryList