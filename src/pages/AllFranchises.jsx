
import React, { Component, useEffect, useState } from 'react';
import {
    Button,
    Container,
    Dropdown,
    Row,
    Col,
    Form,
    Card
} from 'react-bootstrap';
import CardImg from '../assets/img/card.png'
// import CardImgg from ''
// import { AiOutlineArrowRight } from "react-icons/ai";
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import ToolkitProvider, {
    Search,
    CSVExport,
} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import axios from 'axios';
import { BASE_URL } from '../components/App';
import NewFranchises from './NewFranchises';

const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;
const animatedComponents = makeAnimated();

const styles = {
    option: (styles, state) => ({
        ...styles,
        backgroundColor: state.isSelected ? '#E27235' : '',
    }),
};
const training = [
    {
        value: 'sydney',
        label: 'Sydney',
    },
    {
        value: 'melbourne',
        label: 'Melbourne',
    },
];


const AllFranchises = () => {
    const [userData, setUserData] = useState([]);
    const [filter, setFilter] = useState({
        user: '',
        location: [],
    });

    const fetchUserDetails = async () => {
        let response = await axios.get(`${BASE_URL}/auth/users`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.status === 200) {
            const { data } = response.data;
            let tempData = data.map((dt) => ({
                id: dt.id,
                name: `${BASE_URL}/${dt.profile_photo}, ${dt.fullname}, ${dt.role
                    .split('_')
                    .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
                    .join(' ')}`,
                email: dt.email,
                number: dt.phone,
                location: dt.city,
                is_deleted: dt.is_deleted,
            }));
            tempData = tempData.filter((data) => data.is_deleted === 0);
            setUserData(tempData);
        }
    };

    const handleCancelFilter = () => {
        setFilter({});
    };

    const handleApplyFilter = async () => {
        // const res = await axios.post(`${BASE_URL}/`)
    };

    useEffect(() => {
        fetchUserDetails();
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
                                <TopHeader />
                                <div className="entry-container">
                                    <div className="user-management-sec">
                                        <>
                                            <header className="title-head">
                                                <h1 className="title-lg">All Franchises</h1>
                                                <div className="othpanel">
                                                    <div className="extra-btn">
                                                        <div className="data-search me-3">
                                                            <SearchBar />
                                                        </div>
                                                        <Dropdown className="filtercol me-3">
                                                            <Dropdown.Toggle
                                                                id="extrabtn"
                                                                variant="btn-outline"
                                                            >
                                                                <i className="filter-ico"></i> Add Filters
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <header>Filter by:</header>
                                                                <div className="custom-radio btn-radio mb-2">
                                                                    <label>Users:</label>
                                                                    <Form.Group>
                                                                        <Form.Check
                                                                            inline
                                                                            label="Admin"
                                                                            value="Admin"
                                                                            name="users"
                                                                            type="radio"
                                                                            id="one"
                                                                            onChange={(event) =>
                                                                                setFilter((prevState) => ({
                                                                                    ...prevState,
                                                                                    user: event.target.value,
                                                                                }))
                                                                            }
                                                                        />
                                                                        <Form.Check
                                                                            inline
                                                                            label="Co-ordinator"
                                                                            value="Coordinator"
                                                                            name="users"
                                                                            type="radio"
                                                                            id="two"
                                                                            onChange={(event) =>
                                                                                setFilter((prevState) => ({
                                                                                    ...prevState,
                                                                                    user: event.target.value,
                                                                                }))
                                                                            }
                                                                        />
                                                                        <Form.Check
                                                                            inline
                                                                            label="Educator"
                                                                            value="Educator"
                                                                            name="users"
                                                                            type="radio"
                                                                            id="three"
                                                                            onChange={(event) =>
                                                                                setFilter((prevState) => ({
                                                                                    ...prevState,
                                                                                    user: event.target.value,
                                                                                }))
                                                                            }
                                                                        />
                                                                        <Form.Check
                                                                            inline
                                                                            label="Parent/Guardian"
                                                                            value="Guardian"
                                                                            name="users"
                                                                            type="radio"
                                                                            id="four"
                                                                            onChange={(event) =>
                                                                                setFilter((prevState) => ({
                                                                                    ...prevState,
                                                                                    user: event.target.value,
                                                                                }))
                                                                            }
                                                                        />
                                                                    </Form.Group>
                                                                </div>
                                                                <div className="custom-radio">
                                                                    <label className="mb-2">Location:</label>
                                                                    <Form.Group>
                                                                        <Select
                                                                            closeMenuOnSelect={false}
                                                                            components={animatedComponents}
                                                                            isMulti
                                                                            options={training}
                                                                            onChange={(event) =>
                                                                                setFilter((prevState) => ({
                                                                                    ...prevState,
                                                                                    location: [
                                                                                        ...event.map(
                                                                                            (data) => data.label
                                                                                        ),
                                                                                    ],
                                                                                }))
                                                                            }
                                                                        />
                                                                    </Form.Group>
                                                                </div>
                                                                <footer>
                                                                    <Button
                                                                        variant="transparent"
                                                                        type="submit"
                                                                        onClick={handleCancelFilter}
                                                                    >
                                                                        Reset
                                                                    </Button>
                                                                    <Button
                                                                        variant="primary"
                                                                        type="submit"
                                                                        onClick={handleApplyFilter}
                                                                    >
                                                                        Apply
                                                                    </Button>
                                                                </footer>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                        <a
                                                            href="/New-Franchises"
                                                            className="btn btn-primary me-3"
                                                        >
                                                            + Create New User
                                                        </a>
                                                        <Dropdown>
                                                            <Dropdown.Toggle
                                                                id="extrabtn"
                                                                className="ctaact"
                                                            >
                                                                <img src="../img/dot-ico.svg" alt="" />
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item>
                                                                    <ExportCSVButton>
                                                                        Export CSV!!
                                                                    </ExportCSVButton>
                                                                </Dropdown.Item>
                                                                <Dropdown.Item href="#">
                                                                    Delete All Row
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                            </header>
                                            <Row>
                                                <Col sm={6} md={4} className="my-2">
                                                    <Card className="text-center Card_design">
                                                        <Card.Body className="d-flex flex-row bd-highlight align-items-center">
                                                            <img src={CardImg} alt="" width="65px" />
                                                            <div className="p-1">
                                                                <Card.Title className="mb-0 Text_design"
                                                                >Homecare Stay</Card.Title>
                                                                <Card.Text id="Down_Text">
                                                                    Brisbane, South Australia
                                                                </Card.Text>
                                                            </div>
                                                            <div style={{ paddingLeft: "2rem" }}>
                                                                {/* <b><AiOutlineArrowRight className="Arrow_icon" /></b> */}
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="Card_Footer">
                                                            <div className="d-flex justify-content-around">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0 px-2 Footer_text">Educators</p>
                                                                    <p className="mb-0 px-2 Footer_textTow">04</p>
                                                                </div>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0 px-2" style={{ borderRight: "2px solid #AA0061", fontWeight: "500", fontSize: "14px" }}>Children</p>
                                                                    <p className="mb-0 px-2" style={{ color: '#151F6D', fontWeight: '600', fontSize: "20px" }}>04</p>
                                                                </div>
                                                            </div>
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                                <Col sm={6} md={4} className="my-2">
                                                    <Card className="text-center Card_design">
                                                        <Card.Body className="d-flex flex-row bd-highlight align-items-center">
                                                            <img src={CardImg} alt="" width="65px" />
                                                            <div className="p-1">
                                                                <Card.Title className="mb-0 Text_design"
                                                                >Homecare Stay</Card.Title>
                                                                <Card.Text id="Down_Text">
                                                                    Brisbane, South Australia
                                                                </Card.Text>
                                                            </div>
                                                            <div style={{ paddingLeft: "2rem" }}>
                                                                {/* <b><AiOutlineArrowRight className="Arrow_icon" /></b> */}
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="Card_Footer">
                                                            <div className="d-flex justify-content-around">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0 px-2 Footer_text">Educators</p>
                                                                    <p className="mb-0 px-2 Footer_textTow">04</p>
                                                                </div>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0 px-2" style={{ borderRight: "2px solid #AA0061", fontWeight: "500", fontSize: "14px" }}>Children</p>
                                                                    <p className="mb-0 px-2" style={{ color: '#151F6D', fontWeight: '600', fontSize: "20px" }}>04</p>
                                                                </div>
                                                            </div>
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                                <Col sm={6} md={4} className="my-2">
                                                    <Card className="text-center Card_design">
                                                        <Card.Body className="d-flex flex-row bd-highlight align-items-center">
                                                            <img src={CardImg} alt="" width="65px" />
                                                            <div className="p-1">
                                                                <Card.Title className="mb-0 Text_design"
                                                                >Homecare Stay</Card.Title>
                                                                <Card.Text id="Down_Text">
                                                                    Brisbane, South Australia
                                                                </Card.Text>
                                                            </div>
                                                            <div style={{ paddingLeft: "2rem" }}>
                                                                {/* <b><AiOutlineArrowRight className="Arrow_icon" /></b> */}
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="Card_Footer">
                                                            <div className="d-flex justify-content-around">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0 px-2 Footer_text">Educators</p>
                                                                    <p className="mb-0 px-2 Footer_textTow">04</p>
                                                                </div>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0 px-2" style={{ borderRight: "2px solid #AA0061", fontWeight: "500", fontSize: "14px" }}>Children</p>
                                                                    <p className="mb-0 px-2" style={{ color: '#151F6D', fontWeight: '600', fontSize: "20px" }}>04</p>
                                                                </div>
                                                            </div>
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                                <Col sm={6} md={4} className="my-2">
                                                    <Card className="text-center Card_design">
                                                        <Card.Body className="d-flex flex-row bd-highlight align-items-center">
                                                            <img src={CardImg} alt="" width="65px" />
                                                            <div className="p-1">
                                                                <Card.Title className="mb-0 Text_design"
                                                                >Homecare Stay</Card.Title>
                                                                <Card.Text id="Down_Text">
                                                                    Brisbane, South Australia
                                                                </Card.Text>
                                                            </div>
                                                            <div style={{ paddingLeft: "2rem" }}>
                                                                {/* <b><AiOutlineArrowRight className="Arrow_icon" /></b> */}
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="Card_Footer">
                                                            <div className="d-flex justify-content-around">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0 px-2 Footer_text">Educators</p>
                                                                    <p className="mb-0 px-2 Footer_textTow">04</p>
                                                                </div>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0 px-2" style={{ borderRight: "2px solid #AA0061", fontWeight: "500", fontSize: "14px" }}>Children</p>
                                                                    <p className="mb-0 px-2" style={{ color: '#151F6D', fontWeight: '600', fontSize: "20px" }}>04</p>
                                                                </div>
                                                            </div>
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                                <Col sm={6} md={4} className="my-2">
                                                    <Card className="text-center Card_design">
                                                        <Card.Body className="d-flex flex-row bd-highlight align-items-center">
                                                            <img src={CardImg} alt="" width="65px" />
                                                            <div className="p-1">
                                                                <Card.Title className="mb-0 Text_design"
                                                                >Homecare Stay</Card.Title>
                                                                <Card.Text id="Down_Text">
                                                                    Brisbane, South Australia
                                                                </Card.Text>
                                                            </div>
                                                            <div style={{ paddingLeft: "2rem" }}>
                                                                {/* <b><AiOutlineArrowRight className="Arrow_icon" /></b> */}
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="Card_Footer">
                                                            <div className="d-flex justify-content-around">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0 px-2 Footer_text">Educators</p>
                                                                    <p className="mb-0 px-2 Footer_textTow">04</p>
                                                                </div>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0 px-2" style={{ borderRight: "2px solid #AA0061", fontWeight: "500", fontSize: "14px" }}>Children</p>
                                                                    <p className="mb-0 px-2" style={{ color: '#151F6D', fontWeight: '600', fontSize: "20px" }}>04</p>
                                                                </div>
                                                            </div>
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                                <Col sm={6} md={4} className="my-2">
                                                    <Card className="text-center Card_design">
                                                        <Card.Body className="d-flex flex-row bd-highlight align-items-center">
                                                            <img src={CardImg} alt="" width="65px" />
                                                            <div className="p-1">
                                                                <Card.Title className="mb-0 Text_design"
                                                                >Homecare Stay</Card.Title>
                                                                <Card.Text id="Down_Text">
                                                                    Brisbane, South Australia
                                                                </Card.Text>
                                                            </div>
                                                            <div style={{ paddingLeft: "2rem" }}>
                                                                {/* <b><AiOutlineArrowRight className="Arrow_icon" /></b> */}
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="Card_Footer">
                                                            <div className="d-flex justify-content-around">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0 px-2 Footer_text">Educators</p>
                                                                    <p className="mb-0 px-2 Footer_textTow">04</p>
                                                                </div>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0 px-2" style={{ borderRight: "2px solid #AA0061", fontWeight: "500", fontSize: "14px" }}>Children</p>
                                                                    <p className="mb-0 px-2" style={{ color: '#151F6D', fontWeight: '600', fontSize: "20px" }}>04</p>
                                                                </div>
                                                            </div>
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>
            </div>
        </div>
    )
}

export default AllFranchises