import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Form, Modal } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import makeAnimated from 'react-select/animated';
import Multiselect from 'multiselect-react-dropdown';
import DragDropRepository from '../components/DragDropRepository';
import { BASE_URL } from '../components/App';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const animatedComponents = makeAnimated();
let selectedUserId = '';

const RepoEdit = () => {
    const Params = useParams();

    const [settingsModalPopup, setSettingsModalPopup] = useState(false);
    const [selectedFranchisee, setSelectedFranchisee] = useState("Special DayCare, Sydney");
    const [formSettingData, setFormSettingData] = useState({ shared_role: '' });
    const [errors, setErrors] = useState({});
    const [category, setCategory] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [user, setUser] = useState([]);
    const [loaderFlag, setLoaderFlag] = useState(false);
    const [userData, setUserData] = useState([]);
    const [MetaDisc, SetMetaDisc] = useState([]);
    const [img, SetImg] = useState([]);
    const [data, setData] = useState([])
    const [description, setdescription] = useState([])
    const [image, setImage] = useState([])
    const [userDatacategory, setUsercategory] = useState([]);


    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const GetData = async () => {
        let response = await axios.get(`${BASE_URL}/fileRepo/fileInfo/${Params.id}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        console.log(response, "response")
        if (response.status === 200 && response.data.status === "success") {
            const result = response.data.file;
            setData(result);
            console.log('result>>>>>>>', result)
        }
        // let result = response.data.file
        // let Repositoryfiles = result.repository_files[0]
        // setData(result)
        // console.log
        // setdescription(result.description)
        // setImage(Repositoryfiles.filesPath)
        // setUsercategory(Repositoryfiles.categoryId)
        // console.log("Repositoryfiles", Repositoryfiles)
    }
    console.log(">>>>>>>>>>>>>data", data)

    const copyFetchedData = () => {
        setData(prevState => ({
            ...prevState,
            createdAt: data?.createdAt,
            description: data?.description,
            meta_description: data?.meta_description,
            category_id: data?.category_id,
            category_id: data?.category_id,
            category_id: data?.category_id,

        }));
    }



















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
        let result = await fetch(`${BASE_URL}/fileRepo/files-category/`, requestOptions);
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


    // const Update = async () => {
    //     console.log('CREATING THE TRAINING');
    //     const token = localStorage.getItem('token');
    //     const response = await axios.get(`${BASE_URL}/fileRepo/fileInfo/${Params}`, {
    //         headers: {
    //             "Authorization": "Bearer " + token
    //         }
    //     }
    //     );
    //     console.log(response, "responseresponseresponseresponseresponseresponse")
    // }





    useEffect(() => {
        GetData();
        // updateTraining();
        // Update();
        // getUserRoleAndFranchiseeData();
        // getMyAddedFileRepoData();
        // getFilesSharedWithMeData();
        getFileCategory();
        getUser();
    }, []);








    return (
        <div style={{ position: "relative", overflow: "hidden" }}>
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
                                    setSelectedFranchisee={setSelectedFranchisee} />
                                <div className="entry-container">
                                    <header className="title-head">
                                        <h1 className="title-lg">
                                            Edit File{' '}
                                            <span className="setting-ico" onClick={() => setSettingsModalPopup(true)}>
                                                <img src="../img/setting-ico.png" alt="" />
                                            </span>
                                        </h1>
                                    </header>
                                    <div className="form-settings-content">
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
                                                        <Row>
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
                                                        </Row>
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
                                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                                        <Button variant="link btn btn-light btn-md m-2" style={{ backgroundColor: '#efefef' }} >Cancel</Button>
                                                        <Button type="submit" > Save Details</Button>
                                                    </Form.Group>
                                                </Row>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>
            </div>
        </div>
    );
};
export default RepoEdit