import React, { useState } from 'react';
import { Container, Form, Modal, Row, Col } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import { verifyPermission } from '../helpers/roleBasedAccess';
import ToolkitProvider, { Search, } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import FileRepoShairWithme from './FileRepoShairWithme';
import FileRepodAddbyMe from './FileRepodAddbyMe';
import FilerepoUploadFile from './FilerepoUploadFile';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { axios } from 'axios';
import { BASE_URL } from '../components/App';
const loginuser = localStorage.getItem('user_role')

const FileRepository = () => {
  const User_role = localStorage.getItem('user_role');
  let ActiveLInk = User_role === "franchisor_admin" ? "/created-by-me" : "/available-Files";
  const [tabLinkPath, setTabLinkPath] = useState(ActiveLInk);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [categoryModalFlag, setCategoryModalFlag] = useState(false);

  localStorage.setItem('selected_Franchisee', (selectedFranchisee))
  const [category_name, setCategory] = useState()
  console.log("Category", category_name)

  const Submiton = async (e) => {
    e.preventDefault();
    var myHeaders = new Headers();

    myHeaders.append(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({category_name }),
      redirect: 'follow',
    };
    fetch(`${BASE_URL}/fileCategory/`, requestOptions).then((response) => {
      response.json()
    })
  }
  const handleLinkClick = event => {
    let path = event.target.getAttribute('path');
    setTabLinkPath(path);
  }
  const [SearchValue, setSearchValue] = useState();


  const HandelSearch = (event) => {
    setSearchValue(event.target.value);
  }
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
                                  {/* <SearchBar {...props.searchProps} /> */}
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
                                <Button className="done" onClick={Submiton}>
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
