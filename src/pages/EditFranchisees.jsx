import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Container, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import TopHeader from '../components/TopHeader';
import LeftNavbar from '../components/LeftNavbar';
import Select from 'react-select';
import axios from 'axios';
import { BASE_URL } from '../components/App';
import { FranchiseeFormValidation } from '../helpers/validation';
import * as ReactBootstrap from 'react-bootstrap';

const EditFranchisees = () => {
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
    const [cityData, setCityData] = useState([]);
    const [franchiseeAdminData, setFranchiseeAdminData] = useState();
    const [selectedFranchisee, setSelectedFranchisee] = useState();
    const [topErrorMessage, setTopErrorMessage] = useState(null);
    const [loader, setLoader] = useState(false);
    const [createFranchiseeModal, setCreateFranchiseeModal] = useState(false);
    
    // ERROR STATES
    const [formErrors, setFormErrors] = useState({});

    // CREATES A NEW FRANCHISEE
    const createFranchisee = async () => {
        const response = await axios.post(`${BASE_URL}/role/franchisee`, franchiseeData, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });

        if(response.status === 201 && response.data.status === "success") {
            setLoader(false);
            setCreateFranchiseeModal(false);
            localStorage.setItem('success_msg', 'Franchisee Created Successfully!');
            window.location.href="/all-franchisees";
        } else {
            setLoader(false);
            setCreateFranchiseeModal(false);
            // setTopErrorMessage(response.data.msg);
            let { errorObject } = response.data;
            errorObject.map(error => setFormErrors(prevState => ({
                ...prevState,
                [error.error_field]: error.error_msg
            })));

            setTimeout(() => {
                setTopErrorMessage(null);
            }, 3000)
        }
    }


    // FETCHES AUSTRALIAN STATES FROM THE DATABASE AND POPULATES THE DROP DOWN LIST
    const fetchAustralianStates = async () => {
        const response = await axios.get(`${BASE_URL}/api/australian-states`);
        if(response.status === 200 && response.data.status === "success") {
            setAustralianStatesData(response.data.stateList.map(dt => ({
                value: dt.name,
                label: dt.name
            })));
        } 
    };

    // FETCHES AUSTRALIAN CITIES FROM THE DATABASE AND POPULATES THE DROP DOWN LIST
    const fetchCities = async () => {
        const response = await axios.get(`${BASE_URL}/api/cities`);
        if (response.status === 200) {
        const { cityList } = response.data;
        setCityData(
            cityList.map((city) => ({
                value: city.name,
                label: city.name
            }))
        );
        }
    };

    // FETCHES FRANCHISEE ADMINS FROM THE DATABASE AND POPULATES THE DROP DOWN LIST
    const fetchFranchiseeAdmins = async () => {
        const response = await axios.get(`${BASE_URL}/role/franchisee-admin-list`);
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

        let errorObject = FranchiseeFormValidation(franchiseeData);

        if(Object.keys(errorObject).length > 0) {
            console.log('ERROR OBJECT:', errorObject);
            setFormErrors(errorObject);
        } else {
            setCreateFranchiseeModal(true);
            setLoader(true)
            createFranchisee();
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
        window.location.href="/all-franchisees";
    }

    useEffect(() => {
        fetchAustralianStates();
        fetchCities();
        fetchFranchiseeAdmins();
    }, []);

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
                                <Form onSubmit={handleFranchiseeDataSubmission}>
                                    <Row>
                                        <Col sm={6} md={6} lg={6}>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Franchise Name</Form.Label>
                                                <Form.Control
                                                    name="franchisee_name" 
                                                    type="text" 
                                                    placeholder="Special DayCare"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            franchisee_name: null
                                                        }));
                                                    }} />
                                                { formErrors.franchisee_name !== null && <span className="error">{formErrors.franchisee_name}</span> }
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>ABN</Form.Label>
                                                <Form.Control
                                                    name="abn" 
                                                    type="text" 
                                                    placeholder="6743433"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            abn: null
                                                        }));
                                                    }} />
                                                { formErrors.abn !== null && <span className="error">{formErrors.abn}</span> }
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Suburb</Form.Label>
                                                <Select
                                                placeholder="Which Suburb?"
                                                closeMenuOnSelect={true}
                                                options={cityData}
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
                                            { formErrors.city !== null && <span className="error">{formErrors.city}</span> }
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>State</Form.Label>
                                                <Select
                                                placeholder="Which State?"
                                                closeMenuOnSelect={true}
                                                options={australianStatesData}
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
                                            { formErrors.state !== null && <span className="error">{formErrors.state}</span> }
                                            </Form.Group>

                                            
                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label> Contact Number</Form.Label>
                                                <Form.Control 
                                                    name="contact"
                                                    type="text" 
                                                    placeholder="454 342 56"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            contact: null
                                                        }));
                                                    }} />
                                                { formErrors.contact !== null && <span className="error">{formErrors.contact}</span> }
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Franchisee Admin’s Email</Form.Label>
                                                <Form.Control 
                                                    name="franchisee_admin_email"
                                                    type="text" 
                                                    placeholder="andy.smith@specialdaycare.com"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            franchisee_admin_email: null
                                                        }));
                                                    }} />
                                                { formErrors.franchisee_admin_email !== null && <span className="error">{formErrors.franchisee_admin_email}</span> }
                                            </Form.Group>
                                        </Col>

                                        <Col sm={6} md={6} lg={6}>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Franchise Number</Form.Label>
                                                <Form.Control 
                                                    name="franchisee_number"
                                                    type="text" 
                                                    placeholder="ADS 00342"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            franchisee_number: null
                                                        }));
                                                    }} />
                                                { formErrors.franchisee_number !== null && <span className="error">{formErrors.franchisee_number}</span> }
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>ACN</Form.Label>
                                                <Form.Control
                                                    name="acn" 
                                                    type="text" 
                                                    placeholder="3453453453"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            acn: null
                                                        }));
                                                    }} />
                                                { formErrors.acn !== null && <span className="error">{formErrors.acn}</span> }
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Street Address</Form.Label>
                                                <Form.Control 
                                                    name="address"
                                                    type="text" 
                                                    placeholder="5th Avenue, Central Park Street, Broadway"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            address: null
                                                        }));
                                                    }} />
                                                { formErrors.address !== null && <span className="error">{formErrors.address}</span> }
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Postcode</Form.Label>
                                                <Form.Control
                                                    name="postcode" 
                                                    type="text" 
                                                    placeholder="24545"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormErrors(prevState => ({
                                                            ...prevState,
                                                            postcode: null
                                                        }));
                                                    }} />
                                                { formErrors.postcode !== null && <span className="error">{formErrors.postcode}</span> }
                                            </Form.Group>

                                            <Form.Group className="mb-3">
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
                                            </Form.Group>
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
                        Creating Franchisee
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="create-training-modal" style={{ textAlign: 'center' }}>
                        <p>Franchisee is being created!</p>
                        <p>Please Wait...</p>
                        </div>
                    </Modal.Body>

                    <Modal.Footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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