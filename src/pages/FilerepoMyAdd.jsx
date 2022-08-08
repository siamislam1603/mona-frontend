import React, { useState, useEffect } from 'react'
import { Button, Container, Dropdown, Form, Modal, Row, Col } from 'react-bootstrap';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import Select from 'react-select';
import Multiselect from 'multiselect-react-dropdown';
import makeAnimated from 'react-select/animated';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import { BASE_URL } from '../components/App';
import BootstrapTable from 'react-bootstrap-table-next';
import DragDropRepository from '../components/DragDropRepository';
import axios from "axios";

import VideoPop from "../components/VideoPop";
import paginationFactory from 'react-bootstrap-table2-paginator';
import VideoPopupfForFile from '../components/VideoPopupfForFile';

const animatedComponents = makeAnimated();
const { SearchBar } = Search;
let selectedUserId = '';
let selectedUserRole = [];
let selectedFranchiseeId = '';
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

const FilerepoMyAdd = ({ filter, selectedFranchisee }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showVideo, setVideo] = useState(false);
    const handleVideoClose = () => setVideo(false);
    const handleVideoShow = () => setVideo(true);
    const [category, setCategory] = useState([]);
    const [formSettingData, setFormSettingData] = useState({ shared_role: '' });
    const [userData, setUserData] = useState([]);
    const [userTO, setUserTow] = useState([]);
    const [trainingDeleteMessage, setTrainingDeleteMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [selectedUser, setSelectedUser] = useState([]);
    const [loaderFlag, setLoaderFlag] = useState(false);
    console.log("userData", userData.length)
    const [saveTrainingId, setSaveTrainingId] = useState(null);
    const [user, setUser] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [sendToAllFranchisee, setSendToAllFranchisee] = useState("none");
    const [franchiseeList, setFranchiseeList] = useState();
    const [shareType, setShareType] = useState("roles");
    const [applicableToAll, setApplicableToAll] = useState(false);
    const [formSettings, setFormSettings] = useState({
        user_roles: [],
        assigned_franchisee: [],
        assigned_users: []
    });
    let Params = useParams();

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
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
    const handleTrainingSharing = async () => {
        let token = localStorage.getItem('token');
        let user_id = localStorage.getItem('user_id')
        const response = await axios.post(`${BASE_URL}/share/${saveTrainingId}`, {
            ...formSettings,
            shared_by: user_id,
            is_applicable_to_all: applicableToAll
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 201 && response.data.status === "success") {
            // const { dataObj } = response.data;

        }
    }

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
    const onSubmit = async (e) => {
        e.preventDefault();
        selectedUser?.map((item) => {
            selectedFranchiseeId += item.id + ',';
        });
        setLoaderFlag(true);

        var myHeaders = new Headers();

        myHeaders.append(
            'Authorization',
            'Bearer ' + localStorage.getItem('token')
        );
        console.log(localStorage, "localStorage");

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
        if (
            formSettingData.accessible_to_role === null ||
            formSettingData.accessible_to_role === undefined
        ) {
            formdata.append(
                'accessibleToRole',
                null
            );
            formdata.append(
                'accessibleToAll',
                true
            );
        } else {
            if (formSettingData.accessible_to_role === 1) {
                formdata.append(
                    'sharedRole',
                    formSettingData.shared_role.slice(0, -1)
                );
                formdata.append(
                    'sharedWith',
                    null
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
                    'sharedRole',
                    null
                );
                formdata.append(
                    'sharedWith',
                    selectedUserId.slice(0, -1)
                );
                formdata.append(
                    'accessibleToRole',
                    formSettingData.accessible_to_role
                );
                formdata.append(
                    'accessibleToAll',
                    false
                );
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
                    this.props.history.push(`/file-repository`);
                }
            })
            .then((result) => {
                if (result) {
                    setLoaderFlag(false);
                    setShow(false);
                }
            })
            .catch((error) => console.log('error', error));
    };

    const GetFile = async () => {
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
        let response = await fetch(`${BASE_URL}/fileRepo/filesDetails-createdBy-category/${Params.id}?franchiseAlias=all`, requestOptions)
        response = await response.json();
        setUserTow(response.result)
        console.log(userTO, " userTO")


        const users = response.files;
        let tempData = users.map((dt) => ({
            name: `${dt.fileType},${dt.fileName},${dt.filesPath}`,
            createdAt: dt.createdAt,
            userID: dt.id,
            creatorName: dt.creatorName + "," + dt.creatorRole,
            Shaired: dt.repository.repository_shares.length,
            categoryId: dt.categoryId
        }));
        // tempData = tempData.filter((data) => data.is_deleted === 0);
        // console.log(users.repository.repository, "success")
        console.log(tempData, "++++++++++++++++++++++++++++tempData++++++++++++++++++++++++++++")
        setUserData(tempData);
    }


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
    const getUser = () => {
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
        fetch(`${BASE_URL}/auth/users`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                result?.data?.map((item) => {
                    item['status'] = false;
                });
                setUser(result?.data);
            })
            .catch((error) => console.log('error', error));
    };

    useEffect(() => {
        GetFile();
        getFileCategory();
        getUser();
        fetchFranchiseeList();
    }, [trainingDeleteMessage,])

    const handleTrainingDelete = async (cell) => {
        console.log('DELETING THE TRAINING!');
        let token = localStorage.getItem('token');
        // let userId = localStorage.getItem('user_id');
        const response = await axios.delete(`${BASE_URL}/fileRepo/${cell}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        // HANDLING THE RESPONSE GENEREATED AFTER DELETING THE TRAINING
        if (response.status === 200 && response.data.status === "success") {
            setTrainingDeleteMessage(response.data.message);

        } else if (response.status === 200 && response.data.status === "fail") {
            setTrainingDeleteMessage(response.data.message);
        }
    }

    const [columns, setColumns] = useState([
        {
            dataField: 'name',
            text: 'Name',
            sort: true,
            resizable: true,
            formatter: (cell) => {
                cell = cell.split(',');
                return (
                    <>
                        <div className="user-list">
                            {cell[0] === "image/jpeg" ?
                                <div style={{ width: "100%", display: "flex" }}>
                                    < div style={{ width: "%" }}>
                                        <a href={cell[2]} download>
                                            <img src="../img/abstract-ico.png" className="me-2" alt="" />
                                        </a>
                                    </div>
                                    <div width="70%">
                                        {cell[1]}.img
                                    </div>
                                </div>
                                :
                                cell[0] === "audio/mpeg" ?
                                    <div style={{ width: "100%", display: "flex" }}>
                                        < div style={{ width: "25%" }}>
                                            <a href={cell[2]} download>
                                                <img src="../img/audio-ico.png" className="me-2" alt="" />
                                            </a>
                                        </div>
                                        <div style={{ width: "75%" }}>
                                            {cell[1]}.mp3
                                        </div>
                                    </div>
                                    : cell[0] === "video/mp4" ?
                                        <>
                                            <div style={{ width: "100%", display: "flex" }}>
                                                <VideoPopupfForFile
                                                    data={cell[2]}
                                                    title={cell[0]}
                                                    // duration={cell[0]}
                                                    fun={handleVideoClose}
                                                />
                                            </div>
                                        </> :
                                        cell[0] === "application/octet-stream" || cell[0] === "application/pdf" ?
                                            <div style={{ wwidth: "100%", display: "flex" }}>
                                                < div style={{ width: "25%" }}>
                                                    <a href={cell[2]} download >
                                                        <img src="../img/abstract-ico.png" className="me-2" alt="" />
                                                    </a>
                                                </div>
                                                <div style={{ width: "75%" }}>
                                                    {cell[1]}.Doc
                                                </div>
                                            </div> : cell[0]
                            }
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
                                    <img src="../img/NoShore.png" className="me-2" alt="" />
                                    No Shared
                                </span>
                            }
                        </div>
                    </>
                );
            }
        },
        {
            dataField: 'userID',
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
                                    <Dropdown.Item onClick={() => {
                                        if (window.confirm("Are you sure you want to delete ?"))
                                            handleTrainingDelete(cell)
                                    }}>Delete</Dropdown.Item>
                                    <Dropdown.Item href={`/file-repository-Edit/${cell}`}>Edit</Dropdown.Item>
                                    <Dropdown.Item href="#" onClick={() => {
                                        setSaveTrainingId(cell);
                                        setShowModal(true)
                                    }}>Share</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </>
                );
            },
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
                                                    <h1 className="title-lg"><Link to="/file-repository"><img src="../../img/back-arrow.svg" /></Link> File Repository</h1>
                                                    <header className="title-head">
                                                        <div className="user-list">
                                                            <span>
                                                                <img src="../img/gfolder-ico.png" className="me-2" alt="" />
                                                            </span>
                                                            <span className="user-name">
                                                                {Params.id === "1" ? "Daily Use" :
                                                                    Params.id === "2" ? "Business Management" :
                                                                        Params.id === "3" ? "Employeement" :
                                                                            Params.id === "4" ? "Compliance" :
                                                                                Params.id === "5" ? "Care Giving" :
                                                                                    Params.id === "6" ? "Curriculum & Planning" :
                                                                                        Params.id === "7" ? "Resources" :
                                                                                            Params.id === "8" ? "General" : "Null"
                                                                }
                                                                <small>{userData.length} files</small>
                                                            </span>
                                                        </div>
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
                <Modal
                    className="training-modal"
                    size="lg"
                    show={show}
                    onHide={handleClose}
                >
                    <Modal.Header closeButton className="f-c-modal"></Modal.Header>
                    <Modal.Body className="p-0">
                        <div className="form-settings-content">
                            <div className="modal-top">
                                <div className="modal-top-containt">
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group>
                                                <DragDropRepository onChange={setField} />
                                                <p className="error">{errors.setting_files}</p>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className="toggle-switch">
                                        {/* <Row>
                                            <Col md={12}>
                                                <div className="t-switch">
                                                    <p>Enable Sharing</p>
                                                    <div className="toogle-swich">
                                                        <input
                                                            className="switch"
                                                            type="checkbox"
                                                            name="enable_sharing"
                                                            onChange={(e) => {
                                                                setField(e.target.name, e.target.checked);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row> */}
                                    </div>
                                    <div className="setting-heading">
                                        <h2>Settings</h2>
                                    </div>
                                </div>
                                <hr></hr>
                            </div>
                            <div className="modal-bottom">
                                <Row>
                                    <Col lg={12}>
                                        <div className="metadescription">
                                            <Form.Group className="mb-3">
                                                <Form.Label>Meta Description</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    name="meta_description"
                                                    onChange={(e) => {
                                                        setField(e.target.name, e.target.value);
                                                    }}
                                                />
                                            </Form.Group>
                                        </div>
                                    </Col>
                                    <Col lg={12}>
                                        <Form.Group>
                                            <Form.Label>File Category</Form.Label>
                                            <Form.Select
                                                name="file_category"
                                                onChange={(e) => {
                                                    setField(e.target.name, e.target.value);
                                                }}
                                            >
                                                <option value="">Select File Category</option>
                                                {category?.map((item) => {
                                                    return (
                                                        <option value={item.id}>{item.category_name}</option>
                                                    );
                                                })}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mt-4">
                                    <Col lg={3} md={6}>
                                        <Form.Group>
                                            <Form.Label>Accessible to:</Form.Label>
                                            <div className="new-form-radio d-block">
                                                <div className="new-form-radio-box">
                                                    <label for="yes">
                                                        <input
                                                            type="radio"
                                                            value={1}
                                                            name="accessible_to_role"
                                                            id="yes"
                                                            onChange={(e) => {
                                                                setField(e.target.name, parseInt(e.target.value));
                                                            }}
                                                            checked={formSettingData.accessible_to_role === 1}
                                                        />
                                                        <span className="radio-round"></span>
                                                        <p>User Roles</p>
                                                    </label>
                                                </div>
                                                <div className="new-form-radio-box m-0 mt-3">
                                                    <label for="no">
                                                        <input
                                                            type="radio"
                                                            value={0}
                                                            name="accessible_to_role"
                                                            id="no"
                                                            onChange={(e) => {
                                                                setField(e.target.name, parseInt(e.target.value));
                                                            }}
                                                            checked={formSettingData.accessible_to_role === 0}
                                                        />
                                                        <span className="radio-round"></span>
                                                        <p>Specific Users</p>
                                                    </label>
                                                </div>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={9} md={12}>
                                        {formSettingData.accessible_to_role === 1 ? (
                                            <Form.Group>
                                                <Form.Label>Select User Roles</Form.Label>
                                                <div className="modal-two-check user-roles-box">
                                                    <label className="container">
                                                        Co-ordinators
                                                        <input
                                                            type="checkbox"
                                                            name="shared_role"
                                                            id="coordinator"
                                                            onClick={(e) => {
                                                                let data = { ...formSettingData };
                                                                if (
                                                                    !data['shared_role']
                                                                        .toString()
                                                                        .includes(e.target.id)
                                                                ) {
                                                                    data['shared_role'] += e.target.id + ',';
                                                                } else {
                                                                    data['shared_role'] = data[
                                                                        'shared_role'
                                                                    ].replace(e.target.id + ',', '');
                                                                    if (data['shared_role'].includes('all')) {
                                                                        data['shared_role'] = data[
                                                                            'shared_role'
                                                                        ].replace('all,', '');
                                                                    }
                                                                }
                                                                setFormSettingData(data);
                                                            }}
                                                            checked={formSettingData?.shared_role
                                                                ?.toString()
                                                                .includes('coordinator')}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                    <label className="container">
                                                        Educators
                                                        <input
                                                            type="checkbox"
                                                            name="shared_role"
                                                            id="educator"
                                                            onClick={(e) => {
                                                                let data = { ...formSettingData };
                                                                if (
                                                                    !data['shared_role']
                                                                        .toString()
                                                                        .includes(e.target.id)
                                                                ) {
                                                                    data['shared_role'] += e.target.id + ',';
                                                                } else {
                                                                    data['shared_role'] = data[
                                                                        'shared_role'
                                                                    ].replace(e.target.id + ',', '');
                                                                    if (data['shared_role'].includes('all')) {
                                                                        data['shared_role'] = data[
                                                                            'shared_role'
                                                                        ].replace('all,', '');
                                                                    }
                                                                }
                                                                setFormSettingData(data);
                                                            }}
                                                            checked={formSettingData?.shared_role
                                                                ?.toString()
                                                                .includes('educator')}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                    <label className="container">
                                                        Parents
                                                        <input
                                                            type="checkbox"
                                                            name="shared_role"
                                                            id="parent"
                                                            onClick={(e) => {
                                                                let data = { ...formSettingData };
                                                                if (
                                                                    !data['shared_role']
                                                                        .toString()
                                                                        .includes(e.target.id)
                                                                ) {
                                                                    data['shared_role'] += e.target.id + ',';
                                                                } else {
                                                                    data['shared_role'] = data[
                                                                        'shared_role'
                                                                    ].replace(e.target.id + ',', '');
                                                                    if (data['shared_role'].includes('all')) {
                                                                        data['shared_role'] = data[
                                                                            'shared_role'
                                                                        ].replace('all,', '');
                                                                    }
                                                                }
                                                                setFormSettingData(data);
                                                            }}
                                                            checked={formSettingData?.shared_role?.includes(
                                                                'parent'
                                                            )}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                    <label className="container">
                                                        All Roles
                                                        <input
                                                            type="checkbox"
                                                            name="shared_role"
                                                            id="all_roles"
                                                            onClick={(e) => {
                                                                let data = { ...formSettingData };
                                                                console.log('e.target.checked', e.target.checked);
                                                                if (e.target.checked === true) {
                                                                    if (
                                                                        !data['shared_role']
                                                                            .toString()
                                                                            .includes('parent')
                                                                    ) {
                                                                        data['shared_role'] += 'parent,';
                                                                    }
                                                                    if (
                                                                        !data['shared_role']
                                                                            .toString()
                                                                            .includes('educator')
                                                                    ) {
                                                                        data['shared_role'] += 'educator,';
                                                                    }
                                                                    if (
                                                                        !data['shared_role']
                                                                            .toString()
                                                                            .includes('coordinator')
                                                                    ) {
                                                                        data['shared_role'] += 'coordinator,';
                                                                    }
                                                                    if (
                                                                        !data['shared_role']
                                                                            .toString()
                                                                            .includes('all')
                                                                    ) {
                                                                        data['shared_role'] += 'all,';
                                                                    }
                                                                    setFormSettingData(data);
                                                                } else {
                                                                    data['shared_role'] = '';
                                                                    setFormSettingData(data);
                                                                }
                                                            }}
                                                            checked={formSettingData?.shared_role?.includes(
                                                                'all'
                                                            )}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </div>
                                            </Form.Group>
                                        ) : null}
                                        {formSettingData.accessible_to_role === 0 ? (
                                            <Form.Group>
                                                <Form.Label>Select User</Form.Label>
                                                <div className="select-with-plus">
                                                    <Multiselect
                                                        displayValue="email"
                                                        className="multiselect-box default-arrow-select"
                                                        // placeholder="Select Franchisee"
                                                        selectedValues={selectedUser}
                                                        // onKeyPressFn={function noRefCheck() {}}
                                                        onRemove={onRemoveUser}
                                                        // onSearch={function noRefCheck() {}}
                                                        onSelect={onSelectUser}
                                                        options={user}
                                                    />
                                                </div>
                                                <p className="error">{errors.franchisee}</p>
                                            </Form.Group>
                                        ) : null}
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="transparent" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={onSubmit}>
                            {loaderFlag === true ? (
                                <>
                                    <img
                                        style={{ width: '24px' }}
                                        src={'/img/mini_loader1.gif'}
                                        alt=""
                                    />
                                    Uploading...
                                </>
                            ) : (
                                'Upload File'
                            )}
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    size="lg"
                    className="form-settings-modal"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <Modal.Header closeButton>
                        <Modal.Title
                            id="contained-modal-title-vcenter"
                            className="modal-heading">
                            <img src="../../img/carbon_settings.svg" />
                            Form Settings
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="form-settings-content">
                            <Row className="mt-4">
                                <Col lg={3} md={6}>
                                    <Form.Group>
                                        <Form.Label>Send to all franchisee:</Form.Label>
                                        <div className="new-form-radio d-block">
                                            <div className="new-form-radio-box">
                                                <label for="all">
                                                    <input
                                                        type="radio"
                                                        checked={sendToAllFranchisee === 'all'}
                                                        name="send_to_all_franchisee"
                                                        id="all"
                                                        onChange={() => {
                                                            setFormSettings(prevState => ({
                                                                ...prevState,
                                                                assigned_franchisee: ['all']
                                                            }));
                                                            setSendToAllFranchisee('all')
                                                        }}
                                                    />
                                                    <span className="radio-round"></span>
                                                    <p>Yes</p>
                                                </label>
                                            </div>
                                            <div className="new-form-radio-box m-0 mt-3">
                                                <label for="none">
                                                    <input
                                                        type="radio"
                                                        name="send_to_all_franchisee"
                                                        checked={sendToAllFranchisee === 'none'}
                                                        id="none"
                                                        onChange={() => {
                                                            setFormSettings(prevState => ({
                                                                ...prevState,
                                                                assigned_franchisee: []
                                                            }));
                                                            setSendToAllFranchisee('none')
                                                        }}
                                                    />
                                                    <span className="radio-round"></span>
                                                    <p>No</p>
                                                </label>
                                            </div>
                                        </div>
                                    </Form.Group>
                                </Col>

                                <Col lg={9} md={12}>
                                    <Form.Group>
                                        <Form.Label>Select Franchisee</Form.Label>
                                        <div className="select-with-plus">
                                            <Multiselect
                                                disable={sendToAllFranchisee === 'all'}
                                                placeholder={"Select User Names"}
                                                singleSelect={true}
                                                displayValue="key"
                                                className="multiselect-box default-arrow-select"
                                                onKeyPressFn={function noRefCheck() { }}
                                                onRemove={function noRefCheck(data) {
                                                    setFormSettings((prevState) => ({
                                                        ...prevState,
                                                        assigned_franchisee: [...data.map(data => data.id)],
                                                    }));
                                                }}
                                                onSearch={function noRefCheck() { }}
                                                onSelect={function noRefCheck(data) {
                                                    setFormSettings((prevState) => ({
                                                        ...prevState,
                                                        assigned_franchisee: [...data.map((data) => data.id)],
                                                    }));
                                                }}
                                                options={franchiseeList}
                                            />
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mt-4">
                                <Col lg={3} md={6}>
                                    <Form.Group>
                                        <Form.Label>Accessible to:</Form.Label>
                                        <div className="new-form-radio d-block">
                                            <div className="new-form-radio-box">
                                                <label for="roles">
                                                    <input
                                                        type="radio"
                                                        checked={shareType === "roles"}
                                                        name="accessible_to_role"
                                                        id="roles"
                                                        onChange={() => {
                                                            setFormSettings(prevState => ({
                                                                ...prevState,
                                                                assigned_users: [],
                                                                assigned_users_data: []
                                                            }));
                                                            setApplicableToAll(true);
                                                            setShareType("roles");
                                                        }}
                                                    />
                                                    <span className="radio-round"></span>
                                                    <p>User Roles</p>
                                                </label>
                                            </div>
                                            <div className="new-form-radio-box m-0 mt-3">
                                                <label for="users">
                                                    <input
                                                        type="radio"
                                                        name="accessible_to_role"
                                                        checked={shareType === "users"}
                                                        id="users"
                                                        onChange={() => {
                                                            setFormSettings(prevState => ({
                                                                ...prevState,
                                                                user_roles: []
                                                            }));
                                                            setApplicableToAll(false);
                                                            setShareType("users");
                                                        }}
                                                    />
                                                    <span className="radio-round"></span>
                                                    <p>Specific Users</p>
                                                </label>
                                            </div>
                                        </div>
                                    </Form.Group>
                                </Col>

                                <Col lg={9} md={12}>
                                    {
                                        shareType === "roles" ?
                                            <>
                                                <Form.Label className="d-block">Select User Roles</Form.Label>
                                                <div className="btn-checkbox" style={{ display: "flex", flexDirection: "row" }}>
                                                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox">
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={formSettings.user_roles.includes("coordinator")}
                                                            label="Co-ordinators"
                                                            onChange={() => {
                                                                if (formSettings.user_roles.includes("coordinator")) {
                                                                    let data = formSettings.user_roles.filter(t => t !== "coordinator");
                                                                    setFormSettings(prevState => ({
                                                                        ...prevState,
                                                                        user_roles: [...data]
                                                                    }));
                                                                }

                                                                if (!formSettings.user_roles.includes("coordinator"))
                                                                    setFormSettings(prevState => ({
                                                                        ...prevState,
                                                                        user_roles: [...formSettings.user_roles, "coordinator"]
                                                                    }))
                                                            }} />
                                                    </Form.Group>

                                                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox1">
                                                        <Form.Check
                                                            type="checkbox"
                                                            label="Educators"
                                                            checked={formSettings.user_roles.includes("educator")}
                                                            onChange={() => {
                                                                if (formSettings.user_roles.includes("educator")) {
                                                                    let data = formSettings.user_roles.filter(t => t !== "educator");
                                                                    setFormSettings(prevState => ({
                                                                        ...prevState,
                                                                        user_roles: [...data]
                                                                    }));
                                                                }

                                                                if (!formSettings.user_roles.includes("educator"))
                                                                    setFormSettings(prevState => ({
                                                                        ...prevState,
                                                                        user_roles: [...formSettings.user_roles, "educator"]
                                                                    }))
                                                            }} />
                                                    </Form.Group>

                                                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox2">
                                                        <Form.Check
                                                            type="checkbox"
                                                            label="Guardians"
                                                            checked={formSettings.user_roles.includes("guardian")}
                                                            onChange={() => {
                                                                if (formSettings.user_roles.includes("guardian")) {
                                                                    let data = formSettings.user_roles.filter(t => t !== "guardian");
                                                                    setFormSettings(prevState => ({
                                                                        ...prevState,
                                                                        user_roles: [...data]
                                                                    }));
                                                                }

                                                                if (!formSettings.user_roles.includes("guardian"))
                                                                    setFormSettings(prevState => ({
                                                                        ...prevState,
                                                                        user_roles: [...formSettings.user_roles, "guardian"]
                                                                    }))
                                                            }} />
                                                    </Form.Group>

                                                    <Form.Group className="mb-3 form-group" controlId="formBasicCheckbox3">
                                                        <Form.Check
                                                            type="checkbox"
                                                            label="All Roles"
                                                            checked={formSettings.user_roles.length === 3}
                                                            onChange={() => {
                                                                if (formSettings.user_roles.includes("coordinator")
                                                                    && formSettings.user_roles.includes("educator")
                                                                    && formSettings.user_roles.includes("guardian")) {
                                                                    setFormSettings(prevState => ({
                                                                        ...prevState,
                                                                        user_roles: [],
                                                                    }));
                                                                }

                                                                if (!formSettings.user_roles.includes("coordinator")
                                                                    && !formSettings.user_roles.includes("educator")
                                                                    && !formSettings.user_roles.includes("guardian"))
                                                                    setFormSettings(prevState => ({
                                                                        ...prevState,
                                                                        user_roles: ["coordinator", "educator", "guardian"]
                                                                    })
                                                                    )
                                                            }} />
                                                    </Form.Group>
                                                </div> </> :
                                            <Form.Group>
                                                <Form.Label>Select User</Form.Label>
                                                <div className="select-with-plus">
                                                    <Multiselect
                                                        displayValue="email"
                                                        className="multiselect-box default-arrow-select"
                                                        // placeholder="Select Franchisee"
                                                        selectedValues={selectedUser}
                                                        // onKeyPressFn={function noRefCheck() {}}
                                                        onRemove={onRemoveUser}
                                                        // onSearch={function noRefCheck() {}}
                                                        onSelect={onSelectUser}
                                                        options={user}
                                                    />
                                                </div>
                                            </Form.Group>
                                    }
                                </Col>
                            </Row>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="justify-content-center">
                        <Button className="back" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button
                            className="done"
                            onClick={() => {
                                setShowModal(false);
                                handleTrainingSharing();
                            }}>
                            Save Settings
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}


export default FilerepoMyAdd