import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import TopHeader from '../components/TopHeader';
import LeftNavbar from '../components/LeftNavbar';
import Select from 'react-select';
import axios from 'axios';
import { BASE_URL } from '../components/App';

const NewFranchisees = () => {

    const [franchiseeData, setFranchiseeData] = useState();
    const [australianStatesData, setAustralianStatesData] = useState();
    const [cityData, setCityData] = useState([]);
    const [franchiseeAdminData, setFranchiseeAdminData] = useState();

    // CREATES A NEW FRANCHISEE
    const createFranchisee = async () => {
        const response = await axios.post(`${BASE_URL}/role/franchisee`, franchiseeData, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });

        console.log('RESPONSE:', response);
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

        if(Object.keys(franchiseeData).length === 12) {
            createFranchisee();
        } else {
            console.log('All fields are necessary.');
        }
    }

    const handleChange = event => {
        const { name, value } = event.target;

        setFranchiseeData(prevState => ({
            ...prevState,
            [name]: value
        }));
    } 

    useEffect(() => {
        fetchAustralianStates();
        fetchCities();
        fetchFranchiseeAdmins();
    }, []);

    console.log('DATA')

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
                                <TopHeader />
                                <div className="entry-container">
                                    <div className="user-management-sec">
                                        <header className="title-head">
                                            <h1 className="title-lg">All Franchises</h1>
                                        </header>
                                    </div>
                                </div>

                                <Form onSubmit={handleFranchiseeDataSubmission}>
                                    <Row>
                                        <Col sm={6} md={6} lg={6}>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Franchise Name</Form.Label>
                                                <Form.Control
                                                    name="franchisee_name" 
                                                    type="text" 
                                                    placeholder="Special DayCare"
                                                    onChange={handleChange} />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>ABN</Form.Label>
                                                <Form.Control
                                                    name="abn" 
                                                    type="text" 
                                                    placeholder="6743433"
                                                    onChange={handleChange} />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Suburb</Form.Label>
                                                <Select
                                                placeholder="Which Suburb?"
                                                closeMenuOnSelect={true}
                                                options={cityData}
                                                onChange={(e) =>
                                                    setFranchiseeData((prevState) => ({
                                                        ...prevState,
                                                        city: e.value,
                                                    }))
                                                }
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>State</Form.Label>
                                                <Select
                                                placeholder="Which State?"
                                                closeMenuOnSelect={true}
                                                options={australianStatesData}
                                                onChange={(e) =>
                                                    setFranchiseeData((prevState) => ({
                                                        ...prevState,
                                                        state: e.value,
                                                    }))
                                                }
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label> Email Address  </Form.Label>
                                                <Form.Control
                                                    name="email" 
                                                    type="email" 
                                                    placeholder="admin@specialdaycare.com"
                                                    onChange={handleChange} />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Franchisee Admin</Form.Label>
                                                <Select
                                                placeholder="Select Franchisee Admin"
                                                closeMenuOnSelect={true}
                                                options={franchiseeAdminData}
                                                onChange={(e) =>
                                                    setFranchiseeData((prevState) => ({
                                                        ...prevState,
                                                        franchisee_admin: e.id,
                                                    }))
                                                }
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col sm={6} md={6} lg={6}>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Franchise Number</Form.Label>
                                                <Form.Control 
                                                    name="franchisee_number"
                                                    type="text" 
                                                    placeholder="ADS 00342"
                                                    onChange={handleChange} />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>ACN</Form.Label>
                                                <Form.Control
                                                    name="acn" 
                                                    type="text" 
                                                    placeholder="3453453453"
                                                    onChange={handleChange} />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Street Address</Form.Label>
                                                <Form.Control 
                                                    name="address"
                                                    type="text" 
                                                    placeholder="5th Avenue, Central Park Street, Broadway"
                                                    onChange={handleChange} />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Postcode</Form.Label>
                                                <Form.Control
                                                    name="postcode" 
                                                    type="text" 
                                                    placeholder="24545"
                                                    onChange={handleChange} />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label> Contact Number</Form.Label>
                                                <Form.Control 
                                                    name="contact"
                                                    type="text" 
                                                    placeholder="454 342 56"
                                                    onChange={handleChange} />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Franchisee Admin’s Email</Form.Label>
                                                <Form.Control 
                                                    name="franchisee_admin_email"
                                                    type="text" 
                                                    placeholder="andy.smith@specialdaycare.com"
                                                    onChange={handleChange} />
                                            </Form.Group>
                                        </Col>

                                        <div className="d-flex justify-content-center my-5">
                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Button variant="link btn btn-light btn-md m-2" style={{ backgroundColor: '#efefef' }}>Cancel</Button>
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
        </div >
    )
}

export default NewFranchisees;