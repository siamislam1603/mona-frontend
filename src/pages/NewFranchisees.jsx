import React from 'react'
import { Row, Col, Button, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import TopHeader from '../components/TopHeader';
import LeftNavbar from '../components/LeftNavbar';
const NewFranchisees = () => {
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
                                                <Form.Control type="text" placeholder="Special DayCare" />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>ABN</Form.Label>
                                                <Form.Control type="text" placeholder="6743433" />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Suburb</Form.Label>
                                                <Form.Select aria-label="Default select example">
                                                    <option>Sydney</option>
                                                    <option value="1">Sydney</option>
                                                    <option value="2">Sydney</option>
                                                    <option value="3">Sydney</option>
                                                </Form.Select>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>State</Form.Label>
                                                <Form.Select aria-label="Default select example">
                                                    <option>Western Australia</option>
                                                    <option value="1">Western Australia</option>
                                                    <option value="2">Western Australia</option>
                                                    <option value="3">Western Australia</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label> Email Address  </Form.Label>
                                                <Form.Control type="email" placeholder="admin@specialdaycare.com" />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Franchisee Admin</Form.Label>
                                                <Form.Select aria-label="Default select example">
                                                    <option>Andy Smith</option>
                                                    <option value="1">Andy Smith</option>
                                                    <option value="2">Andy Smith</option>
                                                    <option value="3">Andy Smith</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6} md={6} lg={6}>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Franchise Number</Form.Label>
                                                <Form.Control type="text" placeholder="ADS 00342" />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>ACN</Form.Label>
                                                <Form.Control type="text" placeholder="3453453453" />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Street Address</Form.Label>
                                                <Form.Control type="text" placeholder="5th Avenue, Central Park Street, Broadway" />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Postcode</Form.Label>
                                                <Form.Control type="text" placeholder="24545" />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label> Contact Number</Form.Label>
                                                <Form.Control type="email" placeholder="admin@454 342 34.com" />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Franchisee Admin’s Email</Form.Label>
                                                <Form.Control type="text" placeholder="andy.smith@specialdaycare.com" />
                                            </Form.Group>
                                        </Col>
                                        <div className="d-flex justify-content-center my-5">
                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Button variant="link">Link</Button>
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