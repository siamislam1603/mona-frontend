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
            window.location.reload()
        } else {
            setLoaderFlag(false);
            
            window.location.reload()
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

    const onSubmit = async (e) => {
        e.preventDefault();
        selectedUser?.map((item) => {
            selectedFranchiseeId += item.id + ',';
        });

        if (!formSettingData.setting_files || !formSettingData.meta_description || !formSettingData.file_category) {
            setError(true);
            return false
        }


        setLoaderFlag(true);

        var myHeaders = new Headers();

        myHeaders.append(
            'Authorization',
            'Bearer ' + localStorage.getItem('token')
        );
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
        formdata.append('franchisee', formSettings?.assigned_franchisee[0] == "all" ? [] : formSettings?.assigned_franchisee);
        if (
            formSettingData.accessible_to_role === null ||
            formSettingData.accessible_to_role === undefined
        ) {
            formdata.append(
                'accessibleToRole',
                ""
            );
            formdata.append(
                'accessibleToAll',
                true
            );
        }
        else {
            if (formSettingData.accessible_to_role === 1) {
                formdata.append(
                    'user_roles',
                    formSettingData.shared_role.slice(0, -1)
                );
                formdata.append(
                    'assigned_users',
                    ""
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
                    'user_roles',
                    ""
                );
                formdata.append(
                    'assigned_users',
                    selectedUserId.slice(0, -1) == "" ? null : selectedUserId.slice(0, -1)
                );
                formdata.append(
                    'accessibleToRole',
                    formSettingData.accessible_to_role
                );
                formdata.append(
                    'accessibleToAll',
                    false
                );
                formdata.append(
                    'assigned_childs',
                    formSettings.assigned_childs
                )
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
                    Navigate(`/file-repository-List-me/${formSettingData.file_category}`);
                }
            })
            .then((result) => {
                if (result) {
                    setLoaderFlag(false);
                    setShow(false);
                    Navigate(`/file-repository-List-me/${formSettingData.file_category}`);
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
            setTrainingDeleteMessage(response.data.message);

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
        if(getUser_Role == "franchisor_admin"){
          bool = formSettings.assigned_role.length === 4
        }
        else if(getUser_Role == "franchisee_admin"){
            bool = formSettings.assigned_role.length === 3        
        }
        else if(getUser_Role == "coordinator"){
            bool = formSettings.assigned_role.length === 2
        }
        else if(getUser_Role == "educator"){
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
                                            </> : cell[0]
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
                                                                {/* <Dropdown className="filtercol me-3">
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
                                                                </Dropdown> */}
                                                                <FilerepoUploadFile />
                                                                {/* <span
                                                                    className="btn btn-primary me-3"
                                                                    onClick={handleShow}
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={faArrowUpFromBracket}
                                                                    />{' '}
                                                                    Upload File
                                                                </span> */}
                                                                {/* <Dropdown>
                                                                    <Dropdown.Toggle
                                                                        id="extrabtn"
                                                                        className="ctaact"
                                                                    >
                                                                        <img src="../img/dot-ico.svg" alt="" />
                                                                    </Dropdown.Toggle>
                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item>
                                                                           
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item href="#">
                                                                            Delete All Row
                                                                        </Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown> */}
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
                                                <Form.Label>Upload File:*</Form.Label>
                                                <DragDropRepository onChange={setField} />
                                                {error && !formSettingData.setting_files && < span className="error"> File Category is required!</span>}
                                                <p className="error">{errors.setting_files}</p>
                                            </Form.Group>
                                        </Col>
                                    </Row>

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
                                                <Form.Label>Meta Description*</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    name="meta_description"
                                                    onChange={(e) => {
                                                        setField(e.target.name, e.target.value);
                                                    }}
                                                />
                                                {error && !formSettingData.meta_description && < span className="error"> Meta Description is required!</span>}
                                            </Form.Group>
                                        </div>
                                    </Col>
                                    <Col lg={12}>
                                        <Form.Group>
                                            <Form.Label>File Category*</Form.Label>
                                            {getUser_Role === "guardian" ? (
                                                <>
                                                    <Form.Select
                                                        name="file_category"
                                                        onChange={(e) => {
                                                            setField(e.target.name, e.target.value);
                                                        }}
                                                    >
                                                        <option value="8" selected={true}>General</option>
                                                    </Form.Select>
                                                </>) : (
                                                <>
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
                                                </>)}


                                            {error && !formSettingData.file_category && < span className="error"> File is required!</span>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {getUser_Role === "guardian" ? (<></>) : (<>
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
                                                                        assigned_franchisee: ['all'],
                                                                        franchisee: ['all']
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
                                                                        assigned_franchisee: [],
                                                                        franchisee: []
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
                                                        displayValue="key"
                                                        className="multiselect-box default-arrow-select"
                                                        onRemove={function noRefCheck(data) {
                                                            setFormSettings((prevState) => ({
                                                                ...prevState,
                                                                assigned_franchisee: [...data.map(data => data.id)],
                                                                franchisee: [...data.map(data => data.id)]
                                                            }));

                                                            setSelectedUser([])
                                                            setSelectedChild([])
                                                        }}
                                                        selectedValues={franchiseeList && franchiseeList.filter(c => formSettings.franchisee?.includes(c.id + ""))}

                                                        onSelect={function noRefCheck(data) {
                                                            setFormSettings((prevState) => ({
                                                                ...prevState,
                                                                assigned_franchisee: [...data.map((data) => data.id)],
                                                                franchisee: [...data.map(data => data.id)]
                                                            }));

                                                            setSelectedUser([])
                                                            setSelectedChild([])
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
                                            {console.log(formSettingData, "{console.log(...formSettingData)}")}
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
                                                            Guardian
                                                            <input
                                                                type="checkbox"
                                                                name="shared_role"
                                                                id="guardian"
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
                                                                    'guardian'
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
                                                                                .includes('guardian')
                                                                        ) {
                                                                            data['shared_role'] += 'guardian,';
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
                                                                            data['shared_role'] += 'coordinator';
                                                                        }
                                                                        if (
                                                                            !data['shared_role']
                                                                                .toString()
                                                                                .includes('all')
                                                                        ) {
                                                                            data['shared_role'] += ',';
                                                                        }
                                                                        setFormSettingData(data);
                                                                    } else {
                                                                        data['shared_role'] = '';
                                                                        setFormSettingData(data);
                                                                    }
                                                                }}
                                                                checked={formSettingData?.shared_role?.includes(
                                                                    'guardian,educator,coordinator'
                                                                )}
                                                            />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </div>
                                                </Form.Group>
                                            ) : null}
                                            {formSettingData.accessible_to_role === 0 ? (
                                                <>

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
                                                    <Form.Group>
                                                        <Form.Label>Select Child</Form.Label>
                                                        <div className="select-with-plus">
                                                            <Multiselect
                                                                displayValue="fullname"
                                                                className="multiselect-box default-arrow-select"
                                                                // placeholder="Select Franchisee"
                                                                selectedValues={selectedChild}
                                                                // onKeyPressFn={function noRefCheck() {}}
                                                                onRemove={onRemoveChild}
                                                                // onSearch={function noRefCheck() {}}
                                                                onSelect={onSelectChild}
                                                                options={child}
                                                            />
                                                        </div>
                                                    </Form.Group>
                                                </>
                                            ) : null}
                                        </Col>
                                    </Row>
                                </>)}
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
                                                selectedValues={franchiseeList && franchiseeList.filter(d => formSettings?.franchisee?.includes(d.id.toString())).length == 0 ? franchiseeList?.filter(d => getFranchisee.includes(d.id.toString())) : franchiseeList?.filter(d => formSettings?.franchisee.includes(d.id.toString())) }
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
                                                                // assigned_users: [],
                                                                // assigned_users_data: [],
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
                                                                // assigned_role: [],
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
                                                            label="Franchisee Admin"
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

                                                    {['franchisor_admin','franchisee_admin'].includes(getUser_Role) ? (<Form.Group className="mb-3 form-group" controlId="formBasicCheckbox0">
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={formSettings.assigned_role.includes("coordinator")}
                                                            label="Coordinators"
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

                                                    {['franchisor_admin','franchisee_admin', 'coordinator'].includes(getUser_Role) ? (<Form.Group className="mb-3 form-group" controlId="formBasicCheckbox1">
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

                                                    {!['educator','guardian'].includes(getUser_Role) ? (<Form.Group className="mb-3 form-group" controlId="formBasicCheckbox3">
                                                        <Form.Check
                                                            type="checkbox"
                                                            label="All Roles"
                                                            checked={isAllRolesChecked()}
                                                            onChange={() => {
                                                                if(getUser_Role == 'franchisor_admin'){
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

                                                                if(getUser_Role == 'franchisee_admin'){
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

                                                                if(getUser_Role == 'coordinator'){
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
