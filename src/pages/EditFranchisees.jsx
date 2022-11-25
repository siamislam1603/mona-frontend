import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Container, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import TopHeader from '../components/TopHeader';
import LeftNavbar from '../components/LeftNavbar';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import { suburbData } from '../assets/data/suburbData';

import axios from 'axios';
import { BASE_URL } from '../components/App';
import { FranchiseeFormValidation } from '../helpers/validation';
import * as ReactBootstrap from 'react-bootstrap';

const EditFranchisees = () => {
    const { franchiseeId } = useParams();
    const [franchiseeData, setFranchiseeData] = useState({
        franchisee_name: "",
        abn: "",
        city: "",
        state: "",
        franchisee_admin_email: "",
        franchisee_admin: "",
        franchisee_number: "",
        acn: "",
        address: "",
        postcode: "",
        contact: "",
    });
    const [australianStatesData, setAustralianStatesData] = useState();
    const [cityData, setCityData] = useState(suburbData);


    const [franchiseeAdminData, setFranchiseeAdminData] = useState();
    const [selectedFranchisee, setSelectedFranchisee] = useState();
    const [topErrorMessage, setTopErrorMessage] = useState(null);
    const [loader, setLoader] = useState(false);
    const [createFranchiseeModal, setCreateFranchiseeModal] = useState(false);
    const [editFranchiseeData, setEditFranchiseeData] = useState();
    const [stateData, setStateData] = useState([]);

    // ERROR STATES
    const [formErrors, setFormErrors] = useState({});
    const [suburbSearchString, setSuburbSearchString] = useState("");


    // FETCHES THE DATA OF USER FOR EDITING
    const fetchEditFranchiseData = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/role/franchisee/${franchiseeId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 200 && response.data.status === "success") {
            const { franchisees } = response.data;
            console.log('FRANCHISEE DATA:', franchisees);
            copyDataToLocalState(franchisees);
        }
    };

    const copyDataToLocalState = (franchisee) => {
        setFranchiseeData(prevState => ({
            franchisee_name: franchisee?.franchisee_name,
            abn: franchisee?.abn,
            city: franchisee?.city,
            state: franchisee?.state,
            contact: franchisee?.contact,
            franchisee_admin_email: franchisee?.franchisee_admin_email,
            franchisee_number: franchisee?.franchisee_number,
            acn: franchisee?.acn,
            address: franchisee?.address,
            postcode: franchisee?.postcode,
            franchisee_admin: franchisee?.franchisee_admin,
        }));
    }



    // CREATES A NEW FRANCHISEE
    const updateFranchisee = async () => {
        const response = await axios.patch(`${BASE_URL}/role/franchisee/${franchiseeId}`, franchiseeData, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });

        if (response.status === 200 && response.data.status === "success") {
            setLoader(false);
            setCreateFranchiseeModal(false);
            localStorage.setItem('success_msg', 'Franchise Updated Successfully!');
            window.location.href = "/all-franchisees";
        } else {
            setLoader(false);
            setCreateFranchiseeModal(false);
            localStorage.setItem('success_msg', response.data.msg);
            window.location.href = "/all-franchisees";

            // setTopErrorMessage(response.data.msg);
            // let { errorObject } = response.data;
            // errorObject.map(error => setFormErrors(prevState => ({
            //     ...prevState,
            //     [error.error_field]: error.error_msg
            // })));

            // setTimeout(() => {
            //     setTopErrorMessage(null);
            // }, 3000)
        }
    }


    const fetchSuburbData = (state) => {
        const suburbAPI = `${BASE_URL}/api/suburbs/data/${state}`;
        const getSuburbList = axios(suburbAPI, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } });
        axios.all([getSuburbList]).then(
            axios.spread((...data) => {
                console.log('SUBURB DATA:', data[0].data.data);
                let sdata = data[0].data.data;
                setCityData(sdata.map(d => ({
                    id: d.id,
                    value: d.name,
                    label: d.name
                })));
            })
        )
    }



    // FETCHES AUSTRALIAN STATES FROM THE DATABASE AND POPULATES THE DROP DOWN LIST
    const fetchAustralianStates = async () => {
        const response = await axios.get(`${BASE_URL}/api/australian-states`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });
        if (response.status === 200 && response.data.status === "success") {
            setAustralianStatesData(response.data.stateList.map(dt => ({
                value: dt.name,
                label: dt.name
            })));
        }
    };

    // FETCHES AUSTRALIAN CITIES FROM THE DATABASE AND POPULATES THE DROP DOWN LIST
    const fetchStateList = async () => {
        let response = await axios.get(`${BASE_URL}/api/state/data`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });

        if (response.status === 200 && response.data.status === "success") {
            let { states } = response.data;
            setStateData(states.map(d => ({
                id: d.id,
                value: d.name,
                label: d.name
            })));
        }
    }

    // FETCHES FRANCHISEE ADMINS FROM THE DATABASE AND POPULATES THE DROP DOWN LIST
    const fetchFranchiseeAdmins = async () => {
        const response = await axios.get(`${BASE_URL}/role/franchisee-admin-list`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });
        if (response.status === 200 && response.data.status === "success") {
            const { franchiseeAdminList } = response.data;
            setFranchiseeAdminData(
                franchiseeAdminList.map((dt) => ({
                    id: dt.id,
                    value: dt.fullname,
                    label: dt.fullname,
                }))
            );
        }
    };

    const handleFranchiseeDataSubmission = event => {
        event.preventDefault();
        let errorObject = FranchiseeFormValidation(franchiseeData)
        if (Object.keys(errorObject).length > 0) {
            console.log('ERROR OBJECT:', errorObject);
            setFormErrors(errorObject);
        }
        else {
            setCreateFranchiseeModal(true);
            setLoader(true)
            updateFranchisee();
        }
    }

    const handleChange = event => {
        const { name, value } = event.target;

        setFranchiseeData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleCancel = () => {
        window.location.href = "/all-franchisees";
    }

    useEffect(() => {
        fetchAustralianStates();
        fetchStateList();
        fetchFranchiseeAdmins();
        fetchEditFranchiseData();
    }, []);



    useEffect(() => {
        copyDataToLocalState();
    }, [editFranchiseeData]);


    useEffect(() => {
        fetchSuburbData(franchiseeData?.state);
    }, [franchiseeData?.state])



    editFranchiseeData && console.log('EDIT DATA:', editFranchiseeData);
    franchiseeData && console.log('DATA:', franchiseeData);
    return (
        <div>
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
                                    <div className="user-management-sec">
                                        <header className="title-head">
                                            <h1 className="title-lg">Edit Franchises</h1>
                                        </header>

                                    </div>
                                </div>
                                {topErrorMessage && <p className="alert alert-danger" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topErrorMessage}</p>}
                                <Form onSubmit={handleFranchiseeDataSubmission} className="error-sec">
                                    <Row>
                                        <Col sm={6} md={6} lg={6}>
                                            <Form.Group className="mb-3 relative" controlId="formBasicEmail">
                                                <Form.Label>Franchise Name</Form.Label>
                                                <Form.Control
                                                    name="franchisee_name"
                                                    type="text"
                                                    value={franchiseeData?.franchisee_name}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            franchisee_name: null
                                                        }));
                                                    }} />
                                                {formErrors.franchisee_name !== null && <span className="error">{formErrors.franchisee_name}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3 relative" controlId="formBasicPassword">
                                                <Form.Label>ABN</Form.Label>
                                                <Form.Control
                                                    name="abn"
                                                    type="text"
                                                    maxLength={11}
                                                    minLength={11}
                                                    value={franchiseeData?.abn}
                                                    placeholder="456 667 778 88"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            abn: null
                                                        }));
                                                    }} />
                                                {formErrors.abn !== null && <span className="error">{formErrors.abn}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3 relative" defaultValue={franchiseeData.state} >
                                                <Form.Label>State</Form.Label>
                                                <Select
                                                    value={{ label: franchiseeData.state, value: franchiseeData.state }}
                                                    placeholder={franchiseeData?.state || "State"}
                                                    closeMenuOnSelect={true}
                                                    options={stateData}
                                                    onChange={(e) => {
                                                        setFranchiseeData((prevState) => ({
                                                            ...prevState,
                                                            state: e.value,
                                                        }));
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            state: null
                                                        }));
                                                    }} />
                                                {formErrors.state !== null && <span className="error">{formErrors.state}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3 relative">
                                                <Form.Label>Suburb</Form.Label>
                                                <Select
                                                    placeholder={franchiseeData?.city || "Select"}
                                                    closeMenuOnSelect={true}
                                                    value={{ label: franchiseeData.city, value: franchiseeData.city }}
                                                    options={cityData}
                                                    onInputChange={(e) => {
                                                        setSuburbSearchString(e);
                                                    }}
                                                    onChange={(e) => {
                                                        setFranchiseeData((prevState) => ({
                                                            ...prevState,
                                                            city: e.value,
                                                        }));
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            city: null
                                                        }));
                                                    }} />
                                                {formErrors.city !== null && <span className="error">{formErrors.city}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3 relative" controlId="formBasicPassword">
                                                <Form.Label> Contact Number</Form.Label>
                                                <Form.Control
                                                    name="contact"
                                                    type="text"
                                                    maxLength="10"
                                                    value={franchiseeData?.contact}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            contact: null
                                                        }));
                                                    }} />
                                                {formErrors.contact !== null && <span className="error">{formErrors.contact}</span>}
                                            </Form.Group>

                                            {/* <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Franchisee Admin’s Email</Form.Label>
                                                <Form.Control 
                                                    name="franchisee_admin_email"
                                                    type="text" 
                                                    value={franchiseeData?.franchisee_admin_email}
                                                    placeholder="you@example.com"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            franchisee_admin_email: null,
                                                            validemail:null
                                                        }));
                                                    }} />
                                                <span className="error">
                                                    {!franchiseeData.franchisee_admin_email && formErrors.franchisee_admin_email}
                                                    {!formErrors.franchisee_admin_email && formErrors.validemail}
                                                 </span>       
                                            </Form.Group> */}
                                        </Col>

                                        <Col sm={6} md={6} lg={6}>
                                            <Form.Group className="mb-3 relative" controlId="formBasicEmail">
                                                <Form.Label>Franchise Number</Form.Label>
                                                <Form.Control
                                                    name="franchisee_number"
                                                    type="text"
                                                    value={franchiseeData?.franchisee_number}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            franchisee_number: null,
                                                        }));
                                                    }} />
                                                {formErrors.franchisee_number !== null && <span className="error">{formErrors.franchisee_number}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3 relative" controlId="formBasicPassword">
                                                <Form.Label>ACN</Form.Label>
                                                <Form.Control
                                                    name="acn"
                                                    type="text"
                                                    maxLength={11}
                                                    minLength={9}
                                                    value={franchiseeData?.acn}
                                                    placeholder="666 777 888 99"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            acn: null
                                                        }));
                                                    }} />
                                                {formErrors.acn !== null && <span className="error">{formErrors.acn}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3 relative" controlId="formBasicPassword">
                                                <Form.Label>Street Address</Form.Label>
                                                <Form.Control
                                                    name="address"
                                                    type="text"
                                                    value={franchiseeData?.address}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            address: null
                                                        }));
                                                    }} />
                                                {formErrors.address !== null && <span className="error">{formErrors.address}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3 relative" controlId="formBasicPassword">
                                                <Form.Label>Post Code</Form.Label>
                                                <Form.Control
                                                    name="postcode"
                                                    type="text"
                                                    value={franchiseeData?.postcode}
                                                    maxLength="4"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            postcode: null
                                                        }));
                                                    }} />
                                                {formErrors.postcode !== null && <span className="error">{formErrors.postcode}</span>}
                                            </Form.Group>

                                            {/* <Form.Group className="mb-3">
                                                <Form.Label>Franchisee Admin</Form.Label>
                                                <Select
                                                placeholder="Select Franchisee Admin"
                                                closeMenuOnSelect={true}
                                                options={franchiseeAdminData}
                                                onChange={(e) => {
                                                    setFranchiseeData((prevState) => ({
                                                        ...prevState,
                                                        franchisee_admin: e.id,
                                                    }));

                                                    setFormErrors(prevState => ({
                                                        ...prevState,
                                                        franchisee_admin: null
                                                    }));   
                                                }}
                                                />
                                                { formErrors.franchisee_admin !== null && <span className="error">{formErrors.franchisee_admin}</span> }
                                            </Form.Group> */}
                                        </Col>

                                        <div className="d-flex justify-content-center my-5">
                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Button variant="link btn btn-light btn-md m-2" style={{ backgroundColor: '#efefef' }} onClick={() => handleCancel()}>Cancel</Button>
                                                <Button type="submit">Save Details</Button>
                                            </Form.Group>
                                        </div>
                                    </Row>
                                </Form>
                            </div>
                        </div>
                    </Container>
                </section>
            </div >
            {
                createFranchiseeModal &&
                <Modal
                    show={createFranchiseeModal}
                    onHide={() => setCreateFranchiseeModal(false)}>
                    <Modal.Header>
                        <Modal.Title>
                            Creating Franchise
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="create-training-modal" style={{ textAlign: 'center' }}>
                            <p>Franchise is being created!</p>
                            <p>Please Wait...</p>
                        </div>
                    </Modal.Body>

                    <Modal.Footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            loader === true && <div>
                                <ReactBootstrap.Spinner animation="border" />
                            </div>
                        }
                    </Modal.Footer>
                </Modal>
            }
        </div >
    )
}

export default EditFranchisees