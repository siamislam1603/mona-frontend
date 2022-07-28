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
    const handleClose = () => {setShow(false)};
    const handleShow = (id) => {
        localStorage.setItem("SelectedChild",id)
        setShow(true)};
    // Modal ENd

     //co parent Modal start
     const [coparentShow, setCpShow] = useState(false);
     const handleCpClose = () => {setCpShow(false)};
     const handleCpShow = (id) => {
         localStorage.setItem("SelectedChild",id)
         setCpShow(true)};
     // Modal ENd

    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [userData, setUserData] = useState([]);
    const [selectedFranchisee, setSelectedFranchisee] = useState(localStorage.getItem('selectedFranchisee'));
    const [deleteResponse, setDeleteResponse] = useState(null);
    const [childrenList, setChildrenList] = useState([]);
    const [franchiseId, setFranchiseId] = useState(null);
    const [educators, setEducators] = useState([]); 
    const [parents, setParents] = useState([]); 
    const [selectedChild , setSelectedChild] = useState("")
    
    const init = async() => {
        // Set Parents Franchisee
        const franchiseeId = location.state.franchisee_id
        setFranchiseId(franchiseeId)
        
        // Children List
        let response =await axios.get(`${BASE_URL}/enrollment/children/${params.id}`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (response.status === 200 && response.data.status === "success") {
            const { parentData } = response.data;
            setChildrenList(parentData.children)
          }
          
        // Educators list
        let eduResponse = await axios.get(`${BASE_URL}/role/franchisee/coordinator/franchiseeID/${franchiseeId}/educator`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (eduResponse.status === 200) {
            const {coordinators} = eduResponse.data;
            setEducators(coordinators)
          }

         //Parents list
         let parentResponse = await axios.get(`${BASE_URL}/role/franchisee/coordinator/franchiseeID/${franchiseeId}/guardian`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (parentResponse.status === 200) {
            const {coordinators} = parentResponse.data;
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
                setSelectedChild(row.id)
                handleShow(row.id)
            }

            if(e.target.text === 'Add Co-Parent'){
                handleCpShow(row.id)
            }
        },
    };
    const selectRow = {
        mode: 'checkbox',
        onSelect: (row, isSelect, rowIndex, e) => {
            if (DeleteId.includes(row.userID)) {
                let Index;
                DeleteId.map((item, index) => {
                    if (item === row.userID) {
                        Index = index;
                    }
                })
                DeleteId.splice(Index, 1);
            }
            else {
                DeleteId.push(row.userID);
            }
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

    const productsTow = childrenList.map((child)=>({
        id: child.id,
        name: child.fullname,
        Location : child.home_address,
        Educator: [child.users,child.id]
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
                console.log(cell,"cell")
                return (
                    <>
                        {cell[0].length === 0 ?
                            <div className="user-list">
                                <Button variant="outline-primary" onClick={()=>handleShow(cell[1])} style={{ backgroundColor: "#3e5d58", color: "white" }}>
                                    Add Educator
                                </Button>
                            </div> :
                            (cell[0] || []).map((item)=>{
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
                            <a 
                                className="Enrolment_Button btn btn-outline-secondary" style={{"fontSize":"0.8rem","fontWeight":"800"}}
                                onClick={(e) => viewEnrollmentForm(e)}>
                                View Enrollment
                            </a>
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

    const viewEnrollmentForm = async (e) => {
        e.preventDefault();
        // localStorage.removeItem('enrolled_parent_id');
        // localStorage.removeItem('enrolled_child_id');
        window.location.href=`/child-enrollment/${childrenList[0].id}/${params.id}`;
    };

    childrenList && console.log('CHILDREN LIST:', childrenList);

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
                                    selectedFranchisee={selectedFranchisee}
                                    setSelectedFranchisee={setSelectedFranchisee}
                                />
                                <div className="entry-container">
                                    <div className="user-management-sec">
                                        <header className="title-head">
                                            <h1 className="title-lg">
                                                <Link to="/user-management"> </Link>
                                                Children
                                            </h1>
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
        {show ? <EducatorAssignPopup show={show} handleClose={()=>handleClose()} educators={educators}/> : ""}
        {coparentShow ? <CoparentAssignPopup parents={parents} show={coparentShow} handleClose={()=>handleCpClose()}/> : ""}
        </>
    );
};

export default Children;
