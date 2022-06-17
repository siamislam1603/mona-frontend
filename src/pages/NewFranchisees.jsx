import React, { useState } from 'react'
import { Row, Col, Button, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import TopHeader from '../components/TopHeader';
import LeftNavbar from '../components/LeftNavbar';
import Select from 'react-select';
const NewFranchisees = () => {

    const [franchiseeData, setFranchiseeData] = useState();

    const handleChange = event => {
        const { name, value } = event.target;

        setFranchiseeData(prevState => ({
            ...prevState,
            [name]: value
        }));
    } 

    console.log('FRANCHISEE DATA:', franchiseeData);

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

                                <Form>
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
                                                // options={cityData}
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
                                                // options={cityData}
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
                                                // options={cityData}
                                                onChange={(e) =>
                                                    setFranchiseeData((prevState) => ({
                                                        ...prevState,
                                                        franchisee_admin: e.value,
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
                                                    type="email" 
                                                    placeholder="admin@454 342 34.com"
                                                    onChange={handleChange} />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Franchisee Admin’s Email</Form.Label>
                                                <Form.Control 
                                                    name="franchisee_admin_email"
                                                    type="text" 
                                                    placeholder="andy.smith@specialdaycare.com" />
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