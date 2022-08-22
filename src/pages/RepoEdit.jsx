import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Form, Modal } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import makeAnimated from 'react-select/animated';
import Multiselect from 'multiselect-react-dropdown';
import DragDropRepository from '../components/DragDropRepository';
import { BASE_URL } from '../components/App';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import DragDropFileEdit from '../components/DragDropFileEdit';
import VideoPopupfForFile from '../components/VideoPopupfForFile';
const animatedComponents = makeAnimated();

let selectedUserId = '';

const RepoEdit = () => {

    const Params = useParams();
    const navigate = useNavigate();
    const [selectedFranchisee, setSelectedFranchisee] = useState("Special DayCare, Sydney");
    const [errors, setErrors] = useState({});
    const [category, setCategory] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [user, setUser] = useState([]);
    const [data, setData] = useState([])
    const [franchiseeList, setFranchiseeList] = useState();
    const [sendToAllFranchisee, setSendToAllFranchisee] = useState("none");
    const [error, setError] = useState(false);
    const [coverImage, setCoverImage] = useState({});
    const [formSettings, setFormSettings] = useState({
        assigned_role: [],
        franchisee: [],
        assigned_users: []
    });

    // const toBase64 = (file) =>
    //     new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = () => resolve(reader.result);
    //         reader.onerror = (error) => reject(error);
    //     });

    const GetData = async () => {
        let response = await axios.get(`${BASE_URL}/fileRepo/fileInfo/${Params.id}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        console.log(response, "response")
        if (response.status === 200 && response.data.status === "success") {
            console.log('RESPONSE IS SUCCESS');
            const { file } = response.data;
            console.log('result>>>>>>>', file)
            copyFetchedData(file);
        }

    }

    const copyFetchedData = (data) => {
        setData(prevState => ({
            ...prevState,
            id: data.id,
            createdAt: data?.createdAt,
            description: data?.description,
            title: data?.title,
            categoryId: data?.repository_files[0].categoryId,
            image: data?.repository_files[0].filesPath,
            franchise: data?.repository_shares[0].franchisee,
            accessibleToRole: data?.repository_shares[0].accessibleToRole,
            accessibleToAll: data?.repository_shares[0].accessibleToAll,
            assigned_users: data?.repository_shares[0].assigned_users,
            user_roles: data?.repository_shares[0].assigned_roles,
        }));
        setCoverImage(data?.repository_files[0].filesPath);
    }

    // FUNCTION TO SAVE TRAINING DATA
    const handleDiscriptionData = (event) => {
        const { name, value } = event.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Update API For File Repo

    const handleDataSubmit = async (event) => {
        event.preventDefault();
        console.log('DATA:', data);
        if (!data.image || !data.description || !data.categoryId) {
            setError(true);
            return false
        }
        let dataObj = new FormData();
        for (let [key, value] of Object.entries(data)) {
            console.log(key, value);
            dataObj.append(key, value);
        }
        saveDataToServer(dataObj);
    }

    const saveDataToServer = async () => {
        console.log('SAVING DATA TO SERVER');
        const token = localStorage.getItem('token');
        let response = await axios.put(`${BASE_URL}/fileRepo`, data, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        console.log('DATA UPDATE RESPONSE:', response);
        if (response.status === 200 && response.data.status === "success") {
            if (typeof data.image === 'string') {
                response = await axios.patch(`${BASE_URL}/fileRepo/updateFilePath/${Params.id}`, { filesPath: data.image });

                console.log('IMAGE UPDATE RESPONSE:', response);
                if (response.status === 201 && response.data.status === "success") {
                    console.log('IMAGE UPLOADED SUCCESSFULLY => type: string');
                    window.location.href = '/file-repository';
                }
            } else if (typeof data.image === 'object') {
                let dataObj = new FormData();
                dataObj.append("image", data.image);
                dataObj.append("id", Params.id);
                dataObj.append("title", data.title);
                dataObj.append("description", data.description);

                response = await axios.post(`${BASE_URL}/fileRepo/data/saveImageData`, dataObj, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });

                console.log('SOLO IMAGE SAVE RESPONSE:', response);
                if (response.status === 200 && response.data.status === "success") {
                    console.log('DATA UPDATED SUCCESSFULLT => type: object');
                    window.location.href = '/file-repository';
                }
            }
            console.log('DATA UPDATED SUCCESSFULLT');
            window.location.href = '/file-repository';
        }
    }

    const childList = async () =>{
        const token = localStorage.getItem('token');
        console.log("data frnahise",data.franchise)
        const response = await axios.post(`${BASE_URL}/enrollment/franchisee/child/`, {
            franchisee_id: data.franchise

          },
          {
            headers: {
                "Authorization": `Bearer ${token}`
            }
          })
        console.log("CHIlD DATA after franhisee",response)
        if(response.status === 200 && response.data.status === "success"){
            setData((prevState) => ({
                ...prevState,
                franchise: [data.franchise.map(option => option.id + "")]
            }));
        }

    }

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

    const setField = async (field, value) => {
        setData({ ...data, image: field[0] })
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
        fetchFranchiseeList();
        // childList()
    }, []);

    useEffect(() =>{
        childList()
    },[data.franchise])

    data && console.log('FILE REPO DATA:', data.franchise);
    data && console.log('TYPE OF IMAGE DATA:', typeof data.image);

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
                                            <span className="setting-ico" >
                                                <img src="../img/setting-ico.png" alt="" />
                                            </span>
                                        </h1>
                                    </header>
                                    <div className="form-settings-content">
                                        <div className="form-settings-content">
                                            <div className="modal-top">
                                                <div className="modal-top-containt">
                                                    <Row>
                                                        {/* <Col md={6}>
                                                           
                                                            <DropOneFile
                                                                onSave={setCoverImage}
                                                                title="Image"
                                                                setErrors={setErrors}
                                                                setFetchedCoverImage={setFetchedCoverImage}
                                                            setTrainingData={setTraining}?
                                                            />
                                                            <small className="fileinput">(png, jpg & jpeg)</small>
                                                            {fetchedCoverImage && <img className="cover-image-style" src={fetchedCoverImage} alt="training cover image" />}
                                                            {errors && errors.coverImage && <span className="error mt-2">{errors.coverImage}</span>}
                                                            
                                                        </Col> */}
                                                        <Col md={6}></Col>
                                                        <Form.Group>
                                                            {/* <DragDropRepository /> */}
                                                            {/* <VideoPopupfForFile
                                                                data={data.image}
                                                            title={cell[0]}
                                                            name={cell[1]}
                                                            duration={cell[0]}
                                                            fun={handleVideoClose}
                                                            /> */}

                                                            {/* <video width="auto" height="auto" autoplay>
                                                                <source src={data.image} type="video/ogg" />
                                                                Your browser does not support the video tag.
                                                            </video> */}
                                                            {/* {data.image} */}
                                                            <DragDropFileEdit onChange={setField} />
                                                            <div className="showfiles mt-3 text-center" >
                                                                {typeof data.image === "string" ?
                                                                    (<img src={data.image} alt="smkdjh" style={{ maxWidth: "150px", height: "auto" }} />)
                                                                    : (<></>)}
                                                            </div>
                                                            {error && !data.image && < span className="error"> File is required!</span>}
                                                            <p className="error">{errors.setting_files}</p>
                                                            {/* <img className="cover-image-style" src={coverImage} alt="training cover image" /> */}
                                                            {/* {
                                                                data &&
                                                                <>
                                                                    <img className="cover-image-style" src={data.image} alt="training cover image" />
                                                                    <div className="showfiles">
                                                                        <ul>{data.image}</ul>
                                                                    </div>
                                                                </>
                                                            } */}

                                                            {errors && errors.setField && <span className="error mt-2">{errors.coverImage}</span>}

                                                        </Form.Group>

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
                                                            {error && !data.description && < span className="error"> Description is required!</span>}
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
                                                            {error && !data.categoryId && < span className="error"> File Category is required!</span>}
                                                            {errors && errors.categoryId && <span className="error">{errors.categoryId}</span>}
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
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
                                                                {/* <Multiselect
                                                                   
                                                                    placeholder={"Select User Names"}
                                                                    displayValue="key"
                                                                    selectedValues={franchiseeList?.filter(d => parseInt(data?.franchise) === d.id)}
                                                                    className="multiselect-box default-arrow-select"
                                                                    onKeyPressFn={function noRefCheck() { }}
                                                                    onRemove={function noRefCheck(data) {
                                                                        setData((prevState) => ({
                                                                            ...prevState,
                                                                            franchise: [...data.map(data => data.id)],
                                                                        }));
                                                                    }}
                                                                    onSelect={function noRefCheck(data) {
                                                                        setData((prevState) => ({
                                                                            ...prevState,
                                                                            franchise: [...data.map((data) => data.id)],
                                                                        }));
                                                                    }}
                                                                    options={franchiseeList}
                                                                /> */}
                                                                <Multiselect
                                                                    disable={sendToAllFranchisee === 'all'}
                                                                    placeholder={"Select User Names"}
                                                                    displayValue="key"
                                                                    className="multiselect-box default-arrow-select"
                                                                    onRemove={function noRefCheck(data) {
                                                                        setFormSettings((prevState) => ({
                                                                            ...prevState,
                                                                            franchise: [...data.map(data => data.id)],
                                                                        }));
                                                                    }}
                                                                    selectedValues={franchiseeList && franchiseeList.filter(c => data.franchise?.includes(c.id + ""))}
                                                                    onSelect={(selectedOptions) => {
                                                                        setData((prevState) => ({
                                                                            ...prevState,
                                                                            franchise: [...selectedOptions.map(option => option.id + "")]
                                                                        }));
                                                                    }}
                                                                    options={franchiseeList}
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col lg={5} md={12}>
                                                        <Form.Group>
                                                            <Form.Label>Selected Child</Form.Label>
                                                            <div className="select-with-plus">
                                                                {/* <Multiselect
                                                                   
                                                                    placeholder={"Select User Names"}
                                                                    displayValue="key"
                                                                    selectedValues={franchiseeList?.filter(d => parseInt(data?.franchise) === d.id)}
                                                                    className="multiselect-box default-arrow-select"
                                                                    onKeyPressFn={function noRefCheck() { }}
                                                                    onRemove={function noRefCheck(data) {
                                                                        setData((prevState) => ({
                                                                            ...prevState,
                                                                            franchise: [...data.map(data => data.id)],
                                                                        }));
                                                                    }}
                                                                    onSelect={function noRefCheck(data) {
                                                                        setData((prevState) => ({
                                                                            ...prevState,
                                                                            franchise: [...data.map((data) => data.id)],
                                                                        }));
                                                                    }}
                                                                    options={franchiseeList}
                                                                /> */}
                                                                <Multiselect
                                                                    disable={sendToAllFranchisee === 'all'}
                                                                    placeholder={"Select User Names"}
                                                                    displayValue="key"
                                                                    className="multiselect-box default-arrow-select"
                                                                    onRemove={function noRefCheck(data) {
                                                                        setFormSettings((prevState) => ({
                                                                            ...prevState,
                                                                            franchise: [...data.map(data => data.id)],
                                                                        }));
                                                                    }}
                                                                    selectedValues={franchiseeList && franchiseeList.filter(c => data.franchise?.includes(c.id + ""))}
                                                                    onSelect={(selectedOptions) => {
                                                                        setData((prevState) => ({
                                                                            ...prevState,
                                                                            franchise: [...selectedOptions.map(option => option.id + "")]
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
                                                                            checked={data?.user_roles?.toString().includes('coordinator')}
                                                                            onChange={() => {
                                                                                if (data.user_roles?.includes("coordinator")) {
                                                                                    let Data = data.user_roles.filter(t => t !== "coordinator");
                                                                                    setData(prevState => ({
                                                                                        ...prevState,
                                                                                        user_roles: [...Data]
                                                                                    }));
                                                                                }

                                                                                if (!data.user_roles?.includes("coordinator"))
                                                                                    setData(prevState => ({
                                                                                        ...prevState,
                                                                                        user_roles: [...data.user_roles, "coordinator"]
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
                                                                            checked={data?.user_roles?.toString().includes('educator')}
                                                                            onChange={() => {
                                                                                if (data.user_roles?.includes("educator")) {
                                                                                    let Data = data.user_roles.filter(t => t !== "educator");
                                                                                    setData(prevState => ({
                                                                                        ...prevState,
                                                                                        user_roles: [...Data]
                                                                                    }));
                                                                                }

                                                                                if (!data.user_roles?.includes("educator"))
                                                                                    setData(prevState => ({
                                                                                        ...prevState,
                                                                                        user_roles: [...data.user_roles, "educator"]
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
                                                                            checked={data?.user_roles.includes('parent')}
                                                                            onChange={() => {
                                                                                if (data.user_roles?.includes("parent")) {
                                                                                    let Data = data.user_roles.filter(t => t !== "parent");
                                                                                    setData(prevState => ({
                                                                                        ...prevState,
                                                                                        user_roles: [...Data]
                                                                                    }));
                                                                                }
                                                                                if (!data.user_roles?.includes("parent"))
                                                                                    setData(prevState => ({
                                                                                        ...prevState,
                                                                                        user_roles: [...data.user_roles, "parent"]
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
                                                                            checked={data?.user_roles?.includes('parent' && 'educator' && 'coordinator')}
                                                                            onChange={() => {
                                                                                if (data.user_roles?.includes("coordinator")
                                                                                    && data.user_roles.includes("educator")
                                                                                    && data.user_roles.includes("parent")) {
                                                                                    setData(prevState => ({
                                                                                        ...prevState,
                                                                                        user_roles: [],
                                                                                    }));
                                                                                }
                                                                                if (!data.user_roles?.includes("coordinator")
                                                                                    && !data.user_roles.includes("educator")
                                                                                    && !data.user_roles.includes("parent")
                                                                                )
                                                                                    setData(prevState => ({
                                                                                        ...prevState,
                                                                                        user_roles: ["coordinator", "educator", "parent"]
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
                                                                </div>
                                                                <p className="error">{errors.franchisee}</p>
                                                            </Form.Group>
                                                        ) : null}
                                                    </Col>
                                                    <div className="d-flex justify-content-center my-5">
                                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                                            <Button variant="link btn btn-light btn-md m-2" style={{ backgroundColor: '#efefef' }} onClick={() => navigate(-1)}>Cancel</Button>
                                                            <Button type="submit" onClick={handleDataSubmit} > Save Details</Button>
                                                        </Form.Group>
                                                    </div>
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