import React, { useState, useEffect } from 'react';
import { Container, Form, Modal, Row, Col, Dropdown } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import { verifyPermission } from '../helpers/roleBasedAccess';
import ToolkitProvider, { Search, } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import FileRepoShairWithme from './FileRepoShairWithme';
import FileRepodAddbyMe from './FileRepodAddbyMe';
import FilerepoUploadFile from './FilerepoUploadFile';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisVertical, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../components/App';
const loginuser = localStorage.getItem('user_role')

const FileRepository = () => {
  const User_role = localStorage.getItem('user_role');
  let ActiveLInk = User_role === "franchisor_admin" ? "/created-by-me" : "/available-Files";
  const [tabLinkPath, setTabLinkPath] = useState(ActiveLInk);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [categoryModalFlag, setCategoryModalFlag] = useState(false);
  const [editcategoryModalFlag, seteditCategoryModalFlag] = useState(false);
  const [CategoryCreated, SetCategoryCreated] = useState('');
  const [CategoryNotCreated, SetCategoryNotCreated] = useState('');
  const [fileDeleteMessage, SetfileDeleteMessage] = useState('');
  const [category_name, setCategory] = useState("")
  const [category, setgetCategory] = useState([]);
  const [SearchValue, setSearchValue] = useState("");
  const [Updatecategory_name, setUpdateCategory] = useState({
    category_name: "",
    id: ""
  })

  localStorage.setItem('selected_Franchisee', (selectedFranchisee))

  const addAndSaveCategory = async () => {
    let response = await axios.post(`${BASE_URL}/fileCategory/`, { category_name: category_name }, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    });
    if (response.status === 201 && response.data.status === "success") {
      let { message } = response.data;
      SetCategoryCreated(message)
      getFileCategory();
      setCategoryModalFlag(false);
      setTimeout(() => {
        SetCategoryCreated(null)
      }, 3000)
    } else if (response.status === 200 && response.data.status === "fail") {
      let { message } = response.data;
      SetCategoryNotCreated(message)
      setCategoryModalFlag(false);
      setTimeout(() => {
        SetCategoryNotCreated(null)
      }, 3000)
    } else {
      SetCategoryNotCreated("Category creation failed")
      setTimeout(() => {
        SetCategoryNotCreated(null)
      }, 3000)
      setCategoryModalFlag(false);
    }
  }

  const Submiton = (e) => {
    e.preventDefault();
    addAndSaveCategory();
  }


  const handleLinkClick = event => {
    let path = event.target.getAttribute('path');
    setTabLinkPath(path);
  }

  const HandelSearch = (event) => {
    setSearchValue(event.target.value);
  }

  const SubEditmiton = (e) => {
    e.preventDefault();
    EditCategory();
  }
  const handleChange = (evt) => {
    setUpdateCategory({
      category_name: evt.target.value,
      id: localStorage.getItem('category_id')
    });
  }
  const EditCategory = async () => {
    let response = await axios.put(`${BASE_URL}/fileCategory/`, Updatecategory_name, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    });
    if (response.data.status === "success") {
      let { message } = response.data;
      seteditCategoryModalFlag(false);
      window.location.reload(false)
      SetCategoryCreated(message)
      getFileCategory();
      setTimeout(() => {
        SetCategoryCreated(null)
      }, 3000)

    }
    if (response.data.status === "fail") {
      let { message } = response.data;
      seteditCategoryModalFlag(false);
      SetCategoryNotCreated(message)
      getFileCategory();
      setTimeout(() => {
        SetCategoryNotCreated(null)
      }, 3000)
    }
  }

  const GetEditCategory = async (id) => {
    seteditCategoryModalFlag(true);
    let response = await axios.get(`${BASE_URL}/fileCategory/${id}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    });
    if (response.status === 200) {
      const category = response.data.category
      setUpdateCategory({
        category_name: category.category_name,
        id: category.id
      })
      localStorage.setItem('category_id', category.id)

    }
    console.log(response, "/fileCategory//fileCategory/");
  }


  const handleCategoryDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`${BASE_URL}/fileCategory?categoryId=${id}`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      if (response.status === 200) {
        let { message } = response.data;
        SetfileDeleteMessage(message)
        getFileCategory();
        setTimeout(() => {
          SetfileDeleteMessage(null)
        }, 3000)
      }
    } catch (err) {
      SetfileDeleteMessage("You don't have permission to delete this file !");
      getFileCategory();
      setTimeout(() => {
        SetfileDeleteMessage(null)
      }, 3000)
    }
  }

  const getFileCategory = async () => {
    let result = await axios.get(`${BASE_URL}/fileRepo/files-category`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        setgetCategory(res.data.category)

      })
      .catch((error) => {
        console.error(error)
      })
  };
  useEffect(() => {
    getFileCategory()
  }, [])

  return (
    <>
      {
        fileDeleteMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{fileDeleteMessage}</p>
      }
      {
        CategoryCreated && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{CategoryCreated}</p>
      }
      {
        CategoryNotCreated && <p className="alert alert-danger" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{CategoryNotCreated}</p>
      }
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
                  <div className="user-management-sec repository-sec">
                    <ToolkitProvider
                      keyField="name"
                    >
                      {(props) => (
                        <>
                          <header className="title-head">
                            <h1 className="title-lg">File Repository</h1>
                            <div className="othpanel">
                              <div className="extra-btn">
                                <div className="data-search me-3">
                                  <label for="search-bar" className="search-label">
                                    <input
                                      id="search-bar"
                                      type="text"
                                      className="form-control"
                                      placeholder="Search"
                                      value={SearchValue}
                                      onChange={HandelSearch} />
                                  </label>

                                </div>
                                <FilerepoUploadFile />
                              </div>
                            </div>
                          </header>
                          <div className="training-cat mb-3">
                            <ul>
                              {localStorage.getItem('user_role') === "franchisor_admin" ? (<>
                                {
                                  verifyPermission("file_repository", "add") &&
                                  <li><a onClick={handleLinkClick} path="/created-by-me" className={`${tabLinkPath === "/created-by-me" ? "active" : ""}`}>My Added Files</a></li>
                                }
                              </>) : (<>
                                <li><a onClick={handleLinkClick} path="/available-Files" className={`${tabLinkPath === "/available-Files" ? "active" : ""}`}>Files Shared With Me</a></li>
                                {
                                  verifyPermission("file_repository", "add") &&
                                  <li><a onClick={handleLinkClick} path="/created-by-me" className={`${tabLinkPath === "/created-by-me" ? "active" : ""}`}>My Added Files</a></li>
                                }
                              </>)}
                              <li>
                                {
                                  loginuser === "franchisor_admin" &&
                                  <div className="new_module">
                                    <div className="add_fields">
                                      <Button
                                        onClick={() => {
                                          setCategoryModalFlag(true);
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faPlus} /> Add New Category
                                      </Button>
                                    </div>
                                  </div>
                                }
                              </li>

                              <div className="custom-menu-dots">
                                <div className="file_repo_edit">
                                  {loginuser === "franchisor_admin" &&
                                    <Dropdown>
                                      <Dropdown.Toggle id="dropdown-basic">
                                        <FontAwesomeIcon icon={faEllipsisVertical} />
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        {category.map((item) => {
                                          return <Dropdown.Item>
                                            <Row>
                                              <Col md={8}>
                                                {item.category_name}
                                              </Col>
                                              <Col md={4}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                                                  <FontAwesomeIcon
                                                    icon={faPen}
                                                    onClick={(e) => { GetEditCategory(item.id) }}

                                                    style={{
                                                      color: '#455C58',
                                                      marginRight: "10px"
                                                    }}
                                                  />

                                                  <FontAwesomeIcon
                                                    icon={faTrash}
                                                    onClick={() => {
                                                      if (window.confirm("Are you sure you want to delete ?"))
                                                        handleCategoryDelete(item.id)
                                                    }}
                                                    style={{
                                                      color: '#455C58',
                                                    }}
                                                  />
                                                </div>
                                              </Col>
                                            </Row>
                                          </Dropdown.Item>
                                        })}
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  }
                                </div>
                              </div>
                            </ul>

                            <Modal
                              show={categoryModalFlag}
                              onHide={() => {
                                setCategoryModalFlag(false);
                              }}
                              size="md"
                              aria-labelledby="contained-modal-title-vcenter"
                              centered
                            >
                              <Modal.Header closeButton>
                                <Modal.Title
                                  id="contained-modal-title-vcenter"
                                  className="modal-heading"
                                >
                                  Add Category
                                </Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <div className="form-settings-content">
                                  <Row>
                                    <Col md={12}>
                                      <Form.Group>
                                        <Form.Label>Category Name</Form.Label>
                                        <Form.Control
                                          type="text"
                                          name="category_name"
                                          value={category_name}
                                          onChange={(e) => {
                                            setCategory(e.target.value);
                                          }}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </div>
                              </Modal.Body>
                              <Modal.Footer className="justify-content-center">
                                <Button
                                  className="back"
                                  onClick={() => {
                                    setCategoryModalFlag(false);
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button className="done" onClick={(e) => Submiton(e)}>
                                  Save
                                </Button>
                              </Modal.Footer>
                            </Modal>

                            <Modal
                              show={editcategoryModalFlag}
                              onHide={() => {
                                seteditCategoryModalFlag(false);
                              }}
                              size="md"
                              aria-labelledby="contained-modal-title-vcenter"
                              centered
                            >
                              <Modal.Header closeButton>
                                <Modal.Title
                                  id="contained-modal-title-vcenter"
                                  className="modal-heading"
                                >
                                  Edit Category
                                </Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <div className="form-settings-content">
                                  <Row>
                                    <Col md={12}>
                                      <Form.Group>
                                        <Form.Label>Category Name</Form.Label>
                                        <Form.Control
                                          type="text"
                                          name="category_Update"
                                          onChange={handleChange}
                                          value={Updatecategory_name.category_name}
                                        // onChange={(e) => {
                                        //   setUpdateCategory({ category_name: e.target.value });
                                        // }}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </Col>
                                  </Row>
                                </div>
                              </Modal.Body>
                              <Modal.Footer className="justify-content-center">
                                <Button
                                  className="back"
                                  onClick={() => {
                                    seteditCategoryModalFlag(false);
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button className="done" onClick={(e) => SubEditmiton(e)}>
                                  Save
                                </Button>
                              </Modal.Footer>
                            </Modal>

                          </div>
                          <div className="training-column">
                            {tabLinkPath === "/available-Files"
                              && <FileRepoShairWithme
                                selectedFranchisee={selectedFranchisee}
                                SearchValue={SearchValue}
                              />}
                            {tabLinkPath === "/created-by-me"
                              && <FileRepodAddbyMe
                                selectedFranchisee={selectedFranchisee}
                                SearchValue={SearchValue}
                                seteditCategoryModalFlag={seteditCategoryModalFlag}
                              />}
                          </div>
                        </>
                      )}
                    </ToolkitProvider>
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

export default FileRepository;
