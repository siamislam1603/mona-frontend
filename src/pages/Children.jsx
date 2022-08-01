import React, { useEffect, useState } from 'react';
import { Button, Container, Dropdown, } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import { BASE_URL } from '../components/App';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import EducatorAssignPopup from '../components/EducatorAssignPopup';
import CoparentAssignPopup from '../components/CoparentAssignPopup';
let DeleteId = [];
const Children = () => {
    useEffect(()=>{
        init()                         
    },[])

    // Modal start
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // Modal ENd

 // Modal start
    const [cpShow, setCpShow] = useState(false);
    const handleCpClose = () => setCpShow(false);
    const handleCpShow = () => setCpShow(true);
    // Modal ENd

    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [userData, setUserData] = useState([]);
    const [selectedFranchisee, setSelectedFranchisee] = useState(localStorage.getItem('selectedFranchisee'));
    const [deleteResponse, setDeleteResponse] = useState(null);
    const [childrenList, setChildrenList] = useState([]);
    const [franchiseId, setFranchiseId] = useState(null);
    const [selectedEducatorIds, setSelectedEducatorIds] = useState([]);
    const [selectedEducators,setSelectedEducators] = useState([]);
    const [educators, setEducators] = useState([]); 
    const [parents, setParents] = useState([]);
    
    const init = async() => {
        // Set Parents Franchisee
        const franchiseeId = location?.state?.franchisee_id || localStorage.getItem('franchisee_id');
          setFranchiseId(franchiseeId);
        
        // Children List
        let response = await axios.get(`${BASE_URL}/enrollment/children/${params.id}`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (response.status === 200) {
            const { parentData } = response.data;
            console.log(parentData,"users")
            setChildrenList(parentData.children)
          }
          
        //   Educators list
        let eduResponse =await  axios.get(`${BASE_URL}/role/franchisee/coordinator/franchiseeID/${franchiseeId}/educator`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (eduResponse.status === 200) {
            const {coordinators} = eduResponse.data;
            console.log(coordinators,"coordinatorrr")
            setEducators(coordinators)
          }

        //   Parents list
        let CpResponse =await  axios.get(`${BASE_URL}/role/franchisee/coordinator/franchiseeID/${franchiseeId}/guardian`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (CpResponse.status === 200) {
            const {coordinators} = CpResponse.data;
            console.log(coordinators,"coordinatorrr")
            setParents(coordinators)
          }
    }
    
    const rowEvents = {
        onClick: (e, row, rowIndex) => {
            if (e.target.text === 'Delete') {

                async function deleteUserFromDB() {

                    const response = await axios.patch(
                        `${BASE_URL}/auth/user/delete/${row.userID}`,
                        {
                            is_deleted: 1,
                        }, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                    );
                    if (response.status === 200 && response.data.status === "success")
                        setDeleteResponse(response);
                }

                if (window.confirm('Are you sure you want to delete?')) {

                    deleteUserFromDB();

                }
            }
            if (e.target.text === "Edit") {
                navigate(`/edit-user/${row.userID}`);
            }
            if (e.target.text === 'Add Educator'){
                handleShow()
            }
            if (e.target.text === 'Add Co-Parent'){
                handleCpShow()
            }
        },
    };
    const selectRow = {
        mode: 'checkbox',
        onSelect: (row, isSelect, rowIndex, e) => {
            // if (DeleteId.includes(row.userID)) {
            //     let Index;
            //     DeleteId.map((item, index) => {
            //         if (item === row.userID) {
            //             Index = index;
            //         }
            //     })
            //     DeleteId.splice(Index, 1);
            // }
            // else {
            //     DeleteId.push(row.userID);
            // }

            console.log("hello")
        },
        onSelectAll: (isSelect, rows, e) => {
            console.log("helo")
            if (isSelect) {
                userData.map((item) => {
                    DeleteId.push(item.userID);
                });
            }
            else {
                DeleteId = [];
            }
        }
    };
    const products = educators.map((educator)=>({
        id: educator.id,
        name: educator.fullname + "," + (educator.profile_photo ? educator.profile_photo : "../img/user.png"),
        Location: educator.city
    }))

    const productsTow = childrenList?.map((child)=>({
        id: child.id,
        name: child.fullname,
        Location : child.home_address,
        Educator: child.users
    }))

    const   PColumns = [
        {
            dataField: 'name',
            text: 'Name'
        },
        {
            dataField: 'Educator',
            text: 'Educator',
            formatter: (cell) => {
                console.log(cell,"celll")
                return (
                    <>
                        {cell.length == 0 ?
                            <div className="user-list">
                                <Button variant="outline-primary" onClick={handleShow} style={{ backgroundColor: "#3e5d58", color: "white" }}>
                                    Add Educator
                                </Button>
                            </div> :
                            (cell || []).map((item)=>{
                               return (
                                <div>
                                    <div className="user-list mt-3">
                                        <span className="user-pic">
                                            <img src={item.profile_photo ? item.profile_photo : "../img/user.png" } alt='' />
                                        </span>
                                        <span className="user-name">
                                            {item.fullname}
                                        </span>
                                    </div>
                                </div>
                                )
                            })
                            
                        }
                    </>
                );
            },
        },
        {
            dataField: 'Location',
            text: 'Location',

        },
        {
            dataField: 'number',
            text: '',
            formatter: (cell) => {
                return (
                    <>
                        <div className="cta-col">
                            <button className="Enrolment_Button btn btn-outline-secondary" style={{"fontSize":"0.8rem","fontWeight":"8  00"}}>
                                View Enrolment
                            </button>
                        </div>
                    </>
                );
            },
        },
        {
            dataField: 'action',
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
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                                    <Dropdown.Item href="#">Edit</Dropdown.Item>
                                    <Dropdown.Item href="#">Add Educator</Dropdown.Item>
                                    <Dropdown.Item href="#">Add Co-Parent</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </>
                );
            },
        },
    ];
    const PopColumns = [
        {
            dataField: 'name',
            text: 'Name',
            formatter: (cell) => {
                cell = cell.split(",");
                return (<><div className="user-list"><span className="user-pic"><img src={cell[1]} alt='' /></span><span className="user-name">{cell[0]}</span></div></>)
            },
        },
        {
            dataField: 'Location',
            text: 'Location',

        }
    ];

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
                                <TopHeader
                                    setSelectedFranchisee={setSelectedFranchisee}
                                />
                                <div className="entry-container">
                                    <div className="user-management-sec">
                                        <header className="title-head"
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}>
                                            <h1 className="title-lg">
                                                <Link to="/user-management"> </Link>
                                                Children
                                            </h1>

                                            {
                                                localStorage.getItem('user_role') !== "guardian" &&
                                                <Link 
                                                    to={`/child-enrollment-init/${params.id}`}
                                                    style={{
                                                        backgroundColor: "#455C58",
                                                        color: "#fff",
                                                        padding: ".9rem 2.3rem",
                                                        fontWeight: 500,
                                                        borderRadius: "5px"
                                                    }}>
                                                    Add Child
                                                </Link>
                                            }
                                        </header>
                                        <BootstrapTable
                                            keyField="id"
                                            rowEvents={rowEvents}
                                            selectRow={selectRow}
                                            data={productsTow}
                                            columns={PColumns}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>
            </div>
            {/* <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Educator</Modal.Title>
                    <Button variant="outline-secondary" onClick={handleClose} style={{ position: 'absolute', right: '80px' }}>
                        Add New
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <div className="data-search me-3">
                        <label for="search-bar" className="search-label">
                            <input
                                id="search-bar"
                                type="text"
                                className="form-control"
                                placeholder="Search"
                            // value={search}
                            // onChange={(e) => {
                            //     setSearch(e.target.value);
                            // }}

                            />
                        </label>
                    </div>
                    <div className="column-table user-management-sec user_management_sec">
                        <BootstrapTable
                            keyField="name"
                            rowEvents={rowEvents}
                            selectRow={selectRow}
                            data={products}
                            columns={PopColumns}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer className="justify-content-md-center">
                    <Button variant="transparent" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal > */}
            {show ? <EducatorAssignPopup educators={educators} handleClose={()=>handleClose()} show={show}/> : ""}
            {cpShow ? <CoparentAssignPopup parents={parents} handleClose={()=>handleCpClose()} show={cpShow}/> : ""}
        </>
    );
};

export default Children;
