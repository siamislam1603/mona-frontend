import React, { useState, useEffect } from 'react'
import { Button, Form, Modal, Row, Col, } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import { BASE_URL } from '../components/App';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import DragDropFileEdit from '../components/DragDropFileEdit';
import DragDropRepository from '../components/DragDropRepository';


let selectedUserId = '';
let selectedFranchiseeId = '';

const FilerepoUploadFile = () => {
    const Navigate = useNavigate();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    const [show, setShow] = useState(false);
    const [error, setError] = useState(false);
    const [errors, setErrors] = useState({});
    const [category, setCategory] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [selectedChild, setSelectedChild] = useState([]);
    const [sendToAllFranchisee, setSendToAllFranchisee] = useState("none");
    const [franchiseeList, setFranchiseeList] = useState();
    const [child, setChild] = useState([]);
    const [UpladFile, setUpladFile] = useState('');
    const [loaderFlag, setLoaderFlag] = useState(false);
    const [user, setUser] = useState([]);
    const [selectedAll, setSelectedAll] = useState(false);
    const getUser_Role = localStorage.getItem(`user_role`)
    const getFranchisee = localStorage.getItem('franchisee_id')
    const [formSettingData, setFormSettingData] = useState({ shared_role: '', accessible_to_role: 1 });
    const [formSettings, setFormSettings] = useState({
        assigned_franchisee: [],
    });

    //======================== GET FILE CATAGOREY==================

    const getFileCategory = async () => {
        let result = await axios.get(`${BASE_URL}/fileRepo/files-category`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => {
                setCategory(res.data.category)
            })
            .catch((error) => {
                console.error(error)
            })
    };

    const hanelCatoer = () => {
        handleShow();
        getFileCategory();
    }
    //======================== GET FILE Franchisee List==================

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

    //======================== GET Children List==================

    const getChildren = async () => {
        let franchiseeArr = formSettings.assigned_franchisee
        let response = await axios.post(`${BASE_URL}/enrollment/franchisee/child/`, { franchisee_id: franchiseeArr }, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        if (response.status === 200 && response.data.status === "success") {
            setChild(response.data.children.map(data => ({
                id: data.id,
                name: data.fullname,
                key: `${data.fullname}`
            })));
        }
    }
    //======================== GET User List==================
    const getUser = async () => {
        try {
            let franchiseeArr = getUser_Role == 'franchisor_admin' ? (formSettings.franchisee[0] == 'all' ? "all" : formSettings.franchisee) : [getFranchisee]
            let response = await axios.post(`${BASE_URL}/auth/users/franchisee-list`, { franchisee_id: franchiseeArr || [] }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })

            if (response.status === 200) {
                let userList = response.data.users
                if (getUser_Role == 'franchisee_admin') {
                    userList = response.data.users.filter(c => ['coordinator', 'educator', 'guardian']?.includes(c.role + ""))
                } else if (getUser_Role == 'coordinator') {
                    userList = response.data.users.filter(c => ['educator', 'guardian']?.includes(c.role + ""))
                } else if (getUser_Role == 'educator') {
                    userList = response.data.users.filter(c => ['guardian']?.includes(c.role + ""))
                }
                setUser(userList)
            }

        } catch (err) {

        }
    };


    function onSelectChild(selectedItem) {
        let selectedchildarr = selectedItem
        selectedItem = selectedItem.map((item) => {
            return item.id
        })
        setFormSettings(prevState => ({
            ...prevState,
            assigned_childs: selectedItem
        }));

        setSelectedChild(selectedchildarr)
    }

    useEffect(() => {
        getFileCategory();
        getChildren();
        getUser();
        fetchFranchiseeList();
    }, [formSettings.franchisee])


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

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    //========================Submit Form==================

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
        let franchiseeArr = getUser_Role == 'franchisor_admin' ? formSettings.franchisee : [getFranchisee]

        var myHeaders = new Headers();

        myHeaders.append(
            'Authorization',
            'Bearer ' + localStorage.getItem('token')
        );
        const file = formSettingData.setting_files[0];

        const blob = await fetch(await toBase64(file)).then((res) => res.blob());
        var formdata = new FormData();
        formdata.append('image', blob, file.name);
        formdata.append('description', formSettingData.meta_description);
        formdata.append('title', 'abc');
        formdata.append('createdBy', localStorage.getItem('user_name'));
        formdata.append('userId', localStorage.getItem('user_id'));
        formdata.append('categoryId', formSettingData.file_category);
        formdata.append('franchisee', franchiseeArr[0] == "all" ? [] : franchiseeArr);
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
                    selectedUserId.slice(0, -1) == "" ? [] : selectedUserId.slice(0, -1)
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
                if (response.statusText === "Created") {
                    setLoaderFlag(false);
                    setShow(false);
                    Navigate(`/file-repository-List-me/${formSettingData.file_category}`);
                    window.location.reload();
                    setUpladFile("File Upload successfully");
                }
            })
            .then((result) => {
                if (result) {
                    setLoaderFlag(false);
                    setShow(false);
                    Navigate(`/file-repository-List-me/${formSettingData.file_category}`);
                }
            })
            .catch((error) => console.error('error', error));
    };
    useEffect(() => {
        setTimeout(() => {
            setUpladFile(null)
        }, 3000);
    }, [UpladFile])

    function onSelectUser(optionsList, selectedItem) {
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

    function onRemoveChild(removedItem) {
        let removedchildarr = removedItem
        removedItem = removedItem.map((item) => {
            return item.id
        })
        setFormSettings(prevState => ({
            ...prevState,
            assigned_childs: removedItem
        }));

        setSelectedChild(removedchildarr)
    }


    function onSelect(index) {
        let data = [...user];
        if (data[index]['status'] === true) {
            data[index]['status'] = false;
            setSelectedAll(false);
        } else {
            data[index]['status'] = true;
        }
        let count = 0;
        data.map((item) => {
            if (item.status === true) count++;
        });
        if (count === data.length) {
            setSelectedAll(true);
        }
        setUser(data);
    }

    const isAllRolesChecked = () => {
        let bool = false;
        if (getUser_Role == "franchisor_admin") {
            bool = ["guardian", "educator", "coordinator", "franchisee_admin"].every(item => formSettingData?.shared_role?.includes(item))
        }
        else if (getUser_Role == "franchisee_admin") {
            bool = ["guardian", "educator", "coordinator"].every(item => formSettingData?.shared_role?.includes(item))
        }
        else if (getUser_Role == "coordinator") {
            bool = ["guardian", "educator"].every(item => formSettingData?.shared_role?.includes(item))
        }
        else if (getUser_Role == "educator") {
            bool = ["guardian"].every(item => formSettingData?.shared_role?.includes(item))
        }
        return bool;
    }

    return (
        <div>
            {
                UpladFile && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{UpladFile}</p>
            }
            <span
                className="btn btn-primary me-3"
                onClick={hanelCatoer}
            >
                <FontAwesomeIcon
                    icon={faArrowUpFromBracket}

                />{' '}
                Upload File
            </span>
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
                                            <Form.Label>Upload File*</Form.Label>
                                            <DragDropFileEdit onChange={setField} />
                                            {/* <DragDropRepository onChange={setField} /> */}
                                            {error && !formSettingData?.setting_files && < span className="error"> File  is required!</span>}
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
                                                    <option value="8">Select</option>
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
                                                    <option value="">Select</option>
                                                    {category?.map((item) => {

                                                        return (
                                                            <option value={item.id}>{item.category_name}</option>
                                                        );
                                                    })}
                                                </Form.Select>
                                            </>)}


                                        {error && !formSettingData.file_category && < span className="error">File Category is required!</span>}
                                    </Form.Group>
                                </Col>
                            </Row>
                            {getUser_Role === "guardian" ? (<></>) : (

                                <>
                                    {getUser_Role !== "franchisor_admin" ? (<></>) : (<Row className="mt-4">
                                        <Col lg={3} md={6}>
                                            <Form.Group>
                                                <Form.Label>Give access to all Franchises</Form.Label>
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
                                                                        assigned_franchisee: [],
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
                                                <Form.Label>Select Franchise(s)</Form.Label>
                                                <div className="select-with-plus">
                                                    <Multiselect
                                                        disable={sendToAllFranchisee === 'all' || getUser_Role !== 'franchisor_admin'}
                                                        placeholder={"Select"}
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
                                                        selectedValues={getUser_Role != 'franchisor_admin' ? (franchiseeList && franchiseeList.filter(c => c.id == getFranchisee)) : ""}
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
                                    </Row>)}
                                    <Row className="mt-4">
                                        <Col lg={3} md={6}>
                                            <Form.Group>
                                                <Form.Label>Accessible to</Form.Label>
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
                                                                checked={formSettingData.accessible_to_role === 0 || formSettingData.accessible_to_role === null}
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
                                                        {['franchisor_admin'].includes(getUser_Role) ? (<label className="container">
                                                            Franchisee Admin
                                                            <input
                                                                type="checkbox"
                                                                name="shared_role"
                                                                id="franchisee_admin"
                                                                checked={formSettingData?.shared_role?.toString().includes('franchisee_admin')}
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

                                                            />
                                                            <span className="checkmark"></span>
                                                        </label>) : null}
                                                        {['franchisor_admin', 'franchisee_admin'].includes(getUser_Role) ? (<label className="container">
                                                            Coordinator
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
                                                        </label>) : null}
                                                        {['franchisor_admin', 'franchisee_admin', 'coordinator'].includes(getUser_Role) ? (<label className="container">
                                                            Educator
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
                                                        </label>) : null}
                                                        {!['guardian'].includes(getUser_Role) ? (<label className="container">
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
                                                        </label>) : null}
                                                        {!['educator', 'guardian'].includes(getUser_Role) ? (<label className="container">
                                                            All Roles
                                                            <input
                                                                type="checkbox"
                                                                name="shared_role"
                                                                id="all_roles"
                                                                onClick={(e) => {
                                                                    let data = { ...formSettingData };

                                                                    if (e.target.checked === true) {
                                                                        if (
                                                                            !data['shared_role']
                                                                                .toString()
                                                                                .includes('guardian') && ['franchisor_admin', 'franchisee_admin', 'coordinator', 'educator'].includes(getUser_Role)
                                                                        ) {
                                                                            data['shared_role'] += 'guardian,';
                                                                        }
                                                                        if (
                                                                            !data['shared_role']
                                                                                .toString()
                                                                                .includes('educator') && ['franchisor_admin', 'franchisee_admin', 'coordinator'].includes(getUser_Role)
                                                                        ) {
                                                                            data['shared_role'] += 'educator,';
                                                                        }
                                                                        if (
                                                                            !data['shared_role']
                                                                                .toString()
                                                                                .includes('coordinator') && ['franchisor_admin', 'franchisee_admin'].includes(getUser_Role)
                                                                        ) {
                                                                            data['shared_role'] += 'coordinator,';
                                                                        }
                                                                        if (
                                                                            !data['shared_role']
                                                                                .toString()
                                                                                .includes('franchisee_admin') && ['franchisor_admin'].includes(getUser_Role)
                                                                        ) {
                                                                            data['shared_role'] += 'franchisee_admin,';
                                                                        }

                                                                        // if (
                                                                        //     !data['shared_role']
                                                                        //         .toString()
                                                                        //         .includes('all')
                                                                        // ) {
                                                                        //     data['shared_role'] += ',';

                                                                        // }
                                                                        setFormSettingData(data);
                                                                    } else {
                                                                        data['shared_role'] = '';
                                                                        setFormSettingData(data);
                                                                    }
                                                                }}
                                                                checked={isAllRolesChecked()}
                                                            />
                                                            <span className="checkmark"></span>
                                                        </label>) : null}
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
                                                                displayValue="name"
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
                                </>

                            )
                            }
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
        </div>
    )
}

export default FilerepoUploadFile