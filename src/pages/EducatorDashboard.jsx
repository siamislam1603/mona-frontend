import React, { useState } from "react";
import { Button, Col, Container, Row, Form, Dropdown, DropdownButton } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link } from 'react-router-dom';
import BootstrapTable from "react-bootstrap-table-next";
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

const products = [
  {
    id: 1,
    name: "../img/user.png, James Smith",
    educator: "Ms. Shelby Goode",
  },
  {
    id: 2,
    name: "../img/user.png, James Smith",
    educator: "Ms. Shelby Goode",
  },
  {
    id: 3,
    name: "../img/user.png, James Smith",
    educator: "Ms. Shelby Goode",
  },
  {
    id: 4,
    name: "../img/user.png, James Smith",
    educator: "Ms. Shelby Goode",
  },
];
const columns = [
{
  dataField: 'name',
  text: 'Child Name',
  formatter: (cell) => {
    cell=cell.split(",");
    return (<><div className="user-list"><span className="user-pic"><img src={cell[0]} alt=''/></span><span className="user-name">{cell[1]} </span></div></>)
  },
},
{
    dataField: 'educator',
    text: 'Educator',
  },
  {
    dataField: "action",
    text: "",
    formatter: (cell) => {
      return (<><div className="cta-col">
        <Dropdown>
          <Dropdown.Toggle variant="transparent" id="ctacol">
            <img src="../img/dot-ico.svg" alt=""/>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#">Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div></>)
    },
  }
];

const EducatorDashboard = () => {
  return (
    <>
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar/>
              </aside>
              <div className="sec-column">
                <TopHeader/>
                <div className="entry-container">
                  <Row>
                    <Col md={7}>
                      <div className="maincolumn">
                        <header className="title-head mb-2 justify-content-between">
                          <h1 className="title-sm mb-0"><strong>Quick Access Links</strong></h1>
                        </header>

                      </div>
                    </Col>
                    <Col md={5}>
                      <aside className="rightcolumn">
                        <div className="training-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Training</strong></h4>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <div className="training-column">
                            <div className="item">
                              <div className="pic"><img src="../img/training-pic1.jpg" alt=""/></div>
                              <div className="fixcol">
                                <div className="icopic"><img src="../img/traning-audio-ico.png" alt=""/></div>
                                <div className="iconame">Getting and staying organized <span className="time">3 Hours</span></div>
                                <div className="cta-col">
                                  <Dropdown>
                                    <Dropdown.Toggle variant="transparent" id="ctacol">
                                      <img src="../img/dot-ico.svg" alt=""/>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item href="#">Delete</Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>
                              <hr/>
                              <div className="training-status">
                                <div className="status-col">
                                  <div className="col">
                                    <small>Status</small>
                                    <p>In Progress</p>
                                  </div>
                                  <div className="col">
                                    <small>Category</small>
                                    <p>Getting Organised</p>
                                  </div>
                                  <div className="col">
                                    <small>Label 1</small>
                                    <p>Value 1</p>
                                  </div>
                                  <div className="col">
                                    <small>Label 2</small>
                                    <p>Value 2</p>
                                  </div>
                                </div>
                                <div className="total-percentage">
                                  <div className="cprogress">
                                    <Progress type="circle" width={90} strokeWidth={9} percent={66}
                                      theme={{
                                        active: {
                                          trailColor: '#dbdbdb',
                                          color: '#AA0061'
                                        }
                                      }} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="children-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Children</strong></h4>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <div className="column-table user-management-sec">
                            <BootstrapTable
                              keyField="name"
                              data={products}
                              columns={ columns }
                            />
                          </div>
                        </div>
                      </aside>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default EducatorDashboard;
