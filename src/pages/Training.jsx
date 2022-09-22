/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Button, Container, Form, Dropdown } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { useLocation } from 'react-router-dom';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import AvailableTrainingModule from '../pages/TrainingModule/AvailableTrainingModule';
import CompleteTrainingModule from '../pages/TrainingModule/CompleteTrainingModule';
import CreatedTrainingModule from '../pages/TrainingModule/CreatedTrainingModule';
import { verifyPermission } from '../helpers/roleBasedAccess';
import { useEffect } from "react";
import { BASE_URL } from "../components/App";
import axios from 'axios';
import { FullLoader } from "../components/Loader";
import { filter } from "lodash";

const animatedComponents = makeAnimated();

const filterCategory = [
  {
    id: 0,
    value: "alphabatical",
    label: "Alphabetical"
  },
  {
    id: 1,
    value: "due_date",
    label: "Due Date"
  }
];

const Training = () => {
  let location = useLocation();
  const [topSuccessMessage, setTopSuccessMessage] = useState(null);
  const [tabLinkPath, setTabLinkPath] = useState("/available-training");
  const [selectedFranchisee, setSelectedFranchisee] = useState("Alphabet Kids, Sydney");
  const [trainingCategory, setTrainingCategory] = useState([]);
  const [filterData, setFilterData] = useState({
    category_id: null,
    search: "",
    filter: "due_date"
  });
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);
  const [tabName, setTabName] = useState('assigned_training');

  const handleLinkClick = event => {
    let path = event.target.getAttribute('path');
    setTabLinkPath(path);
  }

  const fetchTrainingCategories = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${BASE_URL}/training/get-training-categories`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    }
    );
   console.log("Response catrogy",response)
    if(response)
      setfullLoaderStatus(false)


    if (response.status === 200 && response.data.status === "success") {
      const { categoryList } = response.data;
      setTrainingCategory([
        {
          id: 0,
          value: 'all categories',
          label: 'All Categories'
        },
        ...categoryList.map((data) => ({
          id: data.id,
          value: data.category_name,
          label: data.category_name,
        })),
      ]);

      console.log('TRAINING CATEGORY:', trainingCategory);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('success_msg')) {
      setTopSuccessMessage(localStorage.getItem('success_msg'));
      localStorage.removeItem('success_msg');
      setTimeout(() => {
        setTopSuccessMessage(null);
      }, 3000);
    }
  }, []);

  useEffect(() => {
    fetchTrainingCategories();
    if (localStorage.getItem('user_role') === 'franchisor_admin') {
      setTabLinkPath('/created-training');
    } else {
      setTabLinkPath('/available-training');
    }

    if (localStorage.getItem('active_tab')) {
      let path = localStorage.getItem('active_tab');
      console.log('PATH IS:', path);
      setTabLinkPath(path);
    }
  }, []);

  trainingCategory && console.log('FILTER DATA:', trainingCategory);
  
  useEffect(() => {
    if(localStorage.getItem('user_role') === 'guardian') {
      window.location.href=`/parents-dashboard`;
    }
  }, []);

  useEffect(() => {
    setFilterData(prevState => ({
      ...prevState,
      category_id: 0
    }));
  }, [tabName]);


  tabName && console.log('TAB NAME:', tabName);
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
                  setSelectedFranchisee={setSelectedFranchisee} />

                  {/* <FullLoader loading={fullLoaderStatus} /> */}


                <div className="entry-container">
                  <header className="title-head">
                    <h1 className="title-lg">Training</h1>
                    <div className="othpanel">
                      <div className="extra-btn">
                        <div className="data-search me-3">
                          <label for="search-bar" className="search-label">
                            <input
                              id="search-bar"
                              type="text"
                              className="form-control"
                              placeholder="Search"
                              value={filterData.search}
                              onChange={e => setFilterData(prevState => ({
                                ...prevState,
                                search: e.target.value
                              }))} />
                          </label>
                        </div>
                        {
                          localStorage.getItem('user_role') === 'stanley' &&
                          <Dropdown className="filtercol me-3">
                            <Dropdown.Toggle id="extrabtn" variant="btn-outline">
                              <i className="filter-ico"></i> Add Filters
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <header>Filter by:</header>
                              <div className="custom-radio btn-radio mb-2">
                                <label>Users:</label>
                                <Form.Group>
                                  <Form.Check
                                    inline
                                    label='Franchisee'
                                    value='franchisee'
                                    name="users"
                                    type="radio"
                                    id='one'
                                    onChange={e => setFilterData(prevState => ({
                                      ...prevState,
                                      user: e.target.value
                                    }))}
                                  />
                                </Form.Group>
                              </div>
                              <footer>
                                <Button variant="transparent" type="submit">Cancel</Button>
                                <Button variant="primary" type="submit">Apply</Button>
                              </footer>
                            </Dropdown.Menu>
                          </Dropdown>
                        }
                        {
                          verifyPermission("training_files", "add") &&
                          <a href="/new-training" className="btn btn-primary me-3">+ Add New Training</a>
                        }

                        {
                          localStorage.getItem('user_role') === 'stanley' &&
                          <Dropdown>
                            <Dropdown.Toggle id="extrabtn" className="ctaact">
                              <img src="../img/dot-ico.svg" alt="" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item href="#">Export All</Dropdown.Item>
                              <Dropdown.Item href="#">Delete All</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        }
                      </div>
                    </div>
                  </header>
                  <div className="training-cat d-md-flex align-items-center mb-3">
                    <ul>
                      <li><a onClick={handleLinkClick}  path="/available-training" className={`${tabLinkPath === "/available-training" ? "active" : ""}`}>Training To Complete</a></li>
                      <li><a onClick={handleLinkClick} path="/complete-training" className={`${tabLinkPath === "/complete-training" ? "active" : ""}`}>Completed Training</a></li>
                      {
                        verifyPermission("training_files", "add") &&
                        <li><a onClick={handleLinkClick} path="/created-training" className={`${tabLinkPath === "/created-training" ? "active" : ""}`}>Created Training</a></li>
                      }
                    </ul>
                    
                    {
                      tabName === "assigned_training" &&
                      <div className="selectdropdown ms-auto d-flex align-items-center">
                        <Form.Group className="d-flex align-items-center" style={{ zIndex: "99" }}>
                          <Form.Label className="d-block me-2">Filter by</Form.Label>
                          <Select
                            closeMenuOnSelect={true}
                            placeholder={"Select"}
                            components={animatedComponents}
                            value={filterCategory.filter(d => d.value === filterData.filter)}
                            options={filterCategory}
                            className="selectdropdown-col"
                            onChange={(e) => setFilterData(prevState => ({
                              ...prevState,
                              filter: e.value
                            }))}
                          />
                        </Form.Group>
                      </div>
                    }

                    <div className="selectdropdown ms-auto d-flex align-items-center">
                      <Form.Group className="d-flex align-items-center" style={{ zIndex: "99" }}>
                        <Form.Label className="d-block me-2">Choose Category</Form.Label>
                        <Select
                          closeMenuOnSelect={true}
                          placeholder={"Select"}
                          components={animatedComponents}
                          value={trainingCategory.filter(d => parseInt(d.id) === parseInt(filterData.category_id))}
                          options={trainingCategory}
                          className="selectdropdown-col"
                          onChange={(e) => setFilterData(prevState => ({
                            ...prevState,
                            category_id: e.id
                          }))}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  {
                    topSuccessMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topSuccessMessage}</p>
                  }
                  <div className="training-column">
                    {tabLinkPath === "/available-training"
                      && <AvailableTrainingModule
                        setTabName={setTabName}
                        filter={filterData}
                        selectedFranchisee={selectedFranchisee} />}
                    {tabLinkPath === "/complete-training"
                      && <CompleteTrainingModule
                        setTabName={setTabName}
                        filter={filterData} />}
                    {tabLinkPath === "/created-training"
                      && <CreatedTrainingModule
                        filter={filterData}
                        setTabName={setTabName}
                        selectedFranchisee={selectedFranchisee} />}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default Training;
