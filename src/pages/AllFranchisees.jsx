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
import NewFranchises from './NewFranchisees';

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


const AllFranchisees = () => {

    const [filter, setFilter] = useState({
        user: '',
        location: [],
    });
    const [search,setSearch]=useState('');

    const [franchiseeData, setFranchiseeData] = useState();
    const [topSuccessMessage, setTopSuccessMessage] = useState();

    const handleCancelFilter = () => {
        setFilter({});
    };

    const handleApplyFilter = async () => {
        // const res = await axios.post(`${BASE_URL}/`)
    };

    // const onFilter = debounce(() => {
    //     fetchUserDetails();
    //   }, 200);


    const fetchFranchisees = async () => {
        let token = localStorage.getItem('token')

        let api_url = `${BASE_URL}/role/franchisee/users`;
        if (search) {
            api_url = `${BASE_URL}/role/franchisee/users?search=${search}`;
          }

        const response = await axios.get(api_url, {
            headers: {
                "Authorization": `Bearer ${token}` 
            }
        });



        if(response.status === 200 && response.data.status === "success") {
            const { franchisees } = response.data;
            setFranchiseeData(franchisees.map(franchisee => ({
                franchisee: {
                    id: franchisee.id,
                    name: franchisee.franchisee_name,
                    location: franchisee.city + ", " + franchisee.state,
                    educators: 
                        franchisee.users.filter(user => user.role === 'educator').length,
                    children: 
                        franchisee.users.filter(user => user.role === 'child').length
                },
            })));
        }
    };

    useEffect(() => {
        if(localStorage.getItem('success_msg')) {
            setTopSuccessMessage(localStorage.getItem('success_msg'));
            localStorage.removeItem('success_msg');

            setTimeout(() => {
                setTopSuccessMessage(null);
            }, 3000);
        }
    }, []);

    useEffect(() => {
        fetchFranchisees();
    }, []);

    useEffect(() => {
        fetchFranchisees();
        console.log("searched datata",search)
    }, [search]);
    
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
                                    {
                                        topSuccessMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topSuccessMessage}</p>
                                    } 
                                        <>
                                            <header className="title-head">
                                                <h1 className="title-lg">All Franchises</h1>
                                                <div className="othpanel">
                                                    <div className="extra-btn">
                                                        <div className="data-search me-3">
                                                        <label for="search-bar" className="search-label">
                                                            <input 
                                                            id="search-bar" 
                                                            type="text" 
                                                            className="form-control" 
                                                            placeholder="Search" 
                                                            value={search}
                                                            onChange={(e) => {
                                                                setSearch(e.target.value);
                                                              }}
                                                            
                                                            />
                                                        </label>



                                                        </div>

                                                        {
                                                            localStorage.getItem('user_role') === 'stanley' &&
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
                                                        </Dropdown>}
                                                        <a
                                                            href="/new-franchisees"
                                                            className="btn btn-primary me-3"
                                                        >
                                                            + Add New Franchisee
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
                                                {
                                                    franchiseeData && franchiseeData.map(data => {
                                                        return (
                                                            <Col key={data.franchisee.id} sm={6} md={4} className="my-2">
                                                                <Card className="text-center Card_design">
                                                                    <Card.Body className="d-flex flex-row bd-highlight align-items-center">
                                                                        <div className="edit-ico"><a href={`/edit-franchisees/${data.franchisee.id}`}><img src="../img/edit-ico.png" alt="" /></a></div>
                                                                        <img src={CardImg} alt="" width="65px" />
                                                                        <div className="p-1">
                                                                            <Card.Title className="mb-0 Text_design"
                                                                            >{data.franchisee.name}</Card.Title>
                                                                            <Card.Text id="Down_Text">
                                                                                {data.franchisee.location}
                                                                            </Card.Text>
                                                                        </div>
                                                                        {/*<div style={{ paddingLeft: "2rem" }}>
                                                                             <b><AiOutlineArrowRight className="Arrow_icon" /></b> 
                                                                        </div>*/}
                                                                    </Card.Body>
                                                                    <Card.Footer className="Card_Footer">
                                                                        <div className="d-flex justify-content-around">
                                                                            <div className="d-flex justify-content-between align-items-center">
                                                                                <p className="mb-0 px-2 Footer_text">Educators</p>
                                                                                <p className="mb-0 px-2 Footer_textTow">{data.franchisee.educators < 10 ? `0${data.franchisee.educators}` : data.franchisee.educators}</p>
                                                                            </div>
                                                                            <div className="d-flex justify-content-between align-items-center">
                                                                                <p className="mb-0 px-2" style={{ borderRight: "2px solid #AA0061", fontWeight: "500", fontSize: "14px" }}>Children</p>
                                                                                <p className="mb-0 px-2" style={{ color: '#151F6D', fontWeight: '600', fontSize: "20px" }}>{data.franchisee.children < 10 ? `0${data.franchisee.children}` : data.franchisee.children}</p>
                                                                            </div>
                                                                        </div>
                                                                    </Card.Footer>
                                                                </Card>
                                                            </Col>
                                                        );
                                                    })
                                                }
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

export default AllFranchisees