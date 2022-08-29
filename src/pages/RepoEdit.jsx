import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Form } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import makeAnimated from 'react-select/animated';
import Multiselect from 'multiselect-react-dropdown';
import { BASE_URL } from '../components/App';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import DragDropFileEdit from '../components/DragDropFileEdit';
import FileRepoVideo from '../components/FileRepoVideo';



const animatedComponents = makeAnimated();

const getUser_Role = localStorage.getItem(`user_role`)

let selectedUserId = '';
const RepoEdit = () => {
    const [url, setUrl] = React.useState('');
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
    const [selectedChild, setSelectedChild] = useState([])
    const [child, setChild] = useState([]);
    const [loaderFlag, setLoaderFlag] = useState(false);
    const [formSettings, setFormSettings] = useState({
        assigned_role: [],
        franchisee: [],
        assigned_users: []

    });

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
    console.log(data, "fileTypefileType")
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
            assigned_childs: data?.repository_shares[0].assigned_childs,
            file_type: data?.repository_files[0].fileType,
        }));
        setCoverImage(data?.repository_files[0].filesPath);
    }
    const onChange = (e) => {
        const files = data.image;
        files.length > 0 && setUrl(files);
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
    const handleDataSubmit = async (event) => {
        event.preventDefault();
        setLoaderFlag(true);
        console.log('DATA:', data);
        if (!data.image || !data.description|| data.description == "" || !data.categoryId) {
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
        setLoaderFlag(true);
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
                    navigate(`/file-repository-List-me/${data.categoryId}`);
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
                    setLoaderFlag(false);
                    console.log('DATA UPDATED SUCCESSFULLT => type: object');
                    navigate(`/file-repository-List-me/${data.categoryId}`);
                }
            }
            setLoaderFlag(false);
            console.log('DATA UPDATED SUCCESSFULLT');
            navigate(`/file-repository-List-me/${data.categoryId}`);
        } else {
            setLoaderFlag(false);
        }
    }

    const childList = async () => {
        const token = localStorage.getItem('token');
        console.log("data frnahise", data.franchise)
        const response = await axios.post(`${BASE_URL}/enrollment/franchisee/child/`, {
            franchisee_id: data.franchise
        },
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
        console.log("CHIlD DATA after franhisee", response)
        if (response.status === 200 && response.data.status === "success") {
            setChild(response.data.children.map(data => ({
                id: data.id,
                name: data.fullname,
                key: `${data.fullname}`
            })));
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
            console.log(categoryList,"category Listtt")
            setCategory([
                ...categoryList.map((data) => ({
                    id: data.id,
                    value: data.category_name,
                    label: data.category_name,
                })),
            ]);
        }
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

        let franchiseeArr = data.franchise

        let response = await axios.post(`${BASE_URL}/auth/users/franchisees`, { franchisee_id: franchiseeArr }, request)
        if (response.status === 200) {
            // console.log(response.data.users, "respo")
            setUser(response.data.users)
            console.log(user, "userSList")
        }
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

    function onRemoveChild(removedItem) {
        let removedchildarr = removedItem
        removedItem = removedItem.map((item) => {
            return item.id
        })
        setData(prevState => ({
            ...prevState,
            assigned_childs: removedItem
        }));
        console.log(selectedChild, "Selllee")
        setSelectedChild(removedchildarr)
    }

    const isAllRolesChecked = () => {
        let bool = false;
        if(getUser_Role == "franchisor_admin"){
          bool = ["guardian","educator","coordinator","franchisee_admin"].every(item => data?.shared_role?.includes(item))
        }
        else if(getUser_Role == "franchisee_admin"){
          bool = ["guardian","educator","coordinator"].every(item => data?.shared_role?.includes(item))
        }
        else if(getUser_Role == "coordinator"){
          bool = ["guardian","educator"].every(item => data?.shared_role?.includes(item))
        }
        else if(getUser_Role == "educator"){
          bool = ["guardian"].every(item => data?.shared_role?.includes(item))
        }
    
        return bool;
      }

    useEffect(() => {
        GetData();
        getFileCategory();
        getUser();
        fetchFranchiseeList();
        // childList()
    }, []);

    useEffect(() => {
        childList()
        getUser();
    }, [data.franchise])

    data && console.log('FILE REPO DATA:', data.franchise);
    data && console.log('FILE REPO DATA:', data);
    data && console.log('TYPE OF IMAGE DATA:', typeof data.image);
    console.log("Selected child", selectedChild)


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
                                                        <Form.Group>
                                                            <DragDropFileEdit onChange={setField} />
                                                            <div className="showfiles mt-3 text-center" >
                                                                {typeof data.image === "string" ?
                                                                    (<>
                                                                        {data.file_type === "image/jpeg" || data.file_type === "image/png" || data.file_type === "image/jpe" ? (< img src={data.image} alt="smkdjh" style={{ maxWidth: "150px", height: "auto", borderRadius: "10px" }} />) :
                                                                            data.file_type === "application/pdf" || data.file_type === "text/html" || data.file_type === "text/pdf" || data.file_type === "text/csv" || data.file_type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || data.file_type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? (<>
                                                                                <span className="user-pic-tow">
                                                                                    <a href={data.image} download >
                                                                                        <img src="../img/abstract-ico.png" className="me-2" alt="" />
                                                                                    </a>
                                                                                </span>
                                                                                <span className="user-name">
                                                                                    {data.image}.Doc
                                                                                </span>
                                                                            </>) :
                                                                                data.file_type === "video/mp4" ? (
                                                                                    <>
                                                                                        <div style={{ display: "inline-table" }}>
                                                                                            <FileRepoVideo
                                                                                                data={data.image}
                                                                                            />
                                                                                        </div>
                                                                                    </>
                                                                                ) : (<></>)}
                                                                    </>
                                                                    )
                                                                    : (<></>)}
                                                            </div>
                                                            {error && !data.image && < span className="error"> File is required!</span>}
                                                            <p className="error">{errors.setting_files}</p>

                                                            {errors && errors.setField && <span className="error mt-2">{errors.coverImage}</span>}
                                                        </Form.Group>
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
                                                            <Form.Label>File Category*</Form.Label>
                                                            {getUser_Role === "guardian" ? (
                                                                <>
                                                                    <Form.Select
                                                                        name="file_category"
                                                                        onChange={(e) => {
                                                                            setField(e.target.name, e.target.value);
                                                                        }}
                                                                        value={data?.categoryId}
                                                                    >
                                                                        <option value="">Select File Category</option>
                                                                        <option value="8">General</option>
                                                                    </Form.Select>
                                                                </>) : (
                                                                <>
                                                                    <Form.Select
                                                                        name="file_category"
                                                                        onChange={(e) => {
                                                                            setField(e.target.name, e.target.value);
                                                                        }}
                                                                        value={data?.categoryId}
                                                                    >
                                                                        <option value="">Select File Category</option>
                                                                        {category?.map((item) => {
                                                                            return (
                                                                                <option value={item.id}>{item.value}</option>
                                                                            );
                                                                        })}
                                                                    </Form.Select>
                                                                </>)}

                                                            {error && !data.categoryId && < span className="error"> File Category is required!</span>}
                                                            {errors && errors.categoryId && <span className="error">{errors.categoryId}</span>}
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                {getUser_Role === "guardian" ? (<></>) :
                                                    (<>
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
                                                                                            assigned_franchisee: []
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
                                                                            placeholder={"Select Franchisee"}
                                                                            displayValue="key"
                                                                            className="multiselect-box default-arrow-select"
                                                                            onRemove={function noRefCheck(data) {
                                                                                setData((prevState) => ({
                                                                                    ...prevState,
                                                                                    franchise: [...data.map(data => data.id)],
                                                                                    assigned_childs: [],
                                                                                    assigned_users: []
                                                                                }));
                                                                            }}
                                                                            selectedValues={franchiseeList && franchiseeList.filter(c => data.franchise?.includes(c.id + ""))}
                                                                            onSelect={(selectedOptions) => {
                                                                                setData((prevState) => ({
                                                                                    ...prevState,
                                                                                    franchise: [...selectedOptions.map(option => option.id + "")],
                                                                                    assigned_childs: [],
                                                                                    assigned_users: []
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
                                                                        {['franchisor_admin'].includes(getUser_Role) ? (<label className="container">
                                                                                Franchisee Admin
                                                                                <input
                                                                                    type="checkbox"
                                                                                    name="shared_role"
                                                                                    id="franchisee_admin"
                                                                                    checked={data?.user_roles?.toString().includes('franchisee_admin')}
                                                                                    onChange={() => {
                                                                                        if (data.user_roles?.includes("franchisee_admin")) {
                                                                                            let Data = data.user_roles.filter(t => t !== "franchisee_admin");
                                                                                            setData(prevState => ({
                                                                                                ...prevState,
                                                                                                user_roles: [...Data]
                                                                                            }));
                                                                                        }
                                                                                        if (!data.user_roles?.includes("franchisee_admin"))
                                                                                            setData(prevState => ({
                                                                                                ...prevState,
                                                                                                user_roles: [...data.user_roles, "franchisee_admin"]
                                                                                            }))
                                                                                    }}
                                                                                />
                                                                                <span className="checkmark"></span>
                                                                            </label>) : null}
                                                                            {['franchisor_admin','franchisee_admin'].includes(getUser_Role) ? (<label className="container">
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
                                                                            </label>) : null}
                                                                            {['franchisor_admin','franchisee_admin', 'coordinator'].includes(getUser_Role) ? ( <label className="container">
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
                                                                            </label>) : null}
                                                                            {!['guardian'].includes(getUser_Role) ? (<label className="container">
                                                                                Guardian
                                                                                <input
                                                                                    type="checkbox"
                                                                                    name="shared_role"
                                                                                    id="guardian"
                                                                                    checked={data?.user_roles.includes('guardian')}
                                                                                    onChange={() => {
                                                                                        if (data.user_roles?.includes("guardian")) {
                                                                                            let Data = data.user_roles.filter(t => t !== "guardian");
                                                                                            setData(prevState => ({
                                                                                                ...prevState,
                                                                                                user_roles: [...Data]
                                                                                            }));
                                                                                        }
                                                                                        if (!data.user_roles?.includes("guardian"))
                                                                                            setData(prevState => ({
                                                                                                ...prevState,
                                                                                                user_roles: [...data.user_roles, "guardian"]
                                                                                            }))
                                                                                    }}
                                                                                />
                                                                                <span className="checkmark"></span>
                                                                            </label>) : null}
                                                                            {!['educator','guardian'].includes(getUser_Role) ? (<label className="container">
                                                                                All Roles
                                                                                <input
                                                                                    type="checkbox"
                                                                                    name="shared_role"
                                                                                    id="all_roles"
                                                                                    checked={isAllRolesChecked()}
                                                                                    onChange={() => {
                                                                                        if (data.user_roles?.includes("coordinator")
                                                                                            && data.user_roles.includes("educator")
                                                                                            && data.user_roles.includes("guardian")) {
                                                                                            setData(prevState => ({
                                                                                                ...prevState,
                                                                                                user_roles: [],
                                                                                            }));
                                                                                        }
                                                                                        if (!data.user_roles?.includes("coordinator")
                                                                                            && !data.user_roles.includes("educator")
                                                                                            && !data.user_roles.includes("guardian")
                                                                                        )
                                                                                            setData(prevState => ({
                                                                                                ...prevState,
                                                                                                user_roles: ["coordinator", "educator", "guardian"]
                                                                                            })
                                                                                            )
                                                                                    }} />
                                                                                <span className="checkmark"></span>
                                                                            </label>) : null}
                                                                        </div>
                                                                    </Form.Group>
                                                                ) : null}
                                                                {data.accessibleToRole === 0 ? (
                                                                    <>
                                                                        <Form.Group>
                                                                            <Form.Label>Select User</Form.Label>
                                                                            <div className="select-with-plus">
                                                                                <Multiselect
                                                                                    disable={sendToAllFranchisee === 'all'}
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
                                                                        <Form.Group>
                                                                            <Form.Label>Select Child</Form.Label>
                                                                            <div className="select-with-plus">
                                                                                <Multiselect
                                                                                    disable={sendToAllFranchisee === 'all'}
                                                                                    placeholder={"Select child"}
                                                                                    displayValue="name"
                                                                                    className="multiselect-box default-arrow-select"
                                                                                    onRemove={onRemoveChild}
                                                                                    selectedValues={child && child.filter(c => data.assigned_childs?.includes(c.id + ""))}
                                                                                    value={child && child.filter(c => data.assigned_childs?.includes(c.id + ""))}
                                                                                    onSelect={(selectedOptions) => {
                                                                                        setData((prevState) => ({
                                                                                            ...prevState,
                                                                                            assigned_childs: [...selectedOptions.map(option => option.id + "")]
                                                                                        }));
                                                                                    }}
                                                                                    options={child}
                                                                                />
                                                                            </div>
                                                                        </Form.Group>
                                                                    </>
                                                                ) : null}
                                                            </Col>
                                                        </Row>
                                                    </>)}
                                                <Row>
                                                    <div className="d-flex justify-content-center my-5">
                                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                                            <Button variant="link btn btn-light btn-md m-2" style={{ backgroundColor: '#efefef' }} onClick={() => navigate(-1)}>Cancel</Button>
                                                            <Button type="submit" onClick={handleDataSubmit} >
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
                                                                    'Save Details'
                                                                )}


                                                            </Button>
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