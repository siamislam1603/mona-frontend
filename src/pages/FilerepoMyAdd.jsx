import React, { useState, useEffect } from 'react'
import { Button, Container, Dropdown, Form, Modal, Row, Col } from 'react-bootstrap';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import Multiselect from 'multiselect-react-dropdown';
import { Link, useParams } from 'react-router-dom';
import { BASE_URL } from '../components/App';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from "axios";
import paginationFactory from 'react-bootstrap-table2-paginator';
import VideoPopupfForFile from '../components/VideoPopupfForFile';
import FilerepoUploadFile from './FilerepoUploadFile';
import { FullLoader } from "../components/Loader";
import _ from 'lodash'
const getUser_Role = localStorage.getItem(`user_role`)
const getFranchisee = localStorage.getItem(`franchisee_id`)

let selectedUserId = '';

const FilerepoMyAdd = ({ filter }) => {
    let Params = useParams();
    const [showVideo, setVideo] = useState(false);
    const handleVideoClose = () => setVideo(false);
    const [formSettingData, setFormSettingData] = useState({
        shared_role: '',
        accessible_to_role: 1
    });
    const [userData, setUserData] = useState([]);
    const [fileDeleteMessage, SetfileDeleteMessage] = useState('');

    const [loaderFlag, setLoaderFlag] = useState(false);
    const [saveFileId, setSaveFileId] = useState(null);
    const [user, setUser] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [sendToAllFranchisee, setSendToAllFranchisee] = useState("none");
    const [franchiseeList, setFranchiseeList] = useState();
    const [shareType, setShareType] = useState("roles");
    const [applicableToAll, setApplicableToAll] = useState(false);
    const [selectedFranchisees, setSelectedFranchisee] = useState(null);
    const [fullLoaderStatus, setfullLoaderStatus] = useState(true);
    const [SearchValue, setSearchValue] = useState('');
    const [userCount, setUserCount] = useState(0)
    const [formSettings, setFormSettings] = useState({
        assigned_role: [],
        franchisee: [],
        assigned_users: [],
        assigned_childs: [],
        assigned_franchisee: [],
        shared_role: '',
        accessibleToRole: 1
    });
    const [child, setChild] = useState([]);
    const [selected_Franchisee, setselected_Franchisee] = useState('');
    const HandelSearch = (event) => {
        setSearchValue(event.target.value);
    }


    const GetEditCategory = async (id) => {
        let response = await axios.get(`${BASE_URL}/fileCategory/${Params.id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });
        if (response.status === 200) {
            const category = response.data.category
            setUpdateCategory({
                category_name: category.category_name,
                id: category.id
            })

        }

    }
    const [Updatecategory_name, setUpdateCategory] = useState({
        category_name: "",
        id: ""
    })


    useEffect(() => {
        GetEditCategory()
    }, [])
    useEffect(() => {
        const selected_Franchisee = localStorage.getItem("selected_Franchisee");
        setselected_Franchisee(selected_Franchisee)
  
    }, [])


    const SearchApi = async () => {
        try {
            let franchiseeId = selectedFranchisees === "All" || selectedFranchisees === "null" || selectedFranchisees === "undefined" ? "all" : selectedFranchisees;
            if (franchiseeId) {
                let response = await axios.get(`${BASE_URL}/fileRepo/filesDetails-createdBy-category/${Params.id}?franchiseAlias=${franchiseeId}&search=${SearchValue}`, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } })
                if (response.status === 200 && response.data.status === "success") {
                    const { files } = response.data;
               
                    let tempData = files.map((dt) => ({
                        name: `${dt.fileName},${dt.fileType},${dt.filesPath}`,
                        createdAt: dt.createdAt,
                        userID: dt.id,
                        creatorName: dt.creatorName + "," + dt.creatorRole,
                        categoryId: dt.categoryId,
                        Shaired: dt.repository_shares.length,
                        // Shaired: dt.repository.repository_shares[0].length,
                        filesId: dt.filesId,

                    }));
               
                    setUserData(tempData);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    const GetData = async () => {

        let response = await axios.get(`${BASE_URL}/fileRepo/fileInfo/${saveFileId}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        if (response) {
            setfullLoaderStatus(false)
        }
        if (response.status === 200 && response.data.status === "success") {
            const { file } = response.data;
            copyFetchedData(file);
        }
    }

    const copyFetchedData = (data) => {
        setFormSettings(prevState => ({
            ...prevState,
            id: data.id,
            createdAt: data?.createdAt,
            description: data?.description,
            title: data?.title,
            categoryId: data?.repository_files[0].categoryId,
            image: data?.repository_files[0].filesPath,
            franchisee: data?.repository_shares[0].franchisee,
            accessibleToRole: data?.repository_shares[0].accessibleToRole,
            accessibleToAll: data?.repository_shares[0].accessibleToAll,
            assigned_users: data?.repository_shares[0].assigned_users,
            assigned_role: data?.repository_shares[0].assigned_roles,
            assigned_childs: data?.repository_shares[0].assigned_childs,
            file_type: data?.repository_files[0].fileType,
        }));
        data?.repository_shares[0].franchisee.length == 0 ? setSendToAllFranchisee("all") : setSendToAllFranchisee("none")
        data?.repository_shares[0].assigned_users.length == 0 ? setUserCount(0) : setUserCount(data?.repository_shares[0].assigned_users.length)
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

    const handleFileSharing = async () => {
        let token = localStorage.getItem('token');
        setLoaderFlag(true);
        formSettings.franchisee = formSettings.franchisee.length == 0 ? [] : formSettings.franchisee
        const response = await axios.put(`${BASE_URL}/fileRepo/${saveFileId}`, {
            ...formSettings
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.status === 200 && response.data.status === "success") {
            setLoaderFlag(false);
            window.location.reload()
        } else {
            setLoaderFlag(false);
            window.location.reload()
        }
    }


    function onRemoveUser(selectedList, removedItem) {
        selectedUserId = selectedUserId.replace(
            removedItem.id + ',',
            ''
        );
        const index = user.findIndex((object) => {
            return object.id === removedItem.id;
        });
        user.splice(index, 1);
        setUserCount(userCount - 1)
    }

    function onRemoveChild(selectedList, removedItem) {
        selectedUserId = selectedUserId.replace(
            removedItem.id + ',',
            ''
        );
        const index = child.findIndex((object) => {
            return object.id === removedItem.id;
        });
        child.splice(index, 1);
    }


    const GetFile = async () => {
        try {
            let franchiseeId = selectedFranchisees === "All" || selectedFranchisees === "null" || selectedFranchisees === "undefined" ? "all" : selectedFranchisees;
            let selectedFranchisee = selected_Franchisee === "All" ? franchiseeId : selected_Franchisee;

            if (franchiseeId) {
                let response = await axios.get(`${BASE_URL}/fileRepo/filesDetails-createdBy-category/${Params.id}?franchiseAlias=${selectedFranchisee}`, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } })
            
                if (response.status === 200 && response.data.status === "success") {
                    const { files } = response.data;
                    let tempData = files.map((dt) => ({
                        name: `${dt.fileName},${dt.fileType},${dt.filesPath}`,
                        createdAt: dt.createdAt,
                        userID: dt.id,
                        creatorName: dt.creatorName + "," + dt.creatorRole,
                        categoryId: dt.categoryId,
                        Shaired: dt.repository_shares.length,
                        // Shaired: dt.repository.repository_shares[0].length,
                        filesId: dt.filesId,
                    }));
                    setUserData(tempData);
                    setfullLoaderStatus(false)
                }
            }
        } catch (err) {
            setfullLoaderStatus(false)
        }
    }

    const getUser = async () => {
        var myHeaders = new Headers();
        myHeaders.append(
            'authorization',
            'Bearer ' + localStorage.getItem('token')
        );
        var request = {
            headers: myHeaders,
        };

        let franchiseeArr = formSettings.franchisee.length == 0 ? "all" : formSettings.franchisee

        let response = await axios.post(`${BASE_URL}/auth/users/franchisee-list`, { franchisee_id: franchiseeArr }, request)
        if (response.status === 200) {
            let userList = response.data.users
            let formattedUserData = userList.map((d) => ({
                id: d.id,
                fullname: d.fullname,
                email: d.email,
                namemail: `(${d.fullname}) ${d.email}`,
            }));
            setUser(formattedUserData)
        }
    };


    const getChildren = async () => {
        let response = await axios.get(`${BASE_URL}/enrollment/listOfChildren?childId=${JSON.stringify(formSettings.assigned_users ? formSettings.assigned_users : [])}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        if (response.status === 200 && response.data.status === "success") {
            let extraArr = []
            let parents = response.data.parentData.map((item) => {
                return item.children
            })

            parents.forEach((item) => {
                extraArr = [...item, ...extraArr]
            })

            let uniqArr = _.uniqBy(extraArr, function (e) {
                return e.id;
            });

            setChild(uniqArr.map(data => ({
                id: data.id,
                name: data.fullname,
                key: `${data.fullname}`
            })));
        }
    }

    useEffect(() => {
        GetData()
        fetchFranchiseeList();
    }, [saveFileId])

    useEffect(() => {
        GetFile();
        getUser();
    }, [formSettings.franchisee, fileDeleteMessage]);

    useEffect(() => {
        getChildren();
    }, [userCount]);

    useEffect(() => {
        if (selectedFranchisees) {
            GetFile();
        }
    }, [selectedFranchisees]);

    useEffect(() => {
        SearchApi();
    }, [SearchValue])

    const handleTrainingDelete = async (cell) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`${BASE_URL}/fileRepo/${cell}`, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            if (response.status === 200) {
                SetfileDeleteMessage("Delete successfully")
                setTimeout(() => {
                    SetfileDeleteMessage(null)
                }, 3000)
                GetFile();
            }
        } catch (err) {
            SetfileDeleteMessage("You don't have permission to delete this file !");
            setTimeout(() => {
                SetfileDeleteMessage(null)
            }, 3000)
        }
    }

    const isAllRolesChecked = () => {
        let bool = false;
        if (getUser_Role == "franchisor_admin") {
            bool = formSettings.assigned_role.length === 4 && formSettings.assigned_role.includes('franchisee_admin')
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

    const defaultSortedBy = [{
        dataField: "name",
        order: "asc"  // or desc
    }];

    const [columns, setColumns] = useState([
        {
            dataField: 'name',
            text: 'Name',
            sort: true,
            formatter: (cell) => {
                cell = cell.split(',');
                var ret = cell[1].replace('application/', '')
                var Text = cell[1].replace('text/', '')
                var image = cell[1].replace('image/', '')
                var tet2 = ""
                if (ret === 'text/html' || ret === 'text/xml') {
                    tet2 = Text
                }
                else {
                    tet2 = ret
                }
                return (
                    <>
                        <div div className="user-list">
                            {cell[1] === "image/jpeg" || cell[1] === "image/png" || cell[1] === "image/webp" ?
                                <>
                                    <span className="user-pic-tow">
                                        <a href={cell[2]} download>
                                            <img src="../img/abstract-ico.png" className="me-2" alt="" />
                                        </a>
                                    </span>
                                    <span className="user-name">
                                        {cell[0]}.{image}
                                    </span>
                                </>
                                :
                                cell[1] === "audio/mpeg" ?
                                    <>
                                        <span className="user-pic-tow">
                                            <a href={cell[2]} download>
                                                <img src="../img/audio-ico.png" className="me-2" alt="" />
                                            </a>
                                        </span>
                                        <span className="user-name">
                                            {cell[0]}.mp3
                                        </span>
                                    </>

                                    : cell[1] === "video/mp4" ?
                                        <>
                                            <div style={{ width: "100%", display: "flex" }}>
                                                <VideoPopupfForFile
                                                    data={cell[2]}
                                                    title={cell[1]}
                                                    name={cell[0]}
                                                    // duration={cell[0]}
                                                    fun={handleVideoClose}
                                                />
                                            </div>
                                        </> :
                                        <>
                                            <span className="user-pic-tow">
                                                <a href={cell[2]} target='_blank' rel='noopener noreferrer'>
                                                    <img src="../img/abstract-ico.png" className="me-2" alt="" />
                                                </a>
                                            </span>
                                            <span className="user-name">
                                                {cell[0]}.{tet2}
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
                                <small>
                                    {
                                        cell[1] === "franchisor_admin" ? "Franchisor Admin" :
                                            cell[1] === "franchisee_admin" ? "Franchisee Admin" :
                                                cell[1] === "guardian" ? "Guardian" :
                                                    cell[1] === "educator" ? "Educator" :
                                                        cell[1] === "coordinator" ? "Coordinator" :
                                                            cell[1]
                                    }
                                </small>
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

                                    Access Given
                                    {/* Access Not Given */}

                                </span> :
                                <span className="user-name">
                                    <img src="../img/NoShore.png" className="me-2" alt="" />
                                    {/* Not Shared */}
                                    Access Not Given
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
                                    <Dropdown.Item href={`/file-repository-Edit/${cell}`}>Edit</Dropdown.Item>
                                    {getUser_Role === "guardian" ? (<></>) : (<>
                                        <Dropdown.Item href="#" onClick={() => {
                                            setSaveFileId(cell);
                                            setShowModal(true)
                                        }}>Share</Dropdown.Item>
                                    </>)}
                                    <Dropdown.Item onClick={() => {
                                        if (window.confirm("Are you sure you want to delete ?"))
                                            handleTrainingDelete(cell)
                                    }}>Delete</Dropdown.Item>
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
                {
                    fileDeleteMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{fileDeleteMessage}</p>
                }
                <section className="mainsection">
                    <Container>
                        <div className="admin-wrapper">
                            <aside className="app-sidebar">
                                <LeftNavbar />
                            </aside>
                            <div className="sec-column">
                                <TopHeader
                                    setSelectedFranchisee={setSelectedFranchisee}
                                />
                                <FullLoader loading={fullLoaderStatus} />
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
                                                    <h1 className="title-lg"><Link to="/file-repository"><img src="../../img/back-arrow.svg" alt="" /></Link> File Repository</h1>
                                                    <header className="title-head">
                                                        <div className="user-list">
                                                            <span>
                                                                <img src="../img/gfolder-ico.png" className="me-2" alt="" />
                                                            </span>
                                                            <span className="user-name">
                                                                {Updatecategory_name.category_name}
                                                                <small>
                                                                    {userData?.length > 1 ? (<>
                                                                        {userData?.length} Files
                                                                    </>) : (<>
                                                                        {userData?.length} File
                                                                    </>)}
                                                                </small>

                                                            </span>
                                                        </div>
                                                        <div className="othpanel">
                                                            <div className="extra-btn">
                                                                <div className="data-search me-3">
                                                                    <label for="search-bar" className="search-label">
                                                                        <input
                                                                            id="search-bar"
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Search"
                                                                            value={SearchValue}
                                                                            onChange={HandelSearch} />
                                                                    </label>
                                                                </div>
                                                                <FilerepoUploadFile />
                                                            </div>
                                                        </div>
                                                    </header>
                                                    {userData.length > 0 ?
                                                        <BootstrapTable
                                                            {...props.baseProps}
                                                            defaultSorted={defaultSortedBy}
                                                            pagination={paginationFactory()}
                                                        /> : (!fullLoaderStatus && <>
                                                            <div className="text-center mb-5 mt-5"><strong>Your file either deleted or not available.</strong></div>
                                                        </>
                                                        )
                                                    }

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
                            <img src="../../img/carbon_settings.svg" alt="" />
                            Share File
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-settings-content">
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
                                                                franchisee: []
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
                                                    {/* <input
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
                                                    /> */}
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
                                                placeholder={"Select User Names"}
                                                // singleSelect={true}
                                                displayValue="key"
                                                className="multiselect-box default-arrow-select"
                                                selectedValues={franchiseeList && franchiseeList.filter(d => formSettings?.franchisee?.includes(d.id.toString())).length == 0 ? franchiseeList?.filter(d => getFranchisee.includes(d.id.toString())) : franchiseeList?.filter(d => formSettings?.franchisee.includes(d.id.toString()))}
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
                            </Row>)}

                            {sendToAllFranchisee == "none" && formSettings?.franchisee.length < 1 ? "" :
                                (<Row className="mt-4">
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
                                                            name="accessibleToRole"
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
                                                            name="accessibleToRole"
                                                            value={0}
                                                            checked={formSettings.accessibleToRole === 0}
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
                                                                            assigned_role: [...data],
                                                                            accessibleToRole: 1
                                                                        }));
                                                                    }

                                                                    if (!formSettings.assigned_role.includes("franchisee_admin"))
                                                                        setFormSettings(prevState => ({
                                                                            ...prevState,
                                                                            assigned_role: [...formSettings.assigned_role, "franchisee_admin"],
                                                                            accessibleToRole: 1
                                                                        }))
                                                                }} />
                                                        </Form.Group>) : null}

                                                        {['franchisor_admin', 'franchisee_admin'].includes(getUser_Role) ? (<Form.Group className="mb-3 form-group" controlId="formBasicCheckbox0">
                                                            <Form.Check
                                                                type="checkbox"
                                                                checked={formSettings.assigned_role.includes("coordinator")}
                                                                label="Coordinator"
                                                                onChange={() => {
                                                                    if (formSettings.assigned_role.includes("coordinator")) {
                                                                        let data = formSettings.assigned_role.filter(t => t !== "coordinator");
                                                                        setFormSettings(prevState => ({
                                                                            ...prevState,
                                                                            assigned_role: [...data],
                                                                            accessibleToRole: 1
                                                                        }));
                                                                    }

                                                                    if (!formSettings.assigned_role.includes("coordinator"))
                                                                        setFormSettings(prevState => ({
                                                                            ...prevState,
                                                                            assigned_role: [...formSettings.assigned_role, "coordinator"],
                                                                            accessibleToRole: 1
                                                                        }))
                                                                }} />
                                                        </Form.Group>) : null}

                                                        {['franchisor_admin', 'franchisee_admin', 'coordinator'].includes(getUser_Role) ? (<Form.Group className="mb-3 form-group" controlId="formBasicCheckbox1">
                                                            <Form.Check
                                                                type="checkbox"
                                                                label="Educator"
                                                                checked={formSettings.assigned_role.includes("educator")}
                                                                onChange={() => {
                                                                    if (formSettings.assigned_role.includes("educator")) {
                                                                        let data = formSettings.assigned_role.filter(t => t !== "educator");
                                                                        setFormSettings(prevState => ({
                                                                            ...prevState,
                                                                            assigned_role: [...data],
                                                                            accessibleToRole: 1
                                                                        }));
                                                                    }

                                                                    if (!formSettings.assigned_role.includes("educator"))
                                                                        setFormSettings(prevState => ({
                                                                            ...prevState,
                                                                            assigned_role: [...formSettings.assigned_role, "educator"],
                                                                            accessibleToRole: 1
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
                                                                            assigned_role: [...data],
                                                                            accessibleToRole: 1
                                                                        }));
                                                                    }

                                                                    if (!formSettings.assigned_role.includes("guardian"))
                                                                        setFormSettings(prevState => ({
                                                                            ...prevState,
                                                                            assigned_role: [...formSettings.assigned_role, "guardian"],
                                                                            accessibleToRole: 1
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
                                                                        else {
                                                                            setFormSettings(prevState => ({
                                                                                ...prevState,
                                                                                assigned_role: ["coordinator", "educator", "guardian", "franchisee_admin"],
                                                                                accessibleToRole: 1
                                                                            }))
                                                                        }

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

                                                                        else {
                                                                            setFormSettings(prevState => ({
                                                                                ...prevState,
                                                                                assigned_role: ["coordinator", "educator", "guardian"],
                                                                                accessibleToRole: 1
                                                                            })
                                                                            )
                                                                        }
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

                                                                        else {
                                                                            setFormSettings(prevState => ({
                                                                                ...prevState,
                                                                                assigned_role: ["educator", "guardian"],
                                                                                accessibleToRole: 1
                                                                            })
                                                                            )
                                                                        }
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
                                                                displayValue="namemail"
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
                                                                        assigned_users: [...selectedOptions.map(option => option.id + "")],
                                                                        accessibleToRole: 0
                                                                    }))
                                                                    setUserCount(userCount + 1)
                                                                }}
                                                                options={user}
                                                            />
                                                        </div>
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <Form.Label>Select Child</Form.Label>
                                                        <div className="select-with-plus">
                                                            <Multiselect
                                                                displayValue="name"
                                                                className="multiselect-box default-arrow-select"
                                                                // placeholder="Select Franchisee"
                                                                selectedValues={child && child.filter(c => formSettings.assigned_childs?.includes(c.id + ""))}
                                                                value={child && child.filter(c => formSettings.assigned_childs?.includes(c.id + ""))}
                                                                // onKeyPressFn={function noRefCheck() {}}
                                                                onRemove={onRemoveChild}
                                                                // onSearch={function noRefCheck() {}}
                                                                onSelect={(selectedOptions) => {
                                                                    setFormSettings((prevState) => ({
                                                                        ...prevState,
                                                                        assigned_childs: [...selectedOptions.map(option => option.id + "")],
                                                                        accessibleToRole: 0
                                                                    }))
                                                                }}
                                                                options={child}
                                                            />
                                                        </div>
                                                    </Form.Group>
                                                </>) : null
                                        }
                                    </Col>
                                </Row>)

                            }


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
