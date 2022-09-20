import React, { useEffect, useState } from 'react';
import { Button, Container, Dropdown, } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import { useParmas } from 'react-router-dom';
import { BASE_URL } from '../components/App';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import EducatorAssignPopup from '../components/EducatorAssignPopup';
import CoparentAssignPopup from '../components/CoparentAssignPopup';
let DeleteId = [];

const Children = () => {

    const { id: paramsParentId } = useParams();
    useEffect(()=>{
        init()
        // console.log("aa gye hum")                         
    },[]);

    // Modal start
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (id, educators) =>{
        let defEducators = educators.map((edu) => {
            return edu.id 
        })
        localStorage.setItem("SelectedChild",id)
        localStorage.setItem("DefaultEducators",JSON.stringify(defEducators))
        setShow(true)
    };
    // Modal ENd

 // Modal start
    const [cpShow, setCpShow] = useState(false);
    const handleCpClose = () => setCpShow(false);
    const handleCpShow = async (id) =>{
        localStorage.setItem("SelectedChild", id)
        await fetchParents(id)
        setCpShow(true)
    };
    // Modal ENd

    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [parentFullname, setParentFullname] = useState(null);
    const [userData, setUserData] = useState([]);
    const [selectedFranchisee, setSelectedFranchisee] = useState(localStorage.getItem('selectedFranchisee'));
    const [deleteResponse, setDeleteResponse] = useState(null);
    const [childrenList, setChildrenList] = useState([]);
    const [franchiseId, setFranchiseId] = useState(null);
    const [selectedEducatorIds, setSelectedEducatorIds] = useState([]);
    const [selectedEducators,setSelectedEducators] = useState([]);
    const [educators, setEducators] = useState([]); 
    const [parents, setParents] = useState([]);
    const [childFranchise, setChildFranchise] = useState(null);
    const [enroledChildId, setEnroledChildId] = useState(null);
    const [reloadFlag, setReloadFlag] = useState(false);
    const [topSuccessMessage, setTopSuccessMessage] = useState(null);

    const init = async() => {
        // Set Parents Franchisee
        const franchiseeId = location?.state?.franchisee_id || localStorage.getItem('franchisee_id');
          setFranchiseId(franchiseeId);
        
        // FETCHING PARENT DATA
        const fetchParentData = async () => {
            const response = await axios.get(`${BASE_URL}/auth/user/${params.parentId}`);

            if(response.status === 200 && response.data.status === "success") {
                let { user } = response.data;
                let { fullname } = user;  
                console.log('PARENT FULL NAME:', fullname);
                setParentFullname(fullname);
            }
        }

        // Children List
        let response = await axios.get(`${BASE_URL}/enrollment/children/${params.id}`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (response.status === 200) {
            const { parentData } = response.data;
            if(parentData !== null) {
                setChildrenList(parentData?.children)
             } else {
                setChildrenList([]);
             }
          }
          
        //   Educators list
        let eduResponse =await  axios.get(`${BASE_URL}/role/franchisee/coordinator/franchiseeID/${franchiseeId}/educator`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (eduResponse.status === 200) {
            const {coordinators} = eduResponse.data;
            // console.log(coordinators,"coordinatorrr")
            setEducators(coordinators)
          }

        //   Parents list
        let CpResponse =await  axios.get(`${BASE_URL}/role/franchisee/parents/${franchiseeId}`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (CpResponse.status === 200) {
            const {coordinators} = CpResponse.data;
            // console.log(coordinators,"coordinatorrr")
            setParents(coordinators)
          }
    }

    const sendInitiationMail = async (childId) => {
        let token = localStorage.getItem('token');
        const response = await axios.post(`${BASE_URL}/enrollment/send-mail/${params.id}`, { childId, user_role: localStorage.getItem('user_role') }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if(response.status === 201 && response.data.status === "success") {
            // POPUP HERE
            console.log('Invitation Mail Sent!');
            setReloadFlag(!reloadFlag);

        }
    };

    const updateChildList = async () => {
        console.log('Updating child list');
        let response = await axios.get(`${BASE_URL}/enrollment/children/${params.id}`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
        if (response.status === 200) {
        const { parentData } = response.data;
        if(parentData !== null) {
            setChildrenList(parentData?.children)
            } else {
            setChildrenList([]);
            }
        }
    }

    const handleEnrollmentPageRedirection = async (childId, parentId) => {
        window.location.href=`/child-enrollment/${childId}/${parentId}?page=1`    
    };

    const DeactivateChild = async (id) => {
        console.log('Deactivating child!', id);
        const response = await axios.patch(`${BASE_URL}/enrollment/deactivate-reactivate-child/${id}`);
        console.log('RESPONSE:', response);

        if(response.status === 200 && response.data.status === "reactivated") {
            console.log('CHILD HAS BEEN REACTIVATED!');
            updateChildList();
            setTopSuccessMessage('Child activated');
            setTimeout(() => {
                setTopSuccessMessage(null);
            }, 3000);
            
        } else if(response.status === 200 && response.data.status === "deactivated") {
            console.log('Child has been deactivated!');
            updateChildList();
            setTopSuccessMessage('Child deactivated');
            setTimeout(() => {
                setTopSuccessMessage(null);
            }, 3000);
        }
    }

    const fetchParents = async (id) => {
        let childId = localStorage.getItem("SelectedChild")
        let response = await axios.get(`${BASE_URL}/enrollment/child/parent/${childId || id}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.status === 200) {
            let defaultparents = response.data?.parentData.map((parent)=>{
                return parent.user_parent_id
            })

            localStorage.setItem("DefaultParents",JSON.stringify(defaultparents))

            response = await axios.get(`${BASE_URL}/enrollment/child/franchise/${childId || id}`);

            if(response.status === 200 && response.data.status === 'success') {
                let { franchise } = response.data;
                setChildFranchise(franchise);
                setEnroledChildId(childId || id);
            }
        }

    }
    
    const rowEvents = {
        onClick: (e, row, rowIndex) => {
            if (e.target.text === 'Delete') {
                // CODE TO DELETE THE USER 
            }
            if (e.target.text === "Edit") {
                navigate(`/child-enrollment-init/edit/${row.id}/${paramsParentId}`);
            }
            if (e.target.text === 'Add Educator'){
                let defEducators = row.Educator.educators.map((edu)=>{
                    return edu.id 
                })
                handleShow(row.id,row.Educator.educators || [])
            }
            if (e.target.text === 'Add Co-Parent'){
                handleCpShow(row.id)
                // addCoparentToChild()
            }
            if (e.target.text === 'Deactivate' || e.target.text === 'Activate'){
                if (window.confirm(`Are you sure you want to ${e.target.text} this child?`)) {
                    DeactivateChild(row.id)
                }
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

        },
        onSelectAll: (isSelect, rows, e) => {
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
        Location: educator.city,
    }))

    const productsTow = childrenList?.map((child)=>({
        id: child.id,
        name: `${child.fullname} ${child.family_name}`,
        Location : child.home_address,
        Educator: {educators:child.users, childId:child.id},
        EnrollFlag: { enrollFlag: child.isChildEnrolled, childId: child.id, initiationFlag: child.isEnrollmentInitiated },
        action: { enrollFlag: child.isChildEnrolled, active: child.is_active },
        Parents: {parents:child.parents, childId:child.id},
        status: child.is_active
    }));

    const   PColumns = [
        {
            dataField: 'name',
            text: 'Name'
        },
        {
            dataField: 'Educator',
            text: 'Educator',
            formatter: (cell) => {
                // console.log(cell,"celll")
                return (
                    <>
                        {cell.educators.length === 0 ?
                            <div className="user-list">
                                <Button variant="outline-primary" onClick={()=>handleShow(cell.childId,cell.educators)} style={{ backgroundColor: "#3e5d58", color: "white" }}>
                                    Add Educator
                                </Button>
                            </div> :
                            (cell.educators || []).map((item)=>{
                               return (
                                <div className="childern-list">
                                    <div className="user-list">
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
            dataField: 'Parents',
            text: 'Co-parent',
            formatter: (cell) => {
                return (
                    <>
                        {cell.parents.length === 0 ?
                            <div className="user-list">
                               "No Co-Parents Assigned Yet!"
                            </div> :
                            (cell.parents || []).map((item)=>{
                               return (
                                <div className="childern-list">
                                    <div className="user-list">
                                        <span className="user-pic">
                                            <img src={item.profile_pic ? item.profile_pic : "../img/user.png" } alt='' />
                                        </span>
                                        <span className="user-name">
                                            {item.parent_family_name ? item.parent_family_name : "Parent"}
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
            dataField: 'status',
            text: 'Status',
            formatter: (cell) => {
                let state = "";
                state = parseInt(cell) === 1 ? "Active" : "Inactive";
                return (
                    <>
                        <p>{state}</p>
                    </>
                );
            }

        },
        {
            dataField: 'Location',
            text: 'Location',
        },
        {
            dataField: 'action',
            text: '',
            formatter: (cell) => {
                let Button = parseInt(cell.active) === 1 ? "Deactivate" : "Activate";
                return (
                    <>  {
                            <div className="cta-col">
                                <Dropdown>
                                    <Dropdown.Toggle variant="transparent" id="ctacol">
                                        <img src="../img/dot-ico.svg" alt="" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            cell.active === 1 &&
                                            <>
                                                <Dropdown.Item href="#">Edit</Dropdown.Item>
                                                <Dropdown.Item href="#">Add Educator</Dropdown.Item>
                                                <Dropdown.Item href="#">Add Co-Parent</Dropdown.Item>
                                            </>
                                        }
                                        <Dropdown.Item href="#" style={{"color":"red"}}>{Button}</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        }
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

    useEffect(() => {
        init();
    }, [reloadFlag]);

    return (
        <>
        {topSuccessMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topSuccessMessage}</p>}
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
                                        {
                                            childrenList.length === 0 ?
                                            <div className="center-division">
                                                {
                                                    localStorage.getItem('user_role') !== 'guardian' ?
                                                    <>
                                                        <p className="center">No child connected to this parent.</p>
                                                        <p className="center">Click on <strong>Add Child</strong> to add one.</p>
                                                    </>
                                                    : <><p className="center">No child connected to this parent.</p></>
                                                }
                                            </div>
                                            :
                                            <BootstrapTable
                                                keyField="id"
                                                rowEvents={rowEvents}
                                                // selectRow={selectRow}
                                                data={productsTow}
                                                columns={PColumns}
                                            />
                                        }
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
            {cpShow ? <CoparentAssignPopup 
                        parents={parents} 
                        franchise={childFranchise} 
                        childId={enroledChildId}
                        paramsParentId={paramsParentId}
                        handleClose={()=>handleCpClose()} show={cpShow}/> : ""}
        </>
    );
};

export default Children;
