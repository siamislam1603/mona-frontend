import React, { useState, useEffect } from 'react'
import { Button, Container, Dropdown, Form, Modal, Row, Col } from 'react-bootstrap';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import Multiselect from 'multiselect-react-dropdown';
import makeAnimated from 'react-select/animated';
import { Link, useParams } from 'react-router-dom';
import { BASE_URL } from '../components/App';
import BootstrapTable from 'react-bootstrap-table-next';

import axios from "axios";
import { useNavigate } from 'react-router-dom';
import paginationFactory from 'react-bootstrap-table2-paginator';
import VideoPopupfForFile from '../components/VideoPopupfForFile';
import FilerepoUploadFile from './FilerepoUploadFile';
const getUser_Role = localStorage.getItem(`user_role`)
const getFranchisee = localStorage.getItem(`franchisee_id`)
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
    const Navigate = useNavigate();
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
    const [saveFileId, setSaveFileId] = useState(null);
    const [user, setUser] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [sendToAllFranchisee, setSendToAllFranchisee] = useState("none");
    const [franchiseeList, setFranchiseeList] = useState();
    const [shareType, setShareType] = useState("roles");
    const [applicableToAll, setApplicableToAll] = useState(false);
    const [error, setError] = useState(false);
    const [formSettings, setFormSettings] = useState({
        assigned_role: [],
        franchisee: [],
        assigned_users: [],
        assigned_childs: []
    });
    const [child, setChild] = useState([]);
    const [selectedChild, setSelectedChild] = useState([]);
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
    const handleFileSharing = async () => {
        let token = localStorage.getItem('token');
        let user_id = localStorage.getItem('user_id')
        setLoaderFlag(true);
        if (
            formSettingData.accessible_to_role === null ||
            formSettingData.accessible_to_role === undefined
        ) {
            formSettings.accessibleToRole = null
            formSettings.accessibleToAll = true
        }
        else {
            if (formSettingData.accessible_to_role === 1) {
                formSettings.user_roles = formSettingData.shared_role.slice(0, -1)
                formSettings.assigned_users = ""
                formSettings.accessibleToRole = formSettingData.accessible_to_role
                formSettings.accessibleToAll = false
            } else {
                formSettings.user_roles = ""
                formSettings.assigned_users = selectedUserId.slice(0, -1)
                formSettings.accessibleToRole = formSettingData.accessible_to_role
                formSettings.accessibleToAll = false
            }
        }

        formSettings.franchisee = formSettings.franchisee[0] == "all" ? [] : formSettings.franchisee
        const response = await axios.put(`${BASE_URL}/fileRepo/${saveFileId}`, {
            ...formSettings
            // shared_by: user_id,
            // is_applicable_to_all: applicableToAll
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 201 && response.data.status === "success") {
            console.log("submitted successfully")
            setLoaderFlag(false);
        } else {
            setLoaderFlag(false);
        }

        console.log(formSettings, "share final")
    }

    function onSelectUser(optionsList, selectedItem) {
        console.log('selected_item---->2', selectedItem);
        selectedUserId += selectedItem.id + ',';
        selectedUser.push({
            id: selectedItem.id,
            email: selectedItem.email,
        });

    }

    function onRemoveUser(selectedList, removedItem) {
        selectedUserId = selectedUserId.replace(removedItem.id + ',', '');
        const index = selectedUser.findIndex((object) => {
            return object.id === removedItem.id;
        });
        selectedUser.splice(index, 1);
    }

    function onSelectChild(selectedItem) {
        selectedItem = selectedItem.map((item) => {
            return item.id
        })
        setFormSettings(prevState => ({
            ...prevState,
            assigned_childs: selectedItem
        }));
    }

    function onRemoveChild(removedItem) {
        removedItem = removedItem.map((item) => {
            return item.id
        })
        setFormSettings(prevState => ({
            ...prevState,
            assigned_childs: removedItem
        }));
    }



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


        const users = response.files;
        let tempData = users.map((dt) => ({
            name: `${dt.fileType},${dt.fileName},${dt.filesPath}`,
            createdAt: dt.createdAt,
            userID: dt.id,
            creatorName: dt.creatorName + "," + dt.creatorRole,
            Shaired: dt.repository.repository_shares.length,
            categoryId: dt.categoryId
        }));
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


    const getUser = async () => {
        var myHeaders = new Headers();
        myHeaders.append(
            'authorization',
            'Bearer ' + localStorage.getItem('token')
        );

        var request = {
            headers: myHeaders,
        };

        let franchiseeArr = formSettings.franchisee

        let response = await axios.post(`${BASE_URL}/auth/users/franchisees`, { franchisee_id: franchiseeArr }, request)
        if (response.status === 200) {
            // console.log(response.data.users, "respo")
            setUser(response.data.users)
            console.log(user, "userSList")
        }
    };

    const getChildren = async () => {
        var myHeaders = new Headers();
        myHeaders.append(
            'authorization',
            'Bearer ' + localStorage.getItem('token')
        );

        let franchiseeArr = formSettings.franchisee

        var request = {
            headers: myHeaders,
        };

        let response = await axios.post(`${BASE_URL}/enrollment/franchisee/child`, { franchisee_id: franchiseeArr }, request)
        if (response.status === 200) {
            setChild(response.data.children)
        }
    }

    useEffect(() => {
        GetFile();
        getFileCategory();
        getUser();
        getChildren();
    }, [trainingDeleteMessage, formSettings.franchisee])


    useEffect(() => {
        fetchFranchiseeList();
    }, [])
    useEffect(() => {
        setTimeout(() => {
            setTrainingDeleteMessage(null)
        }, 2000);
    }, [trainingDeleteMessage])

    const handleTrainingDelete = async (cell) => {
        let token = localStorage.getItem('token');
        // let userId = localStorage.getItem('user_id');
        const response = await axios.delete(`${BASE_URL}/fileRepo/${cell}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        // HANDLING THE RESPONSE GENEREATED AFTER DELETING THE TRAINING
        if (response.status === 200 && response.data.status === "success") {
            setTrainingDeleteMessage("File deleted successfully");
            GetFile();

        } else if (response.status === 200 && response.data.status === "fail") {
            setTrainingDeleteMessage(response.data.message);
        }
    }

    // FETCH FILE DATA
    const fetchFileData = async (fileId) => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/fileRepo/fileInfo/${fileId}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (response.status === 200 && response.data.status === "success") {
            const { file } = response.data;
            copyDataToStates(file);
        }
    };

    const copyDataToStates = (file) => {
        setFormSettings(prevState => ({
            ...prevState,
            assigned_users: file?.repository_shares[0]?.assigned_users,
            assigned_role: file?.repository_shares[0]?.assigned_roles,
            franchisee: file?.repository_shares[0]?.franchisee,
            assigned_childs: file?.repository_shares[0]?.assigned_childs,
            accessibleToRole: file?.repository_shares[0].accessibleToRole,
            accessibleToAll: file?.repository_shares[0].accessibleToAll,
        }));
    }

    useEffect(() => {
        fetchFileData(saveFileId);
    }, [saveFileId]);

    const isAllRolesChecked = () => {
        let bool = false;
        if (getUser_Role == "franchisor_admin") {
            bool = formSettings.assigned_role.length === 4
        }
        else if (getUser_Role == "franchisee_admin") {
            bool = formSettings.assigned_role.length === 3
        }
        else if (getUser_Role == "coordinator") {
            bool = formSettings.assigned_role.length === 2
        }
        else if (getUser_Role == "educator") {
            bool = ["guardian"].every(item => formSettingData?.shared_role?.includes(item))
        }
        return bool;
    }

    const [columns, setColumns] = useState([
        {
            dataField: 'name',
            text: 'Name',
            sort: true,
            formatter: (cell) => {
                cell = cell.split(',');
                return (
                    <>

                        <div div className="user-list">
                            {cell[0] === "image/jpeg" || cell[0] === "image/png" || cell[0] === "image/webp" ?
                                <>
                                    <span className="user-pic-tow">
                                        <a href={cell[2]} download>
                                            <img src="../img/abstract-ico.png" className="me-2" alt="" />
                                        </a>
                                    </span>
                                    <span className="user-name">
                                        {cell[1]}.img
                                    </span>
                                </>
                                :
                                cell[0] === "audio/mpeg" ?
                                    <>
                                        <span className="user-pic-tow">
                                            <a href={cell[2]} download>
                                                <img src="../img/audio-ico.png" className="me-2" alt="" />
                                            </a>
                                        </span>
                                        <span className="user-name">
                                            {cell[1]}.mp3
                                        </span>
                                    </>

                                    : cell[0] === "video/mp4" ?
                                        <>
                                            <div style={{ width: "100%", display: "flex" }}>
                                                <VideoPopupfForFile
                                                    data={cell[2]}
                                                    title={cell[0]}
                                                    name={cell[1]}
                                                    // duration={cell[0]}
                                                    fun={handleVideoClose}
                                                />
                                            </div>
                                        </> :
                                        cell[0] === "application/octet-stream" || cell[0] === "application/pdf" || cell[0] === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || cell[0] === "text/csv" || cell[0] === "text/html" || cell[0] === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ?
                                            <>
                                                <span className="user-pic-tow">
                                                    <a href={cell[2]} download >
                                                        <img src="../img/abstract-ico.png" className="me-2" alt="" />
                                                    </a>
                                                </span>
                                                <span className="user-name">
                                                    {cell[1]}.Doc
                                                </span>
                                            </> :
                                            <>
                                                <span className="user-pic-tow">
                                                    <a href={cell[2]} download >
                                                        <img src="../img/abstract-ico.png" className="me-2" alt="" />
                                                    </a>
                                                </span>
                                                <span className="user-name">
                                                    {cell[0]}
                                                </span>
                                            </>
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

                                    {getUser_Role === "guardian" ? (<></>) : (<>
                                        <Dropdown.Item href="#" onClick={() => {
                                            setSaveFileId(cell);
                                            setShowModal(true)
                                        }}>Share</Dropdown.Item>
                                    </>)}

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
            {
                trainingDeleteMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{trainingDeleteMessage}</p>
            }
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
                                                                        Params.id === "3" ? "Employment" :
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

                                                                <FilerepoUploadFile />

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
                            Share File
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
                                                                franchisee: ['all']
                                                            }));
                                                            setSendToAllFranchisee('all')
                                                        }}
                                                        disabled={getUser_Role !== 'franchisor_admin'}
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
                                                                franchisee: []
                                                            }));
                                                            setSendToAllFranchisee('none')
                                                        }}
                                                        disabled={getUser_Role !== 'franchisor_admin'}
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
                                                disable={sendToAllFranchisee === 'all' || getUser_Role !== 'franchisor_admin'}
                                                placeholder={"Select User Names"}
                                                // singleSelect={true}
                                                displayValue="key"
                                                className="multiselect-box default-arrow-select"
                                                selectedValues={franchiseeList?.filter(d => parseInt(formSettings?.franchisee) === d.id).length == 0 ? franchiseeList?.filter(d => parseInt(getFranchisee) === d.id) : franchiseeList?.filter(d => parseInt(formSettings?.franchisee) === d.id)}
                                                onKeyPressFn={function noRefCheck() { }}
                                                onRemove={function noRefCheck(data) {
                                                    setFormSettings((prevState) => ({
                                                        ...prevState,
                                                        franchisee: [...data.map(data => data.id)],
                                                        assigned_users: [],
                                                        assigned_childs: []
                                                    }));
                                                }}
                                                onSearch={function noRefCheck() { }}
                                                onSelect={function noRefCheck(data) {
                                                    setFormSettings((prevState) => ({
                                                        ...prevState,
                                                        franchisee: [...data.map((data) => data.id)],
                                                        assigned_users: [],
                                                        assigned_childs: []
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
                                                        value={1}
                                                        checked={formSettings.accessibleToRole === 1}
                                                        name="accessible_to_role"
                                                        id="roles"
                                                        onChange={() => {
                                                            setFormSettings(prevState => ({
                                                                ...prevState,
                                                                assigned_users: [],
                                                                assigned_users_data: [],
                                                                accessibleToRole: 1
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
                                                        value={0}
                                                        checked={formSettings.accessibleToRole === 0 || formSettings.accessibleToRole === null}
                                                        id="users"
                                                        onChange={() => {
                                                            setFormSettings(prevState => ({
                                                                ...prevState,
                                                                assigned_role: [],
                                                                accessibleToRole: 0
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
                                        formSettings.accessibleToRole === 1 ?
                                            (<>
                                                <Form.Label className="d-block">Select User Roles</Form.Label>
                                                <div className="btn-checkbox" style={{ display: "flex", flexDirection: "row" }}>
                                                    {['franchisor_admin'].includes(getUser_Role) ? (<Form.Group className="mb-3 form-group" controlId="formBasicCheckbox">
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={formSettings.assigned_role.includes("franchisee_admin")}
                                                            label="franchisee_admin"
                                                            onChange={() => {
                                                                if (formSettings.assigned_role.includes("franchisee_admin")) {
                                                                    let data = formSettings.assigned_role.filter(t => t !== "franchisee_admin");
                                                                    setFormSettings(prevState => ({
                                                                        ...prevState,
                                                                        assigned_role: [...data]
                                                                    }));
                                                                }

                                                                if (!formSettings.assigned_role.includes("franchisee_admin"))
                                                                    setFormSettings(prevState => ({
                                                                        ...prevState,
                                                                        assigned_role: [...formSettings.assigned_role, "franchisee_admin"]
                                                                    }))
                                                            }} />
                                                    </Form.Group>) : null}

                                                    {['franchisor_admin', 'franchisee_admin'].includes(getUser_Role) ? (<Form.Group className="mb-3 form-group" controlId="formBasicCheckbox0">
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={formSettings.assigned_role.includes("coordinator")}
                                                            label="Co-ordinators"
                                                            onChange={() => {
                                                                if (formSettings.assigned_role.includes("coordinator")) {
                                                                    let data = formSettings.assigned_role.filter(t => t !== "coordinator");
                                                                    setFormSettings(prevState => ({
                                                                        ...prevState,
                                                                        assigned_role: [...data]
                                                                    }));
                                                                }

                                                                if (!formSettings.assigned_role.includes("coordinator"))
                                                                    setFormSettings(prevState => ({
                                                                        ...prevState,
                                                                        assigned_role: [...formSettings.assigned_role, "coordinator"]
                                                                    }))
                                                            }} />
                                                    </Form.Group>) : null}

                                                    {['franchisor_admin', 'franchisee_admin', 'coordinator'].includes(getUser_Role) ? (<Form.Group className="mb-3 form-group" controlId="formBasicCheckbox1">
                                                        <Form.Check
                                                            type="checkbox"
                                                            label="Educators"
                                                            checked={formSettings.assigned_role.includes("educator")}
                                                            onChange={() => {
                                                                if (formSettings.assigned_role.includes("educator")) {
                                                                    let data = formSettings.assigned_role.filter(t => t !== "educator");
                                                                    setFormSettings(prevState => ({
                                                                        ...prevState,
                                                                        assigned_role: [...data]
                                                                    }));
                                                                }

                                                                if (!formSettings.assigned_role.includes("educator"))
                                                                    setFormSettings(prevState => ({
                                                                        ...prevState,
                                                                        assigned_role: [...formSettings.assigned_role, "educator"]
                                                                    }))
                                                            }} />
                                                    </Form.Group>) : null}

                                                    {!['guardian'].includes(getUser_Role) ? (<Form.Group className="mb-3 form-group" controlId="formBasicCheckbox2">
                                                        <Form.Check
                                                            type="checkbox"
                                                            label="guardian"
                                                            checked={formSettings.assigned_role.includes("guardian")}
                                                            onChange={() => {
                                                                if (formSettings.assigned_role.includes("guardian")) {
                                                                    let data = formSettings.assigned_role.filter(t => t !== "guardian");
                                                                    setFormSettings(prevState => ({
                                                                        ...prevState,
                                                                        assigned_role: [...data]
                                                                    }));
                                                                }

                                                                if (!formSettings.assigned_role.includes("guardian"))
                                                                    setFormSettings(prevState => ({
                                                                        ...prevState,
                                                                        assigned_role: [...formSettings.assigned_role, "guardian"]
                                                                    }))
                                                            }} />
                                                    </Form.Group>) : null}

                                                    {!['educator', 'guardian'].includes(getUser_Role) ? (<Form.Group className="mb-3 form-group" controlId="formBasicCheckbox3">
                                                        <Form.Check
                                                            type="checkbox"
                                                            label="All Roles"
                                                            checked={isAllRolesChecked()}
                                                            onChange={() => {
                                                                if (getUser_Role == 'franchisor_admin') {
                                                                    if (formSettings.assigned_role.includes("coordinator")
                                                                        && formSettings.assigned_role.includes("educator")
                                                                        && formSettings.assigned_role.includes("guardian")
                                                                        && formSettings.assigned_role.includes("franchisee_admin")
                                                                    ) {
                                                                        setFormSettings(prevState => ({
                                                                            ...prevState,
                                                                            assigned_role: [],
                                                                        }));
                                                                    }

                                                                    if (!formSettings.assigned_role.includes("coordinator")
                                                                        && !formSettings.assigned_role.includes("educator")
                                                                        && !formSettings.assigned_role.includes("guardian")
                                                                        && !formSettings.assigned_role.includes("franchisee_admin"))
                                                                        setFormSettings(prevState => ({
                                                                            ...prevState,
                                                                            assigned_role: ["coordinator", "educator", "guardian", "franchisee_admin"]
                                                                        })
                                                                        )
                                                                }

                                                                if (getUser_Role == 'franchisee_admin') {
                                                                    if (formSettings.assigned_role.includes("coordinator")
                                                                        && formSettings.assigned_role.includes("educator")
                                                                        && formSettings.assigned_role.includes("guardian")
                                                                    ) {
                                                                        setFormSettings(prevState => ({
                                                                            ...prevState,
                                                                            assigned_role: [],
                                                                        }));
                                                                    }

                                                                    if (!formSettings.assigned_role.includes("coordinator")
                                                                        && !formSettings.assigned_role.includes("educator")
                                                                        && !formSettings.assigned_role.includes("guardian")
                                                                    )
                                                                        setFormSettings(prevState => ({
                                                                            ...prevState,
                                                                            assigned_role: ["coordinator", "educator", "guardian"]
                                                                        })
                                                                        )
                                                                }

                                                                if (getUser_Role == 'coordinator') {
                                                                    if (
                                                                        formSettings.assigned_role.includes("educator")
                                                                        && formSettings.assigned_role.includes("guardian")
                                                                    ) {
                                                                        setFormSettings(prevState => ({
                                                                            ...prevState,
                                                                            assigned_role: [],
                                                                        }));
                                                                    }

                                                                    if (!formSettings.assigned_role.includes("educator")
                                                                        && !formSettings.assigned_role.includes("guardian")
                                                                    )
                                                                        setFormSettings(prevState => ({
                                                                            ...prevState,
                                                                            assigned_role: ["educator", "guardian"]
                                                                        })
                                                                        )
                                                                }
                                                            }} />
                                                    </Form.Group>) : null}
                                                </div> </>) : null}
                                    {
                                        formSettings.accessibleToRole === 0 ?
                                            (<>

                                                <Form.Group>
                                                    <Form.Label>Select User</Form.Label>
                                                    <div className="select-with-plus">
                                                        <Multiselect
                                                            displayValue="email"
                                                            className="multiselect-box default-arrow-select"
                                                            // placeholder="Select Franchisee"
                                                            selectedValues={user && user.filter(c => formSettings.assigned_users?.includes(c.id + ""))}
                                                            value={user && user.filter(c => formSettings.assigned_users?.includes(c.id + ""))}
                                                            // onKeyPressFn={function noRefCheck() {}}
                                                            onRemove={onRemoveUser}
                                                            // onSearch={function noRefCheck() {}}
                                                            onSelect={(selectedOptions) => {
                                                                setFormSettings((prevState) => ({
                                                                    ...prevState,
                                                                    assigned_users: [...selectedOptions.map(option => option.id + "")]
                                                                }))
                                                            }}
                                                            options={user}
                                                        />
                                                    </div>
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label>Select Child</Form.Label>
                                                    <div className="select-with-plus">
                                                        <Multiselect
                                                            displayValue="fullname"
                                                            className="multiselect-box default-arrow-select"
                                                            // placeholder="Select Franchisee"
                                                            selectedValues={child && child.filter(c => formSettings.assigned_childs?.includes(c.id + ""))}
                                                            value={child && child.filter(c => formSettings.assigned_childs?.includes(c.id + ""))}
                                                            // onKeyPressFn={function noRefCheck() {}}
                                                            onRemove={onRemoveUser}
                                                            // onSearch={function noRefCheck() {}}
                                                            onSelect={(selectedOptions) => {
                                                                setFormSettings((prevState) => ({
                                                                    ...prevState,
                                                                    assigned_childs: [...selectedOptions.map(option => option.id + "")]
                                                                }))
                                                            }}
                                                            options={child}
                                                        />
                                                    </div>
                                                </Form.Group>
                                            </>) : null
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
                                handleFileSharing()
                            }}>
                            {loaderFlag === true ? (
                                <>
                                    <img
                                        style={{ width: '24px' }}
                                        src={'/img/mini_loader1.gif'}
                                        alt=""
                                    />
                                    Updating...
                                </>
                            ) : (
                                'Save Settings'
                            )}

                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}


export default FilerepoMyAdd
