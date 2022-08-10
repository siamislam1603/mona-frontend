import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Form, Modal } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import makeAnimated from 'react-select/animated';
import Multiselect from 'multiselect-react-dropdown';
import DragDropRepository from '../components/DragDropRepository';
import { BASE_URL } from '../components/App';
import axios from 'axios';
import DropOneFile from '../components/DragDrop';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import { EditFleRepo } from '../helpers/validation'
// import { TrainingFormValidation } from '../helpers/validation';
const animatedComponents = makeAnimated();
let selectedUserId = '';

const RepoEdit = () => {
    const Params = useParams();

    const [settingsModalPopup, setSettingsModalPopup] = useState(false);
    const [selectedFranchisee, setSelectedFranchisee] = useState("Special DayCare, Sydney");
    const [formSettingData, setFormSettingData] = useState({ shared_role: '' });
    console.log(formSettingData, "formSettingData")
    const [errors, setErrors] = useState({});
    const [category, setCategory] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [user, setUser] = useState([]);
    const [data, setData] = useState([])
    const [coverImage, setCoverImage] = useState({});
    const [fetchedCoverImage, setFetchedCoverImage] = useState();

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
            const FileResult = response.data.file;
            console.log('result>>>>>>>', FileResult)
            copyFetchedData(FileResult);
        }

    }
    console.log(">>>>>>>>>>>>>data", data)
    const copyFetchedData = (data) => {
        setData(prevState => ({
            ...prevState,
            createdAt: data?.createdAt,
            description: data?.description,
            meta_description: data?.meta_description,
            title: data?.title,
            categoryId: data?.repository_files[0].categoryId,
            filesPath: data?.repository_files[0].filesPath,
            repository_shares: data?.repository_shares[0].franchisee,
            accessibleToRole: data?.repository_shares[0].accessibleToRole,
            assigned_users: data?.repository_shares[0].assigned_users,
            assigned_roles: data?.repository_shares[0].assigned_roles,
        }));
        setCoverImage(data?.repository_files[0].filesPath);
        setFetchedCoverImage(data?.repository_files[0].filesPath);

    }
    // FUNCTION TO SAVE TRAINING SETTINGS
    const handleDiscriptionSettings = (event) => {
        const { name, value } = event.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // FUNCTION TO SAVE TRAINING DATA
    const handleDiscriptionData = (event) => {
        const { name, value } = event.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Update API For File Repo

    const updatefile = async (data) => {
        const token = localStorage.getItem('token');
        const response = await axios.put(
            `${BASE_URL}/fileRepo/${Params.id}`, data, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }
        );
        console.log(response, "<<<<<<<<<<<>>>>>>>>");
    }

    const handleDataSubmit = event => {
        event.preventDefault();
        let errorObj = EditFleRepo(data, coverImage);
        if (Object.keys(errorObj).length > 0) {
            setErrors(errorObj);
        } else { }
        
    }





    const getFileCategory = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${BASE_URL}/fileRepo/files-category/`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        }
        );
        if (response.status === 200 && response.data.status === "success") {
            const categoryList = response.data.category;
            console.log('CATEGORY:', categoryList)
            setCategory([
                ...categoryList.map((data) => ({
                    id: data.id,
                    value: data.category_name,
                    label: data.category_name,
                })),
            ]);
        }
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

    useEffect(() => {
        GetData();
        getFileCategory();
        getUser();
        updatefile();
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
                                                        <Col md={6}>
                                                            {/* <div className="repositorydrag"> */}
                                                            <DropOneFile
                                                                onSave={setCoverImage}
                                                                title="Image"
                                                                setErrors={setErrors}
                                                                setFetchedCoverImage={setFetchedCoverImage}
                                                            // setTrainingData={setTraining}
                                                            />
                                                            <small className="fileinput">(png, jpg & jpeg)</small>
                                                            {fetchedCoverImage && <img className="cover-image-style" src={fetchedCoverImage} alt="training cover image" />}
                                                            {errors && errors.coverImage && <span className="error mt-2">{errors.coverImage}</span>}
                                                            {/* </div> */}
                                                        </Col>
                                                        <Col md={6}></Col>
                                                        {/* <Form.Group>
                                                                <DragDropRepository value={data.filesPath} onChange={data.filesPath} />
                                                                <p className="error">{errors.setting_files}</p>
                                                                <img src={data.filesPath} alt="" width="100px" height="100px" />
                                                                {console.log(data.filesPath)}
                                                            </Form.Group> */}
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
                                                                    name="description"
                                                                    value={data?.description}
                                                                    onChange={handleDiscriptionData}
                                                                />
                                                            </Form.Group>
                                                        </div>
                                                    </Col>
                                                    <Col lg={12}>
                                                        <Form.Group>
                                                            <Form.Label>File Category</Form.Label>
                                                            {/* {console.log(trainingCategory.filter(c => c.id === trainingData.category_id), "trainingCategory")} */}
                                                            <Select
                                                                closeMenuOnSelect={true}
                                                                options={category}
                                                                value={category.filter(c => c.id === data.categoryId) || category.filter(c => c.id === data.categoryId)}
                                                                name="file_category"
                                                                onChange={(e) => setData(prevState => ({
                                                                    ...prevState,
                                                                    categoryId: e.id
                                                                }))}
                                                            />
                                                            {errors && errors.categoryId && <span className="error">{errors.categoryId}</span>}
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
                                                                            name="accessibleToRole"
                                                                            id="yes"
                                                                            onChange={(event) => {
                                                                                setData((prevState) => ({
                                                                                    ...prevState,
                                                                                    accessibleToRole: 1,
                                                                                }));
                                                                            }}
                                                                            // onChange={(e) => {
                                                                            //     setData(e.target.name, parseInt(e.target.value));
                                                                            // }}
                                                                            checked={data.accessibleToRole === 1}
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
                                                                            name="accessibleToRole"
                                                                            id="no"
                                                                            onChange={(event) => {
                                                                                setData((prevState) => ({
                                                                                    ...prevState,
                                                                                    accessibleToRole: 0,
                                                                                }));
                                                                            }}
                                                                            checked={data.accessibleToRole === 0}
                                                                        />
                                                                        <span className="radio-round"></span>
                                                                        <p>Specific Users</p>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col lg={9} md={12}>
                                                        {data.accessibleToRole === 1 ? (
                                                            <Form.Group>
                                                                <Form.Label>Select User Roles</Form.Label>
                                                                <div className="modal-two-check user-roles-box">
                                                                    <label className="container">
                                                                        Co-ordinators
                                                                        {console.log(data?.assigned_roles?.toString().includes('coordinator'), "coordinator")}
                                                                        <input
                                                                            type="checkbox"
                                                                            name="shared_role"
                                                                            id="coordinator"
                                                                            checked={data?.assigned_roles?.toString().includes('coordinator')}
                                                                            onChange={() => {
                                                                                if (data.assigned_roles?.includes("coordinator")) {
                                                                                    let Data = data.assigned_roles.filter(t => t !== "coordinator");
                                                                                    setData(prevState => ({
                                                                                        ...prevState,
                                                                                        assigned_roles: [...Data]
                                                                                    }));
                                                                                }

                                                                                if (!data.assigned_roles?.includes("coordinator"))
                                                                                    setData(prevState => ({
                                                                                        ...prevState,
                                                                                        assigned_roles: [...data.assigned_roles, "coordinator"]
                                                                                    }))
                                                                            }}
                                                                        />
                                                                        <span className="checkmark"></span>
                                                                    </label>
                                                                    <label className="container">
                                                                        Educators
                                                                        <input
                                                                            type="checkbox"
                                                                            name="shared_role"
                                                                            id="educator"
                                                                            checked={data?.assigned_roles?.toString().includes('educator')}
                                                                            onChange={() => {
                                                                                if (data.assigned_roles?.includes("educator")) {
                                                                                    let Data = data.assigned_roles.filter(t => t !== "educator");
                                                                                    setData(prevState => ({
                                                                                        ...prevState,
                                                                                        assigned_roles: [...Data]
                                                                                    }));
                                                                                }

                                                                                if (!data.assigned_roles?.includes("educator"))
                                                                                    setData(prevState => ({
                                                                                        ...prevState,
                                                                                        assigned_roles: [...data.assigned_roles, "educator"]
                                                                                    }))
                                                                            }}

                                                                        />
                                                                        <span className="checkmark"></span>
                                                                    </label>
                                                                    <label className="container">
                                                                        Parents
                                                                        <input
                                                                            type="checkbox"
                                                                            name="shared_role"
                                                                            id="parent"
                                                                            checked={data?.assigned_roles.includes('parent')}
                                                                            onChange={() => {
                                                                                if (data.assigned_roles?.includes("parent")) {
                                                                                    let Data = data.assigned_roles.filter(t => t !== "parent");
                                                                                    setData(prevState => ({
                                                                                        ...prevState,
                                                                                        assigned_roles: [...Data]
                                                                                    }));
                                                                                }

                                                                                if (!data.assigned_roles?.includes("parent"))
                                                                                    setData(prevState => ({
                                                                                        ...prevState,
                                                                                        assigned_roles: [...data.assigned_roles, "parent"]
                                                                                    }))
                                                                            }}

                                                                        />
                                                                        <span className="checkmark"></span>
                                                                    </label>
                                                                    <label className="container">
                                                                        All Roles
                                                                        <input
                                                                            type="checkbox"
                                                                            name="shared_role"
                                                                            id="all_roles"
                                                                            checked={data?.assigned_roles?.includes('all')}
                                                                            onChange={() => {
                                                                                if (data.assigned_roles?.includes("coordinator")
                                                                                    && data.assigned_roles.includes("educator")
                                                                                    && data.assigned_roles.includes("parent")) {
                                                                                    setData(prevState => ({
                                                                                        ...prevState,
                                                                                        assigned_roles: [],
                                                                                    }));
                                                                                }
                                                                                if (!data.assigned_roles?.includes("coordinator")
                                                                                    && !data.assigned_roles.includes("educator")
                                                                                    && !data.assigned_roles.includes("parent")
                                                                                )
                                                                                    setData(prevState => ({
                                                                                        ...prevState,
                                                                                        assigned_roles: ["coordinator", "educator", "parent"]
                                                                                    })
                                                                                    )
                                                                            }} />
                                                                        <span className="checkmark"></span>
                                                                    </label>
                                                                </div>
                                                            </Form.Group>
                                                        ) : null}
                                                        {data.accessibleToRole === 0 ? (
                                                            <Form.Group>
                                                                <Form.Label>Select User</Form.Label>
                                                                <div className="select-with-plus">
                                                                    <Multiselect
                                                                        displayValue="email"
                                                                        className="multiselect-box default-arrow-select"
                                                                        selectedValues={user && user.filter(c => data.assigned_users?.includes(c.id + ""))}
                                                                        onRemove={onRemoveUser}
                                                                        value={user && user.filter(c => data.assigned_users?.includes(c.id + ""))}
                                                                        onSelect={(selectedOptions) => {
                                                                            setData((prevState) => ({
                                                                                ...prevState,
                                                                                assigned_users: [...selectedOptions.map(option => option.id + "")]
                                                                            }));
                                                                        }}
                                                                        options={user}
                                                                    />
                                                                    {console.log(data, "????????????????????a")}
                                                                </div>
                                                                <p className="error">{errors.franchisee}</p>
                                                            </Form.Group>
                                                        ) : null}
                                                    </Col>
                                                    <Form.Group className="mb-3" controlId="formBasicPassword" align-items-center>
                                                        <Button variant="link btn btn-light btn-md m-2" style={{ backgroundColor: '#efefef' }} >Cancel</Button>
                                                        <Button type="submit" onClick={handleDataSubmit} > Save Details</Button>
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