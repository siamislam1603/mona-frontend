import {
  faEllipsisVertical,
  faPen,
  faPlus,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import LeftNavbar from "../../components/LeftNavbar";
import TopHeader from "../../components/TopHeader";
import { BASE_URL } from "../../components/App";
import moment from "moment";

function ViewFormBuilder(props) {
  const [formData, setFormData] = useState([]);
  useEffect(() => {
    getFormData("");
  }, []);
  const getFormData = (search) => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${BASE_URL}/form?search=${search}`, requestOptions)
      .then((response) => response.json())
      .then((result) => setFormData(result?.result))
      .catch((error) => console.log("error", error));
  };

  return (
    <div id="main">
      <section className="mainsection">
        <Container>
          <div className="admin-wrapper">
            <aside className="app-sidebar">
              <LeftNavbar />
            </aside>
            <div className="sec-column">
              <TopHeader />

              <div className="forms-header-section">
                <div className="forms-managment-section">
                  <div className="forms-managment-left">
                    <h6>Forms Management</h6>
                  </div>
                  <div className="forms-managment-right">
                    <div className="forms-search">
                      <Form.Group>
                        <div className="forms-icon">
                          <img src="../img/search-icon-light.svg" alt="" />
                        </div>
                        <Form.Control
                          type="text"
                          placeholder="Search..."
                          name="search"
                          onChange={(e) => {
                            getFormData(e.target.value);
                          }}
                        />
                      </Form.Group>
                    </div>
                    <div className="forms-filter">
                      <Button variant="outline-primary">
                        <img src="../img/Vector.svg" />
                        Add Filters
                      </Button>
                    </div>
                    <div className="forms-create">
                      <Button
                        variant="primary"
                        onClick={() => {
                          console.log(
                            "props---->",
                            props.history.push("/form/add")
                          );
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        Create New Form
                      </Button>
                    </div>
                    <div className="forms-toogle">
                      <div class="custom-menu-dots">
                        <Dropdown>
                          <Dropdown.Toggle id="dropdown-basic">
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">
                              <FontAwesomeIcon icon={faPen} /> Edit
                            </Dropdown.Item>
                            <Dropdown.Item href="#/action-2">
                              <FontAwesomeIcon icon={faRemove} /> Remove
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-section">
                  <Tabs
                    defaultActiveKey="profile"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                  >
                    <Tab eventKey="home" title="Forms to be filled">
                      <div className="forms-content-section">
                        <Row>
                          {formData?.map((item) => {
                            return (
                              <Col lg={4}>
                                <div className="forms-content">
                                  <div className="content-icon-section">
                                    <img src="../img/forms-icon.svg" />
                                  </div>
                                  <div className="content-title-section">
                                    <h6>{item.form_name}</h6>
                                    <h4 className="red-date">
                                      Created on:{" "}
                                      {moment(item.createdAt).format(
                                        "MM/DD/YYYY"
                                      )}
                                    </h4>
                                  </div>

                                  <div className="content-toogle">
                                    {/* <div className="user-img">
                              <img src="../img/form-user-round.svg" />
                              <span>3</span>
                            </div> */}
                                    <Dropdown>
                                      <Dropdown.Toggle id="dropdown-basic1">
                                        <FontAwesomeIcon
                                          icon={faEllipsisVertical}
                                        />
                                      </Dropdown.Toggle>

                                      <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1">
                                          <FontAwesomeIcon icon={faPen} /> Edit
                                        </Dropdown.Item>
                                        <Dropdown.Item href="#/action-2">
                                          <FontAwesomeIcon icon={faRemove} />{" "}
                                          Remove
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </div>
                              </Col>
                            );
                          })}
                        </Row>
                      </div>
                    </Tab>
                    <Tab eventKey="profile" title="Forms I filled">
                      <div className="forms-content-section">
                        <Row>
                          {formData?.map((item) => {
                            return (
                              <Col lg={4}>
                                <div className="forms-content">
                                  <div className="content-icon-section">
                                    <img src="../img/forms-icon.svg" />
                                  </div>
                                  <div className="content-title-section">
                                    <h6>{item.form_name}</h6>
                                    <h4>
                                      Created on:{" "}
                                      {moment(item.createdAt).format(
                                        "MM/DD/YYYY"
                                      )}
                                    </h4>
                                  </div>
                                  <div className="content-toogle">
                                    <div className="user-img">
                                      <img src="../img/editIcon.svg" />
                                    </div>
                                    <Dropdown>
                                      <Dropdown.Toggle id="dropdown-basic1">
                                        <FontAwesomeIcon
                                          icon={faEllipsisVertical}
                                        />
                                      </Dropdown.Toggle>

                                      <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1">
                                          <FontAwesomeIcon icon={faPen} /> Edit
                                        </Dropdown.Item>
                                        <Dropdown.Item href="#/action-2">
                                          <FontAwesomeIcon icon={faRemove} />{" "}
                                          Remove
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </div>
                              </Col>
                            );
                          })}
                        </Row>
                      </div>
                    </Tab>
                    <Tab eventKey="contact" title="My Created Forms">
                      <div className="forms-content-section">
                        <Row>
                          {formData?.map((item) => {
                            return (
                              <Col lg={4}>
                                <div className="forms-content">
                                  <div className="content-icon-section">
                                    <img src="../img/forms-icon.svg" />
                                  </div>
                                  <div className="content-title-section">
                                    <h6>{item.form_name}</h6>
                                    <h4>
                                      Created on:{" "}
                                      {moment(item.createdAt).format(
                                        "MM/DD/YYYY"
                                      )}
                                    </h4>
                                  </div>
                                  <div className="content-toogle">
                                    <div className="user-img">
                                      <img src="../img/form-user-round.svg" />
                                      <span>3</span>
                                    </div>
                                    <Dropdown>
                                      <Dropdown.Toggle id="dropdown-basic1">
                                        <FontAwesomeIcon
                                          icon={faEllipsisVertical}
                                        />
                                      </Dropdown.Toggle>

                                      <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1">
                                          <FontAwesomeIcon icon={faPen} /> Edit
                                        </Dropdown.Item>
                                        <Dropdown.Item href="#/action-2">
                                          <FontAwesomeIcon icon={faRemove} />{" "}
                                          Remove
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </div>
                              </Col>
                            );
                          })}
                        </Row>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default ViewFormBuilder;
